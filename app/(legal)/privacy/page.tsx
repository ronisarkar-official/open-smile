import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";
import {
  ShieldCheck,
  EyeOff,
  Clock,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "https://open-smile.vercel.app";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Privacy Policy · Open Smile — On-Device Biometric AI & Data Protection",
  description:
    "Learn how Open Smile protects your privacy with 100% on-device facial AI, a strict 24-hour auto-delete policy on shared media, and zero cloud retention of raw biometric video.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy · Open Smile — On-Device Biometric AI & Data Protection",
    description:
      "Learn how Open Smile protects your privacy with 100% on-device facial AI, a strict 24-hour auto-delete policy on shared media, and zero cloud retention of raw biometric video.",
    url: `${baseUrl}/privacy`,
    images: ["/open-smile_default-image.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy · Open Smile",
    description:
      "Learn how Open Smile protects your privacy with 100% on-device facial AI and zero biometric retention.",
    images: ["/open-smile_default-image.webp"],
  },
};

const privacySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/privacy#webpage`,
      url: `${baseUrl}/privacy`,
      name: "Open Smile Privacy Policy",
      description:
        "Official privacy policy and biometric data processing disclosures for Open Smile.",
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
          name: "Privacy Policy",
          item: `${baseUrl}/privacy`,
        },
      ],
    },
  ],
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 18, 2026";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />

      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full border-b-(length:--border-width) border-black bg-[#E5D4F8] py-12 sm:py-16 dark:border-white dark:bg-[#1E1727]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 border-(length:--border-width) border-black rounded-md bg-[#181829] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-brutal-xs dark:border-white">
              <ShieldCheck className="size-3.5 text-accent" />
              <span>Biometric Protection &amp; Compliance</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground text-balance">
              Privacy Policy
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-semibold text-foreground/80 dark:text-muted-foreground leading-relaxed text-pretty">
              Our core promise is simple: <strong>we do not retain your face</strong>. Your camera feed is processed directly inside your browser and never touches our servers.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border-(length:--border-width) border-black bg-card px-3 py-1 font-mono text-xs font-bold text-foreground shadow-brutal-xs dark:border-white">
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </section>

        {/* Core Privacy Pillars Bento */}
        <section className="border-b-(length:--border-width) border-black bg-card py-10 dark:border-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground mb-8">
              The 4 Open Smile Privacy Pillars
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col justify-between rounded-xl border-(length:--border-width) border-black bg-[#BEE4F8] p-5 shadow-brutal-sm dark:border-white dark:bg-[#152535]">
                <div>
                  <div className="flex size-10 items-center justify-center rounded-lg border-(length:--border-width) border-black bg-white shadow-brutal-xs dark:border-white dark:bg-black">
                    <EyeOff className="size-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-black uppercase tracking-tight text-foreground">
                    100% On-Device AI
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground/85 dark:text-muted-foreground">
                    MediaPipe WASM processes 478 3D facial landmarks locally in your browser. Raw camera frames never leave your device.
                  </p>
                </div>
                <div className="mt-4 border-t-(length:--border-width) border-black/20 pt-2 font-mono text-[10px] font-bold text-foreground/70 uppercase">
                  Zero Cloud Biometrics
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border-(length:--border-width) border-black bg-[#FDF8D4] p-5 shadow-brutal-sm dark:border-white dark:bg-[#2A2615]">
                <div>
                  <div className="flex size-10 items-center justify-center rounded-lg border-(length:--border-width) border-black bg-white shadow-brutal-xs dark:border-white dark:bg-black">
                    <Clock className="size-5 text-warning" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-black uppercase tracking-tight text-foreground">
                    24h Auto-Purge
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground/85 dark:text-muted-foreground">
                    Photos shared to the opt-in Explore community feed automatically self-destruct after 24 hours via strict cloud storage lifecycle policies.
                  </p>
                </div>
                <div className="mt-4 border-t-(length:--border-width) border-black/20 pt-2 font-mono text-[10px] font-bold text-foreground/70 uppercase">
                  Ephemeral Media
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border-(length:--border-width) border-black bg-[#C6EED5] p-5 shadow-brutal-sm dark:border-white dark:bg-[#142A1D]">
                <div>
                  <div className="flex size-10 items-center justify-center rounded-lg border-(length:--border-width) border-black bg-white shadow-brutal-xs dark:border-white dark:bg-black">
                    <Lock className="size-5 text-success" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-black uppercase tracking-tight text-foreground">
                    Irreversible Hashes
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground/85 dark:text-muted-foreground">
                    Anti-cheat prevents duplicate uploads using 64-bit perceptual hashes (pHash). It is mathematically impossible to reconstruct a face from a pHash.
                  </p>
                </div>
                <div className="mt-4 border-t-(length:--border-width) border-black/20 pt-2 font-mono text-[10px] font-bold text-foreground/70 uppercase">
                  Mathematical Non-Reversibility
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border-(length:--border-width) border-black bg-[#F6CCD6] p-5 shadow-brutal-sm dark:border-white dark:bg-[#30161E]">
                <div>
                  <div className="flex size-10 items-center justify-center rounded-lg border-(length:--border-width) border-black bg-white shadow-brutal-xs dark:border-white dark:bg-black">
                    <CheckCircle2 className="size-5 text-accent" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-black uppercase tracking-tight text-foreground">
                    Opt-In Only Sharing
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground/85 dark:text-muted-foreground">
                    Every smile capture is strictly private by default. Nothing is published or shared unless you explicitly click the Post to Explore button.
                  </p>
                </div>
                <div className="mt-4 border-t-(length:--border-width) border-black/20 pt-2 font-mono text-[10px] font-bold text-foreground/70 uppercase">
                  User Sovereignty
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Legal Content */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-sm sm:text-base leading-relaxed">
              
              {/* Section 1 */}
              <div className="rounded-2xl border-(length:--border-width) border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  1. Overview &amp; Our Privacy Commitment
                </h2>
                <p className="mt-4 text-foreground/90 font-medium">
                  Welcome to <strong>Open Smile</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). Open Smile is a gamified rewards platform that celebrates genuine human smiles. Because our service interacts with computer vision and facial geometry, we adhere to the highest standard of data minimization, transparent disclosure, and technical privacy-by-design.
                </p>
                <p className="mt-3 text-foreground/90 font-medium">
                  This Privacy Policy describes how we collect, use, and safeguard information when you visit our website, install our Progressive Web App (PWA), or use our smile-capture and voucher rewards ecosystem.
                </p>
              </div>

              {/* Section 2 */}
              <div className="rounded-2xl border-(length:--border-width) border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <EyeOff className="size-5 text-primary" />
                  2. Biometric Data &amp; Facial AI Processing
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Under laws such as the <strong>Illinois Biometric Information Privacy Act (BIPA)</strong>, <strong>Texas Capture or Use of Biometric Identifier Act (CUBI)</strong>, and <strong>GDPR Article 9</strong>, facial geometry data is classified as sensitive biometric data. Here is exactly how Open Smile handles it:
                  </p>
                  
                  <div className="my-4 rounded-xl border-(length:--border-width) border-black bg-[#FDF8D4] p-4 text-black dark:border-white">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                      Key Technical Invariant:
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      Open Smile DOES NOT receive, store, or transmit your raw video camera feed or biometric facial templates to our servers.
                    </p>
                  </div>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>On-Device Inference:</strong> Facial landmark detection is executed 100% on your local CPU/GPU using Google MediaPipe Tasks Vision compiled to WebAssembly (WASM).
                    </li>
                    <li>
                      <strong>Derived Scoring Only:</strong> The client calculates a normalized mathematical score between 0 and 100 based on relative distances (lip corners, eye aperture, mouth curvature). Only the single resulting integer score is sent to our servers to issue your game reward.
                    </li>
                    <li>
                      <strong>Liveness &amp; Anti-Spoofing:</strong> Natural blink detection and micro-head movements are verified entirely in client-side memory.
                    </li>
                    <li>
                      <strong>Perceptual Hashing (pHash):</strong> To block re-submitted identical photos, the client generates a 64-bit Discrete Cosine Transform (DCT) hash. A perceptual hash is a one-way mathematical fingerprint that cannot be reverse-engineered into an image or facial portrait.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="rounded-2xl border-(length:--border-width) border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Lock className="size-5 text-primary" />
                  3. Information We Collect
                </h2>
                <div className="mt-4 space-y-4 font-medium text-foreground/90">
                  <p>We only collect the minimum data necessary to operate our service, manage accounts, prevent fraud, and fulfill rewards:</p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border-(length:--border-width) border-black bg-muted/40 p-3.5 dark:border-white/20">
                      <h4 className="font-mono text-xs font-bold uppercase text-primary">Account Credentials</h4>
                      <p className="mt-1 text-xs">
                        Email address, display name/username, and password hash (managed securely via Better Auth). If you use social sign-in (Google/GitHub), we receive your basic public profile identifier.
                      </p>
                    </div>

                    <div className="rounded-lg border-(length:--border-width) border-black bg-muted/40 p-3.5 dark:border-white/20">
                      <h4 className="font-mono text-xs font-bold uppercase text-primary">Economy &amp; Gameplay Ledger</h4>
                      <p className="mt-1 text-xs">
                        Smile score (0–100), capture timestamps, active habit streaks, coin transaction rows in our append-only <code>coin_ledger</code>, and claimed voucher codes.
                      </p>
                    </div>

                    <div className="rounded-lg border-(length:--border-width) border-black bg-muted/40 p-3.5 dark:border-white/20">
                      <h4 className="font-mono text-xs font-bold uppercase text-primary">Security &amp; Rate Limiting</h4>
                      <p className="mt-1 text-xs">
                        Hashed one-time passwords (OTPs), rate-limit counters, IP addresses for session abuse prevention, and client user-agent strings.
                      </p>
                    </div>

                    <div className="rounded-lg border-(length:--border-width) border-black bg-muted/40 p-3.5 dark:border-white/20">
                      <h4 className="font-mono text-xs font-bold uppercase text-primary">Opt-In Explore Posts</h4>
                      <p className="mt-1 text-xs">
                        If and only if you explicitly choose to publish a capture, we host the WebP image preview on ImageKit under a mandatory 24-hour auto-deletion policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="rounded-2xl border-(length:--border-width) border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <Clock className="size-5 text-primary" />
                  4. Ephemeral Media Storage &amp; 24h Purge Policy
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    We believe data retention is a liability, not an asset. When you opt-in to share a smile on the public Explore feed:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>The compressed preview image is transmitted directly to <strong>ImageKit</strong> using signed single-use cryptographic credentials.</li>
                    <li>The image is tagged with an automated expiration rule configured to purge the file permanently after <strong>24 hours</strong>.</li>
                    <li>Automated database cleanup crons purge orphan post references nightly at midnight UTC.</li>
                    <li>You may delete your Explore post at any time before the 24-hour expiration window directly from your profile.</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="rounded-2xl border-(length:--border-width) border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  5. How We Share &amp; Disclose Information
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    <strong>We never sell, rent, monetize, or trade your personal or facial information.</strong> We only share information with trusted infrastructure providers that facilitate platform operations:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Supabase (PostgreSQL):</strong> Unified transactional database hosting your account details, session records, and append-only coin ledger.</li>
                    <li><strong>ImageKit:</strong> Ephemeral CDN for temporary 24-hour public Explore photos.</li>
                    <li><strong>Vercel:</strong> Edge hosting, serverless execution, and analytics.</li>
                    <li><strong>SMTP / Nodemailer:</strong> Delivery of verification OTP codes and unrecognized login security notifications.</li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div className="rounded-2xl border-(length:--border-width) border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-primary" />
                  6. Your Privacy Rights (GDPR, CCPA &amp; Global)
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>Regardless of your geographic location, we provide full sovereignty over your personal data:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Right of Access &amp; Portability:</strong> You can view your lifetime smile capture count, coin history, and claimed vouchers directly in your dashboard.</li>
                    <li><strong>Right to Rectification:</strong> You can update your display name and profile settings at any time in Account Settings.</li>
                    <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request complete account deletion. Deleting your account initiates a cascading purge of your user record, active sessions, coin ledger entries, and any active Explore feed posts.</li>
                    <li><strong>Right to Withdraw Consent:</strong> Camera permissions can be revoked at any time via your browser settings.</li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div className="rounded-2xl border-(length:--border-width) border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <AlertTriangle className="size-5 text-primary" />
                  7. Children&apos;s Privacy
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    Open Smile is intended for individuals aged 13 and older (or 16 in certain European jurisdictions). We do not knowingly collect personal information from children under 13 without verified parental consent. If we become aware that a child under 13 has provided us with personal information, we immediately delete such records.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="rounded-2xl border-(length:--border-width) border-black bg-card p-6 sm:p-8 shadow-brutal-md dark:border-white">
                <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  <HelpCircle className="size-5 text-primary" />
                  8. Contact Our Privacy Team
                </h2>
                <div className="mt-4 space-y-3 font-medium text-foreground/90">
                  <p>
                    If you have questions, feedback, or wish to exercise your legal data rights, please contact our team:
                  </p>
                  <div className="mt-4 inline-flex flex-wrap items-center gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-xl border-(length:--border-width) border-black bg-primary px-5 py-2.5 font-mono text-xs font-black uppercase text-primary-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-xs transition-all dark:border-white"
                    >
                      Contact Support &amp; DPO
                    </Link>
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      Average response time: &lt; 24 hours
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
