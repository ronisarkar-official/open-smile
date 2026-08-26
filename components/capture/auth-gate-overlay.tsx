'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Smile } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AuthGateOverlayProps {
	onClose?: () => void;
}

export function AuthGateOverlay({ onClose }: AuthGateOverlayProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-xs rounded-xl">
			<motion.div
				initial={{ scale: 0.9, y: 10 }}
				animate={{ scale: 1, y: 0 }}
				transition={{ type: 'spring', damping: 25, stiffness: 350 }}
				className="flex flex-col items-center gap-4 border-[length:var(--border-width)] border-black rounded-xl bg-card p-6 shadow-brutal-lg text-center max-w-xs mx-4">
				<div className="flex size-14 items-center justify-center border-[length:var(--border-width)] border-black rounded-lg bg-primary shadow-brutal">
					<Smile className="size-8 text-primary-foreground" strokeWidth={2.5} />
				</div>

				<div>
					<h3 className="font-title text-lg font-black">
						Sign up to claim your coins!
					</h3>
					<p className="mt-1 text-xs text-muted-foreground font-semibold">
						Create an account to scratch this card and start collecting rewards.
					</p>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<Button asChild size="lg" className="w-full gap-2">
						<Link href="/signup?redirectTo=/capture">
							<UserPlus className="size-4" />
							Sign up
						</Link>
					</Button>
					<Button asChild variant="outline" size="default" className="w-full gap-2">
						<Link href="/login?redirectTo=/capture">
							<LogIn className="size-4" />
							Already have an account? Log in
						</Link>
					</Button>
				</div>
			</motion.div>
		</motion.div>
	);
}
