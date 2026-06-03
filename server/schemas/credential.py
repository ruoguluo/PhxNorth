from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class CredentialCreate(BaseModel):
    type: str  # certification / training / psychometric
    name: str
    issuer: Optional[str] = None
    date_obtained: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    training_type: Optional[str] = None
    duration: Optional[str] = None
    test_type: Optional[str] = None
    result_summary: Optional[str] = None
    visibility: str = "public"


class CredentialUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    issuer: Optional[str] = None
    date_obtained: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    training_type: Optional[str] = None
    duration: Optional[str] = None
    test_type: Optional[str] = None
    result_summary: Optional[str] = None
    visibility: Optional[str] = None


class CredentialResponse(BaseModel):
    id: int
    user_id: int
    type: str
    name: str
    issuer: Optional[str] = None
    date_obtained: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    training_type: Optional[str] = None
    duration: Optional[str] = None
    test_type: Optional[str] = None
    result_summary: Optional[str] = None
    visibility: str = "public"
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
