'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startProgress = React.useCallback(() => {
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsNavigating(true);
    setVisible(true);
    setProgress(15);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 60) {
          return prev + Math.random() * 12 + 6;
        } else if (prev < 85) {
          return prev + Math.random() * 4 + 1;
        }
        return prev;
      });
    }, 180);
  }, []);

  const completeProgress = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setProgress(100);

    finishTimerRef.current = setTimeout(() => {
      setVisible(false);
      finishTimerRef.current = setTimeout(() => {
        setProgress(0);
        setIsNavigating(false);
      }, 200);
    }, 200);
  }, []);

  // When pathname or searchParams change, the route navigation has completed
  React.useEffect(() => {
    if (isNavigating) {
      completeProgress();
    }
  }, [pathname, searchParams, isNavigating, completeProgress]);

  // Global click listener for link navigations
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return; // Left click only
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore hash links, javascript:, mailto:, tel:
      if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Ignore links with target="_blank"
      if (anchor.target && anchor.target !== '_self') return;

      // Ignore download links
      if (anchor.hasAttribute('download')) return;

      try {
        const url = new URL(anchor.href, window.location.href);
        // Only internal links
        if (url.origin !== window.location.origin) return;

        const currentUrl = new URL(window.location.href);
        // Ignore same URL
        if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
          return;
        }

        startProgress();
      } catch {
        // Invalid URL, do nothing
      }
    }

    function handlePopState() {
      startProgress();
    }

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, [startProgress]);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          boxShadow: '0 0 10px var(--primary), 0 0 5px var(--accent)',
        }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <React.Suspense fallback={null}>
      <ProgressBar />
    </React.Suspense>
  );
}
