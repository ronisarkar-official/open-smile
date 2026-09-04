import {
	FaceLandmarker,
	type NormalizedLandmark,
} from '@mediapipe/tasks-vision';

export interface MediaPipeDrawingSpec {
	enabled: boolean;
	showConnectors: boolean;
	connectionMode: 'contours' | 'tesselation' | 'both';
	connectionColor: string;
	connectionLineWidth: number;
	showLandmarks: boolean;
	landmarkColor: string;
	landmarkRadius: number;
	landmarkLineWidth?: number;
	opacity: number;
}

export const DEFAULT_DRAWING_SPEC: MediaPipeDrawingSpec = {
	enabled: true,
	showConnectors: true,
	connectionMode: 'contours',
	connectionColor: '#00FF00',
	connectionLineWidth: 1.5,
	showLandmarks: true,
	landmarkColor: '#FF0000',
	landmarkRadius: 1.5,
	landmarkLineWidth: 1,
	opacity: 0.9,
};

export function renderFaceDrawingShape(
	ctx: CanvasRenderingContext2D,
	landmarks: NormalizedLandmark[],
	spec: MediaPipeDrawingSpec = DEFAULT_DRAWING_SPEC,
) {
	if (!landmarks || landmarks.length === 0 || !spec.enabled) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		return;
	}

	const { width, height } = ctx.canvas;
	ctx.clearRect(0, 0, width, height);

	ctx.save();
	ctx.globalAlpha = Math.max(0.1, Math.min(1.0, spec.opacity ?? 0.9));

	if (spec.showConnectors) {
		const connectionsToDraw: { start: number; end: number }[] = [];

		if (spec.connectionMode === 'contours' || spec.connectionMode === 'both') {
			if (FaceLandmarker.FACE_LANDMARKS_CONTOURS) {
				connectionsToDraw.push(...FaceLandmarker.FACE_LANDMARKS_CONTOURS);
			}
		}

		if (spec.connectionMode === 'tesselation' || spec.connectionMode === 'both') {
			if (FaceLandmarker.FACE_LANDMARKS_TESSELATION) {
				connectionsToDraw.push(...FaceLandmarker.FACE_LANDMARKS_TESSELATION);
			}
		}

		if (connectionsToDraw.length > 0) {
			ctx.beginPath();
			ctx.strokeStyle = spec.connectionColor || '#00FF00';
			ctx.lineWidth = spec.connectionLineWidth || 1.5;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			for (let i = 0; i < connectionsToDraw.length; i++) {
				const conn = connectionsToDraw[i];
				const p1 = landmarks[conn.start];
				const p2 = landmarks[conn.end];
				if (p1 && p2) {
					ctx.moveTo(p1.x * width, p1.y * height);
					ctx.lineTo(p2.x * width, p2.y * height);
				}
			}
			ctx.stroke();
		}
	}

	if (spec.showLandmarks) {
		const radius = Math.max(0.5, spec.landmarkRadius || 1.5);
		ctx.fillStyle = spec.landmarkColor || '#FF0000';
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
	}

	ctx.restore();
}
