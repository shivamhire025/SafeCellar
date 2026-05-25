import { Badge } from "@/components/ui/badge";
import type { SdsStatus } from "@/types/database";

const labels: Record<SdsStatus, string> = {
  compliant: "Compliant",
  review_due: "Review Due",
  missing: "SDS Missing",
  outdated: "SDS Outdated",
};

export function StatusBadge({ status }: { status: SdsStatus }) {
  return (
    <Badge variant={status} className="gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[status]}
    </Badge>
  );
}
