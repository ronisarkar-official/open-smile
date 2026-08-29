'use client';

import {
	FaceLandmarker,
	FilesetResolver,
	type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';

if (typeof window !== 'undefined') {
	const originalConsoleError = console.error;
	console.error = (...args: unknown[]) => {
		const firstArg = typeof args[0] === 'string' ? args[0] : '';
		if (
			firstArg.includes('Created TensorFlow Lite XNNPACK delegate') ||
			firstArg.includes('Sets FaceBlendshapesGraph') ||
			firstArg.includes('OpenGL error checking is disabled')
		) {
			return;
		}
		originalConsoleError.apply(console, args);
	};
}

let faceLandmarker: FaceLandmarker | null = null;
let initPromise: Promise<FaceLandmarker> | null = null;

const WASM_LOCAL_PATH = '/models';
const WASM_CDN_PATH =
	'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_LOCAL_PATH = '/models/face_landmarker.task';
const MODEL_CDN_PATH =
	'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

async function createLandmarker(
	vision: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>,
	modelPath: string,
	delegate: 'GPU' | 'CPU',
): Promise<FaceLandmarker> {
	return FaceLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: modelPath,
			delegate,
		},
		runningMode: 'VIDEO',
		numFaces: 1,
		minFaceDetectionConfidence: 0.4,
		minFacePresenceConfidence: 0.4,
		minTrackingConfidence: 0.4,
		outputFaceBlendshapes: true,
		outputFacialTransformationMatrixes: false,
	});
}

export async function initSmileDetector(): Promise<FaceLandmarker> {
	if (faceLandmarker) return faceLandmarker;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		try {
			let vision: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;
			try {
				vision = await FilesetResolver.forVisionTasks(WASM_LOCAL_PATH);
			} catch (wasmErr) {
				console.warn(
					'[OpenSmile] Local WASM files failed, falling back to CDN:',
					wasmErr,
				);
				vision = await FilesetResolver.forVisionTasks(WASM_CDN_PATH);
			}

			let landmarker: FaceLandmarker | null = null;

			try {
				landmarker = await createLandmarker(vision, MODEL_LOCAL_PATH, 'GPU');
			} catch (gpuErr) {
				console.warn(
					'[OpenSmile] GPU delegate failed with local model, trying CPU:',
					gpuErr,
				);
				try {
					landmarker = await createLandmarker(vision, MODEL_LOCAL_PATH, 'CPU');
				} catch (cpuErr) {
					console.warn(
						'[OpenSmile] Local model failed, trying CDN model with CPU:',
						cpuErr,
					);
					landmarker = await createLandmarker(vision, MODEL_CDN_PATH, 'CPU');
				}
			}

			faceLandmarker = landmarker;
			return faceLandmarker;
		} catch (err) {
			initPromise = null;
			throw err;
		}
	})();

	return initPromise;
}

const WEIGHTS = {
	mouthSmileAvgVsMax: { avg: 0.75, max: 0.25 },
	blendshapeSmile: 0.65,
	eyeSquint: 0.25,
	mouthDimple: 0.1,
	openMouthBonus: { maxBonus: 0.12, jawOpenThreshold: 0.12 },
	blendshapeVsGeometry: { blendshape: 0.85, geometry: 0.15 },
	geometry: { width: 0.55, lift: 0.45 },
	normalize: { floor: 0.1, ceiling: 0.82, curve: 1.35 },
	blinkThreshold: 0.5,
} as const;

export interface SmileDetectionResult {
	hasFace: boolean;
	score: number;
	blendshapes: Record<string, number>;
	liveness: {
		blinked: boolean;
		eyeBlinkLeft: number;
		eyeBlinkRight: number;
	};
}

function distance(
	a: { x: number; y: number },
	b: { x: number; y: number },
): number {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function computeSmileScore(
	result: FaceLandmarkerResult,
): SmileDetectionResult | null {
	if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
		return null;
	}

	const landmarks = result.faceLandmarks[0];
	if (!landmarks || landmarks.length === 0) {
		return null;
	}

	const blendshapesList = result.faceBlendshapes?.[0]?.categories ?? [];

	let mouthSmileLeft = 0;
	let mouthSmileRight = 0;
	let eyeSquintLeft = 0;
	let eyeSquintRight = 0;
	let mouthDimpleLeft = 0;
	let mouthDimpleRight = 0;
	let jawOpen = 0;
	let eyeBlinkLeft = 0;
	let eyeBlinkRight = 0;

	for (let i = 0; i < blendshapesList.length; i++) {
		const bs = blendshapesList[i];
		switch (bs.categoryName) {
			case 'mouthSmileLeft':
				mouthSmileLeft = bs.score;
				break;
			case 'mouthSmileRight':
				mouthSmileRight = bs.score;
				break;
			case 'eyeSquintLeft':
				eyeSquintLeft = bs.score;
				break;
			case 'eyeSquintRight':
				eyeSquintRight = bs.score;
				break;
			case 'mouthDimpleLeft':
				mouthDimpleLeft = bs.score;
				break;
			case 'mouthDimpleRight':
				mouthDimpleRight = bs.score;
				break;
			case 'jawOpen':
				jawOpen = bs.score;
				break;
			case 'eyeBlinkLeft':
				eyeBlinkLeft = bs.score;
				break;
			case 'eyeBlinkRight':
				eyeBlinkRight = bs.score;
				break;
		}
	}

	const maxSmile = Math.max(mouthSmileLeft, mouthSmileRight);
	const avgSmile = (mouthSmileLeft + mouthSmileRight) / 2;
	const { avg, max } = WEIGHTS.mouthSmileAvgVsMax;
	const mouthSmile = avgSmile * avg + maxSmile * max;

	const eyeSquint = (eyeSquintLeft + eyeSquintRight) / 2;
	const mouthDimple = (mouthDimpleLeft + mouthDimpleRight) / 2;

	const blendshapeSmile =
		mouthSmile * WEIGHTS.blendshapeSmile +
		eyeSquint * WEIGHTS.eyeSquint +
		mouthDimple * WEIGHTS.mouthDimple;

	const { maxBonus, jawOpenThreshold } = WEIGHTS.openMouthBonus;
	const openSmileBonus =
		jawOpen > jawOpenThreshold ?
			Math.min(maxBonus, jawOpen * mouthSmile * eyeSquint * 0.5)
		:	0;
	const totalBlendshape = blendshapeSmile + openSmileBonus;

	let geometryScore = 0;
	const mouthLeft = landmarks[61];
	const mouthRight = landmarks[291];
	const upperLip = landmarks[13];
	const lowerLip = landmarks[14];
	const leftEyeOuter = landmarks[33];
	const rightEyeOuter = landmarks[263];

	if (
		mouthLeft &&
		mouthRight &&
		upperLip &&
		lowerLip &&
		leftEyeOuter &&
		rightEyeOuter
	) {
		const eyeDistance = distance(leftEyeOuter, rightEyeOuter);
		const mouthWidth = distance(mouthLeft, mouthRight);
		const widthRatio = eyeDistance > 0 ? mouthWidth / eyeDistance : 0;
		const widthScore = Math.max(0, Math.min(1, (widthRatio - 0.7) / 0.3));

		const mouthCenterY = (upperLip.y + lowerLip.y) / 2;
		const cornerAvgY = (mouthLeft.y + mouthRight.y) / 2;
		const cornerElevation =
			eyeDistance > 0 ? (mouthCenterY - cornerAvgY) / eyeDistance : 0;
		const liftScore = Math.max(0, Math.min(1, cornerElevation * 10));

		geometryScore =
			widthScore * WEIGHTS.geometry.width + liftScore * WEIGHTS.geometry.lift;
	}

	let rawScore: number;
	if (blendshapesList.length > 0) {
		const { blendshape, geometry } = WEIGHTS.blendshapeVsGeometry;
		rawScore = totalBlendshape * blendshape + geometryScore * geometry;
	} else {
		rawScore = geometryScore;
	}

	const { floor, ceiling, curve } = WEIGHTS.normalize;
	const normalized = Math.max(
		0,
		Math.min(1, (rawScore - floor) / (ceiling - floor)),
	);
	const score = Math.round(Math.pow(normalized, curve) * 100);

	return {
		hasFace: true,
		score,
		blendshapes: {
			mouthSmileLeft,
			mouthSmileRight,
			eyeSquintLeft,
			eyeSquintRight,
			mouthDimpleLeft,
			mouthDimpleRight,
			jawOpen,
		},
		liveness: {
			blinked:
				eyeBlinkLeft > WEIGHTS.blinkThreshold ||
				eyeBlinkRight > WEIGHTS.blinkThreshold,
			eyeBlinkLeft,
			eyeBlinkRight,
		},
	};
}

let lastTimestamp = -1;

export function detectSmile(
	detector: FaceLandmarker,
	video: HTMLVideoElement,
	timestampMs: number,
): SmileDetectionResult | null {
	if (
		video.readyState < 2 ||
		video.paused ||
		video.ended ||
		video.videoWidth === 0
	) {
		return null;
	}

	const currentTimestamp = Math.max(timestampMs, lastTimestamp + 1);
	lastTimestamp = currentTimestamp;

	try {
		const result = detector.detectForVideo(video, currentTimestamp);
		return computeSmileScore(result);
	} catch {
		return null;
	}
}

export function destroySmileDetector() {
	lastTimestamp = -1;
	if (faceLandmarker) {
		try {
			faceLandmarker.close();
		} catch (err) {
			console.warn('[OpenSmile] Error closing FaceLandmarker:', err);
		}
		faceLandmarker = null;
		initPromise = null;
	}
}
