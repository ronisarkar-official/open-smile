import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardSidebar>
        {children}
    </DashboardSidebar>
  )
}
