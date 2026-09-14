import pytest
from httpx import AsyncClient, ASGITransport
from api.index import app
from backend_py.dependencies import get_current_user
from backend_py.database import get_db_pool

TEST_USER = {
    "user_id": "test-user-capture-001",
    "id": "test-user-capture-001",
    "name": "Test Smiler",
    "email": "test-capture@opensmile.app",
    "image": None,
    "role": "user",
    "streak_count": 1,
    "referral_code": "SMILE-CAPTURE-TEST",
}

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = lambda: TEST_USER
    yield
    app.dependency_overrides.pop(get_current_user, None)

@pytest.mark.anyio
async def test_capture_submit_and_status_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Clean up and ensure test user exists
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt", referral_code)
                VALUES ($1, $2, $3, true, NOW(), NOW(), 'SMILE-CAPTURE-TEST')
                ON CONFLICT (id) DO UPDATE SET name = $2
                """,
                TEST_USER["id"],
                TEST_USER["name"],
                TEST_USER["email"],
            )
            await conn.execute("DELETE FROM smile_captures WHERE user_id = $1", TEST_USER["user_id"])
            await conn.execute("DELETE FROM image_hashes WHERE user_id = $1", TEST_USER["user_id"])
            await conn.execute("DELETE FROM scratch_cards WHERE user_id = $1", TEST_USER["user_id"])
            await conn.execute("DELETE FROM streaks WHERE user_id = $1", TEST_USER["user_id"])

        # 2. Get initial status
        r_status = await client.get("/api/v1/capture/status")
        assert r_status.status_code == 200
        status_data = r_status.json()
        assert status_data["daily_captures_used"] == 0
        assert status_data["max_daily_captures"] > 0
        assert status_data["captures_remaining"] == status_data["max_daily_captures"]
        assert status_data["limit_reached"] is False

        # 3. Submit first capture
        r_submit1 = await client.post(
            "/api/v1/capture/submit",
            json={"smile_score": 85, "phash": "1111222233334444", "liveness_verified": True}
        )
        assert r_submit1.status_code == 200
        submit1_data = r_submit1.json()
        assert submit1_data["daily_captures_used"] == 1
        assert submit1_data["max_daily_captures"] == status_data["max_daily_captures"]
        assert submit1_data["captures_remaining"] == status_data["max_daily_captures"] - 1
        assert submit1_data["limit_reached"] is False
        assert submit1_data["card_id"] is not None

        # 4. Submit second capture with a slightly different live photo (distance > 2)
        # e.g., '1111222233335555' differs by 4 bits
        r_submit2 = await client.post(
            "/api/v1/capture/submit",
            json={"smile_score": 90, "phash": "1111222233335555", "liveness_verified": True}
        )
        assert r_submit2.status_code == 200
        submit2_data = r_submit2.json()
        assert submit2_data["daily_captures_used"] == 2
        assert submit2_data["captures_remaining"] == status_data["max_daily_captures"] - 2

        # 5. Verify status reflects the 2 captures
        r_status2 = await client.get("/api/v1/capture/status")
        assert r_status2.status_code == 200
        assert r_status2.json()["daily_captures_used"] == 2

        # 6. Verify duplicate exact hash is rejected by anti-cheat
        r_dup = await client.post(
            "/api/v1/capture/submit",
            json={"smile_score": 88, "phash": "1111222233334455", "liveness_verified": True}
        )
        assert r_dup.status_code == 400
        assert "Duplicate or replayed image detected" in r_dup.json()["detail"]
