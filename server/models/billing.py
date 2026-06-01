"""Billing models (FR-07): payments, payouts, and a simple ledger.

Design notes
------------
- Per-session pricing. A ``Payment`` is created when a session is booked
  (authorize) and captured when the session is completed.
- ``mentor_earnings = amount - platform_fee``; the platform fee fraction is
  configurable via ``config.PLATFORM_FEE_PCT``.
- ``LedgerEntry`` records every money movement (charge, fee, earning, payout)
  so balances are auditable. Amounts are signed from the account's
  perspective.
- All money is stored as floats for parity with the existing demo schema
  (``Session.price`` etc.). A real system would use integer minor units.
"""

from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from database import Base


class Payment(Base):
    """A charge against a mentee for a single mentorship session."""

    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    amount = Column(Float, nullable=False, default=0.0)
    platform_fee = Column(Float, nullable=False, default=0.0)
    mentor_earnings = Column(Float, nullable=False, default=0.0)
    currency = Column(String(8), nullable=False, default="USD")

    # authorized -> captured -> (refunded) ; or authorized -> voided ; failed
    status = Column(String(20), nullable=False, default="authorized", index=True)

    provider = Column(String(40), nullable=False, default="mock")
    provider_auth_ref = Column(String(120), nullable=True)
    provider_charge_ref = Column(String(120), nullable=True)

    # Set once this payment's earnings have been swept into a payout.
    payout_id = Column(Integer, ForeignKey("payouts.id"), nullable=True, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Payout(Base):
    """A disbursement of accumulated earnings to a mentor."""

    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False, default=0.0)
    currency = Column(String(8), nullable=False, default="USD")
    # pending -> paid ; or failed
    status = Column(String(20), nullable=False, default="pending", index=True)
    provider = Column(String(40), nullable=False, default="mock")
    provider_payout_ref = Column(String(120), nullable=True)
    period_start = Column(DateTime, nullable=True)
    period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LedgerEntry(Base):
    """An auditable, signed money movement tied to a payment or payout."""

    __tablename__ = "ledger_entries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # e.g. "platform", "mentor:<id>", "mentee:<id>"
    account = Column(String(60), nullable=False, index=True)
    entry_type = Column(String(20), nullable=False)  # charge, fee, earning, payout
    amount = Column(Float, nullable=False, default=0.0)  # signed
    currency = Column(String(8), nullable=False, default="USD")
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=True, index=True)
    payout_id = Column(Integer, ForeignKey("payouts.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
