import { headers } from "next/headers";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Flame,
  Smile,
  Sparkles,
  Trophy,
  UserPlus,
} from "lucide-react";
import { CoinIcon } from "@/components/ui/coin-icon";
import { auth } from "@/backend/auth";
import { Button } from "@/components/ui/button";
import { UserCoinBalance, UserStreak } from "@/components/icons";

const recentActivity = [
  { id: 1, score: 94, coins: 12, time: "Today, 9:15 AM", quality: "Great Smile" },
  { id: 2, score: 88, coins: 11, time: "Yesterday, 6:30 PM", quality: "Broad Smile" },
  { id: 3, score: 91, coins: 14, time: "Aug 20, 11:20 AM", quality: "Radiant Smile" },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6">
      <section
        className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-lg sm:p-8"
        aria-label="Daily Check-in Hero"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-primary px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-primary-foreground">
                <Sparkles className="size-3.5" strokeWidth={2.5} />
                Daily Streak: 3 Days
              </span>
              <span className="font-mono text-xs text-muted-foreground font-semibold">
                Grace period active
              </span>
            </div>

            <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Hi, {firstName}!
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Take today&apos;s smile check to maintain your streak, earn bonus coins, and unlock brand gift vouchers in the marketplace.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              asChild
              size="lg"
              className="h-13 w-full sm:w-auto px-6 font-title font-black text-sm uppercase tracking-wider gap-2 shadow-brutal"
            >
              <Link href="/capture">
                <Camera className="size-5" strokeWidth={2.5} />
                <span>Capture Today&apos;s Smile</span>
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-label="Key Stats"
      >
        <article className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-muted-foreground">
              Coin Balance
            </span>
            <div className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary">
              <CoinIcon className="size-5.5 text-black" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-mono text-4xl font-black tabular-nums tracking-tight">
              <UserCoinBalance />
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-1 font-semibold flex items-center gap-1">
              <CoinIcon className="size-3.5" />
              <span>Earned through smile checks</span>
            </p>
          </div>
        </article>

        <article className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-muted-foreground">
              Current Streak
            </span>
            <div className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-secondary">
              <Flame className="size-4.5 text-black" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-mono text-4xl font-black tabular-nums tracking-tight">
              <UserStreak suffix=" Days" />
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-1 font-semibold">
              🔥 1.5x coin multiplier active
            </p>
          </div>
        </article>

        <article className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-muted-foreground">
              Daily Rank
            </span>
            <div className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-accent">
              <Trophy className="size-4.5 text-black" strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-mono text-4xl font-black tabular-nums tracking-tight">
              #9
            </p>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-accent-foreground hover:underline mt-1"
            >
              <span>View Leaderboard</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-5 shadow-brutal">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black font-title tracking-tight flex items-center gap-2">
              <Smile className="size-4.5 text-primary" strokeWidth={2.5} />
              Recent Smiles
            </h2>
            <Link
              href="/capture"
              className="inline-flex items-center border-[length:var(--border-width)] border-black rounded-md bg-primary/10 text-primary px-2.5 py-0.5 font-mono text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors shadow-brutal-xs"
            >
              + New check
            </Link>
          </div>

          <div className="divide-y-[length:var(--border-width)] divide-black/20">
            {recentActivity.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black">
                      Score: {item.score}/100
                    </span>
                    <span className="border border-black rounded-xs bg-muted px-1.5 py-0.2 font-mono text-[10px] font-bold uppercase">
                      {item.quality}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                    {item.time}
                  </p>
                </div>
                <span className="border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground px-2 py-0.5 font-mono text-xs font-black tabular-nums flex items-center gap-1 shadow-brutal-xs">
                  <span>+{item.coins}</span>
                  <CoinIcon className="size-3.5" />
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="border-[length:var(--border-width)] border-black rounded-xl bg-primary/20 p-5 shadow-brutal flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="border-[length:var(--border-width)] border-black rounded-md bg-card px-2 py-0.5 font-mono text-[10px] font-black uppercase shadow-brutal-xs">
                Referral Bonus
              </span>
              <UserPlus className="size-5 text-black" strokeWidth={2.5} />
            </div>

            <h3 className="mt-3 text-lg font-black font-title tracking-tight">
              Invite Friends, Earn +200 Coins
            </h3>
            <p className="mt-1 text-xs text-muted-foreground font-medium leading-relaxed">
              Share your personal invite link. You get +200 coins and your friend gets +50 coins on their first smile check.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t-[length:var(--border-width)] border-black/20">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full bg-card font-mono text-xs font-black uppercase tracking-wider border-[length:var(--border-width)] border-black rounded-lg shadow-brutal-sm"
            >
              <Link href="/refer" className="gap-2">
                <span>Get Referral Link</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </article>
      </section>
    </main>
  );
}
