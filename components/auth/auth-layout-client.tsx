"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Coins, ScanFace } from "lucide-react";
import { Logo } from "@/components/logo";
import { PageTransition } from "@/components/ui/page-transition";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const highlights = [
  { label: "Smile checks", icon: Camera, color: "bg-primary" },
  { label: "On-device score", icon: ScanFace, color: "bg-accent" },
  { label: "Real rewards", icon: Coins, color: "bg-warning" },
];

const taglines = [
  { text: "Your smile can do more.", sub: "Private smile checks, small wins, and rewards that make showing up feel good." },
  { text: "Streak it. Earn it.", sub: "Build a daily smile streak and watch your coins stack up." },
  { text: "Privacy by design.", sub: "Scored on-device. We never see your photos." },
  { text: "Climb the leaderboard.", sub: "Daily, weekly, monthly — there's always a podium to chase." },
];

function RotatingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % taglines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[160px] xl:min-h-[180px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase text-white/80">A brighter daily ritual</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-white xl:text-6xl xl:leading-[0.9]">
            {taglines[index].text}
          </h1>
          <p className="mt-6 max-w-sm text-lg leading-8 text-white/75">
            {taglines[index].sub}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex gap-1.5">
        {taglines.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="h-1.5 rounded-full border-[length:var(--border-width)] border-white/40 transition-all duration-300 min-h-0"
            style={{
              width: i === index ? 24 : 8,
              backgroundColor: i === index ? "#ffffff" : "transparent",
            }}
            aria-label={`Show tagline ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid min-h-[100dvh] bg-background lg:h-[100dvh] lg:overflow-hidden lg:grid-cols-[minmax(22rem,0.85fr)_minmax(0,1.15fr)]">
      <aside className="relative hidden overflow-hidden border-r-[length:var(--border-width)] border-black bg-secondary p-8 lg:flex lg:flex-col xl:p-10">
        <Link href="/" className="relative z-10 w-fit focus-visible:outline-3 focus-visible:outline-offset-4">
          <Logo className="h-9 w-auto text-white" />
        </Link>

        <div className="relative z-10 my-auto max-w-md">
          {shouldReduceMotion ? (
            <>
              <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase text-white/80">A brighter daily ritual</p>
              <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-white xl:text-6xl xl:leading-[0.9]">
                {taglines[0].text}
              </h1>
              <p className="mt-6 max-w-sm text-lg leading-8 text-white/75">
                {taglines[0].sub}
              </p>
            </>
          ) : (
            <RotatingTagline />
          )}
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {highlights.map(({ label, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              className={`${color} border-[length:var(--border-width)] border-black rounded-lg p-3 brutal-lift`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon className="size-6" strokeWidth={2.5} />
              <p className="mt-8 text-xs font-black leading-4">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute bottom-[-2rem] right-[-2rem] size-40 border-[length:var(--border-width)] border-black rounded-xl bg-primary"
          animate={shouldReduceMotion ? {} : { rotate: [0, 2, -2, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-12 top-24 size-12 border-[length:var(--border-width)] border-black rounded-md bg-accent"
          animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </aside>

      <div className="flex min-h-[100dvh] items-center justify-center p-3 sm:p-4 lg:min-h-0 lg:p-4 xl:p-6">
        <div className="brutal-surface w-full max-w-[27rem] bg-card p-4 sm:p-5 lg:p-6 lg:max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <Link href="/" className="mb-3 inline-block lg:hidden focus-visible:outline-3 focus-visible:outline-offset-4">
            <Logo className="h-7 w-auto" />
          </Link>
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </div>
    </div>
  );
}
