import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";
import { BannedView } from "@/components/banned/banned-view";

export const metadata: Metadata = {
	title: "Account Suspended | Open Smile",
	description: "Your Open Smile account has been suspended.",
	robots: {
		index: false,
		follow: false,
	},
};

export const dynamic = "force-dynamic";

export default async function BannedPage(props: {
	searchParams?: Promise<{
		error?: string;
		error_description?: string;
		reason?: string;
		email?: string;
	}>;
}) {
	const searchParams = props.searchParams ? await props.searchParams : {};
	const user = await getServerUser();

	if (user && !user.banned) {
		redirect("/dashboard");
	}

	const fallbackReason =
		searchParams.error_description ||
		searchParams.reason ||
		(searchParams.error === "BANNED_USER"
			? "You have been banned from this application. Please contact support if you believe this is an error."
			: null);

	const banData =
		user && user.banned
			? {
					email: user.email,
					banReason: user.banReason || fallbackReason,
					banExpires: user.banExpires ? user.banExpires.toISOString() : null,
				}
			: fallbackReason
			? {
					email: searchParams.email || "Suspended Account",
					banReason: fallbackReason,
					banExpires: null,
				}
			: null;

	return (
		<main
			id="main-content"
			className="flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-12"
		>
			<BannedView user={banData} />
		</main>
	);
}
