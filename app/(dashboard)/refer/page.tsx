import type { Metadata } from "next";
import {
  Camera,
  Check,
  Coins,
  Copy,
  Gift,
  Link2,
  QrCode,
  Share2,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Refer & Earn",
  description: "Invite friends to Open Smile and earn bonus coins when they capture their first smile.",
};

const referralCode = "SMILE-R0N1";
const referralLink = "opensmile.app/join/SMILE-R0N1";

const steps = [
  {
    number: "01",
    title: "Share your link",
    description: "Send your unique referral link to a friend via any channel.",
    icon: Share2,
    color: "bg-primary",
  },
  {
    number: "02",
    title: "Friend captures a smile",
    description: "Your friend signs up and completes their first smile check.",
    icon: Camera,
    color: "bg-accent",
  },
  {
    number: "03",
    title: "Both earn coins",
    description: "You get +200 coins and your friend gets a +50 bonus.",
    icon: Coins,
    color: "bg-secondary",
  },
];

const stats = [
  { label: "Friends referred", value: "4", icon: Users, color: "bg-accent" },
  { label: "Bonus coins earned", value: "800", icon: Coins, color: "bg-primary" },
  { label: "Pending referrals", value: "2", icon: UserPlus, color: "bg-secondary" },
];

export default function ReferPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
      <div>
        <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Grow the community</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Refer &amp; Earn</h1>
        <p className="mt-3 max-w-[55ch] text-base leading-7 text-muted-foreground">
          Invite friends to Open Smile. When they complete their first smile check, both of you earn bonus coins.
        </p>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="border-[3px] border-black bg-card p-5 shadow-[8px_8px_0_#000] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Link2 className="size-5" strokeWidth={2.5} />
                <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Your referral code</p>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 border-[3px] border-black bg-muted px-4 py-3.5">
                  <p className="font-mono text-lg font-black tracking-[0.1em] sm:text-xl">{referralCode}</p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0" aria-label="Copy referral code">
                  <Copy className="size-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Shareable link</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 overflow-hidden border-[3px] border-dashed border-black bg-muted/50 px-4 py-3">
                <p className="truncate font-mono text-sm font-semibold">{referralLink}</p>
              </div>
              <Button variant="outline" size="icon" className="shrink-0" aria-label="Copy referral link">
                <Copy className="size-5" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1 gap-2">
              <Share2 className="size-5" />
              Share link
            </Button>
            <Button variant="outline" size="lg" className="flex-1 gap-2">
              <Copy className="size-5" />
              Copy code
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 border-[3px] border-black bg-success/20 px-4 py-3">
            <Sparkles className="size-4 shrink-0 text-success" strokeWidth={2.5} />
            <p className="text-sm font-bold">5 referral rewards remaining today</p>
          </div>
        </article>

        <div className="flex flex-col gap-5">
          <article className="border-[3px] border-black bg-muted p-5 shadow-[5px_5px_0_#000]">
            <div className="flex items-center gap-2">
              <QrCode className="size-5" strokeWidth={2.5} />
              <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">QR Code</p>
            </div>
            <div className="mt-4 flex aspect-square items-center justify-center border-[3px] border-dashed border-black bg-card">
              <div className="flex flex-col items-center gap-3 text-center">
                <QrCode className="size-16 text-muted-foreground" strokeWidth={1} />
                <p className="text-xs font-semibold text-muted-foreground">Scan to join via your link</p>
              </div>
            </div>
          </article>

          <article className="border-[3px] border-black bg-primary p-5 shadow-[5px_5px_0_#000]">
            <Gift className="size-7" strokeWidth={2.5} />
            <p className="mt-4 text-xl font-black tracking-[-0.03em]">+200 coins per referral</p>
            <p className="mt-1 text-sm font-bold text-black/70">Your friend gets +50 bonus too</p>
          </article>
        </div>
      </section>

      <section className="mt-10">
        <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">How it works</p>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">Three easy steps</h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <li
                key={step.number}
                className={`${step.color} brutal-surface brutal-lift flex min-h-52 flex-col p-5 sm:p-6 ${
                  index === 1 ? "sm:-translate-y-3" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-black tabular-nums">{step.number}</span>
                  <StepIcon className="size-7" strokeWidth={2.5} />
                </div>
                <div className="mt-auto">
                  <h3 className="text-lg font-black tracking-[-0.03em]">{step.title}</h3>
                  <p className="mt-2 max-w-[30ch] text-sm leading-6 text-black/70">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10" aria-label="Referral stats">
        <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Your referral stats</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {stats.map(({ label, value, icon: StatIcon, color }) => (
            <article key={label} className={`${color} brutal-surface flex min-h-40 flex-col justify-between p-5`}>
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs font-bold tracking-[0.12em] uppercase">{label}</p>
                <StatIcon className="size-6" strokeWidth={2.5} />
              </div>
              <p className="font-mono text-5xl font-black tracking-[-0.08em] tabular-nums">{value}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
