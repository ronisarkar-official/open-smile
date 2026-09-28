import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerUser } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const reqHeaders = await headers();
  const user = await getServerUser(reqHeaders);

  if (!user) {
    redirect("/login");
  }

  if (user.banned) {
    redirect("/banned");
  }

  return (
    <DashboardSidebar>
        {children}
    </DashboardSidebar>
  )
}
