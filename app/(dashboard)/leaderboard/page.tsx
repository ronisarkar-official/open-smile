import type { Metadata } from "next";
import {
  Crown,
  Medal,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCoinBalance } from "@/components/icons";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "See who's smiling the brightest — daily, weekly, and monthly rankings.",
};

const podium = [
  { rank: 2, name: "Aria Chen", score: 1840, avatar: "AC", streak: 12 },
  { rank: 1, name: "Marcus Webb", score: 2350, avatar: "MW", streak: 24 },
  { rank: 3, name: "Priya Sharma", score: 1620, avatar: "PS", streak: 8 },
];

const rankings = [
  { rank: 4, name: "Kai Nakamura", score: 1480, avatar: "KN" },
  { rank: 5, name: "Elena Rodriguez", score: 1320, avatar: "ER" },
  { rank: 6, name: "Jasper Liu", score: 1150, avatar: "JL" },
  { rank: 7, name: "Zara Okonkwo", score: 1020, avatar: "ZO" },
  { rank: 8, name: "Leo Petrov", score: 890, avatar: "LP" },
  { rank: 9, name: "You", score: 247, avatar: "RS", isCurrentUser: true },
  { rank: 10, name: "Mia Tanaka", score: 210, avatar: "MT" },
];

const periods = ["Daily", "Weekly", "Monthly"];

const podiumConfig: Record<number, { order: string; height: string; bg: string; shadow: string; badge: typeof Crown }> = {
  1: { order: "order-2", height: "min-h-72 sm:min-h-80", bg: "bg-primary", shadow: "shadow-brutal-xl", badge: Crown },
  2: { order: "order-1", height: "min-h-56 sm:min-h-64 mt-auto", bg: "bg-accent", shadow: "shadow-brutal", badge: Medal },
  3: { order: "order-3", height: "min-h-48 sm:min-h-56 mt-auto", bg: "bg-secondary", shadow: "shadow-brutal", badge: Medal },
};

export default function LeaderboardPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping bg-success opacity-75" />
              <span className="relative inline-flex size-2.5 bg-success" />
            </span>
            <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Live rankings</p>
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Leaderboard</h1>
        </div>
        <div className="flex border-[length:var(--border-width)] border-black rounded-lg overflow-hidden bg-card">
          {periods.map((period, i) => (
            <button
              key={period}
              type="button"
              className={`px-4 py-2.5 font-mono text-xs font-bold tracking-wider uppercase transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              } ${i > 0 ? "border-l-[length:var(--border-width)] border-black" : ""}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-10" aria-label="Top 3 smilers">
        <div className="grid grid-cols-3 items-end gap-3 sm:gap-5">
          {podium.map((user) => {
            const config = podiumConfig[user.rank];
            return (
              <article
                key={user.rank}
                className={`${config.order} ${config.height} ${config.bg} flex flex-col items-center justify-end border-[length:var(--border-width)] border-black rounded-xl p-4 sm:p-6 ${config.shadow}`}
              >
                <div className="relative">
                  <Avatar className="size-14 border-[length:var(--border-width)] border-black sm:size-16">
                    <AvatarFallback className="bg-card text-lg font-bold sm:text-xl">{user.avatar}</AvatarFallback>
                  </Avatar>
                  {user.rank === 1 && (
                    <div className="absolute -right-2 -top-2 flex size-7 items-center justify-center border-[length:var(--border-width)] border-black rounded-xs bg-primary">
                      <Crown className="size-4" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <p className="mt-3 text-center text-sm font-bold sm:text-base">{user.name}</p>
                <p className="font-display mt-1 text-3xl font-black tracking-[-0.06em] tabular-nums sm:text-4xl">{user.score.toLocaleString()}</p>
                <p className="font-mono text-[10px] font-bold tracking-wider uppercase sm:text-xs">coins</p>
                <div className="mt-3 inline-flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-xs bg-card px-2 py-1 font-mono text-[10px] font-bold">
                  🔥 {user.streak} day streak
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8" aria-label="Full rankings">
        <div className="border-[length:var(--border-width)] border-black rounded-xl overflow-hidden bg-card shadow-brutal">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b-[length:var(--border-width)] border-black bg-muted px-4 py-3 sm:grid-cols-[auto_1fr_auto_auto] sm:px-6">
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">#</span>
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">Smiler</span>
            <span className="hidden font-mono text-[10px] font-bold tracking-widest uppercase sm:block">Rank change</span>
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">Coins</span>
          </div>
          {rankings.map((user) => (
            <div
              key={user.rank}
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-black/10 px-4 py-3 transition-colors sm:grid-cols-[auto_1fr_auto_auto] sm:px-6 ${
                "isCurrentUser" in user && user.isCurrentUser
                  ? "bg-primary/20 border-b-[length:var(--border-width)] border-black/20"
                  : "hover:bg-muted/50"
              }`}
            >
              <span className={`font-mono text-sm font-black tabular-nums ${"isCurrentUser" in user && user.isCurrentUser ? "text-primary-foreground" : ""}`}>
                {String(user.rank).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-3">
                <Avatar className="size-8 border-[length:var(--border-width)] border-black">
                  <AvatarFallback className="text-xs font-bold">{user.avatar}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold">
                  {user.name}
                  {"isCurrentUser" in user && user.isCurrentUser && (
                    <span className="ml-2 inline-flex border-[length:var(--border-width)] border-black rounded-xs bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase">You</span>
                  )}
                </span>
              </div>
              <div className="hidden items-center gap-1 sm:flex">
                <TrendingUp className="size-3.5 text-success" />
                <span className="font-mono text-xs font-bold text-success">+{Math.floor(Math.random() * 5) + 1}</span>
              </div>
              <span className="font-mono text-sm font-black tabular-nums">
                {'isCurrentUser' in user && user.isCurrentUser ? (
                  <UserCoinBalance />
                ) : (
                  user.score.toLocaleString()
                )}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
