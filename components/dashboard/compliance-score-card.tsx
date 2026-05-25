"use client";

import Link from "next/link";
import { getComplianceColor } from "@/lib/constants";
import type { ComplianceStats } from "@/types/database";

export function ComplianceScoreCard({ stats }: { stats: ComplianceStats }) {
  const color = getComplianceColor(stats.score);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (stats.score / 100) * circumference * 0.75;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-4">
        Compliance Score
      </h3>
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-28">
          <svg viewBox="0 0 180 100" className="w-full h-full">
            <path
              d="M 20 90 A 70 70 0 0 1 160 90"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 20 90 A 70 70 0 0 1 160 90"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference * 0.75}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <span
              className="text-3xl font-bold"
              style={{ color }}
            >
              {stats.score}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-neutral-600">
            <span className="font-semibold text-neutral-900">
              {stats.compliantCount}
            </span>{" "}
            of {stats.totalChemicals} chemicals compliant
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            {stats.needsAttention} items need attention
          </p>
          <Link
            href="/compliance"
            className="text-sm font-medium text-brand-700 hover:underline mt-2 inline-block"
          >
            Compliance & Exports →
          </Link>
        </div>
      </div>
    </div>
  );
}
