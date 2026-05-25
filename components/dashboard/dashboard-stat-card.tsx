"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardPreview } from "@/lib/dashboard/card-previews";

export type DashboardCardSeverity =
  | "critical"
  | "warning"
  | "neutral"
  | "success";

const severityIconBg: Record<DashboardCardSeverity, string> = {
  critical: "bg-red-50",
  warning: "bg-amber-50",
  neutral: "bg-neutral-50",
  success: "bg-brand-50",
};

const severityIconColor: Record<DashboardCardSeverity, string> = {
  critical: "text-red-600",
  warning: "text-amber-600",
  neutral: "text-neutral-500",
  success: "text-brand-700",
};

const severityTitleColor: Record<DashboardCardSeverity, string> = {
  critical: "text-red-700",
  warning: "text-amber-700",
  neutral: "text-neutral-700",
  success: "text-brand-800",
};

export function DashboardStatCard({
  title,
  icon: Icon,
  severity,
  href,
  footerLabel,
  previews = [],
  previewAriaPrefix,
  primaryMetric,
  primaryLabel,
  emptyMessage,
  children,
}: {
  title: React.ReactNode;
  icon: LucideIcon;
  severity: DashboardCardSeverity;
  href: string;
  footerLabel: string;
  previews?: DashboardPreview[];
  previewAriaPrefix?: string;
  primaryMetric?: React.ReactNode;
  primaryLabel?: string;
  emptyMessage?: string;
  children?: React.ReactNode;
}) {
  const showEmpty = emptyMessage != null;

  return (
    <div
      className={cn(
        "group relative flex min-h-0 flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow",
        "hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wide leading-snug",
            severityTitleColor[severity]
          )}
        >
          {title}
        </span>
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            severityIconBg[severity]
          )}
        >
          <Icon className={cn("h-4 w-4", severityIconColor[severity])} />
        </div>
      </div>

      {showEmpty ? (
        <p className="text-sm font-medium text-brand-700 mb-3">{emptyMessage}</p>
      ) : (
        <>
          {primaryMetric != null && (
            <div className="mb-3">
              <p className="text-2xl font-bold text-neutral-900 tabular-nums leading-none">
                {primaryMetric}
              </p>
              {primaryLabel && (
                <p className="text-sm text-neutral-600 mt-1 leading-snug">
                  {primaryLabel}
                </p>
              )}
            </div>
          )}
          {children && <div className="mb-3 space-y-1.5 min-w-0">{children}</div>}
        </>
      )}

      {previews.length > 0 && (
        <ul
          className={cn(
            "absolute left-0 right-0 z-10 mx-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg",
            "hidden group-hover:block",
            "bottom-[2.75rem]"
          )}
        >
          {previews.map((preview) => (
            <li key={`${preview.href}-${preview.title}`}>
              <Link
                href={preview.href}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                aria-label={
                  previewAriaPrefix
                    ? `${previewAriaPrefix}: ${preview.title}`
                    : preview.title
                }
              >
                <span className="truncate">{preview.title}</span>
                <ChevronRight className="h-3 w-3 flex-shrink-0" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-2 border-t border-neutral-100">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded pt-2"
        >
          {footerLabel}
          <ChevronRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
