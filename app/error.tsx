"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error tracking / service
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-6">
        <Logo className="h-9 w-auto" />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-xs">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Something went wrong!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while processing your request.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/70 font-mono bg-muted/60 px-3 py-1.5 rounded-md inline-block">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="default" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
