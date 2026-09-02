import asyncio
import asyncpg
from typing import Optional
from backend_py.config import get_settings

_pool: Optional[asyncpg.Pool] = None
_tables_ensured: bool = False

async def ensure_db_tables(pool: asyncpg.Pool) -> None:
    async with pool.acquire() as conn:
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scratch_cards (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                source TEXT NOT NULL,
                coins INTEGER NOT NULL DEFAULT 0,
                voucher_id TEXT,
                voucher_title TEXT,
                voucher_code TEXT,
                voucher_brand TEXT,
                is_scratched BOOLEAN NOT NULL DEFAULT FALSE,
                theme_color TEXT DEFAULT '#FF2D78',
                badge TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                scratched_at TIMESTAMPTZ
            );

            CREATE INDEX IF NOT EXISTS idx_scratch_cards_user_scratched ON scratch_cards (user_id, is_scratched, created_at DESC);

            CREATE TABLE IF NOT EXISTS leaderboard_settlements (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                period TEXT NOT NULL,
                period_date DATE NOT NULL,
                rank INTEGER NOT NULL,
                user_id TEXT NOT NULL,
                score INTEGER NOT NULL,
                coins_awarded INTEGER NOT NULL,
                card_id UUID,
                settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                CONSTRAINT uq_leaderboard_settlement UNIQUE (period, period_date, rank)
            );

            CREATE INDEX IF NOT EXISTS idx_leaderboard_settlements_date ON leaderboard_settlements (period, period_date);
            """
        )

async def init_db_pool() -> asyncpg.Pool:
    global _pool, _tables_ensured
    current_loop = asyncio.get_running_loop()
    if _pool is None or _pool._closed or getattr(_pool, "_loop", None) != current_loop:
        settings = get_settings()
        _pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=1,
            max_size=5,
            statement_cache_size=0,
            command_timeout=60,
        )
        if not _tables_ensured:
            try:
                await ensure_db_tables(_pool)
                _tables_ensured = True
            except Exception:
                pass
    return _pool

async def get_db_pool() -> asyncpg.Pool:
    return await init_db_pool()

async def close_db_pool() -> None:
    global _pool
    if _pool is not None and not _pool._closed:
        try:
            await _pool.close()
        except Exception:
            pass
        _pool = None
