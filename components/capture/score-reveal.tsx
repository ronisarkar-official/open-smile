'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreRevealProps {
	score: number;
	className?: string;
}

function getScoreLabel(score: number) {
	if (score >= 81) return 'Outstanding smile!';
	if (score >= 61) return 'Great smile!';
	if (score >= 41) return 'Nice smile!';
	if (score >= 21) return 'Getting there!';
	return 'Try harder!';
}

function getScoreColor(score: number) {
	if (score >= 80) return 'bg-success';
	if (score >= 60) return 'bg-accent';
	if (score >= 40) return 'bg-secondary';
	return 'bg-primary';
}

export function ScoreReveal({ score, className }: ScoreRevealProps) {
	const [displayScore, setDisplayScore] = React.useState(0);

	React.useEffect(() => {
		let frame: number;
		const duration = 1200;
		const start = performance.now();

		function animate(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			const current = Math.round(eased * score);
			setDisplayScore(current);

			if (progress < 1) {
				frame = requestAnimationFrame(animate);
			}
		}

		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	}, [score]);

	return (
		<motion.article
			initial={{ opacity: 0, scale: 0.9, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ type: 'spring', damping: 20, stiffness: 300 }}
			className={cn(
				'border-[length:var(--border-width)] border-black rounded-xl bg-primary p-5 shadow-brutal-xl',
				className
			)}>
			<Sparkles className="size-7" strokeWidth={2.5} />
			<p className="mt-6 font-mono text-xs font-bold tracking-[0.14em] uppercase">
				Your score
			</p>
			<motion.p
				className="font-display mt-2 text-7xl font-black tracking-[-0.08em] tabular-nums sm:text-8xl"
				initial={{ scale: 0.5 }}
				animate={{ scale: 1 }}
				transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}>
				{displayScore}
			</motion.p>
			<motion.p
				className="mt-2 text-base font-bold"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}>
				{getScoreLabel(score)}
			</motion.p>
			<div className="mt-4 h-3 w-full border-[length:var(--border-width-sm)] border-black rounded-xs bg-card overflow-hidden">
				<motion.div
					className={cn('h-full', getScoreColor(score))}
					initial={{ width: 0 }}
					animate={{ width: `${score}%` }}
					transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
				/>
			</div>
		</motion.article>
	);
}
