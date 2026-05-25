import { Badge } from "@/components/ui/badge";
import type { IncidentType } from "@/types/database";
import { INCIDENT_TYPES } from "@/lib/constants";

const labels = Object.fromEntries(
  INCIDENT_TYPES.map((t) => [t.value, t.label])
) as Record<IncidentType, string>;

export function IncidentTypeBadge({ type }: { type: IncidentType }) {
  return <Badge variant={type}>{labels[type]}</Badge>;
}
