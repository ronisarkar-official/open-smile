"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Bell } from "lucide-react";
import {
  SohanIllustration,
  AyushiIllustration,
  RoniIllustration,
  AkashIllustration,
} from "./illustrations";

const SMILE_CURVE_BARS = [40, 72, 54, 96, 64, 92, 48, 74, 62, 88, 56, 80];

const PRIVACY_STACK = [
  { label: "Landmarks", count: 12 },
  { label: "Liveness", count: 12 },
  { label: "Anti-Cheat", count: 12 },
];

function WorldDottedMap() {
  return (
    <svg
      viewBox="0 0 800 360"
      className="absolute inset-0 h-full w-full object-cover opacity-25 dark:opacity-35 select-none pointer-events-none"
      fill="currentColor"
    >
      <g className="text-muted-foreground">
        <circle cx="100" cy="80" r="2.5" />
        <circle cx="120" cy="75" r="2.5" />
        <circle cx="140" cy="70" r="2.5" />
        <circle cx="160" cy="65" r="2.5" />
        <circle cx="180" cy="70" r="2.5" />
        <circle cx="110" cy="95" r="2.5" />
        <circle cx="130" cy="90" r="2.5" />
        <circle cx="150" cy="85" r="2.5" />
        <circle cx="170" cy="85" r="2.5" />
        <circle cx="190" cy="90" r="2.5" />
        <circle cx="210" cy="95" r="2.5" />
        <circle cx="120" cy="115" r="2.5" />
        <circle cx="140" cy="110" r="2.5" />
        <circle cx="160" cy="105" r="2.5" />
        <circle cx="180" cy="105" r="2.5" />
        <circle cx="200" cy="110" r="2.5" />
        <circle cx="220" cy="115" r="2.5" />
        <circle cx="140" cy="130" r="2.5" />
        <circle cx="160" cy="125" r="2.5" />
        <circle cx="180" cy="125" r="2.5" />
        <circle cx="200" cy="130" r="2.5" />
        <circle cx="170" cy="145" r="2.5" />
        <circle cx="190" cy="145" r="2.5" />
        <circle cx="210" cy="150" r="2.5" />
        <circle cx="180" cy="165" r="2.5" />
        <circle cx="200" cy="165" r="2.5" />

        <circle cx="220" cy="180" r="2.5" />
        <circle cx="230" cy="195" r="2.5" />
        <circle cx="240" cy="210" r="2.5" />
        <circle cx="250" cy="225" r="2.5" />
        <circle cx="260" cy="240" r="2.5" />
        <circle cx="270" cy="255" r="2.5" />
        <circle cx="280" cy="240" r="2.5" />
        <circle cx="290" cy="255" r="2.5" />
        <circle cx="300" cy="270" r="2.5" />
        <circle cx="280" cy="285" r="2.5" />
        <circle cx="270" cy="300" r="2.5" />
        <circle cx="260" cy="315" r="2.5" />

        <circle cx="410" cy="70" r="2.5" />
        <circle cx="430" cy="65" r="2.5" />
        <circle cx="450" cy="70" r="2.5" />
        <circle cx="420" cy="85" r="2.5" />
        <circle cx="440" cy="85" r="2.5" />
        <circle cx="460" cy="85" r="2.5" />
        <circle cx="480" cy="90" r="2.5" />
        <circle cx="430" cy="105" r="2.5" />
        <circle cx="450" cy="105" r="2.5" />
        <circle cx="470" cy="105" r="2.5" />
        <circle cx="490" cy="110" r="2.5" />
        <circle cx="510" cy="115" r="2.5" />
        <circle cx="440" cy="125" r="2.5" />
        <circle cx="460" cy="125" r="2.5" />
        <circle cx="480" cy="125" r="2.5" />
        <circle cx="500" cy="130" r="2.5" />

        <circle cx="430" cy="150" r="2.5" />
        <circle cx="450" cy="150" r="2.5" />
        <circle cx="470" cy="150" r="2.5" />
        <circle cx="490" cy="155" r="2.5" />
        <circle cx="440" cy="170" r="2.5" />
        <circle cx="460" cy="170" r="2.5" />
        <circle cx="480" cy="170" r="2.5" />
        <circle cx="500" cy="175" r="2.5" />
        <circle cx="520" cy="180" r="2.5" />
        <circle cx="450" cy="190" r="2.5" />
        <circle cx="470" cy="190" r="2.5" />
        <circle cx="490" cy="195" r="2.5" />
        <circle cx="510" cy="200" r="2.5" />
        <circle cx="460" cy="210" r="2.5" />
        <circle cx="480" cy="210" r="2.5" />
        <circle cx="500" cy="215" r="2.5" />
        <circle cx="470" cy="230" r="2.5" />
        <circle cx="490" cy="230" r="2.5" />
        <circle cx="480" cy="250" r="2.5" />
        <circle cx="490" cy="265" r="2.5" />

        <circle cx="530" cy="75" r="2.5" />
        <circle cx="550" cy="70" r="2.5" />
        <circle cx="570" cy="75" r="2.5" />
        <circle cx="590" cy="80" r="2.5" />
        <circle cx="610" cy="85" r="2.5" />
        <circle cx="630" cy="90" r="2.5" />
        <circle cx="650" cy="95" r="2.5" />
        <circle cx="540" cy="95" r="2.5" />
        <circle cx="560" cy="95" r="2.5" />
        <circle cx="580" cy="100" r="2.5" />
        <circle cx="600" cy="105" r="2.5" />
        <circle cx="620" cy="110" r="2.5" />
        <circle cx="640" cy="115" r="2.5" />
        <circle cx="660" cy="120" r="2.5" />
        <circle cx="680" cy="125" r="2.5" />
        <circle cx="550" cy="120" r="2.5" />
        <circle cx="570" cy="125" r="2.5" />
        <circle cx="590" cy="130" r="2.5" />
        <circle cx="610" cy="135" r="2.5" />
        <circle cx="630" cy="140" r="2.5" />
        <circle cx="650" cy="145" r="2.5" />
        <circle cx="670" cy="150" r="2.5" />
        <circle cx="690" cy="155" r="2.5" />
        <circle cx="560" cy="145" r="2.5" />
        <circle cx="580" cy="150" r="2.5" />
        <circle cx="600" cy="160" r="2.5" />
        <circle cx="620" cy="165" r="2.5" />
        <circle cx="640" cy="170" r="2.5" />
        <circle cx="660" cy="175" r="2.5" />
        <circle cx="680" cy="180" r="2.5" />
        <circle cx="570" cy="175" r="2.5" />
        <circle cx="590" cy="185" r="2.5" />
        <circle cx="610" cy="195" r="2.5" />
        <circle cx="630" cy="200" r="2.5" />
        <circle cx="650" cy="205" r="2.5" />
        <circle cx="670" cy="210" r="2.5" />
        <circle cx="690" cy="215" r="2.5" />
        <circle cx="710" cy="220" r="2.5" />

        <circle cx="680" cy="260" r="2.5" />
        <circle cx="700" cy="255" r="2.5" />
        <circle cx="720" cy="260" r="2.5" />
        <circle cx="690" cy="275" r="2.5" />
        <circle cx="710" cy="275" r="2.5" />
        <circle cx="730" cy="280" r="2.5" />
        <circle cx="700" cy="295" r="2.5" />
        <circle cx="720" cy="295" r="2.5" />
        <circle cx="740" cy="300" r="2.5" />
      </g>
    </svg>
  );
}

function AvatarPin({ illustration }: { illustration: React.ReactNode }) {
  return (
    <div className="group/avatar relative flex items-center justify-center">
      <div className="relative size-10 sm:size-11 overflow-hidden border-[length:var(--border-width)] border-black rounded-full bg-card shadow-brutal-xs transition-transform duration-200 group-hover/avatar:scale-110 dark:border-border">
        {illustration}
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-black bg-accent" />
    </div>
  );
}

export function WhyItsDifferentBento() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
        <div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-accent px-3 py-1 font-mono text-xs font-black tracking-widest text-accent-foreground uppercase shadow-brutal-xs dark:border-border mb-3">
          <span>Engineered Different</span>
        </div>
        <h2 className="font-title text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Why this isn&apos;t just another AI gimmick
        </h2>
        <p className="mt-3 font-semibold text-muted-foreground">
          Real scoring, real fairness, real privacy — not just a webcam trick.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 sm:gap-5">
        {/* Card 1: Top-Left (Wide: 7 cols) - Real-Time Smile AI Scoring */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card p-6 sm:p-7 shadow-brutal transition-all hover:shadow-brutal-lg dark:border-border dark:bg-card lg:col-span-7 min-h-[360px] sm:min-h-[380px]"
        >
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              LIVE SMILE ANALYSIS
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl tabular-nums">
                98.4%
              </span>
              <span className="font-mono text-xs font-bold text-success uppercase">
                Authentic
              </span>
            </div>
          </div>

          <div className="my-6 flex h-28 sm:h-32 items-end gap-2 sm:gap-2.5 px-1">
            {SMILE_CURVE_BARS.map((height, i) => (
              <div
                key={`bar-${i}`}
                style={{ height: `${height}%` }}
                className="flex-1 border-[length:var(--border-width)] border-black rounded-xs bg-accent transition-all duration-200 hover:brightness-105 dark:border-border"
              />
            ))}
          </div>

          <div>
            <h3 className="font-title text-xl font-black text-foreground sm:text-2xl">
              Real-Time Landmark Scoring
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground max-w-lg">
              Computer vision evaluates mouth curvature, eye crinkle, and cheek elevation in milliseconds directly in your browser. Not just &quot;smiling: yes or no.&quot;
            </p>
          </div>
        </motion.div>

        {/* Card 2: Top-Right (Narrow: 5 cols) - Privacy & On-Device Security */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card p-6 sm:p-7 shadow-brutal transition-all hover:shadow-brutal-lg dark:border-border dark:bg-card lg:col-span-5 min-h-[360px] sm:min-h-[380px]"
        >
          <div>
            <h3 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl tabular-nums">
              100% On-Device
            </h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Zero biometric retention. Raw camera frames never leave your device.
            </p>
          </div>

          <div className="my-6">
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>LOCAL PRIVACY STACK</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-success">
                <span className="size-2 rounded-full bg-success animate-pulse" />
                CLIENT ONLY
              </span>
            </div>

            <div className="space-y-3">
              {PRIVACY_STACK.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-foreground/80 w-24 shrink-0">
                    {row.label}
                  </span>
                  <div className="flex flex-1 items-center gap-1">
                    {Array.from({ length: row.count }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-3 flex-1 border-[length:var(--border-width)] border-black/40 rounded-xs bg-secondary transition-all hover:opacity-100 dark:border-border/60"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="font-mono text-xs font-semibold text-muted-foreground">
            All neural models execute client-side via WebAssembly.
          </p>
        </motion.div>

        {/* Card 3: Bottom-Left (Narrow: 5 cols) - Streak Multipliers & Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card p-6 sm:p-7 shadow-brutal transition-all hover:shadow-brutal-lg dark:border-border dark:bg-card lg:col-span-5 min-h-[340px] sm:min-h-[360px]"
        >
          <div className="flex flex-1 items-center justify-start py-6">
            <div className="flex size-14 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-secondary text-secondary-foreground shadow-brutal-xs dark:border-border">
              <Bell className="size-6 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <h3 className="font-title text-xl font-black text-foreground sm:text-2xl">
              Smart Streak Alerts
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              Get timely notifications before your 24-hour streak resets so you never drop your coin multiplier or leaderboard rank.
            </p>
          </div>
        </motion.div>

        {/* Card 4: Bottom-Right (Wide: 7 cols) - Global Smiler Community */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col justify-between overflow-hidden border-[length:var(--border-width)] border-black rounded-lg bg-card p-6 sm:p-8 shadow-brutal transition-all hover:shadow-brutal-lg dark:border-border dark:bg-card lg:col-span-7 min-h-[340px] sm:min-h-[360px]"
        >
          <div className="relative z-10 max-w-md ml-auto text-right">
            <h3 className="font-title text-xl font-black text-foreground sm:text-2xl">
              Global Smiler Community
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              Join active smilers across 35+ regions competing daily on live leaderboards, climbing tiers, and redeeming vouchers.
            </p>
          </div>

          <div className="relative mt-6 h-48 w-full overflow-hidden">
            <WorldDottedMap />

            <div className="absolute left-[24%] top-[35%] -translate-x-1/2 -translate-y-1/2 z-10">
              <AvatarPin illustration={<SohanIllustration className="h-full w-full object-cover scale-150 translate-y-1" />} />
            </div>

            <div className="absolute left-[48%] top-[65%] -translate-x-1/2 -translate-y-1/2 z-10">
              <AvatarPin illustration={<AyushiIllustration className="h-full w-full object-cover scale-150 translate-y-1" />} />
            </div>

            <div className="absolute left-[72%] top-[30%] -translate-x-1/2 -translate-y-1/2 z-10">
              <AvatarPin illustration={<AkashIllustration className="h-full w-full object-cover scale-150 translate-y-1" />} />
            </div>

            <div className="absolute left-[88%] top-[58%] -translate-x-1/2 -translate-y-1/2 z-10">
              <AvatarPin illustration={<RoniIllustration className="h-full w-full object-cover scale-150 translate-y-1" />} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyItsDifferentBento;
