import type { SupabaseClient } from "@supabase/supabase-js";
import { seedOrganizationDemoData } from "@/lib/seed/organization-demo-data";

export const MARCUS_DEMO_ACCOUNT = {
  email: "demo@safecellar.app",
  fullName: "Marcus Chen",
  orgName: "Cascade Creek Brewery",
  facilityType: "brewery" as const,
  state: "OR",
};

export type EnsureMarcusResult = {
  ok: boolean;
  error?: string;
  email: string;
  userId?: string;
  organizationId?: string;
  createdUser?: boolean;
  createdOrg?: boolean;
  seeded?: boolean;
  message?: string;
};

async function findUserIdByEmail(
  admin: SupabaseClient,
  email: string
): Promise<string | null> {
  let page = 1;
  const perPage = 200;
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) return null;
    const match = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (match) return match.id;
    if (data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

/** Creates or completes the shared Marcus / Cascade Creek demo login on Supabase. */
export async function ensureMarcusDemoAccount(
  admin: SupabaseClient,
  password: string
): Promise<EnsureMarcusResult> {
  const { email, fullName, orgName, facilityType, state } = MARCUS_DEMO_ACCOUNT;

  let userId = await findUserIdByEmail(admin, email);
  let createdUser = false;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error || !data.user) {
      return { ok: false, error: error?.message ?? "Could not create auth user", email };
    }
    userId = data.user.id;
    createdUser = true;
  } else {
    await admin.auth.admin.updateUserById(userId, { password });
  }

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, organization_id")
    .eq("id", userId)
    .maybeSingle();

  let organizationId = existingProfile?.organization_id ?? null;
  let createdOrg = false;

  if (!organizationId) {
    const { data: org, error: orgError } = await admin
      .from("organizations")
      .insert({
        name: orgName,
        facility_type: facilityType,
        state,
      })
      .select("id")
      .single();

    if (orgError || !org) {
      return {
        ok: false,
        error: orgError?.message ?? "Could not create organization",
        email,
        userId,
      };
    }

    organizationId = org.id;
    createdOrg = true;

    const { error: profileError } = await admin.from("profiles").insert({
      id: userId,
      organization_id: organizationId,
      full_name: fullName,
      role: "admin",
      phone: "503-555-0142",
    });

    if (profileError) {
      await admin.from("organizations").delete().eq("id", organizationId);
      return { ok: false, error: profileError.message, email, userId };
    }
  } else {
    await admin
      .from("profiles")
      .update({ full_name: fullName, role: "admin", phone: "503-555-0142" })
      .eq("id", userId);

    await admin
      .from("organizations")
      .update({ name: orgName, facility_type: facilityType, state })
      .eq("id", organizationId);
  }

  const { count } = await admin
    .from("chemicals")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId);

  let seeded = false;
  if ((count ?? 0) === 0) {
    const seed = await seedOrganizationDemoData(admin, {
      organizationId,
      userId,
      userFullName: fullName,
    });
    if (!seed.ok) {
      return {
        ok: false,
        error: seed.error ?? "Could not seed sample data",
        email,
        userId,
        organizationId,
      };
    }
    seeded = true;
  }

  return {
    ok: true,
    email,
    userId,
    organizationId,
    createdUser,
    createdOrg,
    seeded,
    message: seeded
      ? "Marcus account ready with full sample inventory."
      : "Marcus account exists; inventory already populated (skipped re-seed).",
  };
}
