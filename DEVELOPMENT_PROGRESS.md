# PhxNorth — Development Progress

> Pick-up-anywhere log of in-flight feature work. Pair with `FEATURE_REQUIREMENTS.md`
> (the requirement list + status audit) and `IMPLEMENTATION_PLAN_FR03_FR07.md`
> (design rationale for FR-03/FR-07).
> **Last updated:** 2026-06-15

---

## 1. Repos & layout

Two repos, developed together:

| Path | What it is | Stack | Runs on |
|------|-----------|-------|---------|
| `PhxNorth/` | Frontend SPA **+** demo backend in `server/` | React 18 + Vite + TS; FastAPI + **SQLite** (sync SQLAlchemy) | frontend `:5173`, demo API `:8081` |
| `phxnorth-backend/` | Production behavioral-intelligence backend | FastAPI + async SQLAlchemy + **Postgres**, Redis, Kafka, Celery | `:8000` (`/api/v1`) |

The frontend (Vite) proxies `/api/v1 → :8000` (behavioral) and `/api → :8081` (mentorship/demo). So **both backends run at once**. They have separate auth and databases — unifying them is a known future task.

---

## 2. How to run

**Behavioral backend (`phxnorth-backend`)**
```bash
cd phxnorth-backend
poetry install
poetry run uvicorn app.main:app --reload          # :8000, docs at /docs
# Optional FR-03 LLM (DeepSeek). Without a key the AI gracefully falls back.
export DEEPSEEK_API_KEY=sk-...                     # see .env / app/config.py
```

**Demo backend (`PhxNorth/server`)**
```bash
cd PhxNorth/server
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python3 seed.py                                    # first time: seeds test accounts
python3 -m uvicorn main:app --host 0.0.0.0 --port 8081
```

**Frontend (`PhxNorth`)**
```bash
cd PhxNorth
npm install
npm run dev                                        # :5173
```

Test accounts are in `PhxNorth/README.md` (admin / mentor / mentee, password `*123`).

### Docker (full stack, one command)

A root compose at `PhxNorth/docker-compose.yml` brings up all three pieces (it
`include`s the behavioral backend's compose from the sibling repo, so the two
repos must sit side-by-side: `~/Projects/PhxNorth` and `~/Projects/phxnorth-backend`).

```bash
cd ~/Projects/PhxNorth
docker compose up -d --build          # needs Docker Compose v2.20+ (for `include`)
open http://localhost:8080            # frontend (nginx)
```

Services: `web` (nginx, host **:8080**) → proxies `/api` to `demo-api` (**:8081**) and
`/api/v1` to `api` (**:8000**); plus `celery-worker`, `celery-beat`, `postgres`,
`redis`, `kafka` from the backend repo. The demo DB is seeded on first boot and
persisted in the `demo_data` volume.

Light stack (skip the heavy behavioral backend + infra — FR-03/CV/5D degrade
gracefully, everything else works):

```bash
docker compose up -d --build web demo-api
```

FR-03's LLM inside Docker: put `DEEPSEEK_API_KEY=sk-...` in `phxnorth-backend/.env`
(it's baked into the `api` image and read by the app's settings).

Docker files added: `PhxNorth/Dockerfile` (frontend → nginx), `PhxNorth/nginx.conf`,
`PhxNorth/server/Dockerfile` + `docker-entrypoint.sh`, `.dockerignore` in all three
locations, and the root `PhxNorth/docker-compose.yml`.

### Native (hot reload) — step by step

**Step 1: Start Docker infrastructure** (Postgres + Redis for behavioral backend):
```bash
cd ~/Projects/phxnorth-backend
docker-compose up -d                  # starts postgres:5432, redis:6379, kafka
```

**Step 2: Start behavioral backend** (:8000):
```bash
cd ~/Projects/phxnorth-backend
source .venv/bin/activate
DATABASE_URL="postgresql+asyncpg://phxnorth:phxnorth@localhost:5432/phxnorth" \
REDIS_URL="redis://localhost:6379/0" \
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Step 3: Start demo backend** (:8081):
```bash
cd ~/Projects/PhxNorth/server
source venv/bin/activate
python seed.py                        # first time or after DB reset
uvicorn main:app --host 0.0.0.0 --port 8081 --reload
```

**Step 4: Start frontend** (:5173):
```bash
cd ~/Projects/PhxNorth
npm run dev
```

*Note: The frontend dev server runs over HTTPS by default (via `@vitejs/plugin-basic-ssl`) to satisfy the secure context requirement for WebRTC (Daily.co video calling). Accept the self-signed certificate warning in your browser to proceed.*

**Shutdown everything:**
```bash
# Kill app processes
lsof -ti:5173 -ti:8081 -ti:8000 | xargs kill -9

# Stop Docker containers
cd ~/Projects/phxnorth-backend && docker-compose down
```

Vite proxies `/api` → `:8081` (demo) and `/api/v1` → `:8000` (behavioral).

**Light stack** (skip behavioral backend — FR-03/CV/5D degrade gracefully):
```bash
cd ~/Projects/PhxNorth/server && source venv/bin/activate && uvicorn main:app --port 8081 --reload
cd ~/Projects/PhxNorth && npm run dev
```

### Makefile shortcuts

```bash
make dev-all     # infra (Postgres/Redis/Kafka) in Docker; the 3 apps run natively
make dev         # demo backend + frontend only (no Docker needed)
make infra       # just the databases (for working on the backend natively)
make up          # the full stack in Docker (no reload)        -> :8080
make test        # both pytest suites
```

---

## 3. Status by requirement

See `FEATURE_REQUIREMENTS.md` for the full table. Snapshot:

- **FR-01 resume parsing** — 🟡 backend + CVUpload wired (pre-existing).
- **FR-02 5D analysis** — 🟡 backend + FiveDSnapshot wired (pre-existing).
- **FR-03 AI question structuring** — 🟡 **built this stream** (real LLM, was mocked).
- **FR-04 video conferencing** — ✅ **built 2026-06-04** (Daily.co: 1v1 + workshop calls, recording, transcription, AI summaries).
- **FR-05 conversation persistence** — ✅ **extended this stream** (durable cross-session threads + inbox).
- **FR-06 daily AI job** — 🟡 Celery beat infra exists; chat→events bridge exists in demo server.
- **FR-07 billing** — 🟡 **built this stream** (ledger + mock provider, scheduled payouts).

---

## 4. What was built in this work stream

### FR-03 — AI question structuring (`phxnorth-backend`)
- `app/services/llm/client.py` — shared DeepSeek (OpenAI-compatible) `chat_json` helper + `LLMUnavailable`. `llm_extractor.py` refactored to use it.
- `app/api/v1/questions.py` — `POST /api/v1/questions/interpret` and `/agenda`; strict-JSON prompts; heuristic fallback when the LLM is off/unavailable (`ai_generated=false`).
- `app/api/v1/schemas/questions.py` — schemas mirroring the frontend TS types.
- `app/config.py` — `llm_question_assist_enabled` flag.
- Frontend: `src/lib/question-api.ts`; `MenteeQuestionEntry.tsx` now calls the API instead of `setTimeout` mocks (falls back to manual entry on error). Mentor matching is still mocked (intentionally out of scope).
- Tests: `tests/api/v1/test_questions.py` (LLM monkeypatched).

### FR-07 — Billing (`PhxNorth/server`)
- `models/billing.py` — `Payment`, `Payout`, `LedgerEntry`.
- `services/payments/` — `base.py` (`PaymentProvider` interface), `mock.py` (`MockProvider`), `__init__.get_provider`, `scheduler.py` (daily payout thread).
- `services/billing.py` — authorize / capture / void / refund, fee split, `process_due_payouts`, summaries.
- Lifecycle hooks in `routers/mentorship.py`: authorize at booking (accept), capture at completion.
- `routers/billing.py` + `schemas/billing.py` — `/api/billing` (payments, summary, payouts, admin `payouts/run`, webhook stub).
- `run_payouts.py` — cron-friendly standalone sweep.
- Frontend: `billingAPI` in `src/lib/api.ts`; `src/app/pages/Billing.tsx` (role-aware); route `/app/billing`; sidebar link.
- Tests: `tests/test_billing_service.py`.

### FR-05 — Conversation persistence (`PhxNorth/server`)
- `models/conversation.py` — durable mentor↔mentee `Conversation` (unique pair, `last_message_at`).
- `models/message.py` — added `conversation_id`.
- `services/conversation_store.py` — `get_or_create_conversation`, `link_message`, `migrate_and_backfill` (adds the SQLite column + backfills old messages on startup).
- `routers/messages.py` — every send path (REST / WebSocket / file upload) now links to a conversation.
- `routers/conversations.py` — `/api/conversations` list (inbox), cross-session history (+`q` search), mark-read, conversation-level send (continues the latest session, dispatches DISC signals, mirrors to WS).
- `main.py` — registers models, mounts router, runs backfill at startup.
- Frontend: `conversationsAPI` in `src/lib/api.ts`; `src/app/pages/Messages.tsx` (inbox + thread + composer, polls every 8s); route `/app/messages`; sidebar link.
- Tests: `tests/test_conversations.py`.

### Mentor matching — real ranking (replaces the question-entry mock)
- `server/services/mentor_matcher.py` — transparent weighted scoring (topic 0.35 / track 0.25 / logistics 0.15 / behavioral 0.15 / stage 0.10) over real mentors, using the FR-03 question intent vs `specializations`/`industry`/`field_of_study`/`bio`; returns explainable `reasons`. **DISC/5D behavioral compatibility is a phase-2 hook** (`_behavioral_score` returns neutral 0.5; wire it to `phxnorth-backend` `/api/v1/disc-profile-by-email` later).
- `POST /api/mentorship/match` (+ `MatchRequest`/`MentorMatchResponse` in `schemas/mentorship.py`).
- Frontend: `mentorshipAPI.match` + `MentorMatch` type in `src/lib/api.ts`; `MenteeQuestionEntry.proceedToMatching` now calls it (was a hardcoded list), with graceful empty-on-error.
- Tests: `tests/test_mentor_matcher.py`.

### 2026-06-03/04 — Profile management, consulting/workshops, pricing, video conferencing

**Profile summary & management (2026-06-03):**
- Extended User model with 10 new columns (summary, visibility, privacy settings).
- New `timeline_entries` + `credentials` tables with full CRUD APIs.
- `MenteeProfileSetup` replaced localStorage with API persistence.
- New Summary section with editable bio + AI Signature Tags (computed from DISC/Career data).
- Profile page wired with Edit button + privacy toggles.

**Enterprise consulting & workshops (2026-06-03):**
- `consulting_projects` + `project_applications` tables — multi-mentor bidding workflow.
- `workshops` + `workshop_registrations` tables — mentor-created workshops with mentee registration.
- Consulting router (8 endpoints) + Workshops router (10 endpoints).
- New `MentorConsulting` page, `MentorWorkshops` wired to API.
- Mentor Dashboard cards wired to real consulting/workshop data.

**Pricing flow (2026-06-04):**
- Mentor hourly rate setting UI on dashboard.
- Request modal shows calculated price (rate × duration).
- `submitRequest` sends real price instead of hardcoded $0.
- Matcher API returns `hourlyRate` for each mentor.
- Cancel session now calls `void_session_payment()` (bug fix).

**Session & Request CRUD (2026-06-04):**
- 6 new endpoints: direct session create/edit/cancel/delete, request edit/withdraw.

**User identity bridge (2026-06-04):**
- `phxnorth-backend`: added `resolve_user_id()` dependency — all 12 user-facing endpoints now accept `"me"` as `user_id`, resolving to current user's UUID from JWT.
- `FiveDSnapshot` reads real user role from auth context (was hardcoded `'mentee'`).

**Static link audit & fix (2026-06-04):**
- Audited all 55+ authenticated pages.
- Fixed 79 non-functional links/buttons (5 CRITICAL href="#", 36 HIGH, 28 MEDIUM, 10 LOW).

**FR-04 — Video conferencing via Daily.co (2026-06-04):**
- `server/services/daily.py` — Daily REST API wrapper (rooms, tokens, recordings).
- `server/services/transcript_summary.py` — AI summary generation via DeepSeek LLM.
- `server/routers/video.py` — 10 endpoints: session room CRUD, workshop room, webhook, recording/transcript/summary.
- Session + Workshop models extended with video fields (room_name, room_url, recording_url, transcript_text, ai_summary, call timestamps).
- Frontend: `@daily-co/daily-js` SDK with 5 custom hooks (`useDaily`, `useParticipants`, `useDevices`, `useRecording`, `useTranscription`).
- `VideoCall.tsx` — 1v1 video call page with PiP layout, controls, live subtitles.
- `WorkshopCall.tsx` — multi-person gallery view with hand raise.
- 4 shared components: `VideoControls`, `ParticipantGrid`, `Subtitles`, `SessionRecording`.
- `SessionDetail` — Join Video button + post-call recording/transcript/AI summary.
- `MentorCalendar` — Join Session routes directly to video call.
- `MentorWorkshops` — Start Workshop / Join Live buttons.
- Daily webhook handles `recording.ready-to-download`, `transcription.ready-to-download`, `meeting.started`, `meeting.ended`.

**FR-01 — CV upload → profile review flow (2026-06-04):**
- CVUpload completion now links to "Review & Confirm Extracted Data" → `/app/mentee/profile-setup?from=cv`.
- MenteeProfileSetup detects `?from=cv` param → auto-triggers `populateFromBackend()` to show AI Parsed Draft.
- Career timeline auto-populated from CV `job_entries`.

**FR-02 — 5D progress-over-time + behavioral shifts (2026-06-04):**
- FiveDSnapshot now calls `discProfileAPI.history('me')` → renders DISC line chart (D/I/S/C over time) + confidence trend.
- Calls `discRiskAPI.behavioralShift('me')` → renders behavioral shift cards with magnitude badges.
- New Recharts imports: `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Legend`.

**FR-03 — AI agenda in Quick Question flow (2026-06-04):**
- Quick flow now has `'agenda'` step between clarification and matching.
- Calls `questionAPI.agenda()` with question context → displays agenda items with depth/time/purpose.
- Agenda text appended to session request message field.

**FR-08 — Mentor matching completion (2026-06-04):**
- `_behavioral_score()` implemented: DISC complementarity scoring (S complement +0.15, D alignment ±0.05, C match +0.10, I communicator +0.05). Uses cached `disc_scores_json` on User model.
- `queueLength` + `estimatedWaitTime` computed from live in_progress sessions + pending requests.
- `nextAvailability` computed from `MentorAvailability` slots.
- Frontend: `hourlyRate` and `reasons` now mapped to match results. Reasons displayed as tags on all 5 card variants.
- 8 new behavioral scoring tests (63 total).

**FR-07 — Stripe Connect payment integration (2026-06-04):**
- `server/services/payments/stripe.py` — `StripeProvider` implementing `PaymentProvider` interface via Stripe PaymentIntent (authorize/capture/void), Refund, and Transfer APIs. Dollar-to-cents conversion.
- `server/routers/stripe_billing.py` — 8 Stripe-specific endpoints:
  - Mentor Connect: `POST /connect` (create Standard account + onboarding URL), `GET /status`, `POST /dashboard-link`
  - Mentee cards: `POST /setup-intent` (Stripe SetupIntent), `POST/GET/DELETE /payment-method` (save/retrieve/remove card via Stripe Elements)
  - Webhook: `POST /webhook` handling `account.updated`, `payment_intent.payment_failed`
- `server/services/payments/base.py` — Extended `authorize()` with `customer_id`/`payment_method_id` and `create_payout()` with `destination_account_id` (backward-compatible optional params).
- `server/services/billing.py` — `authorize_session_payment()` passes mentee Stripe info to provider; `process_due_payouts()` passes mentor connected account; skips mentors without Stripe accounts.
- User model: 4 new Stripe fields (`stripe_customer_id`, `stripe_payment_method_id`, `stripe_account_id`, `stripe_account_status`).
- Frontend: `@stripe/stripe-js` + `@stripe/react-stripe-js` installed; `stripeAPI` client (8 methods); Billing page updated with Mentor Connect section + Mentee Stripe Elements card form; Request modal checks for payment method before booking.
- 9 new StripeProvider unit tests (mocked Stripe API), 55 total tests passing.

### 2026-06-14 — Notification bell, inline video calls, session visibility, local dev fixes

**Payment provider fix for local dev:**
- Switched `PAYMENT_PROVIDER` from `stripe` to `mock` in `server/.env` for local development. Seeded test users lack Stripe Customer/PaymentMethod profiles, causing `402 Payment Required` errors when mentors accept bookings under Stripe mode.

**Notification bell — live polling (Layout.tsx):**
- Replaced the hardcoded `alert('Notifications coming soon')` bell button with a fully functional notification system.
- For **mentors/admins**: polls `GET /api/mentorship/requests?role=mentor&status_filter=pending` every 15s to surface incoming mentorship requests.
- For **all users**: polls `GET /api/conversations` to surface conversations with `unread_count > 0`.
- Red pulsing dot on the bell icon when there are unread notifications; clicking opens a styled dropdown panel with notification items categorized by type (request vs message), each linking to the relevant page.
- Empty state shows a bouncing bell icon with "All caught up!" message.

**Inline/fullscreen video call toggle (VideoCall.tsx, WorkshopCall.tsx):**
- Video calls now default to an **inline/embedded view** within the normal dashboard layout (sidebar + header remain visible).
- Added a fullscreen toggle button that switches between inline and fullscreen (fixed overlay with high z-index).
- Both `VideoCall` and `WorkshopCall` components updated with `isFullscreen` state management.

**Sessions filter fix (server/routers/mentorship.py):**
- When a user joins a session call room, the session status moves to `in_progress`, which caused it to vanish from "upcoming" session lists.
- Updated `list_sessions` so `status_filter=upcoming` returns both `upcoming` and `in_progress` sessions.

**Role-aware sidebar separation (Layout.tsx):**
- Split the sidebar into distinct **Mentor** and **Mentee** navigation sections with role-appropriate links.
- Mentor sidebar: Dashboard, Requests, Sessions, Calendar, Availability, Workshops, Consulting, Messages, Billing.
- Mentee sidebar: Dashboard, Find Mentor, Profile, Calendar, Instant Mentorship, Courses, Messages, Billing.
- Added `useEffect` to sync `activeRoles` when user data finishes loading, ensuring mentors always see both role tabs.
- Removed stale conditional hiding of role tabs in the top bar.

---

## 5. Configuration / env vars

**Behavioral backend** (`app/config.py`): `DEEPSEEK_API_KEY`, `llm_question_assist_enabled`, `llm_cv_parser_enabled`, `llm_model`, `llm_base_url`.

**Demo backend** (`server/.env` + `server/config.py`):
- `DAILY_API_KEY` — Daily.co API key (required for video calls). Get from https://dashboard.daily.co.
- `DAILY_API_URL` (default `https://api.daily.co/v1`).
- `DEEPSEEK_API_KEY` — DeepSeek LLM key (for AI transcript summaries).
- `DEEPSEEK_API_URL` (default `https://api.deepseek.com/v1`).
- `PLATFORM_FEE_PCT` (default `0.15`) — platform commission.
- `BILLING_CURRENCY` (default `USD`).
- `PAYMENT_PROVIDER` (default `mock`; set to `stripe` for real payments).
- `STRIPE_SECRET_KEY` — Stripe secret key (required when `PAYMENT_PROVIDER=stripe`). Get from https://dashboard.stripe.com/test/apikeys.
- `STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (frontend uses for Elements).
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (optional for dev, required for prod).
- `ENABLE_PAYOUT_SCHEDULER` (default `true`), `PAYOUT_SCHEDULE_HOUR` (default `4`).
  - For multi-worker/prod, set `ENABLE_PAYOUT_SCHEDULER=false` and run `run_payouts.py` from cron instead.

---

## 6. Running the tests

> ⚠️ These suites were **written but not executed in the dev sandbox** — that
> environment had no network (couldn't install deps) and only macOS-native
> packages. Every changed Python file was byte-compiled (`py_compile`) and the
> TS was reviewed against `tsconfig`, but please run the suites on a real machine.

```bash
# FR-03 (behavioral backend)
cd phxnorth-backend && poetry run pytest tests/api/v1/test_questions.py

# FR-05 + FR-07 (demo backend)
cd PhxNorth/server && source venv/bin/activate
pip install pytest                       # not in requirements.txt yet
pytest tests/

# Frontend type-check / build
cd PhxNorth && npm run build
```

Note: `typescript` is not currently a devDependency (Vite uses esbuild). Add it
(`npm i -D typescript`) if you want `tsc --noEmit` type-checking.

---

## 7. Known gaps / next steps

- **FR-03:** surface the structured-agenda (`/questions/agenda`) step in the UI; optionally emit a `question_structured` event to `/api/v1/events` (feeds FR-06). *(Mentor matching is now wired to real mentors — see Mentor matching below.)*
- **Matching:** activate the DISC/5D behavioral component (`_behavioral_score`) via the behavioral backend; consider an LLM/embedding semantic step and a feedback loop from session ratings; optionally wire the results-card buttons to `createRequest`.
- **FR-04:** ~~pick a video provider~~ ✅ Done — Daily.co integrated. Remaining: virtual backgrounds, in-call AI suggestions, waiting room, workshop polls/Q&A (all V2).
- **FR-05:** ~~capture/store video transcripts once FR-04 lands~~ ✅ Done — transcripts captured via Daily webhook, stored in session model. Remaining: retention/privacy policy; consider moving chat into `phxnorth-backend`.
- **FR-06:** confirm chat events reach the behavioral backend's daily DISC recompute (the Kafka consumer bridge described in `phxnorth-backend/docs/superpowers/`).
- **FR-07:** ~~implement Stripe Connect~~ ✅ Done — `StripeProvider` + Connect onboarding + Stripe Elements card form + webhook. Remaining: multi-currency (V2); subscription billing (V2); invoice PDF (V2); float-to-cents migration (tech debt).
- **Cross-cutting:** unify identity between the two backends (demo backend integer IDs ↔ behavioral backend UUIDs; `"me"` alias added 2026-06-04).

---

## 8. Changes — 2026-06-15

### Wallet & per-minute credit metering (FR-07 enhancement)
- **Wallet system:** New `Wallet` and `WalletTransaction` models; mentees must have credit to join video calls
- **Per-minute billing:** Frontend 60-second debit loop during calls; mentor sets own `per_minute_rate` (default $0.10/min)
- **Warnings:** Low-balance ($1) and depleted ($0) modals shown to both parties; 3-minute countdown on depletion; forced disconnect
- **Mid-call top-up:** Mentees can add credit without leaving the call
- **Auto-reload:** Configurable threshold + amount; charges saved card automatically during calls
- **Reconciliation:** Post-call adjustment comparing Daily.co duration vs wallet debits
- **Billing page:** Wallet card with balance display, top-up, auto-reload settings, transaction history
- **Pre-join gate:** Balance check modal on SessionDetail and MentorCalendar before joining calls
- **Spec:** `docs/superpowers/specs/2026-06-12-wallet-credit-metering-design.md`
- **Plan:** `docs/superpowers/plans/2026-06-12-wallet-credit-metering.md`

### Heartbeat-based online status
- **Problem:** Mentor online status was a static boolean; seeded mentors showed "online" forever
- **Fix:** Added `last_heartbeat` timestamp on User; `POST /api/profile/heartbeat` endpoint; frontend pings every 30s; mentor listing checks heartbeat freshness (2-min timeout); mentors auto-offline when they close browser
- **Seed data:** All mentors now seed as offline (become online only when logged in)

### Scheduled session datetime picker
- **Problem:** "Scheduled" mentorship requests had no way to specify when
- **Fix:** Added `proposed_datetime` datetime-local picker to FindMentor request modal; required for scheduled sessions; sent to backend as ISO datetime

### Edit details goal form
- **Problem:** "Edit details" button on assumed-goal step was a no-op stub
- **Fix:** Fields start read-only; clicking "Edit details" enables editing with visual feedback (white bg, blue border, shadow, auto-focus)

### Auth & UX improvements
- **Auto-logout on 401:** `fetchAPI` now clears stale tokens and redirects to `/login` on authentication failures
- **Wallet-based booking check:** Replaced Stripe card-on-file requirement with wallet balance check in MenteeQuestionEntry
- **Kafka startup timeout:** Added 10-second `asyncio.wait_for` to Kafka producer/consumer `start()` so the behavioral backend doesn't hang when Kafka is unavailable
- **Stripe SDK fix:** Replaced `card.get("last4")` with `getattr(card, "last4", None)` for newer Stripe Python SDK compatibility

## 9. Git state (as of this update)

Both repos on `main`, all work committed and pushed.

**As of 2026-06-15:** Vite build clean. Wallet credit metering fully implemented across backend and frontend. Heartbeat-based online status replaces static boolean. All FR-04 through FR-08 features have working implementations.

Suggested commit grouping: one commit per feature (FR-03, FR-07, FR-05) per repo. Consider adding `server/*.db` and `server/uploads/` to `.gitignore` if not already.
