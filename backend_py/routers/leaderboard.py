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
    period: str = Query("weekly", pattern="^(daily|weekly|monthly)$"),
    metric: str = Query("coins", pattern="^(coins|score)$"),
    limit: int = Query(50, ge=1, le=100),
    current_user: Optional[dict] = Depends(get_optional_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    now = datetime.now(timezone.utc)
    if period == "daily":
        start_date = now - timedelta(hours=24)
        title = "Daily Top Smile Scores" if metric == "score" else "Daily Smile Sprint"
    elif period == "weekly":
        start_date = now - timedelta(days=7)
        title = "Weekly Top Smile Scores" if metric == "score" else "Weekly Smile Challenge"
    else:
        start_date = now - timedelta(days=30)
        title = "Monthly Smile Champions" if metric == "score" else "Monthly Hall of Fame"

    from_date_str = start_date.strftime("%Y-%m-%d")
    to_date_str = now.strftime("%Y-%m-%d")
    current_user_id = current_user.get("user_id") if current_user else None

    async with pool.acquire() as conn:
        if metric == "score":
            # Ranked by highest smile score in this period
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
                ORDER BY primary_value DESC
                LIMIT $2
                """,
                start_date,
                limit,
            )

            # Fallback to all-time smile scores if none in period
            if not rows:
                rows = await conn.fetch(
                    """
                    SELECT 
                        u.id AS user_id,
                        COALESCE(u.name, 'Smiler') AS user_name,
                        u.image AS avatar_url,
                        COALESCE(u.streak_count, 0) AS streak_count,
                        COALESCE(MAX(sc.smile_score), 0)::int AS primary_value
                    FROM "user" u
                    LEFT JOIN smile_captures sc ON sc.user_id = u.id
                    GROUP BY u.id, u.name, u.image, u.streak_count
                    ORDER BY primary_value DESC, u.id ASC
                    LIMIT $1
                    """,
                    limit,
                )
        else:
            # Ranked by coins earned in this period
            rows = await conn.fetch(
                """
                SELECT 
                    u.id AS user_id,
                    COALESCE(u.name, 'Smiler') AS user_name,
                    u.image AS avatar_url,
                    COALESCE(u.streak_count, 0) AS streak_count,
                    COALESCE(SUM(l.coins), 0)::int AS primary_value
                FROM "user" u
                JOIN coin_ledger l ON l.user_id = u.id
                WHERE l.created_at >= $1 AND l.coins > 0
                GROUP BY u.id, u.name, u.image, u.streak_count
                ORDER BY primary_value DESC
                LIMIT $2
                """,
                start_date,
                limit,
            )

            if not rows:
                rows = await conn.fetch(
                    """
                    SELECT 
                        u.id AS user_id,
                        COALESCE(u.name, 'Smiler') AS user_name,
                        u.image AS avatar_url,
                        COALESCE(u.streak_count, 0) AS streak_count,
                        COALESCE(SUM(l.coins), 0)::int AS primary_value
                    FROM "user" u
                    LEFT JOIN coin_ledger l ON l.user_id = u.id
                    GROUP BY u.id, u.name, u.image, u.streak_count
                    ORDER BY primary_value DESC, u.id ASC
                    LIMIT $1
                    """,
                    limit,
                )

        all_rankings = []
        user_rank_obj = None

        for index, row in enumerate(rows, start=1):
            uid = row["user_id"]
            val = row["primary_value"] or 0
            is_curr = (uid == current_user_id) if current_user_id else False
            streak = row["streak_count"] or 0

            if metric == "score":
                if val >= 95:
                    byline = f"Duchenne Smile ({val}%)"
                elif val >= 88:
                    byline = f"Radiant Smile ({val}%)"
                elif val >= 80:
                    byline = f"Great Smile ({val}%)"
                else:
                    byline = f"Warm Smile ({val}%)"
            else:
                byline = f"Level {max(1, streak * 3)} Smiler" if streak > 0 else "Active Smiler"

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
            if metric == "score":
                my_val = await conn.fetchval(
                    "SELECT COALESCE(MAX(smile_score), 0)::int FROM smile_captures WHERE user_id = $1",
                    current_user_id,
                ) or 0
                rank_count = await conn.fetchval(
                    "SELECT COUNT(DISTINCT user_id) FROM smile_captures WHERE smile_score > $1",
                    my_val,
                ) or 0
            else:
                my_val = await conn.fetchval(
                    "SELECT COALESCE(SUM(coins), 0)::int FROM coin_ledger WHERE user_id = $1",
                    current_user_id,
                ) or 0
                rank_count = await conn.fetchval(
                    """
                    SELECT COUNT(DISTINCT user_id)
                    FROM coin_ledger
                    GROUP BY user_id
                    HAVING SUM(coins) > $1
                    """,
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
        podium=podium_entries,
        rankings=all_rankings,
        currentUserRank=user_rank_obj,
    )
