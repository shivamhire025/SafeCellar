import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { ChemicalTypeBadge } from "@/components/chemicals/chemical-type-badge";
import { formatDate } from "@/lib/utils";
import { SDS_REVIEW_REASONS } from "@/lib/constants";

export default async function SdsReviewPage() {
  const session = await getSession();
  const queue = demoStore.getSdsReviewQueue();

  return (
    <>
      <Topbar title="SDS Review Queue" userName={session?.full_name ?? "User"} />
      <PageShell
        title="SDS Review Queue"
        description="Outstanding SDS compliance actions across your facility"
      >
        {queue.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 text-center">
            <p className="text-green-600 font-medium">Queue is clear. No pending reviews.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Chemical
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Flagged
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {queue.map((item) => {
                  const reasonLabel =
                    SDS_REVIEW_REASONS.find((r) => r.value === item.reason)?.label ??
                    item.reason;
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <p className="font-medium">{item.chemical?.name ?? "N/A"}</p>
                        {item.chemical && (
                          <ChemicalTypeBadge type={item.chemical.chemical_type} />
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{reasonLabel}</td>
                      <td className="px-4 py-3 text-neutral-600">
                        {formatDate(item.flagged_at)}
                      </td>
                      <td className="px-4 py-3 capitalize text-neutral-600">
                        {item.status.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/chemicals/${item.chemical_id}#sds-upload`}>
                            Resolve
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </PageShell>
    </>
  );
}
