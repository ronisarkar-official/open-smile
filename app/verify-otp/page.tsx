"use client";

import { useState, useEffect, Suspense, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const flowParam = searchParams.get("flow") || "signup";
  const redirectToParam = searchParams.get("redirectTo") || "/dashboard";

  const [email] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e?: FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6) return;
    if (!email) {
      setError("Email is missing. Please return to the previous page.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const pendingRaw = sessionStorage.getItem("pending_auth");
      if (!pendingRaw) {
        throw new Error("Session expired. Please start over.");
      }

      const { ticket } = JSON.parse(pendingRaw);
      if (!ticket) {
        throw new Error("Session expired. Please start over.");
      }

      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, ticket }),
      });

      const data = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(data.error || "Invalid or expired OTP");
      }

      sessionStorage.removeItem("pending_auth");
      setSuccess(true);

      setTimeout(() => {
        router.push(data.redirectTo || redirectToParam);
        router.refresh();
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Verification failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email is missing.");
      return;
    }

    setError("");
    setCooldown(60);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend OTP.";
      setError(message);
      setCooldown(0);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-5">
      <div className="brutal-surface w-full max-w-md space-y-8 bg-card p-6 sm:p-8">
        <Link href="/" className="mx-auto block w-fit focus-visible:outline-3 focus-visible:outline-offset-4">
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="text-center">
          <p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">One last step</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-foreground">
            {flowParam === "signup" ? "Verify your email" : "Sign-in Verification"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We&apos;ve sent a 6-digit code to <br />
            <span className="font-semibold text-foreground">
              {email || "your email address"}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col items-center space-y-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading || success}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-sm text-destructive font-medium text-center">{error}</p>
          )}

          {success && (
            <p className="text-center text-sm font-medium text-success">
              Verified. Redirecting to your dashboard…
            </p>
          )}

          <Button
            type="submit"
            disabled={otp.length !== 6 || isLoading || success}
            className="w-full"
          >
            {isLoading ? "Verifying…" : "Verify and continue"}
          </Button>
        </form>

        <div className="text-center text-sm space-y-2">
          <p className="text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || success}
              className="font-semibold text-foreground hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
