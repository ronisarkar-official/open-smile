'use client';

import * as React from 'react';
import { Camera, ScanFace, AlertTriangle, RefreshCw, Settings, ShieldAlert } from 'lucide-react';
import {
	initSmileDetector,
	detectSmile,
	type SmileDetectionResult,
} from '@/lib/smile-detection';
import type { FaceLandmarker } from '@mediapipe/tasks-vision';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
		},
		ref
	) {
		const videoRef = React.useRef<HTMLVideoElement>(null);
		const detectorRef = React.useRef<FaceLandmarker | null>(null);
		const rafRef = React.useRef<number>(0);
		const localStreamRef = React.useRef<MediaStream | null>(null);

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

		const startCamera = React.useCallback(async () => {
			try {
				setIsRetrying(true);
				setStatus('loading');
				setErrorMsg('');

				let activeStream = externalStream || localStreamRef.current;

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
		}, [externalStream]);

		React.useEffect(() => {
			if (isActive) {
				startCamera();
			}

			return () => {
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
				if (localStreamRef.current) {
					localStreamRef.current.getTracks().forEach((t) => t.stop());
					localStreamRef.current = null;
				}
			};
		}, [isActive, startCamera]);

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

					if (detectorRef.current) {
						try {
							const result = detectSmile(
								detectorRef.current,
								video,
								now
							);

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
				}

				rafRef.current = requestAnimationFrame(tick);
			}

			rafRef.current = requestAnimationFrame(tick);

			return () => {
				running = false;
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
			};
		}, [status, isFrozen]);

		const getScoreColor = (score: number) => {
			if (score >= 80) return 'bg-success';
			if (score >= 60) return 'bg-accent';
			if (score >= 40) return 'bg-secondary';
			return 'bg-primary';
		};

		return (
			<div
				className={cn(
					'relative overflow-hidden border-[length:var(--border-width)] border-border rounded-xl bg-card shadow-brutal-lg',
					className
				)}>
				<div className="flex flex-wrap items-center justify-between gap-2 border-b-[length:var(--border-width)] border-border bg-muted px-4 py-3">
					<div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
						<Camera className="size-4" strokeWidth={2.5} />
						Live Camera Smile Check
					</div>
					<div className="flex items-center gap-2">
						{status === 'ready' && !isFrozen && (
							<>
								<span className="relative flex size-2">
									<span className="absolute inline-flex size-full animate-ping bg-destructive opacity-75" />
									<span className="relative inline-flex size-2 bg-destructive" />
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

					<div className="absolute inset-6 border-[length:var(--border-width-sm)] border-dashed border-foreground/20 rounded-lg pointer-events-none" />
					<div className="absolute left-8 top-8 h-6 w-6 border-l-[length:var(--border-width)] border-t-[length:var(--border-width)] border-accent pointer-events-none" />
					<div className="absolute right-8 top-8 h-6 w-6 border-r-[length:var(--border-width)] border-t-[length:var(--border-width)] border-accent pointer-events-none" />
					<div className="absolute bottom-8 left-8 h-6 w-6 border-b-[length:var(--border-width)] border-l-[length:var(--border-width)] border-accent pointer-events-none" />
					<div className="absolute bottom-8 right-8 h-6 w-6 border-b-[length:var(--border-width)] border-r-[length:var(--border-width)] border-accent pointer-events-none" />

					{status === 'loading' && (
						<div className="flex flex-col items-center gap-4 text-center z-10 p-6">
							<div className="flex size-24 items-center justify-center border-[length:var(--border-width)] border-border rounded-xl bg-accent text-accent-foreground shadow-brutal animate-pulse">
								<ScanFace className="size-12" strokeWidth={1.5} />
							</div>
							<p className="max-w-[28ch] text-sm font-bold text-muted-foreground">
								Connecting to webcam & AI detectors...
							</p>
						</div>
					)}

					{status === 'error' && (
						<div className="flex flex-col items-center gap-4 text-center z-10 p-6 max-w-lg">
							<div className="flex size-16 items-center justify-center border-[length:var(--border-width)] border-border rounded-xl bg-destructive/20 shadow-brutal">
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
								<div className="w-full text-left border-[length:var(--border-width)] border-border rounded-lg bg-card p-4 shadow-brutal-sm text-xs font-semibold space-y-2">
									<p className="font-bold text-foreground flex items-center gap-1.5 font-mono uppercase">
										<Settings className="size-3.5" /> How to allow camera on Windows:
									</p>
									<ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
										<li>
											Press <kbd className="border border-border/30 rounded px-1 font-mono text-[10px] bg-muted">Win + I</kbd> → go to <strong>Privacy & Security</strong> → <strong>Camera</strong>
										</li>
										<li>
											Turn <strong>ON</strong> <em>&quot;Camera access&quot;</em> and <em>&quot;Let desktop apps access your camera&quot;</em>
										</li>
										<li>
											In Chrome/Edge URL bar, click the 🔒 or 🎛 icon on the left of <code className="font-mono bg-muted px-1">localhost:3000</code> and select <strong>Allow</strong>
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
						<div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
							<div className="flex items-center gap-2 border-[length:var(--border-width)] border-border rounded-lg bg-card/90 backdrop-blur-sm px-4 py-2 shadow-brutal-sm">
								<span className="font-mono text-xs font-bold uppercase tracking-wider">
									{hasFace ? 'Live Smile Score' : 'Position face in frame'}
								</span>
								{hasFace && (
									<span className="font-mono text-lg font-black tabular-nums">
										{currentScore}
									</span>
								)}
							</div>
							{hasFace && (
								<div className="w-44 h-3 border-[length:var(--border-width-sm)] border-border rounded-xs bg-card overflow-hidden">
									<div
										className={cn(
											'h-full transition-all duration-150',
											getScoreColor(currentScore)
										)}
										style={{ width: `${currentScore}%` }}
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
);
