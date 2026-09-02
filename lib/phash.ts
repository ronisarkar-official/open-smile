/**
 * Client-Side Perceptual Hash (dHash - Difference Hash)
 *
 * Computes a 64-bit gradient difference hash by downsampling the frame
 * to 9x8 grayscale and comparing adjacent pixels (left > right).
 * Returns a 16-character hexadecimal string compatible with Hamming distance checks.
 */

export async function generatePHash(imageSource: string | HTMLVideoElement | HTMLCanvasElement): Promise<string> {
	if (typeof window === 'undefined') return '';

	return new Promise((resolve) => {
		const canvas = document.createElement('canvas');
		canvas.width = 9;
		canvas.height = 8;
		const ctx = canvas.getContext('2d', { willReadFrequently: true });

		if (!ctx) {
			resolve(fallbackRandomHash());
			return;
		}

		const processImage = (img: CanvasImageSource) => {
			try {
				ctx.drawImage(img, 0, 0, 9, 8);
				const imgData = ctx.getImageData(0, 0, 9, 8);
				const data = imgData.data;

				// Convert to 9x8 grayscale matrix
				const gray: number[][] = [];
				for (let y = 0; y < 8; y++) {
					gray[y] = [];
					for (let x = 0; x < 9; x++) {
						const i = (y * 9 + x) * 4;
						// Standard luminance weights: 0.299 R + 0.587 G + 0.114 B
						const luma = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
						gray[y][x] = luma;
					}
				}

				// Compute 64-bit difference hash (left pixel > right pixel)
				let hashBits = '';
				for (let y = 0; y < 8; y++) {
					for (let x = 0; x < 8; x++) {
						hashBits += gray[y][x] > gray[y][x + 1] ? '1' : '0';
					}
				}

				// Convert 64 binary bits to 16 hex characters
				let hexHash = '';
				for (let i = 0; i < 64; i += 4) {
					const nibble = hashBits.slice(i, i + 4);
					hexHash += parseInt(nibble, 2).toString(16);
				}

				resolve(hexHash);
			} catch {
				resolve(fallbackRandomHash());
			}
		};

		if (typeof imageSource === 'string') {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => processImage(img);
			img.onerror = () => resolve(fallbackRandomHash());
			img.src = imageSource;
		} else {
			processImage(imageSource);
		}
	});
}

function fallbackRandomHash(): string {
	const chars = '0123456789abcdef';
	let res = '';
	for (let i = 0; i < 16; i++) {
		res += chars[Math.floor(Math.random() * chars.length)];
	}
	return res;
}
