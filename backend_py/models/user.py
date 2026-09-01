from pydantic import BaseModel
from typing import Optional

class UserProfile(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    image: Optional[str] = None
    role: Optional[str] = None
    streak_count: Optional[int] = 0
    referral_code: Optional[str] = None

class PublicUserProfile(BaseModel):
    id: str
    name: str
    username: str
    image: Optional[str] = None
    avatar: str
    joinDate: str
    totalSmiles: int
    bestScore: int
    coins: int
    streak: int
    rank: int
    publicSmiles: list = []
