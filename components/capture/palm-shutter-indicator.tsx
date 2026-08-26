'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hand } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PalmPoint } from '@/lib/palm-detection';

interface PalmShutterIndicatorProps {
	isPalmDetected: boolean;
	holdProgress: number;
	palmCenter: PalmPoint | null;
	enabled: boolean;
	className?: string;
}

export function PalmShutterIndicator({
	isPalmDetected,
	holdProgress,
	palmCenter,
	enabled,
	className,
}: PalmShutterIndicatorProps) {
	if (!enabled) return null;

	const clampedProgress = Math.min(1, Math.max(0, holdProgress));
	const mirroredX = palmCenter ? (1 - palmCenter.x) * 100 : 50;
	const topY = palmCenter ? palmCenter.y * 100 : 50;

	return (
		<div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
			<AnimatePresence>
				{isPalmDetected && palmCenter && (
					<motion.div
						initial={{ scale: 0.7, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.6, opacity: 0 }}
						transition={{ type: 'spring', damping: 18, stiffness: 300 }}
						style={{
							left: `${mirroredX}%`,
							top: `${topY}%`,
							transform: 'translate(-50%, -50%)',
						}}
						className="absolute flex flex-col items-center">
						<div className="relative flex size-20 items-center justify-center border-[length:var(--border-width-lg)] border-border bg-warning text-warning-foreground shadow-brutal-sm rounded-lg sm:size-24">
							<Hand className="size-10 animate-bounce sm:size-12" strokeWidth={2.2} />

							<svg
								className="absolute -inset-2 size-[calc(100%+16px)] -rotate-90 pointer-events-none"
								viewBox="0 0 100 100">
								<rect
									x="6"
									y="6"
									width="88"
									height="88"
									rx="8"
									fill="none"
									stroke="currentColor"
									strokeWidth="6"
									className="text-border/20"
								/>
								<rect
									x="6"
									y="6"
									width="88"
									height="88"
									rx="8"
									fill="none"
									stroke="currentColor"
									strokeWidth="7"
									strokeDasharray="352"
									strokeDashoffset={352 * (1 - clampedProgress)}
									className="text-destructive transition-all duration-75"
								/>
							</svg>
						</div>

						<div className="mt-3 flex items-center gap-1.5 border-[length:var(--border-width)] border-border bg-card px-2.5 py-1 font-mono text-[11px] font-black uppercase tracking-wider text-foreground shadow-brutal-xs rounded-sm whitespace-nowrap">
							<span className="size-2 rounded-full bg-destructive animate-ping" />
							<span>Hold to shoot {Math.round(clampedProgress * 100)}%</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
