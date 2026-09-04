'use client';

import {
	GestureRecognizer,
	FilesetResolver,
	type GestureRecognizerResult,
	type NormalizedLandmark,
} from '@mediapipe/tasks-vision';
import type { MediaPipeDrawingSpec } from '@/lib/mediapipe-drawing';

let gestureRecognizer: GestureRecognizer | null = null;
let initPromise: Promise<GestureRecognizer> | null = null;

const WASM_LOCAL_PATH = '/models';
const WASM_CDN_PATH =
	'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const GESTURE_MODEL_LOCAL_PATH = '/models/gesture_recognizer.task';
const GESTURE_MODEL_CDN_PATH =
	'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';

async function createGestureRecognizer(
	vision: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>,
	modelPath: string,
	delegate: 'GPU' | 'CPU',
): Promise<GestureRecognizer> {
	return GestureRecognizer.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: modelPath,
			delegate,
		},
		runningMode: 'VIDEO',
		numHands: 1,
		minHandDetectionConfidence: 0.4,
		minHandPresenceConfidence: 0.4,
		minTrackingConfidence: 0.4,
	});
}

export async function initGestureRecognizer(): Promise<GestureRecognizer> {
	if (gestureRecognizer) return gestureRecognizer;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		try {
			let vision: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;
			try {
				vision = await FilesetResolver.forVisionTasks(WASM_LOCAL_PATH);
			} catch (wasmErr) {
				console.warn(
					'[OpenSmile] Local WASM files failed for GestureRecognizer, using CDN:',
					wasmErr,
				);
				vision = await FilesetResolver.forVisionTasks(WASM_CDN_PATH);
			}

			let recognizer: GestureRecognizer | null = null;

			try {
				recognizer = await createGestureRecognizer(
					vision,
					GESTURE_MODEL_LOCAL_PATH,
					'GPU',
				);
			} catch (gpuErr) {
				console.warn(
					'[OpenSmile] GPU delegate failed for GestureRecognizer, trying CPU:',
					gpuErr,
				);
				try {
					recognizer = await createGestureRecognizer(
						vision,
						GESTURE_MODEL_LOCAL_PATH,
						'CPU',
					);
				} catch (cpuErr) {
					console.warn(
						'[OpenSmile] Local gesture model failed, trying CDN model:',
						cpuErr,
					);
					recognizer = await createGestureRecognizer(
						vision,
						GESTURE_MODEL_CDN_PATH,
						'CPU',
					);
				}
			}

			gestureRecognizer = recognizer;
			return gestureRecognizer;
		} catch (err) {
			initPromise = null;
			throw err;
		}
	})();

	return initPromise;
}

export interface HandGestureResult {
	hasHand: boolean;
	gesture: string;
	confidence: number;
	landmarks?: NormalizedLandmark[];
	isOpenPalm: boolean;
	isClosedFist: boolean;
}

let lastGestureTimestamp = -1;

function distance(
	a: { x: number; y: number },
	b: { x: number; y: number },
): number {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function evaluateHandFist(landmarks: NormalizedLandmark[]): boolean {
	if (!landmarks || landmarks.length < 21) return false;
	const wrist = landmarks[0];
	if (!wrist) return false;

	const fingers = [
		{ tip: 8, pip: 6, mcp: 5 },
		{ tip: 12, pip: 10, mcp: 9 },
		{ tip: 16, pip: 14, mcp: 13 },
		{ tip: 20, pip: 18, mcp: 17 },
	];

	let curledCount = 0;
	for (const f of fingers) {
		const pTip = landmarks[f.tip];
		const pPip = landmarks[f.pip];
		const pMcp = landmarks[f.mcp];
		if (!pTip || !pPip || !pMcp) continue;

		const dTipWrist = distance(pTip, wrist);
		const dPipWrist = distance(pPip, wrist);
		const dMcpWrist = distance(pMcp, wrist);

		if (dTipWrist < dPipWrist || dTipWrist <= dMcpWrist * 1.1) {
			curledCount++;
		}
	}

	return curledCount >= 3;
}

function evaluateOpenPalm(landmarks: NormalizedLandmark[]): boolean {
	if (!landmarks || landmarks.length < 21) return false;
	const wrist = landmarks[0];
	if (!wrist) return false;

	const fingers = [
		{ tip: 8, pip: 6, mcp: 5 },
		{ tip: 12, pip: 10, mcp: 9 },
		{ tip: 16, pip: 14, mcp: 13 },
		{ tip: 20, pip: 18, mcp: 17 },
	];

	let extendedCount = 0;
	for (const f of fingers) {
		const pTip = landmarks[f.tip];
		const pPip = landmarks[f.pip];
		const pMcp = landmarks[f.mcp];
		if (!pTip || !pPip || !pMcp) continue;

		const dTipWrist = distance(pTip, wrist);
		const dPipWrist = distance(pPip, wrist);
		const dMcpWrist = distance(pMcp, wrist);

		if (dTipWrist > dPipWrist && dTipWrist > dMcpWrist * 1.25) {
			extendedCount++;
		}
	}

	return extendedCount >= 3;
}

export function detectHandGesture(
	recognizer: GestureRecognizer,
	video: HTMLVideoElement,
	timestampMs: number,
): HandGestureResult | null {
	if (
		video.readyState < 2 ||
		video.paused ||
		video.ended ||
		video.videoWidth === 0
	) {
		return null;
	}

	const currentTimestamp = Math.max(timestampMs, lastGestureTimestamp + 1);
	lastGestureTimestamp = currentTimestamp;

	try {
		const result: GestureRecognizerResult = recognizer.recognizeForVideo(
			video,
			currentTimestamp,
		);

		const landmarks = result.landmarks?.[0];
		const firstGesture = result.gestures?.[0]?.[0];
		const gestureName = firstGesture?.categoryName || 'None';
		const confidence = firstGesture?.score || 0;

		if (!landmarks || landmarks.length === 0) {
			return {
				hasHand: false,
				gesture: 'None',
				confidence: 0,
				isOpenPalm: false,
				isClosedFist: false,
			};
		}

		const isNeuralPalm = gestureName === 'Open_Palm' && confidence >= 0.5;
		const isNeuralFist = gestureName === 'Closed_Fist' && confidence >= 0.5;

		const geomFist = evaluateHandFist(landmarks);
		const geomPalm = evaluateOpenPalm(landmarks);

		const isOpenPalm = !isNeuralFist && !geomFist && (isNeuralPalm || geomPalm);
		const isClosedFist =
			!isOpenPalm &&
			((isNeuralFist && (geomFist || confidence >= 0.65)) ||
				(geomFist && !isNeuralPalm));

		return {
			hasHand: true,
			gesture: isClosedFist
				? 'Closed_Fist'
				: isOpenPalm
					? 'Open_Palm'
					: gestureName,
			confidence,
			landmarks,
			isOpenPalm,
			isClosedFist,
		};
	} catch {
		return null;
	}
}

export function renderHandDrawingShape(
	ctx: CanvasRenderingContext2D,
	landmarks: NormalizedLandmark[],
	spec?: MediaPipeDrawingSpec,
) {
	if (!landmarks || landmarks.length === 0) return;

	const { width, height } = ctx.canvas;
	ctx.save();

	const strokeColor = spec?.connectionColor || '#00FF00';
	const landmarkColor = spec?.landmarkColor || '#FF0000';
	const lineWidth = Math.max(1, (spec?.connectionLineWidth || 1.5) * 1.2);
	const radius = Math.max(1, (spec?.landmarkRadius || 1.5) * 1.2);

	if (GestureRecognizer.HAND_CONNECTIONS) {
		ctx.beginPath();
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = lineWidth;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		for (const conn of GestureRecognizer.HAND_CONNECTIONS) {
			const p1 = landmarks[conn.start];
			const p2 = landmarks[conn.end];
			if (p1 && p2) {
				ctx.moveTo(p1.x * width, p1.y * height);
				ctx.lineTo(p2.x * width, p2.y * height);
			}
		}
		ctx.stroke();
	}

	ctx.fillStyle = landmarkColor;
	ctx.beginPath();
	for (let i = 0; i < landmarks.length; i++) {
		const p = landmarks[i];
		if (p) {
			const x = p.x * width;
			const y = p.y * height;
			ctx.moveTo(x + radius, y);
			ctx.arc(x, y, radius, 0, 2 * Math.PI);
		}
	}
	ctx.fill();

	ctx.restore();
}

export function destroyGestureRecognizer() {
	lastGestureTimestamp = -1;
	if (gestureRecognizer) {
		try {
			gestureRecognizer.close();
		} catch (err) {
			console.warn('[OpenSmile] Error closing GestureRecognizer:', err);
		}
		gestureRecognizer = null;
		initPromise = null;
	}
}
