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
            """
            WITH expired AS (
                SELECT id FROM explore_posts WHERE created_at <= NOW() - INTERVAL '24 hours'
            ),
            del_likes AS (
                DELETE FROM explore_likes WHERE post_id IN (SELECT id FROM expired)
            ),
            del_posts AS (
                DELETE FROM posts WHERE id IN (SELECT id FROM expired)
            )
            DELETE FROM explore_posts WHERE id IN (SELECT id FROM expired);
            """
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

@router.post("/leaderboard-settlement")
async def run_leaderboard_settlement(
    request: Request,
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    import random
    from datetime import datetime, timezone, timedelta

    verify_cron_auth(request)

    now = datetime.now(timezone.utc)
    yesterday = now - timedelta(days=1)
    start_of_day = datetime(yesterday.year, yesterday.month, yesterday.day, 0, 0, 0, tzinfo=timezone.utc)
    end_of_day = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59, 999999, tzinfo=timezone.utc)
    date_str = start_of_day.strftime("%Y-%m-%d")

    async with pool.acquire() as conn:
        async with conn.transaction():
            existing = await conn.fetch(
                """
                SELECT rank, user_id, score, coins_awarded, card_id
                FROM leaderboard_settlements
                WHERE period = 'daily' AND period_date = $1
                ORDER BY rank ASC
                """,
                start_of_day.date(),
            )

            if existing:
                return {
                    "status": "already_settled",
                    "date": date_str,
                    "podium": [dict(r) for r in existing],
                }

            top_rows = await conn.fetch(
                """
                SELECT 
                    u.id AS user_id,
                    COALESCE(u.name, 'Smiler') AS user_name,
                    MAX(sc.smile_score)::int AS primary_value
                FROM "user" u
                JOIN smile_captures sc ON sc.user_id = u.id
                WHERE sc.created_at >= $1 AND sc.created_at <= $2
                GROUP BY u.id, u.name
                ORDER BY primary_value DESC, MIN(sc.created_at) ASC
                LIMIT 3
                """,
                start_of_day,
                end_of_day,
            )

            if not top_rows:
                return {
                    "status": "no_captures",
                    "date": date_str,
                    "podium": [],
                }

            awards_config = [
                {"rank": 1, "title": "Daily Leaderboard Champion", "badge": "PODIUM_GOLD", "theme": "#FFD700", "min": 70, "max": 99},
                {"rank": 2, "title": "Daily Leaderboard Runner-Up", "badge": "PODIUM_SILVER", "theme": "#C0C0C0", "min": 40, "max": 69},
                {"rank": 3, "title": "Daily Leaderboard 3rd Place", "badge": "PODIUM_BRONZE", "theme": "#CD7F32", "min": 15, "max": 39},
            ]

            awarded = []
            for i, winner in enumerate(top_rows):
                cfg = awards_config[i]
                coins = random.randint(cfg["min"], cfg["max"])

                card_id = await conn.fetchval(
                    """
                    INSERT INTO scratch_cards (user_id, title, source, coins, is_scratched, theme_color, badge, created_at)
                    VALUES ($1, $2, 'Daily Leaderboard', $3, false, $4, $5, NOW())
                    RETURNING id
                    """,
                    winner["user_id"],
                    cfg["title"],
                    coins,
                    cfg["theme"],
                    cfg["badge"],
                )

                await conn.execute(
                    """
                    INSERT INTO leaderboard_settlements (period, period_date, rank, user_id, score, coins_awarded, card_id, settled_at)
                    VALUES ('daily', $1, $2, $3, $4, $5, $6, NOW())
                    ON CONFLICT (period, period_date, rank) DO NOTHING
                    """,
                    start_of_day.date(),
                    cfg["rank"],
                    winner["user_id"],
                    winner["primary_value"],
                    coins,
                    card_id,
                )

                awarded.append({
                    "rank": cfg["rank"],
                    "userId": winner["user_id"],
                    "userName": winner["user_name"],
                    "score": winner["primary_value"],
                    "coins": coins,
                    "cardId": str(card_id),
                })

            return {
                "status": "settled",
                "date": date_str,
                "podium": awarded,
            }
