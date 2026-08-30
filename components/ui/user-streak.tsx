'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export const USER_STREAK_EVENT = 'open-smile:user-streak-updated';

/**
 * Dispatch an event to notify all streak components across the app to refresh or set streak.
 */
export function emitStreakUpdate(newStreak?: number) {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(
			new CustomEvent(USER_STREAK_EVENT, {
				detail: { streak: newStreak },
			})
		);
	}
}

/**
 * Hook to retrieve and sync the live user smile streak days with SSR hydration safety.
 */
export function useUserStreak(initialDays?: number) {
	const [streak, setStreak] = React.useState<number | null>(initialDays ?? null);
	const [isMounted, setIsMounted] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const fetchStreak = React.useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await fetch('/api/user/streak', {
				cache: 'no-store',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
				},
			});
			if (res.ok) {
				const data = await res.json();
				if (typeof data.streak === 'number') {
					setStreak(data.streak);
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
		fetchStreak();

		const handleUpdate = (e: Event) => {
			const customEvent = e as CustomEvent<{ streak?: number }>;
			if (typeof customEvent.detail?.streak === 'number') {
				setStreak(customEvent.detail.streak);
			} else {
				fetchStreak();
			}
		};

		window.addEventListener(USER_STREAK_EVENT, handleUpdate);
		return () => {
			window.removeEventListener(USER_STREAK_EVENT, handleUpdate);
		};
	}, [fetchStreak]);

	return {
		streak: streak ?? 0,
		isLoading: !isMounted || (isLoading && streak === null),
		isMounted,
		refetch: fetchStreak,
		setStreak,
	};
}

export interface UserStreakProps {
	/** Optional manual streak days override */
	days?: number;
	/** Suffix after the number (defaults to 'd', e.g. '3d') */
	suffix?: string;
	/** Optional prefix before the number */
	prefix?: string;
	/** Custom CSS className for the text span */
	className?: string;
}

/**
 * Reusable user streak component.
 * Displays only the formatted streak number (no icons), safe to use inside links, badges, or anywhere with skeleton loading.
 */
export function UserStreak({
	days: propDays,
	suffix = 'd',
	prefix = '',
	className,
}: UserStreakProps) {
	const { streak: liveStreak, isMounted, isLoading } = useUserStreak(propDays);
	const count = propDays ?? liveStreak;
	const isPending = !isMounted || (isLoading && propDays === undefined);

	if (isPending) {
		return (
			<span
				className={cn(
					'inline-block h-[1em] w-5 animate-pulse align-middle rounded-xs bg-muted-foreground/20',
					className
				)}
				aria-hidden="true"
			/>
		);
	}

	return (
		<span className={cn('tabular-nums', className)}>
			{prefix}
			{count}
			{suffix}
		</span>
	);
}
