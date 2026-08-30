'use client';

import * as React from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwa } from '@/hooks/use-pwa';
import { IosInstallGuide } from './ios-install-guide';

const DISMISS_STORAGE_KEY = 'open-smile-pwa-dismissed';
const DISMISS_COOLDOWN_DAYS = 7;

export function PwaInstallBanner() {
	const { isInstallable, isInstalled, isIOS, isMobile, promptInstall } = usePwa();
	const [dismissed, setDismissed] = React.useState<boolean>(true);
	const [showGuide, setShowGuide] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (typeof window === 'undefined') return;

		const lastDismissed = localStorage.getItem(DISMISS_STORAGE_KEY);
		if (lastDismissed) {
			const daysSinceDismissed =
				(Date.now() - parseInt(lastDismissed, 10)) / (1000 * 60 * 60 * 24);
			if (daysSinceDismissed < DISMISS_COOLDOWN_DAYS) {
				setDismissed(true);
				return;
			}
		}

		setDismissed(false);
	}, []);

	const handleDismiss = () => {
		setDismissed(true);
		try {
			localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
		} catch {}
	};

	const handleInstallClick = async () => {
		if (isInstallable) {
			const outcome = await promptInstall();
			if (outcome === 'accepted') {
				setDismissed(true);
			}
			return;
		}

		setShowGuide(true);
	};

	if (isInstalled || dismissed || (!isInstallable && !isMobile && !isIOS)) {
		return (
			<IosInstallGuide
				open={showGuide}
				onOpenChange={setShowGuide}
				isIOS={isIOS}
			/>
		);
	}

	return (
		<>
			<div
				className="fixed bottom-20 left-4 right-4 z-200 mx-auto max-w-sm animate-in fade-in-0 slide-in-from-bottom-3 duration-300 md:bottom-5 md:right-5 md:left-auto"
				role="region"
				aria-label="Install Open Smile App">
				<div className="relative rounded-xl border border-border bg-card p-4 shadow-md">
					<button
						onClick={handleDismiss}
						className="absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						aria-label="Dismiss install banner">
						<X className="size-3.5" />
					</button>

					<div className="flex items-start gap-3 pr-5">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
							{isIOS || isMobile ?
								<Smartphone className="size-4" />
							:	<Download className="size-4" />}
						</div>
						<div className="min-w-0">
							<h3 className="text-sm font-semibold text-foreground">
								Install Open Smile
							</h3>
							<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
								Faster access, fullscreen view, and offline scoring on your
								device.
							</p>
						</div>
					</div>

					<div className="mt-3.5 flex items-center justify-end gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleDismiss}
							className="text-xs font-medium">
							Not now
						</Button>
						<Button
							size="sm"
							onClick={handleInstallClick}
							className="text-xs font-medium">
							<Download className="mr-1.5 size-3.5" />
							Install
						</Button>
					</div>
				</div>
			</div>

			<IosInstallGuide
				open={showGuide}
				onOpenChange={setShowGuide}
				isIOS={isIOS}
			/>
		</>
	);
}
