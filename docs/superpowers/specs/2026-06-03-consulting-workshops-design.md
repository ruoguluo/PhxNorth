# Enterprise Consulting & Workshops — Design Spec

**Date:** 2026-06-03
**Status:** Approved
**Scope:** Full-stack implementation of consulting projects (multi-mentor bidding) and mentor-created workshops with mentee registration. Mentor Dashboard integration.

---

## Problem

The Mentor Dashboard (`/app/mentor/dashboard`) has an "Unlock More Impact & Income" section with two hardcoded cards — "Enterprise Consulting" (3 projects waiting) and "Workshop Speaker" (2 Invitations Pending). No backend exists for either feature. All data is static.

## Solution

Build both features in the demo backend (`server/`) with new tables, CRUD APIs, and status workflows. Wire the Mentor Dashboard and existing MentorWorkshops page to real data. Add a new MentorConsulting page.

---

## 1. Enterprise Consulting

### 1.1 Flow

1. Admin creates a consulting project (title, description, budget, skills, industry)
2. Project is published with status `open`
3. Multiple mentors can view open projects and submit applications (proposal + rate)
4. Admin reviews applications and approves one mentor
5. Approved application sets project to `in_progress`, assigns the mentor
6. Admin marks project `completed` when done

### 1.2 Data Model

**Table: `consulting_projects`**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | Integer | PK, autoincrement | |
| `title` | String(255) | NOT NULL | |
| `description` | Text | nullable | |
| `client_name` | String(255) | nullable | |
| `budget_min` | Float | nullable | |
| `budget_max` | Float | nullable | |
| `duration_weeks` | Integer | nullable | |
| `required_skills` | JSON | nullable | list of strings |
| `industry` | String(100) | nullable | |
| `status` | String(20) | NOT NULL, default "open" | open / in_progress / completed / cancelled |
| `assigned_mentor_id` | Integer | FK → users.id, nullable | set when application approved |
| `created_by` | Integer | FK → users.id, NOT NULL | admin user id |
| `created_at` | DateTime | auto | |
| `updated_at` | DateTime | auto | |

**Table: `project_applications`**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | Integer | PK, autoincrement | |
| `project_id` | Integer | FK → consulting_projects.id, NOT NULL | |
| `mentor_id` | Integer | FK → users.id, NOT NULL | |
| `proposal` | Text | nullable | mentor's pitch |
| `proposed_rate` | Float | nullable | |
| `status` | String(20) | NOT NULL, default "pending" | pending / approved / rejected |
| `created_at` | DateTime | auto | |

### 1.3 API Endpoints

Prefix: `/api/consulting`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | Authenticated | List projects. Mentor sees open; Admin sees all. Filter: `?status=`, `?industry=` |
| POST | `/projects` | Admin only | Create a project |
| GET | `/projects/{id}` | Authenticated | Project detail. Admin sees applications list; Mentor sees own application status |
| PUT | `/projects/{id}` | Admin only | Update project fields |
| POST | `/projects/{id}/apply` | Mentor only | Submit application (proposal, proposed_rate) |
| PUT | `/projects/{id}/applications/{app_id}` | Admin only | Approve/reject. On approve: project.status → in_progress, project.assigned_mentor_id → mentor, other applications → rejected |
| GET | `/my-applications` | Mentor only | List own applications with project info |
| PUT | `/projects/{id}/complete` | Admin only | Mark project completed |

---

## 2. Workshops

### 2.1 Flow

1. Mentor creates a workshop (title, description, time, duration, capacity, price, tags)
2. Workshop starts as `draft`, mentor publishes when ready
3. Mentees browse published workshops and register
4. Mentor manages registrations and marks complete after delivery

### 2.2 Data Model

**Table: `workshops`**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | Integer | PK, autoincrement | |
| `mentor_id` | Integer | FK → users.id, NOT NULL | creator |
| `title` | String(255) | NOT NULL | |
| `description` | Text | nullable | |
| `scheduled_at` | DateTime | nullable | |
| `duration_minutes` | Integer | nullable | |
| `max_participants` | Integer | nullable | |
| `price` | Float | nullable | |
| `status` | String(20) | NOT NULL, default "draft" | draft / published / in_progress / completed / cancelled |
| `tags` | JSON | nullable | list of strings |
| `created_at` | DateTime | auto | |
| `updated_at` | DateTime | auto | |

**Table: `workshop_registrations`**

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | Integer | PK, autoincrement | |
| `workshop_id` | Integer | FK → workshops.id, NOT NULL | |
| `mentee_id` | Integer | FK → users.id, NOT NULL | |
| `status` | String(20) | NOT NULL, default "registered" | registered / cancelled / attended |
| `created_at` | DateTime | auto | |

### 2.3 API Endpoints

Prefix: `/api/workshops`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Authenticated | List workshops. Mentor: own workshops (all statuses). Mentee: published only. Admin: all. Filter: `?status=`, `?mine=true` |
| POST | `/` | Mentor only | Create workshop (draft) |
| GET | `/{id}` | Authenticated | Detail with registrations (owner/admin only see full registrations) |
| PUT | `/{id}` | Mentor (owner) | Update workshop |
| DELETE | `/{id}` | Mentor (owner) | Delete (draft only) |
| PUT | `/{id}/publish` | Mentor (owner) | draft → published |
| PUT | `/{id}/complete` | Mentor (owner) | published/in_progress → completed |
| POST | `/{id}/register` | Mentee only | Register for workshop. Fails if full or not published |
| DELETE | `/{id}/register` | Mentee only | Cancel registration |

---

## 3. Frontend Changes

### 3.1 API Client (`src/lib/api.ts`)

Add `consultingAPI` and `workshopAPI` with full CRUD methods. Add TypeScript types for all entities.

### 3.2 Mentor Dashboard (`MentorDashboard.tsx`)

Replace hardcoded "Enterprise Consulting" and "Workshop Speaker" cards:

**Enterprise Consulting card:**
- Fetch `GET /api/consulting/projects?status=open`
- Show real count of open projects
- 0 projects → "No projects available"
- "View Projects" button → `/app/mentor/consulting`

**Workshop Speaker card:**
- Fetch `GET /api/workshops?mine=true`
- Show count of published/upcoming workshops
- 0 workshops → "Create your first workshop"
- Button → `/app/mentor/workshops`

### 3.3 New Page: MentorConsulting (`/app/mentor/consulting`)

Two tabs:
- **Available Projects** — list open projects with title, client, budget range, skills, duration. Click to expand detail + "Submit Proposal" form (textarea + rate input)
- **My Applications** — list own applications with status badges (pending/approved/rejected)

### 3.4 Existing Page: MentorWorkshops (`/app/mentor/workshops`)

Replace `mockWorkshops` hardcoded array with real API calls:
- Load from `GET /api/workshops?mine=true`
- Create Workshop form → `POST /api/workshops`
- Edit/delete → `PUT/DELETE /api/workshops/{id}`
- Publish → `PUT /api/workshops/{id}/publish`

### 3.5 Seed Data

Add to `seed.py`:
- 3 open consulting projects (created by admin)
- 1 in_progress project (with assigned mentor and 2 applications)
- 2 workshops for mentor1 (1 published, 1 draft)
- 2 registrations for the published workshop

---

## 4. Files to Create / Modify

### Backend — Create
- `server/models/consulting_project.py` — ConsultingProject + ProjectApplication models
- `server/models/workshop.py` — Workshop + WorkshopRegistration models
- `server/schemas/consulting.py` — Pydantic schemas
- `server/schemas/workshop.py` — Pydantic schemas
- `server/routers/consulting.py` — Consulting CRUD + application endpoints
- `server/routers/workshops.py` — Workshop CRUD + registration endpoints
- `server/tests/test_consulting.py` — Consulting model tests
- `server/tests/test_workshops.py` — Workshop model tests

### Backend — Modify
- `server/main.py` — Import new models, register new routers
- `server/tests/conftest.py` — Import new models
- `server/seed.py` — Add sample consulting projects + workshops

### Frontend — Create
- `src/app/pages/MentorConsulting.tsx` — New consulting management page

### Frontend — Modify
- `src/lib/api.ts` — Add consultingAPI, workshopAPI, types
- `src/app/pages/MentorDashboard.tsx` — Wire cards to real data
- `src/app/pages/MentorWorkshops.tsx` — Replace mock data with API
- `src/app/routes.tsx` — Add `/app/mentor/consulting` route

---

## 5. Out of Scope

- Admin UI for creating consulting projects (Admin uses API directly or existing admin panel)
- Mentee workshop browse page (existing WorkshopsExplore.tsx, wire later)
- Payment integration for workshops or consulting
- Consulting project matching algorithm
- Workshop video/streaming integration
