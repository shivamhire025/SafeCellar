"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Bell, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Abbr, AbbreviationText } from "@/components/shared/abbreviation-tooltip";
import { cn } from "@/lib/utils";
import type { HighRiskNotification } from "@/types/database";
import type { ReactNode } from "react";

const BADGE_LABELS: Record<HighRiskNotification["badge"], ReactNode> = {
  missing: (
    <>
      Missing <Abbr term="SDS">SDS</Abbr>
    </>
  ),
  review_due: "Review due",
  gas_hazard: "Gas hazard",
  sds_queue: (
    <>
      <Abbr term="SDS">SDS</Abbr> queue
    </>
  ),
  delivery: "Delivery",
  incident_incomplete: "Incomplete",
};

const BADGE_VARIANTS: Record<
  HighRiskNotification["badge"],
  | "missing"
  | "review_due"
  | "gas_hazard"
  | "inventory_pending"
  | "incomplete"
> = {
  missing: "missing",
  review_due: "review_due",
  gas_hazard: "gas_hazard",
  sds_queue: "review_due",
  delivery: "inventory_pending",
  incident_incomplete: "incomplete",
};

export function NotificationsMenu() {
  const [items, setItems] = useState<HighRiskNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = useCallback(() => {
    fetch("/api/notifications", { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) return [] as HighRiskNotification[];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then((data) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const count = items.length;
  const criticalCount = items.filter((i) => i.priority === "critical").length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative text-neutral-500 hover:text-neutral-700 transition-colors rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          aria-label={
            count > 0
              ? `${count} high-risk reminders`
              : "Notifications — no reminders"
          }
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold text-white flex items-center justify-center",
                criticalCount > 0 ? "bg-red-600" : "bg-amber-500"
              )}
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[22rem] p-0">
        <div className="px-4 py-3 border-b border-neutral-100">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-neutral-900">
            High-risk reminders
          </DropdownMenuLabel>
          <p className="text-xs text-neutral-500 mt-0.5">
            Complete these items to improve compliance
          </p>
        </div>

        {loading ? (
          <p className="px-4 py-6 text-sm text-neutral-500 text-center">
            Loading…
          </p>
        ) : items.length === 0 ? (
          <div className="px-4 py-6 flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="h-8 w-8 text-brand-600" />
            <p className="text-sm font-medium text-neutral-900">All clear</p>
            <p className="text-xs text-neutral-500">
              No high-risk items need attention right now.
            </p>
          </div>
        ) : (
          <ul className="max-h-[min(24rem,70vh)] overflow-y-auto py-1">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0"
                >
                  <div className="mt-0.5 shrink-0">
                    {item.priority === "critical" ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : (
                      <span
                        className={cn(
                          "block h-2 w-2 rounded-full mt-1.5",
                          item.priority === "high"
                            ? "bg-amber-500"
                            : "bg-neutral-300"
                        )}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <Badge variant={BADGE_VARIANTS[item.badge]}>
                        {BADGE_LABELS[item.badge]}
                      </Badge>
                      {item.priority === "critical" && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-red-600">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      <AbbreviationText text={item.subtitle} />
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link
                href="/dashboard"
                className="text-brand-700 font-medium hover:underline"
                onClick={() => setOpen(false)}
              >
                View dashboard
              </Link>
              <Link
                href="/incidents"
                className="text-brand-700 font-medium hover:underline"
                onClick={() => setOpen(false)}
              >
                Incident log
              </Link>
              <Link
                href="/sds-review"
                className="text-brand-700 font-medium hover:underline"
                onClick={() => setOpen(false)}
              >
                <AbbreviationText text="SDS review queue" />
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
