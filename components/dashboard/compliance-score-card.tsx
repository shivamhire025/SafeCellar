"use client";

import Link from "next/link";
import { getComplianceColor } from "@/lib/constants";
import { buildComplianceSummary } from "@/lib/reports/hazcom-packet";
import type { ComplianceStats } from "@/types/database";

const statusLabels = {
  ready: "On track",
  attention: "Needs attention",
  not_ready: "Not inspection-ready",
} as const;

const statusPillClass = {
  ready: "bg-green-50 border-green-200 text-green-900",
  attention: "bg-amber-50 border-amber-200 text-amber-900",
  not_ready: "bg-red-50 border-red-200 text-red-900",
} as const;

const statusTitleClass = {
  ready: "text-brand-800",
  attention: "text-amber-700",
  not_ready: "text-red-700",
} as const;

const GAUGE_CX = 90;
const GAUGE_CY = 90;
const GAUGE_R = 70;
const STROKE = 12;
/** Upper semicircle: left (π) → right (2π), clockwise through top (3π/2). */
const ARC_START = Math.PI;
const ARC_END = 2 * Math.PI;
const TICK_PERCENTS = [0, 25, 50, 75, 100] as const;

function polar(r: number, angle: number) {
  return {
    x: GAUGE_CX + r * Math.cos(angle),
    y: GAUGE_CY + r * Math.sin(angle),
  };
}

function describeArc(r: number, startAngle: number, endAngle: number) {
  const start = polar(r, startAngle);
  const end = polar(r, endAngle);
  const delta = endAngle - startAngle;
  const largeArc = delta > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function scoreAngle(score: number) {
  return ARC_START + (score / 100) * (ARC_END - ARC_START);
}

function gaugeTickLine(percent: number) {
  const angle = scoreAngle(percent);
  // Ticks sit outside the arc (radially outward from center), not across the stroke.
  const tickStart = GAUGE_R + STROKE / 2 + 2;
  const tickEnd = tickStart + 7;
  return { a: polar(tickStart, angle), b: polar(tickEnd, angle) };
}

function attentionBreakdown(stats: ComplianceStats): string {
  const parts: string[] = [];
  if (stats.missingCount > 0) parts.push(`${stats.missingCount} missing SDS`);
  if (stats.reviewDueCount > 0) parts.push(`${stats.reviewDueCount} review due`);
  if (stats.reviewQueueCount > 0) {
    parts.push(`${stats.reviewQueueCount} in review queue`);
  }
  return parts.join(" · ");
}

export function ComplianceScoreCard({ stats }: { stats: ComplianceStats }) {
  const color = getComplianceColor(stats.score);
  const summary = buildComplianceSummary(stats);
  const breakdown = attentionBreakdown(stats);
  const progressEnd = scoreAngle(stats.score);
  const trackPath = describeArc(GAUGE_R, ARC_START, ARC_END);
  const progressPath =
    stats.score > 0
      ? describeArc(GAUGE_R, ARC_START, progressEnd)
      : null;

  return (
    <div className="h-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3
        className={`text-xs font-bold uppercase tracking-wide mb-4 ${statusTitleClass[summary.status]}`}
      >
        Compliance Score
      </h3>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex justify-center md:justify-start flex-shrink-0">
          <div className="relative w-40 aspect-[9/5] max-h-28">
            <svg
              viewBox="0 0 180 100"
              preserveAspectRatio="xMidYMid meet"
              className="h-full w-full"
              role="img"
              aria-label={`Compliance score ${stats.score} percent`}
            >
              <path
                d={trackPath}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
              {progressPath && (
                <path
                  d={progressPath}
                  fill="none"
                  stroke={color}
                  strokeWidth={STROKE}
                  strokeLinecap="butt"
                />
              )}
              {TICK_PERCENTS.map((pct) => {
                const { a, b } = gaugeTickLine(pct);
                return (
                  <line
                    key={pct}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#9CA3AF"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
              <span className="text-3xl font-bold" style={{ color }}>
                {stats.score}%
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3 text-center md:text-left">
          <span
            className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusPillClass[summary.status]}`}
          >
            {statusLabels[summary.status]}
          </span>

          <p className="text-sm text-neutral-600">
            <span className="font-semibold text-neutral-900">
              {stats.compliantCount}
            </span>{" "}
            of {stats.totalChemicals} chemicals compliant
          </p>

          <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
            {summary.message}
          </p>

          {stats.needsAttention > 0 && (
            <div className="text-sm space-y-1">
              <Link
                href="#pending-actions"
                className="font-medium text-brand-700 hover:underline block"
              >
                {stats.needsAttention} items need attention
              </Link>
              {breakdown && (
                <p className="text-xs text-neutral-500">{breakdown}</p>
              )}
            </div>
          )}

          <Link
            href="/compliance"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded"
          >
            Open compliance &amp; exports
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
