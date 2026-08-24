import type { Metadata } from "next";
import {
  Camera,
  CircleDot,
  Coins,
  Eye,
  Flame,
  ScanFace,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Capture",
  description: "Open your camera, smile, and earn coins.",
};

export default function CapturePage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-[3px] border-black bg-primary px-3 py-2 font-mono text-sm font-bold tracking-wider shadow-[3px_3px_0_#000]">
            <Coins className="size-4" strokeWidth={2.5} />
            <span className="tabular-nums">247</span>
          </div>
          <div className="flex items-center gap-2 border-[3px] border-black bg-secondary px-3 py-2 font-mono text-sm font-bold tracking-wider shadow-[3px_3px_0_#000]">
            <Flame className="size-4" strokeWidth={2.5} />
            <span className="tabular-nums">3</span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping bg-success opacity-75" />
            <span className="relative inline-flex size-2.5 bg-success" />
          </span>
          Camera ready
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="flex flex-col gap-6">
          <div className="brutal-shadow-lg relative border-[3px] border-black bg-card">
            <div className="flex items-center justify-between border-b-[3px] border-black bg-muted px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
                <Camera className="size-4" strokeWidth={2.5} />
                Smile check
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping bg-destructive opacity-75" />
                  <span className="relative inline-flex size-2 bg-destructive" />
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest uppercase">REC</span>
              </div>
            </div>

            <div className="relative flex min-h-80 items-center justify-center bg-foreground/5 sm:min-h-[28rem]">
              <div className="absolute inset-6 border-[2px] border-dashed border-foreground/20" />

              <div className="absolute left-8 top-8 h-6 w-6 border-l-[3px] border-t-[3px] border-accent" />
              <div className="absolute right-8 top-8 h-6 w-6 border-r-[3px] border-t-[3px] border-accent" />
              <div className="absolute bottom-8 left-8 h-6 w-6 border-b-[3px] border-l-[3px] border-accent" />
              <div className="absolute bottom-8 right-8 h-6 w-6 border-b-[3px] border-r-[3px] border-accent" />

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex size-24 items-center justify-center border-[3px] border-black bg-accent shadow-[5px_5px_0_#000]">
                  <ScanFace className="size-12" strokeWidth={1.5} />
                </div>
                <p className="max-w-[28ch] text-sm font-bold text-muted-foreground">
                  Position your face in the frame and follow the liveness prompt
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t-[3px] border-black bg-accent/30 px-4 py-3">
              <Eye className="size-4 shrink-0" strokeWidth={2.5} />
              <p className="font-mono text-xs font-bold tracking-wider uppercase">
                Blink twice to begin liveness check
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1 gap-2 text-base">
              <Camera className="size-5" />
              Capture smile
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <CircleDot className="size-5" />
              Retake
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <article className="border-[3px] border-black bg-primary p-5 shadow-[8px_8px_0_#000]">
            <Sparkles className="size-7" strokeWidth={2.5} />
            <p className="mt-6 font-mono text-xs font-bold tracking-[0.14em] uppercase">Your score</p>
            <p className="font-display mt-2 text-7xl font-black tracking-[-0.08em] tabular-nums sm:text-8xl">94</p>
            <p className="mt-2 text-base font-bold">Outstanding smile!</p>
            <div className="mt-4 h-3 w-full border-[2px] border-black bg-card">
              <div className="h-full bg-success" style={{ width: "94%" }} />
            </div>
          </article>

          <article className="brutal-surface bg-secondary p-5">
            <div className="flex items-start justify-between">
              <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Coins earned</p>
              <Coins className="size-6" strokeWidth={2.5} />
            </div>
            <p className="mt-4 font-mono text-5xl font-black tabular-nums">+12</p>
            <p className="mt-1 text-sm font-bold text-black/70">Streak bonus: 1.5x</p>
          </article>

          <article className="brutal-surface bg-card p-5">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-primary" strokeWidth={2.5} />
              <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Quick actions</p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 normal-case">
                <Share2 className="size-4" />
                Share to Explore
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 normal-case">
                <Camera className="size-4" />
                Take another
              </Button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
