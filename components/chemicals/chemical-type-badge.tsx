import { Badge } from "@/components/ui/badge";
import { Droplets, FlaskConical, Wind } from "lucide-react";
import type { ChemicalType } from "@/types/database";

const config: Record<
  ChemicalType,
  { label: string; variant: "standard" | "cip" | "gas_hazard" | "refrigerant"; icon: typeof FlaskConical }
> = {
  standard: { label: "Standard", variant: "standard", icon: FlaskConical },
  cip: { label: "CIP", variant: "cip", icon: Droplets },
  gas_hazard: { label: "Gas Hazard", variant: "gas_hazard", icon: Wind },
  refrigerant: { label: "Refrigerant", variant: "refrigerant", icon: FlaskConical },
};

export function ChemicalTypeBadge({ type }: { type: ChemicalType }) {
  const { label, variant, icon: Icon } = config[type];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
