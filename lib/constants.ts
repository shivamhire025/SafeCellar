export const CHEMICAL_TYPES = [
  { value: "standard", label: "Standard" },
  { value: "cip", label: "CIP Chemical" },
  { value: "gas_hazard", label: "Confined Space Gas Hazard" },
  { value: "refrigerant", label: "Refrigerant or Process Safety Chemical" },
] as const;

export const SDS_STATUSES = [
  "compliant",
  "review_due",
  "missing",
  "outdated",
] as const;

export const DELIVERY_STATUSES = [
  "ordered",
  "in_transit",
  "delivered",
  "inventory_pending",
  "complete",
] as const;

export const SDS_REVIEW_REASONS = [
  { value: "new_chemical", label: "New Chemical" },
  { value: "annual_review", label: "Annual Review Due" },
  { value: "supplier_change", label: "Supplier Change" },
  { value: "formula_update", label: "Formula Update" },
] as const;

export const PPE_OPTIONS = [
  { value: "nitrile_gloves", label: "Nitrile Gloves" },
  { value: "face_shield", label: "Face Shield" },
  { value: "apron", label: "Apron" },
  { value: "goggles", label: "Safety Goggles" },
  { value: "respirator", label: "Respirator" },
  { value: "rubber_boots", label: "Rubber Boots" },
] as const;

export const HAZARD_CLASSES = [
  "corrosive",
  "flammable",
  "oxidizer",
  "asphyxiant",
  "toxic",
  "irritant",
] as const;

/** GHS-style label text for emergency response cards. */
export const HAZARD_LABEL_INFO: Record<
  (typeof HAZARD_CLASSES)[number],
  { label: string; labelFr?: string }
> = {
  corrosive: { label: "CORROSIVE", labelFr: "CORROSIF" },
  toxic: { label: "POISON" },
  flammable: { label: "FLAMMABLE", labelFr: "INFLAMMABLE" },
  oxidizer: { label: "OXIDIZER", labelFr: "COMBURANT" },
  asphyxiant: { label: "ASPHYXIANT", labelFr: "ASPHYSIANT" },
  irritant: { label: "IRRITANT", labelFr: "IRRITANT" },
};

export const STORAGE_LOCATIONS = [
  "Cellar A",
  "Cellar B",
  "Brewhouse",
  "Chemical Cage",
  "Walk-in Cooler",
  "Production Floor",
] as const;

/** Score bands for compliance gauge (names are thresholds, not UI colors). */
export const COMPLIANCE_THRESHOLDS = {
  green: 85,
  amber: 60,
} as const;

/** Arc/text color for compliance score — brand blue when healthy. */
export function getComplianceColor(score: number): string {
  if (score >= COMPLIANCE_THRESHOLDS.green) return "#1D4ED8";
  if (score >= COMPLIANCE_THRESHOLDS.amber) return "#D97706";
  return "#DC2626";
}
