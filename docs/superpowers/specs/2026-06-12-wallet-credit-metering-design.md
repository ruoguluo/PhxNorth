# Wallet & Per-Minute Credit Metering for Video Calls

**Date:** 2026-06-12
**Status:** Approved

## Summary

Mentees must deposit credit into a wallet before joining a 1-on-1 mentorship video call. Each minute of the call costs the mentor's per-minute rate (default $0.10/min). Credit is deducted every minute during the call, with low-balance warnings and a forced disconnect when credit is exhausted. Workshops are unaffected.

## Requirements

1. Mentees cannot join a video call without sufficient wallet balance (at least one minute's worth).
2. Each mentor sets their own per-minute rate (default $0.10).
3. Credit is deducted from the mentee's wallet every 60 seconds during a call.
4. When balance drops to $1.00 or below, both parties see a warning modal.
5. When balance hits $0, both parties see a second warning with a visible 3-minute countdown. The call ends automatically when the countdown expires.
6. Mentees can top up their wallet mid-call to avoid disconnection.
7. Manual top-up via saved Stripe card with preset amounts ($5, $10, $20, custom).
8. Optional auto-reload: mentee configures a threshold and reload amount; auto-charges their card when balance drops during a debit tick.
9. Existing per-session price/quote is kept as an informational estimate; actual billing is per-minute from the wallet.
10. Post-call reconciliation compares actual call duration (from Daily.co webhook) against wallet debits and adjusts for discrepancies.
11. Only 1-on-1 mentorship sessions use this model. Workshops keep their current fixed-price registration.

## Architecture: Frontend-Driven Timer with Backend Reconciliation

The frontend runs a 1-minute interval timer during the call. Each tick calls a backend endpoint that atomically debits the wallet and returns the updated balance and warning state. The backend is the sole source of truth for balance. After the call ends, a reconciliation step adjusts for any timing discrepancies between frontend ticks and actual Daily.co call duration.

## Data Model

### New: `Wallet` (one per mentee)

| Field | Type | Notes |
|-------|------|-------|
| `id` | Integer PK | Auto-increment |
| `user_id` | FK -> users, unique | One wallet per user |
| `balance` | Float | Current credit in USD, default 0.0 |
| `auto_reload_enabled` | Boolean | Default false |
| `auto_reload_threshold` | Float | Trigger when balance <= this, default 5.0 |
| `auto_reload_amount` | Float | Amount to charge, default 20.0 |
| `created_at` | DateTime | |
| `updated_at` | DateTime | |

### New: `WalletTransaction` (audit trail)

| Field | Type | Notes |
|-------|------|-------|
| `id` | Integer PK | Auto-increment |
| `wallet_id` | FK -> wallets | |
| `type` | String | `top_up`, `debit`, `auto_reload`, `reconciliation_debit`, `reconciliation_credit` |
| `amount` | Float | Positive for top-ups, negative for debits |
| `balance_after` | Float | Wallet balance after this transaction |
| `session_id` | FK -> sessions, nullable | Links debits to a specific session |
| `description` | String | Human-readable, e.g. "Minute 5 of session #42" |
| `created_at` | DateTime | |

### Modified: `User` model

Add `per_minute_rate` (Float, nullable, default 0.10) to the User model for mentors.

## API Endpoints

### New: Wallet Router (`/api/wallet`)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/wallet` | GET | mentee | Get wallet balance and auto-reload settings |
| `/api/wallet/top-up` | POST | mentee | Manual top-up. Body: `{ amount: float }`. Charges saved card, credits wallet. |
| `/api/wallet/auto-reload` | PUT | mentee | Update auto-reload settings. Body: `{ enabled: bool, threshold: float, amount: float }` |
| `/api/wallet/debit-tick` | POST | mentee | Per-minute debit during a call. Body: `{ session_id: int }`. Returns `{ balance: float, warning: null | "low" | "depleted" }` |
| `/api/wallet/transactions` | GET | mentee | Transaction history. Optional `?session_id=` filter. |

### Modified Existing Endpoints

**`POST /api/mentorship/sessions/{id}/room`** (join call):
- Add guard: if mentee's wallet balance < mentor's `per_minute_rate`, return HTTP 402 with `"Insufficient wallet balance"`.

**`POST /api/mentorship/sessions/{id}/complete`** (and Daily `meeting.ended` webhook):
- Add reconciliation: compare `call_duration_seconds` against sum of debit transactions for the session, create adjusting transaction if they differ.
- Only bill for time when both parties were present.

### `debit-tick` Endpoint Logic

1. Verify caller is the mentee of the given session and session is `in_progress`.
2. Verify mentor is still present in the call (via a `mentor_present` flag or Daily participant check). If mentor has left, return without debiting.
3. Atomically: debit `mentor.per_minute_rate` from wallet balance, create a `WalletTransaction` (type: `debit`), create corresponding `LedgerEntry` records (mentee debit, mentor earning, platform fee).
4. If balance after debit <= $1.00 and > $0: return `warning: "low"`.
5. If balance after debit <= $0: set balance to $0 (never go negative), return `warning: "depleted"`.
6. If auto-reload is enabled and balance <= threshold: attempt auto-reload charge to saved card. If successful, add reload amount to balance and create `WalletTransaction` (type: `auto_reload`). If card is declined, proceed with the warning anyway.

## Frontend Flow

### Pre-Join Gate

In `SessionDetail.tsx` and `MentorCalendar.tsx`, before navigating to the call:

1. Fetch mentee's wallet balance and mentor's `per_minute_rate`.
2. If `balance < per_minute_rate`, show a modal: "Insufficient credit. You need at least $X.XX to join this session." with a [Top Up Now] button.
3. Top-up happens inline (amount selector: $5 / $10 / $20 / custom, charges saved card).
4. Navigation to `/app/session/{id}/call` only proceeds when balance is sufficient.

### During-Call Billing Loop (VideoCall.tsx)

1. On successful join, start a `setInterval` at 60-second intervals.
2. Each tick calls `POST /api/wallet/debit-tick` with the session ID.
3. Display updated balance in a small pill on the call UI (bottom-left, next to duration timer): `Credit: $12.40`.
4. Handle `warning` field in response:
   - `null`: update balance display, no action.
   - `"low"`: show modal to both parties (see below).
   - `"depleted"`: show modal with 3-minute countdown to both parties (see below).
5. If 3-minute countdown expires with no successful top-up: call `callObject.leave()` and `videoAPI.endSessionCall()`.
6. If mentee tops up mid-call: next debit-tick returns healthy balance and `warning: null`, cancel countdown, dismiss modal.

### Warning Modals

**Low balance ($1 warning):**
- Mentee sees: "Credit is running low ($X.XX remaining, ~Y minutes). [Top Up] [Dismiss]"
- Mentor sees: "Your mentee's credit is running low. The call may end soon. [Dismiss]"
- Modal is dismissible.

**Depleted ($0 warning):**
- Mentee sees: "Credit depleted. Call will end in [3:00] unless credit is added. [Top Up Now]"
- Mentor sees: "Your mentee's credit has been depleted. Call will end in [3:00]."
- Visible countdown timer on screen.
- Modal is blocking (not dismissible, only resolved by top-up or countdown expiry).

### Mentor Notification Mechanism

The `debit-tick` endpoint is called by the mentee's browser only. To notify the mentor of warnings, the mentee's frontend sends a Daily custom message:

```
callObject.sendAppMessage({
  type: "credit-warning",
  level: "low" | "depleted" | "resolved"
})
```

The mentor's `VideoCall` component listens for `app-message` events and renders the appropriate modal.

### Mid-Call Top-Up

The warning modal includes an amount selector (preset $5 / $10 / $20 / custom) and a "Top Up" button. Calls `POST /api/wallet/top-up`. On success, modal dismisses, balance pill updates, and a `"resolved"` app message is sent to the mentor.

## Wallet UI on Billing Page

New "Wallet" card section at the top of `Billing.tsx` for mentees:

- **Balance display**: Large text showing current balance.
- **Top Up button**: Opens amount selector + charge flow.
- **Auto-reload settings**: Toggle for enable/disable, input fields for threshold and reload amount. Saved via `PUT /api/wallet/auto-reload`.
- **Transaction history**: Table of recent wallet transactions (type, amount, balance after, date, linked session).

Existing Stripe card management (save/remove card) stays unchanged -- the saved card is used for both manual top-ups and auto-reloads.

## Reconciliation

Triggered when a session is marked complete (via endpoint or Daily `meeting.ended` webhook):

1. Get `call_duration_seconds` from the session record (set by Daily webhook).
2. Calculate expected total: `ceil(billable_seconds / 60) * per_minute_rate`, where `billable_seconds` is only the time both parties were present.
3. Sum all `debit` transactions for this session.
4. If expected > debited (missed ticks): create `reconciliation_debit` transaction.
5. If expected < debited (overpaid): create `reconciliation_credit` transaction refunding the difference.
6. Adjust corresponding ledger entries to match reconciled total.

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Mentee's browser crashes mid-call | No more debit ticks fire. Daily `meeting.ended` webhook triggers reconciliation, which debits remaining owed amount. Balance floors at $0. |
| Mentor leaves but mentee stays | Billing stops. `debit-tick` detects mentor is absent and returns without debiting. Reconciliation only bills for time both were present. |
| Mentee leaves but mentor stays | Billing stops (debit-tick is mentee-driven). Reconciliation adjusts based on mentee's actual participation time from Daily. |
| Auto-reload card declined | Top-up fails silently during debit-tick. Warning is still returned. Mentee can manually top up via modal. If they don't, 3-minute countdown proceeds. |
| Grace period (3-min countdown) | Reconciliation does NOT charge for grace period minutes. Only actual pre-depletion minutes are billed. |
| Two simultaneous sessions (same mentee) | Each debit-tick targets a specific session_id. Wallet balance is shared; both sessions debit atomically. Low-balance warnings apply globally. |
| Wallet doesn't exist yet | Created automatically when a mentee first visits the billing page or attempts to join a call. Initial balance: $0. |

## Out of Scope

- Workshop billing (stays fixed-price per registration).
- Changes to the mentor payout flow (existing sweep continues to work against ledger entries).
- Real-time server-push of balance updates (frontend polling via debit-tick is sufficient).
