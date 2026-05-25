import Link from "next/link";
import { permitsRepository } from "@/lib/permits/repository";
import { equipmentRepository } from "@/lib/equipment/repository";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function PermitsPage() {
  const session = await getSession();
  const permits = await permitsRepository.getPermits();
  const equipment = await equipmentRepository.getEquipment();
  const confined = equipment.filter((e) => e.is_confined_space);

  return (
    <>
      <Topbar title="Confined Space Permits" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Confined Space Entry Permits"
        description="OSHA 1910.146 permit records. Hazards can be informed by gas-hazard chemicals in inventory."
      >
        <div className="mb-4">
          <Button variant="secondary" asChild>
            <Link href="/equipment">Manage equipment</Link>
          </Button>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Permit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Equipment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Entry date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Attendant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {permits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                    No permits yet. Demo includes one sample permit when using demo mode.
                  </td>
                </tr>
              ) : (
                permits.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium">
                      {p.permit_number ?? p.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3">{p.equipment_name ?? "N/A"}</td>
                    <td className="px-4 py-3">{formatDate(p.entry_date)}</td>
                    <td className="px-4 py-3">{p.attendant_name ?? "N/A"}</td>
                    <td className="px-4 py-3 capitalize">{p.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {confined.length > 0 && (
          <p className="text-sm text-neutral-500 mt-4">
            {confined.length} confined-space equipment item(s) registered. Full permit creation UI can extend the equipment registry in a follow-up.
          </p>
        )}
      </PageShell>
    </>
  );
}
