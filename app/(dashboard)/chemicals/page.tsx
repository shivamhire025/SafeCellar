import { chemicalsRepository } from "@/lib/chemicals/repository";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { getSession } from "@/lib/auth";
import { ChemicalInventoryActions } from "@/components/chemicals/chemical-inventory-actions";
import { ChemicalsClient } from "./chemicals-client";

const CHEMICAL_TABS = ["all", "missing", "review_due", "compliant"] as const;
type ChemicalTab = (typeof CHEMICAL_TABS)[number];

function parseTab(tab?: string): ChemicalTab {
  if (tab && CHEMICAL_TABS.includes(tab as ChemicalTab)) {
    return tab as ChemicalTab;
  }
  return "all";
}

export default async function ChemicalsPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const initialTab = parseTab(searchParams?.tab);
  const session = await getSession();
  const chemicals = await chemicalsRepository.getChemicals();
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
        actions={<ChemicalInventoryActions />}
      >
        <ChemicalsClient
          initialChemicals={chemicals}
          counts={counts}
          initialTab={initialTab}
        />
      </PageShell>
    </>
  );
}
