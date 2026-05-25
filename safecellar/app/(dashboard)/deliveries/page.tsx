import Link from "next/link";
import { Plus } from "lucide-react";
import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { DeliveriesClient } from "./deliveries-client";

export default async function DeliveriesPage() {
  const session = await getSession();
  const deliveries = demoStore.getDeliveries();

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
        <DeliveriesClient initialDeliveries={deliveries} />
      </PageShell>
    </>
  );
}
