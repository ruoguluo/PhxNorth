from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ConsultingProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    duration_weeks: Optional[int] = None
    required_skills: Optional[list[str]] = None
    industry: Optional[str] = None


class ConsultingProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    client_name: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    duration_weeks: Optional[int] = None
    required_skills: Optional[list[str]] = None
    industry: Optional[str] = None
    status: Optional[str] = None


class ConsultingProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    duration_weeks: Optional[int] = None
    required_skills: Optional[list[str]] = None
    industry: Optional[str] = None
    status: str = "open"
    assigned_mentor_id: Optional[int] = None
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ApplicationCreate(BaseModel):
    proposal: Optional[str] = None
    proposed_rate: Optional[float] = None


class ApplicationResponse(BaseModel):
    id: int
    project_id: int
    mentor_id: int
    proposal: Optional[str] = None
    proposed_rate: Optional[float] = None
    status: str = "pending"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ApplicationAction(BaseModel):
    action: str  # "approve" or "reject"


class ProjectWithApplications(ConsultingProjectResponse):
    applications: list[ApplicationResponse] = []
