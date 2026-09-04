'use client';

import * as React from 'react';
import {
  Film,
  Gift,
  Headphones,
  Lock,
  Search,
  Shirt,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { cn } from '@/lib/utils';
import {
  VOUCHER_CATEGORIES,
  VOUCHERS_CATALOG,
  type VoucherCategory,
  type VoucherItem,
  type ClaimedVoucher,
} from './voucher-data';
import { VoucherClaimModal } from './voucher-claim-modal';
import { BrandLogoImage } from '@/lib/brand-logos';

interface VoucherMarketplaceProps {
  userCoins: number;
  onClaimSuccess: (voucher: VoucherItem, claim: ClaimedVoucher) => void;
  onNavigateToTab: (tab: 'my-vouchers' | 'marketplace' | 'scratch' | 'badges') => void;
}

type SortOption = 'featured' | 'coins-asc' | 'coins-desc' | 'value-desc';

export function VoucherMarketplace({
  userCoins,
  onClaimSuccess,
  onNavigateToTab,
}: VoucherMarketplaceProps) {
  const { settings } = useSystemSettings();
  const isMaintenance = Boolean(settings.maintenance_mode);
  const isMarketplaceDisabled = settings.marketplace_enabled === false;
  const isRedemptionBlocked = isMaintenance || isMarketplaceDisabled;

  const [vouchers, setVouchers] = React.useState<VoucherItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<VoucherCategory>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [onlyAffordable, setOnlyAffordable] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortOption>('featured');
  const [selectedVoucher, setSelectedVoucher] = React.useState<VoucherItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(8);

  React.useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, searchQuery, onlyAffordable, sortBy]);

  React.useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const res = await fetch('/api/rewards/catalog');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setVouchers(data);
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

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
    return vouchers.filter((voucher) => {
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
  }, [vouchers, selectedCategory, searchQuery, onlyAffordable, sortBy, userCoins]);

  const displayedVouchers = React.useMemo(() => {
    return filteredVouchers.slice(0, visibleCount);
  }, [filteredVouchers, visibleCount]);

  const hasMore = filteredVouchers.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const affordableCount = vouchers.filter((v) => userCoins >= v.coinsCost).length;

  const handleOpenClaim = (voucher: VoucherItem) => {
    if (isRedemptionBlocked) return;
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {isRedemptionBlocked && (
        <div className="p-3 sm:p-4 bg-destructive/15 border-[length:var(--border-width)] border-destructive rounded-xl font-mono text-xs font-bold text-destructive flex items-center gap-2.5 sm:gap-3 shadow-brutal-xs">
          <Lock className="size-4 sm:size-5 shrink-0" />
          <div>
            <span className="font-black uppercase">Voucher Claims Suspended: </span>
            <span>
              {isMaintenance
                ? "Platform maintenance is in progress. Redemptions are temporarily paused."
                : "The voucher marketplace is currently closed by administrators."}
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vouchers (Amazon, boAt, Swiggy)..."
            className="pl-9 h-9 sm:h-10 border-[length:var(--border-width)] border-black rounded-lg bg-card font-mono text-[11px] sm:text-xs shadow-brutal-xs sm:shadow-brutal-sm focus-visible:ring-0 focus-visible:shadow-brutal"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setOnlyAffordable((prev) => !prev)}
            className={cn(
              'flex items-center gap-1.5 border-[length:var(--border-width)] rounded-md sm:rounded-lg px-2.5 sm:px-3 h-9 sm:h-10 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap shrink-0',
              onlyAffordable
                ? 'border-black bg-emerald-300 text-black shadow-brutal-xs sm:shadow-brutal-sm font-black'
                : 'border-black/30 bg-card text-muted-foreground hover:border-black hover:text-foreground'
            )}
          >
            <CheckCircle2 className="size-3 sm:size-3.5" />
            <span>Affordable ({affordableCount})</span>
          </button>

          <div className="flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md sm:rounded-lg bg-card px-2 sm:px-2.5 h-9 sm:h-10 shadow-brutal-xs sm:shadow-brutal-sm shrink-0">
            <SlidersHorizontal className="size-3 sm:size-3.5 text-muted-foreground shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured</option>
              <option value="coins-asc">Coins: Low</option>
              <option value="coins-desc">Coins: High</option>
              <option value="value-desc">Value: High</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-8 sm:p-12 text-center shadow-brutal font-mono text-xs font-bold text-muted-foreground flex items-center justify-center gap-2">
          <span className="size-2 bg-primary rounded-full animate-ping" />
          Loading rewards catalog...
        </div>
      ) : vouchers.length === 0 ? (
        <div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 sm:p-12 text-center shadow-brutal space-y-2 sm:space-y-3">
          <ShoppingBag className="mx-auto size-10 sm:size-12 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="mt-2 sm:mt-3 font-display text-lg sm:text-xl font-black text-foreground">No Vouchers In Store Yet</h3>
          <p className="mx-auto max-w-md text-[11px] sm:text-xs text-muted-foreground font-mono leading-relaxed">
            Platform administrators have not published active vouchers yet. New reward vouchers will appear here as soon as they are added in the admin panel.
          </p>
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 sm:p-12 text-center shadow-brutal">
          <ShoppingBag className="mx-auto size-10 sm:size-12 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="mt-2 sm:mt-3 font-display text-lg sm:text-xl font-black">No matching vouchers found</h3>
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
            className="mt-4 border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold uppercase"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayedVouchers.map((voucher) => {
            const isAffordable = userCoins >= voucher.coinsCost;
            const progress = Math.min((userCoins / voucher.coinsCost) * 100, 100);
            const neededCoins = voucher.coinsCost - userCoins;

            return (
              <article
                key={voucher.id}
                className={cn(
                  'relative flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-xl bg-card p-3.5 sm:p-5 shadow-brutal-sm sm:shadow-brutal-lg transition-all duration-150',
                  isAffordable ? 'hover:-translate-y-1 hover:shadow-brutal-xl' : 'opacity-95'
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <BrandLogoImage
                        brandName={voucher.brandName}
                        imageUrl={voucher.imageUrl}
                        size={44}
                      />
                      <div>
                        <h3 className="font-title text-sm sm:text-base font-black leading-tight">
                          {voucher.brandName}
                        </h3>
                        <span className="font-mono text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">
                          {voucher.category}
                        </span>
                      </div>
                    </div>

                    <span className="border-[length:var(--border-width)] border-black rounded-md bg-primary px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-xs sm:text-sm font-black tracking-tight shrink-0 shadow-brutal-xs">
                      {voucher.valueFormatted}
                    </span>
                  </div>

                  <div className="mt-2 sm:mt-3">
                    <h4 className="font-title text-xs sm:text-sm font-black text-foreground">
                      {voucher.title}
                    </h4>
                    <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-snug sm:leading-relaxed">
                      {voucher.description}
                    </p>
                  </div>

                  <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    {voucher.highlightTag && (
                      <span className="inline-block border border-black rounded-xs bg-muted px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-black uppercase text-foreground">
                        {voucher.highlightTag}
                      </span>
                    )}
                    {typeof voucher.remainingInventory === 'number' && (
                      <span className={cn(
                        "inline-block border border-black rounded-xs px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-black uppercase",
                        voucher.remainingInventory > 0 ? "bg-emerald-200 text-emerald-950" : "bg-red-200 text-red-950"
                      )}>
                        {voucher.remainingInventory > 0 ? `${voucher.remainingInventory} in stock` : 'Restocking soon'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-3 border-t-[length:var(--border-width)] border-black/10 space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted-foreground font-bold text-[11px] sm:text-xs">Cost</span>
                    <div className="flex items-center gap-1.5">
                      {voucher.originalCoinsCost && (
                        <span className="text-muted-foreground line-through text-[10px] sm:text-[11px] tabular-nums flex items-center gap-0.5">
                          <span>{voucher.originalCoinsCost}</span>
                          <CoinIcon className="size-2.5 sm:size-3" />
                        </span>
                      )}
                      <span className="font-black text-foreground tabular-nums text-xs sm:text-sm flex items-center gap-1">
                        <span>{voucher.coinsCost}</span>
                        <CoinIcon className="size-3.5 sm:size-4" />
                      </span>
                    </div>
                  </div>

                  {!isAffordable && (
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[9px] sm:text-[10px] text-muted-foreground">
                        <span>Unlock Progress</span>
                        <span className="font-black tabular-nums flex items-center gap-1">
                          <span>{userCoins} / {voucher.coinsCost}</span>
                          <CoinIcon className="size-2.5 sm:size-3" />
                        </span>
                      </div>
                      <div className="relative h-1.5 sm:h-2 w-full border border-black rounded-sm bg-muted overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary border-r border-black transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground text-right flex items-center justify-end gap-1">
                        <span>Need {neededCoins} more coins</span>
                        <CoinIcon className="size-2.5 sm:size-3" />
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleOpenClaim(voucher)}
                    disabled={isRedemptionBlocked}
                    className={cn(
                      'w-full border-[length:var(--border-width)] border-black font-title font-black text-[11px] sm:text-xs uppercase tracking-wider h-8.5 sm:h-10 gap-1.5 sm:gap-2 shadow-brutal-xs sm:shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                      isRedemptionBlocked
                        ? 'bg-muted text-muted-foreground'
                        : isAffordable
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {isRedemptionBlocked ? (
                      <>
                        <Lock className="size-3 sm:size-3.5" />
                        <span>Claims Paused</span>
                      </>
                    ) : isAffordable ? (
                      <>
                        <Gift className="size-3.5 sm:size-4" strokeWidth={2.5} />
                        <span>Redeem Voucher</span>
                      </>
                    ) : (
                      <>
                        <Lock className="size-3 sm:size-3.5" />
                        <span className="flex items-center gap-1">
                          <span>Unlock at {voucher.coinsCost}</span>
                          <CoinIcon className="size-3 sm:size-3.5" />
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

      {hasMore && (
        <div className="flex justify-center pt-1 sm:pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            className="border-[length:var(--border-width)] border-black rounded-lg bg-card text-foreground font-title text-xs font-black uppercase tracking-wider px-5 h-9 shadow-brutal-xs hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none gap-1.5 cursor-pointer brutal-lift"
          >
            <span>Load More Vouchers</span>
            <ChevronDown className="size-4" strokeWidth={2.5} />
          </Button>
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
