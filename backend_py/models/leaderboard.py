from pydantic import BaseModel
from typing import List, Optional

class PodiumEntry(BaseModel):
    rank: int
    userId: str
    userName: str
    value: int
    avatarUrl: Optional[str] = None

class RankingEntry(BaseModel):
    rank: int
    userId: str
    userName: str
    byline: Optional[str] = None
    value: int
    change: Optional[int] = 0
    avatarUrl: Optional[str] = None
    isCurrentUser: Optional[bool] = False
    displayed: Optional[bool] = True

class UserRank(BaseModel):
    rank: int
    value: int
    change: Optional[int] = 0

class LeaderboardResponse(BaseModel):
    period: str
    title: str
    fromDate: str
    toDate: str
    podium: List[PodiumEntry]
    rankings: List[RankingEntry]
    currentUserRank: Optional[UserRank] = None
