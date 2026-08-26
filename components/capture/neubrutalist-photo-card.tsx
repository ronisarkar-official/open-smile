'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

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
		return `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${now.toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase()}`;
	}, [timestamp]);

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
			animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
			transition={{ type: 'spring', damping: 20, stiffness: 260 }}
			className={cn(
				'group relative border-[length:var(--border-width)] border-border bg-card text-card-foreground rounded-xl p-3.5 shadow-brutal-lg transition-transform hover:rotate-0 sm:p-4',
				className
			)}>
			<div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 h-5 w-24 border-[length:var(--border-width-sm)] border-border bg-warning/90 rounded-xs shadow-brutal-xs rotate-[-2deg] select-none" />

			<div className="relative aspect-[4/3] w-full overflow-hidden border-[length:var(--border-width)] border-border rounded-lg bg-muted">
				{imageSrc ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={imageSrc}
						alt="Your genuine smile capture"
						className="size-full object-cover"
					/>
				) : (
					<div className="flex size-full flex-col items-center justify-center gap-2 bg-muted p-6 text-center">
						<Camera className="size-10 text-muted-foreground" />
						<span className="font-mono text-xs font-bold text-muted-foreground uppercase">
							Smile Snapshot Saved
						</span>
					</div>
				)}

				<div className="absolute top-2.5 right-2.5 flex items-center gap-1 border-[length:var(--border-width-sm)] border-border bg-accent text-accent-foreground rounded-md px-2 py-0.5 font-mono text-[11px] font-black uppercase shadow-brutal-xs">
					<CheckCircle className="size-3 text-accent-foreground" strokeWidth={3} />
					VERIFIED
				</div>
			</div>

			<div className="mt-3 flex items-center justify-between border-t-[length:var(--border-width-sm)] border-border/20 pt-2.5">
				<div className="flex items-center gap-1.5">
					<div className="flex size-6 items-center justify-center border-[length:var(--border-width-sm)] border-border bg-primary text-primary-foreground rounded-md shadow-brutal-xs">
						<Sparkles className="size-3.5 text-primary-foreground" />
					</div>
					<span className="font-mono text-xs font-black tracking-wider text-foreground uppercase">
						DUCHENNE AI
					</span>
				</div>
				<span className="font-mono text-[11px] font-bold text-muted-foreground tracking-tight">
					{displayTime}
				</span>
			</div>
		</motion.div>
	);
}
