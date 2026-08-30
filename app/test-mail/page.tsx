"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TestMailClient = dynamic(() => import("./_client"), {
	ssr: false,
	loading: () => (
		<div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-8">
			<div className="p-8 bg-card border-2 border-black rounded-[var(--radius,7px)] shadow-[4px_4px_0px_#000] flex flex-col items-center gap-4 text-center max-w-md w-full">
				<div className="p-3 bg-warning text-black border-2 border-black rounded-[var(--radius,7px)] shadow-[2px_2px_0px_#000]">
					<Loader2 className="w-8 h-8 animate-spin" />
				</div>
				<div>
					<h2 className="font-extrabold text-lg tracking-tight uppercase">Loading Mail Lab...</h2>
					<p className="text-xs text-muted-foreground mt-1">Preparing live Neubrutalist email templates</p>
				</div>
			</div>
		</div>
	),
});

export default function TestMailPage() {
	return <TestMailClient />;
}
