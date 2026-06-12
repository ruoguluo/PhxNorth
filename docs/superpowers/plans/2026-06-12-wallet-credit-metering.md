# Wallet & Per-Minute Credit Metering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a prepaid wallet system for mentees with per-minute billing during video calls, including low-balance warnings, forced disconnect, and mid-call top-up.

**Architecture:** Frontend-driven 60-second timer calls a backend debit endpoint during calls. Backend is source of truth for wallet balance. Post-call reconciliation corrects any discrepancies using Daily.co webhook data.

**Tech Stack:** Python/FastAPI (backend), SQLAlchemy/SQLite (models), React/TypeScript (frontend), Stripe (card charging), Daily.co (video calls, custom app messages for mentor notifications)

**Spec:** `docs/superpowers/specs/2026-06-12-wallet-credit-metering-design.md`

---

## File Structure

### New Files (Backend)
- `server/models/wallet.py` — Wallet and WalletTransaction SQLAlchemy models
- `server/schemas/wallet.py` — Pydantic request/response schemas for wallet endpoints
- `server/routers/wallet.py` — Wallet API router (GET balance, POST top-up, PUT auto-reload, POST debit-tick, GET transactions)
- `server/services/wallet.py` — Wallet business logic (top-up, debit, auto-reload, reconciliation)

### Modified Files (Backend)
- `server/models/user.py` — Add `per_minute_rate` column
- `server/main.py` — Import wallet model, mount wallet router
- `server/routers/video.py` — Add wallet balance guard on room creation
- `server/routers/mentorship.py` — Add reconciliation call on session complete
- `server/seed.py` — Seed wallets for mentee accounts, set `per_minute_rate` on mentors

### New Files (Frontend)
- (none — all changes go in existing files)

### Modified Files (Frontend)
- `src/lib/api.ts` — Add `walletAPI` client with types
- `src/app/pages/Billing.tsx` — Add wallet card section (balance, top-up, auto-reload settings, transaction history)
- `src/app/pages/VideoCall.tsx` — Add billing loop, warning modals, mid-call top-up, countdown timer, Daily app-message for mentor notification
- `src/app/pages/SessionDetail.tsx` — Add pre-join balance check modal
- `src/app/pages/MentorCalendar.tsx` — Add pre-join balance check modal

---

## Task 1: Wallet & WalletTransaction Models

**Files:**
- Create: `server/models/wallet.py`
- Modify: `server/main.py:10-15` (add model import)
- Modify: `server/models/user.py:57` (add per_minute_rate)

- [ ] **Step 1: Create wallet model file**

Create `server/models/wallet.py`:

```python
from datetime import datetime

from sqlalchemy import (
    Column, Integer, Float, String, Boolean, DateTime, ForeignKey, Text
)
from database import Base


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    balance = Column(Float, default=0.0, nullable=False)
    auto_reload_enabled = Column(Boolean, default=False)
    auto_reload_threshold = Column(Float, default=5.0)
    auto_reload_amount = Column(Float, default=20.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"), nullable=False, index=True)
    type = Column(String(30), nullable=False)  # top_up, debit, auto_reload, reconciliation_debit, reconciliation_credit
    amount = Column(Float, nullable=False)  # positive for top-ups, negative for debits
    balance_after = Column(Float, nullable=False)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

- [ ] **Step 2: Add per_minute_rate to User model**

In `server/models/user.py`, add after line 57 (`disc_scores_json`):

```python
    # Per-minute session rate for mentors (default $0.10)
    per_minute_rate = Column(Float, nullable=True, default=0.10)
```

- [ ] **Step 3: Register wallet models in main.py**

In `server/main.py`, add to the model imports (after the existing noqa imports around line 10-15):

```python
import models.wallet  # noqa: F401
```

- [ ] **Step 4: Delete the old SQLite database and reseed to pick up schema changes**

```bash
cd server && rm -f phxnorth.db && . venv/bin/activate && python3 seed.py
```

Expected: `✅ Database seeded successfully!`

- [ ] **Step 5: Commit**

```bash
git add server/models/wallet.py server/models/user.py server/main.py
git commit -m "feat(models): add Wallet, WalletTransaction models and per_minute_rate on User"
```

---

## Task 2: Wallet Pydantic Schemas

**Files:**
- Create: `server/schemas/wallet.py`

- [ ] **Step 1: Create wallet schemas**

Create `server/schemas/wallet.py`:

```python
from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


# --- Responses ---

class WalletResponse(BaseModel):
    id: int
    user_id: int
    balance: float
    auto_reload_enabled: bool
    auto_reload_threshold: float
    auto_reload_amount: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class WalletTransactionResponse(BaseModel):
    id: int
    wallet_id: int
    type: str
    amount: float
    balance_after: float
    session_id: Optional[int] = None
    description: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class DebitTickResponse(BaseModel):
    balance: float
    warning: Optional[str] = None  # null, "low", "depleted"


# --- Requests ---

class TopUpRequest(BaseModel):
    amount: float = Field(gt=0, description="Amount in USD to add to wallet")


class AutoReloadSettingsRequest(BaseModel):
    enabled: bool
    threshold: float = Field(gt=0, description="Balance threshold to trigger reload")
    amount: float = Field(gt=0, description="Amount to charge on reload")


class DebitTickRequest(BaseModel):
    session_id: int
```

- [ ] **Step 2: Commit**

```bash
git add server/schemas/wallet.py
git commit -m "feat(schemas): add Pydantic schemas for wallet endpoints"
```

---

## Task 3: Wallet Service Layer

**Files:**
- Create: `server/services/wallet.py`

- [ ] **Step 1: Create wallet service**

Create `server/services/wallet.py`:

```python
"""Wallet business logic: top-up, debit, auto-reload, reconciliation."""

from __future__ import annotations

import math
from typing import Optional

from sqlalchemy.orm import Session as DBSession

import config
from models.billing import LedgerEntry, Payment
from models.session import Session as MentorSession
from models.user import User
from models.wallet import Wallet, WalletTransaction
from services.payments import get_provider


def get_or_create_wallet(db: DBSession, user_id: int) -> Wallet:
    """Get a user's wallet, creating one if it doesn't exist."""
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if wallet is None:
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet


def top_up(
    db: DBSession,
    wallet: Wallet,
    amount: float,
    user: User,
    *,
    transaction_type: str = "top_up",
) -> WalletTransaction:
    """Charge the user's saved card and credit their wallet.

    Args:
        db: Database session.
        wallet: The wallet to credit.
        amount: USD amount to add.
        user: The wallet owner (must have a saved Stripe card).
        transaction_type: 'top_up' or 'auto_reload'.

    Returns:
        The created WalletTransaction.

    Raises:
        ValueError: If the user has no saved payment method.
        RuntimeError: If the card charge fails.
    """
    if not user.stripe_customer_id or not user.stripe_payment_method_id:
        raise ValueError("No payment method on file. Please save a card first.")

    provider = get_provider()
    try:
        provider.authorize(
            amount=amount,
            currency=config.BILLING_CURRENCY,
            customer_id=user.stripe_customer_id,
            payment_method_id=user.stripe_payment_method_id,
        )
    except Exception as e:
        raise RuntimeError(f"Card charge failed: {e}") from e

    wallet.balance += amount
    txn = WalletTransaction(
        wallet_id=wallet.id,
        type=transaction_type,
        amount=amount,
        balance_after=wallet.balance,
        description=f"{'Auto-reload' if transaction_type == 'auto_reload' else 'Manual top-up'}: +${amount:.2f}",
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


def debit_tick(
    db: DBSession,
    wallet: Wallet,
    session: MentorSession,
    mentor: User,
    mentee: User,
) -> tuple[WalletTransaction, Optional[str]]:
    """Debit one minute's cost from the wallet.

    Returns:
        Tuple of (transaction, warning) where warning is None, "low", or "depleted".
    """
    rate = mentor.per_minute_rate or 0.10
    debit_amount = min(rate, wallet.balance)  # Don't go negative

    if debit_amount <= 0:
        # Already depleted — return depleted warning without creating a transaction
        return _make_zero_txn(db, wallet, session), "depleted"

    # Debit wallet
    wallet.balance = max(0.0, wallet.balance - rate)

    # Record wallet transaction
    tick_number = (
        db.query(WalletTransaction)
        .filter(
            WalletTransaction.wallet_id == wallet.id,
            WalletTransaction.session_id == session.id,
            WalletTransaction.type == "debit",
        )
        .count()
        + 1
    )

    txn = WalletTransaction(
        wallet_id=wallet.id,
        type="debit",
        amount=-debit_amount,
        balance_after=wallet.balance,
        session_id=session.id,
        description=f"Minute {tick_number} of session #{session.id}",
    )
    db.add(txn)

    # Create ledger entries (same split as existing billing)
    fee = round(debit_amount * config.PLATFORM_FEE_PCT, 2)
    earnings = round(debit_amount - fee, 2)

    db.add_all([
        LedgerEntry(
            account=f"mentee:{mentee.id}",
            entry_type="charge",
            amount=-debit_amount,
            currency=config.BILLING_CURRENCY,
        ),
        LedgerEntry(
            account=f"mentor:{mentor.id}",
            entry_type="earning",
            amount=earnings,
            currency=config.BILLING_CURRENCY,
        ),
        LedgerEntry(
            account="platform",
            entry_type="fee",
            amount=fee,
            currency=config.BILLING_CURRENCY,
        ),
    ])

    db.commit()
    db.refresh(txn)

    # Attempt auto-reload if enabled and below threshold
    if wallet.auto_reload_enabled and wallet.balance <= wallet.auto_reload_threshold:
        try:
            top_up(db, wallet, wallet.auto_reload_amount, mentee, transaction_type="auto_reload")
        except Exception:
            pass  # Auto-reload failed — continue with warning

    # Determine warning level
    warning: Optional[str] = None
    if wallet.balance <= 0:
        warning = "depleted"
    elif wallet.balance <= 1.0:
        warning = "low"

    return txn, warning


def _make_zero_txn(db: DBSession, wallet: Wallet, session: MentorSession) -> WalletTransaction:
    """Create a zero-amount transaction to record the depleted state."""
    txn = WalletTransaction(
        wallet_id=wallet.id,
        type="debit",
        amount=0.0,
        balance_after=0.0,
        session_id=session.id,
        description=f"Debit skipped — wallet depleted (session #{session.id})",
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


def reconcile_session(
    db: DBSession,
    session: MentorSession,
    mentor: User,
    mentee: User,
) -> Optional[WalletTransaction]:
    """Reconcile wallet debits against actual call duration.

    Called after a session ends (via complete endpoint or Daily webhook).
    Compares actual billable minutes against sum of debit transactions.

    Returns:
        Adjusting WalletTransaction if needed, else None.
    """
    if not session.call_duration_seconds:
        return None

    rate = mentor.per_minute_rate or 0.10
    billable_minutes = math.ceil(session.call_duration_seconds / 60)
    expected_total = round(billable_minutes * rate, 2)

    wallet = get_or_create_wallet(db, mentee.id)

    # Sum all debits for this session
    debits = (
        db.query(WalletTransaction)
        .filter(
            WalletTransaction.wallet_id == wallet.id,
            WalletTransaction.session_id == session.id,
            WalletTransaction.type == "debit",
        )
        .all()
    )
    actual_total = round(abs(sum(t.amount for t in debits)), 2)

    diff = round(expected_total - actual_total, 2)

    if abs(diff) < 0.01:
        return None  # No adjustment needed

    if diff > 0:
        # Under-charged: debit the difference (but don't go below 0)
        debit_amount = min(diff, wallet.balance)
        wallet.balance = max(0.0, wallet.balance - debit_amount)
        txn = WalletTransaction(
            wallet_id=wallet.id,
            type="reconciliation_debit",
            amount=-debit_amount,
            balance_after=wallet.balance,
            session_id=session.id,
            description=f"Reconciliation: billed {actual_total:.2f}, expected {expected_total:.2f}",
        )
    else:
        # Over-charged: credit the difference
        credit_amount = abs(diff)
        wallet.balance += credit_amount
        txn = WalletTransaction(
            wallet_id=wallet.id,
            type="reconciliation_credit",
            amount=credit_amount,
            balance_after=wallet.balance,
            session_id=session.id,
            description=f"Reconciliation refund: billed {actual_total:.2f}, expected {expected_total:.2f}",
        )

    db.add(txn)

    # Adjust ledger entries for the difference
    if diff > 0:
        fee = round(debit_amount * config.PLATFORM_FEE_PCT, 2)
        earnings = round(debit_amount - fee, 2)
        db.add_all([
            LedgerEntry(account=f"mentee:{mentee.id}", entry_type="charge", amount=-debit_amount, currency=config.BILLING_CURRENCY),
            LedgerEntry(account=f"mentor:{mentor.id}", entry_type="earning", amount=earnings, currency=config.BILLING_CURRENCY),
            LedgerEntry(account="platform", entry_type="fee", amount=fee, currency=config.BILLING_CURRENCY),
        ])
    else:
        credit_amount = abs(diff)
        fee = round(credit_amount * config.PLATFORM_FEE_PCT, 2)
        earnings = round(credit_amount - fee, 2)
        db.add_all([
            LedgerEntry(account=f"mentee:{mentee.id}", entry_type="charge", amount=credit_amount, currency=config.BILLING_CURRENCY),
            LedgerEntry(account=f"mentor:{mentor.id}", entry_type="earning", amount=-earnings, currency=config.BILLING_CURRENCY),
            LedgerEntry(account="platform", entry_type="fee", amount=-fee, currency=config.BILLING_CURRENCY),
        ])

    db.commit()
    db.refresh(txn)
    return txn
```

- [ ] **Step 2: Commit**

```bash
git add server/services/wallet.py
git commit -m "feat(services): add wallet service with top-up, debit-tick, auto-reload, reconciliation"
```

---

## Task 4: Wallet Router

**Files:**
- Create: `server/routers/wallet.py`
- Modify: `server/main.py:8,66` (import and mount router)

- [ ] **Step 1: Create wallet router**

Create `server/routers/wallet.py`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
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
    """Get the current user's wallet balance and settings."""
    w = wallet_service.get_or_create_wallet(db, current_user.id)
    return w


@router.post("/top-up", response_model=WalletTransactionResponse)
def top_up(
    req: TopUpRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Manually top up the wallet by charging the saved card."""
    w = wallet_service.get_or_create_wallet(db, current_user.id)
    try:
        txn = wallet_service.top_up(db, w, req.amount, current_user)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=str(e))
    return txn


@router.put("/auto-reload", response_model=WalletResponse)
def update_auto_reload(
    req: AutoReloadSettingsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update auto-reload settings."""
    w = wallet_service.get_or_create_wallet(db, current_user.id)
    w.auto_reload_enabled = req.enabled
    w.auto_reload_threshold = req.threshold
    w.auto_reload_amount = req.amount
    db.commit()
    db.refresh(w)
    return w


@router.post("/debit-tick", response_model=DebitTickResponse)
def debit_tick(
    req: DebitTickRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Debit one minute of call time from the wallet. Called every 60s by the frontend."""
    # Load session and verify participants
    session = db.query(MentorSession).filter(MentorSession.id == req.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the mentee can trigger billing")
    if session.status != "in_progress":
        raise HTTPException(status_code=400, detail="Session is not in progress")

    mentor = db.query(User).filter(User.id == session.mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    w = wallet_service.get_or_create_wallet(db, current_user.id)
    txn, warning = wallet_service.debit_tick(db, w, session, mentor, current_user)

    return DebitTickResponse(balance=w.balance, warning=warning)


@router.get("/transactions", response_model=list[WalletTransactionResponse])
def list_transactions(
    session_id: int | None = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List wallet transactions, optionally filtered by session."""
    w = wallet_service.get_or_create_wallet(db, current_user.id)
    query = (
        db.query(WalletTransaction)
        .filter(WalletTransaction.wallet_id == w.id)
        .order_by(WalletTransaction.created_at.desc())
    )
    if session_id is not None:
        query = query.filter(WalletTransaction.session_id == session_id)
    return query.limit(limit).all()
```

- [ ] **Step 2: Mount wallet router in main.py**

In `server/main.py`, add to the import on line 8:

```python
from routers import auth, profile, mentorship, admin, messages, billing, conversations, timeline, credentials, consulting, workshops, video, stripe_billing, wallet
```

Add after line 66 (`stripe_billing.router`):

```python
    app.include_router(wallet.router)
```

- [ ] **Step 3: Verify the server starts**

```bash
cd server && . venv/bin/activate && rm -f phxnorth.db && python3 seed.py && python3 -m uvicorn main:app --host 0.0.0.0 --port 8081 &
sleep 3
curl -s http://localhost:8081/docs | head -5
```

Expected: HTML response from FastAPI docs page (server started without import errors).

Kill the test server after verifying.

- [ ] **Step 4: Commit**

```bash
git add server/routers/wallet.py server/main.py
git commit -m "feat(api): add wallet router with top-up, debit-tick, auto-reload, transactions endpoints"
```

---

## Task 5: Video Call Join Guard & Session Reconciliation

**Files:**
- Modify: `server/routers/video.py:44-100` (add balance guard)
- Modify: `server/routers/mentorship.py` (add reconciliation on complete)

- [ ] **Step 1: Add wallet balance guard to room creation**

In `server/routers/video.py`, add imports at the top:

```python
from services.wallet import get_or_create_wallet
```

Inside `create_or_get_session_room`, after the participant verification check but before room creation, add:

```python
    # Wallet balance guard for mentees
    if current_user.id == session.mentee_id:
        mentor = db.query(User).filter(User.id == session.mentor_id).first()
        min_rate = (mentor.per_minute_rate if mentor and mentor.per_minute_rate else 0.10)
        wallet = get_or_create_wallet(db, current_user.id)
        if wallet.balance < min_rate:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Insufficient wallet balance. You need at least ${min_rate:.2f} to join. Current balance: ${wallet.balance:.2f}",
            )
```

- [ ] **Step 2: Add reconciliation to session completion**

In `server/routers/mentorship.py`, add import at the top:

```python
from services.wallet import reconcile_session
```

Inside the session complete endpoint (around line 342-351), after `billing.capture_session_payment(db, session)`, add:

```python
    # Reconcile wallet-based per-minute billing
    mentor = db.query(User).filter(User.id == session.mentor_id).first()
    mentee = db.query(User).filter(User.id == session.mentee_id).first()
    if mentor and mentee:
        reconcile_session(db, session, mentor, mentee)
```

- [ ] **Step 3: Commit**

```bash
git add server/routers/video.py server/routers/mentorship.py
git commit -m "feat(api): add wallet balance guard on join and reconciliation on session complete"
```

---

## Task 6: Seed Wallets and Per-Minute Rates

**Files:**
- Modify: `server/seed.py`

- [ ] **Step 1: Add wallet imports and seed data**

In `server/seed.py`, add to imports:

```python
from models.wallet import Wallet
```

After the users are created and flushed (around line 196), add per_minute_rate to the mentor objects. Find the three mentor creation blocks and add `per_minute_rate=0.10` to each.

After all users are flushed, add wallet seeding:

```python
    # --- Wallets (for mentees) ---
    mentee_users = db.query(User).filter(User.role == "mentee").all()
    wallets = []
    for mu in mentee_users:
        wallets.append(Wallet(user_id=mu.id, balance=10.0))  # $10 starting credit
    db.add_all(wallets)
    db.flush()
    print(f"   - {len(wallets)} mentee wallets (each with $10.00 starting balance)")
```

- [ ] **Step 2: Reseed and verify**

```bash
cd server && . venv/bin/activate && rm -f phxnorth.db && python3 seed.py
```

Expected: Output includes the wallets line.

- [ ] **Step 3: Commit**

```bash
git add server/seed.py
git commit -m "feat(seed): seed mentee wallets with $10 starting balance and mentor per_minute_rate"
```

---

## Task 7: Frontend Wallet API Client

**Files:**
- Modify: `src/lib/api.ts`

- [ ] **Step 1: Add wallet types and API client**

In `src/lib/api.ts`, before the final `export { fetchAPI }` line (line 724), add:

```typescript
// ─── Wallet API ─────────────────────────────────────────────────────

export interface WalletInfo {
    id: number;
    user_id: number;
    balance: number;
    auto_reload_enabled: boolean;
    auto_reload_threshold: number;
    auto_reload_amount: number;
    created_at?: string;
    updated_at?: string;
}

export interface WalletTransactionInfo {
    id: number;
    wallet_id: number;
    type: string;
    amount: number;
    balance_after: number;
    session_id?: number | null;
    description?: string | null;
    created_at?: string;
}

export interface DebitTickResult {
    balance: number;
    warning: "low" | "depleted" | null;
}

export const walletAPI = {
    get: () => fetchAPI<WalletInfo>("/wallet"),

    topUp: (amount: number) =>
        fetchAPI<WalletTransactionInfo>("/wallet/top-up", {
            method: "POST",
            body: JSON.stringify({ amount }),
        }),

    updateAutoReload: (settings: { enabled: boolean; threshold: number; amount: number }) =>
        fetchAPI<WalletInfo>("/wallet/auto-reload", {
            method: "PUT",
            body: JSON.stringify(settings),
        }),

    debitTick: (sessionId: number) =>
        fetchAPI<DebitTickResult>("/wallet/debit-tick", {
            method: "POST",
            body: JSON.stringify({ session_id: sessionId }),
        }),

    transactions: (sessionId?: number) => {
        const qs = sessionId ? `?session_id=${sessionId}` : "";
        return fetchAPI<WalletTransactionInfo[]>(`/wallet/transactions${qs}`);
    },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat(frontend): add walletAPI client with types"
```

---

## Task 8: Wallet Section on Billing Page

**Files:**
- Modify: `src/app/pages/Billing.tsx`

- [ ] **Step 1: Add wallet imports and state**

In `src/app/pages/Billing.tsx`, add to the imports from `api.ts`:

```typescript
import { walletAPI, WalletInfo, WalletTransactionInfo } from '@/lib/api';
```

Inside the `Billing` component, add wallet state alongside the existing state declarations (around line 129-145):

```typescript
  // Wallet (mentee)
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [walletTxns, setWalletTxns] = useState<WalletTransactionInfo[]>([]);
  const [topUpAmount, setTopUpAmount] = useState<number>(10);
  const [toppingUp, setToppingUp] = useState(false);
  const [savingReload, setSavingReload] = useState(false);
  const [reloadEnabled, setReloadEnabled] = useState(false);
  const [reloadThreshold, setReloadThreshold] = useState(5);
  const [reloadAmount, setReloadAmount] = useState(20);
```

- [ ] **Step 2: Add wallet data loading**

In the `load()` function (around line 149), add wallet loading for mentees:

```typescript
    // Load wallet for mentees
    if (role === 'mentee') {
      try {
        const w = await walletAPI.get();
        setWallet(w);
        setReloadEnabled(w.auto_reload_enabled);
        setReloadThreshold(w.auto_reload_threshold);
        setReloadAmount(w.auto_reload_amount);
        const txns = await walletAPI.transactions();
        setWalletTxns(txns);
      } catch {
        // Wallet may not exist yet
      }
    }
```

- [ ] **Step 3: Add wallet action handlers**

After the existing handler functions (around line 244), add:

```typescript
  async function handleTopUp() {
    setToppingUp(true);
    try {
      await walletAPI.topUp(topUpAmount);
      const w = await walletAPI.get();
      setWallet(w);
      const txns = await walletAPI.transactions();
      setWalletTxns(txns);
      setNotice(`Added $${topUpAmount.toFixed(2)} to your wallet.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Top-up failed');
    } finally {
      setToppingUp(false);
    }
  }

  async function handleSaveAutoReload() {
    setSavingReload(true);
    try {
      const w = await walletAPI.updateAutoReload({
        enabled: reloadEnabled,
        threshold: reloadThreshold,
        amount: reloadAmount,
      });
      setWallet(w);
      setNotice('Auto-reload settings saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSavingReload(false);
    }
  }
```

- [ ] **Step 4: Add wallet UI section**

In the JSX, add a Wallet card section for mentees. Place it before the existing Summary Cards section (around line 362). Insert this block inside the `{role === 'mentee' && ...}` area or add a new conditional:

```tsx
      {/* Wallet Section (mentee only) */}
      {role === 'mentee' && wallet && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Wallet</h2>

          {/* Balance + Top Up */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">${wallet.balance.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Available credit</p>
            </div>
            <div className="flex items-center gap-2">
              {[5, 10, 20].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    topUpAmount === amt
                      ? 'border-[#0A2463] bg-[#0A2463] text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  ${amt}
                </button>
              ))}
              <input
                type="number"
                min={1}
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleTopUp}
                disabled={toppingUp || topUpAmount <= 0}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                {toppingUp ? 'Adding…' : 'Top Up'}
              </button>
            </div>
          </div>

          {/* Auto-Reload Settings */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={reloadEnabled}
                  onChange={(e) => setReloadEnabled(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Auto-reload
              </label>
              {reloadEnabled && (
                <span className="text-sm text-gray-500">
                  Add ${reloadAmount} when balance drops below ${reloadThreshold}
                </span>
              )}
            </div>
            {reloadEnabled && (
              <div className="flex items-center gap-3 mb-3">
                <label className="text-sm text-gray-600">
                  Threshold: $
                  <input
                    type="number"
                    min={1}
                    value={reloadThreshold}
                    onChange={(e) => setReloadThreshold(Number(e.target.value))}
                    className="w-16 ml-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Amount: $
                  <input
                    type="number"
                    min={1}
                    value={reloadAmount}
                    onChange={(e) => setReloadAmount(Number(e.target.value))}
                    className="w-16 ml-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </label>
                <button
                  onClick={handleSaveAutoReload}
                  disabled={savingReload}
                  className="px-3 py-1 bg-[#0A2463] text-white rounded text-sm hover:bg-[#0A2463]/90 disabled:opacity-50"
                >
                  {savingReload ? 'Saving…' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {/* Transaction History */}
          {walletTxns.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Transactions</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {walletTxns.slice(0, 20).map((txn) => (
                  <div key={txn.id} className="flex justify-between text-sm py-1">
                    <span className="text-gray-600">{txn.description || txn.type}</span>
                    <span className={txn.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                      {txn.amount >= 0 ? '+' : ''}{txn.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/Billing.tsx
git commit -m "feat(frontend): add wallet section to billing page with top-up, auto-reload, and transaction history"
```

---

## Task 9: Pre-Join Balance Check

**Files:**
- Modify: `src/app/pages/SessionDetail.tsx`
- Modify: `src/app/pages/MentorCalendar.tsx`

- [ ] **Step 1: Add pre-join gate to SessionDetail.tsx**

In `src/app/pages/SessionDetail.tsx`, add imports:

```typescript
import { walletAPI } from '@/lib/api';
```

Add state near the top of the component:

```typescript
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [requiredRate, setRequiredRate] = useState(0.10);
  const [topUpAmount, setTopUpAmount] = useState(10);
  const [toppingUp, setToppingUp] = useState(false);
  const [topUpError, setTopUpError] = useState<string | null>(null);
```

Replace the "Join Video Call" button's `onClick` (which currently navigates directly) with a balance check:

```typescript
  async function handleJoinSession(sessionId: number) {
    if (user?.role === 'mentee') {
      try {
        const w = await walletAPI.get();
        setWalletBalance(w.balance);
        // requiredRate comes from the session's mentor; use 0.10 as fallback
        if (w.balance < requiredRate) {
          setShowTopUpModal(true);
          return;
        }
      } catch {
        // If wallet check fails, let them attempt to join (server will guard)
      }
    }
    navigate(`/app/session/${sessionId}/call`);
  }

  async function handlePreJoinTopUp() {
    setToppingUp(true);
    setTopUpError(null);
    try {
      await walletAPI.topUp(topUpAmount);
      const w = await walletAPI.get();
      setWalletBalance(w.balance);
      if (w.balance >= requiredRate) {
        setShowTopUpModal(false);
        // Navigate after successful top-up
        navigate(`/app/session/${selectedSession}/call`);
      }
    } catch (e) {
      setTopUpError(e instanceof Error ? e.message : 'Top-up failed');
    } finally {
      setToppingUp(false);
    }
  }
```

Update the "Join Video Call" button to use `handleJoinSession(session.id)` instead of direct navigation.

Add the top-up modal JSX (render it at the end of the component, before the closing fragment):

```tsx
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Insufficient Credit</h3>
            <p className="text-sm text-gray-600">
              You need at least ${requiredRate.toFixed(2)} to join this session.
              Your balance: ${walletBalance?.toFixed(2) ?? '0.00'}
            </p>
            <div className="flex items-center gap-2">
              {[5, 10, 20].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    topUpAmount === amt
                      ? 'border-[#0A2463] bg-[#0A2463] text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            {topUpError && <p className="text-sm text-red-600">{topUpError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handlePreJoinTopUp}
                disabled={toppingUp}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                {toppingUp ? 'Adding…' : `Top Up $${topUpAmount}`}
              </button>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
```

- [ ] **Step 2: Add same pre-join gate to MentorCalendar.tsx**

Apply the same pattern in `src/app/pages/MentorCalendar.tsx`. Add the same imports, state, handler functions, and modal. Replace the "Join Session" button's `onClick` with `handleJoinSession(appointment.id)`.

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/SessionDetail.tsx src/app/pages/MentorCalendar.tsx
git commit -m "feat(frontend): add pre-join wallet balance check with top-up modal"
```

---

## Task 10: In-Call Billing Loop, Warnings & Mid-Call Top-Up

**Files:**
- Modify: `src/app/pages/VideoCall.tsx`

- [ ] **Step 1: Add imports and billing state**

In `src/app/pages/VideoCall.tsx`, add imports:

```typescript
import { walletAPI } from '@/lib/api';
```

Add billing state near the existing state declarations:

```typescript
  // Wallet billing state
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [billingWarning, setBillingWarning] = useState<'low' | 'depleted' | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null); // seconds remaining
  const [topUpAmount, setTopUpAmount] = useState(10);
  const [toppingUp, setToppingUp] = useState(false);
  const [topUpError, setTopUpError] = useState<string | null>(null);
  const billingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
```

- [ ] **Step 2: Add the 60-second billing loop**

Add a `useEffect` after the existing duration timer effect:

```typescript
  // Billing loop: debit every 60 seconds
  useEffect(() => {
    if (joinState !== 'joined' || !sessionId || user?.role !== 'mentee') return;

    // Initial balance fetch
    walletAPI.get().then(w => setWalletBalance(w.balance)).catch(() => {});

    billingIntervalRef.current = setInterval(async () => {
      try {
        const result = await walletAPI.debitTick(sessionId);
        setWalletBalance(result.balance);

        if (result.warning && result.warning !== billingWarning) {
          setBillingWarning(result.warning);
          setShowWarningModal(true);

          // Notify mentor via Daily app message
          if (callObject) {
            callObject.sendAppMessage({
              type: 'credit-warning',
              level: result.warning,
            });
          }

          // Start 3-minute countdown on depleted
          if (result.warning === 'depleted' && countdown === null) {
            setCountdown(180);
          }
        } else if (!result.warning) {
          // Balance recovered (e.g. after mid-call top-up)
          if (billingWarning) {
            setBillingWarning(null);
            setShowWarningModal(false);
            setCountdown(null);
            if (callObject) {
              callObject.sendAppMessage({ type: 'credit-warning', level: 'resolved' });
            }
          }
        }
      } catch {
        // Debit tick failed — will retry next tick
      }
    }, 60_000);

    return () => {
      if (billingIntervalRef.current) clearInterval(billingIntervalRef.current);
    };
  }, [joinState, sessionId, user?.role, callObject]);
```

- [ ] **Step 3: Add the 3-minute countdown effect**

```typescript
  // Countdown timer: ticks every second when depleted
  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (countdown === 0) {
        // Force end call
        callObject?.leave().catch(() => {});
        if (sessionId) {
          videoAPI.endSessionCall(sessionId).catch(() => {});
        }
        navigate(`/app/session/${sessionId}`);
      }
      return;
    }

    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev !== null && prev > 0) ? prev - 1 : 0);
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [countdown !== null && countdown > 0]);
```

- [ ] **Step 4: Add mentor-side app-message listener**

```typescript
  // Mentor: listen for credit warnings from mentee
  useEffect(() => {
    if (!callObject || user?.role !== 'mentor') return;

    const handleAppMessage = (evt: any) => {
      if (evt?.data?.type === 'credit-warning') {
        const level = evt.data.level;
        if (level === 'resolved') {
          setBillingWarning(null);
          setShowWarningModal(false);
          setCountdown(null);
        } else {
          setBillingWarning(level);
          setShowWarningModal(true);
          if (level === 'depleted') {
            setCountdown(180);
          }
        }
      }
    };

    callObject.on('app-message', handleAppMessage);
    return () => { callObject.off('app-message', handleAppMessage); };
  }, [callObject, user?.role]);
```

- [ ] **Step 5: Add mid-call top-up handler**

```typescript
  async function handleMidCallTopUp() {
    setToppingUp(true);
    setTopUpError(null);
    try {
      await walletAPI.topUp(topUpAmount);
      const w = await walletAPI.get();
      setWalletBalance(w.balance);
      // Clear warnings — the next debit-tick will confirm
      setBillingWarning(null);
      setShowWarningModal(false);
      setCountdown(null);
      if (callObject) {
        callObject.sendAppMessage({ type: 'credit-warning', level: 'resolved' });
      }
    } catch (e) {
      setTopUpError(e instanceof Error ? e.message : 'Top-up failed');
    } finally {
      setToppingUp(false);
    }
  }
```

- [ ] **Step 6: Add balance pill to the call UI**

In the active call JSX, add a balance pill near the duration timer (in the top bar area):

```tsx
        {/* Balance pill (mentee only) */}
        {user?.role === 'mentee' && walletBalance !== null && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            walletBalance <= 1 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            Credit: ${walletBalance.toFixed(2)}
          </span>
        )}
```

- [ ] **Step 7: Add warning modal JSX**

Add the warning modal at the end of the component JSX:

```tsx
      {/* Credit warning modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 space-y-4">
            {billingWarning === 'depleted' ? (
              <>
                <h3 className="text-lg font-semibold text-red-600">Credit Depleted</h3>
                {user?.role === 'mentee' ? (
                  <p className="text-sm text-gray-600">
                    Your credit has been depleted. The call will end in{' '}
                    <span className="font-bold text-red-600">
                      {Math.floor((countdown ?? 0) / 60)}:{String((countdown ?? 0) % 60).padStart(2, '0')}
                    </span>{' '}
                    unless you add credit.
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Your mentee's credit has been depleted. The call will end in{' '}
                    <span className="font-bold text-red-600">
                      {Math.floor((countdown ?? 0) / 60)}:{String((countdown ?? 0) % 60).padStart(2, '0')}
                    </span>.
                  </p>
                )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-amber-600">Credit Running Low</h3>
                {user?.role === 'mentee' ? (
                  <p className="text-sm text-gray-600">
                    Your credit is running low (${walletBalance?.toFixed(2)} remaining,
                    ~{Math.floor((walletBalance ?? 0) / 0.10)} minutes).
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Your mentee's credit is running low. The call may end soon.
                  </p>
                )}
              </>
            )}

            {/* Top-up controls (mentee only) */}
            {user?.role === 'mentee' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {[5, 10, 20].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`px-3 py-1.5 rounded-lg text-sm border ${
                        topUpAmount === amt
                          ? 'border-[#0A2463] bg-[#0A2463] text-white'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                {topUpError && <p className="text-sm text-red-600">{topUpError}</p>}
                <button
                  onClick={handleMidCallTopUp}
                  disabled={toppingUp}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  {toppingUp ? 'Adding…' : `Top Up $${topUpAmount}`}
                </button>
              </div>
            )}

            {/* Dismiss (only for low warning, not depleted) */}
            {billingWarning === 'low' && (
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/pages/VideoCall.tsx
git commit -m "feat(frontend): add in-call billing loop, balance display, warning modals, countdown, and mid-call top-up"
```

---

## Task 11: End-to-End Smoke Test

**Files:** (none — manual verification)

- [ ] **Step 1: Reseed and start services**

```bash
cd /Users/apple/Projects/PhxNorth
cd server && rm -f phxnorth.db && . venv/bin/activate && python3 seed.py
cd ..
make dev-all
```

- [ ] **Step 2: Verify wallet endpoint works**

```bash
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"chen.mentee@phxnorth.com","password":"mentee123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# Get wallet
curl -s http://localhost:8081/api/wallet -H "Authorization: Bearer $TOKEN"
# Expected: {"id":...,"balance":10.0,"auto_reload_enabled":false,...}

# Top up
curl -s -X POST http://localhost:8081/api/wallet/top-up \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5.0}'
# Expected: transaction with balance_after=15.0

# Get transactions
curl -s http://localhost:8081/api/wallet/transactions -H "Authorization: Bearer $TOKEN"
# Expected: list with the top-up transaction
```

- [ ] **Step 3: Verify billing page shows wallet**

Open `http://localhost:5173/app/billing` logged in as a mentee. Verify:
- Wallet card shows with balance
- Top-up buttons work
- Auto-reload settings toggle works
- Transaction history displays

- [ ] **Step 4: Verify pre-join gate**

Set a mentee's wallet balance to $0 (manually via API or by not seeding). Try clicking "Join Session". Verify the insufficient credit modal appears.

- [ ] **Step 5: Commit any fixes from smoke testing**

```bash
git add -A
git commit -m "fix: smoke test corrections for wallet credit metering"
```
