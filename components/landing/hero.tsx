import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Coins,
  Flame,
  Lock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroPreviewCard() {
  return (
    <div className="reveal-in reveal-delay-2 relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-linear-to-tr from-primary/30 via-secondary/25 to-accent/30 blur-2xl opacity-75 sm:-inset-4 dark:opacity-50" />

      <div className="brutal-surface relative overflow-hidden bg-card p-2 sm:p-3">
        <div className="mb-2.5 flex items-center justify-between px-2 pt-1 font-mono text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            <span className="tracking-wider uppercase">On-Device Vision</span>
          </div>
          <span className="rounded-md border-(length:--border-width) border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground uppercase">
            60 FPS • Private
          </span>
        </div>

        <div className="relative aspect-4/3 w-full overflow-hidden rounded-md border-(length:--border-width) border-border bg-black">
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

          <div className="pointer-events-none absolute inset-4 border border-white/20">
            <div className="absolute -left-1 -top-1 size-3 border-l-2 border-t-2 border-white" />
            <div className="absolute -right-1 -top-1 size-3 border-r-2 border-t-2 border-white" />
            <div className="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-white" />
            <div className="absolute -bottom-1 -right-1 size-3 border-b-2 border-r-2 border-white" />
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2.5 rounded-md border-(length:--border-width) border-border bg-card/95 px-3 py-2 shadow-brutal-xs backdrop-blur-md">
            <div className="flex size-8 items-center justify-center rounded-sm bg-accent text-accent-foreground font-mono text-xs font-black">
              100
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Smile Score</span>
              <span className="text-xs font-black">Genuine Grin</span>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md border-(length:--border-width) border-border bg-secondary px-3 py-2 text-secondary-foreground shadow-brutal-xs">
            <Coins className="size-4" />
            <span className="font-mono text-xs font-black tabular-nums">+15 Coins</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-md border-(length:--border-width) border-border bg-card px-3 py-2 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-foreground">
            <Flame className="size-4 text-primary" />
            <span>5-Day Smile Streak</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">1.5x Multiplier</span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.06] dark:opacity-[0.12] mask-[radial-gradient(ellipse_75%_65%_at_50%_40%,#000_50%,transparent_100%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--outline) 1px, transparent 1px),
            linear-gradient(to bottom, var(--outline) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="max-w-2xl">
         

          <h1 className="font-display reveal-in reveal-delay-1 mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Smile more. <br />
            <span className="bg-linear-to-r from-primary via-[#9B51E0] to-secondary bg-clip-text text-transparent">
              Win real rewards.
            </span>
          </h1>

          <p className="reveal-in reveal-delay-2 mt-5 max-w-[50ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            Turn a genuine daily grin into instant coins, unlock streak multipliers, and cash out for real gift cards. 100% on-device AI — your camera feed never leaves your phone or browser.
          </p>

          <div className="reveal-in reveal-delay-3 mt-8 flex flex-wrap items-center gap-3.5">
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

          <div className="reveal-in reveal-delay-3 mt-10 flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border-(length:--border-width) border-border bg-card px-2.5 py-1 text-xs font-bold text-muted-foreground shadow-brutal-xs">
              <Lock className="size-3.5 text-foreground" /> 100% On-device AI
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border-(length:--border-width) border-border bg-card px-2.5 py-1 text-xs font-bold text-muted-foreground shadow-brutal-xs">
              <Zap className="size-3.5 text-foreground" /> Instant coin payouts
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border-(length:--border-width) border-border bg-card px-2.5 py-1 text-xs font-bold text-muted-foreground shadow-brutal-xs">
              <Coins className="size-3.5 text-foreground" /> Amazon gift vouchers
            </span>
          </div>
        </div>

        <HeroPreviewCard />
      </div>
    </section>
  );
}

export default Hero;
