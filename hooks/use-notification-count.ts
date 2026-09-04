'use client';

import * as React from 'react';

export function useNotificationCount() {
	const [unreadCount, setUnreadCount] = React.useState<number>(0);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const fetchCount = React.useCallback(async () => {
		try {
			const res = await fetch('/api/notifications?limit=1');
			if (res.ok) {
				const data = await res.json();
				if (typeof data.unreadCount === 'number') {
					setUnreadCount(data.unreadCount);
				}
			}
		} catch {
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchCount();

		const interval = setInterval(fetchCount, 45000);

		const handleUpdate = () => {
			fetchCount();
		};
		window.addEventListener('notifications-updated', handleUpdate);

		return () => {
			clearInterval(interval);
			window.removeEventListener('notifications-updated', handleUpdate);
		};
	}, [fetchCount]);

	const refresh = React.useCallback(() => {
		fetchCount();
	}, [fetchCount]);

	return {
		unreadCount,
		isLoading,
		refresh,
	};
}
