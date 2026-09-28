'use client';

import * as React from 'react';
import { Camera, ShieldCheck, Flame } from 'lucide-react';

export const GLOBALS_CSS_TOKENS = {
	background: '#faf8f5',
	foreground: '#0f0f0f',
	card: '#ffffff',
	cardForeground: '#0f0f0f',
	primary: '#FF2D78',
	secondary: '#7B61FF',
	muted: '#f0ece7',
	mutedForeground: '#57534e',
	accent: '#C6F135',
	destructive: '#EF4444',
	warning: '#FBBF24',
	border: '#0f0f0f',
	outline: '#0f0f0f',
} as const;

const FONT_MONO = '"Space Mono", ui-monospace, "Courier New", Courier, monospace';
const FONT_TITLE = 'Outfit, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function getThemeToken(name: string, fallback: string): string {
	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
		const val = getComputedStyle(document.documentElement)
			.getPropertyValue(name)
			.trim();
		if (val) return val;
	}
	return fallback;
}

export interface PhotoCardConfig {
	bgHex: string;
	accentHex: string;
	vibe: string;
	comment: string;
}

export function getCardConfig(
	score: number,
	customComment?: string,
): PhotoCardConfig {
	const primary = getThemeToken('--primary', GLOBALS_CSS_TOKENS.primary);
	const secondary = getThemeToken('--secondary', GLOBALS_CSS_TOKENS.secondary);
	const accent = getThemeToken('--accent', GLOBALS_CSS_TOKENS.accent);
	const warning = getThemeToken('--warning', GLOBALS_CSS_TOKENS.warning);

	if (score >= 85) {
		return {
			bgHex: warning,
			accentHex: primary,
			vibe: 'SUPERSTAR SMILE ✨',
			comment: customComment || 'Blinded the AI with pure joy!',
		};
	}
	if (score >= 70) {
		return {
			bgHex: accent,
			accentHex: secondary,
			vibe: 'GENUINE SMILE 😄',
			comment: customComment || 'Great energy & real smile!',
		};
	}
	return {
		bgHex: secondary,
		accentHex: warning,
		vibe: 'SMILE CHECK COMPLETE ⚡',
		comment: customComment || 'Daily smile check unlocked!',
	};
}

export interface PhotoCardProps {
	imageSrc: string | null;
	score: number;
	userName?: string;
	comment?: string;
	className?: string;
}

export function PhotoCard({
	imageSrc,
	score,
	userName,
	comment,
	className,
}: PhotoCardProps) {
	const cardConfig = React.useMemo(
		() => getCardConfig(score, comment),
		[score, comment],
	);

	return (
		<div
			style={{ backgroundColor: cardConfig.bgHex }}
			className={`relative w-full max-w-68 mx-auto aspect-4/5 rounded-2xl border-2 border-border p-3.5 shadow-brutal flex flex-col justify-between ${className || ''}`}>
			<div className="flex items-center justify-between border-2 border-border bg-card px-3 py-2 rounded-xl shadow-brutal-xs">
				<span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-foreground">
					OPEN SMILE
				</span>
				<span
					style={{ backgroundColor: cardConfig.accentHex }}
					className="font-mono text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-lg border-2 border-border text-foreground">
					{score}/100
				</span>
			</div>

			<div className="relative my-2.5 aspect-4/3 w-full overflow-hidden rounded-xl border-2 border-border bg-muted">
				{imageSrc ?
					<>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={imageSrc}
							alt="Smile card"
							className="size-full object-cover"
						/>
						<div
							style={{ backgroundColor: cardConfig.accentHex }}
							className="absolute top-2.5 left-2.5 -rotate-2 border-2 border-border px-2.5 py-1 rounded-md font-mono text-[11px] sm:text-xs font-black uppercase text-foreground shadow-brutal-xs truncate max-w-[90%] flex items-center gap-1.5">
							<ShieldCheck className="size-3.5 inline shrink-0" strokeWidth={2.5} />
							<span>VERIFIED</span>
						</div>
					</>
				:	<div className="flex size-full items-center justify-center font-mono text-xs">
						<Camera className="size-6 text-muted-foreground" />
					</div>
				}
			</div>

			<div className="rounded-xl border-2 border-border bg-card/95 p-3 shadow-brutal-xs text-left">
				<p className="font-title text-sm sm:text-base font-black line-clamp-1 text-foreground">
					&ldquo;{cardConfig.comment}&rdquo;
				</p>
				<div className="flex items-center justify-between mt-1.5 font-mono text-[11px] sm:text-xs text-muted-foreground uppercase">
					<span>{userName || 'SMILER'}</span>
					<span className="flex items-center gap-1 text-destructive font-black">
						<Flame className="size-3.5 text-destructive" /> 100% GENUINE
					</span>
				</div>
			</div>
		</div>
	);
}

export const PhotoCardCanvas = PhotoCard;

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
) {
	if (typeof ctx.roundRect === 'function') {
		ctx.beginPath();
		ctx.roundRect(x, y, width, height, radius);
		return;
	}
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

function drawShieldCheckIcon(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number,
	color: string,
) {
	ctx.save();
	ctx.translate(x, y);
	ctx.strokeStyle = color;
	ctx.fillStyle = 'transparent';
	ctx.lineWidth = 2;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	const scale = size / 24;
	ctx.scale(scale, scale);

	ctx.beginPath();
	ctx.moveTo(12, 22);
	ctx.bezierCurveTo(15, 20, 20, 16, 20, 12);
	ctx.lineTo(20, 5);
	ctx.lineTo(12, 2);
	ctx.lineTo(4, 5);
	ctx.lineTo(4, 12);
	ctx.bezierCurveTo(4, 16, 9, 20, 12, 22);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(8.5, 12);
	ctx.lineTo(11, 14.5);
	ctx.lineTo(15.5, 9.5);
	ctx.stroke();

	ctx.restore();
}

function drawFlameIcon(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number,
	color: string,
) {
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	const scale = size / 24;
	ctx.scale(scale, scale);

	if (typeof Path2D !== 'undefined') {
		const p = new Path2D(
			'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
		);
		ctx.fill(p);
	} else {
		ctx.beginPath();
		ctx.arc(12, 14, 7, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export async function renderPhotoCardCanvas({
	imageSrc,
	score,
	userName,
	comment,
}: {
	imageSrc: string | null;
	score: number;
	userName?: string;
	comment?: string;
}): Promise<Blob | null> {
	if (typeof document !== 'undefined' && document.fonts) {
		try {
			await document.fonts.ready;
		} catch {}
	}

	const canvasBg = getThemeToken('--background', GLOBALS_CSS_TOKENS.background);
	const outlineColor = getThemeToken('--outline', GLOBALS_CSS_TOKENS.outline);
	const foregroundColor = getThemeToken(
		'--foreground',
		GLOBALS_CSS_TOKENS.foreground,
	);
	const cardBg = getThemeToken('--card', GLOBALS_CSS_TOKENS.card);
	const mutedBg = getThemeToken('--muted', GLOBALS_CSS_TOKENS.muted);
	const mutedForeground = getThemeToken(
		'--muted-foreground',
		GLOBALS_CSS_TOKENS.mutedForeground,
	);
	const destructiveColor = getThemeToken(
		'--destructive',
		GLOBALS_CSS_TOKENS.destructive,
	);

	const cardConfig = getCardConfig(score, comment);
	const canvas = document.createElement('canvas');

	const canvasW = 520;
	const canvasH = 618;
	canvas.width = canvasW;
	canvas.height = canvasH;

	const ctx = canvas.getContext('2d');
	if (!ctx) return null;

	ctx.fillStyle = canvasBg;
	ctx.fillRect(0, 0, canvasW, canvasH);

	const cardX = 14;
	const cardY = 12;
	const cardW = 488;
	const cardH = 588;
	const cardRadius = 18;
	const shadowOffset = 4;

	drawRoundedRect(
		ctx,
		cardX + shadowOffset,
		cardY + shadowOffset,
		cardW,
		cardH,
		cardRadius,
	);
	ctx.fillStyle = outlineColor;
	ctx.fill();

	drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
	ctx.fillStyle = cardConfig.bgHex;
	ctx.fill();
	ctx.strokeStyle = outlineColor;
	ctx.lineWidth = 2;
	ctx.stroke();

	const pad = 16;
	const contentX = cardX + pad;
	const contentY = cardY + pad;
	const contentW = cardW - 2 * pad;

	const topBarY = contentY;
	const topBarH = 56;
	const topBarRadius = 10;

	drawRoundedRect(ctx, contentX, topBarY, contentW, topBarH, topBarRadius);
	ctx.fillStyle = cardBg;
	ctx.fill();
	ctx.strokeStyle = outlineColor;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.fillStyle = foregroundColor;
	ctx.font = `bold 20px ${FONT_MONO}`;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';
	ctx.fillText('OPEN SMILE', contentX + 16, topBarY + topBarH / 2);

	const badgeW = 104;
	const badgeH = 38;
	const badgeRadius = 8;
	const badgeX = contentX + contentW - badgeW - 10;
	const badgeY = topBarY + (topBarH - badgeH) / 2;

	drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeRadius);
	ctx.fillStyle = cardConfig.accentHex;
	ctx.fill();
	ctx.strokeStyle = outlineColor;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.fillStyle = foregroundColor;
	ctx.font = `bold 18px ${FONT_MONO}`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(`${score}/100`, badgeX + badgeW / 2, badgeY + badgeH / 2);

	const gap = 14;
	const photoX = contentX;
	const photoY = topBarY + topBarH + gap;
	const photoW = contentW;
	const photoH = 368;
	const photoRadius = 14;

	ctx.save();
	drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoRadius);
	ctx.fillStyle = mutedBg;
	ctx.fill();
	ctx.clip();

	if (imageSrc) {
		try {
			const img = new Image();
			if (!imageSrc.startsWith('data:')) {
				img.crossOrigin = 'anonymous';
			}
			img.src = imageSrc;
			await new Promise((resolve, reject) => {
				if (img.complete && img.naturalWidth !== 0) {
					resolve(null);
				} else {
					img.onload = () => resolve(null);
					img.onerror = reject;
				}
			});

			const imgRatio = img.width / img.height;
			const boxRatio = photoW / photoH;
			let sWidth = img.width;
			let sHeight = img.height;
			let sx = 0;
			let sy = 0;

			if (imgRatio > boxRatio) {
				sWidth = img.height * boxRatio;
				sx = (img.width - sWidth) / 2;
			} else {
				sHeight = img.width / boxRatio;
				sy = (img.height - sHeight) / 2;
			}

			ctx.drawImage(
				img,
				sx,
				sy,
				sWidth,
				sHeight,
				photoX,
				photoY,
				photoW,
				photoH,
			);
		} catch {}
	}
	ctx.restore();

	drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoRadius);
	ctx.strokeStyle = outlineColor;
	ctx.lineWidth = 2;
	ctx.stroke();

	const stickerW = 144;
	const stickerH = 38;
	const stickerRadius = 6;
	const stickerShadow = 3;
	const stickerX = photoX + 12;
	const stickerY = photoY + 12;

	ctx.save();
	ctx.translate(stickerX + stickerW / 2, stickerY + stickerH / 2);
	ctx.rotate((-2 * Math.PI) / 180);
	const halfW = -stickerW / 2;
	const halfH = -stickerH / 2;

	drawRoundedRect(
		ctx,
		halfW + stickerShadow,
		halfH + stickerShadow,
		stickerW,
		stickerH,
		stickerRadius,
	);
	ctx.fillStyle = outlineColor;
	ctx.fill();

	drawRoundedRect(ctx, halfW, halfH, stickerW, stickerH, stickerRadius);
	ctx.fillStyle = cardConfig.accentHex;
	ctx.fill();
	ctx.strokeStyle = outlineColor;
	ctx.lineWidth = 2;
	ctx.stroke();

	drawShieldCheckIcon(
		ctx,
		halfW + 12,
		halfH + (stickerH - 20) / 2,
		20,
		outlineColor,
	);

	ctx.fillStyle = foregroundColor;
	ctx.font = `bold 16px ${FONT_MONO}`;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';
	ctx.fillText('VERIFIED', halfW + 38, halfH + stickerH / 2);
	ctx.restore();

	const bottomX = contentX;
	const bottomY = photoY + photoH + gap;
	const bottomW = contentW;
	const bottomH = 104;
	const bottomRadius = 14;
	const bottomShadow = 3;

	drawRoundedRect(
		ctx,
		bottomX + bottomShadow,
		bottomY + bottomShadow,
		bottomW,
		bottomH,
		bottomRadius,
	);
	ctx.fillStyle = outlineColor;
	ctx.fill();

	drawRoundedRect(ctx, bottomX, bottomY, bottomW, bottomH, bottomRadius);
	ctx.fillStyle = cardBg;
	ctx.fill();
	ctx.strokeStyle = outlineColor;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.fillStyle = foregroundColor;
	ctx.font = `bold 20px ${FONT_TITLE}`;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';

	const rawComment = (cardConfig.comment || '')
		.replace(/^["“”']+|["“”']+$/g, '')
		.trim();
	const quote = `“${rawComment}”`;
	let displayQuote = quote;
	const maxQuoteW = bottomW - 36;
	if (ctx.measureText(displayQuote).width > maxQuoteW) {
		while (
			displayQuote.length > 4 &&
			ctx.measureText(displayQuote + '...').width > maxQuoteW
		) {
			displayQuote = displayQuote.slice(0, -1);
		}
		displayQuote = displayQuote + '...';
	}
	ctx.fillText(displayQuote, bottomX + 18, bottomY + 20);

	const bottomLineY = bottomY + bottomH - 22;

	ctx.font = `bold 14px ${FONT_MONO}`;
	ctx.fillStyle = mutedForeground;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';
	ctx.fillText(
		userName ? userName.toUpperCase() : 'SMILER',
		bottomX + 18,
		bottomLineY,
	);

	const genuineText = '100% GENUINE';
	const textRightX = bottomX + bottomW - 18;

	ctx.font = `bold 14px ${FONT_MONO}`;
	ctx.fillStyle = destructiveColor;
	ctx.textAlign = 'right';
	ctx.textBaseline = 'middle';
	ctx.fillText(genuineText, textRightX, bottomLineY);

	const genuineW = ctx.measureText(genuineText).width;
	drawFlameIcon(
		ctx,
		textRightX - genuineW - 20,
		bottomLineY - 8,
		16,
		destructiveColor,
	);

	return new Promise<Blob | null>((resolve) => {
		canvas.toBlob((blob) => resolve(blob), 'image/png');
	});
}

export const createPhotoCardBlob = renderPhotoCardCanvas;
