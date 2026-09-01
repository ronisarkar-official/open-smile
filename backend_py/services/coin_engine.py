import asyncpg
from typing import Tuple
from fastapi import HTTPException, status

def calculate_smile_coins(smile_score: int, multiplier: float = 1.0) -> Tuple[int, int]:
    if smile_score <= 0:
        return 0, 0
    base_coins = max(1, round(smile_score * 0.15))
    total_coins = max(1, round(base_coins * multiplier))
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
