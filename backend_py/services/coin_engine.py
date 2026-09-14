import random
import asyncpg
from typing import Tuple, Optional, Dict, Any
from fastapi import HTTPException, status

DEFAULT_SMILE_TIERS = [
    {"name": "RADIANT", "minScore": 92, "minCoins": 7, "maxCoins": 14},
    {"name": "GLOWING", "minScore": 75, "minCoins": 5, "maxCoins": 10},
    {"name": "WARM", "minScore": 55, "minCoins": 3, "maxCoins": 7},
    {"name": "GENTLE", "minScore": 35, "minCoins": 2, "maxCoins": 5},
    {"name": "SUBTLE", "minScore": 15, "minCoins": 1, "maxCoins": 3},
    {"name": "FAINT", "minScore": 11, "minCoins": 1, "maxCoins": 2},
    {"name": "NONE", "minScore": 0, "minCoins": 0, "maxCoins": 0},
]

def calculate_smile_coins(
    smile_score: int,
    multiplier: float = 1.0,
    config: Optional[Dict[str, Any]] = None,
) -> Tuple[int, int]:
    if smile_score <= 0:
        return 0, 0

    if not config:
        base_coins = max(1, round(smile_score * 0.15))
        total_coins = max(1, round(base_coins * multiplier))
        return base_coins, total_coins

    tiers = config.get("tiers") or DEFAULT_SMILE_TIERS
    sorted_tiers = sorted(tiers, key=lambda t: t.get("minScore", 0), reverse=True)

    min_score_threshold = config.get("min_smile_score_threshold", 11)
    coin_multiplier = float(config.get("coin_multiplier", 1.0) or 1.0)
    lucky_drop_enabled = config.get("lucky_drop_enabled", True)
    lucky_drop_chance = float(config.get("lucky_drop_chance", 0.1) or 0.1)
    lucky_bonus_min = int(config.get("lucky_bonus_min", 2) or 2)
    lucky_bonus_max = int(config.get("lucky_bonus_max", 5) or 5)

    clamped_score = max(0, min(100, round(smile_score)))
    matched_tier = sorted_tiers[-1]
    for tier in sorted_tiers:
        if clamped_score >= tier.get("minScore", 0):
            matched_tier = tier
            break

    max_coins = matched_tier.get("maxCoins", 0)
    min_coins = matched_tier.get("minCoins", 0)

    if clamped_score < min_score_threshold or max_coins == 0:
        return 0, 0

    min_range = min(min_coins, max_coins)
    max_range = max(min_coins, max_coins)
    base_coins = random.randint(min_range, max_range)

    lucky_bonus = 0
    if lucky_drop_enabled and random.random() < lucky_drop_chance:
        lucky_bonus = random.randint(min(lucky_bonus_min, lucky_bonus_max), max(lucky_bonus_min, lucky_bonus_max))

    calculated_total = round((base_coins + lucky_bonus) * multiplier * coin_multiplier)
    scratch_min = config.get("scratch_min_coins")
    scratch_max = config.get("scratch_max_coins")
    if scratch_min is not None and scratch_min > 0:
        calculated_total = max(scratch_min, calculated_total)
    if scratch_max is not None and scratch_max > 0:
        calculated_total = min(scratch_max, calculated_total)

    total_coins = max(1, calculated_total)
    return base_coins, total_coins

async def get_user_balance(conn: asyncpg.Connection, user_id: str) -> int:
    balance = await conn.fetchval(
        """
        SELECT COALESCE(SUM(coins), 0)
        FROM coin_ledger
        WHERE user_id = $1
        """,
        user_id,
    )
    return int(balance or 0)

async def get_lifetime_earned_coins(conn: asyncpg.Connection, user_id: str) -> int:
    earned = await conn.fetchval(
        """
        SELECT COALESCE(SUM(coins), 0)
        FROM coin_ledger
        WHERE user_id = $1 AND coins > 0
        """,
        user_id,
    )
    return int(earned or 0)

async def award_coins(conn: asyncpg.Connection, user_id: str, amount: int, reason: str) -> int:
    if amount <= 0:
        return await get_user_balance(conn, user_id)

    await conn.execute(
        """
        INSERT INTO coin_ledger (user_id, coins, reason, created_at)
        VALUES ($1, $2, $3, NOW())
        """,
        user_id,
        amount,
        reason,
    )
    return await get_user_balance(conn, user_id)

async def deduct_coins(conn: asyncpg.Connection, user_id: str, amount: int, reason: str) -> int:
    if amount <= 0:
        return await get_user_balance(conn, user_id)

    balance = await get_user_balance(conn, user_id)
    if balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient coins. You have {balance} coins, but {amount} are required."
        )

    await conn.execute(
        """
        INSERT INTO coin_ledger (user_id, coins, reason, created_at)
        VALUES ($1, $2, $3, NOW())
        """,
        user_id,
        -amount,
        reason,
    )
    return await get_user_balance(conn, user_id)
