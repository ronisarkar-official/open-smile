"use client";

import { Check, X, Cpu, Eye, Lock, ScanFace } from "lucide-react";

const comparisons = [
  {
    feature: "Video Processing Location",
    traditional: "Sent to remote cloud server",
    openSmile: "100% inside your browser (WASM)",
  },
  {
    feature: "Biometric Data Storage",
    traditional: "Stored in central cloud databases",
    openSmile: "Zero biometric storage · 0ms retention",
  },
  {
    feature: "Scoring Metric",
    traditional: "Binary true/false classifier",
    openSmile: "Continuous 0–100 Duchenne geometry",
  },
  {
    feature: "Anti-Spoofing & Liveness",
    traditional: "Often skipped or requires ID selfie",
    openSmile: "Real-time blinks & perceptual hashing",
  },
  {
    feature: "User Media Ownership",
    traditional: "Trained on user submissions",
    openSmile: "Strict 24h auto-expiry for opt-in feed",
  },
];

export function AboutTechDeepDive() {
  return (
    <section className="border-b-[length:var(--border-width)] border-black bg-muted/30 py-16 sm:py-24 dark:border-white dark:bg-muted/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="border-[length:var(--border-width)] border-black rounded-md bg-primary px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-brutal-xs dark:border-white">
            Under The Hood
          </span>
          <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-foreground sm:text-5xl text-balance">
            Real facial geometry, zero cloud surveillance.
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-muted-foreground leading-relaxed">
            Most facial recognition systems send your video stream to a black-box server. Open Smile runs state-of-the-art computer vision entirely on your CPU/GPU in real-time.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="border-[length:var(--border-width)] border-black rounded-2xl bg-card p-6 shadow-brutal-md dark:border-white">
            <div className="flex size-11 items-center justify-center rounded-xl border-[length:var(--border-width)] border-black bg-secondary text-secondary-foreground shadow-brutal-xs dark:border-white">
              <ScanFace className="size-6" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
              478 3D Mesh Landmarks
            </h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed">
              Using MediaPipe Face Landmarker compiled to WebAssembly, your browser tracks precise 3D coordinates for mouth corners, philtrum, eyebrows, cheeks, and eyelids at 30+ frames per second.
            </p>
          </div>

          <div className="border-[length:var(--border-width)] border-black rounded-2xl bg-card p-6 shadow-brutal-md dark:border-white">
            <div className="flex size-11 items-center justify-center rounded-xl border-[length:var(--border-width)] border-black bg-accent text-accent-foreground shadow-brutal-xs dark:border-white">
              <Cpu className="size-6" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
              Duchenne Smile Formula
            </h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed">
              We calculate the ratio of lip curvature (zygomaticus major activation) against outer eyelid crinkles (orbicularis oculi). A genuine smile activates eyes and mouth simultaneously, generating a rich 0–100 score.
            </p>
          </div>

          <div className="border-[length:var(--border-width)] border-black rounded-2xl bg-card p-6 shadow-brutal-md dark:border-white">
            <div className="flex size-11 items-center justify-center rounded-xl border-[length:var(--border-width)] border-black bg-primary text-primary-foreground shadow-brutal-xs dark:border-white">
              <Eye className="size-6" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
              Anti-Cheat Liveness Gate
            </h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed">
              To stop photos, screen replays, and deepfakes, our client liveness engine detects natural blink sequences and depth changes before unlocking the reward scratch card.
            </p>
          </div>
        </div>

        
      </div>
    </section>
  );
}
