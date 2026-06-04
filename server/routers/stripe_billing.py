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
