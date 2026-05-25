import { demoStore } from "@/lib/demo-store";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { activityRepository } from "@/lib/activity/repository";
import { isDemoMode } from "@/lib/demo-mode";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { ComplianceScoreCard } from "@/components/dashboard/compliance-score-card";
import { ComplianceBreakdown } from "@/components/dashboard/compliance-breakdown";
import { PendingActions } from "@/components/dashboard/pending-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { getSession } from "@/lib/auth";
import type { ComplianceStats } from "@/types/database";

export default async function DashboardPage() {
  const session = await getSession();

  let stats: ComplianceStats;
  let actions: Parameters<typeof PendingActions>[0]["actions"];

  if (isDemoMode()) {
    stats = demoStore.getComplianceStats();
    actions = demoStore.getPendingActions();
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
    actions = [
      ...(await chemicalsRepository.getPendingChemicalActions()),
      ...(await deliveriesRepository.getPendingDeliveryActions()),
    ];
  }

  const activity = await activityRepository.getActivityLog(10);

  return (
    <>
      <Topbar title="Dashboard" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Compliance Overview"
        description="Your facility's OSHA readiness at a glance"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-1">
            <ComplianceScoreCard stats={stats} />
          </div>
          <div className="lg:col-span-2">
            <ComplianceBreakdown stats={stats} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <PendingActions actions={actions} />
        </div>
        <RecentActivity entries={activity} />
      </PageShell>
    </>
  );
}
