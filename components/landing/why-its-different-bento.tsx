'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, EyeOff, Flame } from 'lucide-react';

export function WhyItsDifferentBento() {
	return (
		<section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
			<div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
				<h2 className="font-title text-3xl font-black tracking-tight text-foreground sm:text-4xl">
					Why this isn&apos;t just another AI gimmick
				</h2>
				<p className="mt-3 font-semibold text-muted-foreground">
					Real scoring, real fairness, real privacy — not just a webcam trick.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:grid-rows-2 sm:auto-rows-[minmax(180px,auto)]">
				{/* Hero tile — real AI scoring, spans 2x2 */}
				<BentoTile className="sm:col-span-2 sm:row-span-2" accent="primary" delay={0}>
					<div className="flex h-full flex-col justify-between">
						<div className="flex size-12 items-center justify-center border-[length:var(--border-width)] border-border rounded-lg bg-primary text-primary-foreground shadow-brutal-sm">
							<Sparkles className="size-6" strokeWidth={2.5} />
						</div>
						<div>
							<h3 className="font-title text-2xl font-black text-foreground sm:text-3xl">
								Real AI scoring
							</h3>
							<p className="mt-2 max-w-xs text-sm font-semibold text-muted-foreground">
								We measure how genuine your smile actually looks — mouth curve,
								eye crinkle, the works. Not just &quot;smiling: yes or no.&quot;
							</p>
						</div>
						{/* Mini score visual — ties the tile back to the actual product */}
						<div className="mt-4 flex items-center gap-3">
							<div className="flex items-baseline gap-1 border-[length:var(--border-width-sm)] border-border rounded-md bg-card px-3 py-1.5 shadow-brutal-xs">
								<span className="font-mono text-2xl font-black text-foreground tabular-nums">92</span>
								<span className="font-mono text-xs font-bold text-muted-foreground">/100</span>
							</div>
							<span className="font-mono text-[10px] font-black uppercase tracking-wide text-success">
								Radiant
							</span>
						</div>
					</div>
				</BentoTile>

				{/* Anti-cheat tile */}
				<BentoTile className="sm:col-span-2" accent="accent" delay={0.1}>
					<div className="flex h-full items-center gap-4">
						<div className="flex size-11 shrink-0 items-center justify-center border-[length:var(--border-width)] border-border rounded-lg bg-accent text-accent-foreground shadow-brutal-sm">
							<ShieldCheck className="size-5.5" strokeWidth={2.5} />
						</div>
						<div>
							<h3 className="font-title text-lg font-black text-foreground">
								Actually fair
							</h3>
							<p className="mt-1 text-sm font-semibold text-muted-foreground">
								We block fake photos and spam so real smilers win.
							</p>
						</div>
					</div>
				</BentoTile>

				{/* Privacy tile */}
				<BentoTile accent="success" delay={0.15}>
					<div className="flex h-full flex-col justify-between">
						<div className="flex size-10 items-center justify-center border-[length:var(--border-width)] border-border rounded-lg bg-success text-success-foreground shadow-brutal-sm">
							<EyeOff className="size-5" strokeWidth={2.5} />
						</div>
						<div>
							<h3 className="font-title text-base font-black text-foreground">
								We don&apos;t keep your photo
							</h3>
							<p className="mt-1 text-xs font-semibold text-muted-foreground">
								Deleted within 24 hours. Always.
							</p>
						</div>
					</div>
				</BentoTile>

				{/* Streak tile */}
				<BentoTile accent="secondary" delay={0.2}>
					<div className="flex h-full flex-col justify-between">
						<div className="flex size-10 items-center justify-center border-[length:var(--border-width)] border-border rounded-lg bg-secondary text-secondary-foreground shadow-brutal-sm">
							<Flame className="size-5" strokeWidth={2.5} />
						</div>
						<div>
							<h3 className="font-title text-base font-black text-foreground">
								Streaks that pay off
							</h3>
							<p className="mt-1 text-xs font-semibold text-muted-foreground">
								Smile daily, earn more coins.
							</p>
						</div>
					</div>
				</BentoTile>
			</div>
		</section>
	);
}

type Accent = 'primary' | 'secondary' | 'accent' | 'success';

const ACCENT_BORDER: Record<Accent, string> = {
	primary: 'hover:border-primary',
	secondary: 'hover:border-secondary',
	accent: 'hover:border-accent',
	success: 'hover:border-success',
};

function BentoTile({
	children,
	className = '',
	accent,
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	accent: Accent;
	delay?: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-40px' }}
			transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
			className={`group border-[length:var(--border-width)] border-border rounded-xl bg-card p-5 shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg sm:p-6 ${ACCENT_BORDER[accent]} ${className}`}>
			{children}
		</motion.div>
	);
}

export default WhyItsDifferentBento;
