import type {
  ActivityLogEntry,
  Chemical,
  ComplianceStats,
  Delivery,
  DeliveryItem,
  HighRiskNotification,
  BugReportTicket,
  Incident,
  IncidentPhoto,
  IncidentType,
  Organization,
  Profile,
  SdsReviewItem,
  SessionUser,
  Worker,
} from "@/types/database";
import { deriveIncidentStatus } from "@/lib/incident-status";
import { buildHighRiskNotifications } from "@/lib/notifications/build-high-risk-notifications";
import type { ChemicalImportRow } from "@/lib/validations/chemical-import";
import {
  loadDemoDataSnapshot,
  normalizeDemoSnapshot,
  saveDemoDataSnapshot,
  type DemoDataSnapshot,
} from "@/lib/demo-store-persist";

const DEMO_ORG_ID = "org-demo-001";
const DEMO_USER_ID = "user-demo-001";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const demoOrg: Organization = {
  id: DEMO_ORG_ID,
  name: "Cascade Creek Brewery",
  facility_type: "brewery",
  address: "1420 Brewery Lane",
  city: "Portland",
  state: "OR",
  zip: "97201",
  created_at: daysAgo(90),
  updated_at: daysAgo(1),
};

const demoProfile: Profile = {
  id: DEMO_USER_ID,
  organization_id: DEMO_ORG_ID,
  full_name: "Marcus Chen",
  role: "admin",
  phone: "503-555-0142",
  language: "en",
  created_at: daysAgo(90),
  updated_at: daysAgo(1),
};

let chemicals: Chemical[] = [
  {
    id: "chem-001",
    organization_id: DEMO_ORG_ID,
    name: "Sodium Hydroxide",
    trade_name: "CaustiClean Pro",
    manufacturer: "BrewChem Solutions",
    supplier: "Pacific Chemical Supply",
    barcode: "0123456789012",
    cas_number: "1310-73-2",
    molecular_formula: "NaOH",
    chemical_type: "cip",
    storage_location: "Cellar B - Chemical Cage",
    sds_file_path: "/demo/sds/sodium-hydroxide.pdf",
    sds_version: "Rev 4.2, Jan 2025",
    sds_uploaded_at: daysAgo(30),
    sds_last_verified: daysAgo(30),
    sds_review_due_at: addMonths(new Date(daysAgo(30)), 12).toISOString(),
    sds_status: "compliant",
    ppe_required: ["nitrile_gloves", "face_shield", "apron"],
    hazard_class: ["corrosive", "toxic"],
    first_aid_notes:
      "1. Flush skin with water for 20 minutes.\n2. Remove contaminated clothing.\n3. Seek immediate medical attention if pain persists.",
    emergency_contact: "1-800-424-9300",
    is_active: true,
    created_at: daysAgo(60),
    updated_at: daysAgo(30),
  },
  {
    id: "chem-002",
    organization_id: DEMO_ORG_ID,
    name: "Peracetic Acid",
    trade_name: "SanitizeMax 15%",
    manufacturer: "EcoSan Industries",
    supplier: "Pacific Chemical Supply",
    barcode: "0123456789056",
    cas_number: "79-21-0",
    chemical_type: "cip",
    storage_location: "Cellar B - Chemical Cage",
    sds_status: "missing",
    ppe_required: ["nitrile_gloves", "goggles", "respirator"],
    hazard_class: ["corrosive", "oxidizer"],
    first_aid_notes:
      "1. Move to fresh air immediately.\n2. Rinse eyes/skin with water 15+ minutes.\n3. Do NOT induce vomiting. Seek medical help.",
    emergency_contact: "1-800-424-9300",
    is_active: true,
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: "chem-003",
    organization_id: DEMO_ORG_ID,
    name: "Carbon Dioxide",
    trade_name: "Food Grade CO2",
    manufacturer: "AirGas",
    supplier: "AirGas",
    cas_number: "124-38-9",
    chemical_type: "gas_hazard",
    storage_location: "Brewhouse - Tank Farm",
    sds_file_path: "/demo/sds/co2.pdf",
    sds_version: "Rev 2.0",
    sds_uploaded_at: daysAgo(400),
    sds_last_verified: daysAgo(400),
    sds_review_due_at: daysAgo(35),
    sds_status: "review_due",
    ppe_required: ["respirator"],
    hazard_class: ["asphyxiant"],
    first_aid_notes:
      "1. Move victim to fresh air immediately.\n2. Administer oxygen if available.\n3. Call 911. CO2 is IDLH at high concentrations.",
    emergency_contact: "1-800-752-1597",
    is_active: true,
    created_at: daysAgo(400),
    updated_at: daysAgo(400),
  },
  {
    id: "chem-004",
    organization_id: DEMO_ORG_ID,
    name: "Iodophor Sanitizer",
    manufacturer: "Five Star Chemicals",
    supplier: "Brewers Supply Group",
    barcode: "0123456789090",
    chemical_type: "standard",
    storage_location: "Brewhouse - Right Wall",
    sds_file_path: "/demo/sds/iodophor.pdf",
    sds_version: "Rev 1.8",
    sds_uploaded_at: daysAgo(120),
    sds_last_verified: daysAgo(120),
    sds_review_due_at: addMonths(new Date(daysAgo(120)), 12).toISOString(),
    sds_status: "compliant",
    ppe_required: ["nitrile_gloves", "goggles"],
    hazard_class: ["irritant"],
    is_active: true,
    created_at: daysAgo(200),
    updated_at: daysAgo(120),
  },
  {
    id: "chem-005",
    organization_id: DEMO_ORG_ID,
    name: "Phosphoric Acid",
    trade_name: "Beer Stone Remover",
    manufacturer: "Five Star Chemicals",
    supplier: "Brewers Supply Group",
    chemical_type: "standard",
    storage_location: "Brewhouse - Right Wall",
    sds_status: "missing",
    hazard_class: ["corrosive"],
    is_active: true,
    created_at: daysAgo(14),
    updated_at: daysAgo(14),
  },
];

let deliveries: Delivery[] = [
  {
    id: "del-001",
    organization_id: DEMO_ORG_ID,
    order_number: "PCS-2025-0412",
    supplier: "Pacific Chemical Supply",
    order_date: daysAgo(10).split("T")[0],
    expected_date: daysAgo(3).split("T")[0],
    delivered_date: daysAgo(2).split("T")[0],
    status: "inventory_pending",
    created_by: DEMO_USER_ID,
    created_at: daysAgo(10),
    updated_at: daysAgo(2),
    items: [
      {
        id: "item-001",
        delivery_id: "del-001",
        chemical_id: "chem-002",
        product_name: "SanitizeMax 15% Peracetic Acid",
        barcode: "0123456789056",
        quantity: 2,
        unit: "gallon",
        is_scanned: false,
        is_new_chemical: true,
        sds_review_needed: true,
        created_at: daysAgo(10),
      },
      {
        id: "item-002",
        delivery_id: "del-001",
        chemical_id: "chem-001",
        product_name: "CaustiClean Pro 50%",
        barcode: "0123456789012",
        quantity: 1,
        unit: "gallon",
        is_scanned: true,
        scanned_at: daysAgo(2),
        scanned_by: DEMO_USER_ID,
        is_new_chemical: false,
        sds_review_needed: false,
        created_at: daysAgo(10),
      },
    ],
  },
  {
    id: "del-002",
    organization_id: DEMO_ORG_ID,
    order_number: "BSG-8841",
    supplier: "Brewers Supply Group",
    order_date: daysAgo(1).split("T")[0],
    expected_date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    status: "ordered",
    created_by: DEMO_USER_ID,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    items: [
      {
        id: "item-003",
        delivery_id: "del-002",
        chemical_id: "chem-004",
        product_name: "Iodophor Sanitizer 32oz",
        quantity: 4,
        unit: "each",
        is_scanned: false,
        is_new_chemical: false,
        sds_review_needed: false,
        created_at: daysAgo(1),
      },
    ],
  },
];

let sdsReviewQueue: SdsReviewItem[] = [
  {
    id: "review-001",
    organization_id: DEMO_ORG_ID,
    chemical_id: "chem-002",
    reason: "new_chemical",
    status: "pending",
    flagged_at: daysAgo(5),
  },
  {
    id: "review-002",
    organization_id: DEMO_ORG_ID,
    chemical_id: "chem-003",
    reason: "annual_review",
    status: "pending",
    flagged_at: daysAgo(35),
  },
  {
    id: "review-003",
    organization_id: DEMO_ORG_ID,
    chemical_id: "chem-005",
    reason: "new_chemical",
    status: "pending",
    flagged_at: daysAgo(14),
  },
];

let workers: Worker[] = [
  {
    id: "worker-001",
    organization_id: DEMO_ORG_ID,
    profile_id: DEMO_USER_ID,
    full_name: "Marcus Chen",
    role_title: "Owner / Head Brewer",
    phone: "503-555-0142",
    email: "marcus@cascadecreek.demo",
    language: "en",
    start_date: "2018-03-01",
    is_active: true,
    created_at: daysAgo(90),
    updated_at: daysAgo(1),
  },
  {
    id: "worker-002",
    organization_id: DEMO_ORG_ID,
    full_name: "Jorge Martinez",
    role_title: "Cellar Worker",
    phone: "503-555-0198",
    language: "en",
    start_date: "2022-06-15",
    is_active: true,
    created_at: daysAgo(60),
    updated_at: daysAgo(60),
  },
];

let activityLog: ActivityLogEntry[] = [
  {
    id: "act-001",
    organization_id: DEMO_ORG_ID,
    actor_id: DEMO_USER_ID,
    actor_name: "Marcus Chen",
    action: "uploaded SDS for Sodium Hydroxide",
    entity_type: "chemical",
    entity_id: "chem-001",
    created_at: daysAgo(0.5),
  },
  {
    id: "act-002",
    organization_id: DEMO_ORG_ID,
    actor_id: DEMO_USER_ID,
    actor_name: "Marcus Chen",
    action: "added new chemical Peracetic Acid",
    entity_type: "chemical",
    entity_id: "chem-002",
    created_at: daysAgo(5),
  },
  {
    id: "act-003",
    organization_id: DEMO_ORG_ID,
    actor_id: DEMO_USER_ID,
    actor_name: "Marcus Chen",
    action: "marked delivery PCS-2025-0412 as delivered",
    entity_type: "delivery",
    entity_id: "del-001",
    created_at: daysAgo(2),
  },
  {
    id: "act-004",
    organization_id: DEMO_ORG_ID,
    actor_id: DEMO_USER_ID,
    actor_name: "Marcus Chen",
    action: "verified SDS for Iodophor Sanitizer",
    entity_type: "chemical",
    entity_id: "chem-004",
    created_at: daysAgo(7),
  },
];

const DEMO_PLACEHOLDER_PHOTO =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

let bugReports: BugReportTicket[] = [];

let incidents: Incident[] = [
  {
    id: "inc-001",
    organization_id: DEMO_ORG_ID,
    incident_type: "near_miss",
    status: "incomplete",
    occurred_at: daysAgo(2),
    location: "Cellar B — tank pad",
    description:
      "Operator slipped on wet floor near CIP line but caught railing. No injury. Area was not cordoned after sanitizer rinse.",
    notes: "Need drip trays and wet-floor signage after CIP cycles.",
    chemical_exposure: true,
    chemical_ids: ["chem-002"],
    exposure_details: "Possible peracetic acid residue on floor; no skin contact.",
    conditions: "Wet or slippery floor, Poor lighting",
    photos: [],
    reported_by_id: DEMO_USER_ID,
    reported_by_name: "Marcus Chen",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
  {
    id: "inc-002",
    organization_id: DEMO_ORG_ID,
    incident_type: "injury",
    status: "complete",
    occurred_at: daysAgo(14),
    location: "Brewhouse — mash tun platform",
    description:
      "Minor laceration on forearm from sharp edge on guard panel while clearing blockage. First aid applied on site.",
    notes: "Guard panel scheduled for replacement.",
    chemical_exposure: false,
    chemical_ids: null,
    exposure_details: null,
    conditions: "Equipment malfunction",
    photos: [
      {
        id: "photo-inc-002-1",
        file_name: "guard-panel-edge.jpg",
        original_data_url: DEMO_PLACEHOLDER_PHOTO,
        annotated_data_url: DEMO_PLACEHOLDER_PHOTO,
        annotation_strokes: null,
        caption: "Sharp edge on guard panel",
        uploaded_at: daysAgo(14),
      },
    ],
    reported_by_id: DEMO_USER_ID,
    reported_by_name: "Marcus Chen",
    created_at: daysAgo(14),
    updated_at: daysAgo(14),
  },
];

function getDemoDataSnapshot(): DemoDataSnapshot {
  return {
    chemicals,
    deliveries,
    sdsReviewQueue,
    workers,
    activityLog,
    incidents,
    bugReports,
  };
}

function applyDemoDataSnapshot(snapshot: DemoDataSnapshot) {
  const normalized = normalizeDemoSnapshot(snapshot);
  chemicals = normalized.chemicals;
  deliveries = normalized.deliveries;
  sdsReviewQueue = normalized.sdsReviewQueue;
  workers = normalized.workers;
  activityLog = normalized.activityLog;
  incidents = normalized.incidents;
  bugReports = normalized.bugReports;
}

applyDemoDataSnapshot(
  normalizeDemoSnapshot(loadDemoDataSnapshot(getDemoDataSnapshot()))
);

function persistDemoState() {
  saveDemoDataSnapshot(getDemoDataSnapshot());
}

function attachChemicalsToReviews(): SdsReviewItem[] {
  return sdsReviewQueue.map((item) => ({
    ...item,
    chemical: chemicals.find((c) => c.id === item.chemical_id),
  }));
}

export { isDemoMode } from "@/lib/demo-mode";

export function getDemoSession(): SessionUser {
  return {
    id: DEMO_USER_ID,
    email: "demo@safecellar.app",
    full_name: demoProfile.full_name,
    role: demoProfile.role,
    organization_id: DEMO_ORG_ID,
    organization_name: demoOrg.name,
  };
}

export function demoLogin(email: string, _password: string): SessionUser | null {
  if (email === "demo@safecellar.app" || email.includes("@")) {
    return getDemoSession();
  }
  return null;
}

export const demoStore = {
  getOrganization(): Organization {
    return demoOrg;
  },

  getChemicals(filters?: {
    sds_status?: string;
    search?: string;
  }): Chemical[] {
    let result = chemicals.filter((c) => c.is_active);
    if (filters?.sds_status && filters.sds_status !== "all") {
      result = result.filter((c) => c.sds_status === filters.sds_status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.trade_name?.toLowerCase().includes(q) ||
          c.manufacturer?.toLowerCase().includes(q) ||
          c.supplier?.toLowerCase().includes(q) ||
          c.cas_number?.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getChemical(id: string): Chemical | undefined {
    return chemicals.find((c) => c.id === id);
  },

  getChemicalByBarcode(barcode: string): Chemical | undefined {
    return chemicals.find((c) => c.barcode === barcode);
  },

  createChemical(
    data: Omit<Chemical, "id" | "organization_id" | "created_at" | "updated_at" | "is_active" | "sds_status"> & {
      sds_status?: Chemical["sds_status"];
    }
  ): Chemical {
    const chemical: Chemical = {
      ...data,
      id: `chem-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      sds_status: data.sds_status ?? "missing",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    chemicals.push(chemical);
    sdsReviewQueue.push({
      id: `review-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      chemical_id: chemical.id,
      reason: "new_chemical",
      status: "pending",
      flagged_at: new Date().toISOString(),
    });
    activityLog.unshift({
      id: `act-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      actor_id: DEMO_USER_ID,
      actor_name: "Marcus Chen",
      action: `added new chemical ${chemical.name}`,
      entity_type: "chemical",
      entity_id: chemical.id,
      created_at: new Date().toISOString(),
    });
    persistDemoState();
    return chemical;
  },

  importChemicals(rows: ChemicalImportRow[]): {
    created: Chemical[];
    errors: { row: number; message: string }[];
  } {
    const created: Chemical[] = [];
    const errors: { row: number; message: string }[] = [];
    const base = Date.now();

    rows.forEach((row, index) => {
      const chemical: Chemical = {
        id: `chem-${base}-${index}`,
        organization_id: DEMO_ORG_ID,
        name: row.name,
        trade_name: row.trade_name ?? null,
        manufacturer: row.manufacturer,
        supplier: row.supplier ?? null,
        cas_number: row.cas_number ?? null,
        barcode: row.barcode ?? null,
        chemical_type: row.chemical_type,
        storage_location: row.storage_location,
        notes: row.notes ?? null,
        hazard_class: row.hazard_class ?? null,
        sds_status: "missing",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      chemicals.push(chemical);
      sdsReviewQueue.push({
        id: `review-${base}-${index}`,
        organization_id: DEMO_ORG_ID,
        chemical_id: chemical.id,
        reason: "new_chemical",
        status: "pending",
        flagged_at: new Date().toISOString(),
      });
      created.push(chemical);
    });

    if (created.length > 0) {
      activityLog.unshift({
        id: `act-${base}`,
        organization_id: DEMO_ORG_ID,
        actor_id: DEMO_USER_ID,
        actor_name: "Marcus Chen",
        action: `bulk imported ${created.length} chemical${created.length === 1 ? "" : "s"}`,
        entity_type: "chemical",
        entity_id: created[0].id,
        created_at: new Date().toISOString(),
      });
    }

    persistDemoState();
    return { created, errors };
  },

  updateChemical(id: string, data: Partial<Chemical>): Chemical | undefined {
    const idx = chemicals.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    chemicals[idx] = {
      ...chemicals[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    persistDemoState();
    return chemicals[idx];
  },

  uploadSds(
    id: string,
    filePath: string,
    version: string
  ): Chemical | undefined {
    const now = new Date().toISOString();
    const reviewDue = addMonths(new Date(), 12).toISOString();
    const chemical = this.updateChemical(id, {
      sds_file_path: filePath,
      sds_version: version,
      sds_uploaded_at: now,
      sds_last_verified: now,
      sds_review_due_at: reviewDue,
      sds_status: "compliant",
    });
    if (chemical) {
      sdsReviewQueue = sdsReviewQueue.map((r) =>
        r.chemical_id === id && r.status === "pending"
          ? { ...r, status: "resolved" as const, resolved_at: now }
          : r
      );
      activityLog.unshift({
        id: `act-${Date.now()}`,
        organization_id: DEMO_ORG_ID,
        actor_id: DEMO_USER_ID,
        actor_name: "Marcus Chen",
        action: `uploaded SDS for ${chemical.name}`,
        entity_type: "chemical",
        entity_id: id,
        created_at: now,
      });
      persistDemoState();
    }
    return chemical;
  },

  verifySds(id: string): Chemical | undefined {
    const now = new Date().toISOString();
    const reviewDue = addMonths(new Date(), 12).toISOString();
    return this.updateChemical(id, {
      sds_last_verified: now,
      sds_review_due_at: reviewDue,
      sds_status: "compliant",
    });
  },

  getDeliveries(status?: string): Delivery[] {
    let result = [...deliveries].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (status && status !== "all") {
      result = result.filter((d) => d.status === status);
    }
    return result.map((d) => ({
      ...d,
      items: d.items ?? [],
    }));
  },

  getDelivery(id: string): Delivery | undefined {
    const d = deliveries.find((del) => del.id === id);
    return d ? { ...d, items: d.items ?? [] } : undefined;
  },

  createDelivery(
    data: Omit<Delivery, "id" | "organization_id" | "created_at" | "updated_at" | "status">,
    items: Omit<DeliveryItem, "id" | "delivery_id" | "created_at">[]
  ): Delivery {
    const deliveryId = `del-${Date.now()}`;
    const delivery: Delivery = {
      ...data,
      id: deliveryId,
      organization_id: DEMO_ORG_ID,
      status: "ordered",
      created_by: DEMO_USER_ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items.map((item, i) => ({
        ...item,
        id: `item-${Date.now()}-${i}`,
        delivery_id: deliveryId,
        is_scanned: false,
        is_new_chemical: item.is_new_chemical ?? false,
        sds_review_needed: item.sds_review_needed ?? false,
        created_at: new Date().toISOString(),
      })),
    };
    deliveries.unshift(delivery);
    persistDemoState();
    return delivery;
  },

  updateDelivery(id: string, data: Partial<Delivery>): Delivery | undefined {
    const idx = deliveries.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    deliveries[idx] = {
      ...deliveries[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    persistDemoState();
    return deliveries[idx];
  },

  scanDeliveryItem(
    deliveryId: string,
    itemId: string,
    barcode?: string
  ): DeliveryItem | undefined {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery?.items) return undefined;
    const itemIdx = delivery.items.findIndex((i) => i.id === itemId);
    if (itemIdx === -1) return undefined;

    const item = delivery.items[itemIdx];
    const matchedChemical = barcode
      ? chemicals.find((c) => c.barcode === barcode)
      : item.chemical_id
        ? chemicals.find((c) => c.id === item.chemical_id)
        : undefined;

    delivery.items[itemIdx] = {
      ...item,
      is_scanned: true,
      scanned_at: new Date().toISOString(),
      scanned_by: DEMO_USER_ID,
      chemical_id: matchedChemical?.id ?? item.chemical_id,
      barcode: barcode ?? item.barcode,
      is_new_chemical: !matchedChemical && !!barcode,
      sds_review_needed:
        !matchedChemical || matchedChemical.sds_status !== "compliant",
    };

    const scanned = delivery.items.filter((i) => i.is_scanned).length;
    const total = delivery.items.length;
    if (scanned === total) {
      delivery.status = "complete";
    } else if (delivery.status === "delivered") {
      delivery.status = "inventory_pending";
    }

    persistDemoState();
    return delivery.items[itemIdx];
  },

  getSdsReviewQueue(status?: string): SdsReviewItem[] {
    let result = attachChemicalsToReviews();
    if (status && status !== "all") {
      result = result.filter((r) => r.status === status);
    }
    return result.filter((r) => r.status !== "resolved");
  },

  getWorkers(): Worker[] {
    return workers.filter((w) => w.is_active);
  },

  getActivityLog(limit = 10): ActivityLogEntry[] {
    return activityLog.slice(0, limit);
  },

  getComplianceStats(): ComplianceStats {
    const active = chemicals.filter((c) => c.is_active);
    const compliant = active.filter((c) => c.sds_status === "compliant").length;
    const missing = active.filter((c) => c.sds_status === "missing").length;
    const reviewDue = active.filter((c) => c.sds_status === "review_due").length;
    const total = active.length;
    const score = total === 0 ? 0 : Math.round((compliant / total) * 100);
    const pendingDeliveries = deliveries.filter(
      (d) => d.status === "inventory_pending" || d.status === "delivered"
    ).length;
    const reviewQueueCount = sdsReviewQueue.filter(
      (r) => r.status !== "resolved"
    ).length;

    return {
      score,
      totalChemicals: total,
      compliantCount: compliant,
      missingCount: missing,
      reviewDueCount: reviewDue,
      pendingDeliveries,
      reviewQueueCount,
      needsAttention: missing + reviewDue + reviewQueueCount,
    };
  },

  getPendingActions() {
    const actions: {
      id: string;
      type: "missing_sds" | "review_due" | "delivery";
      title: string;
      subtitle: string;
      href: string;
      badge: "missing" | "review_due" | "delivery";
    }[] = [];

    chemicals
      .filter((c) => c.sds_status === "missing")
      .forEach((c) => {
        actions.push({
          id: `missing-${c.id}`,
          type: "missing_sds",
          title: c.name,
          subtitle: "SDS missing. Compliance gate active.",
          href: `/chemicals/${c.id}`,
          badge: "missing",
        });
      });

    chemicals
      .filter((c) => c.sds_status === "review_due")
      .forEach((c) => {
        actions.push({
          id: `review-${c.id}`,
          type: "review_due",
          title: c.name,
          subtitle: "Annual SDS review due",
          href: `/chemicals/${c.id}`,
          badge: "review_due",
        });
      });

    deliveries
      .filter((d) => d.status === "inventory_pending")
      .forEach((d) => {
        const unscanned = (d.items ?? []).filter((i) => !i.is_scanned).length;
        actions.push({
          id: `delivery-${d.id}`,
          type: "delivery",
          title: `Delivery ${d.order_number ?? d.supplier}`,
          subtitle: `${unscanned} items pending inventory scan`,
          href: `/deliveries/${d.id}`,
          badge: "delivery",
        });
      });

    return actions;
  },

  getHighRiskNotifications(): HighRiskNotification[] {
    return buildHighRiskNotifications({
      chemicals,
      reviewQueue: attachChemicalsToReviews(),
      deliveries,
      incidents,
    });
  },

  getIncidents(filters?: {
    incident_type?: IncidentType;
    status?: Incident["status"];
  }): Incident[] {
    let result = [...incidents].sort(
      (a, b) =>
        new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
    );
    if (filters?.incident_type) {
      result = result.filter((i) => i.incident_type === filters.incident_type);
    }
    if (filters?.status) {
      result = result.filter((i) => i.status === filters.status);
    }
    return result.map((i) => ({
      ...i,
      status: deriveIncidentStatus(i.photos),
    }));
  },

  getIncident(id: string): Incident | undefined {
    const incident = incidents.find((i) => i.id === id);
    if (!incident) return undefined;
    return {
      ...incident,
      status: deriveIncidentStatus(incident.photos),
    };
  },

  createIncident(
    data: Omit<
      Incident,
      | "id"
      | "organization_id"
      | "status"
      | "photos"
      | "created_at"
      | "updated_at"
      | "reported_by_id"
      | "reported_by_name"
    > & { photos?: IncidentPhoto[] }
  ): Incident {
    const photos = data.photos ?? [];
    const incident: Incident = {
      id: `inc-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      incident_type: data.incident_type,
      occurred_at: data.occurred_at,
      location: data.location,
      description: data.description,
      notes: data.notes ?? null,
      chemical_exposure: data.chemical_exposure,
      chemical_ids: data.chemical_ids ?? null,
      exposure_details: data.exposure_details ?? null,
      conditions: data.conditions ?? null,
      photos,
      reported_by_id: DEMO_USER_ID,
      reported_by_name: "Marcus Chen",
      status: deriveIncidentStatus(photos),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    incidents.unshift(incident);
    activityLog.unshift({
      id: `act-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      actor_id: DEMO_USER_ID,
      actor_name: "Marcus Chen",
      action: `logged ${data.incident_type.replace("_", " ")} incident at ${data.location}`,
      entity_type: "incident",
      entity_id: incident.id,
      created_at: new Date().toISOString(),
    });
    persistDemoState();
    return incident;
  },

  updateIncident(
    id: string,
    data: Partial<
      Omit<Incident, "id" | "organization_id" | "status" | "created_at">
    >
  ): Incident | undefined {
    const idx = incidents.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    const updated: Incident = {
      ...incidents[idx],
      ...data,
      status: deriveIncidentStatus(
        data.photos ?? incidents[idx].photos
      ),
      updated_at: new Date().toISOString(),
    };
    incidents[idx] = updated;
    persistDemoState();
    return updated;
  },

  addIncidentPhoto(
    incidentId: string,
    photo: Omit<IncidentPhoto, "id" | "uploaded_at">
  ): IncidentPhoto | undefined {
    const idx = incidents.findIndex((i) => i.id === incidentId);
    if (idx === -1) return undefined;
    const newPhoto: IncidentPhoto = {
      ...photo,
      id: `photo-${Date.now()}`,
      uploaded_at: new Date().toISOString(),
    };
    incidents[idx].photos.push(newPhoto);
    incidents[idx].status = deriveIncidentStatus(incidents[idx].photos);
    incidents[idx].updated_at = new Date().toISOString();
    persistDemoState();
    return newPhoto;
  },

  updateIncidentPhoto(
    incidentId: string,
    photoId: string,
    data: Partial<
      Pick<
        IncidentPhoto,
        "annotation_strokes" | "annotated_data_url" | "caption"
      >
    >
  ): IncidentPhoto | undefined {
    const incident = incidents.find((i) => i.id === incidentId);
    if (!incident) return undefined;
    const photoIdx = incident.photos.findIndex((p) => p.id === photoId);
    if (photoIdx === -1) return undefined;
    incident.photos[photoIdx] = {
      ...incident.photos[photoIdx],
      ...data,
    };
    incident.status = deriveIncidentStatus(incident.photos);
    incident.updated_at = new Date().toISOString();
    persistDemoState();
    return incident.photos[photoIdx];
  },

  removeIncidentPhoto(incidentId: string, photoId: string): boolean {
    const idx = incidents.findIndex((i) => i.id === incidentId);
    if (idx === -1) return false;
    const before = incidents[idx].photos.length;
    incidents[idx].photos = incidents[idx].photos.filter(
      (p) => p.id !== photoId
    );
    if (incidents[idx].photos.length === before) return false;
    incidents[idx].status = deriveIncidentStatus(incidents[idx].photos);
    incidents[idx].updated_at = new Date().toISOString();
    persistDemoState();
    return true;
  },

  getBugReports(): BugReportTicket[] {
    return [...bugReports].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  getBugReport(id: string): BugReportTicket | undefined {
    return bugReports.find((t) => t.id === id);
  },

  createBugReport(
    data: Omit<
      BugReportTicket,
      | "id"
      | "organization_id"
      | "status"
      | "reported_by_id"
      | "reported_by_name"
      | "created_at"
      | "updated_at"
    >
  ): BugReportTicket {
    const ticket: BugReportTicket = {
      id: `bug-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      status: "open",
      reported_by_id: DEMO_USER_ID,
      reported_by_name: "Marcus Chen",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    bugReports.unshift(ticket);
    activityLog.unshift({
      id: `act-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      actor_id: DEMO_USER_ID,
      actor_name: "Marcus Chen",
      action: "submitted a bug report",
      entity_type: "bug_report",
      entity_id: ticket.id,
      created_at: new Date().toISOString(),
    });
    persistDemoState();
    return ticket;
  },

  updateBugReportStatus(
    id: string,
    status: BugReportTicket["status"]
  ): BugReportTicket | undefined {
    const idx = bugReports.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    bugReports[idx] = {
      ...bugReports[idx],
      status,
      updated_at: new Date().toISOString(),
    };
    persistDemoState();
    return bugReports[idx];
  },
};
