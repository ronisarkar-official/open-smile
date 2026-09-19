import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";
import {
  Cookie,
  ShieldCheck,
  Lock,
  Sliders,
  HardDrive,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "https://open-smile.vercel.app";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Cookie Policy · Open Smile — Transparency & Local Storage",
  description:
    "Learn how Open Smile uses essential authentication cookies, local storage for theme preferences, and offline caching for on-device AI models. Zero advertising trackers.",
  alternates: {
    canonical: "/cookies",
  },
  openGraph: {
    title: "Cookie Policy · Open Smile — Transparency & Local Storage",
    description:
      "Learn how Open Smile uses essential authentication cookies and zero third-party advertising trackers.",
    url: `${baseUrl}/cookies`,
    images: ["/open-smile_default-image.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy · Open Smile",
    description:
      "Learn how Open Smile uses essential cookies and zero advertising trackers.",
    images: ["/open-smile_default-image.webp"],
  },
};

const cookieSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/cookies#webpage`,
      url: `${baseUrl}/cookies`,
      name: "Open Smile Cookie & Storage Policy",
      description:
        "Official cookie, local storage, and offline cache transparency disclosures for Open Smile.",
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
          name: "Cookie Policy",
          item: `${baseUrl}/cookies`,
        },
      ],
    },
  ],
};

export default function CookiePolicyPage() {
  const lastUpdated = "September 18, 2026";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cookieSchema) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Header Hero */}
        <section className="relative w-full border-b-[length:var(--border-width)] border-black bg-[#BEE4F8] py-12 sm:py-16 dark:border-white dark:bg-[#152535]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-[#181829] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-brutal-xs dark:border-white">
              <Cookie className="size-3.5 text-accent" />
              <span>Storage &amp; Cookie Disclosures</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground text-balance">
              Cookie &amp; Storage Policy
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-semibold text-foreground/85 dark:text-muted-foreground leading-relaxed text-pretty">
              We respect your digital footprint. Open Smile uses strictly necessary session cookies and offline storage to make the app work. <strong>No third-party tracking or ad pixels.</strong>
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border-[length:var(--border-width)] border-black bg-card px-3 py-1 font-mono text-xs font-bold text-foreground shadow-brutal-xs dark:border-white">
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* Quick Comparison Banner */}
        <section className="border-b-[length:var(--border-width)] border-black bg-card py-8 dark:border-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#C6EED5] p-4 shadow-brutal-sm dark:border-white dark:bg-[#142A1D]">
                <div className="flex items-center gap-2 font-heading text-sm font-black uppercase text-foreground">
                  <CheckCircle2 className="size-5 text-success" />
                  What We Use
                </div>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground/80 dark:text-muted-foreground">
                  Secure Better Auth session cookies, theme preferences, and offline service worker caching for 100% on-device MediaPipe facial models.
                </p>
              </div>

              <div className="rounded-xl border-[length:var(--border-width)] border-black bg-[#F6CCD6] p-4 shadow-brutal-sm dark:border-white dark:bg-[#30161E]">
                <div className="flex items-center gap-2 font-heading text-sm font-black uppercase text-foreground">
                  <XCircle className="size-5 text-destructive" />
                  What We Never Use
                </div>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground/80 dark:text-muted-foreground">
                  Zero third-party advertising cookies, zero Meta/Google retargeting pixels, and zero cross-site behavioral tracking scripts.
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
                  <Lock className="size-5 text-primary" />
                  1. Essential Authentication Cookies
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    These cookies are strictly required to verify your identity, secure your login state, and ensure safe access to your rewards:
                  </p>
                  <div className="overflow-x-auto my-3">
                    <table className="w-full border-collapse border-[length:var(--border-width)] border-black text-left text-xs font-mono dark:border-white">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border-[length:var(--border-width)] border-black p-2.5 font-bold uppercase dark:border-white">Cookie Name</th>
                          <th className="border-[length:var(--border-width)] border-black p-2.5 font-bold uppercase dark:border-white">Purpose</th>
                          <th className="border-[length:var(--border-width)] border-black p-2.5 font-bold uppercase dark:border-white">Lifespan</th>
                          <th className="border-[length:var(--border-width)] border-black p-2.5 font-bold uppercase dark:border-white">Security Flags</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b-[length:var(--border-width)] border-black dark:border-white">
                          <td className="p-2.5 font-bold text-primary">better-auth.session_token</td>
                          <td className="p-2.5">Stores active session token verified against database</td>
                          <td className="p-2.5">30 Days</td>
                          <td className="p-2.5 font-bold text-success">Secure, HttpOnly, SameSite=Lax</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-primary">better-auth.state</td>
                          <td className="p-2.5">OAuth state validation for Google and GitHub sign-in</td>
                          <td className="p-2.5">Session</td>
                          <td className="p-2.5 font-bold text-success">Secure, HttpOnly, SameSite=Lax</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Sliders className="size-5 text-primary" />
                  2. Functional Preferences (Local Storage)
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Rather than writing persistent tracking cookies, Open Smile uses your browser&apos;s standard <code>localStorage</code> to remember interface settings:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>theme:</strong> Remembers your light, dark, or system color preferences so your eyes aren&apos;t blinded upon page reload.</li>
                    <li><strong>sound-enabled:</strong> Remembers whether you have muted the scratch card and podium audio celebrations.</li>
                    <li><strong>pwa-dismissed:</strong> Remembers if you dismissed the mobile app install prompt so it doesn&apos;t repeatedly bother you.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <HardDrive className="size-5 text-primary" />
                  3. Offline Model Caching (CacheStorage &amp; Service Worker)
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    To enable instant webcam smile detection without waiting for multi-megabyte downloads every time you open the app:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Our Service Worker (<code>public/sw.js</code>) caches the Google MediaPipe WebAssembly engine and <code>face_landmarker.task</code> in your browser&apos;s local <strong>CacheStorage</strong>.</li>
                    <li>This cache operates 100% locally on your computer or phone, ensuring the app launches instantly and can even run offline.</li>
                    <li>This stored cache contains machine learning weights, never personal or facial imagery.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  4. Privacy-Preserving Performance Telemetry
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    We use <strong>Vercel Analytics &amp; Speed Insights</strong> to monitor frontend page load speeds, Core Web Vitals (INP, LCP, CLS), and server error rates.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>This telemetry does not use persistent identifying cookies.</li>
                    <li>Data is aggregated across anonymous sessions to diagnose bugs and optimize WASM initialization times.</li>
                    <li>We do not correlate telemetry data with your personal email or smile captures.</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="rounded-2xl border-[length:var(--border-width)] border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <HelpCircle className="size-5 text-primary" />
                  5. Managing Your Browser Storage
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    You have total control over cookies and local storage directly within your browser settings:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Clearing Cookies:</strong> You can clear all cookies at any time via your browser settings. Doing so will log you out of your Open Smile session until you sign in again.</li>
                    <li><strong>Disabling Cookies:</strong> If you block all cookies, you will not be able to log into Open Smile or redeem vouchers, though you can still preview the landing page.</li>
                  </ul>
                  <div className="mt-6">
                    <Link
                      href="/privacy"
                      className="inline-flex items-center gap-2 rounded-xl border-[length:var(--border-width)] border-black bg-card px-5 py-2.5 font-mono text-xs font-black uppercase text-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-xs transition-all dark:border-white"
                    >
                      Read Full Privacy Policy
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
