import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Coins,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroPreviewCard() {
  return (
    <div className="reveal-in reveal-delay-2 relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="absolute -left-5 -top-5 hidden h-16 w-16 border-[length:var(--border-width)] border-black rounded-lg bg-secondary sm:block" />
      <div className="absolute -bottom-5 -right-5 hidden h-20 w-20 border-[length:var(--border-width)] border-black rounded-lg bg-primary sm:block" />
      <div className="shadow-brutal-lg relative grid min-h-100 grid-cols-2 gap-3 border-[length:var(--border-width)] border-black rounded-2xl bg-accent p-3 sm:min-h-124 sm:gap-4 sm:p-4">
        <div className="col-span-2 flex items-center justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
            <span className="size-3 rounded-xs bg-secondary" /> Smile check
          </div>
          <span className="font-mono text-xs font-bold">LIVE</span>
        </div>
        <div className="relative col-span-2 flex min-h-56 items-center justify-center overflow-hidden border-[length:var(--border-width)] border-black rounded-lg bg-black sm:min-h-64">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/hero-preview-poster.webp"
            className="h-full w-full object-cover"
          >
            <source src="/hero-preview.webm" type="video/webm" />
            <source src="/hero-preview.mp4" type="video/mp4" />
          </video>
          <div className="absolute left-3 top-3 flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-xs bg-secondary/90 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase text-secondary-foreground shadow-brutal-xs backdrop-blur-xs">
            <span className="size-2 animate-pulse rounded-full bg-red-600" />
            AI Scanner
          </div>
        </div>
        <div className="flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card p-4 sm:p-5">
          <span className="font-mono text-xs font-bold tracking-wider uppercase">Today&apos;s score</span>
          <span className="font-display text-5xl font-black tracking-[-0.08em] tabular-nums sm:text-6xl">100</span>
          <span className="text-sm font-bold">Strong smile energy</span>
        </div>
        <div className="flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-lg bg-secondary p-4 text-secondary-foreground sm:p-5">
          <Coins className="size-8" />
          <div>
            <span className="block font-mono text-3xl font-black tabular-nums">+12</span>
            <span className="text-sm font-bold">coins earned</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="reveal-in inline-flex border-[length:var(--border-width)] border-black rounded-md bg-secondary px-3 py-1 text-xs font-extrabold tracking-[0.12em] text-secondary-foreground uppercase">
          The beta is getting happier
        </p>
        <h1 className="font-display reveal-in reveal-delay-1 mt-5 max-w-[10ch] text-5xl font-black tracking-[-0.07em] sm:text-6xl lg:text-[clamp(4rem,6.2vw,6.4rem)] lg:leading-[0.88]">
          smile more. win more.
        </h1>
        <p className="reveal-in reveal-delay-2 mt-6 max-w-[55ch] text-lg leading-8 text-muted-foreground sm:text-xl">
          Open Smile turns a genuine grin into a tiny daily win: a private, on-device smile score, coins, streaks, and rewards worth showing up for.
        </p>
        <div className="reveal-in reveal-delay-3 mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/try">
              Start smiling
              <ArrowUpRight className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#how-it-works">
              How it works
              <ArrowDown className="size-5" />
            </a>
          </Button>
        </div>
        <div className="reveal-in reveal-delay-3 mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-accent" /> Privacy-first by design
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="size-5 text-secondary" /> No doomscrolling required
          </span>
        </div>
      </div>

      <HeroPreviewCard />
    </section>
  );
}

export default Hero;
