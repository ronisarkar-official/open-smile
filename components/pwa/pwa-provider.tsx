'use client';

import * as React from 'react';
import { RefreshCw, Wifi, WifiOff, Sparkles } from 'lucide-react';
import { usePwa, type PwaState } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';
import { PwaInstallBanner } from './install-prompt';

const PwaContext = React.createContext<PwaState | null>(null);

export function usePwaContext() {
  const context = React.useContext(PwaContext);
  if (!context) {
    throw new Error('usePwaContext must be used within a PwaProvider');
  }
  return context;
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const pwa = usePwa();
  const [offlineToast, setOfflineToast] = React.useState<boolean>(false);
  const prevOnlineRef = React.useRef<boolean>(pwa.isOnline);

  React.useEffect(() => {
    if (prevOnlineRef.current !== pwa.isOnline) {
      setOfflineToast(true);
      const timer = setTimeout(() => {
        setOfflineToast(false);
      }, 4000);
      prevOnlineRef.current = pwa.isOnline;
      return () => clearTimeout(timer);
    }
  }, [pwa.isOnline]);

  return (
    <PwaContext.Provider value={pwa}>
      {children}

      <PwaInstallBanner />

      {pwa.needRefresh && (
        <div
          className="fixed top-4 left-4 right-4 z-500 mx-auto max-w-md animate-in fade-in-0 slide-in-from-top-5 duration-300"
          role="alert"
        >
          <div className="flex items-center justify-between gap-3 border-[length:var(--border-width)] border-border rounded-xl bg-accent p-4 text-accent-foreground shadow-brutal-md">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center border-[length:var(--border-width)] border-border rounded-md bg-background text-foreground shadow-brutal-xs">
                <Sparkles className="size-5 text-primary" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Update Ready</p>
                <p className="text-sm font-semibold">New Open Smile features available!</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={pwa.updateApp}
              className="border-[length:var(--border-width)] border-border rounded-md bg-primary text-xs font-bold text-primary-foreground shadow-brutal-xs hover:bg-primary/90"
            >
              <RefreshCw className="mr-1.5 size-3.5" />
              Reload
            </Button>
          </div>
        </div>
      )}

      {offlineToast && (
        <div
          className="fixed bottom-4 left-1/2 z-500 -translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-3 duration-200"
          role="status"
        >
          <div
            className={`flex items-center gap-2 border-[length:var(--border-width)] border-border rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-brutal-sm ${
              pwa.isOnline
                ? 'bg-success text-success-foreground'
                : 'bg-destructive text-destructive-foreground'
            }`}
          >
            {pwa.isOnline ? (
              <>
                <Wifi className="size-4" />
                <span>Back Online</span>
              </>
            ) : (
              <>
                <WifiOff className="size-4" />
                <span>Working in Offline Mode</span>
              </>
            )}
          </div>
        </div>
      )}
    </PwaContext.Provider>
  );
}
