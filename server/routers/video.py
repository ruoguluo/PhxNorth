"""Video conferencing endpoints for sessions and workshops (Daily.co)."""

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


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _require_session_participant(
    session: MentorSession | None,
    current_user: User,
) -> MentorSession:
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.id not in (session.mentor_id, session.mentee_id):
        raise HTTPException(status_code=403, detail="Not authorized")
    return session


# ---------------------------------------------------------------------------
# Session video endpoints
# ---------------------------------------------------------------------------

@router.post(
    "/api/mentorship/sessions/{session_id}/room",
    response_model=RoomResponse,
)
def create_or_get_session_room(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Create a Daily room for the session or return the existing one."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    session = _require_session_participant(session, current_user)

    is_mentor = current_user.id == session.mentor_id

    if session.daily_room_name:
        # Room already exists — generate a fresh token for this user.
        room = daily_service.get_room(session.daily_room_name)
        if room is None:
            # Room expired on Daily side; clear and recreate below.
            session.daily_room_name = None
            session.daily_room_url = None
        else:
            token = daily_service.create_token(
                room_name=session.daily_room_name,
                user_name=current_user.full_name or current_user.username,
                user_id=str(current_user.id),
                is_owner=is_mentor,
            )
            return RoomResponse(
                room_url=session.daily_room_url,
                token=token,
                room_name=session.daily_room_name,
            )

    # Create new room.
    room_data = daily_service.create_room(
        session_id=session.id,
        duration_minutes=session.duration_minutes or 60,
        enable_recording=True,
        entity_type="session",
    )

    session.daily_room_name = room_data["name"]
    session.daily_room_url = room_data["url"]
    session.status = "in_progress"
    db.commit()
    db.refresh(session)

    token = daily_service.create_token(
        room_name=session.daily_room_name,
        user_name=current_user.full_name or current_user.username,
        user_id=str(current_user.id),
        is_owner=is_mentor,
    )

    return RoomResponse(
        room_url=session.daily_room_url,
        token=token,
        room_name=session.daily_room_name,
    )


@router.get(
    "/api/mentorship/sessions/{session_id}/room",
    response_model=RoomResponse,
)
def get_session_room(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Return room info and a fresh token for an existing session room."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    session = _require_session_participant(session, current_user)

    if not session.daily_room_name:
        raise HTTPException(status_code=404, detail="No room exists for this session")

    is_mentor = current_user.id == session.mentor_id
    token = daily_service.create_token(
        room_name=session.daily_room_name,
        user_name=current_user.full_name or current_user.username,
        user_id=str(current_user.id),
        is_owner=is_mentor,
    )

    return RoomResponse(
        room_url=session.daily_room_url,
        token=token,
        room_name=session.daily_room_name,
    )


@router.delete("/api/mentorship/sessions/{session_id}/room")
def end_session_call(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """End the call by deleting the Daily room."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    session = _require_session_participant(session, current_user)

    if not session.daily_room_name:
        raise HTTPException(status_code=404, detail="No room exists for this session")

    daily_service.delete_room(session.daily_room_name)
    session.call_ended_at = datetime.utcnow()
    if session.call_started_at:
        delta = session.call_ended_at - session.call_started_at
        session.call_duration_seconds = int(delta.total_seconds())
    db.commit()

    return {"detail": "Room deleted", "session_id": session_id}


@router.get("/api/mentorship/sessions/{session_id}/recording")
def get_session_recording(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Return the recording URL for a session."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    session = _require_session_participant(session, current_user)

    if session.recording_url:
        return {"recording_url": session.recording_url}

    # Try fetching from Daily if a room existed.
    if session.daily_room_name:
        link = daily_service.get_recording_link(session.daily_room_name)
        if link:
            session.recording_url = link
            db.commit()
            return {"recording_url": link}

    raise HTTPException(status_code=404, detail="No recording available")


@router.get("/api/mentorship/sessions/{session_id}/transcript")
def get_session_transcript(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Return the transcript text for a session."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    session = _require_session_participant(session, current_user)

    if not session.transcript_text:
        raise HTTPException(status_code=404, detail="No transcript available")

    return {"transcript_text": session.transcript_text}


@router.get("/api/mentorship/sessions/{session_id}/summary")
def get_session_summary(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Return the AI-generated summary for a session."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    session = _require_session_participant(session, current_user)

    if not session.ai_summary:
        raise HTTPException(status_code=404, detail="No summary available")

    try:
        summary = json.loads(session.ai_summary)
    except (json.JSONDecodeError, TypeError):
        summary = session.ai_summary

    return {"summary": summary}


@router.post("/api/mentorship/sessions/{session_id}/summary/generate")
def generate_session_summary(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Trigger AI summary generation from the session transcript."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    session = _require_session_participant(session, current_user)

    if not session.transcript_text:
        raise HTTPException(status_code=400, detail="No transcript available to summarize")

    mentor = db.query(User).filter(User.id == session.mentor_id).first()
    mentee = db.query(User).filter(User.id == session.mentee_id).first()

    summary = generate_summary(
        transcript_text=session.transcript_text,
        topic=session.topic or "Mentorship session",
        mentor_name=mentor.full_name if mentor else "Mentor",
        mentee_name=mentee.full_name if mentee else "Mentee",
    )

    session.ai_summary = json.dumps(summary)
    db.commit()

    return {"summary": summary}


# ---------------------------------------------------------------------------
# Workshop video endpoints
# ---------------------------------------------------------------------------

@router.post(
    "/api/workshops/{workshop_id}/room",
    response_model=RoomResponse,
)
def create_workshop_room(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Mentor creates a Daily room for the workshop."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the workshop mentor can create a room")

    if workshop.daily_room_name:
        room = daily_service.get_room(workshop.daily_room_name)
        if room is not None:
            token = daily_service.create_token(
                room_name=workshop.daily_room_name,
                user_name=current_user.full_name or current_user.username,
                user_id=str(current_user.id),
                is_owner=True,
            )
            return RoomResponse(
                room_url=workshop.daily_room_url,
                token=token,
                room_name=workshop.daily_room_name,
            )
        # Room expired; recreate below.
        workshop.daily_room_name = None
        workshop.daily_room_url = None

    room_data = daily_service.create_room(
        session_id=workshop.id,
        duration_minutes=workshop.duration_minutes or 120,
        enable_recording=True,
        max_participants=workshop.max_participants,
        entity_type="workshop",
    )

    workshop.daily_room_name = room_data["name"]
    workshop.daily_room_url = room_data["url"]
    workshop.status = "in_progress"
    db.commit()
    db.refresh(workshop)

    token = daily_service.create_token(
        room_name=workshop.daily_room_name,
        user_name=current_user.full_name or current_user.username,
        user_id=str(current_user.id),
        is_owner=True,
    )

    return RoomResponse(
        room_url=workshop.daily_room_url,
        token=token,
        room_name=workshop.daily_room_name,
    )


@router.post(
    "/api/workshops/{workshop_id}/join",
    response_model=RoomResponse,
)
def join_workshop_room(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Registered mentee gets a token to join the workshop room."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")

    if not workshop.daily_room_name:
        raise HTTPException(status_code=400, detail="Workshop room has not been created yet")

    # Allow the mentor to join via this endpoint too.
    if current_user.id != workshop.mentor_id:
        reg = db.query(WorkshopRegistration).filter(
            WorkshopRegistration.workshop_id == workshop_id,
            WorkshopRegistration.mentee_id == current_user.id,
            WorkshopRegistration.status == "registered",
        ).first()
        if not reg:
            raise HTTPException(status_code=403, detail="Not registered for this workshop")

    is_owner = current_user.id == workshop.mentor_id
    token = daily_service.create_token(
        room_name=workshop.daily_room_name,
        user_name=current_user.full_name or current_user.username,
        user_id=str(current_user.id),
        is_owner=is_owner,
    )

    return RoomResponse(
        room_url=workshop.daily_room_url,
        token=token,
        room_name=workshop.daily_room_name,
    )


@router.delete("/api/workshops/{workshop_id}/room")
def end_workshop_call(
    workshop_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """End the workshop call by deleting the Daily room."""
    workshop = db.query(Workshop).filter(Workshop.id == workshop_id).first()
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    if workshop.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the workshop mentor can end the call")

    if not workshop.daily_room_name:
        raise HTTPException(status_code=404, detail="No room exists for this workshop")

    daily_service.delete_room(workshop.daily_room_name)
    db.commit()

    return {"detail": "Room deleted", "workshop_id": workshop_id}


# ---------------------------------------------------------------------------
# Daily webhook
# ---------------------------------------------------------------------------

@router.post("/api/webhooks/daily")
async def daily_webhook(request: Request, db: DBSession = Depends(get_db)):
    """Handle Daily.co webhook events for recordings, transcriptions, and meetings."""
    payload = await request.json()
    event_type = payload.get("type", "")
    room_name = (payload.get("payload") or {}).get("room_name", "")

    if not room_name:
        return {"status": "ignored", "reason": "no room_name"}

    # Determine if the room belongs to a session or workshop.
    session = db.query(MentorSession).filter(
        MentorSession.daily_room_name == room_name
    ).first()
    workshop = db.query(Workshop).filter(
        Workshop.daily_room_name == room_name
    ).first() if not session else None

    if not session and not workshop:
        return {"status": "ignored", "reason": "unknown room"}

    event_payload = payload.get("payload", {})

    if event_type == "recording.ready-to-download":
        download_link = event_payload.get("download_link", "")
        if session:
            session.recording_url = download_link
        elif workshop:
            workshop.recording_url = download_link
        db.commit()

    elif event_type == "transcription.ready-to-download":
        transcript_link = event_payload.get("download_link", "")
        # Fetch transcript content if a link is provided.
        transcript_text = transcript_link
        if session:
            session.transcript_text = transcript_text
            db.commit()
            db.refresh(session)
            # Auto-trigger summary generation.
            mentor = db.query(User).filter(User.id == session.mentor_id).first()
            mentee = db.query(User).filter(User.id == session.mentee_id).first()
            summary = generate_summary(
                transcript_text=session.transcript_text,
                topic=session.topic or "Mentorship session",
                mentor_name=mentor.full_name if mentor else "Mentor",
                mentee_name=mentee.full_name if mentee else "Mentee",
            )
            session.ai_summary = json.dumps(summary)
            db.commit()
        elif workshop:
            workshop.transcript_text = transcript_text
            db.commit()

    elif event_type == "meeting.started":
        if session:
            session.call_started_at = datetime.utcnow()
            session.status = "in_progress"
            db.commit()

    elif event_type == "meeting.ended":
        if session:
            session.call_ended_at = datetime.utcnow()
            if session.call_started_at:
                delta = session.call_ended_at - session.call_started_at
                session.call_duration_seconds = int(delta.total_seconds())
            db.commit()

    return {"status": "ok", "event": event_type}
