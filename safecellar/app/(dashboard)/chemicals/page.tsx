import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { demoStore } from "@/lib/demo-store";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { ChemicalsClient } from "./chemicals-client";

export default async function ChemicalsPage() {
  const session = await getSession();
  const chemicals = demoStore.getChemicals();
  const counts = {
    all: chemicals.length,
    missing: chemicals.filter((c) => c.sds_status === "missing").length,
    review_due: chemicals.filter((c) => c.sds_status === "review_due").length,
    compliant: chemicals.filter((c) => c.sds_status === "compliant").length,
  };

  return (
    <>
      <Topbar title="Chemical Inventory" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Chemical Inventory"
        description="Every chemical in your facility. Each must have a compliant SDS."
        actions={
          <>
            <Button variant="secondary" asChild>
              <a href="/api/reports/hazcom" download>
                <Download className="h-4 w-4" />
                Export HazCom Report
              </a>
            </Button>
            <Button asChild>
              <Link href="/chemicals/new">
                <Plus className="h-4 w-4" />
                Add Chemical
              </Link>
            </Button>
          </>
        }
      >
        <ChemicalsClient initialChemicals={chemicals} counts={counts} />
      </PageShell>
    </>
  );
}
