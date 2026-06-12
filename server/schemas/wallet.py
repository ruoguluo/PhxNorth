from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field


class WalletResponse(BaseModel):
    id: int
    user_id: int
    balance: float
    auto_reload_enabled: bool
    auto_reload_threshold: float
    auto_reload_amount: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class WalletTransactionResponse(BaseModel):
    id: int
    wallet_id: int
    type: str
    amount: float
    balance_after: float
    session_id: Optional[int] = None
    description: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class DebitTickResponse(BaseModel):
    balance: float
    warning: Optional[str] = None


class TopUpRequest(BaseModel):
    amount: float = Field(gt=0, description="Amount in USD to add to wallet")


class AutoReloadSettingsRequest(BaseModel):
    enabled: bool
    threshold: float = Field(gt=0, description="Balance threshold to trigger reload")
    amount: float = Field(gt=0, description="Amount to charge on reload")


class DebitTickRequest(BaseModel):
    session_id: int
