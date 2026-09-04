import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Camera, Check, Gift, Sparkles, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { findUserByReferralCode, getSystemSettingsMap } from '@/lib/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ReferralTracker } from './referral-tracker';

export const dynamic = 'force-dynamic';

interface JoinPageProps {
	params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
	const { code } = await params;
	if (!code) notFound();

	const referrer = await findUserByReferralCode(code);
	const settings = await getSystemSettingsMap();
	const refereeMaxCoins = Number(settings.referral_referee_max_coins) || 50;

	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
			<ReferralTracker code={code} />
			{/* Ambient background accents */}
			<div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

			<div className="w-full max-w-lg space-y-6 relative z-10">
				{/* Top Branding Badge */}
				<div className="text-center space-y-2">
					<div className="inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-border rounded-md bg-accent px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-accent-foreground shadow-brutal-xs">
						<Sparkles className="size-3.5" />
						Exclusive Invitation
					</div>
					<h1 className="text-3xl sm:text-4xl font-black font-title tracking-tight text-foreground">
						Join Open Smile
					</h1>
				</div>

				{/* Main Neubrutalist Invitation Card */}
				<div className="border-[length:var(--border-width)] border-border rounded-2xl bg-card p-6 sm:p-8 shadow-brutal space-y-6">
					{referrer ? (
						<div className="flex items-center gap-4 pb-6 border-b-[length:var(--border-width)] border-border/20">
							<Avatar className="size-14 rounded-xl border-[length:var(--border-width)] border-border shadow-brutal-xs shrink-0">
								<AvatarImage src={referrer.image || '/icons/default-icon.webp'} alt={referrer.name} />
								<AvatarFallback className="font-title font-black text-base">
									{referrer.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0">
								<p className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
									You&apos;ve Been Invited By
								</p>
								<p className="font-title font-black text-xl text-foreground truncate">
									{referrer.name}
								</p>
								<span className="font-mono text-[11px] font-bold text-primary">
									Invite Code: {referrer.referralCode}
								</span>
							</div>
						</div>
					) : (
						<div className="p-3 bg-muted/60 rounded-xl border-[length:var(--border-width)] border-border/30 text-center font-mono text-xs text-muted-foreground">
							Special invitation code applied: <strong className="text-foreground">{code}</strong>
						</div>
					)}

					{/* Reward Highlight Card */}
					<div className="border-[length:var(--border-width)] border-border rounded-xl bg-primary p-5 text-primary-foreground shadow-brutal-sm relative overflow-hidden">
						<div className="flex items-start justify-between gap-3">
							<div className="space-y-1">
								<span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-primary-foreground/30 bg-primary-foreground/15">
									Welcome Perk
								</span>
								<h2 className="text-xl sm:text-2xl font-black font-title tracking-tight">
									Win Up To {refereeMaxCoins} Bonus Coins
								</h2>
								<p className="text-xs sm:text-sm text-primary-foreground/90 font-medium leading-relaxed">
									Complete your first camera smile check after joining to unlock your guaranteed Mystery Scratch Card!
								</p>
							</div>
							<div className="size-12 rounded-xl border-[length:var(--border-width)] border-border bg-card text-foreground flex items-center justify-center shrink-0 shadow-brutal-xs">
								<Gift className="size-6 text-primary" strokeWidth={2.5} />
							</div>
						</div>
					</div>

					{/* Value Props Checklist */}
					<div className="space-y-2.5 font-mono text-xs text-foreground">
						<div className="flex items-center gap-2.5">
							<div className="size-5 rounded border border-border bg-success/20 flex items-center justify-center shrink-0">
								<Check className="size-3.5 text-success" strokeWidth={3} />
							</div>
							<span>100% on-device AI smile detection (no video sent to server)</span>
						</div>
						<div className="flex items-center gap-2.5">
							<div className="size-5 rounded border border-border bg-success/20 flex items-center justify-center shrink-0">
								<Check className="size-3.5 text-success" strokeWidth={3} />
							</div>
							<span>Accumulate coins toward real Amazon gift vouchers</span>
						</div>
						<div className="flex items-center gap-2.5">
							<div className="size-5 rounded border border-border bg-success/20 flex items-center justify-center shrink-0">
								<Check className="size-3.5 text-success" strokeWidth={3} />
							</div>
							<span>Compete in Daily &amp; Weekly Tournaments for podium prizes</span>
						</div>
					</div>

					{/* CTA Button */}
					<div className="space-y-3 pt-2">
						<Button
							asChild
							size="lg"
							className="w-full h-12 text-base font-black font-title tracking-tight gap-2 shadow-brutal brutal-lift cursor-pointer"
						>
							<Link href={`/signup?ref=${encodeURIComponent(code)}`}>
								<span>Claim Scratch Card &amp; Sign Up</span>
								<ArrowRight className="size-4.5" />
							</Link>
						</Button>

						<p className="text-center font-mono text-xs text-muted-foreground">
							Already have an account?{' '}
							<Link
								href={`/login?redirectTo=${encodeURIComponent('/dashboard')}`}
								className="font-bold text-foreground underline underline-offset-4 hover:text-primary"
							>
								Sign In
							</Link>
						</p>
					</div>
				</div>

				{/* Privacy posture footer */}
				<div className="flex items-center justify-center gap-2 text-center font-mono text-[11px] text-muted-foreground">
					<ShieldCheck className="size-3.5 text-success" />
					<span>Strict zero-face retention policy · Images auto-delete after 1 day</span>
				</div>
			</div>
		</main>
	);
}
