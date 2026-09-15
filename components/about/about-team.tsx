import React from "react";
import Image from "next/image";
import { Users, Terminal } from "lucide-react";

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  focus: string;
  bgColor: string;
  illustration: React.ReactNode;
  tags: string[];
  bio: string;
}

const RESPONSIVE_IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 240px";

export const teamMembers: TeamMemberData[] = [
  {
    id: "sohan",
    name: "Sohan",
    role: "Database Architect",
    focus: "Postgres & Ledger Integrity",
    bgColor: "bg-[#F9D0A8]",
    illustration: (
      <Image
        src="/open-smile-sohan.webp"
        alt="Sohan"
        width={438}
        height={570}
        sizes={RESPONSIVE_IMAGE_SIZES}
        className="h-full w-full object-contain object-bottom mb-16"
        loading="lazy"
        decoding="async"
      />
    ),
    tags: ["Postgres", "Coin Ledger", "Supabase"],
    bio: "Guarding our append-only database ledger so every single earned coin is immutable, verifiable, and fraud-proof.",
  },
  {
    id: "ayushi",
    name: "Ayushi",
    role: "Cloud & Infra",
    focus: "Zero-Retention Media & Edge",
    bgColor: "bg-[#E5D4F8]",
    illustration: (
      <Image
        src="/open-smile-ayushi.webp"
        alt="Ayushi"
        width={438}
        height={570}
        sizes={RESPONSIVE_IMAGE_SIZES}
        className="h-full w-full object-contain object-bottom mb-16"
        loading="lazy"
        decoding="async"
      />
    ),
    tags: ["Vercel Edge", "ImageKit", "24h Purge"],
    bio: "Architecting ephemeral cloud pipelines with strict 24-hour auto-purging to ensure no facial data ever stays in the cloud.",
  },
  {
    id: "roni",
    name: "Roni",
    role: "Frontend & UI/UX Lead",
    focus: "Neubrutalism & Interactions",
    bgColor: "bg-[#BEE4F8]",
    illustration: (
      <Image
        src="/open-smile-roni.webp"
        alt="Roni"
        width={438}
        height={570}
        sizes={RESPONSIVE_IMAGE_SIZES}
        className="h-full w-full object-contain object-bottom mb-16"
        loading="lazy"
        decoding="async"
      />
    ),
    tags: ["Next.js 15", "Tailwind v4", "PWA"],
    bio: "Designing the signature soft neubrutalist interface, tactile physics, scratch card reveals, and responsive web experience.",
  },
  {
    id: "akash",
    name: "Akash",
    role: "Backend & Game Engine",
    focus: "Anti-Cheat & Streaks",
    bgColor: "bg-[#FEEAA2]",
    illustration: (
      <Image
        src="/open-smile-akash.webp"
        alt="Akash"
        width={438}
        height={570}
        sizes={RESPONSIVE_IMAGE_SIZES}
        className="h-full w-full object-contain object-bottom mb-16"
        loading="lazy"
        decoding="async"
      />
    ),
    tags: ["FastAPI", "Rate Limits", "Game Rules"],
    bio: "Building the real-time scoring verification, referral gates, and anti-farming protections that keep rewards fair.",
  },
  {
    id: "subal",
    name: "Subal",
    role: "AI & Computer Vision",
    focus: "On-Device Facial AI",
    bgColor: "bg-[#C6EED5]",
    illustration: (
      <Image
        src="/open-smile-subal.webp"
        alt="Subal"
        width={438}
        height={570}
        sizes={RESPONSIVE_IMAGE_SIZES}
        className="h-full w-full object-contain object-bottom mb-16"
        loading="lazy"
        decoding="async"
      />
    ),
    tags: ["MediaPipe", "WASM", "478 Landmarks"],
    bio: "Fine-tuning client-side 3D facial landmark detection and Duchenne smile algorithms running 100% locally in the browser.",
  },
];

export function AboutTeam() {
  return (
    <section
      id="team"
      aria-label="Meet our team"
      className="relative w-full overflow-hidden border-b-[length:var(--border-width)] border-black bg-[#F6CCD6] py-16 sm:py-24 dark:border-white dark:bg-[#201821]"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-[#181829] pl-3 pr-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-brutal-xs dark:border-white">
            <Users className="size-3.5 text-accent shrink-0" />
            <span>The Team Behind Open Smile</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase text-balance">
            Meet the 5 Creators
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base font-semibold text-foreground/85 text-pretty dark:text-muted-foreground">
            A tight-knit crew combining on-device computer vision, resilient cloud infrastructure, transactional database design, and tactile neubrutalist UI.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group relative flex flex-col justify-between overflow-hidden border-[length:var(--border-width)] border-black rounded-[24px] bg-card p-3 shadow-brutal-lg will-change-transform transition-[transform,box-shadow] duration-200 ease-out  active:scale-[0.98] active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm dark:border-white dark:bg-card"
            >
              <div
                className={`relative flex h-[320px] sm:h-[340px] lg:h-[320px] xl:h-[350px] w-full flex-col justify-end overflow-hidden border-[length:var(--border-width)] border-black rounded-[12px] ${member.bgColor} p-2 dark:border-white/20`}
              >
                <div className="absolute inset-0 flex items-center justify-center will-change-transform transition-transform duration-300 group-hover:scale-105">
                  {member.illustration}
                </div>

                <div className="relative z-10 w-full overflow-hidden border-[length:var(--border-width)] border-black rounded-[4px] bg-[#181829] text-center shadow-brutal-sm will-change-transform transition-transform duration-200 group-hover:scale-[1.02] dark:border-white/20">
                  <div className="px-3 py-1.5 sm:py-2">
                    <h3 className="font-sans text-base sm:text-lg font-extrabold tracking-tight text-white text-balance">
                      {member.name}
                    </h3>
                  </div>

                  <div className="border-t-[length:var(--border-width)] border-black bg-card px-2.5 py-1 dark:border-white/20 dark:bg-white">
                    <p className="font-mono text-[11px] font-black tracking-wider text-card-foreground uppercase sm:text-xs text-pretty dark:text-black">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 border-[length:var(--border-width)] border-black rounded-xl bg-card pl-4 pr-5 py-3 shadow-brutal-sm dark:border-white">
            <Terminal className="size-4 text-primary shrink-0" />
            <span className="font-mono text-xs font-bold text-foreground">
              Built for <span className="text-primary font-black">AI Unleashed</span> · Distributed engineering across 5 disciplines
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
