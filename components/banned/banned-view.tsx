'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
	ShieldAlert,
	LogOut,
	Mail,
	Copy,
	Check,
	Clock,
	AlertTriangle,
	User,
	Hash,
	ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { signOut } from '@/lib/auth-client';
import { useToast } from '@/hooks/use-toast';

interface BannedViewProps {
	user?: {
		email: string;
		banReason?: string | null;
		banExpires?: string | null;
	} | null;
}

function formatRemainingTime(expiresDate: Date): string {
	const diff = expiresDate.getTime() - Date.now();
	if (diff <= 0) return 'Expiring soon';

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

	if (days > 0) return `${days}d ${hours}h left`;
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	return `${hours}h ${minutes}m left`;
}

export function BannedView({ user }: BannedViewProps) {
	const { toast } = useToast();
	const [copied, setCopied] = useState(false);
	const [signingOut, setSigningOut] = useState(false);

	const supportEmail = 'support@opensmile.org';
	const banExpiresDate = useMemo(() => {
		return user?.banExpires ? new Date(user.banExpires) : null;
	}, [user]);

	const isTemporary = Boolean(banExpiresDate);
	const remainingText =
		banExpiresDate ? formatRemainingTime(banExpiresDate) : null;

	const caseRef = useMemo(() => {
		const seed = (user?.email || 'UNKNOWN')
			.replace(/[^a-zA-Z0-9]/g, '')
			.slice(0, 4)
			.toUpperCase();
		return `CASE-${seed || 'OS'}-9042`;
	}, [user]);

	const handleCopyEmail = async () => {
		try {
			await navigator.clipboard.writeText(supportEmail);
			setCopied(true);
			toast({
				title: 'Support email copied',
				description: supportEmail,
			});
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast({
				title: 'Failed to copy',
				description: 'Please write to ' + supportEmail,
				variant: 'error',
			});
		}
	};

	const handleSignOut = async () => {
		try {
			setSigningOut(true);
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						window.location.href = '/';
					},
					onError: () => {
						window.location.href = '/';
					},
				},
			});
		} catch {
			window.location.href = '/';
		}
	};

	const appealSubject = encodeURIComponent(
		`Ban Appeal [${caseRef}] - ${user?.email || 'Account'}`,
	);
	const appealBody = encodeURIComponent(
		`Hello Open Smile Team,\n\nI am submitting an appeal regarding the suspension of my account.\n\nAccount: ${user?.email || 'N/A'}\nCase Reference: ${caseRef}\nReason Listed: ${user?.banReason || 'Not specified'}\n\nExplanation of circumstances:\n[Please provide details here]\n\nThank you.`,
	);
	const mailtoUrl = `mailto:${supportEmail}?subject=${appealSubject}&body=${appealBody}`;

	return (
		<div className="w-full max-w-lg px-3 sm:px-0 max-h-[100dvh] overflow-y-auto py-3">
			<div className="w-full rounded-2xl border-[length:var(--border-width)] border-border bg-card shadow-brutal-xl overflow-hidden">
				<div className="h-1.5 w-full bg-destructive" />

				<div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3 sm:px-6">
					<Link
						href="/"
						className="inline-block focus-visible:outline-3 focus-visible:outline-offset-4">
						<Logo className="h-6 w-auto" />
					</Link>

					<div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-destructive px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-destructive-foreground shadow-brutal-xs">
						<ShieldAlert className="size-3" />
						<span>{isTemporary ? 'Temporary' : 'Permanent'}</span>
					</div>
				</div>

				<div className="p-4 sm:p-6">
					<div className="flex items-start gap-3 sm:gap-4">
						<div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl border-2 border-destructive bg-destructive/10 text-destructive shadow-brutal-xs">
							<ShieldAlert
								className="size-5 sm:size-6"
								strokeWidth={2.2}
							/>
						</div>
						<div className="min-w-0">
							<h1 className="font-heading text-xl sm:text-2xl font-black tracking-tight text-foreground">
								Account Suspended
							</h1>
							<p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
								This account was suspended for violating community guidelines,
								security rules, or anti-cheat policies.
							</p>
						</div>
					</div>

					{user ?
						<div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted/30 shadow-brutal-xs">
							<div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-y sm:divide-y-0 divide-border">
								<div className="px-3.5 py-2.5 min-w-0">
									<div className="flex items-center gap-1.5 text-muted-foreground">
										<User className="size-3" />
										<span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
											Account
										</span>
									</div>
									<div className="mt-0.5 truncate font-mono text-xs font-bold text-foreground">
										{user.email}
									</div>
								</div>
								<div className="px-3.5 py-2.5">
									<div className="flex items-center gap-1.5 text-muted-foreground">
										<Hash className="size-3" />
										<span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
											Case Ref
										</span>
									</div>
									<div className="mt-0.5 font-mono text-xs font-bold text-foreground">
										{caseRef}
									</div>
								</div>
							</div>

							<div className="border-t border-border px-3.5 py-2.5">
								<div className="flex items-center gap-1.5 text-muted-foreground">
									<AlertTriangle className="size-3 text-destructive" />
									<span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
										Reason
									</span>
								</div>
								<p className="mt-1 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs font-medium leading-snug text-destructive">
									{user.banReason ||
										'Violation of platform security, fair-play rules, or terms of service.'}
								</p>
							</div>

							<div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3.5 py-2.5">
								<div className="flex items-center gap-1.5 text-muted-foreground">
									<Clock className="size-3" />
									<span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
										Duration
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xs font-bold text-foreground">
										{isTemporary && banExpiresDate ?
											banExpiresDate.toLocaleDateString(undefined, {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})
										:	<span className="text-destructive">Permanent</span>}
									</span>
									{isTemporary && remainingText && (
										<span className="rounded border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-destructive">
											{remainingText}
										</span>
									)}
								</div>
							</div>
						</div>
					:	<div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-center shadow-brutal-xs">
							<p className="text-sm font-semibold text-foreground">
								Session Ended
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Your session was terminated due to an active suspension. Sign in
								with another account or submit an appeal.
							</p>
						</div>
					}

					<div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-border bg-muted/20 px-3 py-1.5 text-[11px] text-muted-foreground shadow-brutal-xs">
						<span className="inline-flex items-center gap-1.5">
							<Clock className="size-3 shrink-0 text-foreground" />
							<span>Appeals reviewed within 24–48h</span>
						</span>
						<span className="font-mono text-[10px] text-foreground">
							Auto-attached: <code className="rounded border border-border bg-muted px-1 py-0.5 font-bold">{caseRef}</code>
						</span>
					</div>

					<div className="mt-4 flex flex-col gap-2 sm:flex-row">
						{user ?
							<>
								<Button
									asChild
									size="default"
									className="flex-1 font-bold brutal-lift">
									<a href={mailtoUrl}>
										<Mail className="size-4" />
										Submit Appeal
									</a>
								</Button>
								<Button
									type="button"
									variant="outline"
									size="default"
									onClick={handleCopyEmail}
									className="flex-1 font-semibold brutal-lift">
									{copied ?
										<>
											<Check className="size-4 text-success" />
											Copied
										</>
									:	<>
											<Copy className="size-4" />
											Copy Email
										</>
									}
								</Button>
								<Button
									type="button"
									variant="destructive"
									size="default"
									onClick={handleSignOut}
									disabled={signingOut}
									className="flex-1 font-semibold brutal-lift">
									<LogOut className="size-4" />
									{signingOut ? 'Signing Out...' : 'Sign Out'}
								</Button>
							</>
						:	<>
								<Button
									asChild
									size="default"
									className="flex-1 font-bold brutal-lift">
									<Link href="/login">
										Use Another Account
										<ArrowRight className="size-4" />
									</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									size="default"
									className="flex-1 font-semibold brutal-lift">
									<Link href="/">Back to Home</Link>
								</Button>
							</>
						}
					</div>

					<div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-border pt-3 text-[11px] text-muted-foreground">
						<Link
							href="/rules"
							className="underline underline-offset-4 transition-colors hover:text-foreground">
							Platform Rules
						</Link>
						<span>•</span>
						<Link
							href="/terms"
							className="underline underline-offset-4 transition-colors hover:text-foreground">
							Terms
						</Link>
						<span>•</span>
						<Link
							href="/security"
							className="underline underline-offset-4 transition-colors hover:text-foreground">
							Anti-Cheat & Security
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
