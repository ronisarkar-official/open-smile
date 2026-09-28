import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ErrorPage(props: {
	searchParams?: Promise<{ error?: string; error_description?: string }>;
}) {
	const params = props.searchParams ? await props.searchParams : {};
	const search = new URLSearchParams();
	if (params.error) search.set("error", params.error);
	if (params.error_description) {
		search.set("error_description", params.error_description);
	}
	const query = search.toString();
	redirect(query ? `/banned?${query}` : "/banned");
}
