"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Delivery, DeliveryStatus } from "@/types/database";

const filters = [
  { key: "all", label: "All" },
  { key: "ordered", label: "Ordered" },
  { key: "in_transit", label: "In Transit" },
  { key: "inventory_pending", label: "Pending Inventory" },
  { key: "complete", label: "Complete" },
] as const;

const statusLabels: Record<DeliveryStatus, string> = {
  ordered: "Ordered",
  in_transit: "In Transit",
  delivered: "Delivered",
  inventory_pending: "Inventory Pending",
  complete: "Complete",
};

export function DeliveriesClient({
  initialDeliveries,
}: {
  initialDeliveries: Delivery[];
}) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return initialDeliveries;
    return initialDeliveries.filter((d) => d.status === filter);
  }, [initialDeliveries, filter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
              filter === f.key
                ? "bg-brand-700 text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map((delivery) => {
          const itemCount = delivery.items?.length ?? 0;
          const scanned = delivery.items?.filter((i) => i.is_scanned).length ?? 0;
          return (
            <Link
              key={delivery.id}
              href={`/deliveries/${delivery.id}`}
              className="block bg-white rounded-xl border border-neutral-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-150"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {delivery.order_number ?? "No order #"} · {delivery.supplier}
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Expected: {formatDate(delivery.expected_date)} · {itemCount}{" "}
                    items
                    {delivery.status === "inventory_pending" &&
                      ` · ${scanned}/${itemCount} scanned`}
                  </p>
                </div>
                <Badge variant={delivery.status as DeliveryStatus}>
                  {statusLabels[delivery.status]}
                </Badge>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-neutral-500 text-center py-8">
            No deliveries match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
