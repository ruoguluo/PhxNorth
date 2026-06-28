# PhxNorth — Implemented Features Catalog

> Function/endpoint-level inventory of what's been built. Companion to
> `FEATURE_REQUIREMENTS.md` (requirements + status) and `DEVELOPMENT_PROGRESS.md`
> (setup, file map, how to run). **Last updated:** 2026-06-28
>
> `[new]` = added in the recent work stream · `[pre-existing]` = already present.

---

## API endpoints

### Behavioral backend — `phxnorth-backend` (`http://localhost:8000`, prefix `/api/v1`)

| Method | Path | Description | |
|--------|------|-------------|---|
| POST | `/questions/interpret` | Raw mentee question → structured understanding, assumed goal, stage options, clarification questions (LLM, heuristic fallback) | `[new]` FR-03 |
| POST | `/questions/agenda` | Question + context → structured agenda of sub-questions | `[new]` FR-03 |
| GET | `/users/{id}/cv/...`, `/disc-profile`, `/career`, `/risk`, `/contradiction`, `/behavioral-shift`, `/events` | CV parsing, DISC/5D, risk, behavioral events | `[pre-existing]` |

### Demo backend — `PhxNorth/server` (`http://localhost:8081`, prefix `/api`)

**Billing** (`/api/billing`) — `[new]` FR-07
| Method | Path | Description |
|--------|------|-------------|
| GET | `/billing/payments` | List payments, role-scoped (mentee charges / mentor earnings / admin all) |
| GET | `/billing/payments/{id}` | Single payment (authorized participant or admin) |
| GET | `/billing/summary` | Role summary (mentee spend / mentor earnings+pending / admin GMV+fees) |
| GET | `/billing/payouts` | List payouts (mentor own / admin all) |
| POST | `/billing/payouts/run` | Admin: trigger the mentor payout sweep |
| POST | `/billing/webhook` | Stub for a future real payment provider |

**Conversations** (`/api/conversations`) — `[new]` FR-05
| Method | Path | Description |
|--------|------|-------------|
| GET | `/conversations` | Inbox: the user's threads with counterparty, last message, unread count |
| GET | `/conversations/{id}` | Conversation detail |
| GET | `/conversations/{id}/messages` | Full cross-session history (`?q=` search, `limit`/`offset`) |
| PUT | `/conversations/{id}/read` | Mark incoming messages read |
| POST | `/conversations/{id}/messages` | Send (continues latest session, emits DISC signals) |

**Mentorship** (`/api/mentorship`)
| Method | Path | Description | |
|--------|------|-------------|---|
| POST | `/mentorship/match` | Rank mentors against structured question intent | `[new]` matching |
| PUT | `/mentorship/requests/{id}/respond` | Accept/decline → on accept, **authorizes payment** | `[changed]` FR-07 hook |
| PUT | `/mentorship/sessions/{id}/complete` | Complete → **captures payment**, posts ledger, credits mentor | `[changed]` FR-07 hook |
| GET/PUT | `/mentorship/availability`, `/requests`, `/sessions`, `/queue`, `/calendar`, `/stats` | Core mentorship flows | `[pre-existing]` |

**Messages** (`/api/messages`) — `[pre-existing]`, now conversation-linked
REST history/send/read, file upload, and a WebSocket (`/ws/session/{id}`); each
message is now linked to a durable conversation thread.

---

## Backend services & key functions

### `phxnorth-backend`
- **`app/services/llm/client.py`** `[new]` — `chat_json(system, user)` shared DeepSeek caller; `llm_enabled()`; `LLMUnavailable`.
- **`app/api/v1/questions.py`** `[new]` — `interpret_question`, `generate_agenda` (+ heuristic fallbacks).
- `cv_parser`, `disc_scorer`, `risk_analyzer`, `signal_extractor`, Celery workers `[pre-existing]`.

### `PhxNorth/server`
- **`services/billing.py`** `[new]` — `compute_split`, `effective_price`, `authorize_session_payment`, `capture_session_payment`, `void_session_payment`, `refund_payment`, `process_due_payouts`, `mentee_summary`, `mentor_summary`, `admin_summary`.
- **`services/payments/`** `[new]` — `PaymentProvider` interface (`authorize`/`capture`/`void`/`refund`/`create_payout`), `MockProvider`, `get_provider()`, and a daily payout `scheduler`.
- **`services/conversation_store.py`** `[new]` — `get_or_create_conversation`, `link_message`, `migrate_and_backfill`.
- **`services/mentor_matcher.py`** `[new]` — `match_mentors`, `MatchInput`, `tokenize`, component scorers (topic/track/logistics/stage), `_behavioral_score` (DISC phase-2 hook).
- **`services/chat_signal_classifier.py`**, **`disc_event_dispatcher.py`** `[pre-existing]` — turn chat into DISC events, forward to the behavioral backend.

---

## Data models

- **`PhxNorth/server/models/billing.py`** `[new]` — `Payment`, `Payout`, `LedgerEntry`.
- **`PhxNorth/server/models/conversation.py`** `[new]` — `Conversation`; `Message` gained `conversation_id`.
- `User`, `Session`, `MentorshipRequest`, `MentorAvailability`, `Message` `[pre-existing]`.

---

## Frontend (React)

| Page / module | Description | |
|---------------|-------------|---|
| `pages/Billing.tsx` | Role-aware billing: spend / earnings + payouts / admin GMV + run-payouts | `[new]` FR-07 |
| `pages/Messages.tsx` | Conversations inbox (list + thread + composer) | `[new]` FR-05 |
| `pages/MenteeQuestionEntry.tsx` | Now calls real `/questions/*` + `/mentorship/match` (was mocked); assumed-goal form renders category-specific fields (education/career/business/entrepreneurship) | `[changed]` FR-03 + matching |
| `pages/MyQuestions.tsx` | Mentee's active questions list with tabs (Active/Closed/All), search, withdraw action | `[new]` |
| `lib/api.ts` | Added `billingAPI`, `conversationsAPI`, `mentorshipAPI.match`, `MentorMatch` type | `[changed]` |
| `lib/question-api.ts` | Client for the question-structuring endpoints; `AssumedGoalDTO` expanded with category-specific fields | `[changed]` |
| `components/Layout.tsx`, `app/routes.tsx` | Sidebar links + routes for `/app/billing`, `/app/messages`, `/app/my-questions` | `[changed]` |

---

## Tests

- `phxnorth-backend/tests/api/v1/test_questions.py` — interpret/agenda (LLM mocked).
- `PhxNorth/server/tests/test_billing_service.py` — authorize→capture→payout, fees, void/refund, summaries.
- `PhxNorth/server/tests/test_conversations.py` — thread create/link, backfill, idempotency.
- `PhxNorth/server/tests/test_mentor_matcher.py` — relevance ranking, budget, logistics, confidence buckets.

> Note: written but not executed in the authoring sandbox (no network / native deps). Run `make test` to verify.

---

## Tooling

- Root `docker-compose.yml` (all 3 via `include`), frontend `Dockerfile` + `nginx.conf`, `server/Dockerfile` + entrypoint, `.dockerignore`s.
- `Makefile` (`up`/`down`/`dev-all`/`infra`/`test`/…), `start-dev.sh`, `start-all.sh`.

---

## Not yet implemented (see FEATURE_REQUIREMENTS.md)

- **FR-04 video chat** — scheduling exists; no video provider/embed yet.
- **FR-06 daily 5D update** — Celery infra + chat→events bridge exist; end-to-end wiring pending.
- Real payment provider (Stripe Connect) behind `PaymentProvider`; DISC component in matching; results-card "book" buttons → `createRequest`.
