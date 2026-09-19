import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";
import {
  Sparkles,
  Flame,
  Clock,
  ShieldAlert,
  Award,
  Users,
  Smile,
  Zap,
} from "lucide-react";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "https://open-smile.vercel.app";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Game Rules & Fair Play · Open Smile — Scoring, Streaks & Rewards",
  description:
    "Official Open Smile rules: how on-device facial AI scores your smile (0-100), streak multipliers up to 3.0x, cooldown windows, anti-cheat protections, and voucher redemption policies.",
  alternates: {
    canonical: "/rules",
  },
  openGraph: {
    title: "Game Rules & Fair Play · Open Smile — Scoring, Streaks & Rewards",
    description:
      "Official Open Smile rules: how on-device facial AI scores your smile (0-100), streak multipliers, cooldown windows, and rewards.",
    url: `${baseUrl}/rules`,
    images: ["/open-smile_default-image.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Rules & Fair Play · Open Smile",
    description:
      "Official Open Smile rules: how on-device facial AI scores your smile (0-100), streak multipliers, and rewards.",
    images: ["/open-smile_default-image.webp"],
  },
};

const rulesSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/rules#webpage`,
      url: `${baseUrl}/rules`,
      name: "Open Smile Game Rules & Fair Play Policy",
      description:
        "Official platform rules, smile scoring mechanics, streak multipliers, and reward policies.",
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Open Smile",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Rules & Fair Play",
          item: `${baseUrl}/rules`,
        },
      ],
    },
  ],
};

export default function RulesPage() {
  const lastUpdated = "September 18, 2026";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rulesSchema) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Header Hero */}
        <section className="relative w-full border-b-[length:var(--border-width)] border-black bg-[#C6EED5] py-12 sm:py-16 dark:border-white dark:bg-[#142A1D]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-[#181829] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-brutal-xs dark:border-white">
              <Zap className="size-3.5 text-accent" />
              <span>Platform Protocol &amp; Reward Mechanics</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground text-balance">
              Game Rules &amp; Fair Play
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-semibold text-foreground/85 dark:text-muted-foreground leading-relaxed text-pretty">
              The complete manual on how Open Smile scores your facial expressions, unlocks scratch cards, preserves streaks, and protects the reward economy.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border-[length:var(--border-width)] border-black bg-card px-3 py-1 font-mono text-xs font-bold text-foreground shadow-brutal-xs dark:border-white">
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* Quick Rule Cards Grid */}
        <section className="border-b-[length:var(--border-width)] border-black bg-card py-10 dark:border-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#BEE4F8] p-5 shadow-brutal-sm dark:border-white dark:bg-[#152535]">
                <Smile className="size-6 text-primary" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  0–100 Continuous Curve
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Scores measure real Duchenne lip curvature and eye crinkles across 478 3D landmarks.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#FDF8D4] p-5 shadow-brutal-sm dark:border-white dark:bg-[#2A2615]">
                <Clock className="size-6 text-warning" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Capture Cooldowns
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  1-hour minimum cooldown between rewarded smile captures prevents rapid-fire farming.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#F6CCD6] p-5 shadow-brutal-sm dark:border-white dark:bg-[#30161E]">
                <Flame className="size-6 text-destructive" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Streaks Up To 3.0x
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Daily habits compound with 24–48h grace windows and emergency streak freeze cards.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#E5D4F8] p-5 shadow-brutal-sm dark:border-white dark:bg-[#1E1727]">
                <Users className="size-6 text-secondary" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Verified Referrals
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Referral bonuses unlock only after your friend completes their first verified live capture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10 text-sm sm:text-base leading-relaxed">

              {/* Section 1 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Smile className="size-5 text-primary" />
                  1. How Smile Scoring Works
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Rather than a binary &quot;smile / no smile&quot; trigger, Open Smile uses <strong>MediaPipe Face Landmarker</strong> running client-side via WebAssembly to measure authentic human expression:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>478 3D Landmarks:</strong> Maps high-precision coordinates of the lips, cheeks, eyebrows, and eye contours.</li>
                    <li><strong>Duchenne Smile Detection:</strong> Evaluates the contraction of both the <em>zygomaticus major</em> (raising mouth corners) and the <em>orbicularis oculi</em> (creating natural crinkles around the eyes).</li>
                    <li><strong>Granular 0–100 Scale:</strong> Scores from 0 to 39 indicate neutral or subtle expressions; scores from 40 to 69 denote moderate smiles; scores from 70 to 100 represent full, radiant, authentic smiles.</li>
                    <li><strong>Minimum Qualifying Threshold:</strong> A capture requires a score of at least <strong>40/100</strong> to qualify for coins and streak preservation.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Clock className="size-5 text-primary" />
                  2. Cooldowns &amp; Daily Capture Caps
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    To maintain an authentic and sustainable economy, captures are bound by automated system thresholds:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>1-Hour Cooldown:</strong> Following a successful capture, your account enters a 60-minute cooldown window. Attempts during this window will prompt you with the remaining time.</li>
                    <li><strong>Daily Capture Caps:</strong> Users can earn coins on up to 5 verified captures per calendar day. Any captures beyond the daily cap do not yield coins.</li>
                    <li><strong>Dynamic Server Settings:</strong> Administrators may adjust cooldown times and caps during special community event hours.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Flame className="size-5 text-destructive" />
                  3. Streaks, Multipliers &amp; Freeze Cards
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Daily streaks encourage consistent positivity. Here is how streaks are calculated:
                  </p>
                  
                  <div className="overflow-x-auto my-4">
                    <table className="w-full border-collapse border-[length:var(--border-width)] border-black text-left text-xs font-mono dark:border-white">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border-[length:var(--border-width)] border-black p-2.5 font-bold uppercase dark:border-white">Streak Tier</th>
                          <th className="border-[length:var(--border-width)] border-black p-2.5 font-bold uppercase dark:border-white">Days Required</th>
                          <th className="border-[length:var(--border-width)] border-black p-2.5 font-bold uppercase dark:border-white">Multiplier</th>
                          <th className="border-[length:var(--border-width)] border-black p-2.5 font-bold uppercase dark:border-white">Coin Boost</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b-[length:var(--border-width)] border-black dark:border-white">
                          <td className="p-2.5 font-bold">Smiler Starter</td>
                          <td className="p-2.5">Days 1–2</td>
                          <td className="p-2.5 font-bold text-primary">1.0x</td>
                          <td className="p-2.5">Base rewards</td>
                        </tr>
                        <tr className="border-b-[length:var(--border-width)] border-black dark:border-white bg-muted/20">
                          <td className="p-2.5 font-bold">Spark Smiler</td>
                          <td className="p-2.5">Days 3–6</td>
                          <td className="p-2.5 font-bold text-primary">1.2x</td>
                          <td className="p-2.5">+20% Bonus coins</td>
                        </tr>
                        <tr className="border-b-[length:var(--border-width)] border-black dark:border-white">
                          <td className="p-2.5 font-bold">Habit Builder</td>
                          <td className="p-2.5">Days 7–13</td>
                          <td className="p-2.5 font-bold text-primary">1.5x</td>
                          <td className="p-2.5">+50% Bonus coins</td>
                        </tr>
                        <tr className="border-b-[length:var(--border-width)] border-black dark:border-white bg-muted/20">
                          <td className="p-2.5 font-bold">Joy Veteran</td>
                          <td className="p-2.5">Days 14–29</td>
                          <td className="p-2.5 font-bold text-primary">2.0x</td>
                          <td className="p-2.5">+100% Double coins</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-accent">Radiant Legend</td>
                          <td className="p-2.5 font-bold">Days 30+</td>
                          <td className="p-2.5 font-black text-accent">3.0x</td>
                          <td className="p-2.5 font-bold">+200% Triple coins</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>24–48 Hour Grace Window:</strong> Streaks operate on a flexible 24–48 hour window from your previous capture, accommodating diverse sleep schedules and international timezones.</li>
                    <li><strong>Emergency Streak Freeze:</strong> Every active smiler receives a replenishing Streak Freeze card (usable once per calendar week) to prevent streak breakage if an unforeseen event prevents a daily smile.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  4. Scratch Card Mechanics &amp; Append-Only Coin Ledger
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Open Smile employs an engaging scratch-and-reveal reward loop:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Server-Locked Outcome:</strong> Scratch cards contain values determined and cryptographically locked on the server prior to being rendered. The user scratches the card to reveal the outcome with tactile animations and sound effects.</li>
                    <li><strong>Append-Only Accounting:</strong> Once scratched, coins are credited via an immutable row insert into <code>coin_ledger</code>. Balances are derived from <code>SUM(coins)</code>, eliminating balance desynchronization or tampering.</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Award className="size-5 text-primary" />
                  5. Leaderboard &amp; Midnight Settlements
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Rankings update in real time across Daily, Weekly, and Monthly cycles:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Midnight Settlement Cron:</strong> At 00:00 UTC daily, the platform executes an automated settlement transaction that captures final podium positions.</li>
                    <li><strong>Podium Bonus Cards:</strong> Rank 1 (Gold), Rank 2 (Silver), and Rank 3 (Bronze) smilers automatically receive exclusive bonus scratch cards in their reward inventory.</li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  6. Referral Network Policy
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Every member receives a referral link (<code>?ref=CODE</code>). To prevent fraud:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>First-Capture Gate:</strong> Zero coins are credited upon mere registration. Referral bonuses for both the referrer and referred friend unlock ONLY after the invited friend completes their first verified facial capture.</li>
                    <li><strong>Daily Cap:</strong> Referrers can earn bonuses on up to 5 successful referral completions per day.</li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <ShieldAlert className="size-5 text-destructive" />
                  7. Violations &amp; Penalties
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Attempts to compromise the platform or defraud the reward pool trigger automated sanctions:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Spoof Detection:</strong> Submitting static screen playback, photo prints, or virtual camera feeds triggers immediate capture rejection.</li>
                    <li><strong>Duplicate Hashes:</strong> Photos matching previously submitted frames (via pHash Hamming distance &le; 5) are rejected.</li>
                    <li><strong>Penalty Actions:</strong> Repeat violations result in automated account banning, revocation of unredeemed coins, and cancellation of any pending voucher redemptions.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
