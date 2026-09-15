import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";
import { ContactForm } from "@/components/contact";
import {
	Clock,
	ShieldCheck,
	Sparkles,
	MessageSquare,
} from "lucide-react";

const rawBaseUrl =
	process.env.NEXT_PUBLIC_APP_URL ||
	process.env.BETTER_AUTH_URL ||
	"https://open-smile.vercel.app";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

export const metadata: Metadata = {
	title: "Contact Us · Open Smile — Support & Inquiries",
	description:
		"Get in touch with the Open Smile team. Send inquiries about smile rewards, report issues, or propose partnerships.",
	alternates: {
		canonical: "/contact",
	},
	openGraph: {
		title: "Contact Us · Open Smile — Support & Inquiries",
		description:
			"Get in touch with the Open Smile team. Send inquiries about smile rewards, report issues, or propose partnerships.",
		url: `${baseUrl}/contact`,
		images: [
			{
				url: "/open-smile_default-image.webp",
				width: 1424,
				height: 810,
				alt: "Contact Open Smile",
				type: "image/webp",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Us · Open Smile — Support & Inquiries",
		description:
			"Get in touch with the Open Smile team. Send inquiries about smile rewards, report issues, or propose partnerships.",
		images: ["/open-smile_default-image.webp"],
	},
};

const contactSchema = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "ContactPage",
			"@id": `${baseUrl}/contact#webpage`,
			url: `${baseUrl}/contact`,
			name: "Contact Open Smile",
			description:
				"Official contact and support page for the Open Smile gamified rewards platform.",
			inLanguage: "en-US",
			isPartOf: {
				"@type": "WebSite",
				"@id": `${baseUrl}/#website`,
				url: baseUrl,
				name: "Open Smile",
			},
		},
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: baseUrl,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Contact Us",
					item: `${baseUrl}/contact`,
				},
			],
		},
	],
};

export default function ContactPage() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
			/>

			<Navbar />

			<main id="main-content" className="flex-1">
				{/* Top Header Hero */}
				<section className="relative w-full border-b-[length:var(--border-width)] border-black bg-[#FDF8D4] py-12 sm:py-16 dark:border-white dark:bg-[#1E1B18]">
					<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
						<div className="mb-4 inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-md bg-[#181829] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-brutal-xs dark:border-white">
							<Sparkles className="size-3.5 text-accent" />
							<span>Support &amp; Inquiries</span>
						</div>

						<h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground text-balance">
							Get In Touch
						</h1>

						<p className="mx-auto mt-4 max-w-xl text-sm sm:text-base font-semibold text-muted-foreground leading-relaxed text-pretty">
							Have questions about your smile score, rewards, partnership ideas, or spotted a bug? Send us a message below.
						</p>

						{/* 3 Quick Assurance Chips */}
						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-lg bg-card px-3.5 py-1.5 shadow-brutal-xs dark:border-white">
								<Clock className="size-3.5 text-primary" />
								<span className="font-mono text-xs font-bold text-foreground uppercase tracking-wide">
									&lt; 24h Response Time
								</span>
							</div>

							<div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-lg bg-card px-3.5 py-1.5 shadow-brutal-xs dark:border-white">
								<ShieldCheck className="size-3.5 text-success" />
								<span className="font-mono text-xs font-bold text-foreground uppercase tracking-wide">
									100% Privacy Focused
								</span>
							</div>

							<div className="inline-flex items-center gap-2 border-[length:var(--border-width)] border-black rounded-lg bg-card px-3.5 py-1.5 shadow-brutal-xs dark:border-white">
								<MessageSquare className="size-3.5 text-secondary" />
								<span className="font-mono text-xs font-bold text-foreground uppercase tracking-wide">
									Direct Team Review
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* Centered Form Section */}
				<section className="w-full py-12 sm:py-16">
					<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
						<ContactForm />
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
