'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { LockKeyhole, ShieldCheck, Zap } from 'lucide-react';

interface TrustPoint {
  id: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge: string;
  title: string;
  description: string;
  detail: string;
  accentClass: string;
  accentTextClass: string;
}

const TRUST_POINTS: TrustPoint[] = [
  {
    id: 'private',
    icon: LockKeyhole,
    badge: 'Privacy',
    title: 'PRIVATE BY DEFAULT',
    description: "Your capture isn't automatically public.",
    detail: 'Raw video never leaves your browser. Any shared photo auto-deletes in 24 hours.',
    accentClass: 'bg-primary',
    accentTextClass: 'text-primary-foreground',
  },
  {
    id: 'liveness',
    icon: ShieldCheck,
    badge: 'Anti-Spoof',
    title: 'LIVENESS CHECKS',
    description: 'Helps prevent photo/video spoofing.',
    detail: 'Real-time client-side verification ensures only genuine human smiles earn coins.',
    accentClass: 'bg-secondary',
    accentTextClass: 'text-secondary-foreground',
  },
  {
    id: 'limits',
    icon: Zap,
    badge: 'Fair Play',
    title: 'SMART LIMITS',
    description: 'Cooldowns help keep rewards fair.',
    detail: 'Capture cooldowns and daily caps protect the economy so everyone has equal opportunity.',
    accentClass: 'bg-accent',
    accentTextClass: 'text-accent-foreground',
  },
];

export function TrustPrivacy() {
  return (
    <section
      id="privacy"
      aria-label="Trust and Privacy"
      className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-accent px-3 py-1 font-mono text-xs font-black tracking-widest text-accent-foreground uppercase shadow-brutal-xs dark:border-border">
          <span>Security & Fair Play</span>
        </div>
        <h2 className="font-display mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          YOUR SMILE. YOUR DATA. 🔒
        </h2>
        <p className="mt-3 text-sm font-semibold text-muted-foreground sm:text-base">
          Because this uses your face, privacy and fairness are built directly into the core loop.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {TRUST_POINTS.map((point, index) => {
          const Icon = point.icon;
          return (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.35,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="brutal-surface group flex flex-col justify-between border-[length:var(--border-width)] border-black bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-brutal-lg dark:border-border dark:bg-card"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex size-12 items-center justify-center border-[length:var(--border-width)] border-black rounded-xl shadow-brutal-xs dark:border-border ${point.accentClass} ${point.accentTextClass}`}
                    aria-hidden="true"
                  >
                    <Icon className="size-6" strokeWidth={2.5} />
                  </div>
                  <span className="border-[length:var(--border-width)] border-black rounded-md bg-muted px-2.5 py-0.5 font-mono text-[11px] font-black tracking-wider uppercase shadow-brutal-xs dark:border-border dark:bg-muted">
                    {point.badge}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="font-title text-lg font-black tracking-tight text-foreground sm:text-xl">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-foreground">
                    {point.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t-[length:var(--border-width)] border-border/40 pt-3">
                <p className="text-xs font-semibold leading-relaxed text-muted-foreground">
                  {point.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default TrustPrivacy;
