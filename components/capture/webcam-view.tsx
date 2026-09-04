'use client';

import * as React from 'react';
import { Camera, ScanFace, AlertTriangle, RefreshCw, Settings, ShieldAlert, Hand } from 'lucide-react';
import {
	initSmileDetector,
	detectSmile,
	type SmileDetectionResult,
} from '@/lib/smile-detection';
import type { FaceLandmarker, GestureRecognizer, NormalizedLandmark } from '@mediapipe/tasks-vision';
import {
	initGestureRecognizer,
	detectHandGesture,
	renderHandDrawingShape,
} from '@/lib/hand-gesture';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSystemSettings } from '@/hooks/use-system-settings';
import {
	renderFaceDrawingShape,
	DEFAULT_DRAWING_SPEC,
	type MediaPipeDrawingSpec,
} from '@/lib/mediapipe-drawing';

export async function requestCameraStream(): Promise<MediaStream> {
	if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
		throw new Error('Camera is not supported in this environment.');
	}

	try {
		return await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: { ideal: 'user' },
				width: { ideal: 1280, max: 1920 },
				height: { ideal: 720, max: 1080 },
				frameRate: { ideal: 30, max: 30 },
			},
			audio: false,
		});
	} catch {
		return await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: 'user',
				frameRate: { ideal: 30, max: 30 },
			},
			audio: false,
		});
	}
}

export interface WebcamViewHandle {
	getScreenshot: () => string | null;
}

interface WebcamViewProps {
	isActive: boolean;
	isFrozen: boolean;
	stream?: MediaStream | null;
	onStreamChange?: (stream: MediaStream | null) => void;
	onSmileUpdate?: (result: SmileDetectionResult | null) => void;
	onReady?: () => void;
	onError?: (error: string) => void;
	className?: string;
	isLiveVerified?: boolean;
	livenessPrompt?: string;
	drawingSpec?: Partial<MediaPipeDrawingSpec>;
	showMeshToggle?: boolean;
	onPalmShutterTrigger?: () => void;
	palmShutterEnabled?: boolean;
	showPalmToggle?: boolean;
}

export const WebcamView = React.forwardRef<WebcamViewHandle, WebcamViewProps>(
	function WebcamView(
		{
			isActive,
			isFrozen,
			stream: externalStream,
			onStreamChange,
			onSmileUpdate,
			onReady,
			onError,
			className,
			isLiveVerified = false,
			livenessPrompt,
			drawingSpec: customDrawingSpec,
			showMeshToggle = true,
			onPalmShutterTrigger,
			palmShutterEnabled: palmShutterProp,
			showPalmToggle = true,
		},
		ref
	) {
		const { settings } = useSystemSettings();
		const videoRef = React.useRef<HTMLVideoElement>(null);
		const canvasRef = React.useRef<HTMLCanvasElement>(null);
		const detectorRef = React.useRef<FaceLandmarker | null>(null);
		const gestureRecognizerRef = React.useRef<GestureRecognizer | null>(null);
		const rafRef = React.useRef<number>(0);
		const localStreamRef = React.useRef<MediaStream | null>(null);
		const [userMeshToggled, setUserMeshToggled] = React.useState<boolean | null>(null);
		const [userPalmToggled, setUserPalmToggled] = React.useState<boolean | null>(null);

		const isPalmActive = userPalmToggled !== null ? userPalmToggled : (palmShutterProp ?? (settings.palm_shutter_enabled !== false));
		const isPalmActiveRef = React.useRef(isPalmActive);
		isPalmActiveRef.current = isPalmActive;

		const onPalmShutterTriggerRef = React.useRef(onPalmShutterTrigger);
		onPalmShutterTriggerRef.current = onPalmShutterTrigger;

		const [palmHudStatus, setPalmHudStatus] = React.useState<'idle' | 'detected' | 'triggered'>('idle');
		const palmStateRef = React.useRef<'idle' | 'detected' | 'triggered'>('idle');
		const palmDetectedTimeRef = React.useRef<number>(0);
		const lastPalmTriggerTimeRef = React.useRef<number>(0);
		const lastGestureCheckTimeRef = React.useRef<number>(0);
		const isRecognizingGestureRef = React.useRef<boolean>(false);

		const activeDrawingSpec: MediaPipeDrawingSpec = React.useMemo(() => {
			const base = settings.mediapipe_drawing_spec || DEFAULT_DRAWING_SPEC;
			const isEnabled = userMeshToggled !== null ? userMeshToggled : (customDrawingSpec?.enabled ?? base.enabled);
			return {
				...base,
				...customDrawingSpec,
				enabled: isEnabled,
			};
		}, [settings.mediapipe_drawing_spec, customDrawingSpec, userMeshToggled]);

		const activeDrawingSpecRef = React.useRef(activeDrawingSpec);
		activeDrawingSpecRef.current = activeDrawingSpec;

		const onSmileUpdateRef = React.useRef(onSmileUpdate);
		onSmileUpdateRef.current = onSmileUpdate;

		const onStreamChangeRef = React.useRef(onStreamChange);
		onStreamChangeRef.current = onStreamChange;

		const onReadyRef = React.useRef(onReady);
		onReadyRef.current = onReady;

		const onErrorRef = React.useRef(onError);
		onErrorRef.current = onError;

		const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');
		const [errorType, setErrorType] = React.useState<'permission' | 'device' | 'busy' | 'other'>('other');
		const [errorMsg, setErrorMsg] = React.useState('');
		const [currentScore, setCurrentScore] = React.useState(0);
		const [hasFace, setHasFace] = React.useState(false);
		const [isRetrying, setIsRetrying] = React.useState(false);

		const lastInferenceTimeRef = React.useRef<number>(0);
		const isDetectingRef = React.useRef<boolean>(false);
		const lastUiUpdateRef = React.useRef<number>(0);
		const hasFaceRef = React.useRef<boolean>(false);
		const currentScoreRef = React.useRef<number>(0);

		const getScreenshot = React.useCallback((): string | null => {
			const video = videoRef.current;
			if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
				return null;
			}
			try {
				const canvas = document.createElement('canvas');
				const maxDim = 1280;
				const width = Math.min(video.videoWidth, maxDim);
				const height = Math.round((width / video.videoWidth) * video.videoHeight);
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				if (!ctx) return null;

				ctx.translate(canvas.width, 0);
				ctx.scale(-1, 1);
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				return canvas.toDataURL('image/jpeg', 0.88);
			} catch {
				return null;
			}
		}, []);

		React.useImperativeHandle(ref, () => ({
			getScreenshot,
		}), [getScreenshot]);

		const externalStreamRef = React.useRef(externalStream);
		externalStreamRef.current = externalStream;

		const startCamera = React.useCallback(async () => {
			if (!isActive || isFrozen) return;

			try {
				setIsRetrying(true);
				setStatus('loading');
				setErrorMsg('');

				let activeStream = externalStreamRef.current || localStreamRef.current;

				if (!activeStream || !activeStream.active) {
					try {
						activeStream = await requestCameraStream();
						localStreamRef.current = activeStream;
						onStreamChangeRef.current?.(activeStream);
					} catch (camErr) {
						let type: 'permission' | 'device' | 'busy' | 'other' = 'other';
						let msg = 'Failed to access camera.';

						if (camErr instanceof DOMException) {
							if (camErr.name === 'NotAllowedError' || camErr.name === 'PermissionDeniedError') {
								type = 'permission';
								msg = 'Camera access is blocked by Windows or your browser settings.';
							} else if (camErr.name === 'NotFoundError' || camErr.name === 'DevicesNotFoundError') {
								type = 'device';
								msg = 'No webcam was detected on this device.';
							} else if (camErr.name === 'NotReadableError' || camErr.name === 'TrackStartError') {
								type = 'busy';
								msg = 'Your webcam is currently being used by another app (Zoom, Teams, etc.).';
							}
						}

						setErrorType(type);
						setStatus('error');
						setErrorMsg(msg);
						onErrorRef.current?.(msg);
						return;
					}
				}

				const video = videoRef.current;
				if (video) {
					video.srcObject = activeStream;
					try {
						await video.play();
					} catch {}
				}

				const faceDetector = await initSmileDetector().catch((err) => {
					console.warn('[OpenSmile] Face detector init failed:', err);
					return null;
				});

				if (faceDetector) detectorRef.current = faceDetector;

				initGestureRecognizer()
					.then((recognizer) => {
						gestureRecognizerRef.current = recognizer;
					})
					.catch((err) => {
						console.warn('[OpenSmile] Gesture recognizer init failed:', err);
					});

				setStatus('ready');
				onReadyRef.current?.();
			} catch {
				setStatus('error');
				setErrorType('other');
				setErrorMsg('Could not initialize camera.');
				onErrorRef.current?.('Initialization error');
			} finally {
				setIsRetrying(false);
			}
		}, [isActive, isFrozen]);

		React.useEffect(() => {
			if (externalStream && videoRef.current && isActive && !isFrozen) {
				videoRef.current.srcObject = externalStream;
				videoRef.current.play().catch(() => {});
			}
		}, [externalStream, isActive, isFrozen]);

		React.useEffect(() => {
			if (isActive && !isFrozen) {
				startCamera();
			} else {
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
				if (localStreamRef.current) {
					localStreamRef.current.getTracks().forEach((t) => t.stop());
					localStreamRef.current = null;
				}
				if (videoRef.current) {
					videoRef.current.srcObject = null;
				}
			}

			return () => {
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
				if (localStreamRef.current) {
					localStreamRef.current.getTracks().forEach((t) => t.stop());
					localStreamRef.current = null;
				}
			};
		}, [isActive, isFrozen, startCamera]);

		const lastVideoTimeRef = React.useRef<number>(-1);

		React.useEffect(() => {
			if (status !== 'ready' || isFrozen) return;

			const video = videoRef.current;
			if (!video) return;

			let running = true;

			function tick() {
				if (!running || !video) return;

				const now = performance.now();
				const timeSinceLastInference = now - lastInferenceTimeRef.current;

				if (
					!isDetectingRef.current &&
					timeSinceLastInference >= 38 &&
					video.readyState >= 2 &&
					video.currentTime !== lastVideoTimeRef.current &&
					video.videoWidth > 0
				) {
					lastVideoTimeRef.current = video.currentTime;
					lastInferenceTimeRef.current = now;
					isDetectingRef.current = true;

					let faceLandmarks: NormalizedLandmark[] | undefined = undefined;
					if (detectorRef.current) {
						try {
							const result = detectSmile(
								detectorRef.current,
								video,
								now
							);
							faceLandmarks = result?.landmarks;

							onSmileUpdateRef.current?.(result);

							const hasFaceVal = Boolean(result?.hasFace);
							const scoreVal = result?.score ?? 0;
							const isFaceChanged = hasFaceVal !== hasFaceRef.current;
							const isScoreSignificantlyChanged = Math.abs(scoreVal - currentScoreRef.current) >= 2;
							const isUiUpdateDue = now - lastUiUpdateRef.current >= 75;

							if (isFaceChanged || (isUiUpdateDue && isScoreSignificantlyChanged)) {
								hasFaceRef.current = hasFaceVal;
								currentScoreRef.current = scoreVal;
								lastUiUpdateRef.current = now;
								setHasFace(hasFaceVal);
								setCurrentScore(scoreVal);
							}
						} finally {
							isDetectingRef.current = false;
						}
					} else {
						isDetectingRef.current = false;
					}

					let handLandmarks: NormalizedLandmark[] | undefined = undefined;
					if (
						isPalmActiveRef.current &&
						gestureRecognizerRef.current &&
						!isRecognizingGestureRef.current &&
						now - lastGestureCheckTimeRef.current >= 70
					) {
						lastGestureCheckTimeRef.current = now;
						isRecognizingGestureRef.current = true;
						try {
							const gestureResult = detectHandGesture(
								gestureRecognizerRef.current,
								video,
								now
							);
							handLandmarks = gestureResult?.landmarks;

							const nowMs = Date.now();
							if (nowMs - lastPalmTriggerTimeRef.current > 3000) {
								if (palmStateRef.current === 'idle') {
									if (gestureResult?.isOpenPalm && !gestureResult.isClosedFist) {
										palmStateRef.current = 'detected';
										palmDetectedTimeRef.current = nowMs;
										setPalmHudStatus('detected');
									}
								} else if (palmStateRef.current === 'detected') {
									const elapsedSinceDetected = nowMs - palmDetectedTimeRef.current;
									// Trigger ONLY when user closes their hand into a fist
									if (
										elapsedSinceDetected >= 250 &&
										gestureResult?.isClosedFist &&
										!gestureResult.isOpenPalm
									) {
										palmStateRef.current = 'triggered';
										lastPalmTriggerTimeRef.current = nowMs;
										setPalmHudStatus('triggered');
										onPalmShutterTriggerRef.current?.();
										setTimeout(() => {
											palmStateRef.current = 'idle';
											setPalmHudStatus('idle');
										}, 3000);
									} else if (elapsedSinceDetected > 5000 && !gestureResult?.hasHand) {
										palmStateRef.current = 'idle';
										setPalmHudStatus('idle');
									}
								}
							}
						} finally {
							isRecognizingGestureRef.current = false;
						}
					}

					const canvas = canvasRef.current;
					if (canvas) {
						const ctx = canvas.getContext('2d');
						if (ctx) {
							const currentSpec = activeDrawingSpecRef.current;
							const hasFaceToDraw = Boolean(faceLandmarks && faceLandmarks.length > 0 && currentSpec.enabled);
							const hasHandToDraw = Boolean(handLandmarks && handLandmarks.length > 0 && currentSpec.enabled);

							if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
								canvas.width = video.videoWidth;
								canvas.height = video.videoHeight;
							}

							if (hasFaceToDraw || hasHandToDraw) {
								ctx.clearRect(0, 0, canvas.width, canvas.height);
								if (hasFaceToDraw && faceLandmarks) {
									renderFaceDrawingShape(ctx, faceLandmarks, currentSpec);
								}
								if (hasHandToDraw && handLandmarks) {
									renderHandDrawingShape(ctx, handLandmarks, currentSpec);
								}
							} else {
								ctx.clearRect(0, 0, canvas.width, canvas.height);
							}
						}
					}
				}

				rafRef.current = requestAnimationFrame(tick);
			}

			rafRef.current = requestAnimationFrame(tick);

			return () => {
				running = false;
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
			};
		}, [status, isFrozen]);

		React.useEffect(() => {
			if (isFrozen || status !== 'ready' || !activeDrawingSpec.enabled) {
				const canvas = canvasRef.current;
				if (canvas) {
					const ctx = canvas.getContext('2d');
					ctx?.clearRect(0, 0, canvas.width, canvas.height);
				}
			}
		}, [isFrozen, status, activeDrawingSpec.enabled]);

		const getScoreColor = (score: number) => {
			if (score >= 80) return 'bg-success';
			if (score >= 60) return 'bg-accent';
			if (score >= 40) return 'bg-warning';
			return 'bg-primary';
		};

		const cleanLivenessPrompt = React.useMemo(() => {
			if (!livenessPrompt) return 'Blink to verify';
			const lower = livenessPrompt.toLowerCase();
			if (lower.includes('static') || lower.includes('photo')) return 'Real Face Required';
			if (lower.includes('swap') || lower.includes('changed')) return 'Face Changed';
			if (lower.includes('expired')) return 'Blink to verify';
			if (lower.includes('blink')) return 'Blink to verify';
			if (lower.includes('verif')) return 'Verifying...';
			if (lower.includes('position')) return 'Align face';
			if (lower.includes('turn')) return 'Turn head';
			return livenessPrompt.length > 18 ? `${livenessPrompt.slice(0, 16)}...` : livenessPrompt;
		}, [livenessPrompt]);

		return (
			<div
				className={cn(
					'relative overflow-hidden rounded-xl border-[length:var(--border-width)] border-border bg-card shadow-brutal-lg',
					className
				)}>
				<div className="flex flex-wrap items-center justify-between gap-2 border-b-[length:var(--border-width)] border-border bg-muted px-4 py-2.5">
					<div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
						<Camera className="size-4" strokeWidth={2.5} />
						Camera Feed
					</div>
					<div className="flex items-center gap-2">
						{showMeshToggle && status === 'ready' && !isFrozen && (
							<button
								type="button"
								onClick={() => setUserMeshToggled((prev) => (prev !== null ? !prev : !activeDrawingSpec.enabled))}
								className={cn(
									'relative flex size-7 items-center justify-center rounded-md border-[length:var(--border-width-sm)] border-border transition-all shadow-brutal-xs cursor-pointer active:scale-90',
									activeDrawingSpec.enabled
										? 'bg-success/20 text-success border-success/60 hover:bg-success/30'
										: 'bg-muted/60 text-muted-foreground/50 border-border/50 hover:text-muted-foreground hover:bg-muted'
								)}
								title={`Face Mesh: ${activeDrawingSpec.enabled ? 'ON' : 'OFF'}`}
								aria-label={`Face Mesh: ${activeDrawingSpec.enabled ? 'ON' : 'OFF'}`}>
								<ScanFace className="size-3.5" strokeWidth={2.2} />
								{activeDrawingSpec.enabled && (
									<span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-success border border-border" />
								)}
							</button>
						)}
						{showPalmToggle && status === 'ready' && !isFrozen && (
							<button
								type="button"
								onClick={() => setUserPalmToggled((prev) => (prev !== null ? !prev : !isPalmActive))}
								className={cn(
									'relative flex size-7 items-center justify-center rounded-md border-[length:var(--border-width-sm)] border-border transition-all shadow-brutal-xs cursor-pointer active:scale-90',
									isPalmActive
										? 'bg-primary/20 text-primary border-primary/60 hover:bg-primary/30'
										: 'bg-muted/60 text-muted-foreground/50 border-border/50 hover:text-muted-foreground hover:bg-muted'
								)}
								title={`Palm Shutter: ${isPalmActive ? 'ON' : 'OFF'}`}
								aria-label={`Palm Shutter: ${isPalmActive ? 'ON' : 'OFF'}`}>
								<Hand className="size-3.5" strokeWidth={2.2} />
								{isPalmActive && (
									<span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary border border-border" />
								)}
							</button>
						)}
						{status === 'ready' && !isFrozen && (
							<>
								<span className="relative flex size-2">
									<span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
									<span className="relative inline-flex size-2 rounded-full bg-destructive" />
								</span>
								<span className="font-mono text-[10px] font-bold tracking-widest uppercase">
									LIVE
								</span>
							</>
						)}
						{isFrozen && (
							<span className="font-mono text-[10px] font-bold tracking-widest uppercase text-success">
								CAPTURED
							</span>
						)}
					</div>
				</div>

				<div className="relative flex min-h-80 items-center justify-center bg-foreground/5 sm:min-h-[28rem]">
					<video
						ref={videoRef}
						className={cn(
							'absolute inset-0 size-full object-cover',
							status !== 'ready' && 'hidden'
						)}
						playsInline
						muted
						autoPlay
						style={{ transform: 'scaleX(-1)' }}
					/>

					<canvas
						ref={canvasRef}
						className={cn(
							'absolute inset-0 size-full object-cover pointer-events-none',
							(status !== 'ready' || isFrozen || !activeDrawingSpec.enabled) && 'hidden'
						)}
						style={{ transform: 'scaleX(-1)' }}
					/>

					{/* Palm Shutter Floating Gesture HUD */}
					{status === 'ready' && !isFrozen && isPalmActive && (
						<>
							{palmHudStatus === 'detected' && (
								<div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
									<div className="inline-flex items-center gap-2 rounded-xl border-[length:var(--border-width)] border-border bg-accent text-accent-foreground px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider shadow-brutal animate-bounce">
										<span className="text-base leading-none">✋</span>
										<span>Palm Ready! Close hand to snap ✊</span>
									</div>
								</div>
							)}

							{palmHudStatus === 'triggered' && (
								<div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
									<div className="inline-flex items-center gap-2 rounded-xl border-[length:var(--border-width)] border-border bg-success text-success-foreground px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider shadow-brutal">
										<span className="text-base leading-none">✊</span>
										<span>Snap Triggered! Get Ready!</span>
									</div>
								</div>
							)}
						</>
					)}

					<div className="absolute left-5 top-5 size-5 border-l-[length:var(--border-width-lg)] border-t-[length:var(--border-width-lg)] border-border/40 pointer-events-none" />
					<div className="absolute right-5 top-5 size-5 border-r-[length:var(--border-width-lg)] border-t-[length:var(--border-width-lg)] border-border/40 pointer-events-none" />
					<div className="absolute bottom-5 left-5 size-5 border-l-[length:var(--border-width-lg)] border-b-[length:var(--border-width-lg)] border-border/40 pointer-events-none" />
					<div className="absolute bottom-5 right-5 size-5 border-r-[length:var(--border-width-lg)] border-b-[length:var(--border-width-lg)] border-border/40 pointer-events-none" />

					{status === 'loading' && (
						<div className="flex flex-col items-center gap-4 text-center z-10 p-6">
							<div className="flex size-16 items-center justify-center rounded-xl border-[length:var(--border-width)] border-border bg-accent text-accent-foreground shadow-brutal animate-pulse">
								<ScanFace className="size-8" strokeWidth={1.75} />
							</div>
							<p className="max-w-[28ch] text-sm font-bold text-muted-foreground">
								Connecting to webcam & AI detectors...
							</p>
						</div>
					)}

					{status === 'error' && (
						<div className="flex flex-col items-center gap-4 text-center z-10 p-6 max-w-lg">
							<div className="flex size-16 items-center justify-center rounded-xl border-[length:var(--border-width)] border-border bg-destructive/20 text-destructive shadow-brutal">
								{errorType === 'permission' ? (
									<ShieldAlert className="size-8 text-destructive" strokeWidth={2} />
								) : (
									<AlertTriangle className="size-8 text-destructive" strokeWidth={2} />
								)}
							</div>

							<div>
								<h3 className="font-title text-base font-black text-destructive">
									{errorType === 'permission' ? 'Camera Access Blocked' : 'Camera Unavailable'}
								</h3>
								<p className="mt-1 text-sm font-bold text-muted-foreground">
									{errorMsg}
								</p>
							</div>

							{errorType === 'permission' && (
								<div className="w-full text-left rounded-lg border-[length:var(--border-width)] border-border bg-card p-4 shadow-brutal-sm text-xs font-semibold space-y-2">
									<p className="font-bold text-foreground flex items-center gap-1.5 font-mono uppercase">
										<Settings className="size-3.5" /> How to allow camera on Windows:
									</p>
									<ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
										<li>
											Press <kbd className="rounded-xs border border-border/40 px-1 font-mono text-[10px] bg-muted">Win + I</kbd> → go to <strong>Privacy & Security</strong> → <strong>Camera</strong>
										</li>
										<li>
											Turn <strong>ON</strong> <em>&quot;Camera access&quot;</em> and <em>&quot;Let desktop apps access your camera&quot;</em>
										</li>
										<li>
											In Chrome/Edge URL bar, click the 🔒 or 🎛 icon on the left of <code className="rounded-xs border border-border/20 font-mono bg-muted px-1 py-0.5">localhost:3000</code> and select <strong>Allow</strong>
										</li>
										<li>
											Check if your laptop has a physical webcam privacy slider or Fn toggle key
										</li>
									</ol>
								</div>
							)}

							<Button
								size="lg"
								disabled={isRetrying}
								onClick={startCamera}
								className="gap-2 font-mono text-sm uppercase font-bold tracking-wider mt-2">
								<RefreshCw className={cn('size-4', isRetrying && 'animate-spin')} />
								{isRetrying ? 'Checking...' : 'Check & Retry Camera'}
							</Button>
						</div>
					)}

					{status === 'ready' && !isFrozen && (
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-auto max-w-[calc(100%-2rem)] pointer-events-none">
							{hasFace ? (
								<div className="pointer-events-auto inline-flex items-center gap-2.5 sm:gap-3 rounded-lg border-[length:var(--border-width)] border-border bg-card/95 backdrop-blur-sm px-3 py-1.5 shadow-brutal-sm select-none">
									{isLiveVerified ? (
										<div className="inline-flex items-center gap-1.5 rounded-md border-[length:var(--border-width-sm)] border-border bg-success px-2 py-0.5 text-success-foreground font-mono text-[10px] font-black uppercase tracking-wider shadow-brutal-xs">
											<span className="size-1.5 rounded-full bg-current animate-pulse" />
											<span>Verified ✓</span>
										</div>
									) : (
										<div
											className={cn(
												'inline-flex items-center gap-1.5 rounded-md border-[length:var(--border-width-sm)] border-border px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider shadow-brutal-xs select-none',
												cleanLivenessPrompt.includes('Real') || cleanLivenessPrompt.includes('Changed')
													? 'bg-destructive text-destructive-foreground'
													: 'bg-warning text-warning-foreground'
											)}>
											<span className="size-1.5 rounded-full bg-current animate-pulse" />
											<span>{cleanLivenessPrompt}</span>
										</div>
									)}

									<div className="h-3.5 w-px bg-border/40" />

									<div className="flex items-center gap-2 font-mono">
										<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
											Smile
										</span>
										<div className="w-14 sm:w-20 h-2.5 overflow-hidden rounded-xs border-[length:var(--border-width-sm)] border-border bg-muted">
											<div
												className={cn(
													'h-full transition-all duration-150',
													getScoreColor(currentScore)
												)}
												style={{ width: `${currentScore}%` }}
											/>
										</div>
										<span className="text-xs font-black tabular-nums min-w-[2.2ch] text-foreground">
											{currentScore}%
										</span>
									</div>
								</div>
							) : (
								<div className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border-[length:var(--border-width)] border-border bg-card/95 backdrop-blur-sm px-3 py-1.5 shadow-brutal-xs">
									<ScanFace className="size-3.5 text-muted-foreground animate-pulse" />
									<span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
										Position face in frame
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
);
