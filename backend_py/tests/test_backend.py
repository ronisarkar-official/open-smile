import pytest
from httpx import AsyncClient, ASGITransport
from api.index import app
from backend_py.services.anti_cheat import compute_hamming_distance
from backend_py.services.coin_engine import calculate_smile_coins
from backend_py.services.streak_engine import calculate_streak_multiplier
from backend_py.database import close_db_pool

def test_hamming_distance():
    assert compute_hamming_distance("ffff", "ffff") == 0
    assert compute_hamming_distance("0000", "0001") == 1
    assert compute_hamming_distance("a1b2", "a1b3") == 1

def test_coin_calculation():
    base, total = calculate_smile_coins(90, 1.0)
    assert base == 14
    assert total == 14

    base, total = calculate_smile_coins(90, 1.5)
    assert base == 14
    assert total == 21

    base, total = calculate_smile_coins(0, 1.0)
    assert base == 0
    assert total == 0

def test_streak_multiplier():
    assert calculate_streak_multiplier(1) == 1.0
    assert calculate_streak_multiplier(2) == 1.2
    assert calculate_streak_multiplier(3) == 1.5
    assert calculate_streak_multiplier(7) >= 1.5

@pytest.mark.anyio
async def test_health_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r1 = await client.get("/api/v1/health")
        assert r1.status_code == 200
        assert r1.json()["status"] == "ok"

        r2 = await client.get("/health")
        assert r2.status_code == 200

        r3 = await client.get("/")
        assert r3.status_code == 200

@pytest.mark.anyio
async def test_rewards_catalog():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/rewards/catalog")
        assert response.status_code == 200
        catalog = response.json()
        assert len(catalog) > 0
        assert any(v["brandName"] == "Amazon" for v in catalog)
        assert any(v["brandName"] == "boAt" for v in catalog)

@pytest.mark.anyio
async def test_activity_recent():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/activity/recent")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert len(data["items"]) > 0

@pytest.mark.anyio
async def test_leaderboard_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r_weekly = await client.get("/api/v1/leaderboard?period=weekly")
        assert r_weekly.status_code == 200
        assert r_weekly.json()["period"] == "weekly"

        r_daily = await client.get("/api/v1/leaderboard?period=daily")
        assert r_daily.status_code == 200
        assert r_daily.json()["period"] == "daily"
        assert r_daily.json()["resetAt"] is not None

        r_monthly = await client.get("/api/v1/leaderboard?period=monthly")
        assert r_monthly.status_code == 200
        assert r_monthly.json()["period"] == "monthly"

@pytest.mark.anyio
async def test_explore_feed():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/explore/feed?filter=latest")
        assert response.status_code == 200
        data = response.json()
        assert "posts" in data

@pytest.mark.anyio
async def test_refer_validate():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/refer/validate", json={"referral_code": "NON_EXISTENT_CODE"})
        assert response.status_code == 200
        assert response.json()["valid"] is False

@pytest.mark.anyio
async def test_unauthenticated_endpoints_rejected():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r1 = await client.post(
            "/api/v1/capture/submit",
            json={"smile_score": 85, "liveness_verified": True}
        )
        assert r1.status_code == 401

        r2 = await client.post(
            "/api/v1/rewards/claim",
            json={"voucher_id": "test-voucher-id"}
        )
        assert r2.status_code == 401

        r3 = await client.get("/api/v1/streaks/current")
        assert r3.status_code == 401

@pytest.mark.anyio
async def test_cron_keepalive():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/cron/keepalive")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

@pytest.mark.anyio
async def test_cron_leaderboard_settlement():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/cron/leaderboard-settlement",
            headers={"x-cron-secret": "open-smile-cron-secret-2026"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "date" in data

