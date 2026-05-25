import type { ActivityLogEntry } from "@/types/database";

/** Route for drilling into an activity's related record, when available. */
export function getActivityHref(entry: ActivityLogEntry): string | null {
  if (!entry.entity_type || !entry.entity_id) return null;

  switch (entry.entity_type) {
    case "chemical":
      return `/chemicals/${entry.entity_id}`;
    case "delivery":
      return `/deliveries/${entry.entity_id}`;
    case "sds_review":
      return "/sds-review";
    default:
      return null;
  }
}
