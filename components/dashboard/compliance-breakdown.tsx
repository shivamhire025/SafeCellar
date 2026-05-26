"use client";

import Link from "next/link";
import { ClipboardCheck, FileText, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DashboardStatCard,
  type DashboardCardSeverity,
} from "@/components/dashboard/dashboard-stat-card";
import {
  previewsFromActions,
  sdsStatusPreviews,
  type DashboardPreview,
  type PendingActionPreview,
} from "@/lib/dashboard/card-previews";
import type { ComplianceStats } from "@/types/database";

function StatRow({
  label,
  count,
  href,
  badgeVariant,
  deemphasized,
}: {
  label: string;
  count: number;
  href: string;
  badgeVariant: "missing" | "review_due" | "compliant";
  deemphasized?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-2 rounded-md py-1 -mx-1 px-1 text-sm transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
        deemphasized ? "text-neutral-400" : "text-neutral-700"
      }`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <Badge variant={badgeVariant} className="flex-shrink-0">
          {label}
        </Badge>
      </span>
      <span
        className={`font-bold tabular-nums flex-shrink-0 ${
          deemphasized ? "text-neutral-400" : "text-neutral-900"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

function sdsSeverity(stats: ComplianceStats): DashboardCardSeverity {
  if (stats.missingCount > 0) return "critical";
  if (stats.reviewDueCount > 0) return "warning";
  if (stats.compliantCount > 0) return "success";
  return "neutral";
}

function deliverySeverity(pending: number): DashboardCardSeverity {
  if (pending > 0) return "warning";
  return "success";
}

function reviewQueueSeverity(count: number): DashboardCardSeverity {
  if (count > 0) return "warning";
  return "success";
}

export function ComplianceBreakdown({
  stats,
  actions,
  reviewQueuePreviews,
}: {
  stats: ComplianceStats;
  actions: PendingActionPreview[];
  reviewQueuePreviews: DashboardPreview[];
}) {
  const sdsPreviews = sdsStatusPreviews(actions);
  const deliveryPreviews = previewsFromActions(actions, ["delivery"]);

  const sdsPrimary =
    stats.missingCount > 0
      ? stats.missingCount
      : stats.reviewDueCount > 0
        ? stats.reviewDueCount
        : stats.compliantCount;

  const sdsPrimaryLabel =
    stats.missingCount > 0
      ? `missing SDS${stats.missingCount === 1 ? "" : ""}`
      : stats.reviewDueCount > 0
        ? `review due${stats.reviewDueCount === 1 ? "" : ""}`
        : `compliant chemical${stats.compliantCount === 1 ? "" : "s"}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashboardStatCard
        title="SDS Status"
        icon={FileText}
        severity={sdsSeverity(stats)}
        href="/chemicals"
        footerLabel="View chemicals"
        previews={sdsPreviews}
        previewAriaPrefix="Open chemical"
        primaryMetric={sdsPrimary}
        primaryLabel={sdsPrimaryLabel}
      >
        <StatRow
          label="Missing SDS"
          count={stats.missingCount}
          href="/chemicals?tab=missing"
          badgeVariant="missing"
          deemphasized={stats.missingCount === 0}
        />
        <StatRow
          label="Review due"
          count={stats.reviewDueCount}
          href="/chemicals?tab=review_due"
          badgeVariant="review_due"
          deemphasized={stats.reviewDueCount === 0}
        />
        <StatRow
          label="Compliant"
          count={stats.compliantCount}
          href="/chemicals?tab=compliant"
          badgeVariant="compliant"
          deemphasized={stats.compliantCount === 0}
        />
      </DashboardStatCard>

      <DashboardStatCard
        title="Delivery Queue"
        icon={Truck}
        severity={deliverySeverity(stats.pendingDeliveries)}
        href="/deliveries?filter=inventory_pending"
        footerLabel="View deliveries"
        previews={deliveryPreviews}
        previewAriaPrefix="Open delivery"
        emptyMessage={
          stats.pendingDeliveries === 0 ? "Queue clear: no pending scans" : undefined
        }
        primaryMetric={
          stats.pendingDeliveries > 0 ? stats.pendingDeliveries : undefined
        }
        primaryLabel={
          stats.pendingDeliveries > 0
            ? `deliver${stats.pendingDeliveries === 1 ? "y" : "ies"} pending inventory scan`
            : undefined
        }
      />

      <DashboardStatCard
        title="SDS Review Queue"
        icon={ClipboardCheck}
        severity={reviewQueueSeverity(stats.reviewQueueCount)}
        href="/sds-review"
        footerLabel="View SDS review queue"
        previews={reviewQueuePreviews}
        previewAriaPrefix="Review chemical"
        emptyMessage={
          stats.reviewQueueCount === 0
            ? "Queue clear: no pending reviews"
            : undefined
        }
        primaryMetric={
          stats.reviewQueueCount > 0 ? stats.reviewQueueCount : undefined
        }
        primaryLabel={
          stats.reviewQueueCount > 0
            ? `item${stats.reviewQueueCount === 1 ? "" : "s"} in review queue`
            : undefined
        }
      />
    </div>
  );
}
