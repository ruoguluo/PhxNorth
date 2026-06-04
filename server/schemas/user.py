from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    is_active: bool
    is_online: bool
    status: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    years_experience: Optional[str] = None
    current_country: Optional[str] = None
    interested_countries: Optional[list[str]] = None
    industry: Optional[str] = None
    sector: Optional[str] = None
    sub_sector: Optional[str] = None
    interested_industries: Optional[list[str]] = None
    keep_name_private: bool = False
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    hourly_rate: Optional[float] = None
    rating: float = 0.0
    total_sessions: int = 0
    monthly_income: float = 0.0
    specializations: Optional[list[str]] = None
    summary: Optional[str] = None
    functional_expertise: Optional[list[str]] = None
    markets_of_interest: Optional[list[str]] = None
    career_direction: Optional[str] = None
    preferred_mentor_geography: Optional[str] = None
    global_visibility: str = "public"
    show_current_company: bool = True
    show_full_timeline: bool = True
    allow_enterprise_view: bool = False
    allow_mentor_discovery: bool = True
    disc_scores_json: Optional[dict] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserPublicResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    role: str
    is_online: bool
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    hourly_rate: Optional[float] = None
    rating: float = 0.0
    total_sessions: int = 0
    industry: Optional[str] = None
    sector: Optional[str] = None
    current_country: Optional[str] = None
    specializations: Optional[list[str]] = None

    model_config = {"from_attributes": True}


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    summary: Optional[str] = None
    avatar_url: Optional[str] = None
    hourly_rate: Optional[float] = None
    status: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    years_experience: Optional[str] = None
    current_country: Optional[str] = None
    interested_countries: Optional[list[str]] = None
    industry: Optional[str] = None
    sector: Optional[str] = None
    sub_sector: Optional[str] = None
    interested_industries: Optional[list[str]] = None
    specializations: Optional[list[str]] = None
    keep_name_private: Optional[bool] = None
    functional_expertise: Optional[list[str]] = None
    markets_of_interest: Optional[list[str]] = None
    career_direction: Optional[str] = None
    preferred_mentor_geography: Optional[str] = None
    global_visibility: Optional[str] = None
    show_current_company: Optional[bool] = None
    show_full_timeline: Optional[bool] = None
    allow_enterprise_view: Optional[bool] = None
    allow_mentor_discovery: Optional[bool] = None
    disc_scores_json: Optional[dict] = None
