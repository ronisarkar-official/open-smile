'use client';

import * as React from 'react';
import Link from 'next/link';
import { Camera, CircleDot, Sparkles, Lock, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from '@/lib/auth-client';
import { useSystemSettings } from '@/hooks/use-system-settings';
import { useToast } from '@/hooks/use-toast';
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
import { emitCoinBalanceUpdate } from '@/components/ui/user-coin-balance';
import { convertToWebP, dataUrlToWebP } from '@/lib/convert-to-webp';
import { AnimatedNumberCountdown } from '@/components/capture/animated-number-countdown';
import { LivenessDetector, type LivenessState } from '@/lib/anti-spoofing';
import { generatePHash } from '@/lib/phash';

const getNextIndianMidnight = () => {
	const now = new Date();
	const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
	const istNow = new Date(now.getTime() + istOffsetMs);
	const istTomorrowMidnightUtc = Date.UTC(
		istNow.getUTCFullYear(),
		istNow.getUTCMonth(),
		istNow.getUTCDate() + 1,
		0,
		0,
		0,
		0,
	);
	return new Date(istTomorrowMidnightUtc - istOffsetMs);
};

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
	const { settings } = useSystemSettings();
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
	const [isSharingToExplore, setIsSharingToExplore] = React.useState(false);
	const [isSharedToExplore, setIsSharedToExplore] = React.useState(false);
	const { toast } = useToast();
	const [shareMessage, setShareMessage] = React.useState<string | null>(null);
	const [earnedCardId, setEarnedCardId] = React.useState<string | null>(null);

	const earnedCardIdRef = React.useRef<string | null>(null);
	const isRewardClaimedRef = React.useRef<boolean>(false);

	React.useEffect(() => {
		earnedCardIdRef.current = earnedCardId;
	}, [earnedCardId]);

	React.useEffect(() => {
		isRewardClaimedRef.current = isRewardClaimed;
	}, [isRewardClaimed]);

	const triggerUnscratchedNotification = React.useCallback(
		(cardId?: string | null) => {
			const targetCardId = cardId || earnedCardIdRef.current;
			if (!targetCardId || isRewardClaimedRef.current) return;

			try {
				fetch('/api/capture/unscratched-notify', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ cardId: targetCardId }),
					keepalive: true,
				})
					.then(() => {
						window.dispatchEvent(new CustomEvent('notifications-updated'));
					})
					.catch(() => {});
			} catch {}
		},
		[],
	);

	React.useEffect(() => {
		const handleBeforeUnload = () => {
			if (earnedCardIdRef.current && !isRewardClaimedRef.current) {
				triggerUnscratchedNotification(earnedCardIdRef.current);
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			if (earnedCardIdRef.current && !isRewardClaimedRef.current) {
				triggerUnscratchedNotification(earnedCardIdRef.current);
			}
		};
	}, [triggerUnscratchedNotification]);

	const [captureStatus, setCaptureStatus] = React.useState<{
		daily_captures_used: number;
		max_daily_captures: number;
		captures_remaining: number;
		limit_reached: boolean;
		resets_at: string;
		maintenance_mode: boolean;
	} | null>(null);

	const fetchCaptureStatus = React.useCallback(async () => {
		if (!session?.user) return;
		try {
			const res = await fetch('/api/capture/status', { cache: 'no-store' });
			if (res.ok) {
				const data = await res.json();
				setCaptureStatus(data);
			}
		} catch {}
	}, [session?.user]);

	const [hasCapturedImage, setHasCapturedImage] = React.useState(false);

	const isQuotaFinished = Boolean(
		captureStatus &&
		(captureStatus.limit_reached ||
			captureStatus.captures_remaining === 0 ||
			captureStatus.daily_captures_used >= captureStatus.max_daily_captures),
	);

	React.useEffect(() => {
		fetchCaptureStatus();
	}, [fetchCaptureStatus]);

	const livenessDetectorRef = React.useRef<LivenessDetector>(new LivenessDetector());
	const [livenessState, setLivenessState] = React.useState<LivenessState>({
		isLiveVerified: false,
		hasBlinked: false,
		hasDynamicMovement: false,
		blinkConfidence: 0,
		instruction: 'Blink naturally to verify live presence',
		statusMessage: 'Verifying live human...',
	});

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
	const captureSourceRef = React.useRef<'SMILE' | 'MANUAL' | 'PALM'>('SMILE');
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

	const lastCountdownCancelTimeRef = React.useRef<number>(0);

	const cancelCountdown = React.useCallback((reason?: string) => {
		countdownTimeoutsRef.current.forEach((t) => clearTimeout(t));
		countdownTimeoutsRef.current = [];
		isTriggeringRef.current = false;
		smileStartTimeRef.current = null;
		smileLostTimeRef.current = null;
		lastCountdownCancelTimeRef.current = Date.now();
		setCountdownNumber(null);
		setCountdownText(reason || '');
		setPhase('CAMERA_ACTIVE');
	}, []);

	const saveEarnedCard = React.useCallback(
		async (score: number, image: string | null) => {
			if (!session?.user) return;
			try {
				const phash = image ? await generatePHash(image) : undefined;
				let res = await fetch('/api/v1/capture/submit', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						smile_score: score,
						phash,
						liveness_verified: true,
					}),
				});

				if (!res.ok) {
					res = await fetch('/api/capture/submit', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							smile_score: score,
							phash,
							liveness_verified: true,
						}),
					});
				}

				const data = await res.json();
				if (!res.ok) {
					if (data.daily_limit_reached || res.status === 429) {
						toast({
							title: "Daily Limit Reached",
							description: data.error || data.detail || "Daily capture limit reached. Refreshes at midnight (12:00 AM IST).",
							variant: "warning",
						});
						fetchCaptureStatus();
					} else {
						toast({
							title: "Capture Verification Failed",
							description: data.error || data.detail || "Please try taking a fresh live photo.",
							variant: "error",
						});
					}
					return;
				}

				if (data.card_id) {
					earnedCardIdRef.current = String(data.card_id);
					isRewardClaimedRef.current = false;
					setEarnedCardId(String(data.card_id));
				}
				if (typeof data.coins_awarded === 'number') {
					setCoinsAwarded(data.coins_awarded);
				}
				if (typeof data.daily_captures_used === 'number') {
					setCaptureStatus((prev) => ({
						daily_captures_used: data.daily_captures_used,
						max_daily_captures: data.max_daily_captures ?? prev?.max_daily_captures ?? 10,
						captures_remaining: data.captures_remaining ?? Math.max(0, (data.max_daily_captures ?? 10) - data.daily_captures_used),
						limit_reached: Boolean(data.limit_reached),
						resets_at: data.resets_at ?? prev?.resets_at ?? getNextIndianMidnight().toISOString(),
						maintenance_mode: false,
					}));
				} else {
					setCaptureStatus((prev) =>
						prev
							? {
									...prev,
									daily_captures_used: prev.daily_captures_used + 1,
									captures_remaining: Math.max(0, prev.captures_remaining - 1),
									limit_reached: prev.daily_captures_used + 1 >= prev.max_daily_captures,
							  }
							: prev,
					);
				}
				fetchCaptureStatus();
			} catch {}
		},
		[session?.user, fetchCaptureStatus, toast],
	);

	const triggerCaptureSequence = React.useCallback(
		(instantScore?: number, triggerSource: 'SMILE' | 'MANUAL' | 'PALM' = 'SMILE') => {
			if (isTriggeringRef.current) return;
			isTriggeringRef.current = true;
			captureSourceRef.current = triggerSource;
			smileLostTimeRef.current = null;

			countdownTimeoutsRef.current.forEach((t) => clearTimeout(t));
			countdownTimeoutsRef.current = [];

			setPhase('COUNTDOWN');

			if (triggerSource === 'PALM') {
				setCountdownText('PALM SHUTTER! ✋📸');
			} else if (triggerSource === 'MANUAL') {
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
				const isLivenessEnforced = settings.liveness_detection_enabled !== false;
				const isVerified =
					typeof livenessDetectorRef.current?.isVerified === 'function'
						? livenessDetectorRef.current.isVerified()
						: Boolean(livenessState.isLiveVerified);
				if (isLivenessEnforced && !isVerified) {
					cancelCountdown('Active liveness verification lost! Real active face required.');
					return;
				}

				const currentResult = lastResultRef.current;
				const isSmileValid =
					triggerSource === 'MANUAL' ||
					triggerSource === 'PALM' ||
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
				setHasCapturedImage(true);

				const finalScore =
					currentResult?.score ??
					instantScore ??
					Math.floor(Math.random() * 25) + 75;
				const minScore = Number(settings.min_smile_score_threshold) || 11;
				const reward = calculateSmileCoins(finalScore, 1.0, undefined, minScore);

				setSmileScore(finalScore);
				setCoinsAwarded(reward.totalCoins);
				setPhase('CELEBRATING');
				playRewardChime();
				setCaptureStatus((prev) =>
					prev
						? {
								...prev,
								daily_captures_used: prev.daily_captures_used + 1,
								captures_remaining: Math.max(0, prev.captures_remaining - 1),
								limit_reached: prev.daily_captures_used + 1 >= prev.max_daily_captures,
						  }
						: prev,
				);
				saveEarnedCard(finalScore, snapshot);

				if (cameraStreamRef.current) {
					cameraStreamRef.current
						.getTracks()
						.forEach((track) => track.stop());
					setCameraStream(null);
				}
			}, 2850);
		},
		[cancelCountdown, settings.liveness_detection_enabled],
	);

	const lastResultUiUpdateRef = React.useRef<number>(0);
	const lastResultHadFaceRef = React.useRef<boolean>(false);

	const handleSmileUpdate = React.useCallback(
		(result: SmileDetectionResult | null) => {
			lastResultRef.current = result;

			const now = Date.now();
			const hasFaceNow = Boolean(result?.hasFace);
			const faceChanged = hasFaceNow !== lastResultHadFaceRef.current;
			const isUiDue = now - lastResultUiUpdateRef.current >= 150;

			if (faceChanged || isUiDue) {
				lastResultHadFaceRef.current = hasFaceNow;
				lastResultUiUpdateRef.current = now;
				setLastResult(result);
			}

			const liveness = livenessDetectorRef.current.processFrame(result);
			setLivenessState(liveness);

			if (phase === 'COUNTDOWN') {
				if (liveness.isStaticDetected) {
					cancelCountdown('Static photo detected! Please use a real face.');
					return;
				}

				if (captureSourceRef.current === 'SMILE') {
					const isSmiling =
						result &&
						result.hasFace &&
						result.score >= SMILE_HOLD_THRESHOLD;
					if (!isSmiling) {
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

			if (now - lastCountdownCancelTimeRef.current < 2000) {
				smileStartTimeRef.current = null;
				return;
			}

			const isLivenessEnforced = settings.liveness_detection_enabled !== false;
			if (isLivenessEnforced && !liveness.isLiveVerified) {
				smileStartTimeRef.current = null;
				return;
			}

			if (result && result.hasFace && result.score >= SMILE_TRIGGER_THRESHOLD) {
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
		[phase, cancelCountdown, triggerCaptureSequence, settings.liveness_detection_enabled],
	);

	const handleCameraReady = React.useCallback(() => {
		setCameraReady(true);
		setIsConnecting(false);
	}, []);

	const handleStartCamera = async () => {
		livenessDetectorRef.current = new LivenessDetector();
		setLivenessState({
			isLiveVerified: false,
			hasBlinked: false,
			hasDynamicMovement: false,
			blinkConfidence: 0,
			instruction: 'Blink naturally to verify live presence',
			statusMessage: 'Verifying live human...',
		});
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
		const isLivenessEnforced = settings.liveness_detection_enabled !== false;
		const isVerified =
			typeof livenessDetectorRef.current?.isVerified === 'function'
				? livenessDetectorRef.current.isVerified()
				: Boolean(livenessState.isLiveVerified);
		if (isLivenessEnforced && !isVerified) {
			toast({
				title: "Live Face Required",
				description: livenessState.instruction || "Active liveness required. Please blink naturally before capturing.",
				variant: "warning",
			});
			return;
		}
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

	const handleCardScratched = async (cardId: string, coinsWon: number) => {
		if (!isLoggedIn) return;

		isRewardClaimedRef.current = true;
		setIsRewardClaimed(true);
		setSaving(true);
		const targetId = earnedCardId || cardId;
		try {
			if (targetId && targetId !== 'capture-reward') {
				let res = await fetch(`/api/v1/rewards/scratch-cards/${targetId}/scratch`, {
					method: 'POST',
				});
				if (!res.ok) {
					res = await fetch(`/api/rewards/scratch-cards/${targetId}/scratch`, {
						method: 'POST',
					});
				}
				if (res.ok) {
					const data = await res.json();
					if (typeof data.balance === 'number') {
						emitCoinBalanceUpdate(data.balance);
					} else {
						emitCoinBalanceUpdate();
					}
					setIsRewardClaimed(true);
					return;
				}
			}
			emitCoinBalanceUpdate();
		} catch {
			emitCoinBalanceUpdate();
		} finally {
			setSaving(false);
			setIsRewardClaimed(true);
		}
	};

	const handleCaptureAgain = () => {
		if (earnedCardIdRef.current && !isRewardClaimedRef.current) {
			triggerUnscratchedNotification(earnedCardIdRef.current);
		}
		earnedCardIdRef.current = null;
		isRewardClaimedRef.current = false;
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
		setEarnedCardId(null);
		setIsSharingToExplore(false);
		setIsSharedToExplore(false);
		setShareMessage(null);
		livenessDetectorRef.current.reset();
		setLivenessState({
			isLiveVerified: false,
			hasBlinked: false,
			hasDynamicMovement: false,
			blinkConfidence: 0,
			instruction: 'Blink naturally to verify live presence',
			statusMessage: 'Verifying live human...',
		});
		setPhase('IDLE');
	};

	const handleShareToExplore = async () => {
		if (!isLoggedIn) {
			setShowAuthGate(true);
			return;
		}
		if (isSharedToExplore || isSharingToExplore) return;

		setIsSharingToExplore(true);
		setShareMessage(null);

		try {
			let finalImageUrl = capturedImage || '';
			if (capturedImage) {
				try {
					let webpFile: File;
					if (capturedImage.startsWith('data:image/')) {
						webpFile = await dataUrlToWebP(
							capturedImage,
							`smile_${session?.user?.id || 'user'}_${Date.now()}`,
							0.85,
							1080
						);
					} else {
						const blob = await fetch(capturedImage).then((r) => r.blob());
						webpFile = await convertToWebP(blob, 0.85, 1080);
					}

					const formData = new FormData();
					formData.append('file', webpFile);
					formData.append('folder', '/explore');
					formData.append('fileName', webpFile.name);

					const uploadRes = await fetch('/api/imagekit/upload', {
						method: 'POST',
						body: formData,
					});

					if (uploadRes.ok) {
						const uploadData = await uploadRes.json();
						if (uploadData.file?.url) {
							finalImageUrl = uploadData.file.url;
						}
					}
				} catch (err) {
					console.warn('ImageKit WebP upload fallback:', err);
				}
			}

			let res = await fetch('/api/v1/explore/post', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					image_url: finalImageUrl,
					smile_score: smileScore,
					caption: 'Live smile captured with Open Smile! 😊',
				}),
			});

			if (!res.ok) {
				res = await fetch('/api/explore/post', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						image_url: finalImageUrl,
						smile_score: smileScore,
						caption: 'Live smile captured with Open Smile! 😊',
					}),
				});
			}

			if (res.ok) {
				const resData = await res.json();
				setIsSharedToExplore(true);
				setShareMessage(resData.message || '🎉 Shared to Explore feed! (+5 bonus coins)');
				emitCoinBalanceUpdate();
			} else {
				setShareMessage('Could not share right now. Please try again.');
			}
		} catch {
			setIsSharedToExplore(true);
			setShareMessage('🎉 Shared to Explore feed!');
		} finally {
			setIsSharingToExplore(false);
		}
	};

	const scratchCard: ScratchCardItem = {
		id: earnedCardId || 'capture-reward',
		title: 'Mystery Smile Reward',
		source: 'Live Smile Check',
		date: 'Today',
		coins: coinsAwarded,
		isScratched: isRewardClaimed,
		themeColor: smileScore >= 85 ? '#C6F135' : smileScore >= 70 ? '#7B61FF' : '#FF2D78',
		badge: 'NEW',
	};

	if (settings.maintenance_mode) {
		return (
			<main
				id="main-content"
				className="mx-auto w-full max-w-[1280px] px-2 pb-12 pt-6 sm:px-4 sm:pt-10">
				<div className="mx-auto max-w-xl text-center py-16 px-6 border-[length:var(--border-width)] border-border rounded-2xl bg-card shadow-brutal space-y-4 mt-6">
					<div className="size-16 mx-auto rounded-2xl border-[length:var(--border-width)] border-border bg-destructive/20 text-destructive flex items-center justify-center shadow-brutal-xs">
						<Lock className="size-8" strokeWidth={2.5} />
					</div>
					<h1 className="text-3xl font-black font-title tracking-tight text-foreground">
						Capture Temporarily Offline
					</h1>
					<p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
						Platform maintenance mode is currently active. Camera captures, smile scoring, and coin reward submissions are temporarily paused for platform upgrades.
					</p>
					<div className="pt-4">
						<Link href="/dashboard">
							<Button className="font-mono text-xs font-black uppercase border-[length:var(--border-width)] border-border shadow-brutal-xs brutal-lift">
								Return to Dashboard
							</Button>
						</Link>
					</div>
				</div>
			</main>
		);
	}

	if (
		captureStatus?.limit_reached &&
		phase !== 'CELEBRATING' &&
		phase !== 'SCORED' &&
		phase !== 'SCRATCH_CARD' &&
		phase !== 'DONE'
	) {
		return (
			<main
				id="main-content"
				className="mx-auto w-full max-w-[1280px] px-2 pb-12 pt-6 sm:px-4 sm:pt-10">
				<div className="mx-auto max-w-xl text-center py-16 px-6 border-[length:var(--border-width)] border-border rounded-2xl bg-card shadow-brutal space-y-5 mt-6">
					<div className="size-16 mx-auto rounded-2xl border-[length:var(--border-width)] border-border bg-warning text-warning-foreground flex items-center justify-center shadow-brutal-xs">
						<Clock className="size-8" strokeWidth={2.5} />
					</div>
					<h1 className="text-3xl font-black font-title tracking-tight text-foreground">
						Daily Capture Limit Reached
					</h1>
					<p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
						You have used all <strong className="text-foreground">{captureStatus.max_daily_captures} / {captureStatus.max_daily_captures}</strong> smile captures for today. Your daily quota automatically refreshes tonight at <strong className="text-foreground">12:00 AM IST (midnight)</strong>, matching the daily leaderboard reset!
					</p>
					<div className="border-[length:var(--border-width)] border-border rounded-xl bg-muted/60 p-6 shadow-brutal-sm space-y-3">
						<div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<Clock className="size-4 text-warning" />
							<span>Daily Quota Refreshes In (IST)</span>
						</div>
						<AnimatedNumberCountdown
							endDate={captureStatus.resets_at ? new Date(captureStatus.resets_at) : getNextIndianMidnight()}
							onComplete={fetchCaptureStatus}
							className="py-1"
							numberClassName="text-3xl sm:text-5xl font-black font-mono tracking-tighter"
							labelClassName="text-xs sm:text-sm font-mono font-bold uppercase text-muted-foreground"
						/>
					</div>
					<div className="pt-3">
						<Link href="/dashboard">
							<Button className="font-mono text-xs font-black uppercase border-[length:var(--border-width)] border-border shadow-brutal-xs brutal-lift">
								Return to Dashboard
							</Button>
						</Link>
					</div>
				</div>
			</main>
		);
	}

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
										<span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
										<span className="relative inline-flex size-2.5 rounded-full bg-success" />
									</span>
									Camera active
								</>
							)}
					</div>
					{captureStatus && (
						<div className="flex items-center gap-2 border-[length:var(--border-width)] border-border rounded-lg bg-card px-3 py-1.5 font-mono text-xs font-bold shadow-brutal-xs">
							<Clock className="size-3.5 text-warning" />
							<span>Captures Today: {captureStatus.daily_captures_used} / {captureStatus.max_daily_captures}</span>
							<span className="text-muted-foreground">• Refreshes 12:00 AM IST</span>
						</div>
					)}
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
										<p className="mt-3 inline-flex items-center gap-1.5 rounded-md border-[length:var(--border-width-sm)] border-border/40 bg-success/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-success">
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

						{isQuotaFinished && (
							<div className="mt-6 border-[length:var(--border-width)] border-border rounded-xl bg-card p-6 shadow-brutal text-center space-y-3">
								<div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
									<Clock className="size-4 text-warning" />
									<span>Daily Quota Refreshes In (IST)</span>
								</div>
								<AnimatedNumberCountdown
									endDate={
										captureStatus?.resets_at
											? new Date(captureStatus.resets_at)
											: getNextIndianMidnight()
									}
									onComplete={fetchCaptureStatus}
									className="py-1"
									numberClassName="text-3xl sm:text-5xl font-black font-mono tracking-tighter"
									labelClassName="text-xs sm:text-sm font-mono font-bold uppercase text-muted-foreground"
								/>
								<p className="font-mono text-xs text-muted-foreground">
									You have used all {captureStatus?.max_daily_captures} smile captures for today. Quota refreshes tonight at 12:00 AM IST (Indian Standard Time).
								</p>
							</div>
						)}
					</div>
				)}

				{(phase === 'CAMERA_ACTIVE' || phase === 'COUNTDOWN') && (
					<div className="mx-auto w-full max-w-3xl flex flex-col gap-5">
						<div className="relative">
							<WebcamView
								ref={webcamRef}
								isActive={phase === 'CAMERA_ACTIVE' || phase === 'COUNTDOWN'}
								isFrozen={phase !== 'CAMERA_ACTIVE' && phase !== 'COUNTDOWN'}
								stream={cameraStream}
								onStreamChange={setCameraStream}
								onSmileUpdate={handleSmileUpdate}
								onReady={handleCameraReady}
								onPalmShutterTrigger={() => {
									if (phase === 'CAMERA_ACTIVE') {
										triggerCaptureSequence(undefined, 'PALM');
									}
								}}
								isLiveVerified={livenessState.isLiveVerified || settings.liveness_detection_enabled === false}
								livenessPrompt={livenessState.instruction}
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
							isSharingToExplore={isSharingToExplore}
							isSharedToExplore={isSharedToExplore}
							shareMessage={shareMessage}
							isQuotaFinished={isQuotaFinished}
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
