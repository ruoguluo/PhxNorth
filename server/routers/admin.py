from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.user import User
from models.mentorship_request import MentorshipRequest
from models.session import Session as MentorSession
from schemas.admin import PlatformStats, AdminUserResponse, AdminUserUpdate
from utils.deps import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/stats", response_model=PlatformStats)
def get_platform_stats(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get platform-wide statistics."""
    total_users = db.query(User).count()
    total_mentors = db.query(User).filter(User.role == "mentor").count()
    total_mentees = db.query(User).filter(User.role == "mentee").count()
    total_admins = db.query(User).filter(User.role == "admin").count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_sessions = db.query(MentorSession).count()
    completed_sessions = (
        db.query(MentorSession).filter(MentorSession.status == "completed").count()
    )
    pending_requests = (
        db.query(MentorshipRequest)
        .filter(MentorshipRequest.status == "pending")
        .count()
    )
    avg_rating = (
        db.query(func.avg(MentorSession.rating))
        .filter(MentorSession.rating.isnot(None))
        .scalar()
    ) or 0.0
    total_revenue = (
        db.query(func.sum(MentorSession.price))
        .filter(MentorSession.status == "completed")
        .scalar()
    ) or 0.0

    return PlatformStats(
        total_users=total_users,
        total_mentors=total_mentors,
        total_mentees=total_mentees,
        total_admins=total_admins,
        active_users=active_users,
        total_sessions=total_sessions,
        completed_sessions=completed_sessions,
        pending_requests=pending_requests,
        average_rating=round(float(avg_rating), 2),
        total_revenue=round(float(total_revenue), 2),
    )


@router.get("/users", response_model=list[AdminUserResponse])
def list_users(
    role: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """List all users with optional role filter."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.offset(skip).limit(limit).all()
    return users


@router.get("/users/{user_id}", response_model=AdminUserResponse)
def get_user(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get a specific user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/{user_id}", response_model=AdminUserResponse)
def update_user(
    user_id: int,
    body: AdminUserUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Update a user's status or role (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if body.is_active is not None:
        user.is_active = body.is_active
    if body.role is not None:
        user.role = body.role

    db.commit()
    db.refresh(user)
    return user
