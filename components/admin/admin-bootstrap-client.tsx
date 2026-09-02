"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminBootstrapClient({ userEmail }: { userEmail: string }) {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [success, setSuccess] = React.useState(false);

	async function handleBootstrap() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/admin/bootstrap", { method: "POST" });
			const json = await res.json();
			if (!res.ok) {
				throw new Error(json.error || "Bootstrap failed");
			}
			setSuccess(true);
			setTimeout(() => {
				router.refresh();
			}, 1000);
		} catch (err: any) {
			setError(err.message || "Failed to elevate role");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 sm:p-8 shadow-brutal space-y-6 text-center">
				<div className="size-14 rounded-xl border-[length:var(--border-width)] border-black bg-destructive/15 text-destructive flex items-center justify-center mx-auto shadow-brutal-sm">
					<ShieldAlert className="size-7" />
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-black font-title tracking-tight text-foreground">
						Admin Access Required
					</h1>
					<p className="text-sm font-semibold text-muted-foreground">
						You are signed in as <span className="font-mono font-bold text-foreground">{userEmail}</span>, but your account does not have administrator privileges.
					</p>
				</div>

				{error ? (
					<div className="border border-destructive/30 rounded-lg bg-destructive/10 p-3 text-xs font-mono font-bold text-destructive">
						{error}
					</div>
				) : null}

				{success ? (
					<div className="border border-success/30 rounded-lg bg-success/10 p-3 text-xs font-mono font-bold text-success flex items-center justify-center gap-2">
						<CheckCircle2 className="size-4" />
						Admin access granted! Reloading...
					</div>
				) : null}

				<div className="space-y-3 pt-2">
					<Button
						onClick={handleBootstrap}
						disabled={loading || success}
						className="w-full border-[length:var(--border-width)] border-black bg-accent hover:bg-accent/90 text-black font-mono font-black uppercase tracking-wider shadow-brutal-xs brutal-lift h-11"
					>
						<KeyRound className="size-4 mr-2" />
						{loading ? "Verifying..." : "Claim Admin Access (Dev Mode)"}
					</Button>

					<Link
						href="/dashboard"
						className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-black/30 font-mono text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50"
					>
						<ArrowLeft className="size-3.5" />
						Return to Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
}
