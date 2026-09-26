import React from 'react';

export interface GumroadCoinProps {
	rx?: number;
	ry?: number;
	depth?: number;
	rotation?: number;
	size?: number;
	strokeWidth?: number;
	variant?: 'classic' | 'wink' | 'grin';
	className?: string;
	style?: React.CSSProperties;
}

export function GumroadCoin({
	rx = 70,
	ry = 42,
	depth = 24,
	rotation = 0,
	size,
	strokeWidth: customStrokeWidth,
	variant = 'classic',
	className,
	style,
}: GumroadCoinProps) {
	const strokeWidth = customStrokeWidth ?? Math.max(1, rx * 0.028);
	const eyeRadius = Math.max(1.8, rx * 0.09);
	const eyeOffsetX = rx * 0.32;
	const eyeOffsetY = rx * 0.19;
	const mouthWidth = rx * 0.4;
	const mouthDepth = rx * 0.38;
	const mouthOffsetY = rx * 0.08;
	const mouthStrokeWidth = Math.max(2, rx * 0.075);

	const sidePath = `M ${-rx} 0 L ${-rx} ${depth} A ${rx} ${ry} 0 0 0 ${rx} ${depth} L ${rx} 0 A ${rx} ${ry} 0 0 1 ${-rx} 0 Z`;
	const yAspect = ry / rx;

	const viewBoxSize = Math.max(rx, ry + depth) * 2 + strokeWidth * 4;
	const halfBox = viewBoxSize / 2;

	return (
		<div
			className={className}
			style={{
				display: 'inline-block',
				transform: `rotate(${rotation}deg)`,
				transformOrigin: 'center center',
				width: size ? `${size}px` : undefined,
				height: size ? `${size}px` : undefined,
				...style,
			}}>
			<svg
				width={size ?? viewBoxSize}
				height={size ?? viewBoxSize}
				viewBox={`${-halfBox} ${-halfBox + depth / 2} ${viewBoxSize} ${viewBoxSize}`}
				style={{ overflow: 'visible', display: 'block' }}
				aria-hidden="true">
				<path
					d={sidePath}
					fill="var(--coin-side, #D81B60)"
					stroke="var(--coin-stroke, #000000)"
					strokeWidth={strokeWidth}
					strokeLinejoin="round"
				/>

				<ellipse
					cx="0"
					cy="0"
					rx={rx}
					ry={ry}
					fill="var(--coin-face, #FF2D78)"
					stroke="var(--coin-stroke, #000000)"
					strokeWidth={strokeWidth}
				/>

				<g transform={`scale(1, ${yAspect})`}>
					{variant === 'wink' ? (
						<>
							<path
								d={`M ${-eyeOffsetX - eyeRadius} ${-eyeOffsetY} Q ${-eyeOffsetX} ${-eyeOffsetY - eyeRadius * 1.4} ${-eyeOffsetX + eyeRadius} ${-eyeOffsetY}`}
								fill="none"
								stroke="var(--coin-stroke, #000000)"
								strokeWidth={mouthStrokeWidth * 0.85}
								strokeLinecap="round"
							/>
							<circle
								cx={eyeOffsetX}
								cy={-eyeOffsetY}
								r={eyeRadius}
								fill="var(--coin-stroke, #000000)"
							/>
						</>
					) : (
						<>
							<circle
								cx={-eyeOffsetX}
								cy={-eyeOffsetY}
								r={eyeRadius}
								fill="var(--coin-stroke, #000000)"
							/>
							<circle
								cx={eyeOffsetX}
								cy={-eyeOffsetY}
								r={eyeRadius}
								fill="var(--coin-stroke, #000000)"
							/>
						</>
					)}

					{variant === 'grin' ? (
						<path
							d={`M ${-mouthWidth} ${mouthOffsetY} Q 0 ${mouthOffsetY} ${mouthWidth} ${mouthOffsetY} Q ${mouthWidth} ${mouthOffsetY + mouthDepth * 1.2} 0 ${mouthOffsetY + mouthDepth * 1.2} Q ${-mouthWidth} ${mouthOffsetY + mouthDepth * 1.2} ${-mouthWidth} ${mouthOffsetY} Z`}
							fill="var(--coin-stroke, #000000)"
						/>
					) : (
						<path
							d={`M ${-mouthWidth} ${mouthOffsetY} C ${-mouthWidth * 0.65} ${mouthOffsetY + mouthDepth}, ${mouthWidth * 0.65} ${mouthOffsetY + mouthDepth}, ${mouthWidth} ${mouthOffsetY}`}
							fill="none"
							stroke="var(--coin-stroke, #000000)"
							strokeWidth={mouthStrokeWidth}
							strokeLinecap="round"
						/>
					)}
				</g>
			</svg>
		</div>
	);
}
