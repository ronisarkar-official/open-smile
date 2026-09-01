from fastapi import APIRouter, Request, HTTPException, status, Depends
import asyncpg
from backend_py.database import get_db_pool
from backend_py.config import get_settings

router = APIRouter()

def verify_cron_auth(request: Request) -> None:
    settings = get_settings()
    cron_secret = request.headers.get("x-cron-secret")
    if not cron_secret:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            cron_secret = auth_header.split(" ")[1].strip()

    if settings.CRON_SECRET and cron_secret != settings.CRON_SECRET:
        if settings.APP_ENV == "production":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized cron secret"
            )

@router.post("/cleanup")
async def run_cleanup_cron(
    request: Request,
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    verify_cron_auth(request)

    async with pool.acquire() as conn:
        deleted_otp = await conn.execute(
            "DELETE FROM otp_codes WHERE expires_at <= NOW()"
        )
        deleted_rate_limits = await conn.execute(
            "DELETE FROM rate_limits WHERE expires_at <= NOW()"
        )
        deleted_explore = await conn.execute(
            "DELETE FROM explore_posts WHERE created_at <= NOW() - INTERVAL '24 hours'"
        )
        deleted_posts = await conn.execute(
            "DELETE FROM posts WHERE created_at <= NOW() - INTERVAL '24 hours'"
        )
        deleted_hashes = await conn.execute(
            "DELETE FROM image_hashes WHERE created_at <= NOW() - INTERVAL '30 days'"
        )

    return {
        "status": "ok",
        "cleaned": {
            "otp_codes": deleted_otp,
            "rate_limits": deleted_rate_limits,
            "explore_posts": deleted_explore,
            "posts": deleted_posts,
            "image_hashes": deleted_hashes,
        }
    }

@router.get("/keepalive")
async def run_keepalive(
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    async with pool.acquire() as conn:
        await conn.execute("SELECT 1")
    return {"status": "ok", "message": "Database keepalive ping successful"}
