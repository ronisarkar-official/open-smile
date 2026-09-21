import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth/session';
import { Sparkles, UserPlus, LogIn, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { CaptureFlow } from '@/components/capture/capture-flow';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
	title: 'Try Smile Capture — Open Smile AI',
	description:
		'Experience on-device smile recognition in your browser. Test your smile score and earn test coins instantly with zero signup required.',
	alternates: {
		canonical: '/try',
	},
	openGraph: {
		title: 'Try Smile Capture — Open Smile AI',
		description:
			'Experience on-device smile recognition in your browser. Test your smile score and earn test coins instantly.',
		url: '/try',
		images: [
			{
				url: '/open-smile_default-image.webp',
				width: 1424,
				height: 810,
				alt: 'Try Smile Capture — Open Smile AI',
				type: 'image/webp',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Try Smile Capture — Open Smile AI',
		description:
			'Experience on-device smile recognition in your browser. Test your smile score and earn test coins instantly.',
		images: [
			{
				url: '/open-smile_default-image.webp',
				width: 1424,
				height: 810,
				alt: 'Try Smile Capture — Open Smile AI',
			},
		],
	},
};

const rawBaseUrl =
	process.env.NEXT_PUBLIC_APP_URL ||
	process.env.BETTER_AUTH_URL ||
	'https://open-smile.vercel.app';
const baseUrl = rawBaseUrl.replace(/\/+$/, '');

const tryToolSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebApplication',
	name: 'Open Smile AI Demo — Free Camera Smile Tester',
	url: `${baseUrl}/try`,
	applicationCategory: 'MultimediaApplication, GameApplication',
	operatingSystem: 'Web, iOS, Android',
	browserRequirements: 'Requires camera access',
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'USD',
	},
	description:
		'Experience on-device smile recognition in your browser. Test your smile score and earn test coins instantly with zero signup required.',
	featureList: [
		'On-device AI smile detection',
		'Instant facial landmark scoring',
		'Zero video or photo upload (100% private)',
		'Interactive scratch card preview',
	],
};

export default async function TryCapturePage() {
	const user = await getServerUser();
	if (user) {
		redirect('/capture');
	}

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(tryToolSchema) }}
			/>
			<Navbar/>

			{/* Sub-header Banner */}
			<div className="border-b-(length:--border-width-sm) border-border bg-accent/25 px-4 py-2.5 text-center">
				<div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-xs font-bold text-foreground uppercase">
					<span className="flex items-center gap-1.5 text-accent-foreground">
						<Sparkles className="size-3.5" /> On-device AI (Private & Fast)
					</span>
					<span className="hidden sm:inline text-muted-foreground">•</span>
					<span className="flex items-center gap-1.5 text-muted-foreground">
						<ShieldCheck className="size-3.5" /> No account required to test
					</span>
					<span className="hidden sm:inline text-muted-foreground">•</span>
					<span className="text-secondary-foreground font-black">
						Scratch card locks upon login
					</span>
				</div>
			</div>

			{/* Core Capture Flow */}
			<div className="flex-1 pb-16">
				<CaptureFlow isGuestMode={true} redirectTo="/capture" />
			</div>
		</div>
	);
}
