import { INCIDENT_TYPES, SDS_REVIEW_REASONS } from "@/lib/constants";
import { deriveIncidentStatus } from "@/lib/incident-status";
import type {
  Chemical,
  Delivery,
  HighRiskNotification,
  HighRiskNotificationPriority,
  Incident,
  IncidentType,
  SdsReviewItem,
} from "@/types/database";

const SEVERE_HAZARDS = new Set(["toxic", "corrosive", "oxidizer", "asphyxiant"]);

const PRIORITY_RANK: Record<HighRiskNotificationPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
};

function chemicalRiskPriority(c: Chemical): HighRiskNotificationPriority {
  if (c.chemical_type === "gas_hazard") return "critical";
  if (
    c.sds_status === "missing" &&
    c.hazard_class?.some((h) => SEVERE_HAZARDS.has(h))
  ) {
    return "critical";
  }
  if (c.sds_status === "missing" || c.sds_status === "review_due") {
    return "high";
  }
  return "medium";
}

export function buildHighRiskNotifications(input: {
  chemicals: Chemical[];
  reviewQueue: SdsReviewItem[];
  deliveries: Delivery[];
  incidents: Incident[];
}): HighRiskNotification[] {
  const { chemicals, reviewQueue, deliveries, incidents } = input;
  const seen = new Set<string>();
  const notifications: HighRiskNotification[] = [];

  function push(notification: HighRiskNotification) {
    if (seen.has(notification.id)) return;
    seen.add(notification.id);
    notifications.push(notification);
  }

  chemicals
    .filter((c) => c.is_active && c.sds_status === "missing")
    .forEach((c) => {
      push({
        id: `missing-${c.id}`,
        priority: chemicalRiskPriority(c),
        title: c.name,
        subtitle:
          c.chemical_type === "gas_hazard"
            ? "Missing SDS — confined space gas hazard"
            : "SDS missing. Upload before use.",
        href: `/chemicals/${c.id}#sds-upload`,
        badge: c.chemical_type === "gas_hazard" ? "gas_hazard" : "missing",
      });
    });

  chemicals
    .filter((c) => c.is_active && c.sds_status === "review_due")
    .forEach((c) => {
      push({
        id: `review-${c.id}`,
        priority: chemicalRiskPriority(c),
        title: c.name,
        subtitle:
          c.chemical_type === "gas_hazard"
            ? "Annual SDS review overdue — gas hazard"
            : "Annual SDS review due",
        href: `/chemicals/${c.id}`,
        badge: c.chemical_type === "gas_hazard" ? "gas_hazard" : "review_due",
      });
    });

  reviewQueue
    .filter((r) => r.status !== "resolved")
    .forEach((item) => {
      if (
        seen.has(`missing-${item.chemical_id}`) ||
        seen.has(`review-${item.chemical_id}`)
      ) {
        return;
      }
      const chemical = item.chemical;
      const reasonLabel =
        SDS_REVIEW_REASONS.find((r) => r.value === item.reason)?.label ??
        item.reason;
      push({
        id: `queue-${item.id}`,
        priority: chemical ? chemicalRiskPriority(chemical) : "medium",
        title: chemical?.name ?? "Unknown chemical",
        subtitle: `SDS review queue — ${reasonLabel}`,
        href: `/chemicals/${item.chemical_id}#sds-upload`,
        badge: "sds_queue",
      });
    });

  deliveries
    .filter((d) => d.status === "inventory_pending")
    .forEach((d) => {
      const unscanned = (d.items ?? []).filter((i) => !i.is_scanned);
      const needsSds = unscanned.filter((i) => i.sds_review_needed).length;
      push({
        id: `delivery-${d.id}`,
        priority: needsSds > 0 ? "high" : "medium",
        title: `Delivery ${d.order_number ?? d.supplier}`,
        subtitle:
          needsSds > 0
            ? `${unscanned.length} items to scan (${needsSds} need SDS review)`
            : `${unscanned.length} items pending inventory scan`,
        href: `/deliveries/${d.id}`,
        badge: "delivery",
      });
    });

  const incidentTypeLabels = Object.fromEntries(
    INCIDENT_TYPES.map((t) => [t.value, t.label])
  ) as Record<IncidentType, string>;

  incidents
    .filter((i) => deriveIncidentStatus(i.photos) === "incomplete")
    .forEach((incident) => {
      const typeLabel =
        incidentTypeLabels[incident.incident_type] ?? incident.incident_type;
      const priority: HighRiskNotificationPriority =
        incident.incident_type === "injury" ||
        incident.incident_type === "illness" ||
        incident.chemical_exposure
          ? "high"
          : "medium";
      push({
        id: `incident-${incident.id}`,
        priority,
        title: `${typeLabel} — ${incident.location}`,
        subtitle: "Incident log incomplete — add photo documentation",
        href: `/incidents/${incident.id}`,
        badge: "incident_incomplete",
      });
    });

  return notifications.sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  );
}
