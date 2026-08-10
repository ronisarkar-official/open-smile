'use client';

import * as React from 'react';
import { AnimatePresence } from 'motion/react';
import { useToast } from '@/hooks/use-toast';
import { AlertToast } from '@/components/ui/toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-3 pointer-events-none w-full max-w-sm"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <AlertToast
              variant={t.variant ?? 'info'}
              styleVariant={t.styleVariant ?? 'default'}
              title={t.title}
              description={t.description}
              onClose={() => dismiss(t.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
