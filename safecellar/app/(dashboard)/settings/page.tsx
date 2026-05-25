import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";

export default async function SettingsPage() {
  const session = await getSession();
  const org = demoStore.getOrganization();

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
        <p className="text-sm text-neutral-500 mt-6">
          Connect Supabase to enable live data, worker invites, and SDS file storage.
        </p>
      </PageShell>
    </>
  );
}
