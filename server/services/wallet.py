"""Wallet service layer – per-minute credit metering.

Manages wallet balances, top-ups (via the pluggable payment provider),
per-minute debit ticks during live sessions, and end-of-session
reconciliation.
"""

from __future__ import annotations

import math
from typing import Optional

from sqlalchemy.orm import Session as DBSession

import config
from models.billing import LedgerEntry
from models.session import Session as MentorSession
from models.user import User
from models.wallet import Wallet, WalletTransaction
from services.payments import get_provider


def _round(value: float) -> float:
    return round(float(value or 0.0), 2)


# ---------------------------------------------------------------------------
# Wallet CRUD
# ---------------------------------------------------------------------------


def get_or_create_wallet(db: DBSession, user_id: int) -> Wallet:
    """Return the user's wallet, creating one (balance=0) if it doesn't exist."""
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if wallet is None:
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet


# ---------------------------------------------------------------------------
# Top-up (charge saved card, credit wallet)
# ---------------------------------------------------------------------------


def top_up(
    db: DBSession,
    wallet: Wallet,
    amount: float,
    user: User,
    transaction_type: str = "top_up",
) -> WalletTransaction:
    """Charge the user's saved Stripe card and credit the wallet.

    Raises ``ValueError`` if the user has no payment method on file.
    Raises ``RuntimeError`` if the charge fails.
    """
    amount = _round(amount)

    customer_id = getattr(user, "stripe_customer_id", None)
    payment_method_id = getattr(user, "stripe_payment_method_id", None)
    if not payment_method_id:
        raise ValueError("No payment method on file. Please add a card first.")

    provider = get_provider()
    try:
        provider.authorize(
            amount,
            config.BILLING_CURRENCY,
            ref=f"wallet_topup:{wallet.id}",
            customer_id=customer_id,
            payment_method_id=payment_method_id,
        )
    except Exception as exc:
        raise RuntimeError(f"Charge failed: {exc}") from exc

    wallet.balance = _round(wallet.balance + amount)
    txn = WalletTransaction(
        wallet_id=wallet.id,
        type=transaction_type,
        amount=amount,
        balance_after=wallet.balance,
        description=f"Wallet {transaction_type.replace('_', ' ')} of ${amount:.2f}",
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


# ---------------------------------------------------------------------------
# Per-minute debit tick
# ---------------------------------------------------------------------------


def debit_tick(
    db: DBSession,
    wallet: Wallet,
    session: MentorSession,
    mentor: User,
    mentee: User,
) -> tuple[WalletTransaction, Optional[str]]:
    """Debit one minute's cost from the wallet.

    Returns ``(transaction, warning)`` where *warning* is ``None``,
    ``"low"`` (balance <= $1), or ``"depleted"`` (balance <= $0).
    """
    rate = _round(mentor.per_minute_rate if mentor.per_minute_rate else 0.10)
    debit_amount = min(rate, _round(wallet.balance))  # don't go negative

    # Count existing debit ticks for this session to determine tick number.
    tick_count = (
        db.query(WalletTransaction)
        .filter(
            WalletTransaction.wallet_id == wallet.id,
            WalletTransaction.session_id == session.id,
            WalletTransaction.type == "debit",
        )
        .count()
    )
    tick_number = tick_count + 1

    wallet.balance = _round(wallet.balance - debit_amount)
    txn = WalletTransaction(
        wallet_id=wallet.id,
        type="debit",
        amount=-debit_amount,
        balance_after=wallet.balance,
        session_id=session.id,
        description=f"Session {session.id} minute {tick_number} @ ${rate:.2f}/min",
    )
    db.add(txn)

    # Ledger entries – platform fee split
    fee = _round(debit_amount * config.PLATFORM_FEE_PCT)
    mentor_earning = _round(debit_amount - fee)
    db.add_all(
        [
            LedgerEntry(
                account=f"mentee:{mentee.id}",
                entry_type="charge",
                amount=-debit_amount,
                currency=config.BILLING_CURRENCY,
            ),
            LedgerEntry(
                account=f"mentor:{mentor.id}",
                entry_type="earning",
                amount=mentor_earning,
                currency=config.BILLING_CURRENCY,
            ),
            LedgerEntry(
                account="platform",
                entry_type="fee",
                amount=fee,
                currency=config.BILLING_CURRENCY,
            ),
        ]
    )

    db.commit()
    db.refresh(txn)

    # Determine warning level
    warning: Optional[str] = None
    if wallet.balance <= 0:
        warning = "depleted"
    elif wallet.balance <= 1.0:
        warning = "low"

    # Auto-reload if enabled and balance is at or below threshold
    if wallet.auto_reload_enabled and wallet.balance <= wallet.auto_reload_threshold:
        try:
            top_up(db, wallet, wallet.auto_reload_amount, mentee, transaction_type="auto_reload")
            # Re-evaluate warning after successful reload
            if wallet.balance > 1.0:
                warning = None
            elif wallet.balance > 0:
                warning = "low"
        except Exception:
            pass  # swallow auto-reload failures

    return txn, warning


# ---------------------------------------------------------------------------
# End-of-session reconciliation
# ---------------------------------------------------------------------------


def reconcile_session(
    db: DBSession,
    session: MentorSession,
    mentor: User,
    mentee: User,
) -> Optional[WalletTransaction]:
    """Reconcile actual call duration against debit ticks.

    Computes ``ceil(call_duration_seconds / 60) * rate`` and compares to the
    sum of debit transactions. Creates a ``reconciliation_debit`` or
    ``reconciliation_credit`` for the difference, or returns ``None`` if no
    adjustment is needed (diff < $0.01).
    """
    duration_seconds = session.call_duration_seconds or 0
    rate = _round(mentor.per_minute_rate if mentor.per_minute_rate else 0.10)
    expected = _round(math.ceil(duration_seconds / 60.0) * rate)

    # Sum of absolute debit amounts (stored as negative in WalletTransaction)
    debits = (
        db.query(WalletTransaction)
        .filter(
            WalletTransaction.session_id == session.id,
            WalletTransaction.type == "debit",
        )
        .all()
    )
    actual_debited = _round(sum(abs(t.amount) for t in debits))

    diff = _round(expected - actual_debited)
    if abs(diff) < 0.01:
        return None

    wallet = db.query(Wallet).filter(Wallet.user_id == session.mentee_id).first()
    if wallet is None:
        return None

    if diff > 0:
        # Under-charged: debit the shortfall
        adjust_amount = min(diff, _round(wallet.balance))  # don't go negative
        wallet.balance = _round(wallet.balance - adjust_amount)
        txn = WalletTransaction(
            wallet_id=wallet.id,
            type="reconciliation_debit",
            amount=-adjust_amount,
            balance_after=wallet.balance,
            session_id=session.id,
            description=f"Session {session.id} reconciliation debit ${adjust_amount:.2f}",
        )
    else:
        # Over-charged: credit back
        credit_amount = abs(diff)
        wallet.balance = _round(wallet.balance + credit_amount)
        txn = WalletTransaction(
            wallet_id=wallet.id,
            type="reconciliation_credit",
            amount=credit_amount,
            balance_after=wallet.balance,
            session_id=session.id,
            description=f"Session {session.id} reconciliation credit ${credit_amount:.2f}",
        )

    db.add(txn)

    # Adjusting ledger entries
    fee = _round(abs(diff) * config.PLATFORM_FEE_PCT)
    mentor_adj = _round(abs(diff) - fee)
    sign = 1.0 if diff < 0 else -1.0  # credit -> positive for mentee, negative for mentor
    db.add_all(
        [
            LedgerEntry(
                account=f"mentee:{mentee.id}",
                entry_type="charge",
                amount=_round(sign * abs(diff)),
                currency=config.BILLING_CURRENCY,
            ),
            LedgerEntry(
                account=f"mentor:{mentor.id}",
                entry_type="earning",
                amount=_round(-sign * mentor_adj),
                currency=config.BILLING_CURRENCY,
            ),
            LedgerEntry(
                account="platform",
                entry_type="fee",
                amount=_round(-sign * fee),
                currency=config.BILLING_CURRENCY,
            ),
        ]
    )

    db.commit()
    db.refresh(txn)
    return txn
