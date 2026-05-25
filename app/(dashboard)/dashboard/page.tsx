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
import { trainingRepository } from "@/lib/training/repository";
import { TrainingAlertCard } from "@/components/dashboard/training-alert-card";
import { previewsFromReviewQueue } from "@/lib/dashboard/card-previews";
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

  const reviewQueue = isDemoMode()
    ? demoStore.getSdsReviewQueue()
    : await chemicalsRepository.getSdsReviewQueue();
  const reviewQueuePreviews = previewsFromReviewQueue(reviewQueue, 2);

  const activity = await activityRepository.getActivityLog(10);
  const missingTraining = await trainingRepository.getWorkersMissingInitialTraining();

  return (
    <>
      <Topbar title="Dashboard" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Compliance Overview"
        description="Chemical safety compliance readiness at a glance"
      >
        <div className="space-y-4 mb-6">
          <ComplianceScoreCard stats={stats} />
          <ComplianceBreakdown
            stats={stats}
            actions={actions}
            reviewQueuePreviews={reviewQueuePreviews}
          />
        </div>
        <div className="mb-6">
          <TrainingAlertCard missingCount={missingTraining} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <PendingActions actions={actions} />
        </div>
        <RecentActivity entries={activity} />
      </PageShell>
    </>
  );
}
