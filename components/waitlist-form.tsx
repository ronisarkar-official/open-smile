"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function WaitlistForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [joined, setJoined] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/beta-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "We couldn’t add you to the beta list.");
      }

      setJoined(true);
      toast({
        title: data.alreadyJoined ? "You’re already on the list" : "You’re on the list",
        description: data.alreadyJoined
          ? "We’ll email you when beta access opens."
          : "We’ll email you when it’s your turn to smile.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "We couldn’t add you to the list",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <Input
        id="waitlist-email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        aria-label="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={loading || joined}
        className="flex-1"
      />
      <Button type="submit" size="lg" disabled={loading || joined} className="shrink-0">
        {loading ? "Joining…" : joined ? "You’re in" : "Get beta access"}
        {!loading && !joined && <ArrowUpRight className="size-4" />}
      </Button>
    </form>
  );
}
