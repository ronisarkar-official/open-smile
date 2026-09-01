from pydantic import BaseModel
from typing import Optional

class ReferralStats(BaseModel):
    friends_referred: int
    bonus_coins_earned: int
    pending_referrals: int

class ReferStatsResponse(BaseModel):
    referral_code: str
    referral_link: str
    stats: ReferralStats
    remaining_today: int

class ReferValidateRequest(BaseModel):
    referral_code: str

class ReferValidateResponse(BaseModel):
    valid: bool
    referrer_name: Optional[str] = None
    message: Optional[str] = None
