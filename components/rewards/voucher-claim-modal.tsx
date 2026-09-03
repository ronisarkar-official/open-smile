'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Check,
  Copy,
  ExternalLink,
  Gift,
  Info,
  Lock,
  Sparkles,
  UserPlus,
  X,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import { Button } from '@/components/ui/button';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { useToast } from '@/hooks/use-toast';
import type { VoucherItem, ClaimedVoucher } from './voucher-data';

interface VoucherClaimModalProps {
  voucher: VoucherItem | null;
  isOpen: boolean;
  userCoins: number;
  onClose: () => void;
  onConfirmClaim: (voucher: VoucherItem, generatedClaim: ClaimedVoucher) => void;
  onNavigateToTab?: (tab: 'my-vouchers' | 'marketplace' | 'scratch' | 'badges') => void;
}

function generateVoucherCode(brandId: string): { code: string; pin: string } {
  const prefix = brandId.slice(0, 4).toUpperCase();
  const randNum1 = Math.floor(1000 + Math.random() * 9000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randChars = '';
  for (let i = 0; i < 4; i++) {
    randChars += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = `OS-${prefix}-${randNum1}-${randChars}`;
  const pin = String(Math.floor(1000 + Math.random() * 9000));
  return { code, pin };
}

function getBrandUrl(brandId: string): string {
  switch (brandId) {
    case 'amazon':
      return 'https://www.amazon.in/addgiftcard';
    case 'flipkart':
      return 'https://www.flipkart.com';
    case 'boat':
      return 'https://www.boat-lifestyle.com';
    case 'myntra':
      return 'https://www.myntra.com';
    case 'swiggy':
      return 'https://www.swiggy.com';
    case 'zomato':
      return 'https://www.zomato.com';
    case 'starbucks':
      return 'https://www.starbucks.in';
    case 'bookmyshow':
      return 'https://in.bookmyshow.com';
    default:
      return 'https://www.amazon.in';
  }
}

export function VoucherClaimModal({
  voucher,
  isOpen,
  userCoins,
  onClose,
  onConfirmClaim,
  onNavigateToTab,
}: VoucherClaimModalProps) {
  const { settings } = useSystemSettings();
  const { toast } = useToast();
  const isMaintenance = Boolean(settings.maintenance_mode);
  const isMarketplaceDisabled = settings.marketplace_enabled === false;
  const isRedemptionBlocked = isMaintenance || isMarketplaceDisabled;

  const [copiedCode, setCopiedCode] = React.useState(false);
  const [copiedPin, setCopiedPin] = React.useState(false);
  const [claimedData, setClaimedData] = React.useState<ClaimedVoucher | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setClaimedData(null);
      setCopiedCode(false);
      setCopiedPin(false);
      setIsSubmitting(false);
    }
  }, [isOpen, voucher]);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !voucher || !mounted) return null;

  const hasEnoughCoins = userCoins >= voucher.coinsCost;
  const remainingCoinsAfter = userCoins - voucher.coinsCost;
  const coinsNeeded = voucher.coinsCost - userCoins;

  const handleClaim = async () => {
    if (isRedemptionBlocked) {
      toast({
        title: "Redemptions Paused",
        description: isMaintenance
          ? "Voucher claims are temporarily paused during platform maintenance."
          : "The voucher marketplace is currently closed.",
        variant: "error",
      });
      return;
    }
    if (!hasEnoughCoins) return;
    setIsSubmitting(true);

    try {
      let res = await fetch('/api/v1/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucher_id: voucher.id,
          brand: voucher.brandName,
          coins_cost: voucher.coinsCost,
        }),
      });

      if (!res.ok) {
        res = await fetch('/api/rewards/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voucher_id: voucher.id,
            brand: voucher.brandName,
            coins_cost: voucher.coinsCost,
          }),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.detail || "Failed to claim voucher");
      }

      const serverClaim: ClaimedVoucher = {
        id: json.id,
        voucherId: json.voucherId,
        brandName: json.brandName,
        title: json.title,
        valueFormatted: json.valueFormatted,
        code: json.code,
        pin: json.pin || '7492',
        claimedAt: json.claimedAt,
        expiresAt: json.expiresAt,
        coinsSpent: json.coinsSpent,
        logoBg: json.logoBg,
        websiteUrl: json.websiteUrl,
        status: 'active',
      };
      setClaimedData(serverClaim);
      onConfirmClaim(voucher, serverClaim);
      toast({
        title: "Voucher Claimed!",
        description: `Successfully claimed ${voucher.title}.`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Claim Failed",
        description: err.message || "Could not claim voucher. Please try again later.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, isPin = false) => {
    navigator.clipboard.writeText(text);
    if (isPin) {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 sm:p-7 shadow-brutal-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-muted text-foreground transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-4" strokeWidth={3} />
        </button>

        {claimedData ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-emerald-400 px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-black">
                <Sparkles className="size-3.5" strokeWidth={2.5} />
                Voucher Claimed!
              </span>
            </div>

            <div>
              <h2 id="modal-title" className="font-display text-2xl font-black tracking-tight sm:text-3xl">
                Here is your {claimedData.brandName} Voucher Code
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Your code has been issued and stored in your wallet. Valid for 12 months.
              </p>
            </div>

            <div className="border-[length:var(--border-width)] border-black rounded-xl bg-muted p-4 sm:p-5 shadow-brutal space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg font-display font-black text-xs text-white"
                    style={{ backgroundColor: claimedData.logoBg }}
                  >
                    {claimedData.brandName.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-title text-sm font-black">{claimedData.brandName}</p>
                    <p className="font-mono text-[11px] font-bold text-muted-foreground">{claimedData.valueFormatted} Voucher</p>
                  </div>
                </div>
                <span className="border-[length:var(--border-width)] border-black rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-black">
                  {claimedData.valueFormatted}
                </span>
              </div>

              <div className="border-[length:var(--border-width)] border-black rounded-lg bg-card p-3">
                <p className="font-mono text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                  Voucher / Gift Card Code
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-base sm:text-lg font-black tracking-wider select-all text-foreground break-all">
                    {claimedData.code}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(claimedData.code, false)}
                    className="shrink-0 border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold gap-1.5 h-8 px-3 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    {copiedCode ? <Check className="size-3.5" strokeWidth={3} /> : <Copy className="size-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </Button>
                </div>
              </div>

              {claimedData.pin && (
                <div className="flex items-center justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card px-3 py-2">
                  <div>
                    <span className="font-mono text-[10px] font-black uppercase text-muted-foreground">Security PIN: </span>
                    <span className="font-mono text-sm font-black ml-1">{claimedData.pin}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(claimedData.pin, true)}
                    className="border-[length:var(--border-width)] border-black rounded-md font-mono text-[11px] font-bold h-7 px-2.5"
                  >
                    {copiedPin ? 'Copied' : 'Copy PIN'}
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground border-t border-black/15 pt-2">
                <span>Valid until: {claimedData.expiresAt}</span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  <span>-{claimedData.coinsSpent}</span>
                  <CoinIcon className="size-3.5" />
                  <span>debited</span>
                </span>
              </div>
            </div>

            <div className="border-[length:var(--border-width)] border-black rounded-lg bg-card p-3.5 text-xs space-y-2">
              <p className="font-title font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Info className="size-3.5 text-primary" />
                How to Redeem:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground font-medium text-[11px] leading-relaxed">
                {voucher.instructions.map((ins, idx) => (
                  <li key={idx}>{ins}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Button
                asChild
                className="flex-1 border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-title font-black text-xs uppercase tracking-wider h-11 shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <a href={claimedData.websiteUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <span>Open {claimedData.brandName}</span>
                  <ExternalLink className="size-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  onNavigateToTab?.('my-vouchers');
                }}
                className="border-[length:var(--border-width)] border-black rounded-lg bg-card font-mono text-xs font-bold uppercase tracking-wider h-11"
              >
                View in My Vouchers
              </Button>
            </div>
          </div>
        ) : hasEnoughCoins ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-primary px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-primary-foreground">
                <Gift className="size-3.5" strokeWidth={2.5} />
                Redeem Voucher
              </span>
            </div>

            <div>
              <h2 id="modal-title" className="font-display text-2xl font-black tracking-tight sm:text-3xl">
                Claim {voucher.valueFormatted} {voucher.brandName} Voucher
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {voucher.description}
              </p>
            </div>

            <div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-5 shadow-brutal space-y-3.5">
              <div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex size-10 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg font-display font-black text-xs text-white"
                    style={{ backgroundColor: voucher.logoBg }}
                  >
                    {voucher.brandName.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-title text-base font-black">{voucher.brandName}</p>
                    <p className="font-mono text-xs font-bold text-muted-foreground">{voucher.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="border-[length:var(--border-width)] border-black rounded-md bg-primary px-2.5 py-1 font-mono text-sm font-black">
                    {voucher.valueFormatted}
                  </span>
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Current Balance:</span>
                  <span className="font-black text-foreground tabular-nums flex items-center gap-1">
                    <span>{userCoins}</span>
                    <CoinIcon className="size-3.5" />
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Voucher Cost:</span>
                  <span className="font-black text-red-500 tabular-nums flex items-center gap-1">
                    <span>-{voucher.coinsCost}</span>
                    <CoinIcon className="size-3.5" />
                  </span>
                </div>
                <div className="flex justify-between border-t-[length:var(--border-width)] border-black pt-2 font-black text-sm">
                  <span>Balance After Claim:</span>
                  <span className="tabular-nums text-foreground flex items-center gap-1">
                    <span>{remainingCoinsAfter}</span>
                    <CoinIcon className="size-4" />
                  </span>
                </div>
              </div>
            </div>

            <div className="border-[length:var(--border-width)] border-black rounded-lg bg-muted/60 p-3 text-xs space-y-1.5">
              <p className="font-mono text-[11px] font-black uppercase text-foreground">Terms & Delivery:</p>
              <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-0.5">
                <li>Instant digital voucher code generation.</li>
                <li>Valid for 12 months from issuance.</li>
                <li>Saved permanently in your Open Smile wallet.</li>
              </ul>
            </div>

            {isRedemptionBlocked && (
              <div className="p-3 bg-destructive/15 border border-destructive rounded-lg font-mono text-xs font-bold text-destructive flex items-center gap-2">
                <Lock className="size-4 shrink-0" />
                <span>
                  {isMaintenance
                    ? "Platform maintenance active: Voucher claims are temporarily suspended."
                    : "Voucher marketplace is currently closed by administrator."}
                </span>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-[length:var(--border-width)] border-black rounded-lg bg-card font-mono text-xs font-bold uppercase tracking-wider h-11"
              >
                Cancel
              </Button>

              <Button
                onClick={handleClaim}
                disabled={isSubmitting || isRedemptionBlocked}
                className="flex-1 border-[length:var(--border-width)] border-black rounded-lg bg-primary text-primary-foreground font-title font-black text-xs uppercase tracking-wider h-11 shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none gap-2 disabled:opacity-50"
              >
                <CoinIcon className="size-4" />
                <span>
                  {isSubmitting
                    ? 'Issuing Code...'
                    : isMaintenance
                    ? 'Claims Paused (Maintenance)'
                    : isMarketplaceDisabled
                    ? 'Marketplace Closed'
                    : `Confirm & Redeem (${voucher.coinsCost})`}
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-amber-400 px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-black">
                <Lock className="size-3.5" strokeWidth={2.5} />
                Coins Needed
              </span>
            </div>

            <div>
              <h2 id="modal-title" className="font-display text-2xl font-black tracking-tight sm:text-3xl">
                {voucher.valueFormatted} {voucher.brandName} Voucher
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                You need <strong className="text-foreground">{coinsNeeded} more coins</strong> to unlock this {voucher.valueFormatted} voucher.
              </p>
            </div>

            <div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-5 shadow-brutal space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-muted-foreground">Progress towards voucher</span>
                <span className="font-mono text-xs font-black tabular-nums flex items-center gap-1">
                  <span>{userCoins} / {voucher.coinsCost}</span>
                  <CoinIcon className="size-3.5" />
                </span>
              </div>

              <div className="relative h-4 w-full border-[length:var(--border-width)] border-black rounded-md bg-muted">
                <div
                  className="absolute inset-y-0 left-0 bg-primary border-r-[length:var(--border-width)] border-black rounded-l-md transition-all duration-300"
                  style={{ width: `${Math.min((userCoins / voucher.coinsCost) * 100, 100)}%` }}
                />
              </div>

              <p className="font-mono text-[11px] text-muted-foreground">
                {(userCoins / voucher.coinsCost * 100).toFixed(0)}% unlocked. Keep smiling every day to earn bonus coins!
              </p>
            </div>

            <div className="border-[length:var(--border-width)] border-black rounded-xl bg-primary/15 p-4 space-y-3">
              <p className="font-title font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                Quick Ways to Earn {coinsNeeded} Coins:
              </p>

              <div className="space-y-2">
                <Link
                  href="/capture"
                  onClick={onClose}
                  className="flex items-center justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card p-2.5 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="size-4 text-primary" />
                    <div>
                      <p className="font-mono text-xs font-black">Daily Smile Check</p>
                      <p className="text-[10px] text-muted-foreground">Up to +50 coins per check + streak bonus</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/refer"
                  onClick={onClose}
                  className="flex items-center justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card p-2.5 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-2">
                    <UserPlus className="size-4 text-accent-foreground" />
                    <div>
                      <p className="font-mono text-xs font-black">Invite Friends</p>
                      <p className="text-[10px] text-muted-foreground">Earn +200 coins per invited friend</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={onClose}
                className="w-full border-[length:var(--border-width)] border-black rounded-lg bg-card text-foreground font-mono text-xs font-bold uppercase tracking-wider h-10"
              >
                Close & Keep Exploring
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
