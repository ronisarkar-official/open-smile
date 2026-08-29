"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why it’s private", href: "#privacy" },
  { label: "Team", href: "#team" },
  { label: "Beta", href: "#beta" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-[100] border-b-[length:var(--border-width)] border-black bg-background">
      <nav className="mx-auto flex min-h-18 w-full max-w-[1280px] items-center justify-between gap-5 px-5 py-3 sm:px-6">
        <Link href="/" className="shrink-0 focus-visible:outline-3 focus-visible:outline-offset-4" aria-label="Open Smile home">
          <Logo className="h-8 w-auto sm:h-9" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-semibold transition-[background-color] duration-200 hover:bg-primary rounded-md focus-visible:bg-primary focus-visible:outline-3 focus-visible:outline-offset-2"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-11 w-28 animate-pulse border-[length:var(--border-width)] border-black rounded-lg bg-muted" aria-label="Loading account controls" />
          ) : session?.user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">My dashboard</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Join the beta</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </nav>

      {menuOpen && (
        <div className="border-t-[length:var(--border-width)] border-black bg-card p-5 md:hidden">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-[length:var(--border-width)] border-black rounded-lg bg-background px-4 py-3 font-bold transition-[background-color] duration-200 hover:bg-primary"
              >
                {link.label}
              </a>
            ))}
            {session?.user ? (
              <>
                <Button asChild className="w-full" onClick={closeMenu}>
                  <Link href="/dashboard">My dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full" onClick={closeMenu}>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full" onClick={closeMenu}>
                  <Link href="/signup">Join the beta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
