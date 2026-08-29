'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section
      id="get-started"
      aria-label="Get started with Open Smile"
      className="border-y-[length:var(--border-width)] border-black bg-[#FFD23F] py-20 text-black sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <h2 className="font-display text-3xl font-black tracking-tight text-black sm:text-5xl lg:text-6xl uppercase leading-tight">
            GOT A SMILE? 😄
            <span className="block mt-2 sm:mt-3">LET&apos;S TURN IT INTO COINS.</span>
          </h2>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/try"
              className="brutal-lift inline-flex items-center justify-center gap-3 border-[length:var(--border-width)] border-black rounded-xl bg-black px-7 py-4 font-mono text-base font-black tracking-wide text-white shadow-brutal-md transition-all hover:bg-neutral-900 hover:shadow-brutal-lg active:translate-x-0.5 active:translate-y-0.5 sm:px-9 sm:py-4.5 sm:text-lg"
            >
              <span>TRY YOUR SMILE — IT&apos;S FREE</span>
              <ArrowRight className="size-5 shrink-0" strokeWidth={3} aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-5 font-mono text-xs font-bold text-black/80 sm:text-sm">
            No account needed for your first try.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCta;
