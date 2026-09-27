'use client';

import React, { useEffect, useState } from 'react';
import {
	motion,
	useMotionValue,
	useSpring,
	useTransform,
	useReducedMotion,
	type MotionValue,
} from 'motion/react';
import { GumroadCoin, type GumroadCoinProps } from './gumroad-coin';
import { cn } from '@/lib/utils';

interface FloatingCoinConfig {
	key: string;
	className: string;
	coinClassName: string;
	rx: number;
	ry: number;
	depth: number;
	baseRotation: number;
	variant?: GumroadCoinProps['variant'];
	parallaxFactor: number;
	tiltFactor: number;
	floatDuration: number;
	floatY: number;
	floatRotate: number;
	delay: number;
}

const COIN_CONFIGS: FloatingCoinConfig[] = [
	{
		key: 'coin-1',
		className: 'absolute -top-3 left-1 sm:top-2 sm:left-4 lg:top-6 lg:left-8',
		coinClassName: 'w-20 sm:w-28 lg:w-32 h-auto',
		rx: 54,
		ry: 33,
		depth: 19,
		baseRotation: -36,
		variant: 'classic',
		parallaxFactor: 0.7,
		tiltFactor: 0.8,
		floatDuration: 5.2,
		floatY: 9,
		floatRotate: 2.2,
		delay: 0,
	},
	{
		key: 'coin-2',
		className:
			'absolute -bottom-8 -left-6 sm:-bottom-12 sm:-left-8 lg:-bottom-16 lg:-left-12',
		coinClassName: 'w-36 sm:w-52 lg:w-68 xl:w-76 h-auto',
		rx: 108,
		ry: 72,
		depth: 34,
		baseRotation: -18,
		variant: 'classic',
		parallaxFactor: 1.25,
		tiltFactor: 1.1,
		floatDuration: 6.4,
		floatY: 15,
		floatRotate: 2.5,
		delay: 0.5,
	},
	{
		key: 'coin-3',
		className:
			'absolute -top-2 right-2 sm:top-2 sm:right-6 lg:top-3 lg:right-10 xl:right-16',
		coinClassName: 'w-16 sm:w-22 lg:w-28 h-auto',
		rx: 48,
		ry: 29,
		depth: 16,
		baseRotation: 28,
		variant: 'wink',
		parallaxFactor: 0.55,
		tiltFactor: 0.65,
		floatDuration: 4.2,
		floatY: 7,
		floatRotate: 2,
		delay: 1.1,
	},
	{
		key: 'coin-4',
		className:
			'absolute -bottom-8 right-8 sm:-bottom-10 sm:right-16 lg:-bottom-12 lg:right-28 xl:right-36',
		coinClassName: 'w-28 sm:w-40 lg:w-52 h-auto',
		rx: 82,
		ry: 52,
		depth: 27,
		baseRotation: -24,
		variant: 'classic',
		parallaxFactor: 0.95,
		tiltFactor: 0.9,
		floatDuration: 5.6,
		floatY: 12,
		floatRotate: 2.3,
		delay: 0.8,
	},
	{
		key: 'coin-5',
		className:
			'hidden sm:block absolute top-1/2 -right-6 lg:-right-10 -translate-y-1/2',
		coinClassName: 'w-24 sm:w-32 lg:w-40 h-auto',
		rx: 58,
		ry: 27,
		depth: 22,
		baseRotation: -52,
		variant: 'classic',
		parallaxFactor: 0.8,
		tiltFactor: 0.75,
		floatDuration: 4.8,
		floatY: 10,
		floatRotate: 1.8,
		delay: 0.25,
	},
];

interface FloatingCoinItemProps {
	config: FloatingCoinConfig;
	smoothMouseX: MotionValue<number>;
	smoothMouseY: MotionValue<number>;
}

function FloatingCoinItem({
	config,
	smoothMouseX,
	smoothMouseY,
}: FloatingCoinItemProps) {
	const shouldReduceMotion = useReducedMotion();
	const [spinCount, setSpinCount] = useState(0);

	const x = useTransform(smoothMouseX, (val) =>
		shouldReduceMotion ? 0 : val * config.parallaxFactor * 32
	);
	const y = useTransform(smoothMouseY, (val) =>
		shouldReduceMotion ? 0 : val * config.parallaxFactor * 26
	);
	const rotateX = useTransform(smoothMouseY, (val) =>
		shouldReduceMotion ? 0 : -val * config.tiltFactor * 14
	);
	const rotateY = useTransform(smoothMouseX, (val) =>
		shouldReduceMotion ? 0 : val * config.tiltFactor * 16
	);

	return (
		<motion.div
			className={cn('select-none will-change-transform', config.className)}
			style={{
				x,
				y,
				rotateX,
				rotateY,
				transformStyle: 'preserve-3d',
				perspective: 1000,
			}}>
			<motion.div
				animate={
					shouldReduceMotion
						? undefined
						: {
								y: [-config.floatY, config.floatY],
								rotate: [-config.floatRotate, config.floatRotate],
						  }
				}
				transition={{
					duration: config.floatDuration,
					repeat: Infinity,
					repeatType: 'reverse',
					ease: 'easeInOut',
					delay: config.delay,
				}}>
				<motion.div
					whileHover={
						shouldReduceMotion
							? undefined
							: {
									scale: 1.1,
									y: -4,
									transition: { type: 'spring', stiffness: 450, damping: 16 },
							  }
					}
					whileTap={
						shouldReduceMotion
							? undefined
							: {
									scale: 0.94,
									transition: { type: 'spring', stiffness: 500, damping: 20 },
							  }
					}
					animate={{
						rotate: spinCount * 360,
					}}
					transition={{
						type: 'spring',
						stiffness: 260,
						damping: 18,
					}}
					onClick={() => setSpinCount((count) => count + 1)}
					className="pointer-events-auto inline-block cursor-pointer touch-manipulation origin-center"
					tabIndex={-1}>
					<GumroadCoin
						rx={config.rx}
						ry={config.ry}
						depth={config.depth}
						rotation={config.baseRotation}
						variant={config.variant}
						className={config.coinClassName}
					/>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

export function HeroFloatingCoins() {
	const rawMouseX = useMotionValue(0);
	const rawMouseY = useMotionValue(0);

	const springConfig = { damping: 25, stiffness: 120, mass: 0.6 };
	const smoothMouseX = useSpring(rawMouseX, springConfig);
	const smoothMouseY = useSpring(rawMouseY, springConfig);

	useEffect(() => {
		const handlePointerMove = (e: PointerEvent) => {
			const { innerWidth, innerHeight } = window;
			if (innerWidth > 0 && innerHeight > 0) {
				const nx = (e.clientX / innerWidth - 0.5) * 2;
				const ny = (e.clientY / innerHeight - 0.5) * 2;
				rawMouseX.set(Math.max(-1, Math.min(1, nx)));
				rawMouseY.set(Math.max(-1, Math.min(1, ny)));
			}
		};

		const handlePointerLeave = () => {
			rawMouseX.set(0);
			rawMouseY.set(0);
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				const touch = e.touches[0];
				const { innerWidth, innerHeight } = window;
				if (innerWidth > 0 && innerHeight > 0) {
					const nx = (touch.clientX / innerWidth - 0.5) * 2;
					const ny = (touch.clientY / innerHeight - 0.5) * 2;
					rawMouseX.set(Math.max(-1, Math.min(1, nx)));
					rawMouseY.set(Math.max(-1, Math.min(1, ny)));
				}
			}
		};

		const handleTouchEnd = () => {
			rawMouseX.set(0);
			rawMouseY.set(0);
		};

		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
		window.addEventListener('touchmove', handleTouchMove, { passive: true });
		window.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerleave', handlePointerLeave);
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('touchend', handleTouchEnd);
		};
	}, [rawMouseX, rawMouseY]);

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
			{COIN_CONFIGS.map((config) => (
				<FloatingCoinItem
					key={config.key}
					config={config}
					smoothMouseX={smoothMouseX}
					smoothMouseY={smoothMouseY}
				/>
			))}
		</div>
	);
}

export default HeroFloatingCoins;
