'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import {
	Camera,
	CheckCircle,
	Flame,
	Heart,
	Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CoinIcon } from '../icons';

interface NeubrutalistPhotoCardProps {
	imageSrc: string | null;
	score: number;
	timestamp?: string;
	className?: string;
}

export function NeubrutalistPhotoCard({
	imageSrc,
	score,
	timestamp,
	className,
}: NeubrutalistPhotoCardProps) {
	const displayTime = React.useMemo(() => {
		if (timestamp) return timestamp;

		const now = new Date();

		return `${now.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})} • ${now
			.toLocaleDateString([], {
				month: 'short',
				day: 'numeric',
			})
			.toUpperCase()}`;
	}, [timestamp]);

	const smileMessage = React.useMemo(() => {
		if (score >= 95) return 'LEGENDARY SMILE';
		if (score >= 85) return 'THAT SMILE HITS';
		if (score >= 70) return 'GREAT SMILE';
		if (score >= 50) return 'NICE ONE';
		return 'KEEP SMILING';
	}, [score]);

	const scoreEmoji = React.useMemo(() => {
		if (score >= 95) return '🤩';
		if (score >= 85) return '😄';
		if (score >= 70) return '😁';
		if (score >= 50) return '🙂';
		return '😅';
	}, [score]);

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9, rotate: -4, y: 20 }}
			animate={{ opacity: 1, scale: 1, rotate: -1.5, y: 0 }}
			transition={{ type: 'spring', damping: 18, stiffness: 240 }}
			whileHover={{ rotate: 0, y: -5 }}
			className={cn(
				'group relative w-full overflow-visible rounded-xl border-[length:var(--border-width)] border-border bg-card p-3.5 text-card-foreground shadow-brutal-lg transition-transform sm:p-4',
				className,
			)}>
			{/* Decorative floating stickers */}
			<motion.div
				animate={{ rotate: [2, -4, 2], y: [0, -3, 0] }}
				transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
				className="absolute -right-3 -top-5 z-30 flex items-center gap-1 rounded-md border-[length:var(--border-width-sm)] border-border bg-warning px-2.5 py-1 font-mono text-[10px] font-black uppercase shadow-brutal-xs">
				<Sparkles
					className="size-3"
					strokeWidth={3}
				/>
				{smileMessage}
			</motion.div>

			<motion.div
				animate={{ rotate: [0, 8, 0, -8, 0] }}
				transition={{ duration: 4, repeat: Infinity }}
				className="absolute -bottom-3 -left-3 z-30 flex size-9 items-center justify-center rounded-full border-[length:var(--border-width-sm)] border-border bg-accent shadow-brutal-xs">
				<Heart
					className="size-4 fill-current"
					strokeWidth={3}
				/>
			</motion.div>

			{/* Tape */}
			<div className="absolute -top-3 left-1/2 z-20 h-5 w-24 -translate-x-1/2 rotate-[-2deg] rounded-xs border-[length:var(--border-width-sm)] border-border bg-warning/90 shadow-brutal-xs" />

			{/* Photo / capture area */}
			<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border-[length:var(--border-width)] border-border bg-muted">
				{imageSrc ?
					<>
						{/* Image */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={imageSrc}
							alt="Your genuine smile capture"
							className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						/>

						{/* Soft overlay */}
						<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

						{/* Corner camera brackets */}
						<div className="pointer-events-none absolute inset-3">
							<div className="absolute left-0 top-0 h-7 w-7 border-l-[3px] border-t-[3px] border-white" />
							<div className="absolute right-0 top-0 h-7 w-7 border-r-[3px] border-t-[3px] border-white" />
							<div className="absolute bottom-0 left-0 h-7 w-7 border-b-[3px] border-l-[3px] border-white" />
							<div className="absolute bottom-0 right-0 h-7 w-7 border-b-[3px] border-r-[3px] border-white" />
						</div>

						{/* Verified badge */}
						<div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md border-[length:var(--border-width-sm)] border-border bg-accent px-2 py-1 font-mono text-[10px] font-black uppercase shadow-brutal-xs">
							<CheckCircle
								className="size-3"
								strokeWidth={3}
							/>
							VERIFIED
						</div>

						
					</>
				:	<div className="flex size-full flex-col items-center justify-center gap-3 bg-muted p-6 text-center">
						<motion.div
							animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
							transition={{ duration: 2.5, repeat: Infinity }}
							className="flex size-16 items-center justify-center rounded-full border-[length:var(--border-width)] border-border bg-warning shadow-brutal">
							<Camera
								className="size-8"
								strokeWidth={2.5}
							/>
						</motion.div>

						<div>
							<div className="font-mono text-sm font-black uppercase">
								Smile Snapshot Saved
							</div>
							<div className="mt-1 text-xs text-muted-foreground">
								Your smile is ready for review.
							</div>
						</div>
					</div>
				}

				{/* Floating score badge */}
				
			</div>

			{/* Score reaction */}
			<div className="mt-7 flex items-center justify-between gap-3">
				<div>
					<div className="flex items-center gap-2">
						<span className="text-xl">{scoreEmoji}</span>
						<span className="font-mono text-sm font-black uppercase">
							{smileMessage}
						</span>
					</div>

					
				</div>

				
			</div>

			

			{/* Footer */}
			<div className="mt-3 flex items-center justify-between border-t-[length:var(--border-width-sm)] border-border/20 pt-2.5">
				<div className="flex items-center gap-1.5">
					<motion.div
						animate={{ rotate: [0, -5, 5, 0] }}
						transition={{ duration: 2.5, repeat: Infinity }}>
						<CoinIcon className="size-4.5 text-primary-foreground" />
					</motion.div>

					<span className="font-mono text-xs font-black uppercase tracking-wider">
						Open Smile
					</span>
				</div>

				<div className="flex items-center gap-1.5">
					<Flame
						className="size-3.5 text-destructive"
						strokeWidth={3}
					/>

					<span className="font-mono text-[11px] font-bold tracking-tight text-muted-foreground">
						{displayTime}
					</span>
				</div>
			</div>
		</motion.div>
	);
}
