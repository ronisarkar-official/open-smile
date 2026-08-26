import { Smile } from "lucide-react";
import { Logo } from "@/components/logo";

export default function Loading() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-5" aria-live="polite" aria-label="Loading Open Smile">
      <div className="flex flex-col items-center gap-5">
        <Logo className="h-9 w-auto" />
        <div className="flex size-16 items-center justify-center border-[length:var(--border-width)] border-black rounded-xl bg-primary shadow-brutal">
          <Smile className="size-8 animate-pulse" strokeWidth={2.5} />
        </div>
      </div>
    </main>
  );
}
