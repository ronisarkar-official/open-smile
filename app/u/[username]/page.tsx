import type { Metadata } from "next";
import {
  CalendarDays,
  Coins,
  Flame,
  Heart,
  ScanFace,
  Smile,
  Trophy,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Roni Sarkar",
  description: "Check out Roni Sarkar's smile profile on Open Smile.",
};

const userProfile = {
  name: "Roni Sarkar",
  username: "ronisarkar",
  joinDate: "August 2026",
  totalSmiles: 42,
  bestScore: 96,
  coins: 1240,
  streak: 7,
  rank: 12,
  avatar: "RS",
};

const publicSmiles = [
  { id: 1, score: 96, likes: 18, timeAgo: "2h ago", bg: "bg-primary" },
  { id: 2, score: 88, likes: 12, timeAgo: "1d ago", bg: "bg-accent" },
  { id: 3, score: 91, likes: 24, timeAgo: "2d ago", bg: "bg-secondary" },
  { id: 4, score: 79, likes: 6, timeAgo: "3d ago", bg: "bg-success" },
];

const statCards = [
  { label: "Total coins", value: userProfile.coins.toLocaleString(), icon: Coins, color: "bg-primary" },
  { label: "Best score", value: userProfile.bestScore.toString(), icon: ScanFace, color: "bg-accent" },
  { label: "Leaderboard rank", value: `#${userProfile.rank}`, icon: Trophy, color: "bg-secondary" },
];

export default function PublicProfilePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="border-b-[length:var(--border-width)] border-black bg-card">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12 lg:py-16">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <Avatar className="size-28 border-[length:var(--border-width)] border-black shadow-brutal-lg sm:size-32">
                  <AvatarFallback className="bg-primary text-3xl font-black sm:text-4xl">
                    {userProfile.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-secondary px-2 py-1 font-mono text-[10px] font-bold">
                  <Flame className="size-3" strokeWidth={3} />
                  {userProfile.streak}
                </div>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">{userProfile.name}</h1>
              <p className="mt-1 font-mono text-sm font-bold text-muted-foreground">@{userProfile.username}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-muted-foreground lg:justify-start">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  Joined {userProfile.joinDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Smile className="size-4" />
                  {userProfile.totalSmiles} smiles
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="size-4" />
                  {userProfile.streak} day streak
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {statCards.map(({ label, value, icon: StatIcon, color }) => (
                  <div key={label} className={`${color} border-[length:var(--border-width)] border-black rounded-lg p-3 shadow-brutal sm:p-4`}>
                    <StatIcon className="size-5" strokeWidth={2.5} />
                    <p className="mt-2 font-mono text-2xl font-black tabular-nums sm:text-3xl">{value}</p>
                    <p className="font-mono text-[9px] font-bold tracking-wider uppercase sm:text-[10px]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Public smiles</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">Shared moments</h2>
            </div>
            <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">{publicSmiles.length} posts</span>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {publicSmiles.map((post) => (
              <article key={post.id} className="brutal-surface brutal-lift bg-card">
                <div className={`${post.bg} relative flex aspect-square items-center justify-center`}>
                  <div className="absolute left-3 top-3 flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-xs bg-card px-2 py-1">
                    <ScanFace className="size-3" strokeWidth={2.5} />
                    <span className="font-mono text-[10px] font-bold tabular-nums">{post.score}</span>
                  </div>
                  <Smile className="size-16 opacity-25" strokeWidth={1.5} />
                </div>
                <div className="flex items-center justify-between border-t-[length:var(--border-width)] border-black p-3">
                  <span className="font-mono text-[10px] font-bold text-muted-foreground">{post.timeAgo}</span>
                  <div className="flex items-center gap-1">
                    <Heart className="size-3.5" strokeWidth={2} />
                    <span className="font-mono text-xs font-bold tabular-nums">{post.likes}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-semibold">© 2026 Open Smile</p>
        <p className="text-muted-foreground">A brighter little habit, built with privacy in mind.</p>
      </footer>
    </>
  );
}
