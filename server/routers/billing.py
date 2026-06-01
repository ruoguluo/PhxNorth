"""Billing API (FR-07).

Role-scoped endpoints over payments and payouts, plus an admin-triggered
payout sweep and a webhook stub for a future real provider.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.billing import Payment, Payout
from models.user import User
from schemas.billing import PaymentResponse, PayoutResponse, PayoutRunResponse
from services import billing
from utils.deps import get_current_user, require_admin

router = APIRouter(prefix="/api/billing", tags=["Billing"])


@router.get("/payments", response_model=list[PaymentResponse])
def list_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List payments scoped to the caller's role.

    - mentee: their own charges
    - mentor: payments where they are the payee
    - admin: all payments
    """
    q = db.query(Payment)
    if current_user.role == "admin":
        pass
    elif current_user.role == "mentor":
        q = q.filter(Payment.mentor_id == current_user.id)
    else:
        q = q.filter(Payment.mentee_id == current_user.id)
    return q.order_by(Payment.id.desc()).all()


@router.get("/payments/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if current_user.role != "admin" and current_user.id not in (
        payment.mentee_id,
        payment.mentor_id,
    ):
        raise HTTPException(status_code=403, detail="Not authorized")
    return payment


@router.get("/summary")
def billing_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Role-specific billing summary."""
    if current_user.role == "admin":
        return billing.admin_summary(db)
    if current_user.role == "mentor":
        return billing.mentor_summary(db, current_user.id)
    return billing.mentee_summary(db, current_user.id)


@router.get("/payouts", response_model=list[PayoutResponse])
def list_payouts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Payout)
    if current_user.role == "admin":
        pass
    elif current_user.role == "mentor":
        q = q.filter(Payout.mentor_id == current_user.id)
    else:
        raise HTTPException(status_code=403, detail="Not authorized")
    return q.order_by(Payout.id.desc()).all()


@router.post("/payouts/run", response_model=PayoutRunResponse)
def run_payouts(
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Manually trigger the payout sweep (also runs daily on a schedule)."""
    payouts = billing.process_due_payouts(db)
    return PayoutRunResponse(
        payouts_created=len(payouts),
        total_disbursed=round(sum(p.amount for p in payouts), 2),
        payouts=payouts,
    )


@router.post("/webhook")
def provider_webhook(payload: dict):
    """Stub endpoint for a future real payment provider's webhooks."""
    # A real provider integration would verify the signature and update
    # payment/payout status here.
    return {"received": True, "event": payload.get("type")}
