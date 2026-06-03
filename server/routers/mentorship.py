from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from database import get_db
from models.user import User
from models.mentor_availability import MentorAvailability
from models.mentorship_request import MentorshipRequest
from models.session import Session as MentorSession
from schemas.mentorship import (
    AvailabilitySlot,
    AvailabilityUpdateRequest,
    MentorshipRequestCreate,
    MentorshipRequestResponse,
    MentorshipRequestRespond,
    MentorshipRequestUpdate,
    SessionResponse,
    SessionCreateRequest,
    SessionUpdateRequest,
    SessionCompleteRequest,
    MentorStats,
    MatchRequest,
    MentorMatchResponse,
)
from utils.deps import get_current_user
from services import billing
from services.payments import PaymentError
from services.mentor_matcher import MatchInput, match_mentors

router = APIRouter(prefix="/api/mentorship", tags=["Mentorship"])


# --- Availability ---

@router.get("/availability", response_model=list[AvailabilitySlot])
def get_availability(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current mentor's availability slots."""
    slots = (
        db.query(MentorAvailability)
        .filter(MentorAvailability.mentor_id == current_user.id)
        .all()
    )
    return slots


@router.put("/availability", response_model=list[AvailabilitySlot])
def update_availability(
    req: AvailabilityUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Replace all availability slots for the current mentor."""
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can set availability")

    # Delete existing slots
    db.query(MentorAvailability).filter(
        MentorAvailability.mentor_id == current_user.id
    ).delete()

    # Create new slots
    new_slots = []
    for slot in req.slots:
        s = MentorAvailability(
            mentor_id=current_user.id,
            day_of_week=slot.day_of_week,
            start_time=slot.start_time,
            end_time=slot.end_time,
            is_active=slot.is_active,
        )
        db.add(s)
        new_slots.append(s)

    db.commit()
    for s in new_slots:
        db.refresh(s)
    return new_slots


# --- Mentorship Requests ---

@router.get("/requests", response_model=list[MentorshipRequestResponse])
def list_requests(
    role: str = Query("mentor"),  # mentor or mentee
    status_filter: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List mentorship requests for the current user."""
    if role == "mentor":
        query = db.query(MentorshipRequest).filter(
            MentorshipRequest.mentor_id == current_user.id
        )
    else:
        query = db.query(MentorshipRequest).filter(
            MentorshipRequest.mentee_id == current_user.id
        )

    if status_filter:
        query = query.filter(MentorshipRequest.status == status_filter)

    requests = query.order_by(MentorshipRequest.created_at.desc()).all()

    results = []
    for req in requests:
        mentee = db.query(User).filter(User.id == req.mentee_id).first()
        mentor = db.query(User).filter(User.id == req.mentor_id).first()
        resp = MentorshipRequestResponse.model_validate(req)
        resp.mentee_name = mentee.full_name if mentee else None
        resp.mentor_name = mentor.full_name if mentor else None
        resp.mentee_username = mentee.username if mentee else None
        resp.mentee_email = mentee.email if mentee else None
        results.append(resp)

    return results


@router.post("/match", response_model=list[MentorMatchResponse])
def match(
    body: MatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Rank mentors against a mentee's structured question intent.

    Built from the FR-03 ``/questions/interpret`` output. Scores topic
    relevance, track record, and logistics now; DISC/5D behavioral
    compatibility is a phase-2 hook (see ``mentor_matcher``).
    """
    intent = MatchInput(
        category=body.category,
        subtype=body.subtype,
        primary_goal=body.primary_goal,
        stage=body.stage,
        country=body.country or current_user.current_country,
        keywords=body.keywords,
        max_budget=body.max_budget,
        raw_question=body.raw_question,
    )
    matches = match_mentors(db, intent, mentee=current_user, limit=body.limit)
    return matches


@router.post("/requests", response_model=MentorshipRequestResponse, status_code=201)
def create_request(
    req: MentorshipRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new mentorship request."""
    mentor = db.query(User).filter(User.id == req.mentor_id, User.role == "mentor").first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    mentorship_req = MentorshipRequest(
        mentee_id=current_user.id,
        mentor_id=req.mentor_id,
        type=req.type,
        topic=req.topic,
        message=req.message,
        duration_minutes=req.duration_minutes,
        proposed_datetime=req.proposed_datetime,
        price=req.price,
    )
    db.add(mentorship_req)
    db.commit()
    db.refresh(mentorship_req)

    resp = MentorshipRequestResponse.model_validate(mentorship_req)
    resp.mentee_name = current_user.full_name
    resp.mentor_name = mentor.full_name
    resp.mentee_username = current_user.username
    resp.mentee_email = current_user.email
    return resp


@router.get("/requests/{request_id}", response_model=MentorshipRequestResponse)
def get_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific mentorship request."""
    req = db.query(MentorshipRequest).filter(MentorshipRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.mentee_id != current_user.id and req.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this request")

    mentee = db.query(User).filter(User.id == req.mentee_id).first()
    mentor = db.query(User).filter(User.id == req.mentor_id).first()
    resp = MentorshipRequestResponse.model_validate(req)
    resp.mentee_name = mentee.full_name if mentee else None
    resp.mentor_name = mentor.full_name if mentor else None
    resp.mentee_username = mentee.username if mentee else None
    resp.mentee_email = mentee.email if mentee else None
    return resp


@router.put("/requests/{request_id}/respond", response_model=MentorshipRequestResponse)
def respond_to_request(
    request_id: int,
    body: MentorshipRequestRespond,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Accept or decline a mentorship request (mentor only)."""
    req = db.query(MentorshipRequest).filter(MentorshipRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the assigned mentor can respond")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Request is no longer pending")

    if body.action == "accept":
        req.status = "accepted"
        # Create a session for accepted requests
        scheduled_time = req.proposed_datetime or (datetime.utcnow() + timedelta(minutes=5))
        session = MentorSession(
            request_id=req.id,
            mentor_id=req.mentor_id,
            mentee_id=req.mentee_id,
            scheduled_at=scheduled_time,
            duration_minutes=req.duration_minutes,
            topic=req.topic,
            price=req.price,
            status="upcoming",
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        db.refresh(req)

        # FR-07: authorize (hold) the mentee's payment at booking time.
        try:
            billing.authorize_session_payment(db, session)
        except PaymentError:
            # Roll back the booking if the hold fails.
            session.status = "cancelled"
            req.status = "pending"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Payment authorization failed; booking not confirmed",
            )
    elif body.action == "decline":
        req.status = "declined"
        db.commit()
        db.refresh(req)
    else:
        raise HTTPException(status_code=400, detail="Action must be 'accept' or 'decline'")

    mentee = db.query(User).filter(User.id == req.mentee_id).first()
    resp = MentorshipRequestResponse.model_validate(req)
    resp.mentee_name = mentee.full_name if mentee else None
    resp.mentor_name = current_user.full_name
    return resp


# --- Sessions ---

@router.get("/sessions", response_model=list[SessionResponse])
def list_sessions(
    status_filter: str = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List sessions for the current user (as mentor or mentee)."""
    query = db.query(MentorSession).filter(
        (MentorSession.mentor_id == current_user.id)
        | (MentorSession.mentee_id == current_user.id)
    )
    if status_filter:
        query = query.filter(MentorSession.status == status_filter)

    sessions = query.order_by(MentorSession.scheduled_at.desc()).all()

    results = []
    for s in sessions:
        mentee = db.query(User).filter(User.id == s.mentee_id).first()
        mentor = db.query(User).filter(User.id == s.mentor_id).first()
        resp = SessionResponse.model_validate(s)
        resp.mentee_name = mentee.full_name if mentee else None
        resp.mentor_name = mentor.full_name if mentor else None
        resp.mentee_email = mentee.email if mentee else None
        resp.mentor_email = mentor.email if mentor else None
        results.append(resp)

    return results


@router.get("/sessions/{session_id}", response_model=SessionResponse)
def get_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific session detail."""
    s = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    if s.mentor_id != current_user.id and s.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    mentee = db.query(User).filter(User.id == s.mentee_id).first()
    mentor = db.query(User).filter(User.id == s.mentor_id).first()
    resp = SessionResponse.model_validate(s)
    resp.mentee_name = mentee.full_name if mentee else None
    resp.mentor_name = mentor.full_name if mentor else None
    resp.mentee_email = mentee.email if mentee else None
    resp.mentor_email = mentor.email if mentor else None
    return resp


@router.put("/sessions/{session_id}/complete", response_model=SessionResponse)
def complete_session(
    session_id: int,
    body: SessionCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a session as completed with optional rating and feedback."""
    s = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    if s.mentor_id != current_user.id and s.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    s.status = "completed"
    if body.rating is not None:
        s.rating = body.rating
    if body.feedback is not None:
        s.feedback = body.feedback
    if body.notes is not None:
        s.notes = body.notes

    # FR-07: capture the authorized payment now that the session is complete.
    # mentor_earnings is the payout amount (gross minus platform fee).
    earnings = s.price
    try:
        captured = billing.capture_session_payment(db, s, commit=False)
        if captured is not None:
            earnings = captured.mentor_earnings
    except PaymentError:
        # Fall back to gross price for stats if capture fails (mock never does).
        earnings = s.price

    # Update mentor stats
    mentor = db.query(User).filter(User.id == s.mentor_id).first()
    if mentor:
        mentor.total_sessions += 1
        mentor.monthly_income += earnings
        # Recalculate average rating
        completed = (
            db.query(MentorSession)
            .filter(
                MentorSession.mentor_id == s.mentor_id,
                MentorSession.status == "completed",
                MentorSession.rating.isnot(None),
            )
            .all()
        )
        if completed:
            avg = sum(sess.rating for sess in completed if sess.rating) / len(completed)
            mentor.rating = round(avg, 2)

    # Update the related request
    if s.request_id:
        req = db.query(MentorshipRequest).filter(MentorshipRequest.id == s.request_id).first()
        if req:
            req.status = "completed"

    db.commit()
    db.refresh(s)

    mentee = db.query(User).filter(User.id == s.mentee_id).first()
    resp = SessionResponse.model_validate(s)
    resp.mentee_name = mentee.full_name if mentee else None
    resp.mentor_name = mentor.full_name if mentor else None
    resp.mentee_email = mentee.email if mentee else None
    resp.mentor_email = mentor.email if mentor else None
    return resp


# --- Queue ---

@router.get("/queue", response_model=list[MentorshipRequestResponse])
def get_instant_queue(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get pending instant mentorship requests for the current mentor."""
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can view the queue")

    requests = (
        db.query(MentorshipRequest)
        .filter(
            MentorshipRequest.mentor_id == current_user.id,
            MentorshipRequest.type == "instant",
            MentorshipRequest.status == "pending",
        )
        .order_by(MentorshipRequest.created_at.asc())
        .all()
    )

    results = []
    for req in requests:
        mentee = db.query(User).filter(User.id == req.mentee_id).first()
        resp = MentorshipRequestResponse.model_validate(req)
        resp.mentee_name = mentee.full_name if mentee else None
        resp.mentor_name = current_user.full_name
        results.append(resp)

    return results


# --- Calendar ---

@router.get("/calendar", response_model=list[SessionResponse])
def get_calendar(
    month: int = Query(None),
    year: int = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get calendar data (sessions) for the current user."""
    query = db.query(MentorSession).filter(
        (MentorSession.mentor_id == current_user.id)
        | (MentorSession.mentee_id == current_user.id)
    )

    if month and year:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        query = query.filter(
            MentorSession.scheduled_at >= start_date,
            MentorSession.scheduled_at < end_date,
        )

    sessions = query.order_by(MentorSession.scheduled_at.asc()).all()

    results = []
    for s in sessions:
        mentee = db.query(User).filter(User.id == s.mentee_id).first()
        mentor = db.query(User).filter(User.id == s.mentor_id).first()
        resp = SessionResponse.model_validate(s)
        resp.mentee_name = mentee.full_name if mentee else None
        resp.mentor_name = mentor.full_name if mentor else None
        results.append(resp)

    return results


# --- Stats ---

@router.get("/stats", response_model=MentorStats)
def get_mentor_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get mentor dashboard statistics."""
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)

    total = (
        db.query(MentorSession)
        .filter(MentorSession.mentor_id == current_user.id)
        .count()
    )

    this_week = (
        db.query(MentorSession)
        .filter(
            MentorSession.mentor_id == current_user.id,
            MentorSession.scheduled_at >= week_ago,
        )
        .count()
    )

    # Count distinct active mentees (with upcoming or recent sessions)
    active_mentees = (
        db.query(func.count(func.distinct(MentorSession.mentee_id)))
        .filter(
            MentorSession.mentor_id == current_user.id,
            MentorSession.status.in_(["upcoming", "in_progress"]),
        )
        .scalar()
    ) or 0

    pending = (
        db.query(MentorshipRequest)
        .filter(
            MentorshipRequest.mentor_id == current_user.id,
            MentorshipRequest.status == "pending",
        )
        .count()
    )

    return MentorStats(
        total_sessions=total,
        sessions_this_week=this_week,
        active_mentees=active_mentees,
        average_rating=current_user.rating,
        monthly_income=current_user.monthly_income,
        pending_requests=pending,
    )


# --- Session CRUD ---


@router.post("/sessions", response_model=SessionResponse, status_code=201)
def create_session(
    data: SessionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Directly create a session (mentor or admin)."""
    if current_user.role not in ("mentor", "admin"):
        raise HTTPException(status_code=403, detail="Only mentors or admins can create sessions")
    if current_user.role == "mentor" and data.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Mentors can only create sessions for themselves")
    session = MentorSession(
        mentor_id=data.mentor_id,
        mentee_id=data.mentee_id,
        scheduled_at=data.scheduled_at,
        duration_minutes=data.duration_minutes,
        topic=data.topic,
        price=data.price,
        status="upcoming",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    mentor = db.query(User).filter(User.id == session.mentor_id).first()
    mentee = db.query(User).filter(User.id == session.mentee_id).first()
    resp = SessionResponse.model_validate(session)
    resp.mentor_name = mentor.full_name if mentor else None
    resp.mentee_name = mentee.full_name if mentee else None
    resp.mentor_email = mentor.email if mentor else None
    resp.mentee_email = mentee.email if mentee else None
    return resp


@router.put("/sessions/{session_id}/edit", response_model=SessionResponse)
def update_session(
    session_id: int,
    data: SessionUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update session details (schedule, topic, notes, price). Only mentor or admin."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.role == "mentor" and session.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your session")
    if current_user.role == "mentee":
        raise HTTPException(status_code=403, detail="Mentees cannot edit sessions")
    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Cannot edit a completed session")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(session, key, value)
    db.commit()
    db.refresh(session)
    mentor = db.query(User).filter(User.id == session.mentor_id).first()
    mentee = db.query(User).filter(User.id == session.mentee_id).first()
    resp = SessionResponse.model_validate(session)
    resp.mentor_name = mentor.full_name if mentor else None
    resp.mentee_name = mentee.full_name if mentee else None
    resp.mentor_email = mentor.email if mentor else None
    resp.mentee_email = mentee.email if mentee else None
    return resp


@router.put("/sessions/{session_id}/cancel", response_model=SessionResponse)
def cancel_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel an upcoming session. Either mentor or mentee can cancel."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.id not in (session.mentor_id, session.mentee_id) and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    if session.status not in ("upcoming", "in_progress"):
        raise HTTPException(status_code=400, detail="Only upcoming or in-progress sessions can be cancelled")

    session.status = "cancelled"
    db.commit()
    db.refresh(session)
    resp = SessionResponse.model_validate(session)
    return resp


@router.delete("/sessions/{session_id}", status_code=204)
def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a session. Only admin or the mentor who owns it can delete."""
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.role == "admin" or session.mentor_id == current_user.id:
        db.delete(session)
        db.commit()
    else:
        raise HTTPException(status_code=403, detail="Not authorized to delete this session")


# --- Request CRUD ---


@router.put("/requests/{request_id}/edit", response_model=MentorshipRequestResponse)
def update_request(
    request_id: int,
    data: MentorshipRequestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a pending mentorship request. Only the mentee who created it can edit."""
    req = db.query(MentorshipRequest).filter(MentorshipRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.mentee_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your request")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending requests can be edited")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(req, key, value)
    db.commit()
    db.refresh(req)
    mentor = db.query(User).filter(User.id == req.mentor_id).first()
    mentee = db.query(User).filter(User.id == req.mentee_id).first()
    resp = MentorshipRequestResponse.model_validate(req)
    resp.mentee_name = mentee.full_name if mentee else None
    resp.mentor_name = mentor.full_name if mentor else None
    resp.mentee_username = mentee.username if mentee else None
    resp.mentee_email = mentee.email if mentee else None
    return resp


@router.delete("/requests/{request_id}", status_code=204)
def withdraw_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Withdraw/delete a pending mentorship request. Only the mentee who created it or admin."""
    req = db.query(MentorshipRequest).filter(MentorshipRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.mentee_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your request")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending requests can be withdrawn")
    db.delete(req)
    db.commit()
