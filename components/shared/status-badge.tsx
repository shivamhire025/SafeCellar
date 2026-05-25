import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SdsStatus } from "@/types/database";

const labels: Record<SdsStatus, string> = {
  compliant: "Compliant",
  review_due: "Review Due",
  missing: "SDS Missing",
  outdated: "SDS Outdated",
};

export function StatusBadge({ status }: { status: SdsStatus }) {
  const isCompliant = status === "compliant";

  return (
    <Badge variant={status} className="gap-1.5">
      <span
        className={cn(
          "h-2 w-2 flex-shrink-0 rounded-full",
          isCompliant ? "bg-green-500 animate-pulse" : "bg-current"
        )}
        aria-hidden
      />
      {labels[status]}
    </Badge>
  );
}
