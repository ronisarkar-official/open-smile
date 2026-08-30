'use client';

import * as React from 'react';
import { Share, PlusSquare, MoreVertical, Download } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface IosInstallGuideProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isIOS?: boolean;
}

export function IosInstallGuide({ open, onOpenChange, isIOS = true }: IosInstallGuideProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm rounded-xl border border-border bg-background p-5 shadow-md">
				<DialogHeader className="space-y-1">
					<DialogTitle className="text-base font-semibold text-foreground">
						{isIOS ? 'Install Open Smile on iOS' : 'Install Open Smile'}
					</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						Add the app to your home screen for faster access, fullscreen view,
						and on-device camera scoring.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2.5 pt-1">
					{isIOS ? (
						<>
							<div className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-2.5">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
									1
								</div>
								<div className="text-xs text-foreground">
									<p className="font-medium">Tap the Share icon in Safari</p>
									<p className="mt-0.5 flex items-center gap-1 text-muted-foreground">
										Found at the bottom bar{' '}
										<Share className="inline size-3.5" />
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-2.5">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
									2
								</div>
								<div className="text-xs text-foreground">
									<p className="font-medium">Select &quot;Add to Home Screen&quot;</p>
									<p className="mt-0.5 flex items-center gap-1 text-muted-foreground">
										Scroll down to find it{' '}
										<PlusSquare className="inline size-3.5" />
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-2.5">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
									3
								</div>
								<div className="text-xs text-foreground">
									<p className="font-medium">Tap &quot;Add&quot; in top right</p>
									<p className="mt-0.5 text-muted-foreground">
										Open Smile will appear on your home screen.
									</p>
								</div>
							</div>
						</>
					) : (
						<>
							<div className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-2.5">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
									1
								</div>
								<div className="text-xs text-foreground">
									<p className="font-medium">Tap the browser menu</p>
									<p className="mt-0.5 flex items-center gap-1 text-muted-foreground">
										Look for <MoreVertical className="inline size-3.5" /> in the top or bottom corner.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-2.5">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
									2
								</div>
								<div className="text-xs text-foreground">
									<p className="font-medium">Select &quot;Install app&quot; or &quot;Add to Home screen&quot;</p>
									<p className="mt-0.5 flex items-center gap-1 text-muted-foreground">
										Tap <Download className="inline size-3.5" /> Install app
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-2.5">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
									3
								</div>
								<div className="text-xs text-foreground">
									<p className="font-medium">Confirm Install</p>
									<p className="mt-0.5 text-muted-foreground">
										The app will install directly to your device apps list.
									</p>
								</div>
							</div>
						</>
					)}
				</div>

				<div className="mt-4 flex justify-end">
					<Button
						onClick={() => onOpenChange(false)}
						size="sm"
						className="w-full text-xs font-medium sm:w-auto">
						Got it
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
