'use client';

import {
	FaceLandmarker,
	FilesetResolver,
	type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';

let faceLandmarker: FaceLandmarker | null = null;
let initPromise: Promise<FaceLandmarker> | null = null;

export async function initSmileDetector(): Promise<FaceLandmarker> {
	if (faceLandmarker) return faceLandmarker;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const vision = await FilesetResolver.forVisionTasks('/models');

		try {
			faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath: '/models/face_landmarker.task',
					delegate: 'GPU',
				},
				runningMode: 'VIDEO',
				numFaces: 1,
				outputFaceBlendshapes: true,
				outputFacialTransformationMatrixes: false,
			});
		} catch (gpuErr) {
			console.warn('[OpenSmile] GPU delegate failed, falling back to CPU:', gpuErr);
			faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath: '/models/face_landmarker.task',
					delegate: 'CPU',
				},
				runningMode: 'VIDEO',
				numFaces: 1,
				outputFaceBlendshapes: true,
				outputFacialTransformationMatrixes: false,
			});
		}

		return faceLandmarker;
	})();

	return initPromise;
}

export interface SmileDetectionResult {
	score: number;
	hasFace: boolean;
	blendshapes: Record<string, number>;
}

function distance(
	a: { x: number; y: number },
	b: { x: number; y: number }
): number {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function computeSmileScore(result: FaceLandmarkerResult): SmileDetectionResult | null {
	if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
		return null;
	}

	const landmarks = result.faceLandmarks[0];
	const blendshapesList = result.faceBlendshapes?.[0]?.categories ?? [];

	const blendshapes: Record<string, number> = {};
	for (const bs of blendshapesList) {
		blendshapes[bs.categoryName] = bs.score;
	}

	const mouthSmileLeft = blendshapes['mouthSmileLeft'] ?? 0;
	const mouthSmileRight = blendshapes['mouthSmileRight'] ?? 0;
	const cheekSquintLeft = blendshapes['cheekSquintLeft'] ?? 0;
	const cheekSquintRight = blendshapes['cheekSquintRight'] ?? 0;
	const eyeSquintLeft = blendshapes['eyeSquintLeft'] ?? 0;
	const eyeSquintRight = blendshapes['eyeSquintRight'] ?? 0;

	const mouthSmile = (mouthSmileLeft + mouthSmileRight) / 2;
	const cheekSquint = (cheekSquintLeft + cheekSquintRight) / 2;
	const eyeSquint = (eyeSquintLeft + eyeSquintRight) / 2;

	const mouthLeft = landmarks[61];
	const mouthRight = landmarks[291];
	const upperLip = landmarks[13];
	const lowerLip = landmarks[14];
	const noseTip = landmarks[1];

	const mouthWidth = distance(mouthLeft, mouthRight);
	const mouthHeight = distance(upperLip, lowerLip);
	const mouthRatio = mouthWidth > 0 ? mouthHeight / mouthWidth : 0;

	const cornerLift =
		((noseTip.y - mouthLeft.y) + (noseTip.y - mouthRight.y)) / 2;
	const cornerLiftNorm = Math.max(0, Math.min(1, cornerLift * 5));

	const blendshapeScore = mouthSmile * 0.5 + cheekSquint * 0.25 + eyeSquint * 0.25;

	const geometryScore =
		Math.min(1, (1 - mouthRatio) * 0.6 + cornerLiftNorm * 0.4);

	const rawScore = blendshapeScore * 0.7 + geometryScore * 0.3;

	const score = Math.round(Math.max(0, Math.min(100, rawScore * 100)));

	return {
		score,
		hasFace: true,
		blendshapes,
	};
}

let lastTimestamp = -1;

export function detectSmile(
	detector: FaceLandmarker,
	video: HTMLVideoElement,
	timestampMs: number
): SmileDetectionResult | null {
	if (video.readyState < 2 || video.paused || video.ended || video.videoWidth === 0) {
		return null;
	}

	// MediaPipe requires strictly increasing timestamps for video mode
	const currentTimestamp = Math.max(timestampMs, lastTimestamp + 1);
	lastTimestamp = currentTimestamp;

	try {
		const result = detector.detectForVideo(video, currentTimestamp);
		return computeSmileScore(result);
	} catch (err) {
		// Ignore benign frame skips or internal sync notices
		return null;
	}
}

export function destroySmileDetector() {
	lastTimestamp = -1;
	if (faceLandmarker) {
		try {
			faceLandmarker.close();
		} catch {}
		faceLandmarker = null;
		initPromise = null;
	}
}
