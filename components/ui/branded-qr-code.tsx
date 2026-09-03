'use client';

import * as React from 'react';
import QRCode from 'qrcode';
import { Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BrandedQrCodeProps {
	value: string;
	size?: number;
	logoSrc?: string;
	logoSize?: number;
	className?: string;
	showDownload?: boolean;
	downloadFileName?: string;
}

export function BrandedQrCode({
	value,
	size = 220,
	logoSrc = '/icons/icon-192x192.png',
	logoSize = 52,
	className,
	showDownload = false,
	downloadFileName = 'open-smile-referral-qr.png',
}: BrandedQrCodeProps) {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const [downloaded, setDownloaded] = React.useState(false);
	const [isReady, setIsReady] = React.useState(false);

	React.useEffect(() => {
		if (!canvasRef.current || !value) return;

		let isMounted = true;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// High error correction level ('H') allows ~30% center coverage for logo without read errors
		QRCode.toCanvas(
			canvas,
			value,
			{
				width: size,
				margin: 2,
				errorCorrectionLevel: 'H',
				color: {
					dark: '#0f0f0f',
					light: '#ffffff',
				},
			},
			(err) => {
				if (err || !isMounted) return;

				const logo = new Image();
				logo.crossOrigin = 'anonymous';
				logo.onload = () => {
					if (!isMounted) return;

					const centerX = (canvas.width - logoSize) / 2;
					const centerY = (canvas.height - logoSize) / 2;
					const badgePadding = 5;
					const badgeX = centerX - badgePadding;
					const badgeY = centerY - badgePadding;
					const badgeSize = logoSize + badgePadding * 2;

					// Draw high-contrast clean backdrop for the logo badge
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize);

					// Neubrutalist 2px outline for center badge
					ctx.lineWidth = 2.5;
					ctx.strokeStyle = '#0f0f0f';
					ctx.strokeRect(badgeX, badgeY, badgeSize, badgeSize);

					// Draw the Open Smile brand logo in the center
					ctx.drawImage(logo, centerX, centerY, logoSize, logoSize);
					setIsReady(true);
				};
				logo.onerror = () => {
					if (isMounted) setIsReady(true);
				};
				logo.src = logoSrc;
			}
		);

		return () => {
			isMounted = false;
		};
	}, [value, size, logoSrc, logoSize]);

	const handleDownload = () => {
		if (!canvasRef.current) return;
		try {
			const link = document.createElement('a');
			link.download = downloadFileName;
			link.href = canvasRef.current.toDataURL('image/png');
			link.click();
			setDownloaded(true);
			setTimeout(() => setDownloaded(false), 2000);
		} catch {}
	};

	return (
		<div className={cn('flex flex-col items-center gap-3 w-full max-w-full', className)}>
			<div className="relative p-2.5 sm:p-3 bg-white rounded-xl border-[length:var(--border-width)] border-border shadow-brutal-sm overflow-hidden flex items-center justify-center">
				<canvas
					ref={canvasRef}
					width={size}
					height={size}
					className="max-w-full h-auto block rounded-lg"
					style={{ maxWidth: `${size}px`, width: '100%', height: 'auto', aspectRatio: '1/1' }}
				/>
				{!isReady && (
					<div className="absolute inset-0 bg-white/90 flex items-center justify-center">
						<div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
					</div>
				)}
			</div>

			{showDownload && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="w-full max-w-[240px] font-mono text-xs font-bold gap-1.5 cursor-pointer border-[length:var(--border-width)] border-border shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5"
					onClick={handleDownload}
				>
					{downloaded ? <Check className="size-3.5 text-success" /> : <Download className="size-3.5" />}
					<span>{downloaded ? 'Saved PNG!' : 'Download QR Image'}</span>
				</Button>
			)}
		</div>
	);
}
