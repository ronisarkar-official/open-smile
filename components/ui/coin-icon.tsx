import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CoinIconProps extends React.SVGProps<SVGSVGElement> {
	size?: number | string;
	variant?: 'smile' | 'star' | 'plain';
}

export function CoinIcon({
	className,
	size,
	variant = 'smile',
	...props
}: CoinIconProps) {
	const dimension =
		size ?
			typeof size === 'number' ?
				`${size}px`
			:	size
		:	undefined;

	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={cn(
				'inline-block shrink-0 select-none overflow-visible',
				className ?? 'size-5',
			)}
			style={
				dimension ?
					{
						width: dimension,
						height: dimension,
						minWidth: dimension,
						minHeight: dimension,
					}
				:	undefined
			}
			aria-hidden="true"
			{...props}>
			{/* =========================================================
          COIN DROP SHADOW
         ========================================================= */}
			<circle
				cx="12"
				cy="12.7"
				r="10"
				fill="#A16207"
			/>

			{/* =========================================================
          OUTER COIN
         ========================================================= */}
			<circle
				cx="12"
				cy="12"
				r="10"
				fill="#FACC15"
			/>

			{/* Outer rim highlight */}
			<circle
				cx="12"
				cy="12"
				r="9.35"
				fill="#FDE047"
			/>

			{/* Dark inner rim */}
			<circle
				cx="12"
				cy="12"
				r="8.15"
				fill="#D99A0B"
			/>

			{/* Inner coin surface */}
			<circle
				cx="12"
				cy="11.7"
				r="7.45"
				fill="#E9A812"
			/>

			{/* =========================================================
          COIN LIGHTING
         ========================================================= */}

			{/* Large curved highlight */}
			<path
				d="M5.1 8.1C6.35 5.65 8.6 4.35 11.1 3.95"
				stroke="#FFF3A3"
				strokeWidth="1.15"
				strokeLinecap="round"
			/>

			{/* Small secondary highlight */}
			<path
				d="M6.45 6.1C6.9 5.7 7.4 5.35 7.95 5.05"
				stroke="#FFFFFF"
				strokeWidth="0.65"
				strokeLinecap="round"
				opacity="0.65"
			/>

			{/* Bottom shine */}
			<path
				d="M6.1 17.2C7.65 19 9.65 19.65 12 19.65"
				stroke="#F8D34F"
				strokeWidth="0.7"
				strokeLinecap="round"
				opacity="0.7"
			/>

			{/* =========================================================
          CENTRAL EMBLEM
         ========================================================= */}

			{/* Emblem shadow */}
			<path
				d="
          M12 6.15
          C9.15 6.15 7.45 8.05 7.45 10.75
          C7.45 11.65 7.65 12.2 7.95 12.75
          C7.55 13.3 7.4 14.05 7.65 14.65
          C7.9 15.35 8.5 15.7 9.1 15.8
          L9.1 17
          C9.1 17.45 9.45 17.8 9.9 17.8
          H14.1
          C14.55 17.8 14.9 17.45 14.9 17
          V15.8
          C15.5 15.7 16.1 15.35 16.35 14.65
          C16.6 14.05 16.45 13.3 16.05 12.75
          C16.35 12.2 16.55 11.65 16.55 10.75
          C16.55 8.05 14.85 6.15 12 6.15Z
        "
				fill="#B77908"
				transform="translate(0 0.45)"
			/>

			{/* Main emblem */}
			<path
				d="
          M12 5.85
          C9.15 5.85 7.45 7.75 7.45 10.45
          C7.45 11.35 7.65 11.9 7.95 12.45
          C7.55 13 7.4 13.75 7.65 14.35
          C7.9 15.05 8.5 15.4 9.1 15.5
          L9.1 16.7
          C9.1 17.15 9.45 17.5 9.9 17.5
          H14.1
          C14.55 17.5 14.9 17.15 14.9 16.7
          V15.5
          C15.5 15.4 16.1 15.05 16.35 14.35
          C16.6 13.75 16.45 13 16.05 12.45
          C16.35 11.9 16.55 11.35 16.55 10.45
          C16.55 7.75 14.85 5.85 12 5.85Z
        "
				fill="#FFF01A"
			/>

			{/* Emblem top highlight */}
			<path
				d="
          M8.25 10.1
          C8.5 8.1 9.85 7 11.55 6.75
        "
				stroke="#FFF98A"
				strokeWidth="0.65"
				strokeLinecap="round"
				opacity="0.9"
			/>

			{/* =========================================================
          EMBLEM EYES
         ========================================================= */}

			<ellipse
				cx="9.95"
				cy="10.65"
				rx="0.82"
				ry="1.35"
				fill="#D99A0B"
			/>

			<ellipse
				cx="14.05"
				cy="10.65"
				rx="0.82"
				ry="1.35"
				fill="#D99A0B"
			/>


			{/* =========================================================
          VARIANTS
         ========================================================= */}

			{variant === 'smile' && (
				<path
					d="M10 13.65C10.55 14.3 11.2 14.6 12 14.6C12.8 14.6 13.45 14.3 14 13.65"
					stroke="#D99A0B"
					strokeWidth="0.75"
					strokeLinecap="round"
				/>
			)}

			{variant === 'star' && (
				<path
					d="
            M12 12.25
            L12.35 13.05
            L13.2 13.15
            L12.58 13.7
            L12.75 14.5
            L12 14.1
            L11.25 14.5
            L11.42 13.7
            L10.8 13.15
            L11.65 13.05
            Z
          "
					fill="#D99A0B"
				/>
			)}

			{/* =========================================================
          OUTER EDGE ACCENT
         ========================================================= */}

			<path
				d="M4.1 11.2C4.35 7.1 7.55 4 11.55 3.75"
				stroke="#FFF06A"
				strokeWidth="0.55"
				strokeLinecap="round"
			/>

			<path
				d="M15.8 20.1C18.65 18.7 20.4 15.8 20.55 12.55"
				stroke="#B77908"
				strokeWidth="0.45"
				strokeLinecap="round"
				opacity="0.5"
			/>
		</svg>
	);
}
