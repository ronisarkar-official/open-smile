'use client';

import * as React from "react";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  Coins,
  Flame,
  Heart,
  ScanFace,
  Smile,
  Trophy,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, DEFAULT_AVATAR_URL } from "@/components/ui/avatar";
import { Navbar } from "@/components/navbar";

interface UserProfileData {
  id: string;
  name: string;
  username: string;
  image?: string;
  avatar: string;
  joinDate: string;
  totalSmiles: number;
  bestScore: number;
  coins: number;
  streak: number;
  rank: number;
  publicSmiles: Array<{
    id: string;
    score: number;
    likes: number;
    timeAgo: string;
    bg: string;
  }>;
}

const defaultProfile: UserProfileData = {
  id: "user-1",
  name: "Smiler",
  username: "smiler",
  avatar: "OS",
  image: DEFAULT_AVATAR_URL,
  joinDate: "August 2026",
  totalSmiles: 0,
  bestScore: 0,
  coins: 0,
  streak: 0,
  rank: 1,
  publicSmiles: [],
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = typeof params?.username === "string" ? params.username : "smiler";
  const [profile, setProfile] = React.useState<UserProfileData>(defaultProfile);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setProfile((prev) => ({
            ...prev,
            name: username,
            username: username,
            image: DEFAULT_AVATAR_URL,
            avatar: username.slice(0, 2).toUpperCase(),
          }));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    if (username) {
      loadProfile();
    }
  }, [username]);

  const statCards = [
    { label: "Total coins", value: profile.coins.toLocaleString(), icon: Coins, color: "bg-primary" },
    { label: "Best score", value: profile.bestScore.toString(), icon: ScanFace, color: "bg-accent" },
    { label: "Leaderboard rank", value: `#${profile.rank}`, icon: Trophy, color: "bg-secondary" },
  ];

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="border-b-[length:var(--border-width)] border-black bg-card">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12 lg:py-16">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <Avatar className="size-28 border-[length:var(--border-width)] border-black shadow-brutal-lg sm:size-32">
                  <AvatarImage src={profile.image || DEFAULT_AVATAR_URL} alt={profile.name} />
                  <AvatarFallback className="bg-primary text-3xl font-black sm:text-4xl">
                    {profile.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 border-[length:var(--border-width)] border-black rounded-md bg-secondary px-2 py-1 font-mono text-[10px] font-bold">
                  <Flame className="size-3" strokeWidth={3} />
                  {profile.streak}
                </div>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-black tracking-[-0.06em] sm:text-5xl">{profile.name}</h1>
              <p className="mt-1 font-mono text-sm font-bold text-muted-foreground">@{profile.username}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-muted-foreground lg:justify-start">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  Joined {profile.joinDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Smile className="size-4" />
                  {profile.totalSmiles} smiles
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="size-4" />
                  {profile.streak} day streak
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
            <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">{profile.publicSmiles.length} posts</span>
          </div>

          {profile.publicSmiles.length === 0 ? (
            <div className="mt-8 border-[length:var(--border-width)] border-black rounded-xl bg-card p-8 text-center shadow-brutal">
              <Smile className="mx-auto size-12 opacity-30" strokeWidth={1.5} />
              <p className="mt-3 font-title text-lg font-black">No public smiles shared yet</p>
              <p className="mt-1 text-xs text-muted-foreground">This user has not opted into sharing public smile posts.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {profile.publicSmiles.map((post) => (
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
          )}
        </section>
      </main>
      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-semibold">© 2026 Open Smile</p>
        <p className="text-muted-foreground">A brighter little habit, built with privacy in mind.</p>
      </footer>
    </>
  );
}
