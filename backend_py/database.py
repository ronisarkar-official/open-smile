import asyncio
import asyncpg
from typing import Optional
from backend_py.config import get_settings

_pool: Optional[asyncpg.Pool] = None

async def init_db_pool() -> asyncpg.Pool:
    global _pool
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
