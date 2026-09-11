'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.24,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('w-full flex-1 flex flex-col min-w-0', className)}
    >
      {children}
    </motion.div>
  );
}
