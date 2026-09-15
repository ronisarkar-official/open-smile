"use client";

import Link from "next/link";
import { Smile, UserPlus, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutCta() {
  return (
    <section className="border-b-[length:var(--border-width)] border-black bg-accent py-16 sm:py-24 text-accent-foreground dark:border-white">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-black px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-brutal-xs">
          <Sparkles className="size-3.5 text-accent" />
          <span>Join The Movement</span>
        </div>

        <h2 className="mt-6 font-display text-4xl sm:text-6xl font-black tracking-tight text-black text-balance">
          Ready to turn smiles into real rewards?
        </h2>

        <p className="mt-4 mx-auto max-w-2xl text-base sm:text-lg font-semibold text-black/85 leading-relaxed">
          Zero downloads required. Experience our on-device facial AI directly inside your browser right now — and see how genuine your grin really is.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="brutal-lift border-[length:var(--border-width)] border-black bg-primary text-primary-foreground font-bold uppercase tracking-wider shadow-brutal-md hover:bg-primary/90">
            <Link href="/try" className="inline-flex items-center gap-2">
              <Smile className="size-5" />
              Try Smile Check Free
            </Link>
          </Button>
          <Button asChild size="lg" className="brutal-lift border-[length:var(--border-width)] border-black bg-white text-black font-bold uppercase tracking-wider shadow-brutal-md hover:bg-neutral-100">
            <Link href="/signup" className="inline-flex items-center gap-2">
              <UserPlus className="size-5" />
              Start A Streak
            </Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold uppercase text-black/75">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-black inline-block" />
            100% On-Device AI
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-black inline-block" />
            Instant Scratch Card
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-black inline-block" />
            Amazon & Partner Vouchers
          </span>
        </div>
      </div>
    </section>
  );
}
