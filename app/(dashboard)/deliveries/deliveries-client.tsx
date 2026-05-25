"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function DeliveriesFiltersFallback() {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {filters.map((f) => (
        <div
          key={f.key}
          className="h-9 w-28 animate-pulse rounded-md bg-neutral-100"
        />
      ))}
    </div>
  );
}

function DeliveriesClientInner({
  initialDeliveries,
  initialFilter = "all",
}: {
  initialDeliveries: Delivery[];
  initialFilter?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") ?? "all";
    const valid = filters.some((f) => f.key === urlFilter);
    if (valid) {
      setFilter(urlFilter);
    }
  }, [searchParams]);

  function selectFilter(key: string) {
    setFilter(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("filter");
    } else {
      params.set("filter", key);
    }
    const qs = params.toString();
    router.replace(qs ? `/deliveries?${qs}` : "/deliveries", { scroll: false });
  }

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
            onClick={() => selectFilter(f.key)}
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

export function DeliveriesClient(props: {
  initialDeliveries: Delivery[];
  initialFilter?: string;
}) {
  return (
    <Suspense fallback={<DeliveriesFiltersFallback />}>
      <DeliveriesClientInner {...props} />
    </Suspense>
  );
}
