"use client";

/**
 * SessionProvider — no-op wrapper for Better Auth.
 *
 * Better Auth's useSession() works via cookie-based fetching
 * and doesn't need a React context provider. This component
 * is kept as a passthrough so existing layout code doesn't break.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
