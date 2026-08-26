import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDown,
  ArrowUpRight,
  Camera,
  Coins,
  LockKeyhole,
  ScanFace,
  ShieldCheck,
  Smile,
  Sparkles,
  Trophy,
} from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { WaitlistForm } from "@/components/waitlist-form";
import { Button } from "@/components/ui/button";
import { TeamAndTestimonialsSection } from "@/components/team-and-testimonials";

const steps = [
  {
    number: "01",
    title: "Take a quick smile check",
    description: "Open your camera, follow the liveness prompt, and capture a genuine moment.",
    icon: Camera,
    color: "bg-primary",
    fg: "text-primary-foreground",
  },
  {
    number: "02",
    title: "See your score instantly",
    description: "The smile model runs in your browser. Your raw video never needs to leave it.",
    icon: ScanFace,
    color: "bg-accent",
    fg: "text-accent-foreground",
  },
  {
    number: "03",
    title: "Turn smiles into rewards",
    description: "Great smiles earn coins. Build a streak, climb the board, and unlock rewards.",
    icon: Coins,
    color: "bg-secondary",
    fg: "text-secondary-foreground",
  },
];

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 overflow-hidden">
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="reveal-in inline-flex border-[length:var(--border-width)] border-black rounded-md bg-secondary px-3 py-1 text-xs font-extrabold tracking-[0.12em] text-secondary-foreground uppercase">
              The beta is getting happier
            </p>
            <h1 className="font-display reveal-in reveal-delay-1 mt-5 max-w-[10ch] text-5xl font-black tracking-[-0.07em] sm:text-6xl lg:text-[clamp(4rem,6.2vw,6.4rem)] lg:leading-[0.88]">
              smile more. win more.
            </h1>
            <p className="reveal-in reveal-delay-2 mt-6 max-w-[55ch] text-lg leading-8 text-muted-foreground sm:text-xl">
              Open Smile turns a genuine grin into a tiny daily win: a private, on-device smile score, coins, streaks, and rewards worth showing up for.
            </p>
            <div className="reveal-in reveal-delay-3 mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">
                  Start smiling
                  <ArrowUpRight className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#how-it-works">
                  How it works
                  <ArrowDown className="size-5" />
                </a>
              </Button>
            </div>
            <div className="reveal-in reveal-delay-3 mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
              <span className="flex items-center gap-2"><ShieldCheck className="size-5 text-accent" /> Privacy-first by design</span>
              <span className="flex items-center gap-2"><Sparkles className="size-5 text-secondary" /> No doomscrolling required</span>
            </div>
          </div>

          <div className="reveal-in reveal-delay-2 relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -left-5 -top-5 hidden h-16 w-16 border-[length:var(--border-width)] border-black rounded-lg bg-secondary sm:block" />
            <div className="absolute -bottom-5 -right-5 hidden h-20 w-20 border-[length:var(--border-width)] border-black rounded-lg bg-primary sm:block" />
            <div className="shadow-brutal-lg relative grid min-h-100 grid-cols-2 gap-3 border-[length:var(--border-width)] border-black rounded-2xl bg-accent p-3 sm:min-h-124 sm:gap-4 sm:p-4">
              <div className="col-span-2 flex items-center justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
                  <span className="size-3 rounded-xs bg-secondary" /> Smile check
                </div>
                <span className="font-mono text-xs font-bold">LIVE</span>
              </div>
              <div className="relative col-span-2 flex min-h-52 flex-col items-center justify-center overflow-hidden border-[length:var(--border-width)] border-black rounded-lg bg-primary p-6 text-primary-foreground sm:min-h-64">
                <div className="absolute left-5 top-5 h-5 w-5 border-[length:var(--border-width)] border-black rounded-xs bg-secondary" />
                <div className="absolute bottom-5 right-5 h-7 w-7 border-[length:var(--border-width)] border-black rounded-xs bg-accent" />
                <Smile strokeWidth={2.5} className="size-28 sm:size-36" aria-hidden="true" />
                <p className="mt-3 font-mono text-xs font-bold tracking-wider uppercase">Genuine smile detected</p>
              </div>
              <div className="flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-lg bg-card p-4 sm:p-5">
                <span className="font-mono text-xs font-bold tracking-wider uppercase">Today&apos;s score</span>
                <span className="font-display text-5xl font-black tracking-[-0.08em] tabular-nums sm:text-6xl">86</span>
                <span className="text-sm font-bold">Strong smile energy</span>
              </div>
              <div className="flex flex-col justify-between border-[length:var(--border-width)] border-black rounded-lg bg-secondary p-4 text-secondary-foreground sm:p-5">
                <Coins className="size-8" />
                <div>
                  <span className="block font-mono text-3xl font-black tabular-nums">+12</span>
                  <span className="text-sm font-bold">coins earned</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y-[length:var(--border-width)] border-black bg-card">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:py-24">
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">A tiny daily ritual</p>
                <h2 className="mt-3 max-w-[10ch] text-4xl font-black tracking-[-0.06em] sm:text-5xl">The good kind of loop.</h2>
              </div>
              <p className="max-w-[55ch] text-lg leading-8 text-muted-foreground">No feeds to feed. No photos sold to train a cloud. Just a simple check-in that nudges you toward a brighter day.</p>
            </div>
            <ol className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr_0.9fr]">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.number} className={`${step.color} ${step.fg} brutal-surface brutal-lift flex min-h-72 flex-col p-6 sm:p-7 ${index === 1 ? "lg:-translate-y-5" : ""}`}>
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-sm font-black tabular-nums">{step.number}</span>
                      <Icon className="size-9" strokeWidth={2.5} />
                    </div>
                    <div className="mt-auto">
                      <h3 className="max-w-[16ch] text-2xl font-black tracking-[-0.04em]">{step.title}</h3>
                      <p className="mt-3 max-w-[32ch] leading-7 opacity-75">{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section id="privacy" className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:py-24">
          <div className="shadow-brutal-lg order-2 border-[length:var(--border-width)] border-black rounded-2xl bg-secondary p-5 sm:p-8 lg:order-1">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border-[length:var(--border-width)] border-black rounded-lg bg-card p-5 sm:col-span-2">
                <LockKeyhole className="size-8" />
                <p className="mt-8 font-mono text-xs font-bold tracking-[0.12em] uppercase">Raw video stays with you</p>
              </div>
              <div className="border-[length:var(--border-width)] border-black rounded-lg bg-primary p-5 text-primary-foreground">
                <span className="block font-mono text-4xl font-black">01</span>
                <p className="mt-8 text-sm font-bold">On-device scoring</p>
              </div>
              <div className="border-[length:var(--border-width)] border-black rounded-lg bg-accent p-5 text-accent-foreground">
                <span className="block font-mono text-4xl font-black">24h</span>
                <p className="mt-8 text-sm font-bold">Photo expiry policy</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Your face is not the product</p>
            <h2 className="mt-3 max-w-[11ch] text-4xl font-black tracking-[-0.06em] sm:text-5xl">Big rewards. Small footprint.</h2>
            <p className="mt-6 max-w-[52ch] text-lg leading-8 text-muted-foreground">Smile scoring happens locally in your browser. Captures are private by default, and any image you choose to share expires automatically after one day.</p>
          </div>
        </section>

        <TeamAndTestimonialsSection />

        <section id="beta" className="border-y-[length:var(--border-width)] border-black bg-primary">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:py-20">
            <div>
              <div className="flex items-center gap-3">
                <Trophy className="size-8" strokeWidth={2.5} />
                <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Open Smile beta</p>
              </div>
              <h2 className="mt-5 max-w-[13ch] text-4xl font-black tracking-[-0.06em] sm:text-5xl">Be early. Bring your best grin.</h2>
              <p className="mt-4 max-w-[55ch] text-lg leading-8 text-black/75">Join the waitlist and we&apos;ll let you know as soon as a new beta spot opens.</p>
            </div>
            <div className="w-full lg:w-lg">
              <WaitlistForm />
              <p className="mt-3 text-xs font-semibold text-black/65">One email when your beta spot is ready. Nothing else.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-semibold">© 2026 Open Smile</p>
        <p className="text-muted-foreground">A brighter little habit, built with privacy in mind.</p>
      </footer>
    </>
  );
}
