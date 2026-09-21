import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getServerUser } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });
  const user = session?.user ?? (await getServerUser(reqHeaders));

  if (!user) {
    redirect("/login");
  }


  return (
    <DashboardSidebar>
        {children}
    </DashboardSidebar>
  )
}
