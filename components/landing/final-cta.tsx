'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
    <section
      id="get-started"
      aria-label="Get started with Open Smile"
      className="relative overflow-hidden brutal-border-y bg-card py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] dark:opacity-[0.12] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_50%,transparent_100%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--outline) 1px, transparent 1px),
            linear-gradient(to bottom, var(--outline) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          

          <h2 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Got a smile? <br />
            <span className="bg-gradient-to-r from-primary via-[#9B51E0] to-secondary bg-clip-text text-transparent">
              Turn it into real rewards.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-base font-semibold text-muted-foreground sm:text-lg">
            No credit card. No account setup required for your first session. Calibrate in seconds.
          </p>

          <div className="mt-8 sm:mt-10">
            <Button asChild size="lg" className="h-14 px-8 text-base">
              <Link href="/try">
                <span>Start smiling now</span>
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-mono text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-success" />
              100% On-device
            </span>
            <span>•</span>
            <span>Zero cloud storage</span>
            <span>•</span>
            <span>Instant ledger payouts</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCta;
