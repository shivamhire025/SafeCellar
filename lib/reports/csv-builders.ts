import { activityRepository } from "@/lib/activity/repository";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { deliveriesRepository } from "@/lib/deliveries/repository";
import { trainingRepository } from "@/lib/training/repository";
import { toCsv } from "@/lib/reports/csv";

export async function buildActivityLogCsv(): Promise<string> {
  const entries = await activityRepository.getActivityLogForExport(500);
  const rows: string[][] = [
    ["Date", "Actor", "Action", "Entity Type", "Entity ID"],
    ...entries.map((e) => [
      new Date(e.created_at).toISOString(),
      e.actor_name ?? "System",
      e.action,
      e.entity_type ?? "",
      e.entity_id ?? "",
    ]),
  ];
  return toCsv(rows);
}

export async function buildSdsReviewCsv(): Promise<string> {
  const items = await chemicalsRepository.getSdsReviewQueue("all", {
    includeResolved: true,
  });
  const rows: string[][] = [
    ["Chemical", "Reason", "Status", "Flagged", "Resolved"],
    ...items.map((i) => [
      i.chemical?.name ?? "Unknown",
      i.reason,
      i.status,
      i.flagged_at,
      i.resolved_at ?? "",
    ]),
  ];
  return toCsv(rows);
}

export async function buildDeliveriesCsv(): Promise<string> {
  const deliveries = await deliveriesRepository.getDeliveries();
  const rows: string[][] = [
    [
      "Order",
      "Supplier",
      "Status",
      "Delivered",
      "Items",
      "Scanned",
      "Pending SDS",
    ],
    ...deliveries.map((d) => {
      const items = d.items ?? [];
      const scanned = items.filter((i) => i.is_scanned).length;
      const pendingSds = items.filter((i) => i.sds_review_needed).length;
      return [
        d.order_number ?? "",
        d.supplier,
        d.status,
        d.delivered_date ?? "",
        String(items.length),
        String(scanned),
        String(pendingSds),
      ];
    }),
  ];
  return toCsv(rows);
}

export async function buildTrainingRecordsCsv(): Promise<string> {
  const records = await trainingRepository.getTrainingRecords();
  const rows: string[][] = [
    ["Worker", "Training Type", "Completed", "Trainer", "Chemical", "Notes"],
    ...records.map((t) => [
      t.worker_name ?? "",
      t.training_type.replace(/_/g, " "),
      t.completed_at,
      t.trainer ?? "",
      t.chemical_name ?? "",
      t.notes ?? "",
    ]),
  ];
  return toCsv(rows);
}
