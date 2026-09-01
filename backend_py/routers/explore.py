from fastapi import APIRouter, Depends, Query, HTTPException, status
import asyncpg
import uuid
from datetime import datetime, timezone
from typing import Optional
from backend_py.database import get_db_pool
from backend_py.dependencies import get_current_user, get_optional_user
from backend_py.models.explore import (
    ExploreFeedResponse,
    ExplorePostItem,
    CreatePostRequest,
    CreatePostResponse,
    LikeToggleResponse,
)
from backend_py.services.coin_engine import award_coins

router = APIRouter()

def format_time_ago(dt: Optional[datetime]) -> str:
    if not dt:
        return "recently"
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff = (now - dt).total_seconds()
    if diff < 60:
        return "just now"
    elif diff < 3600:
        mins = int(diff // 60)
        return f"{mins}m ago"
    elif diff < 86400:
        hrs = int(diff // 3600)
        return f"{hrs}h ago"
    else:
        days = int(diff // 86400)
        return f"{days}d ago"

def get_avatar_letters(name: Optional[str]) -> str:
    if not name:
        return "OS"
    parts = name.strip().split()
    if len(parts) >= 2:
        return f"{parts[0][0]}{parts[1][0]}".upper()
    return name[:2].upper()

@router.get("/feed", response_model=ExploreFeedResponse)
async def get_explore_feed(
    filter: str = Query("latest", pattern="^(latest|top_scored|most_liked)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    current_user: Optional[dict] = Depends(get_optional_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    offset = (page - 1) * limit
    current_user_id = current_user.get("user_id") if current_user else None

    order_clause = "ep.created_at DESC"
    if filter == "top_scored":
        order_clause = "ep.smile_score DESC, ep.created_at DESC"
    elif filter == "most_liked":
        order_clause = "ep.likes_count DESC, ep.created_at DESC"

    async with pool.acquire() as conn:
        total_count = await conn.fetchval(
            """
            SELECT COUNT(*)
            FROM explore_posts ep
            WHERE ep.created_at >= NOW() - INTERVAL '24 hours'
            """
        ) or 0

        rows = await conn.fetch(
            f"""
            SELECT 
                ep.id,
                ep.user_id,
                ep.capture_id,
                ep.image_url,
                ep.smile_score,
                ep.caption,
                ep.likes_count,
                ep.created_at,
                u.name AS user_name,
                u.image AS user_avatar,
                CASE WHEN el.user_id IS NOT NULL THEN true ELSE false END AS is_liked_by_me
            FROM explore_posts ep
            JOIN "user" u ON ep.user_id = u.id
            LEFT JOIN explore_likes el ON ep.id = el.post_id AND el.user_id = $1
            WHERE ep.created_at >= NOW() - INTERVAL '24 hours'
            ORDER BY {order_clause}
            LIMIT $2 OFFSET $3
            """,
            current_user_id,
            limit,
            offset,
        )

    bg_classes = ["bg-primary", "bg-accent", "bg-secondary", "bg-success"]
    posts = []
    for idx, r in enumerate(rows):
        posts.append(
            ExplorePostItem(
                id=str(r["id"]),
                userId=str(r["user_id"]),
                user=r["user_name"] or "Smiler",
                avatar=get_avatar_letters(r["user_name"]),
                score=r["smile_score"],
                caption=r["caption"],
                imageUrl=r["image_url"],
                likes=r["likes_count"] or 0,
                timeAgo=format_time_ago(r["created_at"]),
                isLikedByMe=bool(r["is_liked_by_me"]),
                bg=bg_classes[idx % len(bg_classes)],
            )
        )

    return ExploreFeedResponse(
        posts=posts,
        page=page,
        total=total_count,
    )

@router.post("/post", response_model=CreatePostResponse)
async def create_explore_post(
    payload: CreatePostRequest,
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]
    capture_uuid = None
    if payload.capture_id:
        try:
            capture_uuid = uuid.UUID(payload.capture_id)
        except Exception:
            capture_uuid = None

    async with pool.acquire() as conn:
        async with conn.transaction():
            post_id = await conn.fetchval(
                """
                INSERT INTO explore_posts (user_id, capture_id, image_url, smile_score, caption, likes_count, created_at)
                VALUES ($1, $2, $3, $4, $5, 0, NOW())
                RETURNING id
                """,
                user_id,
                capture_uuid,
                payload.image_url,
                payload.smile_score,
                payload.caption,
            )

            await conn.execute(
                """
                INSERT INTO posts (id, user_id, capture_id, image_url, smile_score, like_count, created_at)
                VALUES ($1, $2, $3, $4, $5, 0, NOW())
                ON CONFLICT (id) DO NOTHING
                """,
                post_id,
                user_id,
                capture_uuid,
                payload.image_url,
                payload.smile_score,
            )

            daily_post_bonus_count = await conn.fetchval(
                """
                SELECT COUNT(*)
                FROM coin_ledger
                WHERE user_id = $1 AND reason = 'explore_post_bonus' AND created_at >= (NOW() AT TIME ZONE 'UTC')::date
                """,
                user_id,
            ) or 0

            bonus_awarded = 0
            if daily_post_bonus_count == 0:
                bonus_awarded = 5
                await award_coins(conn, user_id, 5, "explore_post_bonus")

    return CreatePostResponse(
        id=str(post_id),
        image_url=payload.image_url,
        smile_score=payload.smile_score,
        caption=payload.caption,
        bonus_coins_awarded=bonus_awarded,
        message="Smile shared to community feed! 24h timer started." + (" +5 bonus coins awarded!" if bonus_awarded > 0 else ""),
    )

@router.post("/{post_id}/like", response_model=LikeToggleResponse)
async def toggle_like(
    post_id: str,
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]
    try:
        post_uuid = uuid.UUID(post_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid post ID format"
        )

    async with pool.acquire() as conn:
        async with conn.transaction():
            already_liked = await conn.fetchval(
                """
                SELECT 1
                FROM explore_likes
                WHERE user_id = $1 AND post_id = $2
                LIMIT 1
                """,
                user_id,
                post_uuid,
            )

            if already_liked:
                await conn.execute(
                    "DELETE FROM explore_likes WHERE user_id = $1 AND post_id = $2",
                    user_id,
                    post_uuid,
                )
                await conn.execute(
                    "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
                    user_id,
                    post_uuid,
                )
                updated_count = await conn.fetchval(
                    """
                    UPDATE explore_posts
                    SET likes_count = GREATEST(0, likes_count - 1)
                    WHERE id = $1
                    RETURNING likes_count
                    """,
                    post_uuid,
                )
                await conn.execute(
                    "UPDATE posts SET like_count = GREATEST(0, like_count - 1) WHERE id = $1",
                    post_uuid,
                )
                return LikeToggleResponse(liked=False, likes_count=updated_count or 0)
            else:
                await conn.execute(
                    """
                    INSERT INTO explore_likes (user_id, post_id, created_at)
                    VALUES ($1, $2, NOW())
                    ON CONFLICT DO NOTHING
                    """,
                    user_id,
                    post_uuid,
                )
                await conn.execute(
                    """
                    INSERT INTO likes (user_id, post_id, created_at)
                    VALUES ($1, $2, NOW())
                    ON CONFLICT DO NOTHING
                    """,
                    user_id,
                    post_uuid,
                )
                updated_count = await conn.fetchval(
                    """
                    UPDATE explore_posts
                    SET likes_count = likes_count + 1
                    WHERE id = $1
                    RETURNING likes_count
                    """,
                    post_uuid,
                )
                await conn.execute(
                    "UPDATE posts SET like_count = like_count + 1 WHERE id = $1",
                    post_uuid,
                )
                return LikeToggleResponse(liked=True, likes_count=updated_count or 1)
