# PhxNorth — Feature Requirements

> Living document. New requirements are appended over time. Each requirement has a stable ID so it can be referenced in plans, branches, and PRs.

**Status legend:** ⬜ Not started · 🟡 In progress / partial · ✅ Done
**Last updated:** 2026-06-04

> For a function/endpoint-level inventory of what's built, see `IMPLEMENTED_FEATURES.md`.

---

## Implementation status audit (updated 2026-06-01)

A code review of both repos found that much more is built than first assumed. Summary:

| ID | Feature | Status | What exists | Main gap |
|----|---------|--------|-------------|----------|
| FR-01 | Resume upload & parsing | ✅ Done (2026-06-04) | Backend `cv` API + `cv_parser`; CVUpload page with progress tracking; **CVUpload → ProfileSetup review flow connected** (redirect with `?from=cv`); AI Parsed Draft panel with field confirmation; auto-populate career timeline from CV data | LinkedIn import (stub) |
| FR-02 | 5D growth analysis | ✅ Done (2026-06-04) | Full 5D snapshot (radar, DISC bars, SPI, risk, gaps); **progress-over-time line chart** (calls `discProfileAPI.history()`); **behavioral shift visualization** (calls `discRiskAPI.behavioralShift()`); confidence trend chart | Mentor-vs-mentee comparison view (V2) |
| FR-03 | AI question structuring | ✅ Done (2026-06-04) | Real LLM backend (`/interpret` + `/agenda`); **agenda shown in both Quick and Structured flows**; agenda items with depth levels, estimated times, purposes; **agenda attached to session requests** in message field | Agenda editing/reorder (V2); goal clarity scoring (V2) |
| FR-08 | Mentor matching | 🟡 Built (2026-05-31) | `POST /api/mentorship/match` ranks real mentors on intent (FR-03 understanding) vs specializations/industry/bio + track record + logistics; replaces the hardcoded list in `MenteeQuestionEntry`; explainable reasons; pytest written | DISC/5D behavioral compatibility is a neutral phase-2 hook; results-card buttons don't yet create a request; tests not run in-sandbox |
| FR-04 | Video meeting scheduling | ✅ Done (2026-06-04) | Daily.co integration: room management API, 1v1 VideoCall + WorkshopCall pages, cloud recording, live transcription, AI summaries (DeepSeek), screen sharing, whiteboard. Custom React UI with `@daily-co/daily-js` SDK. Session/Workshop models extended with video fields. Webhook endpoint for recording/transcription events. | Real Daily API key required for live calls; virtual backgrounds (V2) |
| FR-05 | Conversation persistence | ✅ Extended (2026-05-31) | Session chat (CRUD + WebSocket + file upload + read receipts + DISC signal dispatch) **plus** a durable `Conversation` thread spanning sessions: `/api/conversations` (list/inbox, cross-session history, unread, mark-read, send, search), startup backfill, and a `Messages` inbox UI | Lives in demo `server/` (SQLite); video transcripts (needs FR-04); retention/privacy policy |
| FR-06 | Daily AI job → update 5D | 🟡 Infra done | Celery Beat: daily DISC recompute (3:30 UTC), daily risk (5:00), metric aggregation, weekly contradiction; workers + `signal_extractor` | Wire demo-server chat events → `phxnorth-backend` `/events` ingestion so conversations actually feed the daily recompute |
| FR-07 | Billing | ✅ Done (2026-06-04) | Ledger model + `PaymentProvider` abstraction with `MockProvider` AND `StripeProvider` (Stripe Connect Standard). Authorize@booking / capture@completion / void / refund. Mentor Stripe Connect onboarding (account creation + hosted KYC). Mentee card collection via Stripe Elements (SetupIntent + CardElement). Stripe webhook handling. 15% fee split + daily payout scheduler via Stripe Transfer. Role-aware Billing UI with Connect status + card management. 55 tests passing (9 Stripe-specific). | Multi-currency (V2); subscription billing (V2); invoice PDF generation (V2) |

**All features now at ✅ Done or 🟡 Built:** FR-01 (resume+review), FR-02 (5D+history+shifts), FR-03 (AI questions+agenda), FR-04 (video via Daily.co), FR-05 (conversations), FR-07 (billing+Stripe), FR-08 (mentor matching). **Remaining:** FR-06 end-to-end wiring (chat events → behavioral backend DISC recompute), and FR-08 DISC behavioral compatibility hook.

**Architecture note:** behavioral AI lives in `phxnorth-backend` (`/api/v1`, Postgres) and the frontend calls it directly via `src/lib/disc-api.ts` / `question-api.ts` (Vite proxies `/api/v1` → `:8000`). Mentorship/messaging/billing lives in the demo `server/` (SQLite, `/api` → `:8081`). So two backends are live simultaneously — the frontend talks to both directly (the demo server is **not** a proxy). The conversation→DISC signal bridge currently sits in the demo server; FR-06 needs those signals to reach `phxnorth-backend`.

---

## Context

PhxNorth is an AI-native human-capital platform. Development focus right now is **connecting the React frontend (`PhxNorth/`) to the production behavioral backend (`phxnorth-backend/`)** so that the platform's AI features (CV parsing, DISC/5D analysis, risk) work end-to-end for real users.

Key existing building blocks these requirements build on:

- **Backend services** (`phxnorth-backend/app/services/`): `cv_parser`, `disc_scorer`, `risk_analyzer`, `signal_extractor`, plus `webhook` and `career` APIs (FastAPI, async SQLAlchemy/Postgres, Redis, Kafka, Celery).
- **Backend models**: `career`, `disc`, `behavioral`, `user`, `webhook`.
- **Frontend pages** (`PhxNorth/src/app/pages/`): `CVUpload`, `CareerAnalytics`, `FiveDSnapshot`, `RiskDashboard`, `MenteeQuestionEntry`, mentor/mentee dashboards, calendar, sessions, requests.
- **5D model**: the FiveDSnapshot radar maps the four DISC scores (D/I/S/C) into five growth dimensions — **Capability Depth, Execution Pattern, Decision Orientation, Collaboration Style, Growth Trajectory**.

### Actors

- **Mentee** — receives mentorship; primary subject of 5D growth analysis.
- **Mentor** — provides mentorship; also has a 5D profile.
- **Admin** — platform operations, billing oversight, risk review.
- **System** — scheduled/automated jobs (AI analysis, billing runs).

---

## Requirements

### Shared features (Mentee **and** Mentor)

#### FR-01 — Resume upload & parsing 🟡
*Actors: Mentee, Mentor*

A user can upload a resume/CV and the system parses it into structured career data.

- Upload UI: existing `CVUpload` page wired to the backend `cv` API (`phxnorth-backend/app/api/v1/cv.py`).
- Supported formats: PDF and DOCX (backend already depends on `pdfplumber` and `python-docx`).
- Parsing extracts structured fields via `cv_parser` service → persisted to the `career` models (roles, seniority, employment type, dates, turning points).
- On success, the parsed profile feeds downstream 5D / DISC analysis (see FR-02).
- Show parse status (queued → parsing → done/failed) and a review screen so the user can confirm/correct extracted data.

**Open questions:** file size limits; whether users can re-upload/replace; LinkedIn/paste import (`ProfileSource` already supports `linkedin`, `paste`, `manual`).

#### FR-02 — 5D growth progress analysis 🟡
*Actors: Mentee, Mentor*

The system produces and displays each user's 5D growth profile and tracks progress over time.

- Compute the 5 dimensions (Capability Depth, Execution Pattern, Decision Orientation, Collaboration Style, Growth Trajectory) from DISC scores (`disc_scorer`) plus career data.
- Display in the existing `FiveDSnapshot` page (radar + DISC bars + SPI composite + data-gap callouts), wired to the live `disc` / `career` / `risk` endpoints instead of mock data.
- **Progress over time:** persist periodic snapshots so the UI can show trajectory/deltas, not just a current value. Surface "shift" information from `disc_scorer/shift_detector`.
- Confidence/clarity per dimension must be shown (data is incomplete early on).

**Open questions:** snapshot cadence (event-driven vs daily — see FR-07); how mentor 5D differs in presentation from mentee 5D.

---

### Mentee-specific features

#### FR-03 — AI-assisted question structuring 🟡 (built)
*Actor: Mentee*

The system helps a mentee turn a raw question/problem into a well-structured question before it reaches a mentor.

**Built:** `POST /api/v1/questions/interpret` and `/agenda` (DeepSeek via shared LLM client, with heuristic fallback when the key is absent). `MenteeQuestionEntry` calls them instead of the old `setTimeout` mocks. Stateless on the text, so the structured result is attached to the mentorship request created in the demo server.

**Remaining:** surface the agenda step in the UI; optionally emit a `question_structured` event to `/api/v1/events` (feeds FR-06).

---

### System features (platform-wide / automated)

#### FR-04 — Video meeting scheduling 🟡
*Actors: Mentee, Mentor, System*

Mentees and mentors can schedule video meetings together.

- Builds on existing mentor `availability`, `calendar`, sessions, and requests flows.
- Generate/attach a video meeting link to each scheduled session.
- Calendar visibility for both parties; reminders/notifications.

**Open questions:** video provider (Zoom / Google Meet / Daily / Twilio / built-in WebRTC?); calendar sync (Google/Outlook) or internal only; time-zone handling; reschedule/cancel rules.

#### FR-05 — Conversation persistence ✅ (built)
*Actors: Mentee, Mentor, System*

All conversations between mentees and mentors are retained.

**Built:** session chat (REST + WebSocket + file upload + read receipts + DISC signal dispatch) plus a durable `Conversation` thread spanning sessions. `/api/conversations` provides inbox list, cross-session history (+ search), mark-read, and conversation-level send. Startup migration backfills old messages; a `Messages` inbox UI lists threads.

**Remaining / open questions:** retention & privacy/consent policy; meeting-transcript capture (needs FR-04); encryption-at-rest; whether to move the store into `phxnorth-backend` (currently SQLite in the demo server).

#### FR-06 — Daily AI job to update 5D models 🟡
*Actor: System*

A scheduled daily job analyzes stored conversations and updates the 5D models for **both** the mentee and the mentor.

- Runs as a Celery/Kafka worker (infra already present: `app/workers/`, `signal_extractor_task.py`).
- Reads new conversation data (FR-05) → extracts signals → re-scores DISC → recomputes 5D snapshots (FR-02) for each participant.
- Writes a new dated snapshot so progress/trajectory is preserved.
- Should be idempotent and only process new/changed conversations since last run.

**Open questions:** exact schedule/time-zone; how mentor and mentee signals are attributed separately from a shared transcript; cost controls on LLM usage.

#### FR-07 — Billing system 🟡 (built, mock provider)
*Actors: Mentee (charged), Mentor (paid), Admin, System*

A billing system that charges mentees and pays out mentors.

**Decisions locked:** per-session pricing; authorize at booking / capture at completion; processor-agnostic (ledger + `PaymentProvider` abstraction) with a `MockProvider` for now; configurable platform fee (default 15%); payouts on a daily schedule.

**Built:** `Payment`/`Payout`/`LedgerEntry` models; authorize/capture/void/refund hooked into the session lifecycle; `/api/billing` API (payments, summary, payouts, admin run, webhook stub); daily payout scheduler + `run_payouts.py`; role-aware Billing UI.

**Remaining:** wire a real processor (Stripe Connect) behind the interface; card-collection UI for live mode; tax/withholding; disputes; payout thresholds.

---

## Cross-cutting notes & dependencies

- **Frontend ↔ backend wiring** — *decided:* the React app calls **both** backends directly (`/api/v1/*` → `phxnorth-backend`, `/api/*` → demo `server/`); the demo server is not a proxy. Local dev via Docker (`make up`) or native (`make dev-all`).
- **Dependency order:** FR-05 (conversation storage) is a prerequisite for FR-06 (daily AI job). FR-08 (matching) uses FR-03's intent. FR-01 feeds FR-02. Billing (FR-07) hooks the session lifecycle.
- **Auth/identity:** the two backends still have separate auth (demo `server/` JWT vs `phxnorth-backend`). Unifying identity is the main remaining cross-cutting task — and the blocker for activating the DISC/5D component of FR-08 matching.

---

## Appendix — Requirements added later

> Append new requirements below with the next FR-xx id. Keep the same fields: id, title, status, actors, description, open questions.

#### FR-08 — Mentor matching 🟡 (built)
*Actor: Mentee (System ranks)*

Rank mentors against what the mentee wants, using the FR-03 structured intent.

**Built:** `POST /api/mentorship/match` scores real mentors with a transparent weighted model — topic relevance (intent vs `specializations`/`industry`/`field_of_study`/`bio`) 0.35, track record 0.25, logistics 0.15, behavioral 0.15, stage 0.10 — and returns explainable `reasons`. `MenteeQuestionEntry.proceedToMatching` uses it instead of the hardcoded list.

**Remaining / open questions:** the behavioral (DISC/5D) component is a neutral phase-2 hook pending cross-backend identity; semantic/LLM matching + a ratings feedback loop; wire the results-card buttons to `createRequest`.

<!-- FR-09 ... -->
