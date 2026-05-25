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

export const STORAGE_LOCATIONS = [
  "Cellar A",
  "Cellar B",
  "Brewhouse",
  "Chemical Cage",
  "Walk-in Cooler",
  "Production Floor",
] as const;

export const COMPLIANCE_THRESHOLDS = {
  green: 85,
  amber: 60,
} as const;

export function getComplianceColor(score: number): string {
  if (score >= COMPLIANCE_THRESHOLDS.green) return "#16A34A";
  if (score >= COMPLIANCE_THRESHOLDS.amber) return "#D97706";
  return "#DC2626";
}
