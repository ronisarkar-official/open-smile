"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  Gift,
} from "lucide-react";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"github" | "google" | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const refParam = searchParams.get("ref");

  useEffect(() => {
    if (refParam) {
      setReferralCode(refParam.toUpperCase());
    } else if (typeof document !== "undefined") {
      const match = document.cookie.match(/ref_code=([^;]+)/);
      if (match?.[1]) {
        setReferralCode(decodeURIComponent(match[1]).toUpperCase());
      }
    }
  }, [refParam]);

  async function handleSocialSignIn(provider: "github" | "google") {
    try {
      setSocialLoading(provider);
      setError("");
      await signIn.social({
        provider,
        callbackURL: redirectTo || "/dashboard",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to initiate social login. Please try again.";
      setError(message);
      setSocialLoading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
          type: "signup",
          referral_code: referralCode || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification OTP");
      }

      sessionStorage.setItem(
        "pending_auth",
        JSON.stringify({ email, ticket: data.signupTicket })
      );

      const redirectQuery = redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : "";
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&flow=signup${redirectQuery}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">Join the beta</p>
        <h1 className="text-3xl font-black tracking-[-0.06em] sm:text-4xl">
          Make room for more good days.
        </h1>
        <p className="max-w-[42ch] text-sm leading-5 text-muted-foreground">
          Set up your Open Smile account and we&apos;ll save your place in line.
        </p>

        {referralCode && (
          <div className="mt-2 flex items-center gap-2 border-[length:var(--border-width)] border-border rounded-lg bg-accent/30 px-3 py-2 text-xs font-mono font-bold text-foreground shadow-brutal-xs">
            <Gift className="size-4 text-primary shrink-0" />
            <span className="truncate">
              Welcome Scratch Card (up to 50 coins) unlocked with code: <strong>{referralCode}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full h-9 gap-2.5 text-sm font-medium"
          disabled={loading || Boolean(socialLoading)}
          onClick={() => handleSocialSignIn("github")}
        >
          {socialLoading === "github" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GitHubIcon className="size-4" />
          )}
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full h-9 gap-2.5 text-sm font-medium"
          disabled={loading || Boolean(socialLoading)}
          onClick={() => handleSocialSignIn("google")}
        >
          {socialLoading === "google" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 font-mono text-muted-foreground">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              className="h-9 pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="h-9 pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              className="h-9 pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-9 text-sm font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-xs leading-snug text-muted-foreground">
          By creating an account, you agree to the beta terms and privacy notice.
        </p>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login"}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center text-xs font-mono text-muted-foreground">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
