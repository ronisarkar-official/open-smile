'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Award,
  Check,
  Gift,
  Lock,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';
import { ScratchCardGallery } from '@/components/rewards/scratch-card-gallery';
import { VoucherMarketplace } from '@/components/rewards/voucher-marketplace';
import { ClaimedVouchersList } from '@/components/rewards/claimed-vouchers-list';
import {
  INITIAL_CLAIMED_VOUCHERS,
  type ClaimedVoucher,
  type VoucherItem,
} from '@/components/rewards/voucher-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const milestones = [
  { coins: 100, label: 'First Smile', icon: Star, unlocked: true },
  { coins: 300, label: 'Snack Voucher', icon: Zap, unlocked: true },
  { coins: 500, label: 'Shopping Starter', icon: ShoppingBag, unlocked: true },
  { coins: 1000, label: 'Pro Gear Pass', icon: Gift, unlocked: false },
  { coins: 2000, label: 'VIP Legend', icon: Trophy, unlocked: false },
];

const badges = [
  {
    name: 'First Smile',
    description: 'Earned your first 100 coins',
    threshold: 100,
    icon: Star,
    bg: 'bg-primary',
    unlocked: true,
    earnedDate: 'Aug 15, 2026',
  },
  {
    name: 'Marketplace Starter',
    description: "Reached 500 coins — unlocked ₹250 gift cards",
    threshold: 500,
    icon: Zap,
    bg: 'bg-accent',
    unlocked: true,
    earnedDate: 'Aug 20, 2026',
  },
  {
    name: 'Smile Legend',
    description: 'Hit 1,000 coins — unlock high-value boAt & Myntra vouchers',
    threshold: 1000,
    icon: Award,
    bg: 'bg-secondary',
    unlocked: false,
    earnedDate: null,
  },
];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = React.useState<'marketplace' | 'my-vouchers' | 'scratch' | 'badges'>('marketplace');
  const [userCoins, setUserCoins] = React.useState(620);
  const [claimedVouchers, setClaimedVouchers] = React.useState<ClaimedVoucher[]>(INITIAL_CLAIMED_VOUCHERS);

  const handleClaimSuccess = (voucher: VoucherItem, claim: ClaimedVoucher) => {
    setUserCoins((prev) => Math.max(0, prev - voucher.coinsCost));
    setClaimedVouchers((prev) => [claim, ...prev]);
  };

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-[3px] border-black bg-card p-5 shadow-[6px_6px_0_#000] sm:p-7">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 border-[2px] border-black bg-primary px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-black">
              <Sparkles className="size-3.5" strokeWidth={2.5} />
              Rewards Center
            </span>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl mt-2">
            Rewards & Voucher Marketplace
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Redeem coins for brand vouchers (Amazon, Flipkart, boAt, Myntra, Swiggy), scratch cards from daily smiles, and milestone badges.
          </p>
        </div>

        <div className="flex items-center gap-3 border-[3px] border-black bg-primary px-5 py-3 shadow-[4px_4px_0_#000] self-start sm:self-auto shrink-0">
          <CoinIcon className="size-8 text-black" />
          <div>
            <p className="font-mono text-[10px] font-black uppercase text-black">Your Balance</p>
            <p className="font-mono text-2xl sm:text-3xl font-black text-black tabular-nums flex items-center gap-1.5">
              <span>{userCoins}</span>
              <CoinIcon className="size-5" />
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 overflow-x-auto border-b-[2px] border-black/15 pb-2">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={cn(
            'flex items-center gap-2 border-[2px] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap',
            activeTab === 'marketplace'
              ? 'border-black bg-primary text-black shadow-[3px_3px_0_#000]'
              : 'border-transparent bg-card text-muted-foreground hover:border-black hover:text-foreground'
          )}
        >
          <ShoppingBag className="size-4" strokeWidth={2.5} />
          <span>Voucher Marketplace</span>
        </button>

        <button
          onClick={() => setActiveTab('my-vouchers')}
          className={cn(
            'flex items-center gap-2 border-[2px] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap',
            activeTab === 'my-vouchers'
              ? 'border-black bg-primary text-black shadow-[3px_3px_0_#000]'
              : 'border-transparent bg-card text-muted-foreground hover:border-black hover:text-foreground'
          )}
        >
          <Wallet className="size-4" strokeWidth={2.5} />
          <span>My Vouchers ({claimedVouchers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scratch')}
          className={cn(
            'flex items-center gap-2 border-[2px] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap',
            activeTab === 'scratch'
              ? 'border-black bg-primary text-black shadow-[3px_3px_0_#000]'
              : 'border-transparent bg-card text-muted-foreground hover:border-black hover:text-foreground'
          )}
        >
          <Gift className="size-4" strokeWidth={2.5} />
          <span>Scratch Cards & Wins</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={cn(
            'flex items-center gap-2 border-[2px] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap',
            activeTab === 'badges'
              ? 'border-black bg-primary text-black shadow-[3px_3px_0_#000]'
              : 'border-transparent bg-card text-muted-foreground hover:border-black hover:text-foreground'
          )}
        >
          <Award className="size-4" strokeWidth={2.5} />
          <span>Milestones & Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'marketplace' && (
          <VoucherMarketplace
            userCoins={userCoins}
            onClaimSuccess={handleClaimSuccess}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'my-vouchers' && (
          <ClaimedVouchersList
            claimedVouchers={claimedVouchers}
            onOpenMarketplace={() => setActiveTab('marketplace')}
          />
        )}

        {activeTab === 'scratch' && <ScratchCardGallery />}

        {activeTab === 'badges' && (
          <div className="space-y-6">
            <article className="border-[3px] border-black bg-card p-5 shadow-[5px_5px_0_#000] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">
                    Rewards Roadmap
                  </p>
                  <h2 className="mt-1 text-2xl font-black font-title tracking-tight sm:text-3xl">
                    {userCoins} Coins Earned
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hit coin thresholds to unlock higher denomination brand vouchers and exclusive merchant perks.
                  </p>
                </div>
                <Trophy className="size-8 text-primary shrink-0" strokeWidth={2.5} />
              </div>

              <div className="mt-6">
                <div className="relative h-5 w-full border-[3px] border-black bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary border-r-[2px] border-black transition-all duration-500"
                    style={{ width: `${Math.min((userCoins / 2000) * 100, 100)}%` }}
                  />
                </div>

                <div className="mt-4 flex justify-between">
                  {milestones.map((m) => {
                    const MIcon = m.icon;
                    const reached = userCoins >= m.coins;
                    return (
                      <div key={m.coins} className="flex flex-col items-center gap-1.5">
                        <div
                          className={`flex size-10 items-center justify-center border-[2px] border-black sm:size-12 ${
                            reached ? 'bg-primary shadow-[2px_2px_0_#000]' : 'bg-muted'
                          }`}
                        >
                          {reached ? (
                            <Check className="size-5 sm:size-6 text-black" strokeWidth={3} />
                          ) : (
                            <MIcon className="size-5 text-muted-foreground sm:size-6" strokeWidth={2} />
                          )}
                        </div>
                        <span className="font-mono text-[10px] font-bold tabular-nums sm:text-xs">
                          {m.coins}
                        </span>
                        <span className="hidden text-center text-[10px] font-semibold text-muted-foreground sm:block">
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            <section className="grid gap-5 sm:grid-cols-3" aria-label="Badge collection">
              {badges.map((badge) => {
                const BadgeIcon = badge.icon;
                return (
                  <article
                    key={badge.name}
                    className={cn(
                      'relative flex min-h-52 flex-col justify-between border-[3px] border-black p-5 shadow-[4px_4px_0_#000]',
                      badge.unlocked ? `${badge.bg} brutal-lift` : 'bg-muted/50'
                    )}
                  >
                    {!badge.unlocked && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
                        <div className="flex size-12 items-center justify-center border-[2px] border-black bg-card shadow-[2px_2px_0_#000]">
                          <Lock className="size-6 text-foreground" strokeWidth={2} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <BadgeIcon className="size-8 text-black" strokeWidth={2.5} />
                      <span className="font-mono text-xs font-bold tabular-nums">
                        {badge.threshold} coins
                      </span>
                    </div>

                    <div className="mt-auto">
                      <h3 className="text-xl font-black font-title tracking-tight">{badge.name}</h3>
                      <p
                        className={cn(
                          'mt-1 text-xs font-semibold',
                          badge.unlocked ? 'text-black/80' : 'text-muted-foreground'
                        )}
                      >
                        {badge.description}
                      </p>
                      {badge.unlocked && badge.earnedDate && (
                        <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                          Earned {badge.earnedDate}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
