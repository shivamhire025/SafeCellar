import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await getSession();
  const org = demoStore.getOrganization();
  const bugReports = demoStore.getBugReports();
  const openBugs = bugReports.filter((t) => t.status === "open").length;

  return (
    <>
      <Topbar title="Settings" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Organization Settings"
        description="Facility information and team management"
      >
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-xl">
          <h3 className="text-base font-semibold text-neutral-900 mb-4">
            Facility Information
          </h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Organization</dt>
              <dd className="font-medium text-lg">{org.name}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Facility Type</dt>
              <dd className="font-medium capitalize">{org.facility_type}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Address</dt>
              <dd>
                {org.address}
                <br />
                {org.city}, {org.state} {org.zip}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Admin</dt>
              <dd className="font-medium">{session?.full_name}</dd>
              <dd className="text-neutral-500">{session?.email}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-xl mt-6">
          <h3 className="text-base font-semibold text-neutral-900 mb-2">
            Bug reports
          </h3>
          <p className="text-sm text-neutral-500 mb-4">
            Tickets submitted from the floating Report a bug button across the
            app.
            {openBugs > 0 && (
              <span className="block mt-1 text-amber-700 font-medium">
                {openBugs} open ticket{openBugs === 1 ? "" : "s"}
              </span>
            )}
          </p>
          <Button variant="secondary" asChild>
            <Link href="/bug-reports">View bug report log</Link>
          </Button>
        </div>
        <p className="text-sm text-neutral-500 mt-6">
          Connect Supabase to enable live data, worker invites, and SDS file storage.
        </p>
      </PageShell>
    </>
  );
}
