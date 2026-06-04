# Stripe Connect Payment Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the MockProvider with real Stripe Connect payments — mentor onboarding, mentee card collection via Stripe Elements, authorize/capture/void/refund/payout via Stripe API.

**Architecture:** Implement `StripeProvider` behind the existing `PaymentProvider` interface. Extend `authorize()` and `create_payout()` signatures with optional Stripe-specific params. Add Stripe-specific router for Connect onboarding, SetupIntent, and webhook. Frontend adds Stripe Elements for card input and Connect onboarding flow.

**Tech Stack:** `stripe` Python SDK (backend), `@stripe/stripe-js` + `@stripe/react-stripe-js` (frontend), Stripe Connect Standard accounts

---

## File Structure

### Backend — Create
| File | Responsibility |
|------|---------------|
| `server/services/payments/stripe.py` | StripeProvider implementing PaymentProvider |
| `server/routers/stripe_billing.py` | Stripe-specific endpoints (connect, setup-intent, payment-method, webhook) |
| `server/tests/test_stripe_provider.py` | StripeProvider unit tests (mocked Stripe API) |

### Backend — Modify
| File | Change |
|------|--------|
| `server/models/user.py` | Add 4 Stripe columns |
| `server/services/payments/base.py` | Extend authorize() and create_payout() with optional params |
| `server/services/payments/mock.py` | Update signatures to match |
| `server/services/payments/__init__.py` | Register "stripe" provider |
| `server/services/billing.py` | Pass Stripe customer/payment_method/account to provider |
| `server/config.py` | Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PUBLISHABLE_KEY |
| `server/main.py` | Register stripe_billing router |

### Frontend — Modify
| File | Change |
|------|--------|
| `package.json` | Add @stripe/stripe-js, @stripe/react-stripe-js |
| `src/lib/api.ts` | Add stripeAPI client |
| `src/app/pages/Billing.tsx` | Mentee card management + Mentor Connect section |
| `src/app/pages/MenteeQuestionEntry.tsx` | Payment method check in request modal |

---

## Task 1: Extend User Model + Config

**Files:**
- Modify: `server/models/user.py`
- Modify: `server/config.py`

- [ ] **Step 1: Add Stripe columns to User model**

In `server/models/user.py`, add after the `allow_mentor_discovery` line:

```python
    # Stripe fields
    stripe_customer_id = Column(String(100), nullable=True)
    stripe_payment_method_id = Column(String(100), nullable=True)
    stripe_account_id = Column(String(100), nullable=True)
    stripe_account_status = Column(String(20), nullable=True)
```

- [ ] **Step 2: Add Stripe config**

In `server/config.py`, add after the `PAYMENT_PROVIDER` line:

```python
# --- Stripe (FR-07 real provider) ---
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
```

- [ ] **Step 3: Verify**

Run: `cd server && source venv/bin/activate && python -c "from models.user import User; import config; print('OK', config.STRIPE_SECRET_KEY[:4] if config.STRIPE_SECRET_KEY else 'empty')"`

- [ ] **Step 4: Commit**

```bash
git add server/models/user.py server/config.py
git commit -m "feat: add Stripe fields to User model and config"
```

---

## Task 2: Extend PaymentProvider Interface

**Files:**
- Modify: `server/services/payments/base.py`
- Modify: `server/services/payments/mock.py`

- [ ] **Step 1: Update authorize() signature in base.py**

Replace the `authorize` method in `PaymentProvider`:

```python
    @abc.abstractmethod
    def authorize(
        self,
        amount: float,
        currency: str,
        ref: str,
        *,
        customer_id: str | None = None,
        payment_method_id: str | None = None,
    ) -> AuthResult:
        """Place a hold on the mentee's funds. ``ref`` is an idempotency hint."""
```

- [ ] **Step 2: Update create_payout() signature in base.py**

Replace the `create_payout` method:

```python
    @abc.abstractmethod
    def create_payout(
        self,
        mentor_id: int,
        amount: float,
        currency: str,
        *,
        destination_account_id: str | None = None,
    ) -> PayoutResult:
        """Disburse ``amount`` to a mentor."""
```

- [ ] **Step 3: Update MockProvider signatures**

In `server/services/payments/mock.py`, update `authorize`:

```python
    def authorize(
        self,
        amount: float,
        currency: str,
        ref: str,
        *,
        customer_id: str | None = None,
        payment_method_id: str | None = None,
    ) -> AuthResult:
        if amount < 0:
            raise PaymentError("Authorization amount cannot be negative")
        return AuthResult(auth_ref=self._ref("auth"))
```

Update `create_payout`:

```python
    def create_payout(
        self,
        mentor_id: int,
        amount: float,
        currency: str,
        *,
        destination_account_id: str | None = None,
    ) -> PayoutResult:
        if amount <= 0:
            raise PaymentError("Payout amount must be positive")
        return PayoutResult(payout_ref=self._ref("po"))
```

- [ ] **Step 4: Verify existing tests still pass**

Run: `cd server && source venv/bin/activate && python -m pytest tests/ -v 2>&1 | tail -5`

- [ ] **Step 5: Commit**

```bash
git add server/services/payments/base.py server/services/payments/mock.py
git commit -m "feat: extend PaymentProvider interface with Stripe-specific optional params"
```

---

## Task 3: StripeProvider Implementation

**Files:**
- Create: `server/services/payments/stripe.py`

- [ ] **Step 1: Install stripe SDK**

Run: `cd server && source venv/bin/activate && pip install stripe`

- [ ] **Step 2: Create StripeProvider**

Create `server/services/payments/stripe.py`:

```python
"""Stripe Connect payment provider (FR-07).

Implements the PaymentProvider interface using Stripe's PaymentIntent
(authorize/capture/void), Refund, and Transfer APIs.

All amounts are converted from float dollars to integer cents for Stripe.
"""

from __future__ import annotations

import stripe

import config
from services.payments.base import (
    AuthResult,
    CaptureResult,
    PaymentError,
    PaymentProvider,
    PayoutResult,
)


def _to_cents(amount: float) -> int:
    """Convert dollar float to integer cents for Stripe."""
    return int(round(amount * 100))


class StripeProvider(PaymentProvider):
    """Real payment provider using Stripe Connect (Standard accounts)."""

    name = "stripe"

    def __init__(self) -> None:
        key = config.STRIPE_SECRET_KEY
        if not key:
            raise PaymentError("STRIPE_SECRET_KEY is not configured")
        stripe.api_key = key

    def authorize(
        self,
        amount: float,
        currency: str,
        ref: str,
        *,
        customer_id: str | None = None,
        payment_method_id: str | None = None,
    ) -> AuthResult:
        """Create a PaymentIntent with manual capture (hold funds)."""
        if amount < 0:
            raise PaymentError("Authorization amount cannot be negative")
        if not customer_id or not payment_method_id:
            raise PaymentError(
                "Stripe requires customer_id and payment_method_id for authorization"
            )
        try:
            intent = stripe.PaymentIntent.create(
                amount=_to_cents(amount),
                currency=currency.lower(),
                capture_method="manual",
                customer=customer_id,
                payment_method=payment_method_id,
                confirm=True,
                off_session=True,
                metadata={"ref": ref},
            )
            return AuthResult(auth_ref=intent.id)
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe authorization failed: {e}") from e

    def capture(self, auth_ref: str, amount: float) -> CaptureResult:
        """Capture a previously authorized PaymentIntent."""
        if not auth_ref:
            raise PaymentError("Missing authorization reference")
        try:
            intent = stripe.PaymentIntent.capture(
                auth_ref,
                amount_to_capture=_to_cents(amount),
            )
            return CaptureResult(charge_ref=intent.id)
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe capture failed: {e}") from e

    def void(self, auth_ref: str) -> None:
        """Cancel an uncaptured PaymentIntent."""
        if not auth_ref:
            raise PaymentError("Missing authorization reference")
        try:
            stripe.PaymentIntent.cancel(auth_ref)
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe void failed: {e}") from e

    def refund(self, charge_ref: str, amount: float) -> str:
        """Refund a captured payment."""
        if not charge_ref:
            raise PaymentError("Missing charge reference")
        try:
            refund = stripe.Refund.create(
                payment_intent=charge_ref,
                amount=_to_cents(amount),
            )
            return refund.id
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe refund failed: {e}") from e

    def create_payout(
        self,
        mentor_id: int,
        amount: float,
        currency: str,
        *,
        destination_account_id: str | None = None,
    ) -> PayoutResult:
        """Transfer funds to a mentor's connected Stripe account."""
        if amount <= 0:
            raise PaymentError("Payout amount must be positive")
        if not destination_account_id:
            raise PaymentError(
                f"Mentor {mentor_id} has no Stripe connected account"
            )
        try:
            transfer = stripe.Transfer.create(
                amount=_to_cents(amount),
                currency=currency.lower(),
                destination=destination_account_id,
                metadata={"mentor_id": str(mentor_id)},
            )
            return PayoutResult(payout_ref=transfer.id)
        except stripe.StripeError as e:
            raise PaymentError(f"Stripe payout failed: {e}") from e
```

- [ ] **Step 3: Register in __init__.py**

In `server/services/payments/__init__.py`, replace the `get_provider` function:

```python
def get_provider(name: str | None = None) -> PaymentProvider:
    """Return the configured payment provider instance."""
    import config

    name = (name or getattr(config, "PAYMENT_PROVIDER", "mock")).lower()
    if name == "mock":
        return MockProvider()
    elif name == "stripe":
        from .stripe import StripeProvider
        return StripeProvider()
    raise ValueError(f"Unknown payment provider: {name!r}")
```

- [ ] **Step 4: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from services.payments.stripe import StripeProvider; print('OK')"`

- [ ] **Step 5: Commit**

```bash
git add server/services/payments/stripe.py server/services/payments/__init__.py
git commit -m "feat: add StripeProvider implementing PaymentProvider interface"
```

---

## Task 4: Update Billing Service

**Files:**
- Modify: `server/services/billing.py`

- [ ] **Step 1: Update authorize_session_payment()**

In `server/services/billing.py`, find the `provider.authorize(...)` call (around line 90) and replace:

```python
    auth = provider.authorize(amount, config.BILLING_CURRENCY, ref=f"session:{session.id}")
```

with:

```python
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
```

Note: `mentee` query needs to be added — check if `User` is already imported (it is, used for `mentor` on line 79).

- [ ] **Step 2: Update process_due_payouts()**

Find the `provider.create_payout(...)` call in `process_due_payouts()` and update it to pass the mentor's Stripe account. Read the file to find the exact location, then replace the payout call with:

```python
            mentor = db.query(User).filter(User.id == mentor_id).first()
            destination = getattr(mentor, "stripe_account_id", None) if mentor else None
            if provider.name == "stripe" and not destination:
                continue  # Skip mentors without Stripe accounts
            result = provider.create_payout(
                mentor_id, total, config.BILLING_CURRENCY,
                destination_account_id=destination,
            )
```

- [ ] **Step 3: Verify tests still pass**

Run: `cd server && source venv/bin/activate && python -m pytest tests/ -v 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add server/services/billing.py
git commit -m "feat: pass Stripe customer/account info to provider in billing service"
```

---

## Task 5: Stripe Billing Router

**Files:**
- Create: `server/routers/stripe_billing.py`
- Modify: `server/main.py`

- [ ] **Step 1: Create stripe_billing router**

Create `server/routers/stripe_billing.py`:

```python
"""Stripe-specific billing endpoints: Connect onboarding, card management, webhook."""

import json
import os

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

import config
from database import get_db
from models.user import User
from utils.deps import get_current_user

router = APIRouter(prefix="/api/billing/stripe", tags=["Stripe Billing"])


# ─── Schemas ─────────────────────────────────────────────────────────


class ConnectResponse(BaseModel):
    onboarding_url: str
    account_id: str


class ConnectStatusResponse(BaseModel):
    connected: bool
    account_id: str | None = None
    status: str | None = None
    payouts_enabled: bool = False
    charges_enabled: bool = False


class SetupIntentResponse(BaseModel):
    client_secret: str
    customer_id: str


class PaymentMethodInfo(BaseModel):
    has_card: bool
    last4: str | None = None
    brand: str | None = None
    exp_month: int | None = None
    exp_year: int | None = None


class SavePaymentMethodRequest(BaseModel):
    payment_method_id: str


class PublishableKeyResponse(BaseModel):
    publishable_key: str


# ─── Publishable Key ─────────────────────────────────────────────────


@router.get("/publishable-key", response_model=PublishableKeyResponse)
def get_publishable_key():
    """Return the Stripe publishable key for frontend initialization."""
    return PublishableKeyResponse(publishable_key=config.STRIPE_PUBLISHABLE_KEY)


# ─── Mentor Connect ──────────────────────────────────────────────────


@router.post("/connect", response_model=ConnectResponse)
def create_connect_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create or resume Stripe Connect onboarding for a mentor."""
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can connect Stripe")

    stripe.api_key = config.STRIPE_SECRET_KEY

    # Create account if not exists
    if not current_user.stripe_account_id:
        account = stripe.Account.create(
            type="standard",
            email=current_user.email,
            metadata={"phxnorth_user_id": str(current_user.id)},
        )
        current_user.stripe_account_id = account.id
        current_user.stripe_account_status = "pending"
        db.commit()
    
    account_id = current_user.stripe_account_id

    # Generate onboarding link
    base_url = os.getenv("APP_BASE_URL", "http://localhost:5173")
    link = stripe.AccountLink.create(
        account=account_id,
        refresh_url=f"{base_url}/app/billing?stripe_connect=refresh",
        return_url=f"{base_url}/app/billing?stripe_connect=success",
        type="account_onboarding",
    )
    return ConnectResponse(onboarding_url=link.url, account_id=account_id)


@router.get("/status", response_model=ConnectStatusResponse)
def get_connect_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check mentor's Stripe Connect account status."""
    if not current_user.stripe_account_id:
        return ConnectStatusResponse(connected=False)

    stripe.api_key = config.STRIPE_SECRET_KEY
    try:
        account = stripe.Account.retrieve(current_user.stripe_account_id)
        # Update local status
        if account.charges_enabled and account.payouts_enabled:
            current_user.stripe_account_status = "active"
        elif account.requirements and account.requirements.get("currently_due"):
            current_user.stripe_account_status = "restricted"
        else:
            current_user.stripe_account_status = "pending"
        db.commit()

        return ConnectStatusResponse(
            connected=True,
            account_id=current_user.stripe_account_id,
            status=current_user.stripe_account_status,
            payouts_enabled=account.payouts_enabled or False,
            charges_enabled=account.charges_enabled or False,
        )
    except stripe.StripeError:
        return ConnectStatusResponse(connected=False, account_id=current_user.stripe_account_id, status="error")


@router.post("/dashboard-link")
def create_dashboard_link(
    current_user: User = Depends(get_current_user),
):
    """Generate a Stripe login link for the mentor's connected account."""
    if not current_user.stripe_account_id:
        raise HTTPException(status_code=400, detail="No Stripe account connected")
    stripe.api_key = config.STRIPE_SECRET_KEY
    try:
        link = stripe.Account.create_login_link(current_user.stripe_account_id)
        return {"url": link.url}
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Cannot create dashboard link: {e}")


# ─── Mentee Card Management ─────────────────────────────────────────


@router.post("/setup-intent", response_model=SetupIntentResponse)
def create_setup_intent(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a Stripe SetupIntent for saving a card."""
    stripe.api_key = config.STRIPE_SECRET_KEY

    # Create Stripe Customer if not exists
    if not current_user.stripe_customer_id:
        customer = stripe.Customer.create(
            email=current_user.email,
            name=current_user.full_name or current_user.username,
            metadata={"phxnorth_user_id": str(current_user.id)},
        )
        current_user.stripe_customer_id = customer.id
        db.commit()

    setup_intent = stripe.SetupIntent.create(
        customer=current_user.stripe_customer_id,
        payment_method_types=["card"],
    )
    return SetupIntentResponse(
        client_secret=setup_intent.client_secret,
        customer_id=current_user.stripe_customer_id,
    )


@router.post("/payment-method", response_model=PaymentMethodInfo)
def save_payment_method(
    data: SavePaymentMethodRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save a payment method to the user's profile."""
    stripe.api_key = config.STRIPE_SECRET_KEY

    # Attach to customer if needed
    try:
        stripe.PaymentMethod.attach(
            data.payment_method_id,
            customer=current_user.stripe_customer_id,
        )
    except stripe.StripeError:
        pass  # May already be attached

    # Set as default
    stripe.Customer.modify(
        current_user.stripe_customer_id,
        invoice_settings={"default_payment_method": data.payment_method_id},
    )

    current_user.stripe_payment_method_id = data.payment_method_id
    db.commit()

    # Return card info
    pm = stripe.PaymentMethod.retrieve(data.payment_method_id)
    card = pm.card or {}
    return PaymentMethodInfo(
        has_card=True,
        last4=card.get("last4"),
        brand=card.get("brand"),
        exp_month=card.get("exp_month"),
        exp_year=card.get("exp_year"),
    )


@router.get("/payment-method", response_model=PaymentMethodInfo)
def get_payment_method(
    current_user: User = Depends(get_current_user),
):
    """Get the user's saved payment method info."""
    if not current_user.stripe_payment_method_id:
        return PaymentMethodInfo(has_card=False)

    stripe.api_key = config.STRIPE_SECRET_KEY
    try:
        pm = stripe.PaymentMethod.retrieve(current_user.stripe_payment_method_id)
        card = pm.card or {}
        return PaymentMethodInfo(
            has_card=True,
            last4=card.get("last4"),
            brand=card.get("brand"),
            exp_month=card.get("exp_month"),
            exp_year=card.get("exp_year"),
        )
    except stripe.StripeError:
        return PaymentMethodInfo(has_card=False)


@router.delete("/payment-method", status_code=204)
def remove_payment_method(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove the user's saved payment method."""
    if current_user.stripe_payment_method_id:
        stripe.api_key = config.STRIPE_SECRET_KEY
        try:
            stripe.PaymentMethod.detach(current_user.stripe_payment_method_id)
        except stripe.StripeError:
            pass
        current_user.stripe_payment_method_id = None
        db.commit()


# ─── Stripe Webhook ──────────────────────────────────────────────────


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    stripe.api_key = config.STRIPE_SECRET_KEY

    if config.STRIPE_WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, config.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.SignatureVerificationError):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")
    else:
        # Development: no signature verification
        event = json.loads(payload)

    event_type = event.get("type", "") if isinstance(event, dict) else event.type
    data_obj = event.get("data", {}).get("object", {}) if isinstance(event, dict) else event.data.object

    if event_type == "account.updated":
        account_id = data_obj.get("id") if isinstance(data_obj, dict) else data_obj.id
        charges_enabled = data_obj.get("charges_enabled", False) if isinstance(data_obj, dict) else getattr(data_obj, "charges_enabled", False)
        payouts_enabled = data_obj.get("payouts_enabled", False) if isinstance(data_obj, dict) else getattr(data_obj, "payouts_enabled", False)
        user = db.query(User).filter(User.stripe_account_id == account_id).first()
        if user:
            if charges_enabled and payouts_enabled:
                user.stripe_account_status = "active"
            else:
                user.stripe_account_status = "restricted"
            db.commit()

    elif event_type == "payment_intent.payment_failed":
        from models.billing import Payment
        pi_id = data_obj.get("id") if isinstance(data_obj, dict) else data_obj.id
        payment = db.query(Payment).filter(Payment.provider_auth_ref == pi_id).first()
        if payment:
            payment.status = "failed"
            db.commit()

    return {"received": True}
```

- [ ] **Step 2: Register router in main.py**

In `server/main.py`, add to the router import:

```python
from routers import auth, profile, mentorship, admin, messages, billing, conversations, timeline, credentials, consulting, workshops, video, stripe_billing
```

Add:
```python
app.include_router(stripe_billing.router)
```

- [ ] **Step 3: Install stripe SDK**

Run: `cd server && source venv/bin/activate && pip install stripe`

- [ ] **Step 4: Verify**

Run: `cd server && source venv/bin/activate && python -c "from routers.stripe_billing import router; print('OK')"`
Run: `cd server && source venv/bin/activate && python -c "from main import app; print('routes:', len(app.routes))"`

- [ ] **Step 5: Commit**

```bash
git add server/routers/stripe_billing.py server/main.py
git commit -m "feat: add Stripe billing router (connect, setup-intent, payment-method, webhook)"
```

---

## Task 6: Frontend — Install Stripe + Add stripeAPI

**Files:**
- Modify: `package.json` (via npm)
- Modify: `src/lib/api.ts`

- [ ] **Step 1: Install Stripe packages**

Run: `npm install @stripe/stripe-js @stripe/react-stripe-js`

- [ ] **Step 2: Add stripeAPI to api.ts**

Add after the `videoAPI` object in `src/lib/api.ts`:

```typescript
// ─── Stripe API ─────────────────────────────────────────────────────

export interface StripeConnectStatus {
    connected: boolean;
    account_id?: string;
    status?: string;
    payouts_enabled: boolean;
    charges_enabled: boolean;
}

export interface StripePaymentMethod {
    has_card: boolean;
    last4?: string;
    brand?: string;
    exp_month?: number;
    exp_year?: number;
}

export const stripeAPI = {
    getPublishableKey: () =>
        fetchAPI<{ publishable_key: string }>("/billing/stripe/publishable-key"),

    // Mentor Connect
    connect: () =>
        fetchAPI<{ onboarding_url: string; account_id: string }>("/billing/stripe/connect", { method: "POST" }),

    getStatus: () =>
        fetchAPI<StripeConnectStatus>("/billing/stripe/status"),

    getDashboardLink: () =>
        fetchAPI<{ url: string }>("/billing/stripe/dashboard-link", { method: "POST" }),

    // Mentee cards
    createSetupIntent: () =>
        fetchAPI<{ client_secret: string; customer_id: string }>("/billing/stripe/setup-intent", { method: "POST" }),

    savePaymentMethod: (paymentMethodId: string) =>
        fetchAPI<StripePaymentMethod>("/billing/stripe/payment-method", {
            method: "POST",
            body: JSON.stringify({ payment_method_id: paymentMethodId }),
        }),

    getPaymentMethod: () =>
        fetchAPI<StripePaymentMethod>("/billing/stripe/payment-method"),

    removePaymentMethod: () =>
        fetch(`${API_BASE}/billing/stripe/payment-method`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Remove failed"); }),
};
```

- [ ] **Step 3: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/api.ts
git commit -m "feat: install Stripe JS SDK, add stripeAPI client"
```

---

## Task 7: Frontend — Billing Page (Mentor Connect + Mentee Card)

**Files:**
- Modify: `src/app/pages/Billing.tsx`

- [ ] **Step 1: Read the existing Billing.tsx**

Read the file to understand the current structure. It has role-aware views for mentee/mentor/admin.

- [ ] **Step 2: Add Stripe imports**

Add at the top:
```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeAPI, type StripePaymentMethod, type StripeConnectStatus } from '../../lib/api';
```

- [ ] **Step 3: Add Mentor Stripe Connect section**

In the mentor view, add a "Stripe Connect" card BEFORE the earnings summary. It should:
- On mount, call `stripeAPI.getStatus()` to check connection status
- If not connected: show "Connect your Stripe account to receive payouts" + blue "Connect Stripe" button
- Button calls `stripeAPI.connect()` then `window.location.href = onboarding_url`
- If connected with `status === 'active'`: show green "Stripe Connected" badge + "View Dashboard" button
- If connected but `payouts_enabled === false`: show yellow warning "Complete your Stripe setup"

- [ ] **Step 4: Add Mentee Card Management section**

In the mentee view, add a "Payment Method" card BEFORE the payment history. It should:
- On mount, call `stripeAPI.getPaymentMethod()` to check if card exists
- If no card: show Stripe Elements `<CardElement>` inside `<Elements>` provider
  - Initialize Stripe: `loadStripe(publishableKey)` (get key from `stripeAPI.getPublishableKey()`)
  - "Save Card" button: `stripeAPI.createSetupIntent()` → `stripe.confirmCardSetup(clientSecret, { payment_method: { card: elements.getElement(CardElement) } })` → `stripeAPI.savePaymentMethod(paymentMethodId)`
- If card exists: show "Visa ending in 4242 · Expires 12/27" + "Change Card" + "Remove" buttons

- [ ] **Step 5: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/Billing.tsx
git commit -m "feat: add Stripe Connect onboarding and card management to Billing page"
```

---

## Task 8: Frontend — Payment Method Check in Request Modal

**Files:**
- Modify: `src/app/pages/MenteeQuestionEntry.tsx`

- [ ] **Step 1: Add payment method check**

In `MenteeQuestionEntry.tsx`, find the `submitRequest` function. Before the API call, add a check:

```typescript
// Check payment method if session has a price
if (requestModal.mentor.hourlyRate > 0) {
    try {
        const pm = await stripeAPI.getPaymentMethod();
        if (!pm.has_card) {
            setRequestError('Please add a payment method before booking. Go to Billing page to add a card.');
            setRequestStatus('error');
            return;
        }
    } catch {
        // If Stripe check fails (e.g., mock mode), proceed anyway
    }
}
```

Add `stripeAPI` to the imports from `../../lib/api`.

- [ ] **Step 2: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/MenteeQuestionEntry.tsx
git commit -m "feat: add payment method check before session booking"
```

---

## Task 9: Backend Tests + Final Verification

**Files:**
- Create: `server/tests/test_stripe_provider.py`

- [ ] **Step 1: Create StripeProvider unit tests**

Create `server/tests/test_stripe_provider.py`:

```python
"""Unit tests for StripeProvider (mocked Stripe API)."""

from unittest.mock import patch, MagicMock

import pytest

# Must set config before importing provider
import os
os.environ["STRIPE_SECRET_KEY"] = "sk_test_fake"

from services.payments.stripe import StripeProvider, _to_cents
from services.payments.base import PaymentError


def test_to_cents():
    assert _to_cents(10.00) == 1000
    assert _to_cents(0.50) == 50
    assert _to_cents(99.99) == 9999
    assert _to_cents(0) == 0


def test_authorize_requires_customer():
    provider = StripeProvider()
    with pytest.raises(PaymentError, match="customer_id"):
        provider.authorize(100.0, "usd", "ref1")


def test_authorize_requires_payment_method():
    provider = StripeProvider()
    with pytest.raises(PaymentError, match="customer_id"):
        provider.authorize(100.0, "usd", "ref1", customer_id="cus_123")


@patch("services.payments.stripe.stripe")
def test_authorize_success(mock_stripe):
    mock_stripe.PaymentIntent.create.return_value = MagicMock(id="pi_abc123")
    provider = StripeProvider()
    result = provider.authorize(
        50.0, "usd", "session:1",
        customer_id="cus_123", payment_method_id="pm_456",
    )
    assert result.auth_ref == "pi_abc123"
    mock_stripe.PaymentIntent.create.assert_called_once()
    call_kwargs = mock_stripe.PaymentIntent.create.call_args[1]
    assert call_kwargs["amount"] == 5000
    assert call_kwargs["capture_method"] == "manual"


@patch("services.payments.stripe.stripe")
def test_capture_success(mock_stripe):
    mock_stripe.PaymentIntent.capture.return_value = MagicMock(id="pi_abc123")
    provider = StripeProvider()
    result = provider.capture("pi_abc123", 50.0)
    assert result.charge_ref == "pi_abc123"


@patch("services.payments.stripe.stripe")
def test_void_success(mock_stripe):
    provider = StripeProvider()
    provider.void("pi_abc123")
    mock_stripe.PaymentIntent.cancel.assert_called_once_with("pi_abc123")


@patch("services.payments.stripe.stripe")
def test_refund_success(mock_stripe):
    mock_stripe.Refund.create.return_value = MagicMock(id="re_xyz789")
    provider = StripeProvider()
    ref = provider.refund("pi_abc123", 25.0)
    assert ref == "re_xyz789"


def test_payout_requires_destination():
    provider = StripeProvider()
    with pytest.raises(PaymentError, match="no Stripe connected account"):
        provider.create_payout(1, 100.0, "usd")


@patch("services.payments.stripe.stripe")
def test_payout_success(mock_stripe):
    mock_stripe.Transfer.create.return_value = MagicMock(id="tr_pay123")
    provider = StripeProvider()
    result = provider.create_payout(1, 100.0, "usd", destination_account_id="acct_abc")
    assert result.payout_ref == "tr_pay123"
```

- [ ] **Step 2: Run all tests**

Run: `cd server && source venv/bin/activate && python -m pytest tests/ -v`
Expected: All tests pass (existing 46 + new Stripe tests).

- [ ] **Step 3: Run frontend build**

Run: `npx vite build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add server/tests/test_stripe_provider.py
git commit -m "test: add StripeProvider unit tests with mocked Stripe API"
```

---

## Task 10: Environment Setup + Documentation

- [ ] **Step 1: Update .env with Stripe keys**

Add to `server/.env` (user must provide their own keys):
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
# Switch to Stripe (keep "mock" for development without keys)
# PAYMENT_PROVIDER=stripe
```

- [ ] **Step 2: Final manual test**

1. Set `PAYMENT_PROVIDER=mock` (default) — verify existing flow still works
2. Set `PAYMENT_PROVIDER=stripe` with test keys — verify:
   - Mentor can click "Connect Stripe" and get redirected to Stripe onboarding
   - Mentee can add a test card (4242424242424242) via Stripe Elements
   - Session booking authorizes the card
   - Session completion captures the payment
   - Admin can trigger payout run

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: Stripe Connect integration complete — environment setup"
```
