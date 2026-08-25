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
  const dimension = size ? (typeof size === 'number' ? `${size}px` : size) : undefined;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block shrink-0 select-none overflow-visible', className ?? 'size-5')}
      style={dimension ? { width: dimension, height: dimension, minWidth: dimension, minHeight: dimension } : undefined}
      aria-hidden="true"
      {...props}
    >
      {/* 3D Offset Hard Shadow (Gumroad Neubrutalism) */}
      <circle cx="13" cy="13" r="8.75" fill="#000000" />

      {/* Outer Coin Base */}
      <circle
        cx="11.5"
        cy="11.5"
        r="8.75"
        fill="#FFD23F"
        stroke="#000000"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Rim Bevel / Ridge */}
      <circle
        cx="11.5"
        cy="11.5"
        r="6.5"
        fill="#FFE169"
        stroke="#000000"
        strokeWidth="1.5"
      />

      {/* Top Left Coin Glint */}
      <path
        d="M8 6.5C9 5.8 10.2 5.5 11.5 5.5"
        stroke="#FFFFFF"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {variant === 'smile' && (
        <>
          {/* Eyes */}
          <circle cx="9.2" cy="10" r="1.1" fill="#000000" />
          <circle cx="13.8" cy="10" r="1.1" fill="#000000" />
          {/* Smile Arc */}
          <path
            d="M8.8 12.8C9.5 14.6 11 15.2 11.5 15.2C12 15.2 13.5 14.6 14.2 12.8"
            stroke="#000000"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </>
      )}

      {variant === 'star' && (
        <path
          d="M11.5 7.5L12.7 10.2L15.5 10.5L13.3 12.3L14 15L11.5 13.5L9 15L9.7 12.3L7.5 10.5L10.3 10.2L11.5 7.5Z"
          fill="#000000"
        />
      )}

      {variant === 'plain' && (
        <circle cx="11.5" cy="11.5" r="3" fill="#000000" opacity="0.15" />
      )}
    </svg>
  );
}

export function CoinBadge({
  amount,
  prefix,
  suffix,
  className,
  iconClassName,
  size = 'md',
}: {
  amount: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base sm:text-lg px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border-[2px] border-black bg-primary font-mono font-black text-black tabular-nums shadow-[2px_2px_0_#000]',
        sizeStyles[size],
        className
      )}
    >
      {prefix && <span>{prefix}</span>}
      <span>{typeof amount === 'number' ? amount.toLocaleString() : amount}</span>
      {suffix && <span>{suffix}</span>}
      <CoinIcon className={cn(iconSizes[size], iconClassName)} />
    </span>
  );
}
