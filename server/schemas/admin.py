from pydantic import BaseModel


class PlatformStats(BaseModel):
    total_users: int
    total_mentors: int
    total_mentees: int
    total_admins: int
    active_users: int
    total_sessions: int
    completed_sessions: int
    pending_requests: int
    average_rating: float
    total_revenue: float


class AdminUserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    is_active: bool
    is_online: bool
    total_sessions: int
    rating: float

    model_config = {"from_attributes": True}


class AdminUserUpdate(BaseModel):
    is_active: bool | None = None
    role: str | None = None
