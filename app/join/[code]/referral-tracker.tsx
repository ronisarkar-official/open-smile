'use client';

import * as React from 'react';

interface ReferralTrackerProps {
	code: string;
}

export function ReferralTracker({ code }: ReferralTrackerProps) {
	React.useEffect(() => {
		if (typeof document !== 'undefined' && code) {
			const maxAge = 30 * 24 * 60 * 60;
			document.cookie = `ref_code=${encodeURIComponent(code.toUpperCase())}; max-age=${maxAge}; path=/; SameSite=Lax`;
		}
	}, [code]);

	return null;
}
