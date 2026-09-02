from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg
from backend_py.database import get_db_pool
from backend_py.dependencies import get_current_user
from backend_py.services.coin_engine import get_user_balance
from backend_py.models.user import PublicUserProfile

router = APIRouter()

def get_avatar_letters(name: str) -> str:
    parts = name.strip().split()
    if len(parts) >= 2:
        return f"{parts[0][0]}{parts[1][0]}".upper()
    return name[:2].upper() if name else "OS"

from datetime import datetime, timezone
from typing import Optional

def format_activity_time(dt: Optional[datetime]) -> str:
    if not dt:
        return "Recently"
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    delta_days = (now.date() - dt.date()).days
    time_str = dt.strftime("%I:%M %p").lstrip("0")
    if delta_days == 0:
        return f"Today, {time_str}"
    elif delta_days == 1:
        return f"Yesterday, {time_str}"
    else:
        return f"{dt.strftime('%b %d')}, {time_str}"

def get_smile_quality(score: int) -> str:
    if score >= 95:
        return "Duchenne Smile"
    if score >= 88:
        return "Radiant Smile"
    if score >= 80:
        return "Great Smile"
    if score >= 70:
        return "Warm Smile"
    return "Gentle Smile"

@router.get("/balance")
async def get_my_coin_balance(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    async with pool.acquire() as conn:
        balance = await get_user_balance(conn, current_user["user_id"])
    return {"balance": balance}

@router.get("/dashboard-stats")
async def get_my_dashboard_stats(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]

    async with pool.acquire() as conn:
        balance = await get_user_balance(conn, user_id)

        streak_val = await conn.fetchval(
            "SELECT streak_count FROM streaks WHERE user_id = $1",
            user_id,
        ) or 0

        # Calculate daily rank
        daily_rank = await conn.fetchval(
            """
            WITH daily_scores AS (
                SELECT 
                    user_id,
                    MAX(smile_score) AS max_score
                FROM smile_captures
                WHERE created_at >= (NOW() AT TIME ZONE 'UTC')::date
                GROUP BY user_id
            ),
            ranked AS (
                SELECT 
                    user_id,
                    DENSE_RANK() OVER (ORDER BY max_score DESC) as rk
                FROM daily_scores
                WHERE max_score > 0
            )
            SELECT rk FROM ranked WHERE user_id = $1
            """,
            user_id,
        )

        total_users = await conn.fetchval('SELECT COUNT(*) FROM "user"') or 1

        # Fetch recent smile captures
        recent_rows = await conn.fetch(
            """
            SELECT id, smile_score, coins_awarded, created_at
            FROM smile_captures
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 5
            """,
            user_id,
        )

    recent_smiles = [
        {
            "id": str(r["id"]),
            "score": r["smile_score"],
            "coins": r["coins_awarded"] or 0,
            "time": format_activity_time(r["created_at"]),
            "quality": get_smile_quality(r["smile_score"]),
        }
        for r in recent_rows
    ]

    multiplier = round(1.0 + min(streak_val * 0.1, 1.0), 1)

    return {
        "balance": balance,
        "streak": streak_val,
        "streakMultiplier": f"{multiplier}x",
        "dailyRank": int(daily_rank) if daily_rank else None,
        "totalUsers": int(total_users),
        "recentSmiles": recent_smiles,
    }

@router.get("/{username}", response_model=PublicUserProfile)
async def get_user_public_profile(
    username: str,
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    clean_username = username.strip().lower()

    async with pool.acquire() as conn:
        user_row = await conn.fetchrow(
            """
            SELECT id, name, image, streak_count, created_at, "createdAt"
            FROM "user"
            WHERE LOWER(name) = $1 OR LOWER(REPLACE(name, ' ', '')) = $1 OR id = $1
            LIMIT 1
            """,
            clean_username,
        )

        if not user_row:
            user_row = await conn.fetchrow(
                """
                SELECT id, name, image, streak_count, created_at, "createdAt"
                FROM "user"
                WHERE LOWER(name) LIKE $1
                LIMIT 1
                """,
                f"%{clean_username}%",
            )

        if not user_row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Smiler profile not found"
            )

        user_id = user_row["id"]
        user_name = user_row["name"] or "Smiler"

        total_smiles = await conn.fetchval(
            "SELECT COUNT(*) FROM smile_captures WHERE user_id = $1",
            user_id,
        ) or 0

        best_score = await conn.fetchval(
            "SELECT COALESCE(MAX(smile_score), 0) FROM smile_captures WHERE user_id = $1",
            user_id,
        ) or 0

        coins_balance = await conn.fetchval(
            "SELECT COALESCE(SUM(coins), 0) FROM coin_ledger WHERE user_id = $1",
            user_id,
        ) or 0

        streak_val = user_row["streak_count"] or 0
        if streak_val == 0:
            streak_val = await conn.fetchval(
                "SELECT streak_count FROM streaks WHERE user_id = $1",
                user_id,
            ) or 0

        user_rank = await conn.fetchval(
            """
            WITH totals AS (
                SELECT user_id, MAX(smile_score) AS s
                FROM smile_captures
                GROUP BY user_id
            )
            SELECT COUNT(*) + 1
            FROM totals
            WHERE s > $1
            """,
            best_score,
        ) or 1

        created_dt = user_row["created_at"] or user_row["createdAt"]
        join_date_str = created_dt.strftime("%B %Y") if created_dt else "August 2026"

        public_posts = await conn.fetch(
            """
            SELECT id, smile_score, likes_count, created_at
            FROM explore_posts
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 6
            """,
            user_id,
        )

    bg_classes = ["bg-primary", "bg-accent", "bg-secondary", "bg-success"]
    smiles_list = []
    for idx, p in enumerate(public_posts):
        smiles_list.append({
            "id": str(p["id"]),
            "score": p["smile_score"],
            "likes": p["likes_count"] or 0,
            "timeAgo": "recently",
            "bg": bg_classes[idx % len(bg_classes)],
        })

    return PublicUserProfile(
        id=str(user_id),
        name=user_name,
        username=clean_username,
        image=user_row["image"],
        avatar=get_avatar_letters(user_name),
        joinDate=join_date_str,
        totalSmiles=total_smiles,
        bestScore=best_score,
        coins=coins_balance,
        streak=streak_val,
        rank=int(user_rank),
        publicSmiles=smiles_list,
    )
