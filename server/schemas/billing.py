from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class PaymentResponse(BaseModel):
    id: int
    session_id: Optional[int] = None
    mentee_id: int
    mentor_id: int
    amount: float
    platform_fee: float
    mentor_earnings: float
    currency: str
    status: str
    payout_id: Optional[int] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PayoutResponse(BaseModel):
    id: int
    mentor_id: int
    amount: float
    currency: str
    status: str
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PayoutRunResponse(BaseModel):
    payouts_created: int
    total_disbursed: float
    payouts: list[PayoutResponse] = []
