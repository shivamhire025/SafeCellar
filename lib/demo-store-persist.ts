import fs from "node:fs";
import path from "node:path";
import type {
  ActivityLogEntry,
  Chemical,
  Delivery,
  Incident,
  SdsReviewItem,
  Worker,
} from "@/types/database";
import { isDemoMode } from "@/lib/demo-mode";

export type DemoDataSnapshot = {
  chemicals: Chemical[];
  deliveries: Delivery[];
  sdsReviewQueue: SdsReviewItem[];
  workers: Worker[];
  activityLog: ActivityLogEntry[];
  incidents: Incident[];
};

const SNAPSHOT_PATH = path.join(process.cwd(), ".data", "demo-store.json");

function isValidSnapshot(value: unknown): value is DemoDataSnapshot {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.chemicals) &&
    Array.isArray(v.deliveries) &&
    Array.isArray(v.sdsReviewQueue) &&
    Array.isArray(v.workers) &&
    Array.isArray(v.activityLog) &&
    (v.incidents === undefined || Array.isArray(v.incidents))
  );
}

export function normalizeDemoSnapshot(snapshot: DemoDataSnapshot): DemoDataSnapshot {
  return {
    ...snapshot,
    incidents: snapshot.incidents ?? [],
  };
}

export function loadDemoDataSnapshot(fallback: DemoDataSnapshot): DemoDataSnapshot {
  if (!isDemoMode()) return fallback;

  try {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const raw = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
      const parsed: unknown = JSON.parse(raw);
      if (isValidSnapshot(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[SafeCellar] Could not load demo snapshot:", err);
  }

  return fallback;
}

export function saveDemoDataSnapshot(snapshot: DemoDataSnapshot): void {
  if (!isDemoMode()) return;

  try {
    const dir = path.dirname(SNAPSHOT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2), "utf-8");
  } catch (err) {
    console.warn("[SafeCellar] Could not save demo snapshot:", err);
  }
}
