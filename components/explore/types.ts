export interface ExplorePost {
	id: string;
	userId?: string;
	user: string;
	avatar: string;
	userAvatar?: string;
	score: number;
	likes: number;
	timeAgo: string;
	expiresIn?: string;
	bg: string;
	caption?: string;
	imageUrl?: string;
	isLikedByMe?: boolean;
	isMine?: boolean;
}

export function getImageKitTransformUrl(url: string, tr: string): string {
	if (!url) return '';
	if (!url.includes('ik.imagekit.io')) return url;
	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}tr=${tr}`;
}

export function getImageKitSrcSet(url: string): string | undefined {
	if (!url || !url.includes('ik.imagekit.io')) return undefined;
	const w400 = getImageKitTransformUrl(url, 'w-400,h-300,fo-face,q-70');
	const w600 = getImageKitTransformUrl(url, 'w-600,h-450,fo-face,q-75');
	const w800 = getImageKitTransformUrl(url, 'w-800,h-600,fo-face,q-80');
	return `${w400} 400w, ${w600} 600w, ${w800} 800w`;
}
