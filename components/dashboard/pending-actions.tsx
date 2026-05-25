import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AbbreviationText } from "@/components/shared/abbreviation-tooltip";

interface PendingAction {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
  badge: "missing" | "review_due" | "delivery";
}

export function PendingActions({ actions }: { actions: PendingAction[] }) {
  if (actions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        <h3 className="text-base font-semibold text-neutral-900 mb-4">
          Pending Actions
        </h3>
        <div className="flex items-center gap-3 text-brand-600 py-4">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-medium">
            All compliance items resolved
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-neutral-900 mb-4">
        Pending Actions
      </h3>
      <ul className="divide-y divide-neutral-100">
        {actions.map((action) => (
          <li
            key={action.id}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  action.badge === "missing"
                    ? "missing"
                    : action.badge === "review_due"
                      ? "review_due"
                      : "inventory_pending"
                }
              >
                {action.badge === "missing" ? (
                  <AbbreviationText text="Missing SDS" />
                ) : action.badge === "review_due" ? (
                  "Review Due"
                ) : (
                  "Delivery"
                )}
              </Badge>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {action.title}
                </p>
                <p className="text-xs text-neutral-500">
                  <AbbreviationText text={action.subtitle} />
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={action.href}>Resolve</Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
