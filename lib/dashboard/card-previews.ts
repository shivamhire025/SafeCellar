import type { SdsReviewItem } from "@/types/database";

export type DashboardPreview = { title: string; href: string };

export type PendingActionPreview = {
  title: string;
  href: string;
  badge: "missing" | "review_due" | "delivery";
};

export function previewsFromActions(
  actions: PendingActionPreview[],
  badges: PendingActionPreview["badge"][],
  limit = 2
): DashboardPreview[] {
  const out: DashboardPreview[] = [];
  for (const badge of badges) {
    for (const action of actions) {
      if (action.badge !== badge) continue;
      out.push({ title: action.title, href: action.href });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export function previewsFromReviewQueue(
  queue: SdsReviewItem[],
  limit = 2
): DashboardPreview[] {
  return queue.slice(0, limit).map((item) => ({
    title: item.chemical?.name ?? "Unknown chemical",
    href: item.chemical_id
      ? `/chemicals/${item.chemical_id}`
      : "/sds-review",
  }));
}

export function sdsStatusPreviews(
  actions: PendingActionPreview[],
  limit = 2
): DashboardPreview[] {
  return previewsFromActions(actions, ["missing", "review_due"], limit);
}
