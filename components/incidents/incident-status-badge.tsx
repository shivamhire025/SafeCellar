import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { IncidentStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const config: Record<
  IncidentStatus,
  { label: string; variant: "complete" | "incomplete"; icon: typeof CheckCircle2 }
> = {
  complete: { label: "Complete", variant: "complete", icon: CheckCircle2 },
  incomplete: {
    label: "Incomplete",
    variant: "incomplete",
    icon: AlertCircle,
  },
};

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const { label, variant, icon: Icon } = config[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className={cn("h-3 w-3", status === "complete" && "text-brand-600")} />
      {label}
    </Badge>
  );
}
