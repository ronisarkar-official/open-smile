'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, Star } from 'lucide-react';
import { CoinIcon } from '@/components/ui/coin-icon';

interface ConfettiPiece {
	id: number;
	x: number;
	y: number;
	color: string;
	size: number;
	rotation: number;
	destX: number;
	destY: number;
	shape: 'rect' | 'circle' | 'diamond';
}

interface FlyingCoin {
	id: number;
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	delay: number;
	scale: number;
}

interface CaptureCelebrationOverlayProps {
	isActive: boolean;
	onAnimationComplete?: () => void;
}

const BRUTAL_COLORS = [
	'var(--warning)',
	'var(--primary)',
	'var(--secondary)',
	'var(--accent)',
	'var(--info)',
	'var(--card)',
];

export function CaptureCelebrationOverlay({
	isActive,
	onAnimationComplete,
}: CaptureCelebrationOverlayProps) {
	const [showFlash, setShowFlash] = React.useState(false);

	const confetti = React.useMemo<ConfettiPiece[]>(() => {
		const shapes: ('rect' | 'circle' | 'diamond')[] = ['rect', 'circle', 'diamond'];
		return Array.from({ length: 26 }, (_, i) => {
			const angle = (Math.PI * 2 * i) / 26 + (Math.sin(i * 99) * 0.4);
			const distance = 140 + (i % 7) * 28;
			return {
				id: i,
				x: 0,
				y: 0,
				color: BRUTAL_COLORS[i % BRUTAL_COLORS.length],
				size: (i % 5) * 2 + 8,
				rotation: (i * 45) % 360,
				destX: Math.cos(angle) * distance,
				destY: Math.sin(angle) * distance - 60,
				shape: shapes[i % shapes.length],
			};
		});
	}, []);

	const coins = React.useMemo<FlyingCoin[]>(() => {
		return Array.from({ length: 6 }, (_, i) => ({
			id: i,
			startX: (i - 2.5) * 35,
			startY: 40 + (i % 3) * 15,
			endX: (i - 2.5) * 85,
			endY: -180 - (i % 4) * 35,
			delay: i * 0.05,
			scale: 0.9 + (i % 3) * 0.15,
		}));
	}, []);

	React.useEffect(() => {
		if (!isActive) {
			setShowFlash(false);
			return;
		}

		setShowFlash(true);
		const flashTimer = setTimeout(() => setShowFlash(false), 250);
		const completeTimer = setTimeout(() => {
			onAnimationComplete?.();
		}, 1400);

		return () => {
			clearTimeout(flashTimer);
			clearTimeout(completeTimer);
		};
	}, [isActive, onAnimationComplete]);

	if (!isActive) return null;

	return (
		<div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
			<AnimatePresence>
				{showFlash && (
					<motion.div
						initial={{ opacity: 0.8 }}
						animate={{ opacity: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25, ease: 'easeOut' }}
						className="absolute inset-0 bg-background/90"
					/>
				)}
			</AnimatePresence>

			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				{confetti.map((piece) => (
					<motion.div
						key={piece.id}
						initial={{
							x: 0,
							y: 0,
							scale: 0,
							rotate: 0,
							opacity: 1,
						}}
						animate={{
							x: piece.destX,
							y: piece.destY + 200,
							scale: [0, 1.1, 0.9, 0],
							rotate: piece.rotation + 540,
							opacity: [1, 1, 0.8, 0],
						}}
						transition={{
							duration: 1.2,
							ease: [0.22, 1, 0.36, 1],
						}}
						style={{
							position: 'absolute',
							width: piece.size,
							height: piece.shape === 'rect' ? piece.size * 1.5 : piece.size,
							backgroundColor: piece.color,
							border: '1.5px solid var(--border)',
							borderRadius: piece.shape === 'circle' ? '9999px' : piece.shape === 'diamond' ? '2px' : '0px',
							willChange: 'transform, opacity',
						}}
					/>
				))}

				{coins.map((coin) => (
					<motion.div
						key={coin.id}
						initial={{
							x: coin.startX,
							y: coin.startY,
							scale: 0.2,
							opacity: 0,
							rotate: 0,
						}}
						animate={{
							x: coin.endX,
							y: coin.endY,
							scale: [0.2, coin.scale * 1.1, coin.scale, 0],
							opacity: [0, 1, 1, 0],
							rotate: 360,
						}}
						transition={{
							duration: 1.1,
							delay: coin.delay,
							ease: [0.25, 1, 0.5, 1],
						}}
						style={{ willChange: 'transform, opacity' }}
						className="absolute flex items-center justify-center rounded-full border-[length:var(--border-width-sm)] border-border bg-warning text-warning-foreground p-2 shadow-brutal-sm">
						<CoinIcon className="size-6 text-warning-foreground" strokeWidth={2.5} />
					</motion.div>
				))}

				<motion.div
					initial={{ scale: 0, y: 60, rotate: -8 }}
					animate={{
						scale: [0, 1.15, 1, 1],
						y: [60, -50, -15, -20],
						rotate: [-8, 6, -3, 0],
					}}
					transition={{
						duration: 1.0,
						times: [0, 0.35, 0.7, 1],
						ease: [0.34, 1.56, 0.64, 1],
					}}
					style={{ willChange: 'transform, opacity' }}
					className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
					<div className="relative flex size-24 items-center justify-center border-[length:var(--border-width)] border-border bg-accent rounded-2xl shadow-brutal-lg">
						<span className="text-4xl select-none">😆</span>
						<motion.div
							animate={{ scale: [1, 1.15, 1] }}
							transition={{ repeat: 2, duration: 0.4 }}
							className="absolute -top-3 -right-3 flex size-8 items-center justify-center border-[length:var(--border-width-sm)] border-border bg-primary text-primary-foreground rounded-lg shadow-brutal-xs">
							<Star className="size-4 fill-primary-foreground text-primary-foreground" />
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: 0.15, duration: 0.3 }}
						className="mt-3 flex items-center gap-1.5 border-[length:var(--border-width-sm)] border-border bg-warning text-warning-foreground rounded-lg px-3.5 py-1 font-mono text-xs font-black tracking-wider uppercase shadow-brutal-sm">
						<Zap className="size-3.5 fill-warning-foreground" />
						+SMILE POWER
						<Sparkles className="size-3.5" />
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
