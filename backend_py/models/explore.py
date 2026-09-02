from pydantic import BaseModel
from typing import List, Optional

class ExplorePostItem(BaseModel):
    id: str
    userId: str
    user: str
    avatar: str
    score: int
    caption: Optional[str] = None
    imageUrl: str
    likes: int
    timeAgo: str
    expiresIn: Optional[str] = None
    isLikedByMe: bool = False
    bg: str = "bg-primary"

class CreatePostRequest(BaseModel):
    image_url: str
    smile_score: int
    caption: Optional[str] = None
    capture_id: Optional[str] = None

class CreatePostResponse(BaseModel):
    id: str
    image_url: str
    smile_score: int
    caption: Optional[str] = None
    bonus_coins_awarded: int = 0
    message: str

class LikeToggleResponse(BaseModel):
    liked: bool
    likes_count: int

class ExploreFeedResponse(BaseModel):
    posts: List[ExplorePostItem]
    page: int
    total: int
