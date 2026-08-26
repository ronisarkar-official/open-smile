'use client';

import * as React from 'react';
import { Camera, CircleDot, Sparkles, Hand } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { WebcamView, requestCameraStream, type WebcamViewHandle } from '@/components/capture/webcam-view';
import { AuthGateOverlay } from '@/components/capture/auth-gate-overlay';
import { ScratchCardModal, type ScratchCardItem } from '@/components/rewards/scratch-card-modal';
import { CoinIcon } from '@/components/ui/coin-icon';
import { initSmileDetector, type SmileDetectionResult } from '@/lib/smile-detection';
import { initGestureRecognizer, type PalmDetectionResult } from '@/lib/palm-detection';
import { playCountdownBeep, playShutterSound, playRewardChime } from '@/lib/capture-sfx';
import { CaptureCelebrationOverlay } from '@/components/capture/capture-celebration-overlay';
import { SmileResultScreen } from '@/components/capture/smile-result-screen';

type CapturePhase =
	| 'IDLE'
	| 'CAMERA_ACTIVE'
	| 'COUNTDOWN'
	| 'CELEBRATING'
	| 'SCORED'
	| 'SCRATCH_CARD'
	| 'DONE';

const STORAGE_KEY = 'opensmile_pending_capture';
const SMILE_TRIGGER_THRESHOLD = 60;
const SMILE_TRIGGER_DURATION_MS = 450;
const PALM_TRIGGER_HOLD_MS = 450;

export interface CaptureFlowProps {
	redirectTo?: string;
	isGuestMode?: boolean;
}

export function CaptureFlow({
	redirectTo = '/capture',
	isGuestMode = false,
}: CaptureFlowProps = {}) {
	const { data: session } = useSession();
	const isLoggedIn = !!session?.user;

	const webcamRef = React.useRef<WebcamViewHandle>(null);
	const [phase, setPhase] = React.useState<CapturePhase>('IDLE');
	const [smileScore, setSmileScore] = React.useState(0);
	const [coinsAwarded, setCoinsAwarded] = React.useState(0);
	const [lastResult, setLastResult] = React.useState<SmileDetectionResult | null>(null);
	const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
	const [cameraReady, setCameraReady] = React.useState(false);
	const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null);
	const [isConnecting, setIsConnecting] = React.useState(false);
	const [showAuthGate, setShowAuthGate] = React.useState(false);
	const [scratchModalOpen, setScratchModalOpen] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [isRewardClaimed, setIsRewardClaimed] = React.useState(false);

	const [palmShutterEnabled, setPalmShutterEnabled] = React.useState(true);
	const [palmHoldProgress, setPalmHoldProgress] = React.useState(0);
	const [isPalmDetected, setIsPalmDetected] = React.useState(false);

	const [countdownText, setCountdownText] = React.useState<string>('');
	const [countdownNumber, setCountdownNumber] = React.useState<number | null>(null);
	const smileStartTimeRef = React.useRef<number | null>(null);
	const palmStartTimeRef = React.useRef<number | null>(null);
	const isTriggeringRef = React.useRef<boolean>(false);

	React.useEffect(() => {
		initSmileDetector().catch(() => {});
		initGestureRecognizer().catch(() => {});
	}, []);

	React.useEffect(() => {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (stored && isLoggedIn) {
			try {
				const data = JSON.parse(stored);
				if (data.score && data.coins) {
					setSmileScore(data.score);
					setCoinsAwarded(data.coins);
					setCapturedImage(data.image || null);
					setPhase('SCRATCH_CARD');
					setScratchModalOpen(true);
					sessionStorage.removeItem(STORAGE_KEY);
				}
			} catch {
				sessionStorage.removeItem(STORAGE_KEY);
			}
		}
	}, [isLoggedIn]);

	const triggerCaptureSequence = React.useCallback(
		(instantScore?: number, triggerSource: 'SMILE' | 'PALM' | 'MANUAL' = 'SMILE') => {
			if (isTriggeringRef.current) return;
			isTriggeringRef.current = true;
			setPhase('COUNTDOWN');

			if (triggerSource === 'PALM') {
				setCountdownText('PALM DETECTED! ✋');
			} else if (triggerSource === 'MANUAL') {
				setCountdownText('GET READY! 📸');
			} else {
				setCountdownText('SMILE DETECTED! 😄');
			}

			setCountdownNumber(null);
			setPalmHoldProgress(0);
			setIsPalmDetected(false);

			setTimeout(() => {
				setCountdownText('HOLD IT…');
				setCountdownNumber(3);
				playCountdownBeep(520);

				setTimeout(() => {
					setCountdownNumber(2);
					playCountdownBeep(580);

					setTimeout(() => {
						setCountdownNumber(1);
						playCountdownBeep(660);

						setTimeout(() => {
							setCountdownNumber(null);
							playCountdownBeep(880, true);
							playShutterSound();

							const snapshot = webcamRef.current?.getScreenshot() || null;
							setCapturedImage(snapshot);

							const finalScore =
								instantScore ??
								lastResult?.score ??
								(Math.floor(Math.random() * 25) + 75);
							const finalCoins = Math.max(1, Math.floor(finalScore / 10));

							setSmileScore(finalScore);
							setCoinsAwarded(finalCoins);
							setPhase('CELEBRATING');
							playRewardChime();

							if (cameraStream) {
								cameraStream.getTracks().forEach((track) => track.stop());
								setCameraStream(null);
							}
						}, 750);
					}, 750);
				}, 750);
			}, 600);
		},
		[lastResult, cameraStream]
	);

	const handleSmileUpdate = React.useCallback(
		(result: SmileDetectionResult | null) => {
			setLastResult(result);

			if (phase !== 'CAMERA_ACTIVE' || isTriggeringRef.current) {
				smileStartTimeRef.current = null;
				return;
			}

			if (result && result.hasFace && result.score >= SMILE_TRIGGER_THRESHOLD) {
				const now = Date.now();
				if (!smileStartTimeRef.current) {
					smileStartTimeRef.current = now;
				} else if (now - smileStartTimeRef.current >= SMILE_TRIGGER_DURATION_MS) {
					smileStartTimeRef.current = null;
					triggerCaptureSequence(result.score, 'SMILE');
				}
			} else {
				smileStartTimeRef.current = null;
			}
		},
		[phase, triggerCaptureSequence]
	);

	const handlePalmUpdate = React.useCallback(
		(result: PalmDetectionResult | null) => {
			if (phase !== 'CAMERA_ACTIVE' || isTriggeringRef.current || !palmShutterEnabled) {
				palmStartTimeRef.current = null;
				setPalmHoldProgress(0);
				setIsPalmDetected(false);
				return;
			}

			if (result && result.isPalmDetected) {
				setIsPalmDetected(true);
				const now = Date.now();
				if (!palmStartTimeRef.current) {
					palmStartTimeRef.current = now;
					setPalmHoldProgress(0.1);
				} else {
					const elapsed = now - palmStartTimeRef.current;
					const progress = Math.min(1, elapsed / PALM_TRIGGER_HOLD_MS);
					setPalmHoldProgress(progress);

					if (elapsed >= PALM_TRIGGER_HOLD_MS) {
						palmStartTimeRef.current = null;
						setPalmHoldProgress(0);
						triggerCaptureSequence(undefined, 'PALM');
					}
				}
			} else {
				palmStartTimeRef.current = null;
				setPalmHoldProgress(0);
				setIsPalmDetected(false);
			}
		},
		[phase, palmShutterEnabled, triggerCaptureSequence]
	);

	const handleCameraReady = React.useCallback(() => {
		setCameraReady(true);
		setIsConnecting(false);
	}, []);

	const handleStartCamera = async () => {
		setIsConnecting(true);
		isTriggeringRef.current = false;
		try {
			const stream = await requestCameraStream();
			setCameraStream(stream);
			setPhase('CAMERA_ACTIVE');
		} catch {
			setPhase('CAMERA_ACTIVE');
		} finally {
			setIsConnecting(false);
		}
	};

	const handleManualCapture = () => {
		const score = lastResult?.score ?? (Math.floor(Math.random() * 25) + 75);
		triggerCaptureSequence(score, 'MANUAL');
	};

	const handleCelebrationComplete = React.useCallback(() => {
		setPhase('SCORED');
		isTriggeringRef.current = false;
	}, []);

	const handleRevealReward = () => {
		setPhase('SCRATCH_CARD');
		setScratchModalOpen(true);
	};

	const handleScratchAttempt = React.useCallback((): boolean => {
		if (!isLoggedIn) {
			sessionStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ score: smileScore, coins: coinsAwarded, image: capturedImage })
			);
			setShowAuthGate(true);
			return false;
		}
		return true;
	}, [isLoggedIn, smileScore, coinsAwarded, capturedImage]);

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
			setIsRewardClaimed(true);
			setPhase('SCORED');
			setScratchModalOpen(false);
		}
	};

	const handleCaptureAgain = () => {
		if (cameraStream) {
			cameraStream.getTracks().forEach((track) => track.stop());
			setCameraStream(null);
		}
		isTriggeringRef.current = false;
		smileStartTimeRef.current = null;
		palmStartTimeRef.current = null;
		setPalmHoldProgress(0);
		setIsPalmDetected(false);
		setSmileScore(0);
		setCoinsAwarded(0);
		setLastResult(null);
		setCapturedImage(null);
		setCameraReady(false);
		setShowAuthGate(false);
		setIsRewardClaimed(false);
		setPhase('IDLE');
	};

	const handleShareToExplore = () => {
		// Explore share action
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
		<main id="main-content" className="mx-auto w-full max-w-[1280px] px-2 pb-12 pt-6 sm:px-4 sm:pt-10">
			<CaptureCelebrationOverlay
				isActive={phase === 'CELEBRATING'}
				onAnimationComplete={handleCelebrationComplete}
			/>

			{isLoggedIn && (
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
						{(phase === 'CAMERA_ACTIVE' || phase === 'COUNTDOWN') && cameraReady && (
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

			<section className="mt-8">
				{phase === 'IDLE' && (
					<div className="mx-auto w-full max-w-xl">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="shadow-brutal-lg border-[length:var(--border-width)] border-border rounded-xl overflow-hidden bg-card">
							<div className="flex items-center justify-between border-b-[length:var(--border-width)] border-border bg-muted px-4 py-3">
								<div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
									<Camera className="size-4" strokeWidth={2.5} />
									Live Smile Capture
								</div>
							</div>
							<div className="flex min-h-80 flex-col items-center justify-center gap-6 p-8 sm:min-h-[28rem]">
								<div className="flex size-24 items-center justify-center border-[length:var(--border-width)] border-border rounded-xl bg-accent text-accent-foreground shadow-brutal">
									<Camera className="size-12" strokeWidth={1.5} />
								</div>
								<div className="text-center">
									<h2 className="font-title text-2xl font-black">
										Ready to smile?
									</h2>
									<p className="mt-2 max-w-[34ch] text-sm text-muted-foreground font-semibold">
										Start your camera, show your brightest smile or raise your palm, and let AI calculate your reward coins!
									</p>
									{!isLoggedIn && (
										<p className="mt-3 text-xs text-muted-foreground border border-border/40 rounded-md px-3 py-1.5 inline-block">
											🔒 Anyone can capture — sign in when scratching to deposit coins
										</p>
									)}
								</div>
								<Button
									size="lg"
									className="gap-2 text-base px-8 py-6 font-mono font-bold uppercase tracking-wider bg-warning text-warning-foreground hover:bg-warning/90 border-[length:var(--border-width)] border-border shadow-brutal brutal-lift"
									disabled={isConnecting}
									onClick={handleStartCamera}>
									<Camera className="size-5" />
									{isConnecting ? 'Connecting camera...' : 'Start Camera'}
								</Button>
							</div>
						</motion.div>
					</div>
				)}

				{(phase === 'CAMERA_ACTIVE' || phase === 'COUNTDOWN') && (
					<div className="mx-auto w-full max-w-3xl flex flex-col gap-5">
						<div className="relative">
							<WebcamView
								ref={webcamRef}
								isActive={true}
								isFrozen={phase === 'COUNTDOWN'}
								stream={cameraStream}
								enablePalmShutter={palmShutterEnabled}
								palmHoldProgress={palmHoldProgress}
								onStreamChange={setCameraStream}
								onSmileUpdate={handleSmileUpdate}
								onPalmUpdate={handlePalmUpdate}
								onTogglePalmShutter={() => setPalmShutterEnabled((prev) => !prev)}
								onReady={handleCameraReady}
							/>

							<AnimatePresence>
								{phase === 'COUNTDOWN' && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[2px] rounded-xl overflow-hidden p-4">
										<div className="flex flex-col items-center text-center">
											<motion.div
												key={countdownText}
												initial={{ scale: 0.7, y: -20, opacity: 0 }}
												animate={{ scale: 1, y: 0, opacity: 1 }}
												transition={{ type: 'spring', damping: 14, stiffness: 280 }}
												className="border-[length:var(--border-width)] border-border bg-accent px-6 py-2 font-mono text-lg font-black tracking-wider text-accent-foreground uppercase shadow-brutal-lg rounded-lg sm:text-2xl">
												{countdownText}
											</motion.div>

											{countdownNumber !== null && (
												<motion.div
													key={countdownNumber}
													initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
													animate={{ scale: 1, opacity: 1, rotate: 0 }}
													exit={{ scale: 1.4, opacity: 0 }}
													transition={{ type: 'spring', damping: 12, stiffness: 250 }}
													className="mt-6 flex size-32 items-center justify-center border-[length:var(--border-width-lg)] border-border bg-warning font-display text-8xl font-black text-warning-foreground shadow-brutal-xl rounded-2xl sm:size-40 sm:text-9xl">
													{countdownNumber}
												</motion.div>
											)}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{phase === 'CAMERA_ACTIVE' && (
							<div className="flex flex-wrap items-center justify-between gap-3 border-[length:var(--border-width)] border-border rounded-lg bg-accent/30 px-4 py-3">
								<div className="flex items-center gap-2">
									<Sparkles className="size-4 shrink-0 text-accent-foreground" strokeWidth={2.5} />
									<p className="font-mono text-xs font-bold tracking-wider uppercase">
										{isPalmDetected
											? '✋ Palm detected! Hold steady to snap...'
											: lastResult?.hasFace
											? `Face detected (${lastResult.score}%) — smile big or show palm ✋!`
											: 'Look at the camera & position your face in the frame'}
									</p>
								</div>

								<button
									type="button"
									onClick={() => setPalmShutterEnabled((prev) => !prev)}
									className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase underline hover:opacity-80">
									<Hand className="size-3.5" />
									{palmShutterEnabled ? 'Palm Shutter active' : 'Enable Palm Shutter'}
								</button>
							</div>
						)}

						{phase === 'CAMERA_ACTIVE' && (
							<div className="flex flex-col gap-3 sm:flex-row">
								<Button
									size="lg"
									className="flex-1 gap-2 text-base font-mono font-bold uppercase tracking-wider bg-warning text-warning-foreground hover:bg-warning/90 border-[length:var(--border-width)] border-border shadow-brutal brutal-lift"
									disabled={!cameraReady}
									onClick={handleManualCapture}>
									<Sparkles className="size-5" />
									Capture Smile
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="gap-2 font-mono font-bold uppercase tracking-wider border-[length:var(--border-width)] border-border shadow-brutal-sm brutal-lift"
									onClick={handleCaptureAgain}>
									<CircleDot className="size-5" />
									Cancel
								</Button>
							</div>
						)}
					</div>
				)}

				{(phase === 'SCORED' || phase === 'SCRATCH_CARD' || phase === 'DONE') && (
					<div className="mx-auto max-w-4xl">
						<SmileResultScreen
							imageSrc={capturedImage}
							score={smileScore}
							coinsAwarded={coinsAwarded}
							isRewardClaimed={isRewardClaimed}
							isSaving={saving}
							onRevealReward={handleRevealReward}
							onRetake={handleCaptureAgain}
							onShareToExplore={handleShareToExplore}
						/>
					</div>
				)}
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
				<AuthGateOverlay
					coinsAwarded={coinsAwarded}
					score={smileScore}
					redirectTo={redirectTo}
					onClose={() => setShowAuthGate(false)}
				/>
			)}
		</main>
	);
}
