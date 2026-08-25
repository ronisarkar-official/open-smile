'use client';

import * as React from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  ExternalLink,
  Film,
  Filter,
  Gift,
  Headphones,
  Info,
  Lock,
  Search,
  Shirt,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Utensils,
  Zap,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  VOUCHER_CATEGORIES,
  VOUCHERS_CATALOG,
  type VoucherCategory,
  type VoucherItem,
  type ClaimedVoucher,
} from './voucher-data';
import { VoucherClaimModal } from './voucher-claim-modal';

interface VoucherMarketplaceProps {
  userCoins: number;
  onClaimSuccess: (voucher: VoucherItem, claim: ClaimedVoucher) => void;
  onNavigateToTab: (tab: 'my-vouchers' | 'marketplace' | 'scratch' | 'badges') => void;
}

export function VoucherMarketplace({
  userCoins,
  onClaimSuccess,
  onNavigateToTab,
}: VoucherMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<VoucherCategory>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [onlyAffordable, setOnlyAffordable] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'featured' | 'coins-asc' | 'coins-desc' | 'value-desc'>('featured');
  const [selectedVoucher, setSelectedVoucher] = React.useState<VoucherItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getCategoryIcon = (id: VoucherCategory) => {
    switch (id) {
      case 'all':
        return Sparkles;
      case 'ecommerce':
        return ShoppingBag;
      case 'fashion':
        return Shirt;
      case 'audio':
        return Headphones;
      case 'food':
        return Utensils;
      case 'entertainment':
        return Film;
      default:
        return Gift;
    }
  };

  const filteredVouchers = React.useMemo(() => {
    return VOUCHERS_CATALOG.filter((voucher) => {
      const matchesCategory = selectedCategory === 'all' || voucher.category === selectedCategory;
      const matchesSearch =
        voucher.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.highlightTag?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAffordable = !onlyAffordable || userCoins >= voucher.coinsCost;

      return matchesCategory && matchesSearch && matchesAffordable;
    }).sort((a, b) => {
      if (sortBy === 'coins-asc') return a.coinsCost - b.coinsCost;
      if (sortBy === 'coins-desc') return b.coinsCost - a.coinsCost;
      if (sortBy === 'value-desc') return b.numericValue - a.numericValue;
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return 0;
    });
  }, [selectedCategory, searchQuery, onlyAffordable, sortBy, userCoins]);

  const affordableCount = VOUCHERS_CATALOG.filter((v) => userCoins >= v.coinsCost).length;

  const handleOpenClaim = (voucher: VoucherItem) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
  };

  return (
    <div className="space-y-6">
      <section
        className="border-[3px] border-black bg-card p-5 sm:p-7 shadow-[6px_6px_0_#000]"
        aria-label="Voucher Marketplace Hero"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 border-[2px] border-black bg-primary px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-black">
                <ShoppingBag className="size-3.5" strokeWidth={2.5} />
                Brand Voucher Store
              </span>
              <span className="border-[2px] border-black bg-muted px-2 py-0.5 font-mono text-[11px] font-bold">
                8 Partner Brands • Instant E-Delivery
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-2">
              Redeem Coins for Real Gift Vouchers
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Convert your smile coins into instant shopping, fashion, audio, and food vouchers from Amazon, Flipkart, boAt, Myntra, and more.
            </p>
          </div>

          <div className="flex items-center gap-3 border-[2px] border-black bg-primary/20 px-4 py-3 shrink-0 self-start md:self-auto">
            <CoinIcon className="size-6 text-black" />
            <div>
              <p className="font-mono text-[10px] font-black uppercase text-muted-foreground">Ready to Redeem</p>
              <p className="font-mono text-lg font-black tabular-nums text-foreground">
                {affordableCount} {affordableCount === 1 ? 'Voucher' : 'Vouchers'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t-[2px] border-black/10 pt-4">
          {VOUCHER_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 border-[2px] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all',
                  isSelected
                    ? 'border-black bg-primary text-black shadow-[2px_2px_0_#000]'
                    : 'border-black/20 bg-muted/50 text-muted-foreground hover:border-black hover:text-foreground'
                )}
              >
                <Icon className="size-3.5" strokeWidth={2.5} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Amazon, Flipkart, boAt, Myntra..."
            className="pl-9 h-10 border-[2px] border-black bg-card font-mono text-xs shadow-[2px_2px_0_#000] focus-visible:ring-0 focus-visible:shadow-[3px_3px_0_#000]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setOnlyAffordable((prev) => !prev)}
            className={cn(
              'flex items-center gap-1.5 border-[2px] px-3 h-10 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap',
              onlyAffordable
                ? 'border-black bg-emerald-300 text-black shadow-[2px_2px_0_#000]'
                : 'border-black/30 bg-card text-muted-foreground hover:border-black hover:text-foreground'
            )}
          >
            <CheckCircle2 className="size-3.5" />
            <span>Affordable Now ({affordableCount})</span>
          </button>

          <div className="flex items-center gap-1.5 border-[2px] border-black bg-card px-2.5 h-10 shadow-[2px_2px_0_#000]">
            <SlidersHorizontal className="size-3.5 text-muted-foreground shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-mono text-xs font-bold uppercase tracking-wider text-foreground outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured</option>
              <option value="coins-asc">Coins: Low to High</option>
              <option value="coins-desc">Coins: High to Low</option>
              <option value="value-desc">Value: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {filteredVouchers.length === 0 ? (
        <div className="border-[3px] border-black bg-card p-8 sm:p-12 text-center shadow-[4px_4px_0_#000]">
          <ShoppingBag className="mx-auto size-12 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="mt-3 font-display text-xl font-black">No matching vouchers found</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search keywords or removing filters to see all available brand gift cards.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyAffordable(false);
            }}
            className="mt-4 border-[2px] border-black bg-primary text-black font-mono text-xs font-bold uppercase"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVouchers.map((voucher) => {
            const isAffordable = userCoins >= voucher.coinsCost;
            const progress = Math.min((userCoins / voucher.coinsCost) * 100, 100);
            const neededCoins = voucher.coinsCost - userCoins;

            return (
              <article
                key={voucher.id}
                className={cn(
                  'relative flex flex-col justify-between border-[3px] border-black bg-card p-5 shadow-[5px_5px_0_#000] transition-all duration-150',
                  isAffordable ? 'hover:-translate-y-1 hover:shadow-[7px_7px_0_#000]' : 'opacity-95'
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex size-11 items-center justify-center border-[2px] border-black font-display font-black text-xs text-white shadow-[2px_2px_0_#000]"
                        style={{ backgroundColor: voucher.logoBg }}
                      >
                        {voucher.brandName.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-title text-base font-black leading-tight">
                          {voucher.brandName}
                        </h3>
                        <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                          {voucher.category}
                        </span>
                      </div>
                    </div>

                    <span className="border-[2px] border-black bg-primary px-2.5 py-1 font-mono text-sm font-black tracking-tight shrink-0 shadow-[1.5px_1.5px_0_#000]">
                      {voucher.valueFormatted}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-title text-sm font-black text-foreground">
                      {voucher.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {voucher.description}
                    </p>
                  </div>

                  {voucher.highlightTag && (
                    <div className="mt-3">
                      <span className="inline-block border border-black bg-muted px-2 py-0.5 font-mono text-[10px] font-black uppercase text-foreground">
                        {voucher.highlightTag}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t-[2px] border-black/10 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground font-bold">Cost</span>
                    <div className="flex items-center gap-1.5">
                      {voucher.originalCoinsCost && (
                        <span className="text-muted-foreground line-through text-[11px] tabular-nums flex items-center gap-0.5">
                          <span>{voucher.originalCoinsCost}</span>
                          <CoinIcon className="size-3" />
                        </span>
                      )}
                      <span className="font-black text-foreground tabular-nums text-sm flex items-center gap-1">
                        <span>{voucher.coinsCost}</span>
                        <CoinIcon className="size-4" />
                      </span>
                    </div>
                  </div>

                  {!isAffordable && (
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                        <span>Unlock Progress</span>
                        <span className="font-black tabular-nums flex items-center gap-1">
                          <span>{userCoins} / {voucher.coinsCost}</span>
                          <CoinIcon className="size-3" />
                        </span>
                      </div>
                      <div className="relative h-2 w-full border border-black bg-muted overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary border-r border-black transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground text-right flex items-center justify-end gap-1">
                        <span>Need {neededCoins} more coins</span>
                        <CoinIcon className="size-3" />
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleOpenClaim(voucher)}
                    className={cn(
                      'w-full border-[2px] border-black font-title font-black text-xs uppercase tracking-wider h-10 gap-2 shadow-[2px_2px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer',
                      isAffordable
                        ? 'bg-primary text-black hover:bg-primary/90'
                        : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {isAffordable ? (
                      <>
                        <Gift className="size-4" strokeWidth={2.5} />
                        <span>Redeem Voucher</span>
                      </>
                    ) : (
                      <>
                        <Lock className="size-3.5" />
                        <span className="flex items-center gap-1">
                          <span>Unlock at {voucher.coinsCost}</span>
                          <CoinIcon className="size-3.5" />
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <VoucherClaimModal
        voucher={selectedVoucher}
        isOpen={isModalOpen}
        userCoins={userCoins}
        onClose={handleCloseModal}
        onConfirmClaim={onClaimSuccess}
        onNavigateToTab={onNavigateToTab}
      />
    </div>
  );
}
