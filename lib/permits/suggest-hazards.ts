import type { Chemical, Equipment } from "@/types/database";

/** Suggest permit hazards from equipment links and gas-hazard inventory. */
export function suggestPermitHazards(
  equipment: Equipment | undefined,
  chemicals: Chemical[]
): string[] {
  const hazards = new Set<string>();

  if (equipment?.linked_chemical_ids?.length) {
    for (const id of equipment.linked_chemical_ids) {
      const c = chemicals.find((x) => x.id === id);
      if (c) {
        hazards.add(c.name);
        for (const h of c.hazard_class ?? []) {
          hazards.add(h);
        }
      }
    }
  }

  const gasHazards = chemicals.filter((c) => c.chemical_type === "gas_hazard");
  for (const c of gasHazards) {
    if (
      equipment?.location &&
      c.storage_location &&
      c.storage_location.toLowerCase() === equipment.location.toLowerCase()
    ) {
      hazards.add(`${c.name} (same area)`);
    }
  }

  if (equipment?.is_confined_space) {
    hazards.add("Oxygen deficiency / asphyxiation");
    hazards.add("Engulfment or entrapment");
  }

  return Array.from(hazards);
}

export function formatEquipmentLabel(e: Equipment): string {
  const type = e.equipment_type.replace(/_/g, " ");
  const loc = e.location ? ` · ${e.location}` : "";
  return `${e.name} (${type})${loc}`;
}
