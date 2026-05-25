import Link from "next/link";
import { workersRepository } from "@/lib/workers/repository";
import { trainingRepository } from "@/lib/training/repository";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { formatDate } from "@/lib/utils";

export default async function WorkersPage() {
  const session = await getSession();
  const workers = await workersRepository.getWorkers();
  const missingTraining = await trainingRepository.getWorkersMissingInitialTraining();

  return (
    <>
      <Topbar title="Worker Roster" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Worker Roster"
        description={
          missingTraining > 0
            ? `${missingTraining} worker(s) missing initial HazCom training.`
            : "Facility workers and HazCom training records."
        }
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
                  HazCom training
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {workers.map((w) => (
                <tr key={w.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/workers/${w.id}`}
                      className="text-brand-700 hover:underline"
                    >
                      {w.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{w.role_title ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-600">{w.phone ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(w.start_date)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/workers/${w.id}`}
                      className="text-xs text-brand-700 hover:underline"
                    >
                      View / log training
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-brand-700">
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
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
