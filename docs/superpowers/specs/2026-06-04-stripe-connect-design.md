# Stripe Connect Payment Integration — Design Spec

**Date:** 2026-06-04
**Status:** Approved
**Scope:** Replace MockProvider with real Stripe Connect payments — mentor onboarding, mentee card collection via Stripe Elements, authorize/capture/void/refund/payout via Stripe API, webhook handling.

---

## Problem

The billing system has a complete `PaymentProvider` abstraction with authorize/capture/void/refund/payout lifecycle, double-entry ledger, and 15% fee split — but it only has a `MockProvider` that generates fake references. No real money flows. Mentees cannot enter credit cards and mentors cannot receive payouts.

## Solution

Implement `StripeProvider` behind the existing `PaymentProvider` interface using Stripe Connect (Standard accounts). Mentees save cards via Stripe Elements (embedded). Mentors onboard via Stripe's hosted onboarding. The existing billing orchestration (`billing.py`) and session lifecycle hooks remain unchanged — only the provider implementation changes.

---

## 1. Data Model — User Table Extensions

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `stripe_customer_id` | String(100) | null | Mentee's Stripe Customer ID |
| `stripe_payment_method_id` | String(100) | null | Mentee's saved default payment method |
| `stripe_account_id` | String(100) | null | Mentor's Stripe Connected Account ID |
| `stripe_account_status` | String(20) | null | pending / active / restricted |

---

## 2. StripeProvider Implementation

`server/services/payments/stripe.py` implements `PaymentProvider`:

| Method | Stripe API | Details |
|--------|-----------|---------|
| `authorize(amount, currency, ref, customer_id, payment_method_id)` | `PaymentIntent.create(amount=cents, currency, capture_method="manual", customer, payment_method, confirm=True, off_session=True)` | Returns PI ID as `auth_ref` |
| `capture(auth_ref, amount)` | `PaymentIntent.capture(auth_ref, amount_to_capture=cents)` | Returns charge ID |
| `void(auth_ref)` | `PaymentIntent.cancel(auth_ref)` | Releases hold |
| `refund(charge_ref, amount)` | `Refund.create(payment_intent=charge_ref, amount=cents)` | Returns refund ID |
| `create_payout(mentor_id, amount, currency, destination_account_id)` | `Transfer.create(amount=cents, currency, destination=account_id)` | Transfer to mentor's Connected Account |

All amounts converted: `int(amount * 100)` (dollars to cents).

### Provider Interface Change

`PaymentProvider.authorize()` signature extended with optional parameters:

```python
def authorize(self, amount, currency, ref, *, customer_id=None, payment_method_id=None) -> AuthResult
```

`PaymentProvider.create_payout()` signature extended:

```python
def create_payout(self, mentor_id, amount, currency, *, destination_account_id=None) -> PayoutResult
```

MockProvider ignores the new parameters. StripeProvider requires them.

### Provider Registration

`get_provider()` in `__init__.py` adds:
```python
elif name == "stripe":
    from .stripe import StripeProvider
    return StripeProvider()
```

Switch via: `PAYMENT_PROVIDER=stripe` in `.env`.

---

## 3. Mentor Stripe Connect Onboarding

### Flow

```
Mentor clicks "Connect Stripe"
  → POST /api/billing/stripe/connect
  → Backend: stripe.Account.create(type="standard") → save stripe_account_id
  → Backend: stripe.AccountLink.create(account, refresh_url, return_url) → onboarding_url
  → Frontend: redirect to Stripe hosted onboarding
  → Mentor completes KYC/bank on Stripe
  → Redirected back to /app/billing?stripe_connect=success
  → GET /api/billing/stripe/status → show connected status
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/billing/stripe/connect` | Mentor | Create Connected Account + return `{ onboarding_url }`. If account exists but incomplete, regenerate Account Link |
| GET | `/api/billing/stripe/status` | Mentor | Return `{ connected, account_id, status, payouts_enabled, charges_enabled }` |
| POST | `/api/billing/stripe/dashboard-link` | Mentor | Generate Stripe login link for mentor to view their Stripe dashboard |

---

## 4. Mentee Card Collection

### Flow

```
Mentee goes to Billing page (or prompted at first booking)
  → POST /api/billing/stripe/setup-intent
  → Backend: stripe.Customer.create() if no customer_id → save
  → Backend: stripe.SetupIntent.create(customer) → return { client_secret }
  → Frontend: Stripe Elements renders card form
  → Mentee enters card → stripe.confirmSetup(clientSecret)
  → Stripe returns payment_method_id
  → POST /api/billing/stripe/payment-method { payment_method_id }
  → Backend: save to user.stripe_payment_method_id
  → Card saved — future authorizations use it automatically
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/billing/stripe/setup-intent` | Mentee | Create SetupIntent, return `{ client_secret, customer_id }` |
| POST | `/api/billing/stripe/payment-method` | Mentee | Save payment_method_id to user |
| GET | `/api/billing/stripe/payment-method` | Mentee | Get saved card info `{ last4, brand, exp_month, exp_year }` |
| DELETE | `/api/billing/stripe/payment-method` | Mentee | Remove saved payment method |

### No-Card Guard

`authorize_session_payment()` checks `mentee.stripe_payment_method_id` before calling provider. If empty → 402 "Please add a payment method before booking". Frontend Request Session modal checks card status before allowing submission.

---

## 5. Billing Service Modifications

### `authorize_session_payment()`

Before calling `provider.authorize()`, read mentee's Stripe info:

```python
provider.authorize(
    amount, currency, ref,
    customer_id=mentee.stripe_customer_id,
    payment_method_id=mentee.stripe_payment_method_id,
)
```

### `process_due_payouts()`

Before calling `provider.create_payout()`, read mentor's Stripe account:

```python
provider.create_payout(
    mentor_id, total, currency,
    destination_account_id=mentor.stripe_account_id,
)
```

Skip mentors without `stripe_account_id` (log warning, leave payments unswept).

---

## 6. Webhook Handling

Replace the existing stub at `/api/billing/webhook` with real Stripe webhook processing.

Verification: `stripe.Webhook.construct_event(payload, sig_header, webhook_secret)`

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Backup confirmation — update Payment status if needed |
| `payment_intent.payment_failed` | Mark Payment as `failed`, log error |
| `charge.dispute.created` | Mark Payment as `disputed`, notify admin |
| `account.updated` | Update mentor's `stripe_account_status` and `payouts_enabled` |
| `transfer.paid` | Update Payout status to `paid` |

---

## 7. Frontend Changes

### Billing.tsx — Mentee View

Add "Payment Method" section:

**No card saved:**
- "Add a payment method to book sessions" message
- Stripe Elements `<CardElement>` embedded form
- "Save Card" button → confirmSetup → save payment_method

**Card saved:**
- "Visa ending in 4242 · Expires 12/27" display
- "Change Card" button → shows Elements form again
- "Remove" button → DELETE API call

### Billing.tsx — Mentor View

Add "Stripe Connect" section:

**Not connected:**
- "Connect your Stripe account to receive payouts" banner
- "Connect Stripe" button → POST connect → redirect

**Connected:**
- Green "Stripe Connected" badge + status
- "View Stripe Dashboard" button
- Warning if `payouts_enabled = false`

### MenteeQuestionEntry.tsx — Request Modal

Before submit, check `stripeAPI.getPaymentMethod()`:
- If no card → show yellow banner "Add a payment method first" + link to `/app/billing`
- If card exists → proceed normally

### New Package Dependencies

```
@stripe/stripe-js
@stripe/react-stripe-js
```

### New API Client (`stripeAPI` in api.ts)

```typescript
stripeAPI = {
    connect: () => POST /billing/stripe/connect
    status: () => GET /billing/stripe/status
    dashboardLink: () => POST /billing/stripe/dashboard-link
    setupIntent: () => POST /billing/stripe/setup-intent
    savePaymentMethod: (pm_id) => POST /billing/stripe/payment-method
    getPaymentMethod: () => GET /billing/stripe/payment-method
    removePaymentMethod: () => DELETE /billing/stripe/payment-method
}
```

---

## 8. Files to Create / Modify

### Backend — Create
| File | Responsibility |
|------|---------------|
| `server/services/payments/stripe.py` | StripeProvider implementing PaymentProvider |
| `server/routers/stripe_billing.py` | Stripe-specific endpoints (connect, setup-intent, payment-method, webhook) |

### Backend — Modify
| File | Change |
|------|--------|
| `server/models/user.py` | Add 4 Stripe columns |
| `server/services/payments/base.py` | Extend authorize() and create_payout() signatures |
| `server/services/payments/mock.py` | Update authorize() and create_payout() signatures |
| `server/services/payments/__init__.py` | Register "stripe" provider |
| `server/services/billing.py` | Pass Stripe info to provider in authorize and payout |
| `server/main.py` | Register stripe_billing router |
| `server/config.py` | Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PUBLISHABLE_KEY |

### Frontend — Modify
| File | Change |
|------|--------|
| `package.json` | Add @stripe/stripe-js, @stripe/react-stripe-js |
| `src/lib/api.ts` | Add stripeAPI client |
| `src/app/pages/Billing.tsx` | Mentee card management + Mentor Stripe Connect section |
| `src/app/pages/MenteeQuestionEntry.tsx` | Payment method check in request modal |

---

## 9. Configuration

```bash
# server/.env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYMENT_PROVIDER=stripe          # switch from "mock" to "stripe"
```

Stripe test mode keys work for development. Switch to live keys for production.

---

## 10. Out of Scope

- Multi-currency support (USD only for V1)
- Subscription/monthly billing model
- Invoice/receipt PDF generation
- 3D Secure extra verification (Stripe Elements handles automatically)
- Multiple saved cards per mentee (V1: one default card)
- Stripe Tax integration
- Float-to-integer-cents migration (known tech debt, separate task)
- Stripe Connect Express accounts (V1 uses Standard)
