"""Wallet API – balance, top-ups, auto-reload settings, debit ticks, and
transaction history.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.session import Session as MentorSession
from models.wallet import WalletTransaction
from schemas.wallet import (
    AutoReloadSettingsRequest,
    DebitTickRequest,
    DebitTickResponse,
    TopUpRequest,
    WalletResponse,
    WalletTransactionResponse,
)
from services import wallet as wallet_service
from utils.deps import get_current_user

router = APIRouter(prefix="/api/wallet", tags=["Wallet"])


@router.get("", response_model=WalletResponse)
def get_wallet(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the caller's wallet, creating one if it doesn't exist."""
    wallet = wallet_service.get_or_create_wallet(db, current_user.id)
    return wallet


@router.post("/top-up", response_model=WalletTransactionResponse)
def top_up_wallet(
    body: TopUpRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Charge the user's saved card and credit their wallet."""
    wallet = wallet_service.get_or_create_wallet(db, current_user.id)
    try:
        txn = wallet_service.top_up(db, wallet, body.amount, current_user)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)
        )
    return txn


@router.put("/auto-reload", response_model=WalletResponse)
def update_auto_reload(
    body: AutoReloadSettingsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update auto-reload settings for the caller's wallet."""
    wallet = wallet_service.get_or_create_wallet(db, current_user.id)
    wallet.auto_reload_enabled = body.enabled
    wallet.auto_reload_threshold = body.threshold
    wallet.auto_reload_amount = body.amount
    db.commit()
    db.refresh(wallet)
    return wallet


@router.post("/debit-tick", response_model=DebitTickResponse)
def debit_tick(
    body: DebitTickRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Debit one minute's cost from the caller's wallet for an active session."""
    session = db.query(MentorSession).filter(MentorSession.id == body.session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session not found"
        )
    if session.mentee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the mentee may debit for a session",
        )
    if session.status != "in_progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session is not in progress",
        )

    mentor = db.query(User).filter(User.id == session.mentor_id).first()
    wallet = wallet_service.get_or_create_wallet(db, current_user.id)
    txn, warning = wallet_service.debit_tick(db, wallet, session, mentor, current_user)
    return DebitTickResponse(balance=wallet.balance, warning=warning)


@router.get("/transactions", response_model=list[WalletTransactionResponse])
def list_transactions(
    session_id: int | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List wallet transactions, optionally filtered by session."""
    wallet = wallet_service.get_or_create_wallet(db, current_user.id)
    q = db.query(WalletTransaction).filter(WalletTransaction.wallet_id == wallet.id)
    if session_id is not None:
        q = q.filter(WalletTransaction.session_id == session_id)
    return q.order_by(WalletTransaction.id.desc()).limit(limit).all()
