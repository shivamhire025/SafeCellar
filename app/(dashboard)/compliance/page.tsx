import { demoStore } from "@/lib/demo-store";
import { organizationRepository } from "@/lib/organization/repository";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { trainingRepository } from "@/lib/training/repository";
import { isDemoMode } from "@/lib/demo-mode";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { RegulatoryProfileSelector } from "@/components/compliance/regulatory-profile-selector";
import { ComplianceReadinessCard } from "@/components/compliance/compliance-readiness-card";
import { WrittenProgramForm } from "@/components/compliance/written-program-form";
import { ComplianceExportsCard } from "@/components/compliance/compliance-exports-card";
import type { ComplianceStats } from "@/types/database";

export default async function CompliancePage() {
  const session = await getSession();
  const org =
    (await organizationRepository.getOrganization()) ??
    demoStore.getOrganization();

  let stats: ComplianceStats;
  if (isDemoMode()) {
    stats = demoStore.getComplianceStats();
  } else {
    const chemicalStats = await chemicalsRepository.getComplianceStats();
    stats = {
      score: chemicalStats.score,
      totalChemicals: chemicalStats.totalChemicals,
      compliantCount: chemicalStats.compliantCount,
      missingCount: chemicalStats.missingCount,
      reviewDueCount: chemicalStats.reviewDueCount,
      pendingDeliveries: chemicalStats.pendingDeliveries ?? 0,
      reviewQueueCount: chemicalStats.reviewQueueCount,
      needsAttention: chemicalStats.needsAttention,
    };
  }

  const missingTraining =
    await trainingRepository.getWorkersMissingInitialTraining();

  return (
    <>
      <Topbar title="Compliance & Exports" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Compliance & Exports"
        description="Written program, inspection readiness, and downloadable documentation for audits and regulator visits."
      >
        <ComplianceReadinessCard
          org={org}
          stats={stats}
          missingTraining={missingTraining}
        />
        <div className="mt-6">
          <RegulatoryProfileSelector org={org} />
        </div>
        <div className="mt-6">
          <WrittenProgramForm org={org} />
        </div>
        <div className="mt-6">
          <ComplianceExportsCard org={org} />
        </div>
      </PageShell>
    </>
  );
}
