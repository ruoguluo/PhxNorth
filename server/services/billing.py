"""Billing service layer (FR-07).

Owns the Payment/Payout/Ledger domain model and orchestrates the payment
provider. Hooked into the session lifecycle:

- booking (request accepted)  -> ``authorize_session_payment``
- completion                  -> ``capture_session_payment``
- cancellation                -> ``void_session_payment`` / ``refund_payment``

A daily scheduled job calls ``process_due_payouts`` to sweep captured,
unpaid mentor earnings into payouts.
"""

from __future__ import annotations

import threading
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session as DBSession

import config
from models.billing import LedgerEntry, Payment, Payout
from models.session import Session as MentorSession
from models.user import User
from services.payments import PaymentError, get_provider

# Serialises the payout sweep so concurrent triggers can't double-pay.
_payout_lock = threading.Lock()


def _round(value: float) -> float:
    return round(float(value or 0.0), 2)


def compute_split(amount: float) -> tuple[float, float]:
    """Return ``(platform_fee, mentor_earnings)`` for a gross ``amount``."""
    amount = _round(amount)
    fee = _round(amount * config.PLATFORM_FEE_PCT)
    earnings = _round(amount - fee)
    return fee, earnings


def effective_price(price: Optional[float], mentor: User, duration_minutes: int) -> float:
    """Resolve the price to charge.

    Uses the explicit price when present; otherwise derives it from the
    mentor's hourly rate and the session duration.
    """
    if price and price > 0:
        return _round(price)
    rate = getattr(mentor, "hourly_rate", None) or 0.0
    return _round(rate * (duration_minutes / 60.0))


# ---------------------------------------------------------------------------
# Lifecycle operations
# ---------------------------------------------------------------------------


def authorize_session_payment(
    db: DBSession, session: MentorSession, *, commit: bool = True
) -> Optional[Payment]:
    """Create an authorized Payment for a freshly booked session.

    Returns the Payment, or ``None`` if the resolved price is zero (free
    session). Raises ``PaymentError`` if the provider declines.
    """
    # Idempotency: don't authorize twice for the same session.
    existing = (
        db.query(Payment)
        .filter(Payment.session_id == session.id)
        .filter(Payment.status.in_(["authorized", "captured"]))
        .first()
    )
    if existing:
        return existing

    mentor = db.query(User).filter(User.id == session.mentor_id).first()
    amount = effective_price(session.price, mentor, session.duration_minutes)
    if amount <= 0:
        return None

    # Keep the session's stored price in sync with what we charge.
    if not session.price or session.price <= 0:
        session.price = amount

    fee, earnings = compute_split(amount)
    provider = get_provider()
    mentee = db.query(User).filter(User.id == session.mentee_id).first()
    if provider.name == "stripe" and not getattr(mentee, "stripe_payment_method_id", None):
        raise PaymentError("Mentee has no payment method. Please add a card before booking.")
    auth = provider.authorize(
        amount,
        config.BILLING_CURRENCY,
        ref=f"session:{session.id}",
        customer_id=getattr(mentee, "stripe_customer_id", None),
        payment_method_id=getattr(mentee, "stripe_payment_method_id", None),
    )

    payment = Payment(
        session_id=session.id,
        mentee_id=session.mentee_id,
        mentor_id=session.mentor_id,
        amount=amount,
        platform_fee=fee,
        mentor_earnings=earnings,
        currency=config.BILLING_CURRENCY,
        status="authorized",
        provider=provider.name,
        provider_auth_ref=auth.auth_ref,
    )
    db.add(payment)
    if commit:
        db.commit()
        db.refresh(payment)
    return payment


def capture_session_payment(
    db: DBSession, session: MentorSession, *, commit: bool = True
) -> Optional[Payment]:
    """Capture the authorized payment for a completed session and post ledger
    entries. Idempotent: returns the existing captured payment if already done.
    """
    payment = (
        db.query(Payment)
        .filter(Payment.session_id == session.id)
        .filter(Payment.status.in_(["authorized", "captured"]))
        .order_by(Payment.id.desc())
        .first()
    )
    if payment is None:
        return None
    if payment.status == "captured":
        return payment

    provider = get_provider()
    charge = provider.capture(payment.provider_auth_ref, payment.amount)
    payment.status = "captured"
    payment.provider_charge_ref = charge.charge_ref

    # Double-entry-ish ledger: mentee is debited, mentor & platform credited.
    db.add_all(
        [
            LedgerEntry(
                account=f"mentee:{payment.mentee_id}",
                entry_type="charge",
                amount=-payment.amount,
                currency=payment.currency,
                payment_id=payment.id,
            ),
            LedgerEntry(
                account=f"mentor:{payment.mentor_id}",
                entry_type="earning",
                amount=payment.mentor_earnings,
                currency=payment.currency,
                payment_id=payment.id,
            ),
            LedgerEntry(
                account="platform",
                entry_type="fee",
                amount=payment.platform_fee,
                currency=payment.currency,
                payment_id=payment.id,
            ),
        ]
    )
    if commit:
        db.commit()
        db.refresh(payment)
    return payment


def void_session_payment(
    db: DBSession, session: MentorSession, *, commit: bool = True
) -> Optional[Payment]:
    """Void an authorized-but-not-captured payment (e.g. on cancellation)."""
    payment = (
        db.query(Payment)
        .filter(Payment.session_id == session.id, Payment.status == "authorized")
        .first()
    )
    if payment is None:
        return None
    provider = get_provider()
    provider.void(payment.provider_auth_ref)
    payment.status = "voided"
    if commit:
        db.commit()
        db.refresh(payment)
    return payment


def refund_payment(db: DBSession, payment: Payment, *, commit: bool = True) -> Payment:
    """Refund a captured payment and reverse its ledger entries."""
    if payment.status != "captured":
        raise PaymentError("Only captured payments can be refunded")
    provider = get_provider()
    provider.refund(payment.provider_charge_ref, payment.amount)
    payment.status = "refunded"
    db.add_all(
        [
            LedgerEntry(
                account=f"mentee:{payment.mentee_id}",
                entry_type="charge",
                amount=payment.amount,
                currency=payment.currency,
                payment_id=payment.id,
            ),
            LedgerEntry(
                account=f"mentor:{payment.mentor_id}",
                entry_type="earning",
                amount=-payment.mentor_earnings,
                currency=payment.currency,
                payment_id=payment.id,
            ),
            LedgerEntry(
                account="platform",
                entry_type="fee",
                amount=-payment.platform_fee,
                currency=payment.currency,
                payment_id=payment.id,
            ),
        ]
    )
    if commit:
        db.commit()
        db.refresh(payment)
    return payment


# ---------------------------------------------------------------------------
# Payouts
# ---------------------------------------------------------------------------


def process_due_payouts(db: DBSession) -> list[Payout]:
    """Sweep captured, not-yet-paid earnings into one Payout per mentor.

    Idempotent: only payments with ``status == 'captured'`` and no
    ``payout_id`` are considered, and each is linked to its payout once paid,
    so re-running produces no duplicate disbursements.
    """
    payouts: list[Payout] = []
    with _payout_lock:
        unpaid = (
            db.query(Payment)
            .filter(Payment.status == "captured", Payment.payout_id.is_(None))
            .all()
        )
        if not unpaid:
            return []

        by_mentor: dict[int, list[Payment]] = {}
        for p in unpaid:
            by_mentor.setdefault(p.mentor_id, []).append(p)

        provider = get_provider()
        now = datetime.utcnow()
        for mentor_id, payments in by_mentor.items():
            total = _round(sum(p.mentor_earnings for p in payments))
            if total <= 0:
                continue
            periods = [p.created_at for p in payments if p.created_at]
            payout = Payout(
                mentor_id=mentor_id,
                amount=total,
                currency=config.BILLING_CURRENCY,
                status="pending",
                provider=provider.name,
                period_start=min(periods) if periods else None,
                period_end=now,
            )
            db.add(payout)
            db.flush()  # assign payout.id

            try:
                mentor = db.query(User).filter(User.id == mentor_id).first()
                destination = getattr(mentor, "stripe_account_id", None) if mentor else None
                if provider.name == "stripe" and not destination:
                    continue  # Skip mentors without Stripe connected accounts
                result = provider.create_payout(
                    mentor_id, total, config.BILLING_CURRENCY,
                    destination_account_id=destination,
                )
                payout.status = "paid"
                payout.provider_payout_ref = result.payout_ref
            except PaymentError:
                payout.status = "failed"
                db.commit()
                continue

            for p in payments:
                p.payout_id = payout.id
            db.add(
                LedgerEntry(
                    account=f"mentor:{mentor_id}",
                    entry_type="payout",
                    amount=-total,
                    currency=config.BILLING_CURRENCY,
                    payout_id=payout.id,
                )
            )
            db.commit()
            db.refresh(payout)
            payouts.append(payout)

    return payouts


# ---------------------------------------------------------------------------
# Summaries
# ---------------------------------------------------------------------------


def mentee_summary(db: DBSession, mentee_id: int) -> dict:
    captured = (
        db.query(Payment)
        .filter(Payment.mentee_id == mentee_id, Payment.status == "captured")
        .all()
    )
    return {
        "total_spent": _round(sum(p.amount for p in captured)),
        "captured_count": len(captured),
        "currency": config.BILLING_CURRENCY,
    }


def mentor_summary(db: DBSession, mentor_id: int) -> dict:
    captured = (
        db.query(Payment)
        .filter(Payment.mentor_id == mentor_id, Payment.status == "captured")
        .all()
    )
    pending = _round(sum(p.mentor_earnings for p in captured if p.payout_id is None))
    paid = _round(
        sum(
            po.amount
            for po in db.query(Payout)
            .filter(Payout.mentor_id == mentor_id, Payout.status == "paid")
            .all()
        )
    )
    return {
        "total_earnings": _round(sum(p.mentor_earnings for p in captured)),
        "pending_payout": pending,
        "paid_out": paid,
        "currency": config.BILLING_CURRENCY,
    }


def admin_summary(db: DBSession) -> dict:
    captured = db.query(Payment).filter(Payment.status == "captured").all()
    return {
        "gmv": _round(sum(p.amount for p in captured)),
        "fees_collected": _round(sum(p.platform_fee for p in captured)),
        "mentor_earnings": _round(sum(p.mentor_earnings for p in captured)),
        "payment_count": len(captured),
        "platform_fee_pct": config.PLATFORM_FEE_PCT,
        "currency": config.BILLING_CURRENCY,
    }
