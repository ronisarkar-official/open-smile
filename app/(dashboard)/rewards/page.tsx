import type { Metadata } from "next";
import {
  Award,
  Check,
  Coins,
  Gift,
  Lock,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Rewards",
  description: "Track your progress, collect badges, and redeem rewards.",
};

const milestones = [
  { coins: 100, label: "First Smile", icon: Star, unlocked: true },
  { coins: 500, label: "Smile Pro", icon: Zap, unlocked: true },
  { coins: 1000, label: "Smile Legend", icon: Award, unlocked: false },
  { coins: 2000, label: "Gift Voucher", icon: Gift, unlocked: false },
];

const badges = [
  {
    name: "First Smile",
    description: "Earned your first 100 coins",
    threshold: 100,
    icon: Star,
    bg: "bg-primary",
    unlocked: true,
    earnedDate: "Aug 15, 2026",
  },
  {
    name: "Smile Pro",
    description: "Reached 500 coins — you're on fire",
    threshold: 500,
    icon: Zap,
    bg: "bg-accent",
    unlocked: true,
    earnedDate: "Aug 20, 2026",
  },
  {
    name: "Smile Legend",
    description: "Hit 1,000 coins — legendary status",
    threshold: 1000,
    icon: Award,
    bg: "bg-secondary",
    unlocked: false,
    earnedDate: null,
  },
];

const currentCoins = 620;
const voucherThreshold = 2000;
const progressPercent = Math.min((currentCoins / voucherThreshold) * 100, 100);

export default function RewardsPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Your progress</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Rewards</h1>
          <p className="mt-3 max-w-[55ch] text-base leading-7 text-muted-foreground">
            Collect badges, track milestones, and work toward real rewards.
          </p>
        </div>
        <div className="flex items-center gap-3 border-[3px] border-black bg-primary px-5 py-3 shadow-[5px_5px_0_#000]">
          <Coins className="size-6" strokeWidth={2.5} />
          <div>
            <p className="font-mono text-[10px] font-bold tracking-widest uppercase">Balance</p>
            <p className="font-mono text-3xl font-black tabular-nums">{currentCoins}</p>
          </div>
        </div>
      </div>

      <section className="mt-10" aria-label="Progress toward voucher">
        <article className="border-[3px] border-black bg-card p-5 shadow-[5px_5px_0_#000] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Journey to rewards</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                {currentCoins} / {voucherThreshold.toLocaleString()} coins
              </h2>
            </div>
            <Trophy className="size-8 text-primary" strokeWidth={2.5} />
          </div>

          <div className="mt-6">
            <div className="relative h-5 w-full border-[3px] border-black bg-muted">
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-4 flex justify-between">
              {milestones.map((m) => {
                const MIcon = m.icon;
                const reached = currentCoins >= m.coins;
                return (
                  <div key={m.coins} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex size-10 items-center justify-center border-[2px] border-black sm:size-12 ${
                        reached ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      {reached ? (
                        <Check className="size-5 sm:size-6" strokeWidth={3} />
                      ) : (
                        <MIcon className="size-5 text-muted-foreground sm:size-6" strokeWidth={2} />
                      )}
                    </div>
                    <span className="font-mono text-[10px] font-bold tabular-nums sm:text-xs">{m.coins}</span>
                    <span className="hidden text-center text-[10px] font-semibold text-muted-foreground sm:block">{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="mt-8" aria-label="Badge collection">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-accent" strokeWidth={2.5} />
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Badge collection</p>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {badges.map((badge) => {
            const BadgeIcon = badge.icon;
            return (
              <article
                key={badge.name}
                className={`brutal-surface relative flex min-h-52 flex-col justify-between p-5 sm:p-6 ${
                  badge.unlocked ? `${badge.bg} brutal-lift` : "bg-muted"
                }`}
              >
                {!badge.unlocked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/5">
                    <div className="flex size-14 items-center justify-center border-[3px] border-black bg-card shadow-[3px_3px_0_#000]">
                      <Lock className="size-7" strokeWidth={2} />
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <BadgeIcon className={`size-8 ${badge.unlocked ? "" : "text-muted-foreground"}`} strokeWidth={2.5} />
                  <span className="font-mono text-xs font-bold tabular-nums">{badge.threshold} coins</span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-xl font-black tracking-[-0.03em]">{badge.name}</h3>
                  <p className={`mt-1 text-sm font-semibold ${badge.unlocked ? "text-black/70" : "text-muted-foreground"}`}>
                    {badge.description}
                  </p>
                  {badge.unlocked && badge.earnedDate && (
                    <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-wider">
                      Earned {badge.earnedDate}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8" aria-label="Voucher redemption">
        <article className="grid gap-6 border-[3px] border-black bg-card p-5 shadow-[5px_5px_0_#000] sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5" strokeWidth={2.5} />
              <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Reward store</p>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">Amazon Gift Voucher</h2>
            <p className="mt-3 max-w-[50ch] text-sm leading-6 text-muted-foreground">
              Reach {voucherThreshold.toLocaleString()} coins to unlock a real Amazon gift voucher. Keep smiling — you&apos;re {Math.round(progressPercent)}% of the way there.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold">
              <Coins className="size-4 text-primary" />
              <span className="tabular-nums">{(voucherThreshold - currentCoins).toLocaleString()}</span> coins to go
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-28 items-center justify-center border-[3px] border-black bg-primary/20 sm:size-32">
              <Gift className="size-14 text-primary sm:size-16" strokeWidth={1.5} />
            </div>
            <Button disabled className="w-full gap-2 opacity-60">
              <Lock className="size-4" />
              Redeem at {voucherThreshold.toLocaleString()} coins
            </Button>
          </div>
        </article>
      </section>
    </main>
  );
}
