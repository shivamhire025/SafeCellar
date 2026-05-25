import Link from "next/link";
import type { Equipment } from "@/types/database";
import { Button } from "@/components/ui/button";

export function EligibleEquipmentTable({
  equipment,
}: {
  equipment: Equipment[];
}) {
  if (equipment.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
        <h3 className="text-base font-semibold text-neutral-900 mb-2">
          Eligible confined spaces
        </h3>
        <p className="text-sm text-neutral-500 mb-4">
          No equipment marked as a confined space yet. Register tanks and vessels
          on the equipment page and check &quot;Confined space&quot; when adding
          them.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/equipment">Manage equipment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <h3 className="text-sm font-semibold text-neutral-900">
          Eligible confined spaces
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          Equipment registered for confined-space entry. Create a permit below for
          each authorized entry.
        </p>
      </div>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
