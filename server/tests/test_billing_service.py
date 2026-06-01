"""Unit tests for the billing service layer (FR-07).

Exercises the full authorize -> capture -> payout flow against an in-memory
SQLite database using the default in-process MockProvider.
"""

import config
from models.user import User
from models.session import Session as MentorSession
from models.billing import Payment, Payout, LedgerEntry
from services import billing
from services.payments import PaymentError, MockProvider, get_provider


# --- helpers ---------------------------------------------------------------


def _make_users(db, hourly_rate=100.0):
    mentor = User(
        email="mentor@test.com",
        username="mentor",
        full_name="Mentor One",
        hashed_password="x",
        role="mentor",
        hourly_rate=hourly_rate,
    )
    mentee = User(
        email="mentee@test.com",
        username="mentee",
        full_name="Mentee One",
        hashed_password="x",
        role="mentee",
    )
    db.add_all([mentor, mentee])
    db.commit()
    db.refresh(mentor)
    db.refresh(mentee)
    return mentor, mentee


def _make_session(db, mentor, mentee, price=0.0, duration=60):
    from datetime import datetime

    s = MentorSession(
        mentor_id=mentor.id,
        mentee_id=mentee.id,
        scheduled_at=datetime.utcnow(),
        duration_minutes=duration,
        topic="Test",
        price=price,
        status="upcoming",
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


# --- pure logic ------------------------------------------------------------


def test_compute_split_default_fee():
    fee, earnings = billing.compute_split(100.0)
    assert fee == 15.0
    assert earnings == 85.0
    assert round(fee + earnings, 2) == 100.0


def test_compute_split_respects_config(monkeypatch):
    monkeypatch.setattr(config, "PLATFORM_FEE_PCT", 0.20)
    fee, earnings = billing.compute_split(50.0)
    assert fee == 10.0
    assert earnings == 40.0


def test_effective_price_uses_explicit_then_rate():
    mentor = User(email="m@x.com", username="m", full_name="M", hashed_password="x", hourly_rate=120.0)
    assert billing.effective_price(40.0, mentor, 30) == 40.0  # explicit wins
    assert billing.effective_price(0.0, mentor, 30) == 60.0   # 120 * 0.5h
    assert billing.effective_price(None, mentor, 60) == 120.0


def test_provider_selection_is_mock():
    assert isinstance(get_provider(), MockProvider)


# --- lifecycle -------------------------------------------------------------


def test_authorize_creates_payment(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=0.0, duration=60)

    payment = billing.authorize_session_payment(db, s)
    assert payment is not None
    assert payment.status == "authorized"
    assert payment.amount == 100.0          # derived from hourly_rate
    assert payment.platform_fee == 15.0
    assert payment.mentor_earnings == 85.0
    assert payment.provider_auth_ref
    # session price is backfilled
    assert s.price == 100.0


def test_authorize_is_idempotent(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=50.0)
    p1 = billing.authorize_session_payment(db, s)
    p2 = billing.authorize_session_payment(db, s)
    assert p1.id == p2.id
    assert db.query(Payment).count() == 1


def test_zero_price_session_skips_payment(db):
    mentor, mentee = _make_users(db, hourly_rate=0.0)
    s = _make_session(db, mentor, mentee, price=0.0)
    assert billing.authorize_session_payment(db, s) is None
    assert db.query(Payment).count() == 0


def test_capture_posts_ledger_entries(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=100.0)
    billing.authorize_session_payment(db, s)

    captured = billing.capture_session_payment(db, s)
    assert captured.status == "captured"
    assert captured.provider_charge_ref

    entries = db.query(LedgerEntry).all()
    assert len(entries) == 3
    by_type = {e.entry_type: e.amount for e in entries}
    assert by_type["charge"] == -100.0
    assert by_type["earning"] == 85.0
    assert by_type["fee"] == 15.0


def test_capture_idempotent(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=100.0)
    billing.authorize_session_payment(db, s)
    billing.capture_session_payment(db, s)
    billing.capture_session_payment(db, s)
    # ledger posted only once
    assert db.query(LedgerEntry).count() == 3


def test_void_authorized_payment(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=100.0)
    billing.authorize_session_payment(db, s)
    voided = billing.void_session_payment(db, s)
    assert voided.status == "voided"


def test_refund_requires_capture(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=100.0)
    p = billing.authorize_session_payment(db, s)
    try:
        billing.refund_payment(db, p)
        assert False, "expected PaymentError"
    except PaymentError:
        pass


def test_refund_reverses_ledger(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=100.0)
    billing.authorize_session_payment(db, s)
    p = billing.capture_session_payment(db, s)
    billing.refund_payment(db, p)
    assert p.status == "refunded"
    # 3 capture entries + 3 reversal entries
    assert db.query(LedgerEntry).count() == 6
    net = sum(e.amount for e in db.query(LedgerEntry).all())
    assert round(net, 2) == 0.0


# --- payouts ---------------------------------------------------------------


def test_process_due_payouts_sweeps_earnings(db):
    mentor, mentee = _make_users(db)
    for _ in range(2):
        s = _make_session(db, mentor, mentee, price=100.0)
        billing.authorize_session_payment(db, s)
        billing.capture_session_payment(db, s)

    payouts = billing.process_due_payouts(db)
    assert len(payouts) == 1
    assert payouts[0].status == "paid"
    assert payouts[0].amount == 170.0   # 2 x 85
    assert payouts[0].provider_payout_ref

    # captured payments are linked to the payout
    linked = db.query(Payment).filter(Payment.payout_id == payouts[0].id).count()
    assert linked == 2


def test_process_due_payouts_idempotent(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=100.0)
    billing.authorize_session_payment(db, s)
    billing.capture_session_payment(db, s)

    first = billing.process_due_payouts(db)
    second = billing.process_due_payouts(db)
    assert len(first) == 1
    assert second == []
    assert db.query(Payout).count() == 1


# --- summaries -------------------------------------------------------------


def test_summaries(db):
    mentor, mentee = _make_users(db)
    s = _make_session(db, mentor, mentee, price=100.0)
    billing.authorize_session_payment(db, s)
    billing.capture_session_payment(db, s)

    ms = billing.mentee_summary(db, mentee.id)
    assert ms["total_spent"] == 100.0
    assert ms["captured_count"] == 1

    mts = billing.mentor_summary(db, mentor.id)
    assert mts["total_earnings"] == 85.0
    assert mts["pending_payout"] == 85.0
    assert mts["paid_out"] == 0.0

    adm = billing.admin_summary(db)
    assert adm["gmv"] == 100.0
    assert adm["fees_collected"] == 15.0
    assert adm["mentor_earnings"] == 85.0
