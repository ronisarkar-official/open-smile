"use client";

import { AlertCircle, Flame, HeartHandshake, Eye, Sparkles } from "lucide-react";

export function AboutStory() {
  return (
    <section className="border-b-[length:var(--border-width)] border-black bg-muted/40 py-16 sm:py-24 dark:border-white dark:bg-muted/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="border-[length:var(--border-width)] border-black rounded-md bg-secondary px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-secondary-foreground shadow-brutal-xs dark:border-white">
            Origin & Mission
          </span>
          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl text-balance">
            The antidote to digital doomscrolling.
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-muted-foreground leading-relaxed">
            The modern internet was engineered to capture your attention through anxiety, rage-bait, and endless scrolling. We built Open Smile to do the exact opposite.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-7 border-[length:var(--border-width)] border-black rounded-2xl bg-card p-6 sm:p-8 shadow-brutal-md transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg dark:border-white">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-black bg-destructive text-destructive-foreground dark:border-white shadow-brutal-xs">
                <AlertCircle className="size-5" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                The Problem
              </span>
            </div>
            <h3 className="mt-5 font-heading text-2xl sm:text-3xl font-black text-foreground">
              Screen time makes us involuntarily frown.
            </h3>
            <p className="mt-3 text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
              Research consistently shows that prolonged exposure to high-velocity social feeds tightens facial corrugator muscles, triggering involuntary micro-frowns and elevated cortisol. When software only incentivizes passive consumption, users leave feeling drained rather than energized.
            </p>
            <div className="mt-6 border-[length:var(--border-width)] border-black rounded-xl bg-background p-4 dark:border-white">
              <p className="font-mono text-xs font-bold text-foreground">
                <span className="text-primary font-black">4.8 HOURS</span> — Average daily mobile screen time spent in passive, emotionally neutral or negative states.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 border-[length:var(--border-width)] border-black rounded-2xl bg-accent p-6 sm:p-8 shadow-brutal-md text-accent-foreground transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg dark:border-white">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-black bg-black text-white dark:border-white shadow-brutal-xs">
                <Sparkles className="size-5" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                The Science
              </span>
            </div>
            <h3 className="mt-5 font-heading text-2xl sm:text-3xl font-black text-black">
              Facial feedback is bi-directional.
            </h3>
            <p className="mt-3 text-sm sm:text-base font-semibold text-black/85 leading-relaxed">
              When you smile genuinely (activating both zygomatic major and orbicularis oculi muscles), your brain releases dopamine, endorphins, and serotonin. It works even when prompted — your body tells your mind that you are safe and happy.
            </p>
          </div>

          <div className="md:col-span-5 border-[length:var(--border-width)] border-black rounded-2xl bg-secondary p-6 sm:p-8 shadow-brutal-md text-secondary-foreground transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg dark:border-white">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-black bg-white text-black dark:border-white shadow-brutal-xs">
                <Flame className="size-5" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                The Mechanism
              </span>
            </div>
            <h3 className="mt-5 font-heading text-2xl sm:text-3xl font-black text-white">
              Habits stick when they're playful.
            </h3>
            <p className="mt-3 text-sm sm:text-base font-semibold text-white/90 leading-relaxed">
              Borrowing proven game loops from Duolingo, we combined consecutive streak counts, scratch card sound design, and multiplier bonuses. Smiling becomes an addictive daily micro-ritual.
            </p>
          </div>

          <div className="md:col-span-7 border-[length:var(--border-width)] border-black rounded-2xl bg-card p-6 sm:p-8 shadow-brutal-md transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg dark:border-white">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border-[length:var(--border-width)] border-black bg-primary text-primary-foreground dark:border-white shadow-brutal-xs">
                <HeartHandshake className="size-5" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Our Mission
              </span>
            </div>
            <h3 className="mt-5 font-heading text-2xl sm:text-3xl font-black text-foreground">
              To turn 1,000,000 screen minutes into shared joy.
            </h3>
            <p className="mt-3 text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
              We want people to pause once a day, look into their screen, and radiate genuine energy. No filters, no beauty scores, no biometric surveillance — just pure smile verification that converts your expression into real vouchers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
