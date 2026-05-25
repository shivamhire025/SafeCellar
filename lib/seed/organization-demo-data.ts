import type { SupabaseClient } from "@supabase/supabase-js";

export type SeedOrganizationInput = {
  organizationId: string;
  userId: string;
  userFullName: string;
};

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysAgoDate(days: number): string {
  return daysAgo(days).split("T")[0];
}

function addMonthsFrom(iso: string, months: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

/** Inserts prototype inventory, deliveries, workers, SDS queue, and activity for a new org. */
export async function seedOrganizationDemoData(
  admin: SupabaseClient,
  input: SeedOrganizationInput
): Promise<{ ok: boolean; error?: string }> {
  const { organizationId, userId, userFullName } = input;

  const chem = {
    naoh: crypto.randomUUID(),
    peracetic: crypto.randomUUID(),
    co2: crypto.randomUUID(),
    iodophor: crypto.randomUUID(),
    phosphoric: crypto.randomUUID(),
  };

  const del = {
    pcs: crypto.randomUUID(),
    bsg: crypto.randomUUID(),
  };

  const item = {
    paa: crypto.randomUUID(),
    naoh: crypto.randomUUID(),
    iodophor: crypto.randomUUID(),
  };

  const { error: orgErr } = await admin
    .from("organizations")
    .update({
      address: "1420 Brewery Lane",
      city: "Portland",
      zip: "97201",
    })
    .eq("id", organizationId);

  if (orgErr) {
    return { ok: false, error: orgErr.message };
  }

  const { error: chemErr } = await admin.from("chemicals").insert([
    {
      id: chem.naoh,
      organization_id: organizationId,
      name: "Sodium Hydroxide",
      trade_name: "CaustiClean Pro",
      manufacturer: "BrewChem Solutions",
      supplier: "Pacific Chemical Supply",
      barcode: "0123456789012",
      cas_number: "1310-73-2",
      chemical_type: "cip",
      storage_location: "Cellar B - Chemical Cage",
      sds_file_path: "/demo/sds/sodium-hydroxide.pdf",
      sds_version: "Rev 4.2, Jan 2025",
      sds_uploaded_at: daysAgo(30),
      sds_last_verified: daysAgo(30),
      sds_review_due_at: addMonthsFrom(daysAgo(30), 12),
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
      id: chem.peracetic,
      organization_id: organizationId,
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
      id: chem.co2,
      organization_id: organizationId,
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
      id: chem.iodophor,
      organization_id: organizationId,
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
      sds_review_due_at: addMonthsFrom(daysAgo(120), 12),
      sds_status: "compliant",
      ppe_required: ["nitrile_gloves", "goggles"],
      hazard_class: ["irritant"],
      is_active: true,
      created_at: daysAgo(200),
      updated_at: daysAgo(120),
    },
    {
      id: chem.phosphoric,
      organization_id: organizationId,
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
  ]);

  if (chemErr) return { ok: false, error: chemErr.message };

  const { error: delErr } = await admin.from("deliveries").insert([
    {
      id: del.pcs,
      organization_id: organizationId,
      order_number: "PCS-2025-0412",
      supplier: "Pacific Chemical Supply",
      order_date: daysAgoDate(10),
      expected_date: daysAgoDate(3),
      delivered_date: daysAgoDate(2),
      status: "inventory_pending",
      created_by: userId,
      created_at: daysAgo(10),
      updated_at: daysAgo(2),
    },
    {
      id: del.bsg,
      organization_id: organizationId,
      order_number: "BSG-8841",
      supplier: "Brewers Supply Group",
      order_date: daysAgoDate(1),
      expected_date: daysAgoDate(-3),
      status: "ordered",
      created_by: userId,
      created_at: daysAgo(1),
      updated_at: daysAgo(1),
    },
  ]);

  if (delErr) return { ok: false, error: delErr.message };

  const { error: itemsErr } = await admin.from("delivery_items").insert([
    {
      id: item.paa,
      delivery_id: del.pcs,
      chemical_id: chem.peracetic,
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
      id: item.naoh,
      delivery_id: del.pcs,
      chemical_id: chem.naoh,
      product_name: "CaustiClean Pro 50%",
      barcode: "0123456789012",
      quantity: 1,
      unit: "gallon",
      is_scanned: true,
      scanned_at: daysAgo(2),
      scanned_by: userId,
      is_new_chemical: false,
      sds_review_needed: false,
      created_at: daysAgo(10),
    },
    {
      id: item.iodophor,
      delivery_id: del.bsg,
      chemical_id: chem.iodophor,
      product_name: "Iodophor Sanitizer 32oz",
      quantity: 4,
      unit: "each",
      is_scanned: false,
      is_new_chemical: false,
      sds_review_needed: false,
      created_at: daysAgo(1),
    },
  ]);

  if (itemsErr) return { ok: false, error: itemsErr.message };

  const { error: reviewErr } = await admin.from("sds_review_queue").insert([
    {
      organization_id: organizationId,
      chemical_id: chem.peracetic,
      reason: "new_chemical",
      status: "pending",
      flagged_at: daysAgo(5),
    },
    {
      organization_id: organizationId,
      chemical_id: chem.co2,
      reason: "annual_review",
      status: "pending",
      flagged_at: daysAgo(35),
    },
    {
      organization_id: organizationId,
      chemical_id: chem.phosphoric,
      reason: "new_chemical",
      status: "pending",
      flagged_at: daysAgo(14),
    },
  ]);

  if (reviewErr) return { ok: false, error: reviewErr.message };

  const { error: workersErr } = await admin.from("workers").insert([
    {
      organization_id: organizationId,
      profile_id: userId,
      full_name: userFullName,
      role_title: "Owner / Head Brewer",
      phone: "503-555-0142",
      language: "en",
      start_date: "2018-03-01",
      is_active: true,
      created_at: daysAgo(90),
      updated_at: daysAgo(1),
    },
    {
      organization_id: organizationId,
      full_name: "Jorge Martinez",
      role_title: "Cellar Worker",
      phone: "503-555-0198",
      language: "en",
      start_date: "2022-06-15",
      is_active: true,
      created_at: daysAgo(60),
      updated_at: daysAgo(60),
    },
  ]);

  if (workersErr) return { ok: false, error: workersErr.message };

  const { error: activityErr } = await admin.from("activity_log").insert([
    {
      organization_id: organizationId,
      actor_id: userId,
      action: "uploaded SDS for Sodium Hydroxide",
      entity_type: "chemical",
      entity_id: chem.naoh,
      created_at: daysAgo(0.5),
    },
    {
      organization_id: organizationId,
      actor_id: userId,
      action: "added new chemical Peracetic Acid",
      entity_type: "chemical",
      entity_id: chem.peracetic,
      created_at: daysAgo(5),
    },
    {
      organization_id: organizationId,
      actor_id: userId,
      action: "marked delivery PCS-2025-0412 as delivered",
      entity_type: "delivery",
      entity_id: del.pcs,
      created_at: daysAgo(2),
    },
    {
      organization_id: organizationId,
      actor_id: userId,
      action: "verified SDS for Iodophor Sanitizer",
      entity_type: "chemical",
      entity_id: chem.iodophor,
      created_at: daysAgo(7),
    },
  ]);

  if (activityErr) return { ok: false, error: activityErr.message };

  return { ok: true };
}
