from fastapi import APIRouter, Depends
import asyncpg
from backend_py.database import get_db_pool
from backend_py.dependencies import get_current_user
from backend_py.models.streaks import StreakStatusResponse, StreakFreezeResponse
from backend_py.services.streak_engine import get_streak_info, activate_streak_freeze

router = APIRouter()

@router.get("", response_model=StreakStatusResponse)
@router.get("/current", response_model=StreakStatusResponse)
async def get_current_user_streak(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    async with pool.acquire() as conn:
        info = await get_streak_info(conn, current_user["user_id"])
    return StreakStatusResponse(**info)

@router.post("/freeze", response_model=StreakFreezeResponse)
async def use_streak_freeze(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    async with pool.acquire() as conn:
        await activate_streak_freeze(conn, current_user["user_id"])
    return StreakFreezeResponse(
        success=True,
        message="Streak freeze activated successfully for 48 hours.",
        freeze_available=False,
    )
