from typing import Optional
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: str
    password: str
    username: str
    full_name: str
    role: str = "mentee"
    keep_name_private: bool = False
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


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
