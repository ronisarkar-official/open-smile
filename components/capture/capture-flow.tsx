'use client';

import * as React from 'react';
import { Camera, CircleDot, Share2, Coins, Flame, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { WebcamView, requestCameraStream } from '@/components/capture/webcam-view';
import { ScoreReveal } from '@/components/capture/score-reveal';
import { AuthGateOverlay } from '@/components/capture/auth-gate-overlay';
import { ScratchCardModal, type ScratchCardItem } from '@/components/rewards/scratch-card-modal';
import { CoinIcon } from '@/components/ui/coin-icon';
import { initSmileDetector, type SmileDetectionResult } from '@/lib/smile-detection';

type CapturePhase =
	| 'IDLE'
	| 'CAMERA_ACTIVE'
	| 'CAPTURING'
	| 'SCORED'
	| 'SCRATCH_CARD'
	| 'DONE';

const STORAGE_KEY = 'opensmile_pending_capture';

export function CaptureFlow() {
	const { data: session } = useSession();
	const isLoggedIn = !!session?.user;

	const [phase, setPhase] = React.useState<CapturePhase>('IDLE');
	const [smileScore, setSmileScore] = React.useState(0);
	const [coinsAwarded, setCoinsAwarded] = React.useState(0);
	const [lastResult, setLastResult] = React.useState<SmileDetectionResult | null>(null);
	const [cameraReady, setCameraReady] = React.useState(false);
	const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null);
	const [isConnecting, setIsConnecting] = React.useState(false);
	const [showAuthGate, setShowAuthGate] = React.useState(false);
	const [scratchModalOpen, setScratchModalOpen] = React.useState(false);
	const [saving, setSaving] = React.useState(false);

	React.useEffect(() => {
		initSmileDetector().catch((err) => {
			console.warn('[OpenSmile] Pre-warm model notice:', err);
		});
	}, []);

	React.useEffect(() => {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (stored && isLoggedIn) {
			try {
				const data = JSON.parse(stored);
				if (data.score && data.coins) {
					setSmileScore(data.score);
					setCoinsAwarded(data.coins);
					setPhase('SCRATCH_CARD');
					setScratchModalOpen(true);
					sessionStorage.removeItem(STORAGE_KEY);
				}
			} catch {
				sessionStorage.removeItem(STORAGE_KEY);
			}
		}
	}, [isLoggedIn]);

	const handleSmileUpdate = React.useCallback((result: SmileDetectionResult | null) => {
		setLastResult(result);
	}, []);

	const handleCameraReady = React.useCallback(() => {
		setCameraReady(true);
		setIsConnecting(false);
	}, []);

	const handleStartCamera = async () => {
		setIsConnecting(true);
		try {
			const stream = await requestCameraStream();
			setCameraStream(stream);
			setPhase('CAMERA_ACTIVE');
		} catch (err) {
			console.error('[OpenSmile] Direct camera click acquisition error:', err);
			setPhase('CAMERA_ACTIVE');
		} finally {
			setIsConnecting(false);
		}
	};

	const handleCapture = () => {
		const score = lastResult?.score ?? (Math.floor(Math.random() * 30) + 70);
		const coins = Math.max(1, Math.floor(score / 10));

		setSmileScore(score);
		setCoinsAwarded(coins);
		setPhase('SCORED');

		if (cameraStream) {
			cameraStream.getTracks().forEach((track) => track.stop());
			setCameraStream(null);
		}
	};

	const handleRevealCoins = () => {
		setPhase('SCRATCH_CARD');
		setScratchModalOpen(true);
	};

	const handleScratchAttempt = React.useCallback((): boolean => {
		if (!isLoggedIn) {
			sessionStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ score: smileScore, coins: coinsAwarded })
			);
			setShowAuthGate(true);
			return false;
		}
		return true;
	}, [isLoggedIn, smileScore, coinsAwarded]);

	const handleCardScratched = async (_cardId: string, _coinsWon: number) => {
		if (!isLoggedIn) return;

		setSaving(true);
		try {
			const res = await fetch('/api/capture/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ smile_score: smileScore }),
			});

			if (res.ok) {
				const data = await res.json();
				setCoinsAwarded(data.coins_awarded);
			}
		} catch {
		} finally {
			setSaving(false);
			setPhase('DONE');
			setScratchModalOpen(false);
		}
	};

	const handleCaptureAgain = () => {
		if (cameraStream) {
			cameraStream.getTracks().forEach((track) => track.stop());
			setCameraStream(null);
		}
		setSmileScore(0);
		setCoinsAwarded(0);
		setLastResult(null);
		setCameraReady(false);
		setShowAuthGate(false);
		setPhase('IDLE');
	};

	const scratchCard: ScratchCardItem = {
		id: 'capture-reward',
		title: 'Smile Capture Reward',
		source: 'Live Smile Check',
		date: 'Just now',
		coins: coinsAwarded,
		isScratched: false,
		themeColor: '#FF2D78',
		badge: 'NEW',
	};

	return (
		<main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
			{isLoggedIn && (
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-lg bg-primary px-3 py-2 font-mono text-sm font-bold tracking-wider shadow-brutal-sm">
							<CoinIcon className="size-4" strokeWidth={2.5} />
							<span className="tabular-nums">—</span>
						</div>
						<div className="flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-lg bg-secondary px-3 py-2 font-mono text-sm font-bold tracking-wider shadow-brutal-sm">
							<Flame className="size-4" strokeWidth={2.5} />
							<span className="tabular-nums">—</span>
						</div>
					</div>
					<div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
						{phase === 'CAMERA_ACTIVE' && cameraReady && (
							<>
								<span className="relative flex size-2.5">
									<span className="absolute inline-flex size-full animate-ping bg-success opacity-75" />
									<span className="relative inline-flex size-2.5 bg-success" />
								</span>
								Camera active
							</>
						)}
					</div>
				</div>
			)}

			<section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
				<div className="flex flex-col gap-6">
					{phase === 'IDLE' && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="shadow-brutal-lg border-[length:var(--border-width)] border-black rounded-xl overflow-hidden bg-card">
							<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black bg-muted px-4 py-3">
								<div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
									<Camera className="size-4" strokeWidth={2.5} />
									Live Smile Capture
								</div>
							</div>
							<div className="flex min-h-80 flex-col items-center justify-center gap-6 p-8 sm:min-h-[28rem]">
								<div className="flex size-24 items-center justify-center border-[length:var(--border-width)] border-black rounded-xl bg-accent shadow-brutal">
									<Camera className="size-12" strokeWidth={1.5} />
								</div>
								<div className="text-center">
									<h2 className="font-title text-2xl font-black">
										Ready to smile?
									</h2>
									<p className="mt-2 max-w-[34ch] text-sm text-muted-foreground font-semibold">
										Start your camera, show your brightest smile, and let AI calculate your reward coins!
									</p>
									{!isLoggedIn && (
										<p className="mt-3 text-xs text-muted-foreground border border-black/10 rounded-md px-3 py-1.5 inline-block">
											🔒 Anyone can capture — sign in when scratching to deposit coins
										</p>
									)}
								</div>
								<Button
									size="lg"
									className="gap-2 text-base px-8 py-6 font-mono font-bold uppercase tracking-wider"
									disabled={isConnecting}
									onClick={handleStartCamera}>
									<Camera className="size-5" />
									{isConnecting ? 'Connecting camera...' : 'Start Camera'}
								</Button>
							</div>
						</motion.div>
					)}

					{(phase === 'CAMERA_ACTIVE' || phase === 'CAPTURING') && (
						<>
							<WebcamView
								isActive={true}
								isFrozen={phase === 'CAPTURING'}
								stream={cameraStream}
								onStreamChange={setCameraStream}
								onSmileUpdate={handleSmileUpdate}
								onReady={handleCameraReady}
							/>

							{phase !== 'CAPTURING' && (
								<div className="flex items-center gap-3 border-[length:var(--border-width)] border-black rounded-lg bg-accent/30 px-4 py-3">
									<Eye className="size-4 shrink-0" strokeWidth={2.5} />
									<p className="font-mono text-xs font-bold tracking-wider uppercase">
										{lastResult?.hasFace
											? `Face detected (${lastResult.score}%) — hit Capture when ready!`
											: 'Look at the camera and position your face in the box'}
									</p>
								</div>
							)}

							<div className="flex flex-col gap-3 sm:flex-row">
								<Button
									size="lg"
									className="flex-1 gap-2 text-base font-mono font-bold uppercase tracking-wider"
									disabled={!cameraReady}
									onClick={handleCapture}>
									<Sparkles className="size-5" />
									Capture Smile
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="gap-2 font-mono font-bold uppercase tracking-wider"
									onClick={handleCaptureAgain}>
									<CircleDot className="size-5" />
									Cancel
								</Button>
							</div>
						</>
					)}

					{(phase === 'SCORED' || phase === 'DONE') && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="shadow-brutal-lg border-[length:var(--border-width)] border-black rounded-xl overflow-hidden bg-card">
							<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-black bg-muted px-4 py-3">
								<div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
									<Camera className="size-4" strokeWidth={2.5} />
									Capture complete
								</div>
								<span className="font-mono text-[10px] font-bold tracking-widest uppercase text-success">
									SCORED
								</span>
							</div>
							<div className="flex min-h-60 flex-col items-center justify-center gap-4 p-8 sm:min-h-[20rem]">
								<div className="font-display text-7xl font-black tracking-[-0.08em] tabular-nums sm:text-8xl">
									{smileScore}
								</div>
								<p className="text-base font-bold text-muted-foreground">
									{smileScore >= 81
										? 'Outstanding Duchenne smile! 🌟'
										: smileScore >= 61
											? 'Great radiant smile! 😁'
											: smileScore >= 41
												? 'Nice warm smile! 🙂'
												: smileScore >= 21
													? 'Good try — smile wider! 😊'
													: 'Keep smiling!'}
								</p>
							</div>
						</motion.div>
					)}

					{phase === 'SCORED' && (
						<div className="flex flex-col gap-3 sm:flex-row">
							<Button
								size="lg"
								className="flex-1 gap-2 text-base font-mono font-bold uppercase tracking-wider"
								variant="secondary"
								onClick={handleRevealCoins}>
								<Coins className="size-5" />
								Reveal Scratch Card ({coinsAwarded} coins)
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="gap-2 font-mono font-bold uppercase tracking-wider"
								onClick={handleCaptureAgain}>
								<CircleDot className="size-5" />
								Retake
							</Button>
						</div>
					)}

					{phase === 'DONE' && (
						<div className="flex flex-col gap-3 sm:flex-row">
							<Button
								variant="outline"
								size="lg"
								className="flex-1 gap-2 font-mono font-bold uppercase tracking-wider"
								onClick={() => {}}>
								<Share2 className="size-5" />
								Share to Explore
							</Button>
							<Button
								size="lg"
								className="gap-2 font-mono font-bold uppercase tracking-wider"
								onClick={handleCaptureAgain}>
								<Camera className="size-5" />
								Capture again
							</Button>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-5">
					<AnimatePresence mode="wait">
						{(phase === 'SCORED' || phase === 'SCRATCH_CARD' || phase === 'DONE') && (
							<ScoreReveal key="score" score={smileScore} />
						)}
					</AnimatePresence>

					{phase === 'DONE' && (
						<motion.article
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="brutal-surface bg-secondary p-5">
							<div className="flex items-start justify-between">
								<p className="font-mono text-xs font-bold tracking-[0.14em] uppercase">
									Coins earned
								</p>
								<Coins className="size-6" strokeWidth={2.5} />
							</div>
							<p className="mt-4 font-mono text-5xl font-black tabular-nums">
								+{coinsAwarded}
							</p>
							<p className="mt-1 text-sm font-bold text-black/70">
								{saving ? 'Saving...' : 'Added to your balance!'}
							</p>
						</motion.article>
					)}

					{phase === 'IDLE' && (
						<motion.article
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="brutal-surface bg-card p-5">
							<h3 className="font-title text-sm font-black">How it works</h3>
							<ol className="mt-3 flex flex-col gap-2.5">
								{[
									{ step: '1', text: 'Click Start Camera' },
									{ step: '2', text: 'Smile naturally at the camera' },
									{ step: '3', text: 'AI scores your smile quality 0–100' },
									{ step: '4', text: 'Scratch the card to deposit coins' },
								].map((item) => (
									<li key={item.step} className="flex items-start gap-2.5">
										<span className="flex size-6 shrink-0 items-center justify-center border-[length:var(--border-width)] border-black rounded-md bg-primary font-mono text-xs font-black text-primary-foreground shadow-brutal-xs">
											{item.step}
										</span>
										<span className="text-sm font-semibold text-muted-foreground pt-0.5">
											{item.text}
										</span>
									</li>
								))}
							</ol>
						</motion.article>
					)}

					{phase === 'CAMERA_ACTIVE' && (
						<motion.article
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="brutal-surface bg-card p-5">
							<h3 className="font-title text-sm font-black">Tips for a high score</h3>
							<ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground font-semibold">
								<li>😁 Show your teeth for maximum score</li>
								<li>👀 Genuine Duchenne smiles (squint eyes) score highest</li>
								<li>💡 Ensure your face is evenly lit</li>
								<li>🎯 Look straight into your webcam</li>
							</ul>
						</motion.article>
					)}
				</div>
			</section>

			<ScratchCardModal
				card={scratchCard}
				isOpen={scratchModalOpen}
				onClose={() => {
					setScratchModalOpen(false);
					if (phase === 'SCRATCH_CARD') setPhase('SCORED');
				}}
				onCardScratched={handleCardScratched}
				onScratchAttempt={handleScratchAttempt}
			/>

			{showAuthGate && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black/60 backdrop-blur-xs"
						onClick={() => setShowAuthGate(false)}
					/>
					<div className="relative z-10">
						<AuthGateOverlay onClose={() => setShowAuthGate(false)} />
					</div>
				</div>
			)}
		</main>
	);
}
