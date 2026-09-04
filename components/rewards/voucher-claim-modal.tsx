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
  FileText,
  Gift,
  Info,
  Lock,
  Sparkles,
  UserPlus,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CoinIcon } from '@/components/ui/coin-icon';
import { Button } from '@/components/ui/button';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { useToast } from '@/hooks/use-toast';
import type { VoucherItem, ClaimedVoucher } from './voucher-data';
import { BrandLogoImage } from '@/lib/brand-logos';

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

function CopyableField({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="brutal-border-b bg-card p-3">
      <p className="font-mono text-[10px] font-black uppercase text-muted-foreground tracking-wider">
        {label}
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="font-mono text-base font-black tracking-wider select-all text-foreground break-all sm:text-lg">
          {value}
        </span>
        <button
          onClick={onCopy}
          className="shrink-0 inline-flex items-center gap-1 brutal-badge bg-muted px-2.5 py-1.5 font-mono text-[11px] font-bold min-h-0 transition-colors hover:bg-primary/20 active:scale-[0.96]"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600" strokeWidth={3} />
          ) : (
            <Copy className="size-3.5" />
          )}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
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
        className="brutal-dialog relative w-full max-w-md bg-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex size-8 items-center justify-center brutal-badge bg-muted text-foreground min-h-0 transition-transform active:scale-[0.96] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-4" strokeWidth={3} />
        </button>

        {claimedData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogoImage
                brandName={claimedData.brandName}
                size={36}
              />
              <div>
                <h2 id="modal-title" className="font-display text-xl font-black tracking-tight sm:text-2xl">
                  {claimedData.brandName} {claimedData.valueFormatted}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Claimed · Valid for 12 months
                </p>
              </div>
            </div>

            <div className="brutal-border rounded-lg overflow-hidden">
              <CopyableField
                label="Voucher Code"
                value={claimedData.code}
                copied={copiedCode}
                onCopy={() => copyToClipboard(claimedData.code, false)}
              />

              {claimedData.pin && (
                <CopyableField
                  label="Security PIN"
                  value={claimedData.pin}
                  copied={copiedPin}
                  onCopy={() => copyToClipboard(claimedData.pin, true)}
                />
              )}
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span>Expires: {claimedData.expiresAt}</span>
              <span className="font-bold text-foreground tabular-nums flex items-center gap-1">
                <span>-{claimedData.coinsSpent}</span>
                <CoinIcon className="size-3.5" />
              </span>
            </div>

            {voucher.instructions.length > 0 && (
              <details className="group brutal-border rounded-lg bg-muted/40 text-xs">
                <summary className="flex cursor-pointer items-center gap-1.5 px-3 py-2.5 font-title font-black uppercase tracking-wider text-[11px] select-none">
                  <Info className="size-3.5 text-primary" />
                  How to Redeem
                </summary>
                <ul className="list-disc list-inside px-3 pb-3 space-y-1 text-muted-foreground font-medium text-[11px] leading-relaxed">
                  {voucher.instructions.map((ins, idx) => (
                    <li key={idx}>{ins}</li>
                  ))}
                </ul>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button
                asChild
                className="flex-1"
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
              >
                My Vouchers
              </Button>
            </div>
          </div>
        ) : hasEnoughCoins ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogoImage
                brandName={voucher.brandName}
                imageUrl={voucher.imageUrl}
                size={40}
              />
              <div>
                <h2 id="modal-title" className="font-display text-xl font-black tracking-tight sm:text-2xl">
                  {voucher.brandName} {voucher.valueFormatted}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {voucher.description}
                </p>
              </div>
            </div>

            <div className="brutal-surface bg-muted/40 p-3.5 sm:p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b-[length:var(--border-width)] border-border/20 pb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-foreground">
                  <FileText className="size-3.5 text-primary" />
                  Offer Details
                </div>
                <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase px-2 py-0.5 rounded bg-background/80 border border-border/30">
                  {voucher.category}
                </span>
              </div>

              <div className="max-h-52 overflow-y-auto pr-1 text-xs text-foreground/90 space-y-2">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h3 className="font-title font-black text-xs uppercase tracking-wide text-foreground mt-2.5 mb-1 first:mt-0">
                        {children}
                      </h3>
                    ),
                    h2: ({ children }) => (
                      <h3 className="font-title font-black text-xs uppercase tracking-wide text-foreground mt-2.5 mb-1 first:mt-0">
                        {children}
                      </h3>
                    ),
                    h3: ({ children }) => (
                      <h4 className="font-title font-bold text-xs uppercase tracking-wide text-primary mt-2 mb-1 first:mt-0">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-1.5 last:mb-0">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-muted-foreground my-1.5">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside pl-4 space-y-1 text-xs text-muted-foreground my-1.5">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-foreground">
                        {children}
                      </strong>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2 hover:opacity-80"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children }) => (
                      <code className="font-mono text-[11px] bg-background/80 px-1 py-0.5 rounded border border-border/40 text-foreground">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {voucher.details?.trim() ||
                    `### Offer Details\n- Redeem this voucher for **${voucher.valueFormatted}** value.\n- Applicable on ${voucher.brandName} purchases and eligible items.\n- Valid for 12 months from issuance.\n\n### How to Redeem\n1. Click Redeem to obtain secret code and security PIN.\n2. Apply the voucher code during checkout.`}
                </ReactMarkdown>
              </div>
            </div>

            

            {isRedemptionBlocked && (
              <div className="p-3 bg-destructive/15 brutal-border border-destructive rounded-lg font-mono text-xs font-bold text-destructive flex items-center gap-2">
                <Lock className="size-4 shrink-0" />
                <span>
                  {isMaintenance
                    ? "Platform maintenance — claims temporarily paused."
                    : "Marketplace currently closed."}
                </span>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                onClick={handleClaim}
                disabled={isSubmitting || isRedemptionBlocked}
                className="flex-1 gap-2"
              >
                <CoinIcon className="size-4" />
                <span>
                  {isSubmitting
                    ? 'Issuing Code...'
                    : isMaintenance
                    ? 'Claims Paused'
                    : isMarketplaceDisabled
                    ? 'Marketplace Closed'
                    : `Redeem for ${voucher.coinsCost} Coins`}
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogoImage
                brandName={voucher.brandName}
                imageUrl={voucher.imageUrl}
                size={40}
              />
              <div>
                <h2 id="modal-title" className="font-display text-xl font-black tracking-tight sm:text-2xl">
                  {voucher.brandName} {voucher.valueFormatted}
                </h2>
                <p className="text-xs text-muted-foreground">
                  You need <strong className="text-foreground">{coinsNeeded} more coins</strong> to claim this voucher.
                </p>
              </div>
            </div>

            <div className="brutal-surface bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-muted-foreground">Progress</span>
                <span className="font-mono text-xs font-black tabular-nums flex items-center gap-1">
                  <span>{userCoins} / {voucher.coinsCost}</span>
                  <CoinIcon className="size-3.5" />
                </span>
              </div>

              <div className="relative h-3.5 w-full brutal-border rounded-sm bg-card overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-300"
                  style={{ width: `${Math.min((userCoins / voucher.coinsCost) * 100, 100)}%` }}
                />
              </div>

              <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {(userCoins / voucher.coinsCost * 100).toFixed(0)}% there — keep smiling!
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="font-title font-black text-xs uppercase tracking-wider flex items-center gap-1.5 px-0.5">
                <Sparkles className="size-3.5 text-primary" />
                Earn More Coins
              </p>

              <Link
                href="/capture"
                onClick={onClose}
                className="flex items-center justify-between brutal-surface bg-card p-3 brutal-lift"
              >
                <div className="flex items-center gap-2.5">
                  <Camera className="size-4 text-primary" />
                  <div>
                    <p className="font-mono text-xs font-black">Daily Smile Check</p>
                    <p className="text-[10px] text-muted-foreground">Up to +50 coins + streak bonus</p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>

              <Link
                href="/refer"
                onClick={onClose}
                className="flex items-center justify-between brutal-surface bg-card p-3 brutal-lift"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="size-4 text-accent-foreground" />
                  <div>
                    <p className="font-mono text-xs font-black">Invite Friends</p>
                    <p className="text-[10px] text-muted-foreground">+200 coins per referral</p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </div>

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
