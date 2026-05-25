import { notFound } from "next/navigation";
import Link from "next/link";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { DeliveryDetailClient } from "./delivery-detail-client";
import type { DeliveryStatus } from "@/types/database";

const statusLabels: Record<DeliveryStatus, string> = {
  ordered: "Ordered",
  in_transit: "In Transit",
  delivered: "Delivered",
  inventory_pending: "Inventory Pending",
  complete: "Complete",
};

const statusFlow: DeliveryStatus[] = [
  "ordered",
  "in_transit",
  "delivered",
  "inventory_pending",
  "complete",
];

export default async function DeliveryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const delivery = await deliveriesRepository.getDelivery(params.id);
  if (!delivery) notFound();

  const currentIdx = statusFlow.indexOf(delivery.status);
  const newChemicals = (delivery.items ?? []).filter((i) => i.is_new_chemical);

  return (
    <>
      <Topbar
        title={delivery.order_number ?? delivery.supplier}
        userName={session?.full_name ?? "User"}
      />
      <PageShell
        title={`${delivery.order_number ?? "Delivery"} · ${delivery.supplier}`}
        actions={
          <Link href="/deliveries" className="text-sm text-brand-700 hover:underline">
            ← Back
          </Link>
        }
      >
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant={delivery.status as DeliveryStatus}>
            {statusLabels[delivery.status]}
          </Badge>
          <span className="text-sm text-neutral-500">
            Ordered {formatDate(delivery.order_date)} · Expected{" "}
            {formatDate(delivery.expected_date)}
            {delivery.delivered_date &&
              ` · Delivered ${formatDate(delivery.delivered_date)}`}
          </span>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {statusFlow.map((s, i) => (
            <div
              key={s}
              className={`flex-1 min-w-[80px] h-2 rounded-full ${
                i <= currentIdx ? "bg-brand-700" : "bg-neutral-200"
              }`}
              title={statusLabels[s]}
            />
          ))}
        </div>

        {newChemicals.length > 0 && (
          <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 mb-6">
            <p className="text-sm font-semibold text-amber-800">
              {newChemicals.length} new chemical(s) detected in this delivery.
              Review SDS requirements.
            </p>
            <ul className="mt-2 space-y-1">
              {newChemicals.map((item) => (
                <li key={item.id}>
                  <Link
                    href="/chemicals"
                    className="text-sm text-brand-700 hover:underline"
                  >
                    {item.product_name}: Complete SDS →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DeliveryDetailClient delivery={delivery} />
      </PageShell>
    </>
  );
}
