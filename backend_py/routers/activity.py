from fastapi import APIRouter, Depends
import asyncpg
from typing import List
from backend_py.database import get_db_pool
from backend_py.models.activity import ActivityRecentResponse, ActivityItem

router = APIRouter()

@router.get("/recent", response_model=ActivityRecentResponse)
async def get_recent_activity(
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT 
                l.id,
                l.coins,
                l.reason,
                l.created_at,
                u.name AS user_name
            FROM coin_ledger l
            LEFT JOIN "user" u ON l.user_id = u.id
            ORDER BY l.created_at DESC
            LIMIT 20
            """
        )

    items: List[ActivityItem] = []
    for r in rows:
        reason = r["reason"]
        coins = abs(r["coins"] or 0)
        name = r["user_name"] or "A smiler"
        first_name = name.split()[0] if name else "Someone"

        if reason == "capture":
            text = f"{first_name} scored {min(100, 75 + coins * 2)}! 🔥 (+{coins} coins)"
            item_type = "capture"
        elif reason == "voucher_claim":
            text = f"{first_name} just redeemed a brand gift card! 🎁"
            item_type = "voucher"
        elif reason == "referral_bonus":
            text = f"{first_name} earned +{coins} referral bonus coins! 🚀"
            item_type = "referral"
        elif reason == "explore_post_bonus":
            text = f"{first_name} shared a smile to the explore feed! 😄"
            item_type = "explore"
        elif reason == "signup_bonus":
            text = f"{first_name} joined Open Smile! (+{coins} welcome bonus)"
            item_type = "signup"
        else:
            text = f"{first_name} earned +{coins} smile coins! ⭐"
            item_type = "general"

        items.append(
            ActivityItem(
                id=str(r["id"]),
                text=text,
                timestamp=r["created_at"].isoformat() if r["created_at"] else "",
                type=item_type,
            )
        )

    if not items:
        fallback_items = [
            ActivityItem(id="1", text="Someone just scored 96! 🔥", timestamp="", type="capture"),
            ActivityItem(id="2", text="Marcus hit a 7-day streak! 🔥", timestamp="", type="streak"),
            ActivityItem(id="3", text="A user redeemed an Amazon voucher 🎁", timestamp="", type="voucher"),
            ActivityItem(id="4", text="Aria Chen earned 18 coins 😄", timestamp="", type="capture"),
            ActivityItem(id="5", text="Someone just scored 92! 🔥", timestamp="", type="capture"),
        ]
        return ActivityRecentResponse(items=fallback_items)

    return ActivityRecentResponse(items=items)
