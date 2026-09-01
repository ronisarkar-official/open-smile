from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend_py.database import init_db_pool, close_db_pool
from backend_py.routers import (
    capture,
    streaks,
    refer,
    cron,
    leaderboard,
    rewards,
    explore,
    activity,
    users,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db_pool()
    yield
    await close_db_pool()

app = FastAPI(
    title="Open Smile API",
    version="1.0.0",
    docs_url="/api/py/docs",
    openapi_url="/api/py/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(capture.router, prefix="/api/v1/capture", tags=["Capture"])
app.include_router(streaks.router, prefix="/api/v1/streaks", tags=["Streaks"])
app.include_router(streaks.router, prefix="/api/v1/user/streak", tags=["User Streaks"])
app.include_router(refer.router, prefix="/api/v1/refer", tags=["Referrals"])
app.include_router(cron.router, prefix="/api/v1/cron", tags=["Cron"])
app.include_router(leaderboard.router, prefix="/api/v1/leaderboard", tags=["Leaderboard"])
app.include_router(rewards.router, prefix="/api/v1/rewards", tags=["Rewards"])
app.include_router(explore.router, prefix="/api/v1/explore", tags=["Explore"])
app.include_router(activity.router, prefix="/api/v1/activity", tags=["Activity"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(users.router, prefix="/api/v1/user", tags=["User Balance"])

@app.get("/api/v1/health")
@app.get("/health")
@app.get("/")
async def health_check():
    return {"status": "ok", "service": "open-smile-fastapi", "version": "1.0.0"}
