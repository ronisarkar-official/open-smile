'use client';

import * as React from 'react';
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Gift,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import { Button } from '@/components/ui/button';
import type { ClaimedVoucher } from './voucher-data';
import { BrandLogoImage } from '@/lib/brand-logos';

interface ClaimedVouchersListProps {
  claimedVouchers: ClaimedVoucher[];
  onOpenMarketplace: () => void;
}

export function ClaimedVouchersList({
  claimedVouchers,
  onOpenMarketplace,
}: ClaimedVouchersListProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (claimedVouchers.length === 0) {
    return (
      <div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 sm:p-10 text-center shadow-brutal-sm sm:shadow-brutal-lg">
        <div className="mx-auto flex size-12 sm:size-16 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary shadow-brutal-xs sm:shadow-brutal-sm">
          <ShoppingBag className="size-6 sm:size-8 text-black" strokeWidth={2.5} />
        </div>
        <h3 className="mt-3 sm:mt-4 font-display text-lg sm:text-2xl font-black tracking-tight">
          No Vouchers Claimed Yet
        </h3>
        <p className="mx-auto mt-1.5 sm:mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed px-2">
          You haven&apos;t redeemed any brand gift vouchers yet. Smile daily, collect coins, and unlock vouchers for Amazon, Flipkart, boAt, Myntra, and more!
        </p>
        <div className="mt-4 sm:mt-6 flex justify-center px-2">
          <Button
            onClick={onOpenMarketplace}
            className="w-full max-w-xs sm:w-auto border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-title font-black text-[11px] sm:text-xs uppercase tracking-wider px-4 sm:px-6 h-9 sm:h-10 shadow-brutal-xs sm:shadow-brutal active:translate-x-[1px] active:translate-y-[1px] active:shadow-none gap-1.5 sm:gap-2 cursor-pointer"
          >
            <Sparkles className="size-3.5 sm:size-4 shrink-0" strokeWidth={2.5} />
            <span>Explore Marketplace</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 border-[length:var(--border-width)] border-black rounded-xl bg-card p-3 sm:p-5 shadow-brutal-sm sm:shadow-brutal">
        <div>
          <div className="flex items-center gap-2">
            <span className="border-[length:var(--border-width)] border-black rounded-md bg-primary px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-black uppercase text-primary-foreground">
              Digital Wallet
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-muted-foreground font-bold">
              {claimedVouchers.length} {claimedVouchers.length === 1 ? 'Voucher' : 'Vouchers'} Available
            </span>
          </div>
          <h2 className="font-display text-base sm:text-2xl font-black mt-0.5 sm:mt-1">
            My Claimed Gift Vouchers
          </h2>
        </div>

        <Button
          onClick={onOpenMarketplace}
          className="border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-title font-black text-[11px] sm:text-xs uppercase tracking-wider h-8 sm:h-10 px-3 sm:px-4 shadow-brutal-xs sm:shadow-brutal-sm self-start sm:self-auto gap-1.5"
        >
          <Gift className="size-3.5 sm:size-4" />
          <span>Redeem More</span>
        </Button>
      </div>

      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2">
        {claimedVouchers.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <article
              key={item.id}
              className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-3.5 sm:p-5 shadow-brutal-sm sm:shadow-brutal-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <BrandLogoImage
                      brandName={item.brandName}
                      size={40}
                    />
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <h3 className="font-title text-sm sm:text-base font-black">{item.brandName}</h3>
                        <span className="border border-black rounded-xs bg-emerald-300 text-black px-1.5 py-0.2 font-mono text-[8px] sm:text-[9px] font-black uppercase">
                          {item.status}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] sm:text-xs text-muted-foreground line-clamp-1">{item.title}</p>
                    </div>
                  </div>

                  <span className="border-[length:var(--border-width)] border-black rounded-md bg-primary px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-xs sm:text-sm font-black shrink-0 shadow-brutal-xs">
                    {item.valueFormatted}
                  </span>
                </div>

                <div className="mt-3 sm:mt-4 border-[length:var(--border-width)] border-black rounded-lg bg-muted/60 p-2.5 sm:p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                      Voucher Code
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground">
                      Claimed: {item.claimedAt}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs sm:text-base font-black tracking-wider text-foreground select-all break-all">
                      {item.code}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => copyCode(item.code, item.id)}
                      className="shrink-0 border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground font-mono text-[11px] sm:text-xs font-bold gap-1 h-6.5 sm:h-7 px-2 sm:px-2.5 shadow-brutal-xs"
                    >
                      {isCopied ? <Check className="size-3" strokeWidth={3} /> : <Copy className="size-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>

                  {item.pin && (
                    <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-1.5 sm:pt-2 font-mono text-xs">
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground font-bold">PIN: {item.pin}</span>
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        Valid till {item.expiresAt}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t-[length:var(--border-width)] border-black/10 flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <span>Cost: {item.coinsSpent}</span>
                  <CoinIcon className="size-3 sm:size-3.5" />
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-[length:var(--border-width)] border-black rounded-md font-mono text-[10px] sm:text-xs font-bold uppercase h-7 sm:h-8 px-2.5 gap-1 shadow-brutal-xs"
                >
                  <a
                    href={item.websiteUrl || 'https://amazon.in'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Use Now</span>
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
