import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { BugReportFab } from "@/components/feedback/bug-report-fab";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export const dynamic = "force-dynamic";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/chemicals": "Chemical Inventory",
  "/deliveries": "Deliveries",
  "/sds-review": "SDS Review Queue",
  "/incidents": "Incident Log",
  "/workers": "Worker Roster",
  "/compliance": "Compliance & Exports",
  "/settings": "Settings",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const demo = isDemoMode();

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100">
      <Sidebar userName={session.full_name} />
      <div className="flex-1 flex flex-col min-h-0 min-w-0 pb-16 md:pb-0">
        {demo ? (
          <div
            className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-900"
            role="status"
          >
            Demo mode — you are signed in as sample user Marcus Chen. Sign-up does not
            create Supabase users until{" "}
            <code className="text-xs">NEXT_PUBLIC_DEMO_MODE=false</code> and Supabase
            keys are set on Vercel, then redeployed.
          </div>
        ) : null}
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
      <MobileNav />
      <BugReportFab />
    </div>
  );
}
