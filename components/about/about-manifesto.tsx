"use client";

import { EyeOff, Lock, Ban, Shield, ShieldCheck, Award } from "lucide-react";

const promises = [
  {
    number: "01",
    icon: EyeOff,
    title: "No Cloud Video",
    tag: "100% On-Device",
    description: "Camera frames are scored directly in browser memory. Raw video never leaves your machine.",
    accent: "bg-primary text-primary-foreground",
  },
  {
    number: "02",
    icon: Lock,
    title: "24h Auto-Purge",
    tag: "Self-Destruct",
    description: "Opt-in public smiles automatically delete after 24 hours. Zero permanent image storage.",
    accent: "bg-secondary text-secondary-foreground",
  },
  {
    number: "03",
    icon: Ban,
    title: "Zero Face Selling",
    tag: "No Harvesting",
    description: "We never monetize your expressions, sell biometric data, or train external AI models.",
    accent: "bg-accent text-accent-foreground",
  },
  {
    number: "04",
    icon: Shield,
    title: "Private by Default",
    tag: "Explicit Consent",
    description: "Your captures stay strictly private to you unless you explicitly choose to share them.",
    accent: "bg-info text-info-foreground",
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "Bot-Proof Fairness",
    tag: "Anti-Cheat AI",
    description: "Real-time liveness checks and perceptual hashing ensure only genuine human smiles earn coins.",
    accent: "bg-success text-success-foreground",
  },
  {
    number: "06",
    icon: Award,
    title: "Auditable Coins",
    tag: "Real Rewards",
    description: "Every coin earned is logged to an immutable ledger and backed by genuine gift vouchers.",
    accent: "bg-warning text-warning-foreground",
  },
];

export function AboutManifesto() {
  return (
    <section className="border-b-[length:var(--border-width)] border-black bg-background py-14 sm:py-20 dark:border-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="border-[length:var(--border-width)] border-black rounded-md bg-destructive px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-destructive-foreground shadow-brutal-xs dark:border-white">
            Our Manifesto
          </span>
          <h2 className="mt-3 font-heading text-2xl font-black tracking-tight text-foreground sm:text-4xl text-balance">
            Six promises. Zero fine print.
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-muted-foreground text-pretty">
            Built-in privacy and fairness you can trust without reading a 20-page document.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promises.map((p) => {
            const Icon = p.icon;

            return (
              <div
                key={p.number}
                className="group flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-2xl bg-card p-5 shadow-brutal-sm brutal-lift dark:border-white"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl border-[length:var(--border-width)] border-black bg-muted text-foreground shadow-brutal-xs dark:border-white group-hover:bg-foreground group-hover:text-background transition-colors duration-200">
                      <Icon className="size-5" />
                    </span>
                    <span className={`border-[length:var(--border-width)] border-black rounded px-2 py-0.5 font-mono text-[10px] font-black uppercase shadow-brutal-xs dark:border-white ${p.accent}`}>
                      {p.tag}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-muted-foreground">
                      {p.number}
                    </span>
                    <h3 className="font-heading text-lg font-black text-foreground">
                      {p.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 border-t-[length:var(--border-width)] border-border/70 pt-2.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                  <span>Guaranteed</span>
                  <span className="text-foreground font-bold">100% Enforced</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
