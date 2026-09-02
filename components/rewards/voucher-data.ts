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
  valueFormatted: string;
  numericValue: number;
  coinsCost: number;
  originalCoinsCost?: number;
  highlightTag?: string;
  description: string;
  instructions: string[];
  terms: string[];
  isPopular?: boolean;
  isTrending?: boolean;
  logoBg: string;
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
  logoBg: string;
  websiteUrl: string;
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

export const VOUCHERS_CATALOG: VoucherItem[] = [
  {
    id: 'amz-250',
    brandId: 'amazon',
    brandName: 'Amazon',
    category: 'ecommerce',
    title: '₹250 Amazon Shopping Voucher',
    valueFormatted: '₹250',
    numericValue: 250,
    coinsCost: 500,
    highlightTag: 'Instant E-Code',
    description: 'Valid across millions of products, recharges, and bill payments on Amazon India.',
    instructions: [
      'Copy the 16-character gift card code below.',
      'Go to Amazon Pay > Add Gift Card in your Amazon app or website.',
      'Paste the voucher code and click "Add to your balance".',
      'The balance will be instantly added with 1-year validity.',
    ],
    terms: [
      'Valid for 12 months from issuance date.',
      'Usable on all eligible items on Amazon.in.',
      'Cannot be transferred or converted into physical cash.',
    ],
    isPopular: true,
    logoBg: '#FF9900',
    accentColor: '#FF9900',
  },
  {
    id: 'amz-500',
    brandId: 'amazon',
    brandName: 'Amazon',
    category: 'ecommerce',
    title: '₹500 Amazon Gift Card',
    valueFormatted: '₹500',
    numericValue: 500,
    coinsCost: 1000,
    highlightTag: 'Best Seller',
    description: 'Claim ₹500 directly in your Amazon Pay balance for shopping and subscriptions.',
    instructions: [
      'Copy the voucher code and security PIN.',
      'Visit amazon.in/addgiftcard and login to your Amazon account.',
      'Enter the gift card code and apply.',
    ],
    terms: [
      'Valid for 365 days from redemption.',
      'Non-refundable once generated.',
    ],
    isPopular: true,
    logoBg: '#FF9900',
    accentColor: '#FF9900',
  },
  {
    id: 'amz-1000',
    brandId: 'amazon',
    brandName: 'Amazon',
    category: 'ecommerce',
    title: '₹1,000 Amazon Prime / Pay Voucher',
    valueFormatted: '₹1,000',
    numericValue: 1000,
    coinsCost: 1900,
    originalCoinsCost: 2000,
    highlightTag: '5% Coin Saver',
    description: 'High-value Amazon Gift Voucher to fuel electronics, books, apparel, or grocery orders.',
    instructions: [
      'Add code in Amazon Pay wallet.',
      'Use at checkout for any Amazon purchase.',
    ],
    terms: [
      'Valid for 1 year across all categories on Amazon.in.',
    ],
    logoBg: '#FF9900',
    accentColor: '#FF9900',
  },
  {
    id: 'flp-250',
    brandId: 'flipkart',
    brandName: 'Flipkart',
    category: 'ecommerce',
    title: '₹250 Flipkart E-Gift Card',
    valueFormatted: '₹250',
    numericValue: 250,
    coinsCost: 500,
    highlightTag: 'Supercoins Ready',
    description: 'Redeem across Flipkart Big Billion Days, mobiles, fashion, and daily essentials.',
    instructions: [
      'Copy your 16-digit Flipkart Gift Card number and 6-digit PIN.',
      'In Flipkart checkout or Account > Gift Cards, select "Add a Gift Card".',
      'Enter Card Number and PIN to add to your Flipkart wallet.',
    ],
    terms: [
      'Valid on Flipkart mobile app and desktop site.',
      '12 months validity from issue.',
    ],
    logoBg: '#2874F0',
    accentColor: '#2874F0',
  },
  {
    id: 'flp-500',
    brandId: 'flipkart',
    brandName: 'Flipkart',
    category: 'ecommerce',
    title: '₹500 Flipkart Shopping Voucher',
    valueFormatted: '₹500',
    numericValue: 500,
    coinsCost: 1000,
    highlightTag: 'Instant Delivery',
    description: 'Enjoy ₹500 off your next electronics, books, home appliances, or fashion haul.',
    instructions: [
      'Go to Flipkart > My Account > Saved Cards & Wallet > Add Gift Card.',
      'Type in the gift voucher code and PIN provided.',
    ],
    terms: [
      'No minimum order value required.',
      'Can be clubbed with ongoing bank discounts.',
    ],
    isPopular: true,
    logoBg: '#2874F0',
    accentColor: '#2874F0',
  },
  {
    id: 'flp-1000',
    brandId: 'flipkart',
    brandName: 'Flipkart',
    category: 'ecommerce',
    title: '₹1,000 Flipkart VIP Gift Card',
    valueFormatted: '₹1,000',
    numericValue: 1000,
    coinsCost: 1950,
    originalCoinsCost: 2000,
    highlightTag: 'Trending',
    description: 'Instant ₹1,000 balance for electronics, gadgets, footwear, and more on Flipkart.',
    instructions: [
      'Apply at checkout or add directly to your Flipkart Wallet balance.',
    ],
    terms: ['Valid for 1 year.'],
    logoBg: '#2874F0',
    accentColor: '#2874F0',
  },
  {
    id: 'boat-500',
    brandId: 'boat',
    brandName: 'boAt',
    category: 'audio',
    title: '₹500 boAt Lifestyle Audio Voucher',
    valueFormatted: '₹500',
    numericValue: 500,
    coinsCost: 750,
    originalCoinsCost: 1000,
    highlightTag: '25% Coin Discount 🔥',
    description: 'Get ₹500 off on true wireless earbuds, Airdopes, smartwatches, or Bluetooth speakers.',
    instructions: [
      'Visit boat-lifestyle.com and add your favorite audio or wearable gear to cart.',
      'At checkout, enter the discount promo code in the "Apply Coupon" field.',
      'The ₹500 discount will be deducted immediately.',
    ],
    terms: [
      'Applicable on all products at boat-lifestyle.com.',
      'Can be applied on top of sale prices.',
      'Valid for 6 months from redemption.',
    ],
    isTrending: true,
    logoBg: '#E21B24',
    accentColor: '#E21B24',
  },
  {
    id: 'boat-1000',
    brandId: 'boat',
    brandName: 'boAt',
    category: 'audio',
    title: '₹1,000 boAt Pro Gear Voucher',
    valueFormatted: '₹1,000',
    numericValue: 1000,
    coinsCost: 1500,
    originalCoinsCost: 2000,
    highlightTag: 'Super Value',
    description: 'Level up your audio setup with ₹1,000 off premium Nirvana ANC headphones & smartwatches.',
    instructions: [
      'Enter promo code on boAt checkout page.',
      'Instant deduction on cart subtotal.',
    ],
    terms: ['Valid on orders above ₹1,499 on boat-lifestyle.com.'],
    logoBg: '#E21B24',
    accentColor: '#E21B24',
  },
  {
    id: 'mynt-300',
    brandId: 'myntra',
    brandName: 'Myntra',
    category: 'fashion',
    title: '₹300 Myntra Fashion Voucher',
    valueFormatted: '₹300',
    numericValue: 300,
    coinsCost: 600,
    highlightTag: 'Trending Fashion',
    description: 'Shop top apparel brands, sneakers, accessories, and cosmetics on Myntra.',
    instructions: [
      'Open Myntra App / Web > Profile > Myntra Credit / Gift Cards.',
      'Click "Add Gift Card", enter the 16-digit card number and PIN.',
      'Use Myntra Credit at checkout with a single click.',
    ],
    terms: [
      'Valid for 12 months on all brands on Myntra.',
      'Can be combined with bank offers and sale discounts.',
    ],
    isPopular: true,
    logoBg: '#FF3F6C',
    accentColor: '#FF3F6C',
  },
  {
    id: 'mynt-500',
    brandId: 'myntra',
    brandName: 'Myntra',
    category: 'fashion',
    title: '₹500 Myntra Wardrobe E-Card',
    valueFormatted: '₹500',
    numericValue: 500,
    coinsCost: 1000,
    highlightTag: 'Style Pick',
    description: 'Upgrade your closet with ₹500 towards Nike, Puma, Levi\'s, Zara, and top ethnic wear.',
    instructions: [
      'Redeem into Myntra Credit or enter code in Gift Card payment section during checkout.',
    ],
    terms: ['Valid for 1 year from the date of issue.'],
    logoBg: '#FF3F6C',
    accentColor: '#FF3F6C',
  },
  {
    id: 'mynt-1000',
    brandId: 'myntra',
    brandName: 'Myntra',
    category: 'fashion',
    title: '₹1,000 Myntra Luxury & Fashion',
    valueFormatted: '₹1,000',
    numericValue: 1000,
    coinsCost: 1900,
    originalCoinsCost: 2000,
    highlightTag: 'Exclusive',
    description: '₹1,000 credit for premium footwear, designer watches, perfumes, and apparel.',
    instructions: [
      'Add to Myntra Credit via Gift Card portal.',
    ],
    terms: ['Usable on all Myntra collections without restrictions.'],
    logoBg: '#FF3F6C',
    accentColor: '#FF3F6C',
  },
  {
    id: 'swig-150',
    brandId: 'swiggy',
    brandName: 'Swiggy',
    category: 'food',
    title: '₹150 Swiggy Food & Instamart',
    valueFormatted: '₹150',
    numericValue: 150,
    coinsCost: 300,
    highlightTag: 'Quick Treat',
    description: 'Order your favorite snacks, meals, or 10-min groceries on Swiggy Instamart.',
    instructions: [
      'Open Swiggy App > Account > Swiggy Money.',
      'Tap "Add Gift Card" and enter the 16-digit voucher number and PIN.',
      'Pay with Swiggy Money on food, Dineout, or Instamart orders.',
    ],
    terms: [
      'Valid for 12 months.',
      'Usable across Food Delivery, Instamart, and Dineout.',
    ],
    logoBg: '#FC8019',
    accentColor: '#FC8019',
  },
  {
    id: 'swig-300',
    brandId: 'swiggy',
    brandName: 'Swiggy',
    category: 'food',
    title: '₹300 Swiggy Gourmet Voucher',
    valueFormatted: '₹300',
    numericValue: 300,
    coinsCost: 600,
    highlightTag: 'Foodie Choice',
    description: '₹300 off your favorite pizzas, biryanis, burgers, or weekend grocery carts.',
    instructions: [
      'Add code to Swiggy Money in account settings.',
    ],
    terms: ['Valid across all cities in India where Swiggy operates.'],
    logoBg: '#FC8019',
    accentColor: '#FC8019',
  },
  {
    id: 'zom-150',
    brandId: 'zomato',
    brandName: 'Zomato',
    category: 'food',
    title: '₹150 Zomato Dining & Delivery',
    valueFormatted: '₹150',
    numericValue: 150,
    coinsCost: 300,
    highlightTag: 'Instant E-Code',
    description: 'Treat yourself to fresh meals, desserts, or dine-in restaurant discounts.',
    instructions: [
      'In Zomato App, go to Profile > Claim Gift Card.',
      'Enter the 16-character code and PIN.',
      'Credit is added to your Zomato balance automatically.',
    ],
    terms: ['Valid for 12 months on food delivery and dining out.'],
    logoBg: '#E23744',
    accentColor: '#E23744',
  },
  {
    id: 'sbx-250',
    brandId: 'starbucks',
    brandName: 'Starbucks',
    category: 'food',
    title: '₹250 Starbucks Coffee Card',
    valueFormatted: '₹250',
    numericValue: 250,
    coinsCost: 500,
    highlightTag: 'Coffee Break',
    description: 'Enjoy handcrafted coffees, frappuccinos, and bakery treats at any Starbucks store in India.',
    instructions: [
      'Show the barcode or 16-digit card code to the barista at the payment counter.',
      'Or add to Starbucks India App as a digital card balance.',
    ],
    terms: ['Valid at all participating Starbucks India outlets.'],
    logoBg: '#00704A',
    accentColor: '#00704A',
  },
  {
    id: 'bms-200',
    brandId: 'bookmyshow',
    brandName: 'BookMyShow',
    category: 'entertainment',
    title: '₹200 BookMyShow Movie Voucher',
    valueFormatted: '₹200',
    numericValue: 200,
    coinsCost: 400,
    highlightTag: 'Weekend Movies',
    description: 'Catch the latest blockbusters, concerts, comedy shows, and live events.',
    instructions: [
      'Select movie tickets on BookMyShow website or mobile app.',
      'On payment page, select "Unlock Offers or Apply Promo / Gift Voucher".',
      'Select "Gift Voucher", enter your 16-digit code and submit.',
    ],
    terms: [
      'Valid for 6 months from issue date.',
      'Applicable on movies, plays, and live concerts.',
    ],
    logoBg: '#F84464',
    accentColor: '#F84464',
  },
];

export const INITIAL_CLAIMED_VOUCHERS: ClaimedVoucher[] = [
  {
    id: 'cv-1',
    voucherId: 'boat-500',
    brandName: 'boAt',
    title: '₹500 boAt Lifestyle Audio Voucher',
    valueFormatted: '₹500',
    code: 'BOAT-SMILE-9842X',
    pin: '7391',
    claimedAt: 'Aug 21, 2026',
    expiresAt: 'Feb 21, 2027',
    coinsSpent: 750,
    logoBg: '#E21B24',
    websiteUrl: 'https://www.boat-lifestyle.com',
    status: 'active',
  },
];
