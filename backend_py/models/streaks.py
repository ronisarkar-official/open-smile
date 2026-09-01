from pydantic import BaseModel
from typing import Optional

class StreakStatusResponse(BaseModel):
    streak_count: int
    last_capture_at: Optional[str] = None
    freeze_available: bool
    freeze_used_at: Optional[str] = None
    streak_multiplier: float
    is_active: bool

class StreakFreezeResponse(BaseModel):
    success: bool
    message: str
    freeze_available: bool
