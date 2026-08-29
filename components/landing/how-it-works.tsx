'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, Flame, Gift, ArrowRight, ArrowDown } from 'lucide-react';

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  colorClass: string;
  textClass: string;
  badgeBg: string;
}

const STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Smile at your camera',
    description: 'The AI scores how real it looks in seconds.',
    icon: Camera,
    colorClass: 'bg-primary',
    textClass: 'text-primary-foreground',
    badgeBg: 'bg-card text-card-foreground',
  },
  {
    number: '02',
    title: 'Scratch your card',
    description: 'See how many coins you won instantly.',
    icon: Sparkles,
    colorClass: 'bg-secondary',
    textClass: 'text-secondary-foreground',
    badgeBg: 'bg-card text-card-foreground',
  },
  {
    number: '03',
    title: 'Build your streak',
    description: 'Smile daily, boost multipliers, and earn more.',
    icon: Flame,
    colorClass: 'bg-accent',
    textClass: 'text-accent-foreground',
    badgeBg: 'bg-card text-card-foreground',
  },
  {
    number: '04',
    title: 'Cash out',
    description: 'Trade coins for real gift cards and vouchers.',
    icon: Gift,
    colorClass: 'bg-success',
    textClass: 'text-success-foreground',
    badgeBg: 'bg-card text-card-foreground',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="How Open Smile works"
      className="border-b-[length:var(--border-width)] border-black bg-card py-16 sm:py-20 lg:py-28 dark:border-border dark:bg-background"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-secondary px-3.5 py-1 text-xs font-black tracking-widest text-secondary-foreground uppercase shadow-brutal-xs dark:border-border">
            <span>Simple 4-Step Loop</span>
          </div>
          <h2 className="font-display mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How it works
          </h2>
          <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
            No feeds to doomscroll. No cloud data sold. Just a daily smile ritual that turns good mood into real rewards.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEPS.length - 1;

            return (
              <motion.li
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col"
              >
                <div
                  className={`brutal-surface flex h-full min-h-[260px] flex-col justify-between p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-brutal-lg sm:p-7 ${step.colorClass} ${step.textClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center justify-center border-[length:var(--border-width)] border-black px-2.5 py-1 font-mono text-xs font-black tracking-wider rounded-md shadow-brutal-xs dark:border-border ${step.badgeBg}`}
                    >
                      STEP {step.number}
                    </span>
                    <div
                      className="flex size-11 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-card text-foreground shadow-brutal-xs dark:border-border"
                      aria-hidden="true"
                    >
                      <Icon className="size-6" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-title text-xl font-black tracking-tight sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-relaxed opacity-90">
                      {step.description}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1 + 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 size-7 items-center justify-center rounded-full border-[length:var(--border-width)] border-black bg-card text-foreground shadow-brutal-xs dark:border-border"
                      aria-hidden="true"
                    >
                      <ArrowRight className="size-4" strokeWidth={3} />
                    </motion.div>

                    <div
                      className="flex lg:hidden justify-center py-1 sm:hidden"
                      aria-hidden="true"
                    >
                      <div className="flex size-7 items-center justify-center rounded-full border-[length:var(--border-width)] border-black bg-card text-foreground shadow-brutal-xs dark:border-border">
                        <ArrowDown className="size-4" strokeWidth={3} />
                      </div>
                    </div>
                  </>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
