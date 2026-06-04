# Real-Time Video Conferencing — Design Spec

**Date:** 2026-06-04
**Status:** Approved
**Scope:** Full video conferencing system using Daily.co — 1v1 mentorship calls, workshop multi-person calls, cloud recording, live transcription, AI summaries, screen sharing, whiteboard.

---

## Problem

The platform has full session scheduling, text chat (WebSocket), and session management, but zero video call capability. "Join Session" buttons navigate to a text-only session detail page. No video provider, no WebRTC code, no recording, no transcription exists.

## Solution

Integrate Daily.co as the video provider via their REST API (backend) and `@daily-co/daily-js` SDK (frontend). Custom React UI for video (not Prebuilt iframe) to integrate with existing agenda/chat panels. Cloud recording + live transcription via Daily, AI summaries via DeepSeek LLM.

---

## 1. Architecture

```
User clicks "Join Session"
       |
Frontend: POST /api/mentorship/sessions/{id}/room
       |
Backend: Daily REST API → create room + generate meeting token
       |
Return { room_url, token } to frontend
       |
Frontend: daily.createCallObject() → call.join({ url, token })
       |
Video call in progress (Daily cloud-relayed media)
       |
Call ends → Daily Webhook → Backend receives recording/transcription events
       |
Backend: save recording_url + transcript → trigger LLM summary
```

---

## 2. Data Model

### 2.1 Session Table — New Columns

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `daily_room_name` | String(100) | null | Unique room identifier |
| `daily_room_url` | String(500) | null | Full Daily room URL |
| `recording_url` | String(500) | null | Cloud recording download URL |
| `transcript_text` | Text | null | Full transcript (JSON: [{speaker, timestamp, text}]) |
| `ai_summary` | Text | null | AI-generated summary (JSON: {key_points, action_items, follow_ups, progress_notes}) |
| `call_started_at` | DateTime | null | Actual call start |
| `call_ended_at` | DateTime | null | Actual call end |
| `call_duration_seconds` | Integer | null | Actual call duration |

Room naming: `phxnorth-session-{session_id}-{unix_timestamp}`

### 2.2 Workshop Table — New Columns

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `daily_room_name` | String(100) | null | |
| `daily_room_url` | String(500) | null | |
| `recording_url` | String(500) | null | |
| `transcript_text` | Text | null | |

---

## 3. Backend API

### 3.1 Daily API Service (`server/services/daily.py`)

Wraps Daily REST API (`https://api.daily.co/v1`):

- `create_room(name, duration_minutes, enable_recording, max_participants)` → `POST /rooms`
- `create_token(room_name, user_name, user_id, is_owner, exp)` → `POST /meeting-tokens`
- `get_room(room_name)` → `GET /rooms/{name}`
- `delete_room(room_name)` → `DELETE /rooms/{name}`

Config via environment variables:
- `DAILY_API_KEY` — Daily API key (required)
- `DAILY_API_URL` — Default `https://api.daily.co/v1`

### 3.2 Session Video Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/mentorship/sessions/{id}/room` | Mentor or Mentee (session participant) | Create/get room. If room exists return it. Otherwise create via Daily API. Returns `{ room_url, token, room_name }` |
| GET | `/api/mentorship/sessions/{id}/room` | Session participant | Get room info without creating |
| DELETE | `/api/mentorship/sessions/{id}/room` | Mentor or Admin | End call, delete room |
| GET | `/api/mentorship/sessions/{id}/recording` | Session participant | Get signed recording URL |
| GET | `/api/mentorship/sessions/{id}/transcript` | Session participant | Get transcript text |
| GET | `/api/mentorship/sessions/{id}/summary` | Session participant | Get AI summary |
| POST | `/api/mentorship/sessions/{id}/summary/generate` | Session participant | Manually trigger AI summary |

**Token generation logic:**
- `room_name`: from session's `daily_room_name`
- `user_name`: user's full_name
- `user_id`: str(user.id)
- `is_owner`: true if mentor
- `exp`: session scheduled_at + duration + 30min buffer
- `enable_screenshare`: true
- `enable_recording`: true (mentor-controlled start/stop)

### 3.3 Workshop Video Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/workshops/{id}/room` | Mentor (owner) | Create workshop room |
| POST | `/api/workshops/{id}/join` | Registered mentee | Get join token |
| DELETE | `/api/workshops/{id}/room` | Mentor (owner) | End workshop call |

### 3.4 Webhook Endpoint

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/webhooks/daily` | Daily signature verification | Receive Daily events |

Events handled:
- `recording.ready-to-download` → save `recording_url` to session/workshop
- `transcription.ready-to-download` → download transcript, save to `transcript_text`, trigger AI summary
- `meeting.started` → update `call_started_at`
- `meeting.ended` → update `call_ended_at`, `call_duration_seconds`

### 3.5 AI Summary Service (`server/services/transcript_summary.py`)

Uses DeepSeek LLM (OpenAI-compatible API, already integrated in phxnorth-backend):

```
Input: transcript_text + session topic + mentor_name + mentee_name
Output JSON: {
  key_points: ["...", "..."],
  action_items: [{ task: "...", owner: "mentor"|"mentee" }],
  follow_ups: ["..."],
  progress_notes: "..."
}
```

Saved to `session.ai_summary`.

---

## 4. Frontend

### 4.1 New Pages

**`VideoCall.tsx`** — Route: `/app/session/:id/call`

1v1 video call page:
- Full-screen video: remote participant large, self PiP (bottom-right)
- Bottom control bar: mic toggle, camera toggle, screen share, record indicator, whiteboard, end call
- Left collapsible panel: session agenda (reuse from SessionDetail)
- Right collapsible panel: text chat (reuse existing WebSocket chat)
- Bottom subtitle bar: live transcription (auto-hide after 3s)

**`WorkshopCall.tsx`** — Route: `/app/workshop/:id/call`

Multi-person video call page:
- Speaker view (large) + participant gallery grid
- Same control bar + hand-raise button
- Participant list panel (with mute/unmute indicators)

### 4.2 Shared Components

| Component | Responsibility |
|-----------|---------------|
| `VideoControls.tsx` | Mic/camera/screen share/record/whiteboard/end call buttons |
| `ParticipantGrid.tsx` | Video tile grid layout (1v1 or gallery mode) |
| `Subtitles.tsx` | Live transcription overlay |
| `SessionRecording.tsx` | Post-call: video player + transcript + AI summary |
| `DeviceSelector.tsx` | Camera/mic/speaker dropdown selector |

### 4.3 Daily SDK Integration (`src/lib/daily.ts`)

Custom hooks:
- `useDaily()` — create/manage DailyCall instance
- `useParticipants()` — track participant join/leave/tracks
- `useDevices()` — enumerate and select media devices
- `useRecording()` — recording state management
- `useTranscription()` — live transcription messages

Flow:
```
Mount → POST /api/.../room → get { room_url, token }
     → daily.createCallObject()
     → call.join({ url, token })
     → bind event listeners:
          participant-joined/left → update participant state
          track-started/stopped → bind video/audio elements
          recording-started/stopped → update UI indicator
          transcription-message → display subtitle
```

### 4.4 Existing Page Modifications

**SessionDetail.tsx:**
- Add "Join Video Call" button:
  - Active when: session `upcoming` and within 15min of scheduled_at, or session `in_progress`
  - Navigates to `/app/session/:id/call`
- Add post-call section (when recording/transcript exists):
  - Video player for recording playback
  - Searchable transcript with timestamps
  - AI summary card (key points, action items, follow-ups)
  - Download buttons (recording MP4, transcript PDF)

**MentorCalendar.tsx:**
- "Join Session" navigates to `/app/session/:id/call` instead of `/app/session/:id`

**MentorWorkshops.tsx:**
- Add "Start Workshop" button (mentor, published workshops) → navigates to `/app/workshop/:id/call`
- Add "Join Workshop" for mentees on workshop detail

### 4.5 Permission Handling

On first join:
- Browser requests camera + microphone permission
- Permission denied → show guidance banner + audio-only fallback option
- Device selector dropdown for choosing camera/mic/speaker

---

## 5. Workshop vs 1v1 Differences

| Feature | 1v1 Mentorship | Workshop |
|---------|---------------|----------|
| Room creation | Either participant joins | Mentor clicks "Start Workshop" |
| Max participants | 2 | `max_participants` (up to 1000) |
| Token permissions | Mentor = owner | Mentor = owner, others = regular |
| Recording | Default on | Mentor controls |
| Layout | Side-by-side or PiP | Speaker + gallery grid |
| Hand raise | No | Yes (via `sendAppMessage`) |
| Whiteboard | Available | Available |

---

## 6. Files to Create / Modify

### Backend — Create
| File | Responsibility |
|------|---------------|
| `server/services/daily.py` | Daily REST API wrapper |
| `server/services/transcript_summary.py` | AI summary generation |
| `server/routers/video.py` | Room management + webhook + recording/transcript endpoints |

### Backend — Modify
| File | Change |
|------|--------|
| `server/models/session.py` | Add 7 video columns |
| `server/models/workshop.py` | Add 4 video columns |
| `server/schemas/mentorship.py` | Extend SessionResponse with video fields |
| `server/schemas/workshop.py` | Extend WorkshopResponse with video fields |
| `server/main.py` | Register video router |
| `.env` | Add `DAILY_API_KEY`, `DAILY_API_URL` |

### Frontend — Create
| File | Responsibility |
|------|---------------|
| `src/app/pages/VideoCall.tsx` | 1v1 video call page |
| `src/app/pages/WorkshopCall.tsx` | Workshop multi-person call page |
| `src/lib/daily.ts` | Daily SDK hooks and utilities |
| `src/app/components/VideoControls.tsx` | Call control bar |
| `src/app/components/ParticipantGrid.tsx` | Video tile grid |
| `src/app/components/Subtitles.tsx` | Live transcription overlay |
| `src/app/components/SessionRecording.tsx` | Post-call playback + transcript + summary |
| `src/app/components/DeviceSelector.tsx` | Camera/mic/speaker selector |

### Frontend — Modify
| File | Change |
|------|--------|
| `src/app/pages/SessionDetail.tsx` | Add Join Video button + post-call recording/transcript/summary section |
| `src/app/pages/MentorCalendar.tsx` | Join Session → /call route |
| `src/app/pages/MentorWorkshops.tsx` | Add Start/Join Workshop video buttons |
| `src/app/routes.tsx` | Add /session/:id/call and /workshop/:id/call routes |
| `src/lib/api.ts` | Add videoAPI client |
| `package.json` | Add `@daily-co/daily-js` |

---

## 7. Environment Setup

```bash
# .env additions
DAILY_API_KEY=your_daily_api_key_here
DAILY_API_URL=https://api.daily.co/v1

# Daily webhook URL (configure in Daily dashboard)
# https://your-domain.com/api/webhooks/daily
```

Daily.co free tier: 10,000 participant-minutes/month. Sufficient for development and early production.

---

## 8. Out of Scope

- Virtual backgrounds (Daily supports, add later)
- In-call real-time AI suggestions (V2, based on transcript stream)
- Recording playback with sentence-level seek/search (V2)
- Waiting room (V2)
- Workshop polls/Q&A (V2)
- Calendar sync with Google/Outlook (separate feature)
- End-to-end encryption for recordings at rest
