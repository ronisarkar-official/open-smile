"use client";

import { Flame, ShieldCheck, Scale, Database } from "lucide-react";

const pillars = [
  {
    icon: Flame,
    title: "Habit Loops Through Joy",
    badge: "Pillar 01",
    badgeColor: "bg-primary text-primary-foreground",
    description:
      "Consistent habits require intrinsic celebration. We pair tactile scratch card reveals, haptic sound feedback, and multiplier streaks to make smiling a highlight of your daily routine.",
    highlight: "Daily streaks + Scratch card surprises",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by Architecture",
    badge: "Pillar 02",
    badgeColor: "bg-secondary text-secondary-foreground",
    description:
      "Your face is your identity, not our training dataset. Camera frames are processed locally inside WebAssembly on your device and are never streamed, stored, or indexed remotely.",
    highlight: "Zero raw video upload · 100% local WASM",
  },
  {
    icon: Scale,
    title: "Anti-Cheat Fairness",
    badge: "Pillar 03",
    badgeColor: "bg-accent text-accent-foreground",
    description:
      "A reward pool only works when genuine participants win. Our multi-layer liveness detector checks eye blinks, micro-movements, and perceptual image hashes to prevent bots and printed photo attacks.",
    highlight: "Liveness verification + pHash protection",
  },
  {
    icon: Database,
    title: "Append-Only Economy",
    badge: "Pillar 04",
    badgeColor: "bg-[#181829] text-white dark:bg-card dark:text-foreground",
    description:
      "Balances are never stored as mutable numbers. Every coin earned or spent is an immutable, auditable insert in our Postgres ledger, preventing balance manipulation and race conditions.",
    highlight: "Strict SUM(coins) auditable ledger",
  },
];

export function AboutPillars() {
  return (
    <section className="border-b-[length:var(--border-width)] border-black bg-background py-16 sm:py-24 dark:border-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="border-[length:var(--border-width)] border-black rounded-md bg-accent px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-brutal-xs dark:border-white">
            Our Foundations
          </span>
          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl text-balance">
            Four pillars that guide everything we build.
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-muted-foreground leading-relaxed">
            From the mathematical formulas behind our smile detection to the strict cryptographic rules of our reward ledger.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-2xl bg-card p-6 sm:p-8 shadow-brutal-md transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg dark:border-white"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl border-[length:var(--border-width)] border-black bg-background text-foreground shadow-brutal-xs dark:border-white">
                      <Icon className="size-6 text-primary" />
                    </span>
                    <span
                      className={`border-[length:var(--border-width)] border-black rounded-md px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider uppercase shadow-brutal-xs dark:border-white ${pillar.badgeColor}`}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-2xl font-black text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 border-t-[length:var(--border-width)] border-black/15 pt-4 dark:border-white/15">
                  <span className="font-mono text-xs font-bold text-foreground inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-accent inline-block border border-black dark:border-white" />
                    {pillar.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
