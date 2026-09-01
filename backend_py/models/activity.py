from pydantic import BaseModel
from typing import List

class ActivityItem(BaseModel):
    id: str
    text: str
    timestamp: str
    type: str

class ActivityRecentResponse(BaseModel):
    items: List[ActivityItem]
