import asyncpg
import secrets
from typing import Dict, Any, Optional

MAX_DAILY_REFERRAL_REWARDS = 5
REFERRER_BONUS = 200
REFEREE_BONUS = 50

def generate_referral_code(user_id: str) -> str:
    token = secrets.token_hex(2).upper()
    prefix = user_id.replace("-", "")[:4].upper()
    return f"SMILE-{prefix}{token}"

async def ensure_user_referral_code(conn: asyncpg.Connection, user_id: str) -> str:
    code = await conn.fetchval(
        """
        SELECT referral_code
        FROM "user"
        WHERE id = $1
        """,
        user_id,
    )
    if not code:
        code = generate_referral_code(user_id)
        await conn.execute(
            """
            UPDATE "user"
            SET referral_code = $1
            WHERE id = $2
            """,
            code,
            user_id,
        )
    return code

async def process_first_capture_referral(
    conn: asyncpg.Connection,
    user_id: str
) -> bool:
    total_captures = await conn.fetchval(
        """
        SELECT COUNT(*)
        FROM smile_captures
        WHERE user_id = $1
        """,
        user_id,
    )

    if total_captures != 1:
        return False

    referral = await conn.fetchrow(
        """
        SELECT id, referrer_id, referred_id, status
        FROM referrals
        WHERE referred_id = $1 AND status = 'pending'
        LIMIT 1
        """,
        user_id,
    )

    if not referral:
        return False

    referrer_id = referral["referrer_id"]

    daily_rewards_count = await conn.fetchval(
        """
        SELECT COUNT(*)
        FROM coin_ledger
        WHERE user_id = $1 AND reason = 'referral_bonus' AND created_at >= (NOW() AT TIME ZONE 'UTC')::date
        """,
        referrer_id,
    )

    if (daily_rewards_count or 0) < MAX_DAILY_REFERRAL_REWARDS:
        await conn.execute(
            """
            INSERT INTO coin_ledger (user_id, coins, reason, created_at)
            VALUES ($1, $2, 'referral_bonus', NOW())
            """,
            referrer_id,
            REFERRER_BONUS,
        )

    await conn.execute(
        """
        INSERT INTO coin_ledger (user_id, coins, reason, created_at)
        VALUES ($1, $2, 'referral_bonus', NOW())
        """,
        user_id,
        REFEREE_BONUS,
    )

    await conn.execute(
        """
        UPDATE referrals
        SET status = 'completed', completed_at = NOW()
        WHERE id = $1
        """,
        referral["id"],
    )

    return True

async def get_referral_stats(
    conn: asyncpg.Connection,
    user_id: str
) -> Dict[str, Any]:
    referral_code = await ensure_user_referral_code(conn, user_id)

    completed_count = await conn.fetchval(
        """
        SELECT COUNT(*)
        FROM referrals
        WHERE referrer_id = $1 AND status = 'completed'
        """,
        user_id,
    ) or 0

    pending_count = await conn.fetchval(
        """
        SELECT COUNT(*)
        FROM referrals
        WHERE referrer_id = $1 AND status = 'pending'
        """,
        user_id,
    ) or 0

    bonus_coins = await conn.fetchval(
        """
        SELECT COALESCE(SUM(coins), 0)
        FROM coin_ledger
        WHERE user_id = $1 AND reason = 'referral_bonus'
        """,
        user_id,
    ) or 0

    daily_count = await conn.fetchval(
        """
        SELECT COUNT(*)
        FROM coin_ledger
        WHERE user_id = $1 AND reason = 'referral_bonus' AND created_at >= (NOW() AT TIME ZONE 'UTC')::date
        """,
        user_id,
    ) or 0

    remaining_today = max(0, MAX_DAILY_REFERRAL_REWARDS - (daily_count or 0))

    return {
        "referral_code": referral_code,
        "referral_link": f"https://opensmile.app/join/{referral_code}",
        "stats": {
            "friends_referred": completed_count,
            "bonus_coins_earned": bonus_coins,
            "pending_referrals": pending_count,
        },
        "remaining_today": remaining_today,
    }

async def validate_code(
    conn: asyncpg.Connection,
    code: str
) -> Dict[str, Any]:
    row = await conn.fetchrow(
        """
        SELECT id, name
        FROM "user"
        WHERE referral_code = $1
        LIMIT 1
        """,
        code.strip().upper(),
    )
    if not row:
        return {
            "valid": False,
            "referrer_name": None,
            "message": "Invalid referral code",
        }
    return {
        "valid": True,
        "referrer_name": row["name"],
        "message": f"Valid code from {row['name']}",
    }
