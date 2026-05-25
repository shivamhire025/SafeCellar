import Link from "next/link";
import { getComplianceTerminology } from "@/lib/compliance/terminology";
import { buildComplianceSummary } from "@/lib/reports/hazcom-packet";
import { getComplianceColor } from "@/lib/constants";
import type { ComplianceStats, Organization } from "@/types/database";

export function ComplianceReadinessCard({
  org,
  stats,
  missingTraining,
}: {
  org: Organization;
  stats: ComplianceStats;
  missingTraining: number;
}) {
  const terms = getComplianceTerminology(org.regulatory_profile);
  const summary = buildComplianceSummary(stats);
  const color = getComplianceColor(stats.score);

  const summaryClass =
    summary.status === "ready"
      ? "bg-green-50 border-green-200 text-green-900"
      : summary.status === "attention"
        ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-red-50 border-red-200 text-red-900";

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-3xl">
      <h3 className="text-base font-semibold text-neutral-900 mb-2">
        Inspection readiness
      </h3>
      <p className="text-sm text-neutral-500 mb-4">{terms.readinessLabel}</p>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold" style={{ color }}>
          {stats.score}%
        </span>
        <span className="text-sm text-neutral-500">
          {stats.compliantCount} of {stats.totalChemicals} chemicals compliant
        </span>
      </div>

      <div className={`rounded-lg border px-4 py-3 text-sm mb-4 ${summaryClass}`}>
        {summary.message}
      </div>

      <ul className="text-sm space-y-2 text-neutral-700">
        {stats.missingCount > 0 && (
          <li>
            <Link href="/chemicals" className="text-brand-700 font-medium hover:underline">
              {stats.missingCount} missing SDS
            </Link>
          </li>
        )}
        {stats.reviewDueCount > 0 && (
          <li>
            <Link href="/sds-review" className="text-brand-700 font-medium hover:underline">
              {stats.reviewDueCount} SDS review due
            </Link>
          </li>
        )}
        {missingTraining > 0 && (
          <li>
            <Link href="/workers" className="text-brand-700 font-medium hover:underline">
              {missingTraining} worker(s) missing initial training
            </Link>
          </li>
        )}
        {stats.missingCount === 0 &&
          stats.reviewDueCount === 0 &&
          missingTraining === 0 && (
            <li className="text-green-800">No open gaps in inventory or training.</li>
          )}
      </ul>
    </div>
  );
}
