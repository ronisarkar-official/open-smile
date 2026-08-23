import Link from "next/link";
import { ArrowUpRight, SearchX, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-5 py-12">
      <div className="relative w-full max-w-2xl border-[3px] border-black bg-card p-7 text-center shadow-[8px_8px_0_#000] sm:p-12">
        <div className="absolute -left-6 -top-6 hidden size-14 border-[3px] border-black bg-secondary sm:block" />
        <div className="absolute -bottom-7 -right-7 hidden size-20 border-[3px] border-black bg-accent sm:block" />
        <Link href="/" className="inline-block focus-visible:outline-3 focus-visible:outline-offset-4">
          <Logo className="h-9 w-auto" />
        </Link>
        <div className="mx-auto mt-10 flex size-20 items-center justify-center border-[3px] border-black bg-primary">
          <SearchX className="size-10" strokeWidth={2.5} />
        </div>
        <p className="mt-8 font-mono text-xs font-bold tracking-[0.14em] uppercase">404</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-0.07em] sm:text-6xl">This smile went missing.</h1>
        <p className="mx-auto mt-5 max-w-[46ch] leading-7 text-muted-foreground">The page you&apos;re after doesn&apos;t exist or has moved somewhere brighter.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">
            <Smile className="size-5" />
            Back to Open Smile
            <ArrowUpRight className="size-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
