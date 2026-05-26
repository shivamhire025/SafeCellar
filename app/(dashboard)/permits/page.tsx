import { permitsRepository } from "@/lib/permits/repository";
import { equipmentRepository } from "@/lib/equipment/repository";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { formatDate } from "@/lib/utils";
import { EligibleEquipmentTable } from "@/components/permits/eligible-equipment-table";
import { CreatePermitForm } from "@/components/permits/create-permit-form";

export default async function PermitsPage() {
  const session = await getSession();
  const [permits, equipment, chemicals] = await Promise.all([
    permitsRepository.getPermits(),
    equipmentRepository.getEquipment(),
    chemicalsRepository.getChemicals(),
  ]);
  const confined = equipment.filter((e) => e.is_confined_space);

  return (
    <>
      <Topbar title="Confined Space Permits" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Confined Space Entry Permits"
        description="Document authorized entries into confined spaces (29 CFR 1910.146). Equipment registry and entry permits are separate: create a permit for each entry event."
      >
        <EligibleEquipmentTable equipment={confined} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CreatePermitForm
            confinedEquipment={confined}
            chemicals={chemicals}
            defaultAttendant={session?.full_name}
          />
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              How this works
            </h3>
            <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-5">
              <li>
                Register tanks and vessels under <strong>Equipment</strong> and
                mark them as confined spaces.
              </li>
              <li>
                Create an <strong>entry permit</strong> here for each authorized
                entry: one permit per event, not per asset.
              </li>
              <li>
                Hazards can prefill from gas-hazard chemicals and equipment
                chemical links in your inventory.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
            <h3 className="text-sm font-semibold text-neutral-900">
              Permit log
            </h3>
          </div>
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
                    No permits yet. Select equipment above and create your first
                    entry permit.
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
      </PageShell>
    </>
  );
}
