from pydantic import BaseModel, Field
from typing import Optional

class CaptureSubmitRequest(BaseModel):
    smile_score: int = Field(..., ge=0, le=100)
    phash: Optional[str] = None
    liveness_verified: bool = True
    image_url: Optional[str] = None

class CaptureRewardBreakdown(BaseModel):
    base_coins: int
    streak_multiplier: float
    total_coins: int

class CaptureSubmitResponse(BaseModel):
    coins_awarded: int
    base_coins: int
    streak_multiplier: float
    streak_count: int
    balance: int
    smile_score: int
    first_capture_bonus_unlocked: bool = False
    card_id: Optional[str] = None
    is_scratched: Optional[bool] = False
