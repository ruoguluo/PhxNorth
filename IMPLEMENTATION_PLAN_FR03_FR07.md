# Implementation Plan — FR-03 (AI question structuring) & FR-07 (Billing)

**Status:** Draft for approval · **Date:** 2026-05-30
**Workflow:** plan first → build after sign-off.

---

## Decisions locked in

- **FR-07 processor:** processor-agnostic — build a billing **ledger + a `PaymentProvider` abstraction**, with a **mock provider** now. A real provider (Stripe Connect, etc.) drops in behind the same interface later.
- **FR-07 pricing:** per-session, using the existing `price` / `hourly_rate` fields.
- **FR-07 charge timing:** **authorize at booking, capture at completion** (void/refund on cancel).
- **FR-07 environment:** test/mock only for now.

---

# FR-03 — AI-assisted question structuring

### Goal
Replace the **mocked** AI in `MenteeQuestionEntry.tsx` (the `setTimeout` + hardcoded `mockAssumedGoal` / `mockClarificationQuestions` / `generatedAgenda`) with real LLM calls, so a mentee's raw question is interpreted and structured before it reaches a mentor.

### Where it lives — `phxnorth-backend` (not the demo server)
Rationale: the DeepSeek LLM client, settings, and async stack already exist there (`app/services/cv_parser/extractors/llm_extractor.py` uses `AsyncOpenAI` with `settings.deepseek_api_key` / `llm_model` / `llm_base_url`). The demo `server/` has no LLM client.

Crucially, question structuring is **stateless on the raw text** — it doesn't need the user's identity or DB row. That sidesteps the two-backend ID mismatch entirely: the frontend calls `phxnorth-backend` for structuring, then creates the mentorship request in the demo `server/` with the structured payload attached. The frontend already calls `/api/v1` directly (Vite proxy → `:8000`).

### Backend changes (`phxnorth-backend`)
1. **Shared LLM helper** — `app/services/llm/client.py`: extract the `AsyncOpenAI` setup currently inlined in `llm_extractor.py` into one reusable `async chat_json(system, user) -> dict` helper (strict-JSON parsing, truncation, graceful empty-on-failure). Refactor `llm_extractor.py` to use it (no behavior change).
2. **New router** — `app/api/v1/questions.py`, mounted at `/questions` in `router.py`:
   - `POST /questions/interpret` — body `{ raw_question, category?, country? }` → returns `AIUnderstanding` (`country, category, subtype, stage, primaryGoal, timeHorizon`), an `assumedGoal`, `stageOptions[]`, and `clarificationQuestions[]` (empty if none needed). Replaces `analyzeQuestionAndGenerateAssumedGoal` + `handleStageSelection`'s clarification mock.
   - `POST /questions/agenda` — body `{ raw_question, understanding, stage, answers }` → returns a structured `subQuestions[]` (`question, purpose, depthLevel ∈ {Foundation,Application,Strategic}, estimatedTime`) plus a normalized `StructuredQuestionData`. Replaces `generatedAgenda`.
3. **Schemas** — `app/api/v1/schemas/questions.py` mirroring the existing TS interfaces exactly so the contract is 1:1.
4. **Prompts** — system prompts that force JSON-only output (same discipline as `_SYSTEM_PROMPT` in `llm_extractor.py`).
5. **Settings flag** — `llm_question_assist_enabled` (default `True`) in `app/config.py`, mirroring `llm_cv_parser_enabled`.

### Frontend changes (`PhxNorth`)
1. `src/lib/question-api.ts` — typed client for the two endpoints (reusing the `/api/v1` base + JWT pattern from `disc-api.ts`).
2. `MenteeQuestionEntry.tsx` — swap the three `setTimeout` mocks for real calls, keeping the existing `isProcessing` spinners and step flow. **Graceful degradation:** if the endpoint is disabled/unavailable, fall back to manual entry (no hard failure).

### Out of scope for FR-03 (flagged as follow-ups)
- **Mentor matching** (`proceedToMatching`'s `mockMatches`) is a separate concern; it should later call the demo server's `/api/profile/mentors`. Left mocked here.
- **Behavioral-signal emission** (posting a `question_structured` event to `/api/v1/events` to feed the 5D model) — small add, belongs with FR-06. Noted, not built here.

### Testing
- `pytest` for both endpoints with the LLM **monkeypatched** (no live API needed in CI): assert JSON shape, enum validity, and graceful fallback when the key is unset.
- Frontend: TypeScript build + manual walkthrough of the quick-question flow.

### Risk
- Needs a real `DEEPSEEK_API_KEY` for end-to-end manual testing. Without it the feature self-disables and falls back to manual entry; automated tests mock the client.

---

# FR-07 — Billing system

### Goal
Charge mentees per session and credit mentors (minus a platform fee), with all money movement recorded in a ledger. No real processor yet — everything behind a swappable interface with a mock implementation.

### Where it lives — the demo `server/`
Sessions, requests, users, `price`, `hourly_rate`, and `monthly_income` all live here, and the session lifecycle (`/requests/{id}/respond`, `/sessions/{id}/complete`) is where billing must hook in.

### Provider abstraction
`server/services/payments/base.py` — `PaymentProvider` interface:
```
authorize(amount, currency, ref) -> auth_ref
capture(auth_ref)                -> charge_ref
void(auth_ref)                   -> None
refund(charge_ref, amount?)      -> refund_ref
create_payout(mentor, amount)    -> payout_ref
```
`server/services/payments/mock.py` — `MockProvider`: deterministic refs (e.g. `mock_auth_<uuid>`), always succeeds, records nothing external. A real provider later implements the same interface; selection via a `PAYMENT_PROVIDER` env var.

### Data model (`server/models/billing.py`)
- **Payment** — `id, session_id, mentee_id, mentor_id, amount, platform_fee, mentor_earnings, currency, status ∈ {authorized, captured, voided, refunded, failed}, provider, provider_auth_ref, provider_charge_ref, created_at, updated_at`.
- **Payout** — `id, mentor_id, amount, status ∈ {pending, paid, failed}, period_start, period_end, provider_payout_ref, created_at`.
- **LedgerEntry** — `id, account (e.g. "platform", "mentor:<id>", "mentee:<id>"), payment_id, payout_id?, entry_type ∈ {charge, fee, earning, payout}, amount (signed), created_at`. Gives an auditable record of money kept/moved.
- **Platform fee** — `PLATFORM_FEE_PCT` env (default 0.15). `mentor_earnings = round(amount * (1 - fee), 2)`.
- New tables added to the demo server's table creation + `seed.py`.

### Lifecycle hooks
- **Booking** (`mentorship.py` accept/`respond` → session created): derive `price` from `mentor.hourly_rate × duration` if unset, then `provider.authorize(price)` → create `Payment(status=authorized)`. If authorize fails, the booking is rejected.
- **Completion** (`complete_session`): `provider.capture(auth_ref)` → `Payment(status=captured)`; compute fee + earnings; write `LedgerEntry` rows (charge, fee, earning); set `mentor.monthly_income += mentor_earnings` (replacing the current raw `+= price`).
- **Cancellation**: `void` (if not yet captured) or `refund`; mark Payment accordingly; reverse ledger entries.

### Endpoints (`server/routers/billing.py`, prefix `/api/billing`)
- `GET /payments` — role-scoped (mentee → their charges, mentor → their earnings, admin → all).
- `GET /payments/{id}` — with authorization check.
- `GET /summary` — mentee: total spent; mentor: earnings + pending payout; admin: GMV, fees collected.
- `GET /payouts` — mentor/admin.
- `POST /payouts/run` — admin/system: aggregate captured-but-unpaid earnings per mentor → `provider.create_payout` → `Payout` + ledger `payout` entries. (Can later move to a scheduled task.)
- `POST /webhook` — stub for a future real provider.

### Frontend changes (`PhxNorth`)
- `src/lib/api.ts` — add `billingAPI` (reuse existing `/api` + JWT wrapper).
- **Mentee:** a "Billing / Payments" view (charges + status + total spent).
- **Mentor:** an "Earnings" section on `MentorDashboard` (captured earnings, pending payout, history).
- **Admin:** billing panel in `AdminDashboard` (GMV, fees, run-payout button).
- **Session detail:** show payment status on the session.

### Testing
- `pytest` for the full flow with `MockProvider`: authorize → capture → payout; fee math; void/refund paths; role-based access. (Adds a `server/tests/` setup if absent.)

### Risks / open items
- The demo server is SQLite — fine for now, but real money would warrant moving billing to `phxnorth-backend` (Postgres) and unifying identity. Noted for later.
- "Authorize at booking" assumes a stored payment method; with the mock provider this is simulated. Real provider integration will need a card-collection step in the UI (future phase).

---

## Sequencing

1. **FR-03** first — self-contained, no money, unblocks the mentee flow. (~backend router + LLM helper + 2 endpoints + frontend wiring + tests.)
2. **FR-07** second, in order: models + provider + lifecycle hooks → endpoints → frontend → admin payout → tests.

## What I'd build first on approval
FR-03 end-to-end (it's smaller and isolated), verify it, then start FR-07. I'll keep changes on the existing repos and run the test suites as I go.

---

**Please review.** Tell me what to adjust — especially the FR-07 endpoint surface, the platform-fee default (15%), and whether mentor payouts should run on a schedule or admin-triggered. On approval I'll start with FR-03.
