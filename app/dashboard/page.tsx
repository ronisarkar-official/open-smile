import { headers } from "next/headers";
import { CalendarDays, Coins, Flame, ScanFace, Sparkles, Trophy } from "lucide-react";
import { auth } from "@/auth";

const statusCards = [
  { label: "Coin balance", value: "0", detail: "Earn your first coins in beta", icon: Coins, color: "bg-primary" },
  { label: "Smile streak", value: "0", detail: "Your streak starts with a first check", icon: Flame, color: "bg-secondary" },
  { label: "Best score", value: "0", detail: "Your strongest smile will live here", icon: ScanFace, color: "bg-accent" },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Your happy little corner</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Good to see you, {firstName}.</h1>
          <p className="mt-4 max-w-[60ch] text-base leading-7 text-muted-foreground sm:text-lg">
            Your smile dashboard is ready. The first capture and reward loop will appear here when beta access opens.
          </p>
        </div>
        <div className="flex items-center gap-3 border-[3px] border-black bg-primary px-4 py-3 font-mono text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0_#000]">
          <CalendarDays className="size-5" />
          Beta member
        </div>
      </div>

      <section className="mt-10 grid gap-5 lg:grid-cols-3" aria-label="Smile progress">
        {statusCards.map(({ label, value, detail, icon: Icon, color }) => (
          <article key={label} className={`${color} brutal-surface flex min-h-52 flex-col justify-between p-5 sm:p-6`}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-xs font-bold tracking-[0.12em] uppercase">{label}</p>
              <Icon className="size-7" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-mono text-6xl font-black tracking-[-0.08em] tabular-nums">{value}</p>
              <p className="mt-2 text-sm font-bold text-black/70">{detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="border-[3px] border-black bg-card p-6 shadow-[4px_4px_0_#000] sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">First up</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Your first smile check</h2>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center border-[3px] border-black bg-primary">
              <Sparkles className="size-6" strokeWidth={2.5} />
            </div>
          </div>
          <p className="mt-5 max-w-[58ch] leading-7 text-muted-foreground">
            We&apos;re still preparing the capture experience for the beta. When it lands, this card will guide you through a quick liveness check and show your score right away.
          </p>
          <div className="mt-7 border-[3px] border-dashed border-black bg-muted px-4 py-5 text-sm font-semibold">
            Capture unlocks are rolling out in small groups. We&apos;ll let you know when yours is ready.
          </div>
        </article>

        <article className="border-[3px] border-black bg-secondary p-6 shadow-[4px_4px_0_#000] sm:p-8">
          <Trophy className="size-9" strokeWidth={2.5} />
          <p className="mt-9 font-mono text-xs font-bold tracking-[0.14em] uppercase">Rewards are on the way</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Small smiles. Real perks.</h2>
          <p className="mt-4 leading-7 text-black/75">Build coins, unlock badges, and work toward vouchers as the beta grows.</p>
        </article>
      </section>
    </main>
  );
}
