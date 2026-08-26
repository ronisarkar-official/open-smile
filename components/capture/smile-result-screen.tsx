'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
	Sparkles,
	Flame,
	Smile,
	ArrowRight,
	Award,
	Coins,
	Share2,
	Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NeubrutalistPhotoCard } from '@/components/capture/neubrutalist-photo-card';
import { cn } from '@/lib/utils';

interface SmileResultScreenProps {
	imageSrc: string | null;
	score: number;
	coinsAwarded: number;
	isRewardClaimed?: boolean;
	isSaving?: boolean;
	onRevealReward: () => void;
	onRetake: () => void;
	onShareToExplore?: () => void;
}

function getVibeLabel(score: number) {
	if (score >= 88) return 'AMAZING';
	if (score >= 75) return 'ULTRA RADIANT';
	if (score >= 60) return 'INFECTIOUS';
	if (score >= 40) return 'WARM';
	return 'CHILL';
}

function getEnergyLabel(score: number) {
	if (score >= 85) return 'MAXIMUM';
	if (score >= 70) return 'HIGH';
	if (score >= 50) return 'VIBRANT';
	return 'WARMING UP';
}

function getAiComment(score: number) {
	if (score >= 88)
		return 'Okay, that is definitely reward-worthy. The camera almost melted!';
	if (score >= 75)
		return "Solid smile detected! That is guaranteed to brighten anyone's day.";
	if (score >= 60)
		return 'Nice energy! The AI sensors thoroughly approve this vibe.';
	if (score >= 40)
		return 'A charming grin! Good vibes registered in the reward ledger.';
	return "A subtle smirk! Let's get those coins and boost the power next round.";
}

const CONFETTI_COLORS = ['#FFD23F', '#FF6B6B', '#4ECDC4', '#A78BFA', '#FF9F1C'];

function ConfettiBurst() {
	const pieces = React.useMemo(
		() =>
			Array.from({ length: 18 }, (_, i) => ({
				id: i,
				x: (Math.random() - 0.5) * 320,
				y: Math.random() * -220 - 60,
				rotate: Math.random() * 360,
				delay: Math.random() * 0.2,
				color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
				size: 6 + Math.random() * 6,
			})),
		[],
	);

	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			{pieces.map((p) => (
				<motion.span
					key={p.id}
					initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
					animate={{ x: p.x, y: p.y, opacity: [0, 1, 1, 0], rotate: p.rotate }}
					transition={{
						duration: 1.1,
						delay: p.delay,
						ease: [0.22, 1, 0.36, 1],
					}}
					style={{
						position: 'absolute',
						left: '50%',
						top: '30%',
						width: p.size,
						height: p.size * 0.4,
						backgroundColor: p.color,
						borderRadius: 1,
					}}
				/>
			))}
		</div>
	);
}

export function SmileResultScreen({
	imageSrc,
	score,
	coinsAwarded,
	isRewardClaimed = false,
	isSaving = false,
	onRevealReward,
	onRetake,
	onShareToExplore,
}: SmileResultScreenProps) {
	const [displayScore, setDisplayScore] = React.useState(0);
	const [showConfetti, setShowConfetti] = React.useState(false);
	const isHighScore = score >= 75;

	React.useEffect(() => {
		let frame: number;
		const duration = 1000;
		const start = performance.now();

		function animate(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			const current = Math.round(eased * score);
			setDisplayScore(current);

			if (progress < 1) {
				frame = requestAnimationFrame(animate);
			} else if (isHighScore) {
				setShowConfetti(true);
			}
		}

		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	}, [score, isHighScore]);

	const vibe = getVibeLabel(score);
	const energy = getEnergyLabel(score);
	const comment = getAiComment(score);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
			className="relative w-full space-y-6">
			<AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>

			<div className="flex flex-col items-center justify-center text-center">
				<motion.div
					initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
					animate={{ scale: 1, opacity: 1, rotate: 0 }}
					transition={{
						type: 'spring',
						damping: 12,
						stiffness: 260,
						delay: 0.1,
					}}
					className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-border bg-accent text-accent-foreground rounded-lg px-4 py-1.5 font-mono text-xs font-black tracking-widest uppercase shadow-brutal-sm">
					<Award
						className="size-4 text-accent-foreground"
						strokeWidth={2.5}
					/>
					Challenge Aced
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15, duration: 0.3 }}
					className="mt-3 font-title text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
					Smile Check Complete <span className="inline-block">✅</span>
				</motion.h1>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:gap-8 items-start">
				<div className="flex justify-center p-2">
					<div className="w-full max-w-sm">
						<NeubrutalistPhotoCard
							imageSrc={imageSrc}
							score={score}
						/>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="flex flex-col gap-4 border-[length:var(--border-width)] border-border rounded-xl bg-card p-6 shadow-brutal-xl">
					<div>
						<div className="flex items-center justify-between border-b-[length:var(--border-width-sm)] border-border/20 pb-2">
							<span className="font-mono text-xs font-black tracking-widest text-muted-foreground uppercase">
								Smile Score
							</span>
							<span
								className={cn(
									'border-[length:var(--border-width-sm)] border-border rounded-md px-2 py-0.5 font-mono text-[11px] font-black uppercase shadow-brutal-xs',
									isRewardClaimed ?
										'bg-success text-success-foreground'
									:	'bg-warning text-warning-foreground',
								)}>
								{isRewardClaimed ? 'Reward Claimed' : '+Coins Ready'}
							</span>
						</div>

						<div className="mt-4 flex items-baseline gap-2">
							<span className="font-display text-7xl font-black tracking-tight text-foreground tabular-nums sm:text-8xl">
								{displayScore}
							</span>
							<span className="font-title text-2xl font-black text-muted-foreground sm:text-3xl">
								/ 100
							</span>
						</div>

						<div className="mt-3 h-4 w-full border-[length:var(--border-width-sm)] border-border rounded-xs bg-muted overflow-hidden">
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${score}%` }}
								transition={{
									duration: 1,
									ease: [0.22, 1, 0.36, 1],
									delay: 0.2,
								}}
								className="h-full bg-gradient-to-r from-primary via-warning to-accent"
							/>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-2.5 pt-2">
						<StatChip
							icon={<Smile className="size-3.5 text-foreground" />}
							label="Smile Power"
							value={`${score}%`}
						/>
						<StatChip
							icon={<Sparkles className="size-3.5 text-primary" />}
							label="Vibe"
							value={vibe}
						/>
						<StatChip
							icon={<Flame className="size-3.5 text-destructive" />}
							label="Energy"
							value={energy}
						/>
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="border-[length:var(--border-width-sm)] border-border bg-secondary/10 rounded-lg p-3.5 shadow-brutal-xs">
						<p className="font-title text-sm font-black italic text-foreground">
							"{comment}"
						</p>
					</motion.div>

					<div className="mt-2 flex flex-col gap-3">
						{!isRewardClaimed ?
							<>
								<Button
									size="lg"
									onClick={onRevealReward}
									className="group h-auto w-full gap-2 border-[length:var(--border-width)] border-border bg-warning text-warning-foreground py-4 font-mono text-base font-black tracking-wider uppercase shadow-brutal brutal-lift hover:bg-warning/90">
									Reveal My Reward
									<ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
								</Button>

								<p className="text-center font-mono text-xs font-bold text-muted-foreground">
									You earned a surprise scratch card
								</p>
							</>
						:	<div className="flex items-center justify-between border-[length:var(--border-width-sm)] border-border rounded-lg bg-muted/60 p-3 shadow-brutal-xs">
								<div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
									<Coins
										className="size-4 text-accent"
										strokeWidth={2.5}
									/>
									<span>
										{isSaving ?
											'Recording to ledger...'
										:	`+${coinsAwarded} Coins Deposited`}
									</span>
								</div>
								<span className="font-mono text-[10px] font-black uppercase text-success">
									Claimed
								</span>
							</div>
						}

						<div className="flex w-full flex-col gap-2.5 sm:flex-row">
							<Button
								variant="outline"
								size="lg"
								className="flex-1 gap-2 border-[length:var(--border-width)] border-border font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-sm brutal-lift"
								onClick={onShareToExplore}>
								<Share2 className="size-4" />
								Share to Explore
							</Button>
							<Button
								variant={isRewardClaimed ? 'default' : 'ghost'}
								size="lg"
								onClick={onRetake}
								className={cn(
									'flex-1 gap-2 font-mono text-xs font-bold uppercase tracking-wider',
									isRewardClaimed ?
										'border-[length:var(--border-width)] border-border bg-warning text-warning-foreground shadow-brutal-sm brutal-lift hover:bg-warning/90'
									:	'text-muted-foreground hover:text-foreground',
								)}>
								<Camera className="size-4" />
								Capture Again
							</Button>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}

function StatChip({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="border-[length:var(--border-width-sm)] border-border bg-muted/50 rounded-lg p-2.5 shadow-brutal-xs">
			<div className="flex items-center gap-1 font-mono text-[10px] font-bold text-muted-foreground uppercase">
				{icon}
				{label}
			</div>
			<p className="mt-1 font-mono text-xs font-black text-foreground truncate">
				{value}
			</p>
		</div>
	);
}
