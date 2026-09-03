from fastapi import APIRouter, Query, Depends
import asyncpg
from datetime import datetime, timezone, timedelta
from typing import Optional
from backend_py.database import get_db_pool
from backend_py.dependencies import get_optional_user
from backend_py.models.leaderboard import (
    LeaderboardResponse,
    PodiumEntry,
    RankingEntry,
    UserRank,
)

router = APIRouter()

@router.get("", response_model=LeaderboardResponse)
async def get_leaderboard(
    period: str = Query("daily", pattern="^(daily|weekly|monthly)$"),
    metric: str = Query("score"),
    limit: int = Query(50, ge=1, le=100),
    current_user: Optional[dict] = Depends(get_optional_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    now = datetime.now(timezone.utc)
    reset_at_str = None
    if period == "daily":
        start_date = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
        next_midnight = start_date + timedelta(days=1)
        reset_at_str = next_midnight.isoformat()
        title = "Daily Top Smile Scores"
    elif period == "weekly":
        start_date = now - timedelta(days=7)
        title = "Weekly Top Smile Scores"
    else:
        start_date = now - timedelta(days=30)
        title = "Monthly Smile Champions"

    from_date_str = start_date.strftime("%Y-%m-%d")
    to_date_str = now.strftime("%Y-%m-%d")
    current_user_id = current_user.get("user_id") if current_user else None

    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT 
                u.id AS user_id,
                COALESCE(u.name, 'Smiler') AS user_name,
                u.image AS avatar_url,
                COALESCE(u.streak_count, 0) AS streak_count,
                MAX(sc.smile_score)::int AS primary_value
            FROM "user" u
            JOIN smile_captures sc ON sc.user_id = u.id
            WHERE sc.created_at >= $1
            GROUP BY u.id, u.name, u.image, u.streak_count
            ORDER BY primary_value DESC, MIN(sc.created_at) ASC
            LIMIT $2
            """,
            start_date,
            limit,
        )

        all_rankings = []
        user_rank_obj = None

        for index, row in enumerate(rows, start=1):
            uid = row["user_id"]
            val = row["primary_value"] or 0
            is_curr = (uid == current_user_id) if current_user_id else False

            if val >= 95:
                byline = f"Duchenne Smile ({val}%)"
            elif val >= 88:
                byline = f"Radiant Smile ({val}%)"
            elif val >= 80:
                byline = f"Great Smile ({val}%)"
            else:
                byline = f"Warm Smile ({val}%)"

            entry = RankingEntry(
                rank=index,
                userId=str(uid),
                userName=row["user_name"],
                byline=byline,
                value=val,
                change=0,
                avatarUrl=row["avatar_url"],
                isCurrentUser=is_curr,
                displayed=True,
            )
            all_rankings.append(entry)

            if is_curr:
                user_rank_obj = UserRank(
                    rank=index,
                    value=val,
                    change=0,
                )

        if current_user_id and not user_rank_obj:
            my_val = await conn.fetchval(
                "SELECT COALESCE(MAX(smile_score), 0)::int FROM smile_captures WHERE user_id = $1",
                current_user_id,
            ) or 0
            rank_count = await conn.fetchval(
                "SELECT COUNT(DISTINCT user_id) FROM smile_captures WHERE smile_score > $1",
                my_val,
            ) or 0

            user_rank_obj = UserRank(
                rank=(rank_count or 0) + 1,
                value=my_val,
                change=0,
            )

    podium_entries = []
    for r in all_rankings[:3]:
        podium_entries.append(
            PodiumEntry(
                rank=r.rank,
                userId=r.userId,
                userName=r.userName,
                value=r.value,
                avatarUrl=r.avatarUrl,
            )
        )

    return LeaderboardResponse(
        period=period,
        title=title,
        fromDate=from_date_str,
        toDate=to_date_str,
        resetAt=reset_at_str,
        podium=podium_entries,
        rankings=all_rankings,
        currentUserRank=user_rank_obj,
    )
