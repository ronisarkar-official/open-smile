'use client';

import * as React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
	const [isOnline, setIsOnline] = React.useState<boolean>(true);
	const [checking, setChecking] = React.useState<boolean>(false);

	React.useEffect(() => {
		setIsOnline(navigator.onLine);

		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	const handleRetry = () => {
		setChecking(true);
		setTimeout(() => {
			if (navigator.onLine) {
				window.location.reload();
			} else {
				setChecking(false);
			}
		}, 600);
	};

	return (
		<div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-background p-4">
			<div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-sm">
				<div className="mb-4 flex items-center gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
						<WifiOff className="size-4" />
					</div>
					<div className="min-w-0">
						<h1 className="text-sm font-semibold text-foreground">
							You're offline
						</h1>
						<div className="flex items-center gap-1.5">
							<span
								className={`inline-block size-1.5 rounded-full ${
									isOnline ? 'bg-success' : 'bg-destructive'
								}`}
							/>
							<span className="text-xs text-muted-foreground">
								{isOnline ? 'Connection restored' : 'No internet connection'}
							</span>
						</div>
					</div>
				</div>

				<p className="text-xs leading-relaxed text-muted-foreground">
					Some features are unavailable while offline. On-device tools will keep
					working, and your data will sync automatically once you're
					reconnected.
				</p>

				<div className="mt-5 flex gap-2">
					<Button
						onClick={handleRetry}
						disabled={checking}
						size="sm"
						className="flex-1 text-xs font-medium">
						<RefreshCw
							className={`mr-1.5 size-3.5 ${checking ? 'animate-spin' : ''}`}
						/>
						{checking ? 'Checking...' : 'Retry'}
					</Button>

					<Button
						asChild
						variant="outline"
						size="sm"
						className="text-xs font-medium">
						<Link href="/dashboard">
							<ArrowLeft className="mr-1.5 size-3.5" />
							Home
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
