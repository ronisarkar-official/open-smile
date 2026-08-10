"use client";

import { useState, useEffect, Suspense, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/auth-client";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const flowParam = searchParams.get("flow") || "signup";

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
      // 1. Verify the OTP via API
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(data.error || "Invalid or expired OTP");
      }

      // 2. Complete Auth according to flow
      if (flowParam === "signup") {
        const pendingRaw = sessionStorage.getItem("pending_signup");
        if (!pendingRaw) {
          throw new Error("Signup session expired. Please sign up again.");
        }
        const { name, email: pendingEmail, password } = JSON.parse(pendingRaw);
        const targetEmail = pendingEmail || email;

        await signUp.email(
          { name, email: targetEmail, password },
          {
            onSuccess: async () => {
              sessionStorage.removeItem("pending_signup");
              // Mark user's email as verified in database post-creation
              try {
                await fetch("/api/auth/mark-verified", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: targetEmail }),
                });
              } catch (err) {
                console.error("Failed to mark email verified:", err);
              }

              setSuccess(true);
              setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
              }, 1200);
            },
            onError: (ctx) => {
              setError(ctx.error.message || "Failed to create account.");
            },
          }
        );
      } else {
        const pendingRaw = sessionStorage.getItem("pending_login");
        if (!pendingRaw) {
          throw new Error("Login session expired. Please sign in again.");
        }
        const { email: pendingEmail, password } = JSON.parse(pendingRaw);
        const targetEmail = pendingEmail || email;

        // 1. Send Google-style login security notification email immediately upon OTP verification success
        try {
          await fetch("/api/auth/notify-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: targetEmail }),
          });
        } catch (err) {
          console.error("Failed to send login security notification email:", err);
        }

        // 2. Clear pending login and redirect to dashboard
        const completeLogin = () => {
          sessionStorage.removeItem("pending_login");
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1200);
        };

        try {
          await signIn.email(
            { email: targetEmail, password },
            {
              onSuccess: completeLogin,
              onError: (ctx) => {
                setError(ctx.error.message || "Failed to sign in. Please try again.");
              },
            }
          );
        } catch {
          setError("Failed to sign in. Please try again.");
        }
      }
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-xs border border-border">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {flowParam === "signup" ? "Verify your email" : "Sign-in Verification"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
            <p className="text-sm text-emerald-600 font-medium text-center dark:text-emerald-400">
              Successfully verified! Redirecting to dashboard...
            </p>
          )}

          <Button
            type="submit"
            disabled={otp.length !== 6 || isLoading || success}
            className="w-full"
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </Button>
        </form>

        <div className="text-center text-sm space-y-2">
          <p className="text-muted-foreground">
            Didn't receive the code?{" "}
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
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
