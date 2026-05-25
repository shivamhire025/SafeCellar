import { demoStore } from "@/lib/demo-store";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { isDemoMode } from "@/lib/demo-mode";
import { buildHighRiskNotifications } from "@/lib/notifications/build-high-risk-notifications";
import type { HighRiskNotification } from "@/types/database";

export const notificationsRepository = {
  async getHighRiskNotifications(): Promise<HighRiskNotification[]> {
    if (isDemoMode()) {
      return demoStore.getHighRiskNotifications();
    }

    const [chemicals, reviewQueue, deliveries] = await Promise.all([
      chemicalsRepository.getChemicals(),
      chemicalsRepository.getSdsReviewQueue(),
      deliveriesRepository.getDeliveries(),
    ]);

    return buildHighRiskNotifications({
      chemicals,
      reviewQueue,
      deliveries,
      incidents: [],
    });
  },
};
