import asyncpg
from datetime import datetime, timezone
from typing import Tuple, Dict, Any
from fastapi import HTTPException, status

def calculate_streak_multiplier(streak_count: int) -> float:
    if streak_count <= 1:
        return 1.0
    elif streak_count == 2:
        return 1.2
    elif streak_count < 7:
        return 1.5
    else:
        return min(2.0, 1.5 + (streak_count - 3) * 0.1)

async def update_user_streak(conn: asyncpg.Connection, user_id: str) -> Tuple[int, float]:
    row = await conn.fetchrow(
        """
        SELECT user_id, streak_count, last_capture_at, freeze_available, freeze_used_at
        FROM streaks
        WHERE user_id = $1
        """,
        user_id,
    )

    now = datetime.now(timezone.utc)

    if not row:
        new_streak = 1
        await conn.execute(
            """
            INSERT INTO streaks (user_id, streak_count, last_capture_at, freeze_available)
            VALUES ($1, $2, $3, true)
            ON CONFLICT (user_id) DO UPDATE
            SET streak_count = $2, last_capture_at = $3
            """,
            user_id,
            new_streak,
            now,
        )
        multiplier = calculate_streak_multiplier(new_streak)
        await conn.execute(
            """
            UPDATE "user"
            SET streak_count = $1, last_streak_at = $2
            WHERE id = $3
            """,
            new_streak,
            now,
            user_id,
        )
        return new_streak, multiplier

    streak_count = row["streak_count"] or 0
    last_capture_at = row["last_capture_at"]
    freeze_used_at = row["freeze_used_at"]

    if last_capture_at is None:
        new_streak = max(1, streak_count)
    else:
        if last_capture_at.tzinfo is None:
            last_capture_at = last_capture_at.replace(tzinfo=timezone.utc)
        elapsed_hours = (now - last_capture_at).total_seconds() / 3600.0

        if elapsed_hours < 20.0:
            new_streak = max(1, streak_count)
        elif 20.0 <= elapsed_hours <= 48.0:
            new_streak = streak_count + 1
        else:
            is_frozen = False
            if freeze_used_at:
                if freeze_used_at.tzinfo is None:
                    freeze_used_at = freeze_used_at.replace(tzinfo=timezone.utc)
                if (now - freeze_used_at).total_seconds() / 3600.0 <= 48.0:
                    is_frozen = True
            
            if is_frozen:
                new_streak = max(1, streak_count)
            else:
                new_streak = 1

    await conn.execute(
        """
        UPDATE streaks
        SET streak_count = $1, last_capture_at = $2
        WHERE user_id = $3
        """,
        new_streak,
        now,
        user_id,
    )

    await conn.execute(
        """
        UPDATE "user"
        SET streak_count = $1, last_streak_at = $2
        WHERE id = $3
        """,
        new_streak,
        now,
        user_id,
    )

    multiplier = calculate_streak_multiplier(new_streak)
    return new_streak, multiplier

async def get_streak_info(conn: asyncpg.Connection, user_id: str) -> Dict[str, Any]:
    row = await conn.fetchrow(
        """
        SELECT user_id, streak_count, last_capture_at, freeze_available, freeze_used_at
        FROM streaks
        WHERE user_id = $1
        """,
        user_id,
    )
    if not row:
        return {
            "streak_count": 0,
            "last_capture_at": None,
            "freeze_available": True,
            "freeze_used_at": None,
            "streak_multiplier": 1.0,
            "is_active": False,
        }

    streak_count = row["streak_count"] or 0
    last_capture_at = row["last_capture_at"]
    is_active = False
    if last_capture_at:
        now = datetime.now(timezone.utc)
        if last_capture_at.tzinfo is None:
            last_capture_at = last_capture_at.replace(tzinfo=timezone.utc)
        elapsed_hours = (now - last_capture_at).total_seconds() / 3600.0
        is_active = elapsed_hours <= 48.0

    return {
        "streak_count": streak_count,
        "last_capture_at": last_capture_at.isoformat() if last_capture_at else None,
        "freeze_available": bool(row["freeze_available"]),
        "freeze_used_at": row["freeze_used_at"].isoformat() if row["freeze_used_at"] else None,
        "streak_multiplier": calculate_streak_multiplier(streak_count),
        "is_active": is_active,
    }

async def activate_streak_freeze(conn: asyncpg.Connection, user_id: str) -> bool:
    row = await conn.fetchrow(
        """
        SELECT freeze_available
        FROM streaks
        WHERE user_id = $1
        """,
        user_id,
    )
    if not row or not row["freeze_available"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Streak freeze is not available or already consumed this week."
        )

    await conn.execute(
        """
        UPDATE streaks
        SET freeze_available = false, freeze_used_at = NOW()
        WHERE user_id = $1
        """,
        user_id,
    )
    return True
