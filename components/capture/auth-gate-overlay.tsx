'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Coins, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AuthGateOverlayProps {
	coinsAwarded?: number;
	score?: number;
	redirectTo?: string;
	onClose?: () => void;
}

export function AuthGateOverlay({
	coinsAwarded = 0,
	score = 0,
	redirectTo = '/capture',
	onClose,
}: AuthGateOverlayProps) {
	const signupHref = `/signup?redirectTo=${encodeURIComponent(redirectTo)}`;
	const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
			<div
				className="fixed inset-0 bg-black/75 backdrop-blur-xs"
				onClick={onClose}
			/>
			<motion.div
				initial={{ scale: 0.9, y: 15 }}
				animate={{ scale: 1, y: 0 }}
				transition={{ type: 'spring', damping: 25, stiffness: 350 }}
				className="relative z-10 flex w-full max-w-sm flex-col items-center gap-4 border-[length:var(--border-width-lg)] border-border rounded-2xl bg-card p-6 shadow-brutal-xl text-center">
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						className="absolute -top-3 -right-3 flex size-8 items-center justify-center border-[length:var(--border-width)] border-border rounded-lg bg-background font-bold shadow-brutal transition-all hover:bg-muted active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
						aria-label="Close">
						<X className="size-4 stroke-[2.5]" />
					</button>
				)}

				<div className="relative">
					<div className="flex size-16 items-center justify-center border-[length:var(--border-width)] border-border rounded-2xl bg-warning text-warning-foreground shadow-brutal">
						<Coins className="size-9" strokeWidth={2.5} />
					</div>
					<div className="absolute -top-2 -right-2 flex size-6 items-center justify-center border-[length:var(--border-width-sm)] border-border rounded-full bg-accent text-accent-foreground shadow-brutal-xs animate-bounce">
						<Sparkles className="size-3.5" />
					</div>
				</div>

				<div className="space-y-1.5">
					
					<h3 className="font-title text-2xl font-black tracking-tight text-foreground">
						Sign up to scratch & claim
					</h3>
					<p className="text-xs text-muted-foreground font-semibold leading-relaxed max-w-[28ch] mx-auto">
						Your smile scored <strong className="text-foreground">{score}/100</strong>! Create a free account to reveal your scratch card and deposit coins into your balance.
					</p>
				</div>

				<div className="flex flex-col gap-2.5 w-full pt-1">
					<Button asChild size="lg" className="w-full gap-2 font-mono text-sm font-black uppercase tracking-wider bg-warning text-warning-foreground hover:bg-warning/90 border-[length:var(--border-width)] border-border shadow-brutal brutal-lift">
						<Link href={signupHref}>
							<UserPlus className="size-4" />
							Sign Up to Claim
						</Link>
					</Button>
					<Button asChild variant="outline" size="default" className="w-full gap-2 font-mono text-xs font-bold uppercase tracking-wider border-[length:var(--border-width)] border-border shadow-brutal-sm brutal-lift">
						<Link href={loginHref}>
							<LogIn className="size-4" />
							Log in to existing account
						</Link>
					</Button>
				</div>

				{onClose && (
					<button
						type="button"
						onClick={onClose}
						className="text-xs font-mono font-bold text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
						Continue testing as guest
					</button>
				)}
			</motion.div>
		</motion.div>
	);
}
