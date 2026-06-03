from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class TimelineEntryCreate(BaseModel):
    type: str  # education / career / business
    title: str
    organization: Optional[str] = None
    hide_organization: bool = False
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    location: Optional[str] = None
    industry_l1: Optional[str] = None
    industry_l2: Optional[str] = None
    industry_l3: Optional[str] = None
    description: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    visibility: str = "public"
    sort_order: int = 0


class TimelineEntryUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    organization: Optional[str] = None
    hide_organization: Optional[bool] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    location: Optional[str] = None
    industry_l1: Optional[str] = None
    industry_l2: Optional[str] = None
    industry_l3: Optional[str] = None
    description: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    visibility: Optional[str] = None
    sort_order: Optional[int] = None


class TimelineEntryResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    organization: Optional[str] = None
    hide_organization: bool = False
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    location: Optional[str] = None
    industry_l1: Optional[str] = None
    industry_l2: Optional[str] = None
    industry_l3: Optional[str] = None
    description: Optional[str] = None
    degree_level: Optional[str] = None
    field_of_study: Optional[str] = None
    visibility: str = "public"
    sort_order: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ReorderItem(BaseModel):
    id: int
    sort_order: int
