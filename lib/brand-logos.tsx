"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const BRAND_LOGO_MAP: Record<string, string> = {
	apple: "https://cdn.simpleicons.org/apple/000000",
	lenskart: "https://www.google.com/s2/favicons?domain=lenskart.com&sz=128",
	amazon: "https://www.google.com/s2/favicons?domain=amazon.in&sz=128",
	netflix: "https://cdn.simpleicons.org/netflix/E50914",
	dominos: "https://cdn.simpleicons.org/dominos/006491",
	"domino's": "https://cdn.simpleicons.org/dominos/006491",
	spotify: "https://cdn.simpleicons.org/spotify/1DB954",
	starbucks: "https://cdn.simpleicons.org/starbucks/00704A",
	swiggy: "https://cdn.simpleicons.org/swiggy/FC8019",
	zomato: "https://cdn.simpleicons.org/zomato/E23744",
	flipkart: "https://www.google.com/s2/favicons?domain=flipkart.com&sz=128",
	myntra: "https://www.google.com/s2/favicons?domain=myntra.com&sz=128",
	nike: "https://cdn.simpleicons.org/nike/000000",
	adidas: "https://cdn.simpleicons.org/adidas/000000",
	uber: "https://cdn.simpleicons.org/uber/000000",
	boat: "https://www.google.com/s2/favicons?domain=boat-lifestyle.com&sz=128",
	"boat lifestyle": "https://www.google.com/s2/favicons?domain=boat-lifestyle.com&sz=128",
	googleplay: "https://cdn.simpleicons.org/googleplay/414141",
	"google play": "https://cdn.simpleicons.org/googleplay/414141",
	steam: "https://cdn.simpleicons.org/steam/000000",
	kfc: "https://cdn.simpleicons.org/kfc/A3080C",
	mcdonalds: "https://cdn.simpleicons.org/mcdonalds/FBC817",
	"mcdonald's": "https://cdn.simpleicons.org/mcdonalds/FBC817",
	pizzahut: "https://cdn.simpleicons.org/pizzahut/EE3124",
	"pizza hut": "https://cdn.simpleicons.org/pizzahut/EE3124",
	burgerking: "https://cdn.simpleicons.org/burgerking/D62300",
	"burger king": "https://cdn.simpleicons.org/burgerking/D62300",
	bookmyshow: "https://www.google.com/s2/favicons?domain=bookmyshow.com&sz=128",
	hotstar: "https://www.google.com/s2/favicons?domain=hotstar.com&sz=128",
	disneyhotstar: "https://www.google.com/s2/favicons?domain=hotstar.com&sz=128",
	"disney+ hotstar": "https://www.google.com/s2/favicons?domain=hotstar.com&sz=128",
	puma: "https://cdn.simpleicons.org/puma/000000",
	tatacliq: "https://www.google.com/s2/favicons?domain=tatacliq.com&sz=128",
	"tata cliq": "https://www.google.com/s2/favicons?domain=tatacliq.com&sz=128",
	ajio: "https://www.google.com/s2/favicons?domain=ajio.com&sz=128",
	nykaa: "https://www.google.com/s2/favicons?domain=nykaa.com&sz=128",
};

export function resolveBrandLogo(brandName: string, customImageUrl?: string | null): string {
	if (customImageUrl && customImageUrl.trim().length > 0) {
		return customImageUrl.trim();
	}

	if (!brandName) return "";

	const clean = brandName.toLowerCase().trim();
	if (BRAND_LOGO_MAP[clean]) {
		return BRAND_LOGO_MAP[clean];
	}

	const stripped = clean.replace(/[^a-z0-9]/g, "");
	if (BRAND_LOGO_MAP[stripped]) {
		return BRAND_LOGO_MAP[stripped];
	}

	for (const [key, url] of Object.entries(BRAND_LOGO_MAP)) {
		if (clean.includes(key) || key.includes(clean)) {
			return url;
		}
	}

	return `https://www.google.com/s2/favicons?domain=${stripped}.com&sz=128`;
}

interface BrandLogoImageProps {
	brandName: string;
	imageUrl?: string | null;
	className?: string;
	containerClassName?: string;
	size?: number;
}

export function BrandLogoImage({
	brandName,
	imageUrl,
	className,
	containerClassName,
	size = 44,
}: BrandLogoImageProps) {
	const [imgFailed, setImgFailed] = React.useState(false);

	const resolvedUrl = React.useMemo(() => {
		return resolveBrandLogo(brandName, imageUrl);
	}, [brandName, imageUrl]);

	React.useEffect(() => {
		setImgFailed(false);
	}, [resolvedUrl]);

	const initials = (brandName || "VS")
		.replace(/[^a-zA-Z0-9]/g, "")
		.slice(0, 2)
		.toUpperCase();

	return (
		<div
			className={cn(
				"relative border-[length:var(--border-width)] border-black dark:border-outline bg-white dark:bg-card flex items-center justify-center overflow-hidden shrink-0 shadow-brutal-xs rounded-lg select-none",
				containerClassName
			)}
			style={{ width: size, height: size }}
		>
			{!imgFailed && resolvedUrl ? (
				<img
					src={resolvedUrl}
					alt={brandName || "Brand logo"}
					loading="lazy"
					referrerPolicy="no-referrer"
					onError={() => setImgFailed(true)}
					className={cn("w-full h-full object-contain transition-transform duration-200", className)}
				/>
			) : (
				<div className="w-full h-full bg-primary flex items-center justify-center font-black font-title text-primary-foreground text-xs uppercase tracking-tight">
					{initials}
				</div>
			)}
		</div>
	);
}
