import Link from "next/link";
import { Plus } from "lucide-react";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { DeliveriesClient } from "./deliveries-client";

const DELIVERY_FILTERS = [
  "all",
  "ordered",
  "in_transit",
  "inventory_pending",
  "complete",
] as const;
type DeliveryFilter = (typeof DELIVERY_FILTERS)[number];

function parseFilter(filter?: string): DeliveryFilter {
  if (filter && DELIVERY_FILTERS.includes(filter as DeliveryFilter)) {
    return filter as DeliveryFilter;
  }
  return "all";
}

export default async function DeliveriesPage({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const initialFilter = parseFilter(searchParams?.filter);
  const session = await getSession();
  const deliveries = await deliveriesRepository.getDeliveries();

  return (
    <>
      <Topbar title="Deliveries" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Delivery Timeline"
        description="Complete audit trail of chemical orders and receiving"
        actions={
          <Button asChild>
            <Link href="/deliveries/new">
              <Plus className="h-4 w-4" />
              New Delivery
            </Link>
          </Button>
        }
      >
        <DeliveriesClient
          initialDeliveries={deliveries}
          initialFilter={initialFilter}
        />
      </PageShell>
    </>
  );
}
