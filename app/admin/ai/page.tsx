import { redirect } from "next/navigation";

export default function AdminAiRedirectPage() {
	redirect("/admin/settings?tab=ai");
}
