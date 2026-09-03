export type VoucherCategory = 'all' | 'ecommerce' | 'fashion' | 'audio' | 'food' | 'entertainment';

export interface VoucherBrand {
  id: string;
  name: string;
  category: VoucherCategory;
  categoryLabel: string;
  tagline: string;
  logoBg: string;
  accentColor: string;
  badgeText?: string;
  websiteUrl: string;
}

export interface VoucherItem {
  id: string;
  brandId: string;
  brandName: string;
  category: VoucherCategory;
  title: string;
  voucherType?: 'discount' | 'subscription' | 'gift_card' | 'perk';
  valueFormatted: string;
  numericValue: number;
  coinsCost: number;
  originalCoinsCost?: number;
  highlightTag?: string;
  description: string;
  instructions: string[];
  terms?: string[];
  isPopular?: boolean;
  isTrending?: boolean;
  logoBg?: string;
  accentColor?: string;
  imageUrl?: string;
  remainingInventory?: number;
}

export interface ClaimedVoucher {
  id: string;
  voucherId: string;
  brandName: string;
  title: string;
  valueFormatted: string;
  code: string;
  pin: string;
  claimedAt: string;
  expiresAt: string;
  coinsSpent: number;
  logoBg?: string;
  websiteUrl?: string;
  status: 'active' | 'used';
}

export const VOUCHER_CATEGORIES: { id: VoucherCategory; label: string; iconName: string }[] = [
  { id: 'all', label: 'All Brands', iconName: 'Sparkles' },
  { id: 'ecommerce', label: 'E-Commerce', iconName: 'ShoppingBag' },
  { id: 'fashion', label: 'Fashion & Style', iconName: 'Shirt' },
  { id: 'audio', label: 'Audio & Tech', iconName: 'Headphones' },
  { id: 'food', label: 'Food & Dining', iconName: 'Utensils' },
  { id: 'entertainment', label: 'Entertainment', iconName: 'Film' },
];

export const VOUCHERS_CATALOG: VoucherItem[] = [];

export const INITIAL_CLAIMED_VOUCHERS: ClaimedVoucher[] = [];
