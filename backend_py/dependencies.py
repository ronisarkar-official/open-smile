from fastapi import Request, HTTPException, status, Depends
import asyncpg
from typing import Optional, Dict, Any, List
from urllib.parse import unquote
from backend_py.database import get_db_pool

def extract_session_token_candidates(request: Request) -> List[str]:
    raw_token = (
        request.cookies.get("better-auth.session_token")
        or request.cookies.get("__Secure-better-auth.session_token")
    )
    if not raw_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            raw_token = auth_header.split(" ", 1)[1].strip()

    if not raw_token:
        return []

    tokens = [raw_token]
    unquoted = unquote(raw_token).strip()
    if unquoted != raw_token:
        tokens.append(unquoted)

    for t in list(tokens):
        if t.startswith("s:"):
            tokens.append(t[2:])
        if "." in t:
            # For signed cookies in Better Auth, format is `token.signature`
            tokens.append(t.split(".", 1)[0])

    # Deduplicate preserving order
    return list(dict.fromkeys(tokens))

async def get_current_user(
    request: Request,
    pool: asyncpg.Pool = Depends(get_db_pool)
) -> Dict[str, Any]:
    candidates = extract_session_token_candidates(request)
    if not candidates:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT s."userId" AS user_id, u.id, u.name, u.email, u.image, u.role, u.streak_count, u.referral_code
            FROM "session" s
            JOIN "user" u ON s."userId" = u.id
            WHERE s.token = ANY($1::text[]) AND s."expiresAt" > NOW()
            LIMIT 1
            """,
            candidates,
        )
        if not row:
            row = await conn.fetchrow(
                """
                SELECT s.user_id, u.id, u.name, u.email, u.image, u.role, u.streak_count, u.referral_code
                FROM "sessions" s
                JOIN "user" u ON s.user_id = u.id
                WHERE s.token = ANY($1::text[]) AND s.expires_at > NOW()
                LIMIT 1
                """,
                candidates,
            )

    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )

    user_data = dict(row)
    user_data["user_id"] = user_data.get("user_id") or user_data.get("id")
    return user_data

async def get_optional_user(
    request: Request,
    pool: asyncpg.Pool = Depends(get_db_pool)
) -> Optional[Dict[str, Any]]:
    candidates = extract_session_token_candidates(request)
    if not candidates:
        return None

    try:
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT s."userId" AS user_id, u.id, u.name, u.email, u.image, u.role, u.streak_count, u.referral_code
                FROM "session" s
                JOIN "user" u ON s."userId" = u.id
                WHERE s.token = ANY($1::text[]) AND s."expiresAt" > NOW()
                LIMIT 1
                """,
                candidates,
            )
            if not row:
                row = await conn.fetchrow(
                    """
                    SELECT s.user_id, u.id, u.name, u.email, u.image, u.role, u.streak_count, u.referral_code
                    FROM "sessions" s
                    JOIN "user" u ON s.user_id = u.id
                    WHERE s.token = ANY($1::text[]) AND s.expires_at > NOW()
                    LIMIT 1
                    """,
                    candidates,
                )
            if row:
                user_data = dict(row)
                user_data["user_id"] = user_data.get("user_id") or user_data.get("id")
                return user_data
    except Exception:
        return None
    return None
