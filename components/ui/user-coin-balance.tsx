'use client';

import * as React from 'react';
import Link from 'next/link';
import { CoinIcon } from '@/components/ui/coin-icon';
import { cn } from '@/lib/utils';

export const COIN_BALANCE_EVENT = 'open-smile:coin-balance-updated';

/**
 * Dispatch an event to notify all coin components across the app to refresh or set balance.
 */
export function emitCoinBalanceUpdate(newBalance?: number) {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(
			new CustomEvent(COIN_BALANCE_EVENT, {
				detail: { balance: newBalance },
			})
		);
	}
}

/**
 * Hook to retrieve and sync the live user coin balance with SSR hydration safety.
 */
export function useUserCoins(initialAmount?: number) {
	const [balance, setBalance] = React.useState<number | null>(initialAmount ?? null);
	const [isMounted, setIsMounted] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const fetchBalance = React.useCallback(async () => {
		try {
			setIsLoading(true);
			let res = await fetch('/api/v1/user/balance', {
				cache: 'no-store',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
				},
			});
			if (!res.ok) {
				res = await fetch('/api/user/balance', {
					cache: 'no-store',
					headers: {
						'Cache-Control': 'no-cache',
						Pragma: 'no-cache',
					},
				});
			}
			if (res.ok) {
				const data = await res.json();
				if (typeof data.balance === 'number') {
					setBalance(data.balance);
				}
			}
		} catch {
			// fallback stays active on error
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		setIsMounted(true);
		fetchBalance();

		const handleUpdate = (e: Event) => {
			const customEvent = e as CustomEvent<{ balance?: number }>;
			if (typeof customEvent.detail?.balance === 'number') {
				setBalance(customEvent.detail.balance);
			} else {
				fetchBalance();
			}
		};

		window.addEventListener(COIN_BALANCE_EVENT, handleUpdate);
		return () => {
			window.removeEventListener(COIN_BALANCE_EVENT, handleUpdate);
		};
	}, [fetchBalance]);

	return {
		balance: balance ?? 0,
		isLoading: !isMounted || (isLoading && balance === null),
		isMounted,
		refetch: fetchBalance,
		setBalance,
	};
}

export interface UserCoinBalanceProps {
	/** Optional manual coin amount override */
	amount?: number;
	/** Display layout variant: 'text' (default, safe in links), 'vertical', 'horizontal', 'badge' */
	variant?: 'text' | 'vertical' | 'horizontal' | 'badge';
	/** Size variant */
	size?: 'sm' | 'md' | 'lg';
	/** Custom class for CoinIcon (when variant includes icon) */
	iconClassName?: string;
	/** Optional target destination (will only wrap in Link if provided) */
	href?: string;
	/** Extra className for outer wrapper/text */
	className?: string;
	/** Optional prefix text */
	prefix?: string;
	/** Optional suffix text */
	suffix?: string;
}

/**
 * Reusable user coin balance component.
 * Displays the authenticated user's live coin balance anywhere across the app.
 * By default renders a pure text span (safe inside links or custom containers) with skeleton loading.
 */
export function UserCoinBalance({
	amount: propAmount,
	variant = 'text',
	size = 'md',
	iconClassName,
	href,
	className,
	prefix = '',
	suffix = '',
}: UserCoinBalanceProps) {
	const { balance: liveBalance, isMounted, isLoading } = useUserCoins(propAmount);
	const amount = propAmount ?? liveBalance;
	const isPending = !isMounted || (isLoading && propAmount === undefined);
	const formattedAmount = amount.toLocaleString();

	// Default: pure text span for coin number (safe to place anywhere, including inside <Link> / <a> tags)
	if (variant === 'text') {
		if (isPending) {
			return (
				<span
					className={cn(
						'inline-block h-[1em] w-7 animate-pulse align-middle rounded-xs bg-muted-foreground/20',
						className
					)}
					aria-hidden="true"
				/>
			);
		}

		return (
			<span className={cn('tabular-nums', className)}>
				{prefix}
				{formattedAmount}
				{suffix}
			</span>
		);
	}

	// Vertical layout: Coin on top, amount underneath
	if (variant === 'vertical') {
		const iconSizes = {
			sm: 'size-6',
			md: 'size-8',
			lg: 'size-10',
		};

		const content = (
			<div
				className={cn(
					'group flex flex-col items-center justify-center select-none text-center',
					href && 'cursor-pointer transition-transform duration-150 active:scale-95',
					className
				)}
				title={`${formattedAmount} Coins`}
			>
				<CoinIcon
					className={cn(
						iconSizes[size],
						'transition-transform duration-200 group-hover:scale-110',
						iconClassName
					)}
					strokeWidth={2.5}
				/>
				{isPending ? (
					<span
						className="inline-block h-3.5 w-6 animate-pulse rounded-xs bg-muted-foreground/20 mt-0.5"
						aria-hidden="true"
					/>
				) : (
					<span className="font-mono text-xs font-black tabular-nums leading-tight mt-0.5 text-foreground">
						{prefix}
						{formattedAmount}
						{suffix}
					</span>
				)}
			</div>
		);

		if (href) {
			return (
				<Link href={href} aria-label={`${formattedAmount} Coins, view rewards`}>
					{content}
				</Link>
			);
		}

		return content;
	}

	// Badge layout: Neubrutalist card pill
	if (variant === 'badge') {
		const badgeSizes = {
			sm: 'px-2 py-0.5 text-xs gap-1',
			md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5',
			lg: 'px-3.5 py-1.5 text-base gap-2',
		};

		const iconSizes = {
			sm: 'size-3.5',
			md: 'size-4',
			lg: 'size-5',
		};

		const content = (
			<div
				className={cn(
					'inline-flex items-center border-[length:var(--border-width)] border-black rounded-md bg-primary text-primary-foreground font-mono font-black tabular-nums shadow-brutal-sm brutal-lift',
					badgeSizes[size],
					href && 'cursor-pointer',
					className
				)}
				title={`${formattedAmount} Coins`}
			>
				<CoinIcon className={cn(iconSizes[size], iconClassName)} strokeWidth={2.5} />
				{isPending ? (
					<span className="inline-block h-3.5 w-6 animate-pulse rounded-xs bg-black/20" aria-hidden="true" />
				) : (
					<span className="tabular-nums">
						{prefix}
						{formattedAmount}
						{suffix}
					</span>
				)}
			</div>
		);

		if (href) {
			return (
				<Link href={href} aria-label={`${formattedAmount} Coins, view rewards`}>
					{content}
				</Link>
			);
		}

		return content;
	}

	// Horizontal inline layout
	const content = (
		<div
			className={cn(
				'inline-flex items-center gap-1.5 font-mono font-black tabular-nums text-foreground select-none',
				href && 'hover:opacity-80 transition-opacity cursor-pointer',
				className
			)}
			title={`${formattedAmount} Coins`}
		>
			<CoinIcon className={cn('size-4', iconClassName)} strokeWidth={2.5} />
			{isPending ? (
				<span className="inline-block h-3.5 w-6 animate-pulse rounded-xs bg-muted-foreground/20" aria-hidden="true" />
			) : (
				<span>
					{prefix}
					{formattedAmount}
					{suffix}
				</span>
			)}
		</div>
	);

	if (href) {
		return (
			<Link href={href} aria-label={`${formattedAmount} Coins, view rewards`}>
				{content}
			</Link>
		);
	}

	return content;
}
