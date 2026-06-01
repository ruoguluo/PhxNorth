# PhxNorth — Feature Requirements

> Living document. New requirements are appended over time. Each requirement has a stable ID so it can be referenced in plans, branches, and PRs.

**Status legend:** ⬜ Not started · 🟡 In progress / partial · ✅ Done
**Last updated:** 2026-05-30

---

## Implementation status audit (2026-05-30)

A code review of both repos found that much more is built than first assumed. Summary:

| ID | Feature | Status | What exists | Main gap |
|----|---------|--------|-------------|----------|
| FR-01 | Resume upload & parsing | 🟡 Mostly done | Backend `cv` API (upload / paste-text / status / latest), `cv_parser` with PDF/DOCX/LLM extractors + async job; frontend `CVUpload` wired via `disc-api.ts` | Confirm/correct-extracted-data review screen; LinkedIn import |
| FR-02 | 5D growth analysis | 🟡 Mostly done | Backend `disc-profile`, `…/history`, `career`, `preferences`, `risk`, `contradiction`, `behavioral-shift`; `disc_scorer` (+ shift detector); frontend `FiveDSnapshot` fully wired (radar, DISC bars, SPI, gaps) | Explicit progress-over-time/trajectory view (history endpoint exists but not charted); mentor-vs-mentee presentation |
| FR-03 | AI question structuring | 🟡 Built (2026-05-30) | Real backend `/api/v1/questions/interpret` + `/agenda` (DeepSeek via shared LLM helper, graceful fallback); `MenteeQuestionEntry` now calls them instead of mocks; pytest written | Mentor matching still mocked; agenda UI not yet surfaced; tests not run in-sandbox (no deps) |
| FR-04 | Video meeting scheduling | 🟡 Scheduling only | Demo `server/` sessions (`scheduled_at`, `duration_minutes`), request→session creation, availability, calendar | **No video** — no meeting URL field, no Zoom/Meet/etc. integration |
| FR-05 | Conversation persistence | ✅ Extended (2026-05-31) | Session chat (CRUD + WebSocket + file upload + read receipts + DISC signal dispatch) **plus** a durable `Conversation` thread spanning sessions: `/api/conversations` (list/inbox, cross-session history, unread, mark-read, send, search), startup backfill, and a `Messages` inbox UI | Lives in demo `server/` (SQLite); video transcripts (needs FR-04); retention/privacy policy |
| FR-06 | Daily AI job → update 5D | 🟡 Infra done | Celery Beat: daily DISC recompute (3:30 UTC), daily risk (5:00), metric aggregation, weekly contradiction; workers + `signal_extractor` | Wire demo-server chat events → `phxnorth-backend` `/events` ingestion so conversations actually feed the daily recompute |
| FR-07 | Billing | 🟡 Built (2026-05-30) | Ledger model (Payment/Payout/LedgerEntry) + `PaymentProvider` abstraction with `MockProvider`; authorize@booking / capture@completion / void / refund hooked into session lifecycle; `/api/billing` API; daily payout scheduler + cron script; role-aware Billing UI; configurable 15% fee; pytest written | Real processor (Stripe Connect) not wired; card-collection UI for live mode; tests not run in-sandbox (no deps) |

**Biggest "looks done but isn't":** FR-03 (mocked AI). **True greenfield:** FR-07 (billing) and the video half of FR-04.

**Architecture note:** behavioral AI lives in `phxnorth-backend` (`/api/v1`, Postgres) and the frontend already calls it directly via `src/lib/disc-api.ts` (Vite proxies `/api/v1` → `:8000`). Mentorship/messaging lives in the demo `server/` (SQLite, `/api` → `:8081`). So two backends are live simultaneously. The conversation→DISC signal bridge currently sits in the demo server; FR-06 needs those signals to reach `phxnorth-backend`.

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

#### FR-03 — AI-assisted question structuring 🟡
*Actor: Mentee*

The system helps a mentee turn a raw question/problem into a well-structured question before it reaches a mentor.

- Builds on the existing `MenteeQuestionEntry` page.
- AI (DeepSeek via the backend's OpenAI-compatible client) reformulates/clarifies the mentee's input: suggests context to add, breaks the problem down, proposes a clearer phrasing.
- Structured question is what gets attached to the mentorship request/session.
- Likely also emits behavioral signals (`signal_extractor`) that feed the 5D model.

**Open questions:** new backend endpoint needed (no `questions` API exists yet); whether the AI suggestion is mandatory or optional; how the structured output is stored.

---

### System features (platform-wide / automated)

#### FR-04 — Video meeting scheduling 🟡
*Actors: Mentee, Mentor, System*

Mentees and mentors can schedule video meetings together.

- Builds on existing mentor `availability`, `calendar`, sessions, and requests flows.
- Generate/attach a video meeting link to each scheduled session.
- Calendar visibility for both parties; reminders/notifications.

**Open questions:** video provider (Zoom / Google Meet / Daily / Twilio / built-in WebRTC?); calendar sync (Google/Outlook) or internal only; time-zone handling; reschedule/cancel rules.

#### FR-05 — Conversation persistence ✅
*Actors: Mentee, Mentor, System*

All conversations between mentees and mentors are retained.

- Persist chat/messages (and ideally meeting transcripts) tied to the session and both participants.
- Note: the demo `server/` already has a `message` model — production needs a durable, queryable store that the daily AI job (FR-06) can read.
- Must support the behavioral-signals pipeline already drafted in `phxnorth-backend/docs/superpowers/` (chat behavioral signals plan/spec).

**Open questions:** retention policy & privacy/consent; whether voice/video is transcribed; encryption-at-rest requirements; data-access rules for the AI job.

#### FR-06 — Daily AI job to update 5D models 🟡
*Actor: System*

A scheduled daily job analyzes stored conversations and updates the 5D models for **both** the mentee and the mentor.

- Runs as a Celery/Kafka worker (infra already present: `app/workers/`, `signal_extractor_task.py`).
- Reads new conversation data (FR-05) → extracts signals → re-scores DISC → recomputes 5D snapshots (FR-02) for each participant.
- Writes a new dated snapshot so progress/trajectory is preserved.
- Should be idempotent and only process new/changed conversations since last run.

**Open questions:** exact schedule/time-zone; how mentor and mentee signals are attributed separately from a shared transcript; cost controls on LLM usage.

#### FR-07 — Billing system 🟡
*Actors: Mentee (charged), Mentor (paid), Admin, System*

A billing system that charges mentees and pays out mentors.

- **Charge mentees** for sessions/subscriptions (define pricing model: per-session, package, or subscription — TBD).
- **Pay mentors** based on completed/charged sessions (define payout model and schedule — TBD).
- Track balances, invoices, transaction history; admin oversight/reporting.
- Tie billing events to completed sessions (FR-04) and the existing session-completion logic.

**Open questions:** payment processor (Stripe Connect is the natural fit for marketplace charge + payout); pricing & payout models; currency/tax/withholding; refunds & disputes; payout schedule and minimum thresholds.

---

## Cross-cutting notes & dependencies

- **Frontend ↔ backend wiring** is the umbrella effort. Decide: does the React app call `phxnorth-backend` (`/api/v1/...`) directly, or does the demo `server/` proxy to it? And where is `phxnorth-backend` deployed (local vs hosted)? *(Pending answer from Russell.)*
- **Dependency order:** FR-05 (conversation storage) is a prerequisite for FR-06 (daily AI job). FR-04 (sessions/meetings) is a prerequisite for FR-07 (billing). FR-01 feeds FR-02.
- **Auth/identity:** the two backends currently have separate auth (demo `server/` JWT vs `phxnorth-backend` auth). Unifying identity is implied by connecting them.

---

## Appendix — Requirements added later

> Append new requirements below with the next FR-xx id. Keep the same fields: id, title, status, actors, description, open questions.

<!-- FR-08 ... -->
