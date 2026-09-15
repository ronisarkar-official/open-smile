"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, ArrowRight, Smile, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  {
    label: "3D Mesh Points",
    value: "478",
    description: "Evaluated in real-time on your device",
    color: "bg-accent text-accent-foreground",
  },
  {
    label: "On-Device AI",
    value: "100%",
    description: "Raw camera frames never leave your browser",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    label: "Biometric Cloud Delay",
    value: "0 ms",
    description: "Zero latency on-device WASM inference",
    color: "bg-primary text-primary-foreground",
  },
  {
    label: "Media Retention",
    value: "24h Max",
    description: "Strict automated purge via ImageKit lifecycle",
    color: "bg-muted text-foreground",
  },
];

export function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b-[length:var(--border-width)] border-black bg-background py-16 sm:py-24 lg:py-28 dark:border-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-accent px-3 py-1 text-xs font-mono font-bold tracking-wider text-accent-foreground uppercase shadow-brutal-xs dark:border-white">
            <Sparkles className="size-3.5" />
            <span>Who We Are · Open Smile</span>
          </div>

          <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance max-w-5xl leading-[1.08]">
            We believe smiling shouldn't just feel good —{" "}
            <span className="relative inline-block bg-primary px-3 py-0.5 text-primary-foreground rounded-lg border-[length:var(--border-width)] border-black dark:border-white shadow-brutal-sm -rotate-1">
              it should be rewarded.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg sm:text-xl font-medium text-muted-foreground text-pretty leading-relaxed">
            Open Smile turns facial AI into a playful, privacy-first habit engine. By tracking subtle facial geometry directly in your browser, genuine smiles earn coins, daily streaks, and real-world gift cards — with zero cloud biometrics.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="brutal-lift font-bold uppercase tracking-wider">
              <Link href="/try" className="inline-flex items-center gap-2">
                <Smile className="size-5" />
                Test Your Smile
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="brutal-lift font-bold uppercase tracking-wider">
              <a href="#team" className="inline-flex items-center gap-2">
                <Users className="size-5" />
                Meet The 5 Creators
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-md transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg dark:border-white"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  {metric.label}
                </span>
                <span className={`inline-block size-3 rounded-full border border-black dark:border-white ${metric.color}`} />
              </div>
              <div className="mt-3 font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                {metric.value}
              </div>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
