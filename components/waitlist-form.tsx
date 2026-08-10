"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

/**
 * Beta waitlist form — posts to /api/beta-join and reports the result
 * via the app-wide toast system.
 */
export function WaitlistForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [joined, setJoined] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/beta-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setJoined(true);
      toast({
        title: data.alreadyJoined ? "Already on the list" : "You're on the list",
        description: data.alreadyJoined
          ? "We've got your email — we'll be in touch."
          : "We'll email you the moment the beta opens.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Couldn't sign you up",
        description:
          err instanceof Error ? err.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <Input
        type="email"
        required
        placeholder="you@email.com"
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading || joined}
        className="h-10 flex-1"
      />
      <Button
        type="submit"
        size="lg"
        className="h-10 shrink-0"
        disabled={loading || joined}
      >
        {loading ? "Joining…" : joined ? "Joined" : "Join the beta"}
      </Button>
    </form>
  );
}