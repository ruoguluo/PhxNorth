# Mentee Profile Summary & Management — Design Spec

**Date:** 2026-06-03
**Status:** Approved
**Scope:** Full-stack persistence for MenteeProfileSetup, new Summary section with editable bio + AI Signature Tags, profile management (edit/update)

---

## Problem

The MenteeProfileSetup page (`/app/mentee/profile-setup`) collects extensive structured data (timelines, certifications, trainings, psychometric tests, privacy settings) but stores everything in `localStorage` only. There is no backend persistence, no Summary/bio section, and the Profile page (`/app/profile`) has a non-functional Edit button.

## Solution

**Approach A (selected):** Extend the existing User model + add relational tables in the demo backend (`server/`). AI Signature Tags are computed on the frontend from existing DISC + Career API data (no new backend AI endpoint).

---

## 1. Backend Data Model

### 1.1 User Table — New Columns

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `summary` | Text | null | User-editable personal bio |
| `functional_expertise` | JSON | null | List of strings |
| `markets_of_interest` | JSON | null | List of strings |
| `career_direction` | Text | null | |
| `preferred_mentor_geography` | String(100) | null | |
| `global_visibility` | String(20) | "public" | public / private / custom |
| `show_current_company` | Boolean | True | |
| `show_full_timeline` | Boolean | True | |
| `allow_enterprise_view` | Boolean | False | |
| `allow_mentor_discovery` | Boolean | True | |

### 1.2 New Table: `timeline_entries`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | Integer | PK, autoincrement | |
| `user_id` | Integer | FK → users.id, NOT NULL, indexed | |
| `type` | String(20) | NOT NULL | education / career / business |
| `title` | String(255) | NOT NULL | Job title / degree / project name |
| `organization` | String(255) | | Company / school / org |
| `hide_organization` | Boolean | default False | |
| `start_date` | String(20) | | YYYY-MM format |
| `end_date` | String(20) | nullable | null = present |
| `is_current` | Boolean | default False | |
| `location` | String(255) | | |
| `industry_l1` | String(100) | | |
| `industry_l2` | String(100) | | |
| `industry_l3` | String(100) | | |
| `description` | Text | | For business type |
| `degree_level` | String(50) | | For education type |
| `field_of_study` | String(100) | | For education type |
| `visibility` | String(20) | default "public" | public / private |
| `sort_order` | Integer | default 0 | |
| `created_at` | DateTime | auto | |
| `updated_at` | DateTime | auto | |

### 1.3 New Table: `credentials`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | Integer | PK, autoincrement | |
| `user_id` | Integer | FK → users.id, NOT NULL, indexed | |
| `type` | String(20) | NOT NULL | certification / training / psychometric |
| `name` | String(255) | NOT NULL | |
| `issuer` | String(255) | | |
| `date_obtained` | String(20) | | |
| `expiry_date` | String(20) | nullable | |
| `credential_id` | String(100) | nullable | |
| `training_type` | String(50) | nullable | Online Course / Workshop / etc |
| `duration` | String(50) | nullable | |
| `test_type` | String(50) | nullable | DISC / MBTI / etc |
| `result_summary` | Text | nullable | |
| `visibility` | String(20) | default "public" | public / private |
| `created_at` | DateTime | auto | |

---

## 2. Backend API Endpoints

### 2.1 Profile (extended)

**`PUT /api/profile`** — Extend `ProfileUpdateRequest` to include all new User columns plus previously locked fields (`degree_level`, `field_of_study`, `years_experience`, `keep_name_private`, `status`). All fields Optional, partial update via `exclude_unset`.

### 2.2 Timeline Entries

All endpoints require authentication. Ownership is enforced (user can only access their own entries).

| Method | Endpoint | Body / Params | Response |
|--------|----------|---------------|----------|
| GET | `/api/profile/timeline` | `?type=education\|career\|business` (optional) | `TimelineEntry[]` |
| POST | `/api/profile/timeline` | `TimelineEntryCreate` | `TimelineEntry` |
| PUT | `/api/profile/timeline/{id}` | `TimelineEntryUpdate` | `TimelineEntry` |
| DELETE | `/api/profile/timeline/{id}` | — | `204 No Content` |
| PUT | `/api/profile/timeline/reorder` | `[{id, sort_order}]` | `TimelineEntry[]` |

### 2.3 Credentials

| Method | Endpoint | Body / Params | Response |
|--------|----------|---------------|----------|
| GET | `/api/profile/credentials` | `?type=certification\|training\|psychometric` (optional) | `Credential[]` |
| POST | `/api/profile/credentials` | `CredentialCreate` | `Credential` |
| PUT | `/api/profile/credentials/{id}` | `CredentialUpdate` | `Credential` |
| DELETE | `/api/profile/credentials/{id}` | — | `204 No Content` |

---

## 3. Frontend Changes

### 3.1 API Client (`src/lib/api.ts`)

Add `timelineAPI` and `credentialAPI` with full CRUD methods. Extend `ProfileUpdateRequest` TypeScript type with all new fields.

### 3.2 MenteeProfileSetup — Save Mechanism

- Remove `localStorage` persistence (`phxnorth_profile_draft`)
- Each section's Save button calls the corresponding API
- On page mount, load existing data from APIs in parallel:
  - `profileAPI.get()` → basic fields + summary + privacy
  - `timelineAPI.list()` → education / career / business entries
  - `credentialAPI.list()` → certifications / training / psychometric
  - DISC + Career APIs → Signature Tags (independent, failure OK)
- Use `Promise.allSettled` so any single failure doesn't block the page

### 3.3 New Summary Section

Added to sidebar as a new section after "Overview".

**Upper half — Editable Bio:**
- Textarea for `summary` field
- Save calls `profileAPI.update({ summary })`
- Character count indicator

**Lower half — AI Signature Tags (read-only, computed from DISC + Career):**

| Tag Category | Data Source | Mapping |
|-------------|------------|---------|
| Strengths | `DISCProfile.scores` + `traits` | Primary/secondary type → trait words; confidence as % |
| Domain Signals | `CareerProfile.job_entries` + `User.industry` | Extract industry/role keywords, sort by frequency |
| Decision & Risk Style | `PreferenceIndexes` | stability_vs_growth, risk tolerance → style labels |
| Collaboration Style | `DISCProfile.scores.I` + `.S` | I/S score ranges → collaboration style labels |

Each tag shows a confidence percentage from `DISCProfile.confidence`. When no DISC data exists, show a call-to-action: "Upload your CV or complete 5D Analysis to generate Signature Tags".

### 3.4 Profile Page (`/app/profile`)

- Wire Edit button to navigate to `/app/mentee/profile-setup`
- Display `summary` and Signature Tags (read-only)
- Load real data from APIs instead of relying solely on auth context

### 3.5 Data Loading Flow

```
Page mount (MenteeProfileSetup)
 ├── profileAPI.get()             → fill basic fields + summary + privacy
 ├── timelineAPI.list()           → fill education / career / business
 ├── credentialAPI.list()         → fill certifications / training / psychometric
 └── discProfileAPI.get('me')     → compute Signature Tags
     + discCareerAPI.get('me')
     + discCareerAPI.preferences('me')
```

---

## 4. Files to Create / Modify

### Backend (server/)
- **Modify:** `models/user.py` — add new columns
- **Create:** `models/timeline_entry.py` — TimelineEntry model
- **Create:** `models/credential.py` — Credential model
- **Modify:** `schemas/user.py` — extend ProfileUpdateRequest, UserResponse
- **Create:** `schemas/timeline.py` — create/update/response schemas
- **Create:** `schemas/credential.py` — create/update/response schemas
- **Create:** `routers/timeline.py` — CRUD endpoints
- **Create:** `routers/credentials.py` — CRUD endpoints
- **Modify:** `routers/profile.py` — no structural changes, schema extension handles it
- **Modify:** `main.py` — register new routers, ensure new tables are created
- **Modify:** `database.py` — import new models so `create_all` picks them up
- **Modify:** `seed.py` — optionally seed sample timeline/credential data

### Frontend (src/)
- **Modify:** `src/lib/api.ts` — add timelineAPI, credentialAPI, extend types
- **Modify:** `src/app/pages/MenteeProfileSetup.tsx` — replace localStorage with API calls, add Summary section
- **Modify:** `src/app/pages/Profile.tsx` — wire Edit button, show summary + tags

---

## 5. Out of Scope

- LinkedIn import (remains "coming soon")
- Backend AI endpoint for Signature Tags (frontend computes from existing APIs)
- Mentor profile setup (this spec is mentee-only)
- Public profile changes beyond what's already there
- Database migrations (demo backend uses SQLite with `create_all`)
