from pydantic import BaseModel
from typing import List, Optional

class VoucherItem(BaseModel):
    id: str
    brandId: str
    brandName: str
    title: str
    valueFormatted: str
    numericValue: int
    coinsCost: int
    originalCoinsCost: Optional[int] = None
    category: str
    description: str
    instructions: List[str]
    logoBg: str
    isPopular: Optional[bool] = False
    highlightTag: Optional[str] = None
    remainingInventory: Optional[int] = None

class ClaimVoucherRequest(BaseModel):
    voucher_id: str
    brand: Optional[str] = None
    coins_cost: Optional[int] = None

class ClaimedVoucherResponse(BaseModel):
    id: str
    voucherId: str
    brandName: str
    title: str
    valueFormatted: str
    code: str
    pin: Optional[str] = None
    claimedAt: str
    expiresAt: str
    coinsSpent: int
    logoBg: str
    websiteUrl: str
    status: str

class BadgeItem(BaseModel):
    id: str
    title: str
    description: str
    coins_required: int
    unlocked: bool
    progress_percentage: int
    icon: str

class SignupBonusResponse(BaseModel):
    awarded: bool
    coins: int
    message: str
    balance: int

class ScratchCardModel(BaseModel):
    id: str
    title: str
    source: str
    date: str
    coins: int
    isScratched: bool
    themeColor: Optional[str] = "#FF2D78"
    badge: Optional[str] = None
    message: Optional[str] = None
    voucherId: Optional[str] = None
    voucherTitle: Optional[str] = None
    voucherCode: Optional[str] = None
    voucherBrand: Optional[str] = None

class ScratchCardsListResponse(BaseModel):
    cards: List[ScratchCardModel]
    total_unscratched: int
    total_scratched: int
    total_won: int

class ScratchCardActionResult(BaseModel):
    success: bool
    coins_won: int
    balance: int
    card: ScratchCardModel
