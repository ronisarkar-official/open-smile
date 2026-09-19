import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";
import {
  ShieldAlert,
  Lock,
  Database,
  Cpu,
  Server,
  FileCode,
  CheckCircle2,
  Mail,
} from "lucide-react";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "https://open-smile.vercel.app";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Security & Vulnerability Disclosure · Open Smile",
  description:
    "Explore the security architecture of Open Smile: client-side ML isolation, append-only financial ledgers, DB-backed rate limiting, and our responsible vulnerability disclosure guidelines.",
  alternates: {
    canonical: "/security",
  },
  openGraph: {
    title: "Security & Vulnerability Disclosure · Open Smile",
    description:
      "Explore the security architecture of Open Smile: client-side ML isolation, append-only financial ledgers, and vulnerability disclosure guidelines.",
    url: `${baseUrl}/security`,
    images: ["/open-smile_default-image.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security & Vulnerability Disclosure · Open Smile",
    description:
      "Explore the security architecture of Open Smile and responsible disclosure guidelines.",
    images: ["/open-smile_default-image.webp"],
  },
};

const securitySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/security#webpage`,
      url: `${baseUrl}/security`,
      name: "Open Smile Security & Vulnerability Disclosure",
      description:
        "Official platform security architecture documentation and responsible disclosure program for Open Smile.",
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
          name: "Security",
          item: `${baseUrl}/security`,
        },
      ],
    },
  ],
};

export default function SecurityPage() {
  const lastUpdated = "September 18, 2026";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(securitySchema) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Header Hero */}
        <section className="relative w-full border-b-[length:var(--border-width)] border-black bg-[#F6CCD6] py-12 sm:py-16 dark:border-white dark:bg-[#30161E]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-[#181829] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-brutal-xs dark:border-white">
              <ShieldAlert className="size-3.5 text-accent" />
              <span>Platform Defense &amp; Responsible Disclosure</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground text-balance">
              Security Architecture
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-semibold text-foreground/85 dark:text-muted-foreground leading-relaxed text-pretty">
              Open Smile is engineered with defense-in-depth: on-device biometric isolation, append-only financial ledgers, and database-backed rate limiting.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border-[length:var(--border-width)] border-black bg-card px-3 py-1 font-mono text-xs font-bold text-foreground shadow-brutal-xs dark:border-white">
              <span>Security Baseline: {lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* 4 Architectural Defense Pillars */}
        <section className="border-b-[length:var(--border-width)] border-black bg-card py-10 dark:border-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#C6EED5] p-5 shadow-brutal-sm dark:border-white dark:bg-[#142A1D]">
                <Cpu className="size-6 text-success" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Client-Side Isolation
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Computer vision models execute in client WASM sandbox; video data never leaves browser RAM.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#BEE4F8] p-5 shadow-brutal-sm dark:border-white dark:bg-[#152535]">
                <Database className="size-6 text-primary" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Append-Only Ledger
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Balances are derived via SUM(coins). Direct mutation of balances is mathematically prevented.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#FDF8D4] p-5 shadow-brutal-sm dark:border-white dark:bg-[#2A2615]">
                <Server className="size-6 text-warning" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  DB-Backed Rate Limits
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  Rate limits survive serverless cold starts in Postgres, preventing brute-force OTP attempts.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#E5D4F8] p-5 shadow-brutal-sm dark:border-white dark:bg-[#1E1727]">
                <Lock className="size-6 text-secondary" />
                <h3 className="mt-3 font-heading text-sm font-black uppercase text-foreground">
                  Hashed Credentials
                </h3>
                <p className="mt-1.5 text-xs font-semibold text-foreground/80 dark:text-muted-foreground">
                  One-time verification codes and auth tokens are hashed before persisting in storage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deep Dive Security Layers */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10 text-sm sm:text-base leading-relaxed">

              {/* Section 1 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Database className="size-5 text-primary" />
                  1. Financial-Grade Ledger Integrity
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Because Open Smile coins convert into real-world gift cards, our database layer treats coin operations with banking-grade integrity:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>No Mutable Balance Column:</strong> Many gaming apps use a single <code>coins: 1500</code> column subject to race conditions and double-credit bugs. Open Smile strictly requires an <code>INSERT</code> into <code>coin_ledger</code> with a mandatory categorized <code>reason</code>.</li>
                    <li><strong>Cryptographic Pre-Locking:</strong> Rewards revealed via scratch cards are generated and transactionally locked on the server prior to being presented to the user. A client cannot alter or spoof the awarded amount.</li>
                    <li><strong>ACID Voucher Redemption:</strong> Redemptions verify current balance, create an audit record, and insert a negative ledger entry inside an atomic database transaction.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <FileCode className="size-5 text-primary" />
                  2. Web Application Hardening &amp; Headers
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    The Next.js edge gateway enforces strict security headers on every request:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Content Security Policy (CSP):</strong> Restricts script execution to trusted domains, disables unauthorized vendor script injection, and enables WebAssembly execution (<code>wasm-unsafe-eval</code>).</li>
                    <li><strong>Frame Guard:</strong> <code>X-Frame-Options: DENY</code> protects smilers against clickjacking or malicious iframe embedding.</li>
                    <li><strong>Transport Security:</strong> Strict Transport Security (HSTS) enforces HTTPS with subdomains and preload.</li>
                    <li><strong>Permissions Policy:</strong> Restricts camera access strictly to <code>(self)</code>, disabling microphone, geolocation, and invasive browser APIs.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Lock className="size-5 text-primary" />
                  3. Authentication &amp; OTP Security
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Our authentication infrastructure combines Better Auth with a custom email verification layer:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>No Plaintext OTPs:</strong> One-time verification codes are hashed using cryptographic one-way functions before storage in <code>otp_codes</code>.</li>
                    <li><strong>Brute-Force Lockout:</strong> OTP verification attempts are incremented and capped at 5 attempts max. Exceeding attempts invalidates the code immediately.</li>
                    <li><strong>Scheduled Purges:</strong> Expired OTP codes and rate-limit counters are cleared nightly via automated cron jobs.</li>
                    <li><strong>Parameterized SQL:</strong> All queries use strict parameterized queries (<code>$1, $2, ...</code>). Direct inline SQL concatenation is prohibited across the entire codebase.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <ShieldAlert className="size-5 text-primary" />
                  4. Responsible Vulnerability Disclosure Program
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    We welcome security researchers and ethical hackers to responsibly report potential vulnerabilities.
                  </p>
                  
                  <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#FDF8D4] p-4 text-black dark:border-white">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                      Safe Harbor Policy:
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      We will not take legal action against researchers who make a good-faith effort to avoid privacy violations, data destruction, and service interruption during vulnerability testing.
                    </p>
                  </div>

                  <h3 className="font-heading text-sm font-black uppercase text-foreground mt-4">In Scope</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Ledger tampering or double-spending vulnerabilities in <code>coin_ledger</code></li>
                    <li>Authentication bypasses or session impersonation</li>
                    <li>Severe anti-cheat bypasses that compromise reward economy balance</li>
                    <li>Remote code execution (RCE) or SQL injection vulnerabilities</li>
                  </ul>

                  <h3 className="font-heading text-sm font-black uppercase text-foreground mt-4">Out of Scope</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Denial of Service (DoS/DDoS) attacks against our infrastructure</li>
                    <li>Social engineering or phishing targeting Open Smile team members</li>
                    <li>Spamming email delivery services</li>
                  </ul>

                  <h3 className="font-heading text-sm font-black uppercase text-foreground mt-4">How to Report</h3>
                  <p>
                    Please submit a detailed advisory including reproduction steps, proof-of-concept payloads, and risk assessment:
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-xl border-[length:var(--border-width)] border-black bg-primary px-5 py-2.5 font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-xs transition-all dark:border-white"
                    >
                      <Mail className="size-3.5" />
                      Submit Vulnerability Report
                    </Link>
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      Guaranteed acknowledgment within 24 hours
                    </span>
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
