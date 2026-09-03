from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg
import secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from backend_py.database import get_db_pool
from backend_py.dependencies import get_current_user
from backend_py.models.rewards import (
    VoucherItem,
    ClaimVoucherRequest,
    ClaimedVoucherResponse,
    BadgeItem,
    SignupBonusResponse,
    ScratchCardModel,
    ScratchCardsListResponse,
    ScratchCardActionResult,
)
from backend_py.services.coin_engine import deduct_coins, award_coins, get_user_balance, get_lifetime_earned_coins

router = APIRouter()

def generate_voucher_code(brand_id: str):
    prefix = brand_id[:4].upper()
    part1 = secrets.token_hex(2).upper()
    part2 = secrets.token_hex(2).upper()
    code = f"OS-{prefix}-{part1}-{part2}"
    pin = str(secrets.randbelow(9000) + 1000)
    return code, pin

def get_brand_url(brand_id: str) -> str:
    urls = {
        "amazon": "https://www.amazon.in/addgiftcard",
        "flipkart": "https://www.flipkart.com",
        "boat": "https://www.boat-lifestyle.com",
        "myntra": "https://www.myntra.com",
        "swiggy": "https://www.swiggy.com",
        "zomato": "https://www.zomato.com",
        "starbucks": "https://www.starbucks.in",
        "bookmyshow": "https://in.bookmyshow.com",
    }
    return urls.get(brand_id.lower(), "https://www.amazon.in")

@router.get("/catalog", response_model=List[VoucherItem])
async def get_catalog(pool: asyncpg.Pool = Depends(get_db_pool)):
    async with pool.acquire() as conn:
        try:
            rows = await conn.fetch(
                """
                SELECT 
                    vc.id, 
                    vc.brand_name, 
                    vc.title, 
                    vc.description, 
                    vc.category, 
                    vc.image_url, 
                    vc.numeric_value, 
                    vc.coins_cost, 
                    vc.highlight_tag,
                    COALESCE(vc.voucher_type, 'gift_card') as voucher_type,
                    COALESCE(vc.value_formatted, '₹' || vc.numeric_value::text) as value_formatted,
                    COUNT(vi.id) FILTER (WHERE vi.status = 'available')::int as remaining_inventory
                FROM vouchers_catalog vc
                LEFT JOIN voucher_inventory vi ON vc.id = vi.voucher_id
                WHERE vc.is_active = true
                GROUP BY vc.id, vc.brand_name, vc.title, vc.description, vc.category, vc.image_url, vc.numeric_value, vc.coins_cost, vc.highlight_tag, vc.voucher_type, vc.value_formatted
                ORDER BY vc.numeric_value ASC
                """
            )
            items = []
            for r in rows:
                brand_id = r["brand_name"].lower().replace(" ", "")
                items.append(VoucherItem(
                    id=str(r["id"]),
                    brandId=brand_id,
                    brandName=r["brand_name"],
                    category=r["category"] or "ecommerce",
                    title=r["title"],
                    voucherType=r["voucher_type"] or "gift_card",
                    valueFormatted=r["value_formatted"] or f"₹{r['numeric_value']:,}",
                    numericValue=r["numeric_value"],
                    coinsCost=r["coins_cost"],
                    highlightTag=r["highlight_tag"],
                    description=r["description"] or f"Redeem {r['title']} with your smile coins.",
                    instructions=[f"Copy secret code and apply on {r['brand_name']} checkout."],
                    logoBg="#FF2D78",
                    imageUrl=r["image_url"],
                    isPopular=r["numeric_value"] >= 500,
                    remainingInventory=r["remaining_inventory"] or 0,
                ))
            return items
        except Exception as e:
            print("Error fetching vouchers catalog:", e)
            return []

@router.post("/claim", response_model=ClaimedVoucherResponse)
async def claim_voucher(
    payload: ClaimVoucherRequest,
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]

    voucher = next((v for v in STATIC_VOUCHERS_CATALOG if v["id"] == payload.voucher_id), None)
    if not voucher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voucher not found in catalog"
        )

    coins_cost = payload.coins_cost or voucher["coinsCost"]
    code, pin = generate_voucher_code(voucher["brandId"])
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(days=365)

    async with pool.acquire() as conn:
        maintenance_val = await conn.fetchval(
            "SELECT value FROM system_settings WHERE key = 'maintenance_mode'"
        )
        if maintenance_val is True or str(maintenance_val).lower() == 'true':
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Platform maintenance mode is active. Voucher claims are temporarily paused."
            )

        marketplace_val = await conn.fetchval(
            "SELECT value FROM system_settings WHERE key = 'marketplace_enabled'"
        )
        if marketplace_val is False or str(marketplace_val).lower() == 'false':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Voucher marketplace is currently disabled by administrator."
            )

        async with conn.transaction():
            await deduct_coins(conn, user_id, coins_cost, "voucher_claim")

            reward_id = await conn.fetchval(
                """
                INSERT INTO rewards (user_id, tier, provider, voucher_code, coins_spent, claimed_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
                """,
                user_id,
                voucher["valueFormatted"],
                voucher["brandName"],
                code,
                coins_cost,
                now,
            )

            await conn.execute(
                """
                INSERT INTO vouchers (user_id, voucher_type, coin_cost, code, status, created_at)
                VALUES ($1, $2, $3, $4, 'claimed', $5)
                """,
                user_id,
                voucher["title"],
                coins_cost,
                code,
                now,
            )

            await conn.execute(
                """
                INSERT INTO scratch_cards (user_id, title, source, coins, voucher_id, voucher_title, voucher_code, voucher_brand, is_scratched, theme_color, badge, created_at)
                VALUES ($1, $2, 'Voucher Marketplace', 0, $3, $4, $5, $6, true, '#22C55E', 'VOUCHER', $7)
                """,
                user_id,
                f"{voucher['brandName']} Voucher ({voucher['valueFormatted']})",
                voucher["id"],
                voucher["title"],
                code,
                voucher["brandName"],
                now,
            )

    return ClaimedVoucherResponse(
        id=str(reward_id),
        voucherId=voucher["id"],
        brandName=voucher["brandName"],
        title=voucher["title"],
        valueFormatted=voucher["valueFormatted"],
        code=code,
        pin=pin,
        claimedAt=now.strftime("%b %d, %Y"),
        expiresAt=expires_at.strftime("%b %d, %Y"),
        coinsSpent=coins_cost,
        logoBg=voucher["logoBg"],
        websiteUrl=get_brand_url(voucher["brandId"]),
        status="active",
    )

@router.get("/my-vouchers", response_model=List[ClaimedVoucherResponse])
async def get_my_vouchers(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, tier, provider, voucher_code, coins_spent, claimed_at
            FROM rewards
            WHERE user_id = $1
            ORDER BY claimed_at DESC
            """,
            user_id,
        )

    claimed_list = []
    for r in rows:
        provider = r["provider"] or "Brand"
        matching_v = next((v for v in STATIC_VOUCHERS_CATALOG if v["brandName"].lower() == provider.lower()), None)
        logo_bg = matching_v["logoBg"] if matching_v else "#FF9900"
        brand_id = matching_v["brandId"] if matching_v else "amazon"
        title = matching_v["title"] if matching_v else f"{r['tier']} {provider} Voucher"
        claimed_dt = r["claimed_at"]
        expires_dt = claimed_dt + timedelta(days=365) if claimed_dt else datetime.now(timezone.utc)

        claimed_list.append(
            ClaimedVoucherResponse(
                id=str(r["id"]),
                voucherId=matching_v["id"] if matching_v else "generic",
                brandName=provider,
                title=title,
                valueFormatted=r["tier"] or "₹250",
                code=r["voucher_code"],
                pin="7492",
                claimedAt=claimed_dt.strftime("%b %d, %Y") if claimed_dt else "Recent",
                expiresAt=expires_dt.strftime("%b %d, %Y") if expires_dt else "1 Year",
                coinsSpent=r["coins_spent"] or 0,
                logoBg=logo_bg,
                websiteUrl=get_brand_url(brand_id),
                status="active",
            )
        )

    return claimed_list

@router.get("/badges", response_model=List[BadgeItem])
async def get_badges(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]
    async with pool.acquire() as conn:
        lifetime_coins = await get_lifetime_earned_coins(conn, user_id)
        smile_count = await conn.fetchval(
            "SELECT COUNT(*) FROM smile_captures WHERE user_id = $1",
            user_id,
        ) or 0
        streak_count = await conn.fetchval(
            "SELECT streak_count FROM streaks WHERE user_id = $1",
            user_id,
        ) or 0

    badge_definitions = [
        {"id": "first-smile", "title": "First Smile", "desc": "Capture your first smile", "coins": 15, "icon": "Sparkles"},
        {"id": "smile-bronze", "title": "Bronze Smiler", "desc": "Earn 100 lifetime smile coins", "coins": 100, "icon": "Trophy"},
        {"id": "smile-silver", "title": "Silver Smiler", "desc": "Earn 500 lifetime smile coins", "coins": 500, "icon": "Trophy"},
        {"id": "smile-gold", "title": "Gold Smiler", "desc": "Earn 1,000 lifetime smile coins", "coins": 1000, "icon": "Trophy"},
        {"id": "smile-diamond", "title": "Diamond Smiler", "desc": "Earn 2,000 lifetime smile coins", "coins": 2000, "icon": "Trophy"},
        {"id": "streak-master", "title": "Streak Master", "desc": "Reach a 7-day daily smile streak", "coins": 250, "icon": "Flame"},
    ]

    badges_res = []
    for b in badge_definitions:
        req = b["coins"]
        unlocked = lifetime_coins >= req or (b["id"] == "first-smile" and smile_count >= 1) or (b["id"] == "streak-master" and streak_count >= 7)
        pct = 100 if unlocked else min(99, int((lifetime_coins / req) * 100))
        badges_res.append(
            BadgeItem(
                id=b["id"],
                title=b["title"],
                description=b["desc"],
                coins_required=req,
                unlocked=unlocked,
                progress_percentage=pct,
                icon=b["icon"],
            )
        )
    return badges_res

@router.post("/signup-bonus", response_model=SignupBonusResponse)
async def claim_signup_bonus(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]
    async with pool.acquire() as conn:
        already_claimed = await conn.fetchval(
            """
            SELECT 1
            FROM coin_ledger
            WHERE user_id = $1 AND reason = 'signup_bonus'
            LIMIT 1
            """,
            user_id,
        )

        if already_claimed:
            balance = await get_user_balance(conn, user_id)
            return SignupBonusResponse(
                awarded=False,
                coins=0,
                message="Welcome bonus has already been claimed.",
                balance=balance,
            )

        balance = await award_coins(conn, user_id, 50, "signup_bonus")

    return SignupBonusResponse(
        awarded=True,
        coins=50,
        message="Welcome to Open Smile! +50 bonus coins added to your wallet.",
        balance=balance,
    )

def format_card_date(dt: Optional[datetime]) -> str:
    if not dt:
        return "Today"
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    delta = (now.date() - dt.date()).days
    if delta == 0:
        return "Today"
    elif delta == 1:
        return "Yesterday"
    else:
        return dt.strftime("%b %d, %Y")

@router.get("/scratch-cards", response_model=ScratchCardsListResponse)
async def get_my_scratch_cards(
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]

    async with pool.acquire() as conn:
        # Fetch all user cards (unscratched first, then newest scratched)
        rows = await conn.fetch(
            """
            SELECT id, title, source, coins, voucher_id, voucher_title, voucher_code, voucher_brand, is_scratched, theme_color, badge, created_at, scratched_at
            FROM scratch_cards
            WHERE user_id = $1
            ORDER BY is_scratched ASC, created_at DESC
            """,
            user_id,
        )

    cards_list = []
    total_unscratched = 0
    total_scratched = 0
    total_won = 0

    for r in rows:
        is_scratched = bool(r["is_scratched"])
        coins_val = r["coins"] or 0
        if is_scratched:
            total_scratched += 1
            total_won += coins_val
        else:
            total_unscratched += 1

        dt = r["created_at"]
        cards_list.append(
            ScratchCardModel(
                id=str(r["id"]),
                title=r["title"],
                source=r["source"],
                date=format_card_date(dt),
                coins=coins_val,
                isScratched=is_scratched,
                themeColor=r["theme_color"] or "#FF2D78",
                badge=r["badge"],
                voucherId=r["voucher_id"],
                voucherTitle=r["voucher_title"],
                voucherCode=r["voucher_code"],
                voucherBrand=r["voucher_brand"],
            )
        )

    return ScratchCardsListResponse(
        cards=cards_list,
        total_unscratched=total_unscratched,
        total_scratched=total_scratched,
        total_won=total_won,
    )

@router.post("/scratch-cards/{card_id}/scratch", response_model=ScratchCardActionResult)
async def scratch_user_card(
    card_id: str,
    current_user: dict = Depends(get_current_user),
    pool: asyncpg.Pool = Depends(get_db_pool),
):
    user_id = current_user["user_id"]

    async with pool.acquire() as conn:
        async with conn.transaction():
            row = await conn.fetchrow(
                """
                SELECT id, title, source, coins, voucher_id, voucher_title, voucher_code, voucher_brand, is_scratched, theme_color, badge, created_at
                FROM scratch_cards
                WHERE id = $1 AND user_id = $2
                FOR UPDATE
                """,
                card_id,
                user_id,
            )

            if not row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Scratch card not found"
                )

            coins_won = row["coins"] or 0
            is_already_scratched = bool(row["is_scratched"])

            if not is_already_scratched:
                await conn.execute(
                    """
                    UPDATE scratch_cards
                    SET is_scratched = true, scratched_at = NOW()
                    WHERE id = $1
                    """,
                    card_id,
                )

                if coins_won > 0:
                    await award_coins(conn, user_id, coins_won, f"scratch_card_{row['title'].lower().replace(' ', '_')}")

            balance = await get_user_balance(conn, user_id)

    updated_card = ScratchCardModel(
        id=str(row["id"]),
        title=row["title"],
        source=row["source"],
        date=format_card_date(row["created_at"]),
        coins=coins_won,
        isScratched=True,
        themeColor=row["theme_color"] or "#FF2D78",
        badge=row["badge"],
        voucherId=row["voucher_id"],
        voucherTitle=row["voucher_title"],
        voucherCode=row["voucher_code"],
        voucherBrand=row["voucher_brand"],
    )

    return ScratchCardActionResult(
        success=True,
        coins_won=coins_won,
        balance=balance,
        card=updated_card,
    )

