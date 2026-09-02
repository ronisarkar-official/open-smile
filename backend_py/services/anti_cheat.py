import asyncpg
from datetime import datetime, timezone
from fastapi import HTTPException, status
from typing import Optional

COOLDOWN_SECONDS = 3600
MAX_DAILY_CAPTURES = 5
PHASH_HAMMING_THRESHOLD = 5

def compute_hamming_distance(hash1: str, hash2: str) -> int:
    try:
        val1 = int(hash1, 16)
        val2 = int(hash2, 16)
        return bin(val1 ^ val2).count("1")
    except Exception:
        return sum(c1 != c2 for c1, c2 in zip(hash1, hash2)) + abs(len(hash1) - len(hash2))

async def validate_anti_cheat(
    conn: asyncpg.Connection,
    user_id: str,
    phash: Optional[str] = None,
    liveness_verified: bool = True
) -> None:
    settings_rows = await conn.fetch("SELECT key, value FROM system_settings")
    settings_dict = {r["key"]: r["value"] for r in settings_rows}

    liveness_enabled = settings_dict.get("liveness_detection_enabled", True)
    if liveness_enabled is True or str(liveness_enabled).lower() == "true":
        if not liveness_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Liveness check failed. Please verify in real-time camera."
            )

    cooldown_min_raw = settings_dict.get("min_capture_cooldown_minutes", 60)
    try:
        cooldown_min = int(cooldown_min_raw)
    except (ValueError, TypeError):
        cooldown_min = 60
    cooldown_seconds = cooldown_min * 60

    if cooldown_seconds > 0:
        last_capture = await conn.fetchval(
            """
            SELECT MAX(created_at)
            FROM smile_captures
            WHERE user_id = $1
            """,
            user_id,
        )
        if last_capture:
            now = datetime.now(timezone.utc)
            if last_capture.tzinfo is None:
                last_capture = last_capture.replace(tzinfo=timezone.utc)
            elapsed_seconds = (now - last_capture).total_seconds()
            if elapsed_seconds < cooldown_seconds:
                remaining_seconds = int(cooldown_seconds - elapsed_seconds)
                remaining_minutes = max(1, (remaining_seconds + 59) // 60)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Cooldown active. Try again in {remaining_minutes} minute{'s' if remaining_minutes > 1 else ''}."
                )

    max_daily_raw = settings_dict.get("max_daily_captures_per_user", 10)
    try:
        max_daily = int(max_daily_raw)
    except (ValueError, TypeError):
        max_daily = 10

    daily_count = await conn.fetchval(
        """
        SELECT COUNT(*)
        FROM smile_captures
        WHERE user_id = $1 AND created_at >= (NOW() AT TIME ZONE 'UTC')::date
        """,
        user_id,
    )

    if (daily_count or 0) >= max_daily:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Daily capture limit reached ({daily_count}/{max_daily}). Limit refreshes tonight at 12:00 AM (midnight)!"
        )

    hash_check_enabled = settings_dict.get("image_hash_check_enabled", True)
    if hash_check_enabled is True or str(hash_check_enabled).lower() == "true":
        if phash:
            past_hashes = await conn.fetch(
                """
                SELECT phash
                FROM image_hashes
                WHERE user_id = $1 AND phash IS NOT NULL AND created_at >= NOW() - INTERVAL '30 days'
                """,
                user_id,
            )
            for row in past_hashes:
                existing_phash = row["phash"]
                if existing_phash:
                    distance = compute_hamming_distance(phash, existing_phash)
                    if distance <= PHASH_HAMMING_THRESHOLD:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Duplicate or replayed image detected. Please take a fresh live photo."
                        )
