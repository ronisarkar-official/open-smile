'use client';

import * as React from 'react';
import { Camera, CircleDot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
	WebcamView,
	requestCameraStream,
	type WebcamViewHandle,
} from '@/components/capture/webcam-view';
import { AuthGateOverlay } from '@/components/capture/auth-gate-overlay';
import {
	ScratchCardModal,
	type ScratchCardItem,
} from '@/components/rewards/scratch-card-modal';
import {
	initSmileDetector,
	type SmileDetectionResult,
} from '@/lib/smile-detection';
import {
	playCountdownBeep,
	playShutterSound,
	playRewardChime,
} from '@/lib/capture-sfx';
import { CaptureCelebrationOverlay } from '@/components/capture/capture-celebration-overlay';
import { SmileResultScreen } from '@/components/capture/smile-result-screen';
import { calculateSmileCoins } from '@/lib/reward-calculator';

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
const SMILE_HOLD_THRESHOLD = 50;
const SMILE_LOST_TOLERANCE_MS = 350;

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
	const [lastResult, setLastResult] =
		React.useState<SmileDetectionResult | null>(null);
	const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
	const [cameraReady, setCameraReady] = React.useState(false);
	const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(
		null,
	);
	const [isConnecting, setIsConnecting] = React.useState(false);
	const [showAuthGate, setShowAuthGate] = React.useState(false);
	const [scratchModalOpen, setScratchModalOpen] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [isRewardClaimed, setIsRewardClaimed] = React.useState(false);

	const [countdownText, setCountdownText] = React.useState<string>('');
	const [countdownNumber, setCountdownNumber] = React.useState<number | null>(
		null,
	);
	const smileStartTimeRef = React.useRef<number | null>(null);
	const smileLostTimeRef = React.useRef<number | null>(null);
	const lastResultRef = React.useRef<SmileDetectionResult | null>(null);
	const cameraStreamRef = React.useRef<MediaStream | null>(null);
	cameraStreamRef.current = cameraStream;
	const isTriggeringRef = React.useRef<boolean>(false);
	const captureSourceRef = React.useRef<'SMILE' | 'MANUAL'>('SMILE');
	const countdownTimeoutsRef = React.useRef<NodeJS.Timeout[]>([]);

	React.useEffect(() => {
		initSmileDetector().catch(() => {});
		return () => {
			countdownTimeoutsRef.current.forEach((t) => clearTimeout(t));
			countdownTimeoutsRef.current = [];
		};
	}, []);

	React.useEffect(() => {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (stored && isLoggedIn) {
			try {
				const data = JSON.parse(stored);
				if (data.score && data.coins !== undefined) {
					setSmileScore(data.score);
					const coinsVal =
						typeof data.coins === 'object' && data.coins !== null ?
							Number(data.coins.totalCoins || 0)
						:	Number(data.coins);
					setCoinsAwarded(coinsVal);
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

	const cancelCountdown = React.useCallback((reason?: string) => {
		countdownTimeoutsRef.current.forEach((t) => clearTimeout(t));
		countdownTimeoutsRef.current = [];
		isTriggeringRef.current = false;
		smileStartTimeRef.current = null;
		smileLostTimeRef.current = null;
		setCountdownNumber(null);
		setCountdownText(reason || '');
		setPhase('CAMERA_ACTIVE');
	}, []);

	const triggerCaptureSequence = React.useCallback(
		(instantScore?: number, triggerSource: 'SMILE' | 'MANUAL' = 'SMILE') => {
			if (isTriggeringRef.current) return;
			isTriggeringRef.current = true;
			captureSourceRef.current = triggerSource;
			smileLostTimeRef.current = null;

			countdownTimeoutsRef.current.forEach((t) => clearTimeout(t));
			countdownTimeoutsRef.current = [];

			setPhase('COUNTDOWN');

			if (triggerSource === 'MANUAL') {
				setCountdownText('GET READY! 📸');
			} else {
				setCountdownText('SMILE DETECTED! 😄');
			}

			setCountdownNumber(null);

			const schedule = (fn: () => void, ms: number) => {
				const timeout = setTimeout(fn, ms);
				countdownTimeoutsRef.current.push(timeout);
			};

			schedule(() => {
				setCountdownText('HOLD YOUR SMILE! 😄');
				setCountdownNumber(3);
				playCountdownBeep(520);
			}, 600);

			schedule(() => {
				setCountdownNumber(2);
				playCountdownBeep(580);
			}, 1350);

			schedule(() => {
				setCountdownNumber(1);
				playCountdownBeep(660);
			}, 2100);

			schedule(() => {
				// Verify face and smile before finalizing snapshot
				const currentResult = lastResultRef.current;
				const isSmileValid =
					triggerSource === 'MANUAL' ||
					(currentResult &&
						currentResult.hasFace &&
						currentResult.score >= SMILE_HOLD_THRESHOLD);

				if (!isSmileValid) {
					cancelCountdown('Smile lost! Hold your smile to capture 😊');
					return;
				}

				setCountdownNumber(null);
				playCountdownBeep(880, true);
				playShutterSound();

				const snapshot = webcamRef.current?.getScreenshot() || null;
				setCapturedImage(snapshot);

				const finalScore =
					currentResult?.score ??
					instantScore ??
					Math.floor(Math.random() * 25) + 75;
				const reward = calculateSmileCoins(finalScore);

				setSmileScore(finalScore);
				setCoinsAwarded(reward.totalCoins);
				setPhase('CELEBRATING');
				playRewardChime();

				if (cameraStreamRef.current) {
					cameraStreamRef.current
						.getTracks()
						.forEach((track) => track.stop());
					setCameraStream(null);
				}
			}, 2850);
		},
		[cancelCountdown],
	);

	const handleSmileUpdate = React.useCallback(
		(result: SmileDetectionResult | null) => {
			lastResultRef.current = result;
			setLastResult(result);

			// Active smile verification during countdown
			if (phase === 'COUNTDOWN') {
				if (captureSourceRef.current === 'SMILE') {
					const isSmiling =
						result &&
						result.hasFace &&
						result.score >= SMILE_HOLD_THRESHOLD;
					if (!isSmiling) {
						const now = Date.now();
						if (!smileLostTimeRef.current) {
							smileLostTimeRef.current = now;
						} else if (
							now - smileLostTimeRef.current >
							SMILE_LOST_TOLERANCE_MS
						) {
							cancelCountdown('Smile lost! Hold your smile to capture 😊');
						}
					} else {
						smileLostTimeRef.current = null;
					}
				}
				return;
			}

			if (phase !== 'CAMERA_ACTIVE' || isTriggeringRef.current) {
				smileStartTimeRef.current = null;
				return;
			}

			if (result && result.hasFace && result.score >= SMILE_TRIGGER_THRESHOLD) {
				const now = Date.now();
				if (!smileStartTimeRef.current) {
					smileStartTimeRef.current = now;
				} else if (
					now - smileStartTimeRef.current >=
					SMILE_TRIGGER_DURATION_MS
				) {
					smileStartTimeRef.current = null;
					triggerCaptureSequence(result.score, 'SMILE');
				}
			} else {
				smileStartTimeRef.current = null;
			}
		},
		[phase, cancelCountdown, triggerCaptureSequence],
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
		const score =
			lastResultRef.current?.score ?? Math.floor(Math.random() * 25) + 75;
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
				JSON.stringify({
					score: smileScore,
					coins: coinsAwarded,
					image: capturedImage,
				}),
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
				const coins =
					(
						typeof data.coins_awarded === 'object' &&
						data.coins_awarded !== null
					) ?
						Number(data.coins_awarded.totalCoins || 0)
					:	Number(data.coins_awarded);
				setCoinsAwarded(coins);
			}
		} catch {
		} finally {
			setSaving(false);
			setIsRewardClaimed(true);
		}
	};

	const handleCaptureAgain = () => {
		cancelCountdown();
		if (cameraStream) {
			cameraStream.getTracks().forEach((track) => track.stop());
			setCameraStream(null);
		}
		isTriggeringRef.current = false;
		smileStartTimeRef.current = null;
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
		isScratched: isRewardClaimed,
		themeColor: '#ced42cff',
		badge: 'NEW',
	};

	return (
		<main
			id="main-content"
			className="mx-auto w-full max-w-[1280px] px-2 pb-12 pt-6 sm:px-4 sm:pt-10">
			<CaptureCelebrationOverlay
				isActive={phase === 'CELEBRATING'}
				onAnimationComplete={handleCelebrationComplete}
			/>

			{isLoggedIn && (
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
						{(phase === 'CAMERA_ACTIVE' || phase === 'COUNTDOWN') &&
							cameraReady && (
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
									<Camera
										className="size-4"
										strokeWidth={2.5}
									/>
									Live Smile Capture
								</div>
							</div>

							<div className="flex min-h-80 flex-col items-center justify-center gap-6 p-8 sm:min-h-[28rem]">
								{/* Icon with a soft looping pulse behind it, so the screen feels
			    like it's waiting for you rather than sitting static. */}
								<div className="relative flex size-24 items-center justify-center">
									<motion.div
										animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
										transition={{
											duration: 2.2,
											repeat: Infinity,
											ease: 'easeInOut',
										}}
										className="absolute inset-0 rounded-xl bg-accent"
									/>
									<div className="relative flex size-24 items-center justify-center border-[length:var(--border-width)] border-border rounded-xl bg-accent text-accent-foreground shadow-brutal">
										<Camera
											className="size-12"
											strokeWidth={1.5}
										/>
									</div>
								</div>

								<div className="text-center">
									<h2 className="font-title text-2xl font-black">
										Your smile is worth coins
									</h2>
									<p className="mt-2 max-w-[30ch] text-sm text-muted-foreground font-semibold">
										Show your brightest smile — the AI takes it from there.
									</p>
									{!isLoggedIn && (
										<p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-success/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-success">
											<Sparkles
												className="size-3.5"
												strokeWidth={2.5}
											/>
											Free to try — no signup needed
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
								isFrozen={phase !== 'CAMERA_ACTIVE' && phase !== 'COUNTDOWN'}
								stream={cameraStream}
								onStreamChange={setCameraStream}
								onSmileUpdate={handleSmileUpdate}
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
												transition={{
													type: 'spring',
													damping: 14,
													stiffness: 280,
												}}
												className="border-[length:var(--border-width)] border-border bg-accent px-6 py-2 font-mono text-lg font-black tracking-wider text-accent-foreground uppercase shadow-brutal-lg rounded-lg sm:text-2xl">
												{countdownText}
											</motion.div>

											{countdownNumber !== null && (
												<motion.div
													key={countdownNumber}
													initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
													animate={{ scale: 1, opacity: 1, rotate: 0 }}
													exit={{ scale: 1.4, opacity: 0 }}
													transition={{
														type: 'spring',
														damping: 12,
														stiffness: 250,
													}}
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
							<div className="flex items-center gap-2 border-[length:var(--border-width)] border-border rounded-lg bg-accent/30 px-4 py-3">
								<Sparkles
									className="size-4 shrink-0 text-accent-foreground"
									strokeWidth={2.5}
								/>
								<p className="font-mono text-xs font-bold tracking-wider uppercase">
									{lastResult?.hasFace ?
										`Face detected (${lastResult.score}%) — hold your best smile to snap!`
									:	'Look at the camera & position your face in the frame'}
								</p>
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

				{(phase === 'SCORED' ||
					phase === 'SCRATCH_CARD' ||
					phase === 'DONE') && (
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
				userName={session?.user?.name}
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
