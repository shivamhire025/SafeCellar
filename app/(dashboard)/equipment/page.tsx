import { equipmentRepository } from "@/lib/equipment/repository";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { AddEquipmentForm } from "@/components/equipment/add-equipment-form";

export default async function EquipmentPage() {
  const session = await getSession();
  const equipment = await equipmentRepository.getEquipment();
  const chemicals = await chemicalsRepository.getChemicals();
  const gasHazards = chemicals.filter((c) => c.chemical_type === "gas_hazard");

  return (
    <>
      <Topbar title="Equipment" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Equipment Registry"
        description="Phase 2: link confined spaces to gas-hazard chemicals from your inventory (29 CFR 1910.146)."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase">
                    Confined space
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {equipment.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 font-medium">{e.name}</td>
                    <td className="px-4 py-3 capitalize">
                      {e.equipment_type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3">{e.location ?? "N/A"}</td>
                    <td className="px-4 py-3">
                      {e.is_confined_space ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-neutral-900 mb-4">
              Add equipment
            </h3>
            <AddEquipmentForm />
            {gasHazards.length > 0 && (
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <h4 className="text-sm font-semibold text-neutral-900 mb-2">
                  Gas hazards in inventory
                </h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  {gasHazards.map((c) => (
                    <li key={c.id}>
                      {c.name} · {c.storage_location ?? "No location"}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-neutral-500 mt-2">
                  Link these chemicals to confined-space equipment when creating permits.
                </p>
              </div>
            )}
          </div>
        </div>
      </PageShell>
    </>
  );
}
