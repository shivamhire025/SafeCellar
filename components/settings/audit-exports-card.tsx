import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const exports = [
  { href: "/api/reports/activity", label: "Activity log (CSV)" },
  { href: "/api/reports/sds-review", label: "SDS review queue (CSV)" },
  { href: "/api/reports/deliveries", label: "Delivery compliance (CSV)" },
];

export function AuditExportsCard() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-2xl">
      <h3 className="text-base font-semibold text-neutral-900 mb-2">
        Audit exports
      </h3>
      <p className="text-sm text-neutral-500 mb-4">
        Download records for OSHA inspections and internal audits.
      </p>
      <div className="flex flex-wrap gap-2">
        {exports.map((item) => (
          <Button key={item.href} variant="secondary" size="sm" asChild>
            <a href={item.href} download>
              <Download className="h-4 w-4" />
              {item.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
