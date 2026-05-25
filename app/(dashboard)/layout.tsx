import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export const dynamic = "force-dynamic";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/chemicals": "Chemical Inventory",
  "/deliveries": "Deliveries",
  "/sds-review": "SDS Review Queue",
  "/workers": "Worker Roster",
  "/settings": "Settings",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar userName={session.full_name} />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
