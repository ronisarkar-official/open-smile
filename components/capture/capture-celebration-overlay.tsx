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
	const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([]);
	const [coins, setCoins] = React.useState<FlyingCoin[]>([]);
	const [showFlash, setShowFlash] = React.useState(false);

	React.useEffect(() => {
		if (!isActive) {
			setConfetti([]);
			setCoins([]);
			setShowFlash(false);
			return;
		}

		setShowFlash(true);
		const flashTimer = setTimeout(() => setShowFlash(false), 350);

		const pieces: ConfettiPiece[] = Array.from({ length: 48 }).map((_, i) => {
			const angle = (Math.PI * 2 * i) / 48 + (Math.random() - 0.5) * 0.5;
			const distance = 160 + Math.random() * 320;
			const shapes: ('rect' | 'circle' | 'diamond')[] = ['rect', 'circle', 'diamond'];
			return {
				id: i,
				x: 0,
				y: 0,
				color: BRUTAL_COLORS[Math.floor(Math.random() * BRUTAL_COLORS.length)],
				size: Math.floor(Math.random() * 12) + 8,
				rotation: Math.random() * 360,
				destX: Math.cos(angle) * distance,
				destY: Math.sin(angle) * distance - 80,
				shape: shapes[Math.floor(Math.random() * shapes.length)],
			};
		});
		setConfetti(pieces);

		const coinList: FlyingCoin[] = Array.from({ length: 10 }).map((_, i) => ({
			id: i,
			startX: (Math.random() - 0.5) * 120,
			startY: 40 + Math.random() * 60,
			endX: (Math.random() - 0.5) * 400,
			endY: -220 - Math.random() * 180,
			delay: i * 0.06,
			scale: 0.8 + Math.random() * 0.5,
		}));
		setCoins(coinList);

		const completeTimer = setTimeout(() => {
			onAnimationComplete?.();
		}, 1600);

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
						initial={{ opacity: 0.9 }}
						animate={{ opacity: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.35, ease: 'easeOut' }}
						className="absolute inset-0 bg-background/80 backdrop-blur-xs"
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
							y: piece.destY + 250,
							scale: [0, 1.2, 0.9, 0],
							rotate: piece.rotation + 720,
							opacity: [1, 1, 0.9, 0],
						}}
						transition={{
							duration: 1.4,
							ease: [0.22, 1, 0.36, 1],
						}}
						style={{
							position: 'absolute',
							width: piece.size,
							height: piece.shape === 'rect' ? piece.size * 1.6 : piece.size,
							backgroundColor: piece.color,
							border: 'var(--border-width-sm) solid var(--border)',
							borderRadius: piece.shape === 'circle' ? '9999px' : piece.shape === 'diamond' ? '2px' : '0px',
							boxShadow: 'var(--brutal-shadow-xs)',
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
							scale: [0.2, coin.scale * 1.2, coin.scale, 0],
							opacity: [0, 1, 1, 0],
							rotate: 360,
						}}
						transition={{
							duration: 1.3,
							delay: coin.delay,
							ease: [0.25, 1, 0.5, 1],
						}}
						className="absolute flex items-center justify-center rounded-full border-[length:var(--border-width-sm)] border-border bg-warning text-warning-foreground p-2 shadow-brutal-sm">
						<CoinIcon className="size-6 text-warning-foreground" strokeWidth={2.5} />
					</motion.div>
				))}

				<motion.div
					initial={{ scale: 0, y: 80, rotate: -10 }}
					animate={{
						scale: [0, 1.25, 1, 1],
						y: [80, -70, -20, -30],
						rotate: [-10, 8, -4, 0],
					}}
					transition={{
						duration: 1.1,
						times: [0, 0.35, 0.7, 1],
						ease: [0.34, 1.56, 0.64, 1],
					}}
					className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
					<div className="relative flex size-24 items-center justify-center border-[length:var(--border-width)] border-border bg-accent rounded-2xl shadow-brutal-lg">
						<span className="text-4xl select-none">😆</span>
						<motion.div
							animate={{ rotate: [0, 15, -15, 0] }}
							transition={{ repeat: Infinity, duration: 0.6 }}
							className="absolute -top-3 -right-3 flex size-8 items-center justify-center border-[length:var(--border-width-sm)] border-border bg-primary text-primary-foreground rounded-lg shadow-brutal-xs">
							<Star className="size-4 fill-primary-foreground text-primary-foreground" />
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 15, scale: 0.7 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.4 }}
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
