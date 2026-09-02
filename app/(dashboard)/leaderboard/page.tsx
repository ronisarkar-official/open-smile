import type { Metadata } from "next";
import { LeaderboardView } from "@/components/dashboard/leaderboard-view";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "See who's smiling the brightest — live rankings based exclusively on AI smile score.",
};

export default function LeaderboardPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping bg-success opacity-75" />
            <span className="relative inline-flex size-2.5 bg-success" />
          </span>
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Live Smile Rankings</p>
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Leaderboard</h1>
        <p className="mt-1 font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Ranked exclusively by verified smile scores (0–100%)
        </p>
      </div>

      <LeaderboardView />
    </main>
  );
}
