'use client';

import * as React from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Gift,
  ShoppingBag,
  Sparkles,
  Tag,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ClaimedVoucher } from './voucher-data';

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
      <div className="border-[3px] border-black bg-card p-8 sm:p-12 text-center shadow-[6px_6px_0_#000]">
        <div className="mx-auto flex size-16 items-center justify-center border-[3px] border-black bg-primary shadow-[3px_3px_0_#000]">
          <ShoppingBag className="size-8 text-black" strokeWidth={2.5} />
        </div>
        <h3 className="mt-4 font-display text-2xl font-black tracking-tight sm:text-3xl">
          No Vouchers Claimed Yet
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          You haven&apos;t redeemed any brand gift vouchers yet. Smile daily, collect coins, and unlock vouchers for Amazon, Flipkart, boAt, Myntra, and more!
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onOpenMarketplace}
            className="border-[3px] border-black bg-primary text-black font-title font-black text-xs uppercase tracking-wider px-6 h-11 shadow-[4px_4px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none gap-2"
          >
            <Sparkles className="size-4" strokeWidth={2.5} />
            <span>Explore Voucher Marketplace</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-[3px] border-black bg-card p-4 sm:p-5 shadow-[4px_4px_0_#000]">
        <div>
          <div className="flex items-center gap-2">
            <span className="border-[2px] border-black bg-primary px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black">
              Digital Wallet
            </span>
            <span className="font-mono text-xs text-muted-foreground font-bold">
              {claimedVouchers.length} {claimedVouchers.length === 1 ? 'Voucher' : 'Vouchers'} Available
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black mt-1">
            My Claimed Gift Vouchers
          </h2>
        </div>

        <Button
          onClick={onOpenMarketplace}
          className="border-[2px] border-black bg-primary text-black font-title font-black text-xs uppercase tracking-wider h-10 px-4 shadow-[2px_2px_0_#000] self-start sm:self-auto gap-2"
        >
          <Gift className="size-4" />
          <span>Redeem More</span>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {claimedVouchers.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <article
              key={item.id}
              className="border-[3px] border-black bg-card p-5 shadow-[5px_5px_0_#000] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-11 items-center justify-center border-[2px] border-black font-display font-black text-sm text-white shrink-0 shadow-[2px_2px_0_#000]"
                      style={{ backgroundColor: item.logoBg }}
                    >
                      {item.brandName.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-title text-base font-black">{item.brandName}</h3>
                        <span className="border border-black bg-emerald-300 text-black px-1.5 py-0.2 font-mono text-[9px] font-black uppercase">
                          {item.status}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground line-clamp-1">{item.title}</p>
                    </div>
                  </div>

                  <span className="border-[2px] border-black bg-primary px-2.5 py-1 font-mono text-sm font-black shrink-0">
                    {item.valueFormatted}
                  </span>
                </div>

                <div className="mt-4 border-[2px] border-black bg-muted/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                      Voucher Code
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Claimed: {item.claimedAt}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-sm sm:text-base font-black tracking-wider text-foreground select-all break-all">
                      {item.code}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => copyCode(item.code, item.id)}
                      className="shrink-0 border-[1.5px] border-black bg-primary text-black font-mono text-xs font-bold gap-1 h-7 px-2.5 shadow-[1.5px_1.5px_0_#000]"
                    >
                      {isCopied ? <Check className="size-3" strokeWidth={3} /> : <Copy className="size-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>

                  {item.pin && (
                    <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2 font-mono text-xs">
                      <span className="text-[11px] text-muted-foreground font-bold">PIN: {item.pin}</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        Valid till {item.expiresAt}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-[2px] border-black/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                  <span>Cost: {item.coinsSpent}</span>
                  <CoinIcon className="size-3.5" />
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-[2px] border-black bg-card font-mono text-xs font-bold gap-1.5 h-8"
                >
                  <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <span>Use at {item.brandName}</span>
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
