from typing import Optional
from datetime import datetime
from pydantic import BaseModel


# --- Availability ---

class AvailabilitySlot(BaseModel):
    id: Optional[int] = None
    day_of_week: int  # 0=Monday, 6=Sunday
    start_time: str  # "09:00"
    end_time: str  # "17:00"
    is_active: bool = True

    model_config = {"from_attributes": True}


class AvailabilityUpdateRequest(BaseModel):
    slots: list[AvailabilitySlot]


# --- Mentorship Request ---

class MentorshipRequestCreate(BaseModel):
    mentor_id: int
    type: str  # instant, scheduled
    topic: str
    message: Optional[str] = None
    duration_minutes: int = 30
    proposed_datetime: Optional[datetime] = None
    price: float = 0.0


class MentorshipRequestResponse(BaseModel):
    id: int
    mentee_id: int
    mentor_id: int
    type: str
    topic: str
    message: Optional[str] = None
    status: str
    duration_minutes: int
    proposed_datetime: Optional[datetime] = None
    price: float
    created_at: Optional[datetime] = None
    mentee_name: Optional[str] = None
    mentor_name: Optional[str] = None

    model_config = {"from_attributes": True}


class MentorshipRequestRespond(BaseModel):
    action: str  # accept, decline


# --- Session ---

class SessionResponse(BaseModel):
    id: int
    request_id: Optional[int] = None
    mentor_id: int
    mentee_id: int
    scheduled_at: datetime
    duration_minutes: int
    status: str
    topic: Optional[str] = None
    notes: Optional[str] = None
    rating: Optional[float] = None
    feedback: Optional[str] = None
    price: float = 0.0
    created_at: Optional[datetime] = None
    mentee_name: Optional[str] = None
    mentor_name: Optional[str] = None

    model_config = {"from_attributes": True}


class SessionCompleteRequest(BaseModel):
    rating: Optional[float] = None
    feedback: Optional[str] = None
    notes: Optional[str] = None


# --- Stats ---

class MentorStats(BaseModel):
    total_sessions: int
    sessions_this_week: int
    active_mentees: int
    average_rating: float
    monthly_income: float
    pending_requests: int
