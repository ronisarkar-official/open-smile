'use client';

import {
	GestureRecognizer,
	FilesetResolver,
	type GestureRecognizerResult,
} from '@mediapipe/tasks-vision';

let gestureRecognizer: GestureRecognizer | null = null;
let initPromise: Promise<GestureRecognizer> | null = null;

export async function initGestureRecognizer(): Promise<GestureRecognizer> {
	if (gestureRecognizer) return gestureRecognizer;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const vision = await FilesetResolver.forVisionTasks('/models');

		try {
			gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath: '/models/gesture_recognizer.task',
					delegate: 'GPU',
				},
				runningMode: 'VIDEO',
				numHands: 1,
				minHandDetectionConfidence: 0.5,
				minHandPresenceConfidence: 0.5,
				minTrackingConfidence: 0.5,
			});
		} catch {
			gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath: '/models/gesture_recognizer.task',
					delegate: 'CPU',
				},
				runningMode: 'VIDEO',
				numHands: 1,
				minHandDetectionConfidence: 0.5,
				minHandPresenceConfidence: 0.5,
				minTrackingConfidence: 0.5,
			});
		}

		return gestureRecognizer;
	})();

	return initPromise;
}

export interface PalmPoint {
	x: number;
	y: number;
}

export interface PalmDetectionResult {
	isPalmDetected: boolean;
	score: number;
	gestureName: string;
	palmCenter: PalmPoint | null;
}

export function parseGestureResult(result: GestureRecognizerResult): PalmDetectionResult | null {
	if (!result.gestures || result.gestures.length === 0 || !result.landmarks || result.landmarks.length === 0) {
		return null;
	}

	const topGesture = result.gestures[0]?.[0];
	if (!topGesture) return null;

	const handLandmarks = result.landmarks[0];
	let palmCenter: PalmPoint | null = null;

	if (handLandmarks && handLandmarks.length >= 21) {
		const wrist = handLandmarks[0];
		const indexMcp = handLandmarks[5];
		const middleMcp = handLandmarks[9];
		const pinkyMcp = handLandmarks[17];

		palmCenter = {
			x: (wrist.x + indexMcp.x + middleMcp.x + pinkyMcp.x) / 4,
			y: (wrist.y + indexMcp.y + middleMcp.y + pinkyMcp.y) / 4,
		};
	}

	const isPalm = topGesture.categoryName === 'Open_Palm' && topGesture.score >= 0.55;

	return {
		isPalmDetected: isPalm,
		score: Math.round(topGesture.score * 100),
		gestureName: topGesture.categoryName,
		palmCenter,
	};
}

let lastGestureTimestamp = -1;

export function detectPalmGesture(
	recognizer: GestureRecognizer,
	video: HTMLVideoElement,
	timestampMs: number
): PalmDetectionResult | null {
	if (video.readyState < 2 || video.paused || video.ended || video.videoWidth === 0) {
		return null;
	}

	const currentTimestamp = Math.max(timestampMs, lastGestureTimestamp + 1);
	lastGestureTimestamp = currentTimestamp;

	try {
		const result = recognizer.recognizeForVideo(video, currentTimestamp);
		return parseGestureResult(result);
	} catch {
		return null;
	}
}

export function destroyGestureRecognizer() {
	lastGestureTimestamp = -1;
	if (gestureRecognizer) {
		try {
			gestureRecognizer.close();
		} catch {}
		gestureRecognizer = null;
		initPromise = null;
	}
}
