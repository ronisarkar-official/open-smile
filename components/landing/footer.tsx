import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";

export interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLinkItem[];
}

export interface FooterProps {
  heading?: string;
  badgeText?: string;
  columns?: FooterColumn[];
  bottomLinks?: FooterLinkItem[];
  brandText?: string;
  className?: string;
}

export const defaultFooterColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Try Smile Check", href: "/try" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Live Leaderboard", href: "/leaderboard" },
      { label: "Explore Feed", href: "/explore" },
      { label: "Rewards & Vouchers", href: "/rewards" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Refer & Earn", href: "/refer" },
      { label: "Daily Streaks", href: "/dashboard" },
      { label: "Meet the Team", href: "#team" },
      { label: "Join Beta", href: "#beta" },
      { label: "Member Login", href: "/login" },
    ],
  },
  {
    title: "Privacy & AI",
    links: [
      { label: "On-Device Scoring", href: "#privacy" },
      { label: "24h Auto-Expiry", href: "#privacy" },
      { label: "Anti-Cheat Checks", href: "#how-it-works" },
      { label: "Zero Cloud Retention", href: "#privacy" },
    ],
  },
];

export const defaultBottomLinks: FooterLinkItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why it’s private", href: "#privacy" },
  { label: "Team", href: "#team" },
  { label: "Beta Waitlist", href: "#beta" },
  { label: "Start Smiling", href: "/try" },
];

export function Footer({
  heading = "Smile more. Win more.",
  badgeText = "On-Device Facial AI",
  columns = defaultFooterColumns,
  bottomLinks = defaultBottomLinks,
  brandText = "Open Smile",
  className = "",
}: FooterProps) {
  return (
    <footer
      aria-label="Site Footer"
      className={`w-full border-t-[length:var(--border-width)] border-black bg-background text-foreground transition-colors duration-200 dark:border-white ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 items-start">
          <div className="lg:col-span-5">
            {badgeText && (
              <span className="inline-flex border-[length:var(--border-width)] border-black rounded-md bg-accent px-2.5 py-0.5 text-xs font-mono font-bold tracking-[0.12em] text-accent-foreground uppercase mb-3.5">
                {badgeText}
              </span>
            )}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.05em] text-foreground text-balance">
              {heading}
            </h2>
            <p className="mt-4 max-w-[38ch] text-sm leading-6 text-muted-foreground font-medium">
              A private, on-device smile-scoring loop that turns genuine grins into coins, streaks, and real gift vouchers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 lg:col-span-7 lg:pl-8 xl:pl-12">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col">
                <h3 className="mb-4 font-mono text-xs font-bold tracking-[0.14em] uppercase text-foreground">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-all duration-150 hover:text-foreground hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="size-3.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="inline-block text-sm font-semibold text-muted-foreground transition-all duration-150 hover:text-foreground hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 sm:my-14 lg:my-18 flex w-full justify-center text-center overflow-visible select-none py-2">
          <svg
            viewBox="0 0 950 145"
            className="w-full h-auto max-h-[180px] overflow-visible select-none"
            aria-label={brandText}
          >
            <text
              x="50%"
              y="112"
              textAnchor="middle"
              fontFamily="var(--font-sora), ui-sans-serif, system-ui, sans-serif"
              fontSize="156"
              fontWeight="800"
              letterSpacing="-4"
              fill="currentColor"
              className="text-foreground"
            >
              {brandText}
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-5 border-t-[length:var(--border-width)] border-black pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white sm:pt-8">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-ring"
              aria-label="Open Smile Home"
            >
              <Logo className="h-7 w-auto sm:h-8" />
            </Link>
            <span className="text-xs font-mono font-medium text-muted-foreground">
              © {new Date().getFullYear()} Open Smile. All rights reserved.
            </span>
          </div>

          <nav aria-label="Footer utility links">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8">
              {bottomLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs sm:text-sm font-bold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm font-bold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
