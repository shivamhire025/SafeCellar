import Link from "next/link";
import {
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Truck,
} from "lucide-react";
import type { ComplianceStats } from "@/types/database";

export function ComplianceBreakdown({ stats }: { stats: ComplianceStats }) {
  const cards = [
    {
      title: "SDS Status",
      icon: FileText,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      value: `${stats.missingCount} missing / ${stats.reviewDueCount} review due / ${stats.compliantCount} compliant`,
      href: "/chemicals",
      label: "View",
    },
    {
      title: "Delivery Queue",
      icon: Truck,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      value: `${stats.pendingDeliveries} deliveries pending inventory scan`,
      href: "/deliveries",
      label: "View",
    },
    {
      title: "SDS Review Queue",
      icon: ClipboardCheck,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      value: `${stats.reviewQueueCount} items in review queue`,
      href: "/sds-review",
      label: "View",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              {card.title}
            </span>
            <div
              className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}
            >
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </div>
          <p className="text-sm text-neutral-700 mb-3">{card.value}</p>
          <Link
            href={card.href}
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            {card.label} →
          </Link>
        </div>
      ))}
    </div>
  );
}
