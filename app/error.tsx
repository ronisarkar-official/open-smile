"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <main id="main-content" className="flex min-h-[100dvh] items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-xl border-[length:var(--border-width)] border-black rounded-xl bg-card p-7 text-center shadow-brutal-xl sm:p-10">
        <Logo className="mx-auto h-9 w-auto" />
        <div className="mx-auto mt-9 flex size-16 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-secondary shadow-brutal-sm">
          <AlertTriangle className="size-8" strokeWidth={2.5} />
        </div>
        <p className="mt-7 font-mono text-xs font-bold tracking-[0.14em] uppercase">A quick stumble</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">We couldn&apos;t load this page.</h1>
        <p className="mx-auto mt-4 max-w-[48ch] leading-7 text-muted-foreground">Try again, or head back to the home page and start from there.</p>
        {error.digest && <p className="mt-4 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}><RefreshCw className="size-4" />Try again</Button>
          <Button asChild variant="outline"><Link href="/"><Home className="size-4" />Home</Link></Button>
        </div>
      </div>
    </main>
  );
}
