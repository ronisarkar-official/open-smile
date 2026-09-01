from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg
from backend_py.database import get_db_pool
from backend_py.dependencies import get_current_user
from backend_py.models.capture import CaptureSubmitRequest, CaptureSubmitResponse
from backend_py.services.anti_cheat import validate_anti_cheat
from backend_py.services.coin_engine import calculate_smile_coins, get_user_balance
from backend_py.services.streak_engine import update_user_streak
from backend_py.services.referral_engine import process_first_capture_referral

router = APIRouter()

@router.post("/submit", response_model=CaptureSubmitResponse)
async def submit_capture(
    payload: CaptureSubmitRequest,
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]

    async with pool.acquire() as conn:
        async with conn.transaction():
            await validate_anti_cheat(
                conn=conn,
                user_id=user_id,
                phash=payload.phash,
                liveness_verified=payload.liveness_verified,
            )

            streak_count, streak_multiplier = await update_user_streak(conn, user_id)
            base_coins, total_coins = calculate_smile_coins(payload.smile_score, streak_multiplier)

            capture_id = await conn.fetchval(
                """
                INSERT INTO smile_captures (user_id, smile_score, coins_awarded, created_at)
                VALUES ($1, $2, $3, NOW())
                RETURNING id
                """,
                user_id,
                payload.smile_score,
                total_coins,
            )

            if payload.phash:
                await conn.execute(
                    """
                    INSERT INTO image_hashes (user_id, capture_id, image_hash, phash, created_at)
                    VALUES ($1, $2, $3, $4, NOW())
                    """,
                    user_id,
                    capture_id,
                    payload.phash,
                    payload.phash,
                )

            # Store the earned card as unscratched (is_scratched = false)
            theme_color = "#C6F135" if payload.smile_score >= 85 else "#7B61FF" if payload.smile_score >= 70 else "#FF2D78"
            card_id = await conn.fetchval(
                """
                INSERT INTO scratch_cards (user_id, title, source, coins, voucher_id, is_scratched, theme_color, created_at)
                VALUES ($1, $2, 'Live Smile Check', $3, $4, false, $5, NOW())
                RETURNING id
                """,
                user_id,
                f"Smile Check ({payload.smile_score} pts)",
                total_coins,
                str(capture_id),
                theme_color,
            )

            first_capture_bonus = await process_first_capture_referral(conn, user_id)
            balance = await get_user_balance(conn, user_id)

    return CaptureSubmitResponse(
        coins_awarded=total_coins,
        base_coins=base_coins,
        streak_multiplier=streak_multiplier,
        streak_count=streak_count,
        balance=balance,
        smile_score=payload.smile_score,
        first_capture_bonus_unlocked=first_capture_bonus,
        card_id=str(card_id) if card_id else None,
        is_scratched=False,
    )
