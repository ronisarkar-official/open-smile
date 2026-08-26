let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!audioCtx) {
		const AudioContextClass =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		if (AudioContextClass) {
			audioCtx = new AudioContextClass();
		}
	}
	if (audioCtx && audioCtx.state === 'suspended') {
		audioCtx.resume().catch(() => {});
	}
	return audioCtx;
}

export function playCountdownBeep(frequency = 520, isFinal = false) {
	try {
		const ctx = getAudioContext();
		if (!ctx) return;

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = isFinal ? 'triangle' : 'sine';
		osc.frequency.setValueAtTime(isFinal ? 880 : frequency, ctx.currentTime);

		gain.gain.setValueAtTime(0.12, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.25 : 0.12));

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start();
		osc.stop(ctx.currentTime + (isFinal ? 0.25 : 0.12));
	} catch {}
}

export function playShutterSound() {
	try {
		const ctx = getAudioContext();
		if (!ctx) return;

		const now = ctx.currentTime;

		const bufferSize = ctx.sampleRate * 0.08;
		const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) {
			data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
		}

		const noise = ctx.createBufferSource();
		noise.buffer = buffer;

		const filter = ctx.createBiquadFilter();
		filter.type = 'highpass';
		filter.frequency.setValueAtTime(1200, now);

		const noiseGain = ctx.createGain();
		noiseGain.gain.setValueAtTime(0.3, now);
		noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

		noise.connect(filter);
		filter.connect(noiseGain);
		noiseGain.connect(ctx.destination);

		noise.start(now);

		const osc = ctx.createOscillator();
		const oscGain = ctx.createGain();

		osc.type = 'triangle';
		osc.frequency.setValueAtTime(320, now + 0.04);
		osc.frequency.exponentialRampToValueAtTime(120, now + 0.14);

		oscGain.gain.setValueAtTime(0.2, now + 0.04);
		oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

		osc.connect(oscGain);
		oscGain.connect(ctx.destination);

		osc.start(now + 0.04);
		osc.stop(now + 0.15);
	} catch {}
}

export function playRewardChime() {
	try {
		const ctx = getAudioContext();
		if (!ctx) return;

		const now = ctx.currentTime;
		const notes = [523.25, 659.25, 783.99, 1046.5];

		notes.forEach((freq, index) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = 'sine';
			osc.frequency.setValueAtTime(freq, now + index * 0.07);

			gain.gain.setValueAtTime(0, now + index * 0.07);
			gain.gain.linearRampToValueAtTime(0.15, now + index * 0.07 + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.35);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(now + index * 0.07);
			osc.stop(now + index * 0.07 + 0.36);
		});
	} catch {}
}
