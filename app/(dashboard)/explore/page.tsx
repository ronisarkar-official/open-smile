import type { Metadata } from "next";
import {
  Camera,
  Heart,
  MessageCircle,
  ScanFace,
  Smile,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Explore",
  description: "See what's making people smile — a public opt-in feed of smiles.",
};

const filters = ["Latest", "Top scored", "Most liked"];

const posts = [
  { id: 1, user: "Aria Chen", avatar: "AC", score: 92, likes: 14, timeAgo: "2m ago", bg: "bg-primary" },
  { id: 2, user: "Marcus Webb", avatar: "MW", score: 88, likes: 23, timeAgo: "8m ago", bg: "bg-accent" },
  { id: 3, user: "Priya Sharma", avatar: "PS", score: 95, likes: 31, timeAgo: "15m ago", bg: "bg-secondary" },
  { id: 4, user: "Kai Nakamura", avatar: "KN", score: 76, likes: 7, timeAgo: "22m ago", bg: "bg-success" },
  { id: 5, user: "Elena Rodriguez", avatar: "ER", score: 84, likes: 18, timeAgo: "34m ago", bg: "bg-primary" },
  { id: 6, user: "Jasper Liu", avatar: "JL", score: 91, likes: 12, timeAgo: "1h ago", bg: "bg-accent" },
];

export default function ExplorePage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Community</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Explore</h1>
          <p className="mt-3 max-w-[50ch] text-base leading-7 text-muted-foreground">
            See what&apos;s making people smile. Every post is opt-in, every image expires in 24h.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((filter, i) => (
          <button
            key={filter}
            type="button"
            className={`border-[3px] border-black px-4 py-2 font-mono text-xs font-bold tracking-wider uppercase transition-all ${
              i === 0
                ? "bg-primary shadow-[3px_3px_0_#000]"
                : "bg-card shadow-[3px_3px_0_#000] hover:bg-muted"
            } brutal-lift`}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3" aria-label="Smile feed">
        {posts.map((post) => (
          <article
            key={post.id}
            className="brutal-surface brutal-lift mb-5 break-inside-avoid bg-card"
          >
            <div className={`${post.bg} relative flex aspect-[4/3] items-center justify-center`}>
              <div className="absolute left-3 top-3 flex items-center gap-1.5 border-[2px] border-black bg-card px-2 py-1">
                <ScanFace className="size-3.5" strokeWidth={2.5} />
                <span className="font-mono text-[10px] font-bold tabular-nums">{post.score}</span>
              </div>
              <Smile className="size-20 opacity-30" strokeWidth={1.5} />
            </div>
            <div className="border-t-[3px] border-black p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8 border-[2px] border-black">
                    <AvatarFallback className="text-xs font-bold">{post.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold">{post.user}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{post.timeAgo}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 border-[2px] border-black bg-card px-2.5 py-1.5 font-mono text-xs font-bold transition-all hover:-translate-y-0.5 hover:bg-secondary hover:shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none"
                >
                  <Heart className="size-3.5" strokeWidth={2.5} />
                  <span className="tabular-nums">{post.likes}</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="fixed bottom-20 right-5 z-40 md:bottom-6 md:right-6">
        <Button size="lg" className="gap-2 shadow-[8px_8px_0_#000]">
          <Camera className="size-5" />
          Post your smile
        </Button>
      </div>

      <section className="mt-4 border-[3px] border-dashed border-black bg-muted p-8 text-center">
        <Sparkles className="mx-auto size-10 text-primary" strokeWidth={2} />
        <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">Share the joy</h2>
        <p className="mx-auto mt-3 max-w-[40ch] text-sm leading-6 text-muted-foreground">
          Every smile you post earns a small daily coin bonus. Posts and images auto-expire after 24 hours.
        </p>
        <Button className="mt-6 gap-2">
          <Camera className="size-4" />
          Capture a smile first
        </Button>
      </section>
    </main>
  );
}
