# Video Conferencing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Daily.co for real-time video conferencing — 1v1 mentorship calls, workshop multi-person calls, cloud recording, live transcription, AI summaries, screen sharing, and whiteboard.

**Architecture:** Backend wraps Daily REST API for room/token management, receives webhooks for recording/transcription events, generates AI summaries via DeepSeek LLM. Frontend uses `@daily-co/daily-js` SDK with custom React UI integrated into the existing session/workshop pages.

**Tech Stack:** Daily.co (video provider), `@daily-co/daily-js` (frontend SDK), `httpx` (async HTTP client for Daily API), DeepSeek LLM (AI summaries), React/TypeScript (UI)

---

## File Structure

### Backend — Create
| File | Responsibility |
|------|---------------|
| `server/services/daily.py` | Daily REST API wrapper (rooms, tokens, webhooks) |
| `server/services/transcript_summary.py` | AI summary generation via LLM |
| `server/routers/video.py` | Session/workshop room endpoints + Daily webhook |
| `server/tests/test_daily_service.py` | Daily service unit tests |

### Backend — Modify
| File | Change |
|------|--------|
| `server/models/session.py` | Add 7 video columns |
| `server/models/workshop.py` | Add 4 video columns |
| `server/schemas/mentorship.py` | Extend SessionResponse |
| `server/schemas/workshop.py` | Extend WorkshopResponse |
| `server/main.py` | Register video router |

### Frontend — Create
| File | Responsibility |
|------|---------------|
| `src/lib/daily.ts` | Daily SDK hooks (useDaily, useParticipants, useDevices, useRecording, useTranscription) |
| `src/app/pages/VideoCall.tsx` | 1v1 video call page |
| `src/app/pages/WorkshopCall.tsx` | Workshop multi-person video page |
| `src/app/components/VideoControls.tsx` | Shared call control bar |
| `src/app/components/ParticipantGrid.tsx` | Video tile grid layout |
| `src/app/components/Subtitles.tsx` | Live transcription overlay |
| `src/app/components/SessionRecording.tsx` | Post-call playback + transcript + summary |

### Frontend — Modify
| File | Change |
|------|--------|
| `src/lib/api.ts` | Add videoAPI client |
| `src/app/pages/SessionDetail.tsx` | Add Join Video button + post-call section |
| `src/app/pages/MentorCalendar.tsx` | Update Join Session route |
| `src/app/pages/MentorWorkshops.tsx` | Add Start/Join Workshop video buttons |
| `src/app/routes.tsx` | Add video call routes |
| `package.json` | Add `@daily-co/daily-js` |

---

## Task 1: Extend Session & Workshop Models

**Files:**
- Modify: `server/models/session.py`
- Modify: `server/models/workshop.py`

- [ ] **Step 1: Add video columns to Session model**

In `server/models/session.py`, add after `price = Column(Float, default=0.0)` (line 24):

```python
    # Video call fields
    daily_room_name = Column(String(100), nullable=True)
    daily_room_url = Column(String(500), nullable=True)
    recording_url = Column(String(500), nullable=True)
    transcript_text = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    call_started_at = Column(DateTime, nullable=True)
    call_ended_at = Column(DateTime, nullable=True)
    call_duration_seconds = Column(Integer, nullable=True)
```

- [ ] **Step 2: Add video columns to Workshop model**

In `server/models/workshop.py`, add after `tags = Column(JSON, nullable=True)` (line 21):

```python
    # Video call fields
    daily_room_name = Column(String(100), nullable=True)
    daily_room_url = Column(String(500), nullable=True)
    recording_url = Column(String(500), nullable=True)
    transcript_text = Column(Text, nullable=True)
```

- [ ] **Step 3: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from models.session import Session; from models.workshop import Workshop; print('OK')"`

- [ ] **Step 4: Commit**

```bash
git add server/models/session.py server/models/workshop.py
git commit -m "feat: add video call columns to Session and Workshop models"
```

---

## Task 2: Extend Schemas

**Files:**
- Modify: `server/schemas/mentorship.py`
- Modify: `server/schemas/workshop.py`

- [ ] **Step 1: Extend SessionResponse**

In `server/schemas/mentorship.py`, add these fields to the `SessionResponse` class after `price`:

```python
    daily_room_name: Optional[str] = None
    daily_room_url: Optional[str] = None
    recording_url: Optional[str] = None
    transcript_text: Optional[str] = None
    ai_summary: Optional[str] = None
    call_started_at: Optional[datetime] = None
    call_ended_at: Optional[datetime] = None
    call_duration_seconds: Optional[int] = None
```

- [ ] **Step 2: Extend WorkshopResponse**

In `server/schemas/workshop.py`, add these fields to the `WorkshopResponse` class after `registered_count`:

```python
    daily_room_name: Optional[str] = None
    daily_room_url: Optional[str] = None
    recording_url: Optional[str] = None
    transcript_text: Optional[str] = None
```

- [ ] **Step 3: Add video-specific schemas to mentorship.py**

Add at the end of `server/schemas/mentorship.py`:

```python
class RoomResponse(BaseModel):
    room_url: str
    token: str
    room_name: str
```

- [ ] **Step 4: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from schemas.mentorship import RoomResponse; print('OK')"`

- [ ] **Step 5: Commit**

```bash
git add server/schemas/mentorship.py server/schemas/workshop.py
git commit -m "feat: extend Session and Workshop schemas with video fields"
```

---

## Task 3: Daily API Service

**Files:**
- Create: `server/services/daily.py`

- [ ] **Step 1: Create Daily API wrapper**

Create `server/services/daily.py`:

```python
"""Wrapper for Daily.co REST API."""

import os
import time
from datetime import datetime, timedelta

import httpx

DAILY_API_KEY = os.getenv("DAILY_API_KEY", "")
DAILY_API_URL = os.getenv("DAILY_API_URL", "https://api.daily.co/v1")


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {DAILY_API_KEY}",
        "Content-Type": "application/json",
    }


def create_room(
    session_id: int,
    duration_minutes: int = 60,
    enable_recording: bool = True,
    max_participants: int | None = None,
    entity_type: str = "session",
) -> dict:
    """Create a Daily room for a session or workshop.

    Returns dict with keys: name, url, id, created_at, config.
    """
    room_name = f"phxnorth-{entity_type}-{session_id}-{int(time.time())}"
    exp = int((datetime.utcnow() + timedelta(minutes=duration_minutes + 30)).timestamp())

    properties: dict = {
        "exp": exp,
        "enable_screenshare": True,
        "enable_chat": True,
        "enable_knocking": False,
        "start_video_off": False,
        "start_audio_off": False,
        "enable_recording": "cloud" if enable_recording else False,
        "enable_transcription_storage": enable_recording,
    }
    if max_participants:
        properties["max_participants"] = max_participants

    body = {"name": room_name, "privacy": "private", "properties": properties}

    with httpx.Client(timeout=15) as client:
        resp = client.post(f"{DAILY_API_URL}/rooms", headers=_headers(), json=body)
        resp.raise_for_status()
        return resp.json()


def create_token(
    room_name: str,
    user_name: str,
    user_id: str,
    is_owner: bool = False,
    exp_minutes: int = 120,
) -> str:
    """Create a meeting token for a participant.

    Returns the token string.
    """
    exp = int((datetime.utcnow() + timedelta(minutes=exp_minutes)).timestamp())

    body = {
        "properties": {
            "room_name": room_name,
            "user_name": user_name,
            "user_id": user_id,
            "is_owner": is_owner,
            "exp": exp,
            "enable_screenshare": True,
            "enable_recording": "cloud" if is_owner else False,
            "start_video_off": False,
            "start_audio_off": False,
        }
    }

    with httpx.Client(timeout=15) as client:
        resp = client.post(f"{DAILY_API_URL}/meeting-tokens", headers=_headers(), json=body)
        resp.raise_for_status()
        return resp.json()["token"]


def get_room(room_name: str) -> dict | None:
    """Get room info. Returns None if room doesn't exist."""
    with httpx.Client(timeout=10) as client:
        resp = client.get(f"{DAILY_API_URL}/rooms/{room_name}", headers=_headers())
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        return resp.json()


def delete_room(room_name: str) -> bool:
    """Delete a room. Returns True if deleted, False if not found."""
    with httpx.Client(timeout=10) as client:
        resp = client.delete(f"{DAILY_API_URL}/rooms/{room_name}", headers=_headers())
        if resp.status_code == 404:
            return False
        resp.raise_for_status()
        return True


def get_recording_link(room_name: str) -> str | None:
    """Get the recording download link for a room."""
    with httpx.Client(timeout=10) as client:
        resp = client.get(f"{DAILY_API_URL}/recordings", headers=_headers(), params={"room_name": room_name})
        resp.raise_for_status()
        data = resp.json()
        if data.get("data") and len(data["data"]) > 0:
            return data["data"][0].get("download_link")
        return None
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from services.daily import create_room, create_token; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/services/daily.py
git commit -m "feat: add Daily.co REST API service wrapper"
```

---

## Task 4: AI Summary Service

**Files:**
- Create: `server/services/transcript_summary.py`

- [ ] **Step 1: Create transcript summary service**

Create `server/services/transcript_summary.py`:

```python
"""Generate AI summaries from session transcripts using LLM."""

import json
import os

import httpx

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_API_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1")


def generate_summary(
    transcript_text: str,
    topic: str,
    mentor_name: str,
    mentee_name: str,
) -> dict:
    """Generate a structured summary from a session transcript.

    Returns dict with keys: key_points, action_items, follow_ups, progress_notes.
    """
    prompt = f"""You are analyzing a mentorship session transcript between {mentor_name} (mentor) and {mentee_name} (mentee). The session topic was: "{topic}".

Transcript:
{transcript_text[:8000]}

Generate a JSON object with these exact keys:
1. "key_points" - array of 3-5 key discussion points (strings)
2. "action_items" - array of objects with "task" (string) and "owner" ("mentor" or "mentee")
3. "follow_ups" - array of topics to discuss in the next session (strings)
4. "progress_notes" - a brief paragraph of observations about the mentee's progress (string)

Respond ONLY with the JSON object, no other text."""

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "max_tokens": 1000,
    }

    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post(f"{DEEPSEEK_API_URL}/chat/completions", headers=headers, json=body)
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            # Strip markdown code fences if present
            content = content.strip()
            if content.startswith("```"):
                content = content.split("\n", 1)[1]
                content = content.rsplit("```", 1)[0]
            return json.loads(content.strip())
    except Exception as e:
        return {
            "key_points": ["Summary generation failed"],
            "action_items": [],
            "follow_ups": [],
            "progress_notes": f"Error generating summary: {str(e)}",
        }
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from services.transcript_summary import generate_summary; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/services/transcript_summary.py
git commit -m "feat: add AI transcript summary service"
```

---

## Task 5: Video Router

**Files:**
- Create: `server/routers/video.py`

- [ ] **Step 1: Create video router**

Create `server/routers/video.py`:

```python
"""Video call management — room creation, tokens, webhooks, recordings."""

import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session as DBSession

from database import get_db
from models.user import User
from models.session import Session as MentorSession
from models.workshop import Workshop, WorkshopRegistration
from schemas.mentorship import RoomResponse
from services import daily as daily_service
from services.transcript_summary import generate_summary
from utils.deps import get_current_user

router = APIRouter(tags=["Video"])


# ─── Session Video ───────────────────────────────────────────────────


@router.post("/api/mentorship/sessions/{session_id}/room", response_model=RoomResponse)
def create_or_get_session_room(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Create or retrieve a Daily room for a mentorship session."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.id not in (session.mentor_id, session.mentee_id):
        raise HTTPException(status_code=403, detail="Not a participant of this session")
    if session.status not in ("upcoming", "in_progress"):
        raise HTTPException(status_code=400, detail="Session is not active")

    is_owner = current_user.id == session.mentor_id

    # Return existing room if already created
    if session.daily_room_name:
        room = daily_service.get_room(session.daily_room_name)
        if room:
            token = daily_service.create_token(
                room_name=session.daily_room_name,
                user_name=current_user.full_name or current_user.username,
                user_id=str(current_user.id),
                is_owner=is_owner,
                exp_minutes=(session.duration_minutes or 60) + 30,
            )
            return RoomResponse(
                room_url=session.daily_room_url,
                token=token,
                room_name=session.daily_room_name,
            )

    # Create new room
    room_data = daily_service.create_room(
        session_id=session.id,
        duration_minutes=session.duration_minutes or 60,
        enable_recording=True,
        max_participants=2,
        entity_type="session",
    )
    session.daily_room_name = room_data["name"]
    session.daily_room_url = room_data["url"]
    if session.status == "upcoming":
        session.status = "in_progress"
        session.call_started_at = datetime.utcnow()
    db.commit()

    token = daily_service.create_token(
        room_name=room_data["name"],
        user_name=current_user.full_name or current_user.username,
        user_id=str(current_user.id),
        is_owner=is_owner,
        exp_minutes=(session.duration_minutes or 60) + 30,
    )
    return RoomResponse(
        room_url=room_data["url"],
        token=token,
        room_name=room_data["name"],
    )


@router.get("/api/mentorship/sessions/{session_id}/room")
def get_session_room(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Get room info without creating."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session.daily_room_name:
        return {"room_exists": False}
    room = daily_service.get_room(session.daily_room_name)
    return {"room_exists": room is not None, "room_name": session.daily_room_name, "room_url": session.daily_room_url}


@router.delete("/api/mentorship/sessions/{session_id}/room", status_code=204)
def end_session_call(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """End a session video call and delete the room."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.id != session.mentor_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only mentor or admin can end the call")
    if session.daily_room_name:
        daily_service.delete_room(session.daily_room_name)
        session.call_ended_at = datetime.utcnow()
        if session.call_started_at:
            delta = session.call_ended_at - session.call_started_at
            session.call_duration_seconds = int(delta.total_seconds())
        db.commit()


@router.get("/api/mentorship/sessions/{session_id}/recording")
def get_session_recording(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Get recording URL for a session."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.id not in (session.mentor_id, session.mentee_id):
        raise HTTPException(status_code=403, detail="Not a participant")
    return {"recording_url": session.recording_url}


@router.get("/api/mentorship/sessions/{session_id}/transcript")
def get_session_transcript(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Get transcript for a session."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.id not in (session.mentor_id, session.mentee_id):
        raise HTTPException(status_code=403, detail="Not a participant")
    return {"transcript_text": session.transcript_text}


@router.get("/api/mentorship/sessions/{session_id}/summary")
def get_session_summary(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Get AI summary for a session."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.id not in (session.mentor_id, session.mentee_id):
        raise HTTPException(status_code=403, detail="Not a participant")
    if session.ai_summary:
        try:
            return json.loads(session.ai_summary)
        except json.JSONDecodeError:
            return {"raw": session.ai_summary}
    return {"ai_summary": None}


@router.post("/api/mentorship/sessions/{session_id}/summary/generate")
def generate_session_summary(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Manually trigger AI summary generation."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session.transcript_text:
        raise HTTPException(status_code=400, detail="No transcript available")

    mentor = db.query(User).filter(User.id == session.mentor_id).first()
    mentee = db.query(User).filter(User.id == session.mentee_id).first()

    summary = generate_summary(
        transcript_text=session.transcript_text,
        topic=session.topic or "Mentorship Session",
        mentor_name=mentor.full_name if mentor else "Mentor",
        mentee_name=mentee.full_name if mentee else "Mentee",
    )
    session.ai_summary = json.dumps(summary)
    db.commit()
    return summary


# ─── Workshop Video ──────────────────────────────────────────────────


@router.post("/api/workshops/{workshop_id}/room", response_model=RoomResponse)
def create_workshop_room(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Create a Daily room for a workshop. Only the mentor owner can create."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the workshop owner can start the call")
    if workshop.status != "published":
        raise HTTPException(status_code=400, detail="Workshop must be published to start a call")

    if workshop.daily_room_name:
        room = daily_service.get_room(workshop.daily_room_name)
        if room:
            token = daily_service.create_token(
                room_name=workshop.daily_room_name,
                user_name=current_user.full_name or current_user.username,
                user_id=str(current_user.id),
                is_owner=True,
                exp_minutes=(workshop.duration_minutes or 120) + 30,
            )
            return RoomResponse(room_url=workshop.daily_room_url, token=token, room_name=workshop.daily_room_name)

    room_data = daily_service.create_room(
        session_id=workshop.id,
        duration_minutes=workshop.duration_minutes or 120,
        enable_recording=True,
        max_participants=workshop.max_participants or 100,
        entity_type="workshop",
    )
    workshop.daily_room_name = room_data["name"]
    workshop.daily_room_url = room_data["url"]
    workshop.status = "in_progress"
    db.commit()

    token = daily_service.create_token(
        room_name=room_data["name"],
        user_name=current_user.full_name or current_user.username,
        user_id=str(current_user.id),
        is_owner=True,
        exp_minutes=(workshop.duration_minutes or 120) + 30,
    )
    return RoomResponse(room_url=room_data["url"], token=token, room_name=room_data["name"])


@router.post("/api/workshops/{workshop_id}/join", response_model=RoomResponse)
def join_workshop_room(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Get a join token for a workshop. Must be registered."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if not workshop.daily_room_name:
        raise HTTPException(status_code=400, detail="Workshop call has not started yet")

    # Check registration
    reg = db.query(WorkshopRegistration).filter(
        WorkshopRegistration.workshop_id == workshop_id,
        WorkshopRegistration.mentee_id == current_user.id,
        WorkshopRegistration.status == "registered",
    ).first()
    if not reg and workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not registered for this workshop")

    token = daily_service.create_token(
        room_name=workshop.daily_room_name,
        user_name=current_user.full_name or current_user.username,
        user_id=str(current_user.id),
        is_owner=(current_user.id == workshop.mentor_id),
        exp_minutes=(workshop.duration_minutes or 120) + 30,
    )
    return RoomResponse(room_url=workshop.daily_room_url, token=token, room_name=workshop.daily_room_name)


@router.delete("/api/workshops/{workshop_id}/room", status_code=204)
def end_workshop_call(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """End workshop call. Only owner."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can end the call")
    if workshop.daily_room_name:
        daily_service.delete_room(workshop.daily_room_name)
    workshop.status = "completed"
    db.commit()


# ─── Daily Webhook ───────────────────────────────────────────────────


@router.post("/api/webhooks/daily")
async def daily_webhook(request: Request, db: DBSession = Depends(get_db)):
    """Handle Daily.co webhook events."""
    body = await request.json()
    event_type = body.get("type", "")
    payload = body.get("payload", {})
    room_name = payload.get("room_name", "")

    if not room_name:
        return {"ok": True}

    # Find session or workshop by room name
    session = db.query(MentorSession).filter(MentorSession.daily_room_name == room_name).first()
    workshop = db.query(Workshop).filter(Workshop.daily_room_name == room_name).first() if not session else None

    if event_type == "recording.ready-to-download":
        download_link = payload.get("download_link", "")
        if session:
            session.recording_url = download_link
        elif workshop:
            workshop.recording_url = download_link
        db.commit()

    elif event_type == "transcription.ready-to-download":
        transcript_link = payload.get("download_link", "")
        # Download transcript content
        try:
            import httpx
            with httpx.Client(timeout=30) as client:
                resp = client.get(transcript_link)
                resp.raise_for_status()
                transcript_data = resp.text
        except Exception:
            transcript_data = ""

        if session and transcript_data:
            session.transcript_text = transcript_data
            db.commit()
            # Auto-generate AI summary
            try:
                mentor = db.query(User).filter(User.id == session.mentor_id).first()
                mentee = db.query(User).filter(User.id == session.mentee_id).first()
                summary = generate_summary(
                    transcript_text=transcript_data,
                    topic=session.topic or "Mentorship Session",
                    mentor_name=mentor.full_name if mentor else "Mentor",
                    mentee_name=mentee.full_name if mentee else "Mentee",
                )
                session.ai_summary = json.dumps(summary)
                db.commit()
            except Exception:
                pass
        elif workshop and transcript_data:
            workshop.transcript_text = transcript_data
            db.commit()

    elif event_type == "meeting.started":
        if session and not session.call_started_at:
            session.call_started_at = datetime.utcnow()
            if session.status == "upcoming":
                session.status = "in_progress"
            db.commit()

    elif event_type == "meeting.ended":
        if session:
            session.call_ended_at = datetime.utcnow()
            if session.call_started_at:
                delta = session.call_ended_at - session.call_started_at
                session.call_duration_seconds = int(delta.total_seconds())
            db.commit()

    return {"ok": True}
```

- [ ] **Step 2: Verify import**

Run: `cd server && source venv/bin/activate && python -c "from routers.video import router; print('OK')"`

- [ ] **Step 3: Commit**

```bash
git add server/routers/video.py
git commit -m "feat: add video router with room management, recording, transcript, and webhook endpoints"
```

---

## Task 6: Wire Video Router + Install httpx

**Files:**
- Modify: `server/main.py`

- [ ] **Step 1: Register video router in main.py**

Add to the router import line:
```python
from routers import auth, profile, mentorship, admin, messages, billing, conversations, timeline, credentials, consulting, workshops, video
```

Add router registration:
```python
app.include_router(video.router)
```

- [ ] **Step 2: Install httpx**

Run: `cd server && source venv/bin/activate && pip install httpx`

- [ ] **Step 3: Verify server starts**

Run: `cd server && source venv/bin/activate && python -c "from main import app; print('routes:', len(app.routes))"`

- [ ] **Step 4: Commit**

```bash
git add server/main.py
git commit -m "chore: wire video router into app"
```

---

## Task 7: Frontend — Install Daily SDK + Add videoAPI

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `src/lib/api.ts`

- [ ] **Step 1: Install Daily SDK**

Run: `npm install @daily-co/daily-js`

- [ ] **Step 2: Add videoAPI to api.ts**

Add after the `workshopAPI` object in `src/lib/api.ts`:

```typescript
// ─── Video API ──────────────────────────────────────────────────────

export interface RoomInfo {
    room_url: string;
    token: string;
    room_name: string;
}

export const videoAPI = {
    // Session video
    createSessionRoom: (sessionId: number) =>
        fetchAPI<RoomInfo>(`/mentorship/sessions/${sessionId}/room`, { method: "POST" }),

    getSessionRoom: (sessionId: number) =>
        fetchAPI<{ room_exists: boolean; room_name?: string; room_url?: string }>(`/mentorship/sessions/${sessionId}/room`),

    endSessionCall: (sessionId: number) =>
        fetch(`${API_BASE}/mentorship/sessions/${sessionId}/room`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Failed to end call"); }),

    getRecording: (sessionId: number) =>
        fetchAPI<{ recording_url: string | null }>(`/mentorship/sessions/${sessionId}/recording`),

    getTranscript: (sessionId: number) =>
        fetchAPI<{ transcript_text: string | null }>(`/mentorship/sessions/${sessionId}/transcript`),

    getSummary: (sessionId: number) =>
        fetchAPI<Record<string, unknown>>(`/mentorship/sessions/${sessionId}/summary`),

    generateSummary: (sessionId: number) =>
        fetchAPI<Record<string, unknown>>(`/mentorship/sessions/${sessionId}/summary/generate`, { method: "POST" }),

    // Workshop video
    createWorkshopRoom: (workshopId: number) =>
        fetchAPI<RoomInfo>(`/workshops/${workshopId}/room`, { method: "POST" }),

    joinWorkshopRoom: (workshopId: number) =>
        fetchAPI<RoomInfo>(`/workshops/${workshopId}/join`, { method: "POST" }),

    endWorkshopCall: (workshopId: number) =>
        fetch(`${API_BASE}/workshops/${workshopId}/room`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Failed to end call"); }),
};
```

- [ ] **Step 3: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/api.ts
git commit -m "feat: install @daily-co/daily-js, add videoAPI client"
```

---

## Task 8: Daily SDK Hooks

**Files:**
- Create: `src/lib/daily.ts`

- [ ] **Step 1: Create Daily SDK hooks**

Create `src/lib/daily.ts` with custom hooks for managing Daily call state. This file should export:

- `useDaily(roomUrl, token)` — creates and manages `DailyCall` instance, handles join/leave lifecycle
- `useParticipants(callObject)` — tracks participants via `participant-joined`/`participant-left` events
- `useDevices(callObject)` — manages camera/mic/speaker selection via `call.enumerateDevices()`
- `useRecording(callObject)` — tracks recording state via `recording-started`/`recording-stopped`
- `useTranscription(callObject)` — buffers `transcription-message` events for subtitle display

The implementation should use `@daily-co/daily-js` types (`DailyCall`, `DailyParticipant`, `DailyEventObjectParticipant`) and React hooks (`useState`, `useEffect`, `useCallback`, `useRef`).

Key patterns:
- `useDaily`: create call object on mount, join room, cleanup on unmount (`call.leave()`, `call.destroy()`)
- `useParticipants`: maintain a `Map<string, DailyParticipant>`, update on join/leave/track events
- `useTranscription`: maintain a rolling buffer (last 5 messages), auto-clear after 3 seconds

- [ ] **Step 2: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/lib/daily.ts
git commit -m "feat: add Daily SDK hooks (useDaily, useParticipants, useDevices, useRecording, useTranscription)"
```

---

## Task 9: Video UI Components

**Files:**
- Create: `src/app/components/VideoControls.tsx`
- Create: `src/app/components/ParticipantGrid.tsx`
- Create: `src/app/components/Subtitles.tsx`
- Create: `src/app/components/SessionRecording.tsx`

- [ ] **Step 1: Create VideoControls component**

Shared control bar: Mic toggle, Camera toggle, Screen Share, Record indicator, End Call button. Uses lucide-react icons (`Mic`, `MicOff`, `Video`, `VideoOff`, `Monitor`, `Circle`, `PhoneOff`). Takes callback props for each action + boolean states for active/inactive.

- [ ] **Step 2: Create ParticipantGrid component**

Renders video tiles. For 1v1: large remote video + small PiP self. For multi-person: speaker view + gallery grid. Uses `<video>` elements with `ref` to attach Daily media tracks. Takes `participants` Map + `mode` ('1v1' | 'gallery') props.

- [ ] **Step 3: Create Subtitles component**

Bottom overlay bar showing live transcription text. Auto-fades after 3 seconds. Shows speaker name + text. Takes `messages` array from `useTranscription` hook.

- [ ] **Step 4: Create SessionRecording component**

Post-call view: `<video>` player for recording playback, scrollable transcript with timestamps, AI summary card (key points, action items, follow-ups), download buttons. Takes `sessionId` prop, loads data from `videoAPI.getRecording/getTranscript/getSummary`.

- [ ] **Step 5: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 6: Commit**

```bash
git add src/app/components/VideoControls.tsx src/app/components/ParticipantGrid.tsx src/app/components/Subtitles.tsx src/app/components/SessionRecording.tsx
git commit -m "feat: add video UI components (controls, grid, subtitles, recording)"
```

---

## Task 10: VideoCall Page (1v1)

**Files:**
- Create: `src/app/pages/VideoCall.tsx`

- [ ] **Step 1: Create the 1v1 video call page**

Route: `/app/session/:id/call`

On mount:
1. `videoAPI.createSessionRoom(sessionId)` → get `{ room_url, token }`
2. Initialize Daily call via `useDaily(room_url, token)`
3. Track participants via `useParticipants`
4. Enable transcription via `useTranscription`

Layout:
- Full viewport height
- `ParticipantGrid` (mode='1v1') filling main area
- `VideoControls` bar at bottom
- `Subtitles` overlay at bottom center
- Left collapsible panel: session agenda (fetch from session detail)
- Right collapsible panel: text chat (reuse WebSocket from SessionDetail)
- Top bar: session topic, timer, "Back to Session" link

End call → `videoAPI.endSessionCall(sessionId)` → navigate to `/app/session/:id`

- [ ] **Step 2: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/VideoCall.tsx
git commit -m "feat: add 1v1 VideoCall page with Daily.co integration"
```

---

## Task 11: WorkshopCall Page

**Files:**
- Create: `src/app/pages/WorkshopCall.tsx`

- [ ] **Step 1: Create multi-person workshop call page**

Route: `/app/workshop/:id/call`

Similar to VideoCall but:
- Uses `videoAPI.createWorkshopRoom` (for mentor) or `videoAPI.joinWorkshopRoom` (for mentees)
- `ParticipantGrid` in gallery mode
- Shows participant count
- Hand-raise via `call.sendAppMessage({ type: 'hand-raise', userId })`
- Participant list panel showing names + mute status

- [ ] **Step 2: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/WorkshopCall.tsx
git commit -m "feat: add WorkshopCall page with multi-person Daily.co integration"
```

---

## Task 12: Wire Routes + Modify Existing Pages

**Files:**
- Modify: `src/app/routes.tsx`
- Modify: `src/app/pages/SessionDetail.tsx`
- Modify: `src/app/pages/MentorCalendar.tsx`
- Modify: `src/app/pages/MentorWorkshops.tsx`

- [ ] **Step 1: Add video call routes**

In `src/app/routes.tsx`, add imports:
```typescript
import { VideoCall } from "./pages/VideoCall";
import { WorkshopCall } from "./pages/WorkshopCall";
```

Add routes inside the Layout children:
```typescript
{ path: "session/:id/call", Component: VideoCall },
{ path: "workshop/:id/call", Component: WorkshopCall },
```

- [ ] **Step 2: Add Join Video button to SessionDetail**

In SessionDetail.tsx, add a prominent "Join Video Call" button above the chat area. Button is active when session is `upcoming` (within 15min of scheduled_at) or `in_progress`. Navigates to `/app/session/:id/call`.

After session has `recording_url` or `transcript_text` or `ai_summary`, show the `SessionRecording` component below the session info.

- [ ] **Step 3: Update MentorCalendar Join Session**

Change the "Join Session" button onClick from:
```tsx
onClick={() => navigate('/app/session/' + selectedAppointment?.id)}
```
to:
```tsx
onClick={() => navigate('/app/session/' + selectedAppointment?.id + '/call')}
```

- [ ] **Step 4: Add video buttons to MentorWorkshops**

For published workshops with `daily_room_name`:
- Mentor sees "Start Workshop" → navigates to `/app/workshop/:id/call`
- Show active call indicator if room exists

- [ ] **Step 5: Verify build**

Run: `npx vite build 2>&1 | tail -3`

- [ ] **Step 6: Commit**

```bash
git add src/app/routes.tsx src/app/pages/SessionDetail.tsx src/app/pages/MentorCalendar.tsx src/app/pages/MentorWorkshops.tsx
git commit -m "feat: wire video call routes and join buttons into existing pages"
```

---

## Task 13: Environment Setup + Final Verification

- [ ] **Step 1: Add .env entries**

Add to `server/.env` (or create if not exists):
```
DAILY_API_KEY=your_daily_api_key_here
DAILY_API_URL=https://api.daily.co/v1
DEEPSEEK_API_KEY=your_deepseek_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

- [ ] **Step 2: Run all backend tests**

Run: `cd server && source venv/bin/activate && python -m pytest tests/ -v`
Expected: All existing tests pass (new video endpoints need Daily API key for integration testing).

- [ ] **Step 3: Run frontend build**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 4: Manual E2E test**

1. Get a free Daily.co API key from https://dashboard.daily.co
2. Set `DAILY_API_KEY` in `.env`
3. Start servers: `./start-dev.sh`
4. Login as `sarah.mentor@phxnorth.com`, go to upcoming sessions
5. Click "Join Video Call" → should navigate to `/app/session/:id/call`
6. Verify camera/mic permission prompt appears
7. In another browser, login as mentee, join same session
8. Verify 1v1 video works
9. End call → verify redirect back to session detail
10. Check if recording/transcript appears (may take a few minutes via webhook)

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: video conferencing environment setup and final adjustments"
```
