from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.user import User
from schemas.user import UserResponse, UserPublicResponse, ProfileUpdateRequest
from utils.deps import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])

# A mentor is considered online if their last heartbeat was within this window
HEARTBEAT_TIMEOUT = timedelta(minutes=2)


@router.get("", response_model=UserResponse)
def get_own_profile(current_user: User = Depends(get_current_user)):
    """Get the current user's full profile."""
    return current_user


@router.put("", response_model=UserResponse)
def update_profile(
    update: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the current user's profile."""
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/mentors", response_model=list[UserPublicResponse])
def list_mentors(
    online_only: bool = Query(False),
    industry: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List mentors with optional filters."""
    query = db.query(User).filter(User.role == "mentor", User.is_active == True)

    if online_only:
        query = query.filter(User.is_online == True)
    if industry:
        query = query.filter(User.industry == industry)
    if country:
        query = query.filter(User.current_country == country)

    mentors = query.offset(skip).limit(limit).all()

    # Compute real online status from heartbeat and respect keep_name_private
    now = datetime.utcnow()
    results = []
    for mentor in mentors:
        # A mentor is online only if they sent a heartbeat recently
        actually_online = (
            mentor.last_heartbeat is not None
            and (now - mentor.last_heartbeat) < HEARTBEAT_TIMEOUT
        )
        data = UserPublicResponse.model_validate(mentor)
        data.is_online = actually_online
        if mentor.keep_name_private:
            data.full_name = None
        results.append(data)

    return results


@router.put("/online-status")
def toggle_online_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle the mentor's online status."""
    if current_user.role != "mentor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only mentors can toggle online status",
        )
    current_user.is_online = not current_user.is_online
    # If going online, set heartbeat so they appear online immediately
    if current_user.is_online:
        current_user.last_heartbeat = datetime.utcnow()
    else:
        current_user.last_heartbeat = None
    db.commit()
    db.refresh(current_user)
    return {"is_online": current_user.is_online}


@router.post("/heartbeat")
def heartbeat(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the user's heartbeat timestamp. Call every 30-60s to stay online."""
    current_user.last_heartbeat = datetime.utcnow()
    current_user.is_online = True
    db.commit()
    return {"status": "ok"}


@router.get("/{username}", response_model=UserPublicResponse)
def get_public_profile(username: str, db: Session = Depends(get_db)):
    """Get a user's public profile by username, ID, or full name."""
    user = None
    if username.isdigit():
        user = db.query(User).filter(User.id == int(username)).first()
    if not user:
        user = db.query(User).filter(User.username == username).first()
    if not user:
        from sqlalchemy import func
        user = db.query(User).filter(func.lower(User.full_name) == func.lower(username)).first()
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    data = UserPublicResponse.model_validate(user)
    # Compute real online status from heartbeat
    now = datetime.utcnow()
    data.is_online = (
        user.last_heartbeat is not None
        and (now - user.last_heartbeat) < HEARTBEAT_TIMEOUT
    )
    if user.keep_name_private:
        data.full_name = None
    return data
