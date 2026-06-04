from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class WorkshopCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    max_participants: Optional[int] = None
    price: Optional[float] = None
    tags: Optional[list[str]] = None


class WorkshopUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    max_participants: Optional[int] = None
    price: Optional[float] = None
    status: Optional[str] = None
    tags: Optional[list[str]] = None


class RegistrationResponse(BaseModel):
    id: int
    workshop_id: int
    mentee_id: int
    status: str = "registered"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class WorkshopResponse(BaseModel):
    id: int
    mentor_id: int
    title: str
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    max_participants: Optional[int] = None
    price: Optional[float] = None
    status: str = "draft"
    tags: Optional[list[str]] = None
    registered_count: int = 0
    daily_room_name: Optional[str] = None
    daily_room_url: Optional[str] = None
    recording_url: Optional[str] = None
    transcript_text: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class WorkshopWithRegistrations(WorkshopResponse):
    registrations: list[RegistrationResponse] = []
