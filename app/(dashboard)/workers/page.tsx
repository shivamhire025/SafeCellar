import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { formatDate } from "@/lib/utils";

export default async function WorkersPage() {
  const session = await getSession();
  const workers = demoStore.getWorkers();

  return (
    <>
      <Topbar title="Worker Roster" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Worker Roster"
        description="Facility workers. Training assignments coming in Phase 2."
      >
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Training
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {workers.map((w) => (
                <tr key={w.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium">{w.full_name}</td>
                  <td className="px-4 py-3 text-neutral-600">{w.role_title ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-600">{w.phone ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(w.start_date)}
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">Phase 2</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageShell>
    </>
  );
}
