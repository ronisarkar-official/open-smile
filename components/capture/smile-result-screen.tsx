'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Coins, Share2, Camera, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NeubrutalistPhotoCard } from '@/components/capture/neubrutalist-photo-card';
import { cn } from '@/lib/utils';

interface SmileResultScreenProps {
	imageSrc: string | null;
	score: number;
	coinsAwarded: number;
	isRewardClaimed?: boolean;
	isSaving?: boolean;
	isSharingToExplore?: boolean;
	isSharedToExplore?: boolean;
	shareMessage?: string | null;
	isQuotaFinished?: boolean;
	onRevealReward: () => void;
	onRetake: () => void;
	onShareToExplore?: () => void;
}

interface AiReaction {
	comment: string;
	mood: string;
}

const AI_REACTIONS: Record<
	'legendary' | 'radiant' | 'solid' | 'warming' | 'subtle',
	Array<{ comment: (score: number) => string; mood: string }>
> = {
	legendary: [
		{
			comment: () => 'Okay... that smile was dangerous. 😂',
			mood: '🔥 TOO GOOD',
		},
		{
			comment: (score) => `${score}?! Who taught you to smile like that?`,
			mood: '👑 TOP TIER',
		},
		{
			comment: () => '100 out of 100! That is the best smile I have seen all day.',
			mood: '⚡ SUPERSTAR',
		},
		{
			comment: (score) => `${score}/100?! You literally blinded the camera! 🔥`,
			mood: '✨ PURE JOY',
		},
	],
	radiant: [
		{
			comment: (score) => `${score}?! Who taught you to smile like that?`,
			mood: '✨ BIG VIBES',
		},
		{
			comment: () => 'Okay... that smile was dangerous. 😂',
			mood: '🔥 ON FIRE',
		},
		{
			comment: () => 'Nice one. But I know you can hit 100 next time!',
			mood: '⚡ SO BRIGHT',
		},
		{
			comment: (score) => `${score}! Now that is what I call a happy face.`,
			mood: '🌟 10/10',
		},
	],
	solid: [
		{
			comment: () => 'Nice one. But I know you can hit 100.',
			mood: '🎯 NICE JOB',
		},
		{
			comment: (score) => `${score} points! Really good, but try for 90+ next!`,
			mood: '😄 HAPPY',
		},
		{
			comment: (score) => `${score}?! Looking great! That is a very happy look.`,
			mood: '💪 STRONG',
		},
		{
			comment: () => 'I love this energy. Let’s keep it going!',
			mood: '⚡ GOOD VIBES',
		},
	],
	warming: [
		{
			comment: () => 'Cute smirk! But let’s see more teeth next time. 😁',
			mood: '🌱 WARMING UP',
		},
		{
			comment: (score) => `${score}? Good start, now give me a bigger smile!`,
			mood: '👀 I SEE YOU',
		},
		{
			comment: () => 'Nice try! I know you have an even bigger smile in you.',
			mood: '😄 GETTING CLOSER',
		},
		{
			comment: () => 'Almost there! Try laughing on the next one.',
			mood: '🎯 TRY AGAIN',
		},
	],
	subtle: [
		{
			comment: () => 'Was that a smile or did you just remember a meme? 😂',
			mood: '😂 FUNNY',
		},
		{
			comment: () => 'Are you trying not to laugh? Give me your real smile!',
			mood: '👀 NICE TRY',
		},
		{
			comment: () => 'I know you can hit 100. Hit retake and don’t hold back!',
			mood: '🤔 TRY AGAIN',
		},
		{
			comment: () => 'Warm-up round! Now show me your biggest smile!',
			mood: '⚡ NEED MORE HYPE',
		},
	],
};

function getAiReaction(score: number): AiReaction {
	let pool: Array<{ comment: (score: number) => string; mood: string }>;
	if (score >= 95) {
		pool = AI_REACTIONS.legendary;
	} else if (score >= 85) {
		pool = AI_REACTIONS.radiant;
	} else if (score >= 70) {
		pool = AI_REACTIONS.solid;
	} else if (score >= 50) {
		pool = AI_REACTIONS.warming;
	} else {
		pool = AI_REACTIONS.subtle;
	}

	const index = Math.floor(Math.random() * pool.length);
	const selected = pool[index];
	return {
		comment: selected.comment(score),
		mood: selected.mood,
	};
}

function getVibeLabel(score: number) {
	if (score >= 95) return 'SUPERSTAR';
	if (score >= 85) return 'SHINING';
	if (score >= 70) return 'BIG SMILE';
	if (score >= 50) return 'WARM';
	return 'CHILL';
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

function getScoreBarColor(score: number) {
	if (score >= 85) return 'bg-success';
	if (score >= 70) return 'bg-accent';
	if (score >= 50) return 'bg-warning';
	return 'bg-primary';
}

export function SmileResultScreen({
	imageSrc,
	score,
	coinsAwarded,
	isRewardClaimed = false,
	isSaving = false,
	isSharingToExplore = false,
	isSharedToExplore = false,
	shareMessage,
	isQuotaFinished = false,
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
	const aiReaction = React.useMemo(() => getAiReaction(score), [score]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
			className="relative w-full space-y-6">
			<AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>

			<motion.h1
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.1 }}
				className="text-center font-title text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
				Smile Check Complete <span className="inline-block">✅</span>
			</motion.h1>

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
						<span className="font-mono text-xs font-black tracking-widest text-muted-foreground uppercase">
							Smile Score
						</span>
						<div className="mt-2 flex items-baseline gap-2">
							<span className="font-display text-7xl font-black tracking-tight text-foreground tabular-nums sm:text-8xl">
								{displayScore}
							</span>
							<span className="font-title text-2xl font-black text-muted-foreground sm:text-3xl">
								/ 100
							</span>
						</div>

						<div className="mt-3 h-3 w-full overflow-hidden rounded-xs border-[length:var(--border-width-sm)] border-border bg-muted">
							<motion.div
								className={cn('h-full', getScoreBarColor(score))}
								initial={{ width: 0 }}
								animate={{ width: `${displayScore}%` }}
								transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
							/>
						</div>
					</div>

					<div className="inline-flex w-fit items-center gap-1.5 border-[length:var(--border-width-sm)] border-border bg-primary/15 rounded-lg px-3 py-1.5 font-mono text-xs font-black uppercase tracking-wide text-foreground shadow-brutal-xs">
						<Sparkles className="size-3.5 text-primary" />
						{vibe}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 8, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: 0.35, duration: 0.35 }}
						className="relative flex flex-col gap-2 rounded-lg border-[length:var(--border-width-sm)] border-border bg-muted/60 p-3.5 shadow-brutal-xs sm:p-4">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-1.5 font-mono text-[11px] font-black uppercase tracking-wider text-foreground">
								<span className="flex size-5 items-center justify-center rounded-xs border-[length:var(--border-width-sm)] border-border bg-warning text-warning-foreground shadow-brutal-xs">
									<Bot className="size-3.5" strokeWidth={2.5} />
								</span>
								<span>Smile AI Reaction</span>
								<span className="inline-block size-1.5 rounded-full bg-success animate-pulse" />
							</div>
							<span className="rounded-xs border-[length:var(--border-width-sm)] border-border bg-card px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-muted-foreground shadow-brutal-xs">
								{aiReaction.mood}
							</span>
						</div>

						<p className="font-title text-base sm:text-lg font-black italic tracking-tight text-foreground leading-snug">
							&ldquo;{aiReaction.comment}&rdquo;
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
										: coinsAwarded > 0 ?
											`+${coinsAwarded} Coins Deposited`
										:	'0 Coins (Better luck next time!)'}
									</span>
								</div>
								<span className="font-mono text-[10px] font-black uppercase text-success">
									{coinsAwarded > 0 ? 'Claimed' : 'Revealed'}
								</span>
							</div>
						}

						{shareMessage && (
							<div className="rounded-md border-[length:var(--border-width-sm)] border-black bg-accent/30 px-3 py-2 text-center font-mono text-xs font-bold shadow-brutal-xs">
								{shareMessage}
							</div>
						)}

						<div className="flex w-full flex-col gap-2.5 sm:flex-row">
							<Button
								variant="outline"
								size="lg"
								disabled={isSharingToExplore || isSharedToExplore}
								className={cn(
									"flex-1 gap-2 border-[length:var(--border-width)] border-border font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-sm brutal-lift cursor-pointer",
									isSharedToExplore && "bg-success text-success-foreground hover:bg-success"
								)}
								onClick={onShareToExplore}>
								<Share2 className="size-4" />
								{isSharingToExplore
									? 'Sharing...'
									: isSharedToExplore
									? '✓ Shared to Explore'
									: 'Share to Explore'}
							</Button>
							{!isQuotaFinished ? (
								<Button
									variant="default"
									size="lg"
									onClick={onRetake}
									className="flex-1 gap-2 border-[length:var(--border-width)] border-border bg-warning text-warning-foreground font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-sm brutal-lift hover:bg-warning/90">
									<Camera className="size-4" />
									Capture Again
								</Button>
							) : (
								<Link href="/dashboard" className="flex-1">
									<Button
										variant="default"
										size="lg"
										className="w-full gap-2 border-[length:var(--border-width)] border-border bg-primary text-primary-foreground font-mono text-xs font-bold uppercase tracking-wider shadow-brutal-sm brutal-lift">
										Return to Dashboard
									</Button>
								</Link>
							)}
						</div>

						<p className="text-[10px] font-mono text-muted-foreground text-center">
							🔒 Privacy notice: Shared photos auto-delete from the feed and CDN after 24 hours.
						</p>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}

