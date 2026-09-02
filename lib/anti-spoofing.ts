import type { SmileDetectionResult } from '@/lib/smile-detection';

export interface LivenessState {
	isLiveVerified: boolean;
	hasBlinked: boolean;
	hasDynamicMovement: boolean;
	blinkConfidence: number;
	instruction: string;
	statusMessage: string;
	isStaticDetected?: boolean;
}

export class LivenessDetector {
	private eyeClosedStartTime: number | null = null;
	private hasObservedBlink: boolean = false;
	private verifiedAt: number | null = null;
	private lastFaceSeenTime: number = 0;
	private lastGeometry: { centerX: number; centerY: number; width: number; height: number } | null = null;
	private recentScores: number[] = [];
	private recentBlinks: number[] = [];
	private minFramesNeeded: number = 10;
	private blinkThreshold: number = 0.42;
	private eyeOpenThreshold: number = 0.22;
	private maxVerificationAgeMs: number = 12000;
	private isStaticDetected: boolean = false;

	public reset(): void {
		this.eyeClosedStartTime = null;
		this.hasObservedBlink = false;
		this.verifiedAt = null;
		this.lastFaceSeenTime = 0;
		this.lastGeometry = null;
		this.recentScores = [];
		this.recentBlinks = [];
		this.isStaticDetected = false;
	}

	public isVerified(): boolean {
		if (!this.hasObservedBlink || !this.verifiedAt) return false;
		if (this.isStaticDetected) return false;
		return Date.now() - this.verifiedAt <= this.maxVerificationAgeMs;
	}

	public processFrame(result: SmileDetectionResult | null): LivenessState {
		const now = Date.now();

		if (!result || !result.hasFace) {
			if (this.lastFaceSeenTime > 0 && now - this.lastFaceSeenTime > 1500) {
				this.hasObservedBlink = false;
				this.verifiedAt = null;
				this.lastGeometry = null;
			}
			return {
				isLiveVerified: false,
				hasBlinked: this.isVerified(),
				hasDynamicMovement: false,
				blinkConfidence: 0,
				instruction: 'Position face in frame',
				statusMessage: 'No face detected',
				isStaticDetected: false,
			};
		}

		if (this.lastFaceSeenTime > 0 && now - this.lastFaceSeenTime > 1500) {
			this.hasObservedBlink = false;
			this.verifiedAt = null;
		}
		this.lastFaceSeenTime = now;

		if (result.faceGeometry) {
			if (this.lastGeometry) {
				const dx = Math.abs(result.faceGeometry.centerX - this.lastGeometry.centerX);
				const dy = Math.abs(result.faceGeometry.centerY - this.lastGeometry.centerY);
				if (dx > 0.35 || dy > 0.35) {
					this.hasObservedBlink = false;
					this.verifiedAt = null;
					this.isStaticDetected = false;
				}
			}
			this.lastGeometry = result.faceGeometry;
		}

		const liveness = result.liveness;
		const avgBlink = (liveness.eyeBlinkLeft + liveness.eyeBlinkRight) / 2;

		this.recentScores.push(result.score);
		this.recentBlinks.push(avgBlink);
		if (this.recentScores.length > 20) {
			this.recentScores.shift();
			this.recentBlinks.shift();
		}

		if (avgBlink >= this.blinkThreshold) {
			if (this.eyeClosedStartTime === null) {
				this.eyeClosedStartTime = now;
			}
		} else if (avgBlink <= this.eyeOpenThreshold && this.eyeClosedStartTime !== null) {
			const closureDuration = now - this.eyeClosedStartTime;
			if (closureDuration >= 70 && closureDuration <= 700) {
				this.hasObservedBlink = true;
				this.verifiedAt = now;
				this.isStaticDetected = false;
			}
			this.eyeClosedStartTime = null;
		}

		if (this.verifiedAt && now - this.verifiedAt > this.maxVerificationAgeMs) {
			this.hasObservedBlink = false;
			this.verifiedAt = null;
		}

		if (!this.hasObservedBlink && this.recentScores.length >= this.minFramesNeeded) {
			const scoreVariance = Math.max(...this.recentScores) - Math.min(...this.recentScores);
			const blinkVariance = Math.max(...this.recentBlinks) - Math.min(...this.recentBlinks);
			if (result.score >= 70 && scoreVariance < 0.1 && blinkVariance < 0.0005) {
				this.isStaticDetected = true;
			}
		}

		const isLiveVerified = this.isVerified();

		let instruction = 'Blink naturally to verify live presence';
		let statusMessage = 'Verifying live human...';

		if (this.isStaticDetected) {
			instruction = 'Static image detected — real smile required';
			statusMessage = 'Static Photo Detected';
		} else if (isLiveVerified) {
			instruction = 'Smile wide to capture! 😄';
			statusMessage = 'Live Face Verified ✓';
		} else {
			instruction = 'Blink naturally to verify live presence';
			statusMessage = 'Blink to verify';
		}

		return {
			isLiveVerified,
			hasBlinked: this.hasObservedBlink,
			hasDynamicMovement: true,
			blinkConfidence: avgBlink,
			instruction,
			statusMessage,
			isStaticDetected: this.isStaticDetected,
		};
	}
}
