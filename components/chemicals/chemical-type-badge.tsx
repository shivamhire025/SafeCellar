import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Abbr } from "@/components/shared/abbreviation-tooltip";
import { Droplets, FlaskConical, Wind } from "lucide-react";
import type { ChemicalType } from "@/types/database";

const config: Record<
  ChemicalType,
  {
    label: ReactNode;
    variant: "standard" | "cip" | "gas_hazard" | "refrigerant";
    icon: typeof FlaskConical;
  }
> = {
  standard: { label: "Standard", variant: "standard", icon: FlaskConical },
  cip: {
    label: <Abbr term="CIP">CIP</Abbr>,
    variant: "cip",
    icon: Droplets,
  },
  gas_hazard: {
    label: (
      <Abbr
        full="Confined Space Gas Hazard"
        description="Atmospheric hazards in tanks and enclosed areas (CO₂, nitrogen, etc.). Requires distinct SDS and entry protocols."
      >
        Gas Hazard
      </Abbr>
    ),
    variant: "gas_hazard",
    icon: Wind,
  },
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
