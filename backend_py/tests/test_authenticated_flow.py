import pytest
from httpx import AsyncClient, ASGITransport
from api.index import app
from backend_py.dependencies import get_current_user
from backend_py.database import get_db_pool

TEST_USER = {
    "user_id": "test-user-id-001",
    "id": "test-user-id-001",
    "name": "Test Smiler",
    "email": "test@opensmile.app",
    "image": None,
    "role": "user",
    "streak_count": 3,
    "referral_code": "SMILE-TEST",
}

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: TEST_USER
    yield
    app.dependency_overrides.pop(get_current_user, None)

@pytest.mark.anyio
async def test_streak_endpoint_authenticated():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/streaks/current")
        assert response.status_code == 200
        data = response.json()
        assert "streak_count" in data
        assert "streak_multiplier" in data
        assert "freeze_available" in data

@pytest.mark.anyio
async def test_refer_stats_authenticated():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt", referral_code)
                VALUES ($1, $2, $3, true, NOW(), NOW(), 'SMILE-TEST')
                ON CONFLICT (id) DO UPDATE SET name = $2
                """,
                TEST_USER["id"],
                TEST_USER["name"],
                TEST_USER["email"],
            )

        response = await client.get("/api/v1/refer/stats")
        assert response.status_code == 200
        data = response.json()
        assert "referral_code" in data
        assert "stats" in data
        assert "remaining_today" in data

@pytest.mark.anyio
async def test_rewards_badges_and_signup_bonus():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Badges
        r_badges = await client.get("/api/v1/rewards/badges")
        assert r_badges.status_code == 200
        badges = r_badges.json()
        assert len(badges) >= 4

        # Signup bonus
        r_bonus = await client.post("/api/v1/rewards/signup-bonus")
        assert r_bonus.status_code == 200
        bonus_data = r_bonus.json()
        assert "balance" in bonus_data

@pytest.mark.anyio
async def test_user_public_profile():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"/api/v1/users/{TEST_USER['name']}")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == TEST_USER["name"]
        assert "totalSmiles" in data
        assert "coins" in data
