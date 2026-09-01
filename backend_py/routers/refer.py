from fastapi import APIRouter, Depends
import asyncpg
from backend_py.database import get_db_pool
from backend_py.dependencies import get_current_user
from backend_py.models.refer import (
    ReferStatsResponse,
    ReferValidateRequest,
    ReferValidateResponse,
)
from backend_py.services.referral_engine import get_referral_stats, validate_code

router = APIRouter()

@router.get("/stats", response_model=ReferStatsResponse)
async def get_stats(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    async with pool.acquire() as conn:
        data = await get_referral_stats(conn, current_user["user_id"])
    return ReferStatsResponse(**data)

@router.post("/validate", response_model=ReferValidateResponse)
async def validate_referral(
    payload: ReferValidateRequest,
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    async with pool.acquire() as conn:
        result = await validate_code(conn, payload.referral_code)
    return ReferValidateResponse(**result)
