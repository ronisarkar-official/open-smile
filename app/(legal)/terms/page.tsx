import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";
import {
  FileCheck,
  AlertCircle,
  Coins,
  ShieldBan,
  Gift,
  Scale,
  UserCheck,
  RefreshCw,
} from "lucide-react";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "https://open-smile.vercel.app";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Terms and Conditions · Open Smile — Platform Agreement & Fair Play",
  description:
    "Read the official Terms and Conditions for Open Smile, governing account registration, on-device smile capture, reward coin economy, voucher redemptions, and anti-cheat policies.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms and Conditions · Open Smile — Platform Agreement & Fair Play",
    description:
      "Read the official Terms and Conditions for Open Smile, governing account registration, on-device smile capture, reward coin economy, and voucher redemptions.",
    url: `${baseUrl}/terms`,
    images: ["/open-smile_default-image.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions · Open Smile",
    description:
      "Read the official Terms and Conditions for Open Smile.",
    images: ["/open-smile_default-image.webp"],
  },
};

const termsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/terms#webpage`,
      url: `${baseUrl}/terms`,
      name: "Open Smile Terms and Conditions",
      description:
        "Official user agreement, coin economy terms, and anti-cheat policies for Open Smile.",
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
          name: "Terms and Conditions",
          item: `${baseUrl}/terms`,
        },
      ],
    },
  ],
};

export default function TermsPage() {
  const lastUpdated = "September 18, 2026";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Header Hero */}
        <section className="relative w-full border-b-[length:var(--border-width)] border-black bg-[#FDF8D4] py-12 sm:py-16 dark:border-white dark:bg-[#1E1B18]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-[#181829] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-brutal-xs dark:border-white">
              <FileCheck className="size-3.5 text-accent" />
              <span>User Agreement &amp; Platform Rules</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground text-balance">
              Terms &amp; Conditions
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-semibold text-muted-foreground leading-relaxed text-pretty">
              Please review these terms carefully before participating in the Open Smile reward economy, capturing smiles, or redeeming vouchers.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border-[length:var(--border-width)] border-black bg-card px-3 py-1 font-mono text-xs font-bold text-foreground shadow-brutal-xs dark:border-white">
              <span>Effective Date: {lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* 4 Summary Highlight Cards */}
        <section className="border-b-[length:var(--border-width)] border-black bg-card py-10 dark:border-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#C6EED5] p-5 shadow-brutal-sm dark:border-white dark:bg-[#142A1D]">
                <Coins className="size-6 text-success" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Coins Are Promotional
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Coins have zero cash value outside Open Smile and can only be redeemed for active catalog vouchers.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#F6CCD6] p-5 shadow-brutal-sm dark:border-white dark:bg-[#30161E]">
                <ShieldBan className="size-6 text-destructive" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Zero Tolerance Cheating
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Using photos, deepfakes, emulators, or multi-accounting results in immediate permanent ban and forfeiture.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#BEE4F8] p-5 shadow-brutal-sm dark:border-white dark:bg-[#152535]">
                <UserCheck className="size-6 text-primary" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  1 Account Per Smiler
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Sybil farming and automated bot referrals are strictly prohibited and locked by our anti-cheat engine.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#E5D4F8] p-5 shadow-brutal-sm dark:border-white dark:bg-[#1E1727]">
                <Gift className="size-6 text-secondary" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Retailer Vouchers
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Amazon, Flipkart, Swiggy, and Apple are trademarks of their respective owners. We are not an issuer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Articles */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10 text-sm sm:text-base leading-relaxed">

              {/* Section 1 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Scale className="size-5 text-primary" />
                  1. Acceptance of Terms
                </h2>
                <p className="mt-4 font-medium text-foreground/90">
                  By creating an account, accessing the Open Smile website or Progressive Web App, enabling your camera for smile scoring, or participating in the rewards program, you agree to be bound by these Terms and Conditions and our accompanying <Link href="/privacy" className="text-primary underline font-bold">Privacy Policy</Link>. If you do not agree to all terms, you must cease use of the service immediately.
                </p>
              </div>

              {/* Section 2 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <UserCheck className="size-5 text-primary" />
                  2. Eligibility &amp; Account Responsibility
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    You must be at least 13 years old (or the legal age of digital consent in your jurisdiction) to use Open Smile. If you are under 18, you represent that your legal guardian has reviewed and agreed to these terms on your behalf.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Accurate Registration:</strong> You must provide an authentic email address. Accounts verified via temporary disposable email domains may be pruned without notice.</li>
                    <li><strong>Account Security:</strong> You are solely responsible for safeguarding your credentials, OTP verification emails, and any activity occurring under your account.</li>
                    <li><strong>Single Identity Rule:</strong> Each individual user is permitted exactly one active account. Creating multiple dummy accounts to farm signup bonuses or self-refer is a material violation of these Terms.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Coins className="size-5 text-primary" />
                  3. The Open Smile Economy &amp; In-Game Currency
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Open Smile features a gamified token economy powered by an immutable, append-only ledger (<code>coin_ledger</code>).
                  </p>
                  <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#FDF8D4] p-4 text-black dark:border-white">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                      Legal Nature of Open Smile Coins:
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      Open Smile Coins are promotional virtual loyalty points with no direct monetary or fiat currency value. They cannot be sold, exchanged, transferred, or purchased for real money.
                    </p>
                  </div>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Server-Side Calculations:</strong> Coin awards, streak multipliers (up to 3.0x), and scratch card contents are calculated and committed server-side. The interactive scratch card component is a graphical reveal of an already-decided reward.</li>
                    <li><strong>Ledger Balance:</strong> User coin balances are derived solely from the mathematical sum of transaction rows in <code>coin_ledger</code>. We reserve the right to correct ledger anomalies caused by bugs, downtime, or exploited glitches.</li>
                    <li><strong>Expiration:</strong> Inactive accounts (no captures or logins for 12 consecutive months) may have their unredeemed coin balances retired upon advance notice.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <ShieldBan className="size-5 text-destructive" />
                  4. Anti-Cheat &amp; Prohibited Conduct
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    To protect the integrity of the platform and reward real human smilers, we enforce automated anti-cheat systems. You agree not to engage in any of the following prohibited actions:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Presenting printed photographs, mobile screens, monitor playback, or 3D sculptures to the camera in place of your living face.</li>
                    <li>Employing synthetic media, deepfakes, virtual webcam drivers, or automated scripts to simulate facial landmarks.</li>
                    <li>Bypassing or modifying client-side WebAssembly binaries, liveness detection, or perceptual hashing checks.</li>
                    <li>Attempting to manipulate capture cooldown timers or daily capture caps via API tampering.</li>
                    <li>Sybil-farming referral bonuses through bots, paid click farms, or automated identity generators.</li>
                  </ul>
                  <p className="font-semibold text-destructive">
                    Violation of anti-cheat rules results in immediate account termination, blacklisting of associated devices and IP ranges, and full revocation of unredeemed coins and vouchers.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Gift className="size-5 text-primary" />
                  5. Voucher Redemption &amp; Third-Party Retailers
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Users with sufficient verified coins may redeem digital gift vouchers (e.g., Amazon, Flipkart, Swiggy, Apple) from the in-app Rewards Catalog.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Redemption Finality:</strong> All voucher claims are final and non-refundable once the digital redemption code is revealed.</li>
                    <li><strong>Retailer Terms:</strong> Vouchers are issued subject to the terms and conditions of the respective third-party merchant. Open Smile is not responsible for lost, stolen, or expired merchant codes once successfully issued.</li>
                    <li><strong>Trademark Disclaimer:</strong> Amazon, Apple, Swiggy, Flipkart, and Google are trademarks of their respective brand owners. Their appearance in the rewards catalog does not imply sponsorship, partnership, or affiliation with Open Smile.</li>
                    <li><strong>Inventory Availability:</strong> Voucher availability is subject to platform inventory limits and periodic restocking schedules.</li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <RefreshCw className="size-5 text-primary" />
                  6. Opt-In Explore Community Feed
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    If you choose to publish a smile to the public Explore feed:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>You grant Open Smile a temporary, non-exclusive license to display your photo preview on the public feed for 24 hours.</li>
                    <li>You warrant that the photograph depicts yourself and does not infringe upon any third party&apos;s privacy or likeness rights.</li>
                    <li>You agree not to post content containing nudity, hate speech, harassment, illegal acts, or offensive material. Violating posts will be removed immediately by administrators, and the poster will be banned.</li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <AlertCircle className="size-5 text-primary" />
                  7. Disclaimers &amp; Limitation of Liability
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Open Smile is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied.
                  </p>
                  <p>
                    In no event shall Open Smile, its founders, or contributors be liable for any indirect, incidental, special, consequential, or punitive damages arising from your access to or inability to access the service, including without limitation camera incompatibility, lost streaks due to internet outages, or third-party retailer voucher processing delays.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Scale className="size-5 text-primary" />
                  8. Modifications &amp; Contact
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    We reserve the right to modify these Terms and Conditions at any time. We will indicate revisions by updating the &quot;Effective Date&quot; at the top of this document. Continued use of Open Smile following revisions indicates your acceptance.
                  </p>
                  <div className="mt-4 inline-flex flex-wrap items-center gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-xl border-[length:var(--border-width)] border-black bg-primary px-5 py-2.5 font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-xs transition-all dark:border-white"
                    >
                      Questions About Terms?
                    </Link>
                    <Link
                      href="/rules"
                      className="inline-flex items-center gap-2 rounded-xl border-[length:var(--border-width)] border-black bg-card px-5 py-2.5 font-mono text-xs font-black uppercase text-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-xs transition-all dark:border-white"
                    >
                      View Game Rules &amp; Policies
                    </Link>
                  </div>
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
