import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoMode } from "@/lib/demo-mode";
import { seedOrganizationDemoData } from "@/lib/seed/organization-demo-data";

/** Load prototype sample data for the current org (only when inventory is empty). */
export async function POST() {
  if (isDemoMode()) {
    return NextResponse.json(
      { error: "Not available in demo mode" },
      { status: 400 }
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const { count, error: countError } = await admin
    .from("chemicals")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", session.organization_id);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Sample data already exists for this organization" },
      { status: 409 }
    );
  }

  const seed = await seedOrganizationDemoData(admin, {
    organizationId: session.organization_id,
    userId: session.id,
    userFullName: session.full_name,
  });

  if (!seed.ok) {
    return NextResponse.json({ error: seed.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
