import { cookies } from "next/headers";
import { demoLogin, demoStore, getDemoSession, isDemoMode } from "@/lib/demo-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { seedOrganizationDemoData } from "@/lib/seed/organization-demo-data";
import type { FacilityType, SessionUser } from "@/types/database";

const DEMO_COOKIE = "safecellar-demo-session";

export async function getSession(): Promise<SessionUser | null> {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    const session = cookieStore.get(DEMO_COOKIE);
    if (session?.value === "active") {
      return getDemoSession();
    }
    return null;
  }

  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, organization_id, organizations(name)")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) return null;

  const orgRow = profile.organizations;
  const organizationName = Array.isArray(orgRow)
    ? (orgRow[0] as { name?: string } | undefined)?.name
    : (orgRow as { name?: string } | null)?.name;

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: profile.full_name,
    role: profile.role,
    organization_id: profile.organization_id,
    organization_name: organizationName ?? "Organization",
  };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) return signInDemo(email, password);

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Supabase is not configured" };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function signUp(input: {
  email: string;
  password: string;
  full_name: string;
  org_name: string;
  facility_type: FacilityType;
  state: string;
}): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    return signInDemo(input.email, input.password);
  }

  const admin = createAdminClient();
  if (!admin) {
    return { success: false, error: "Supabase service role is not configured" };
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  });
  if (authError || !authData.user) {
    return { success: false, error: authError?.message ?? "Could not create user" };
  }

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: input.org_name,
      facility_type: input.facility_type,
      state: input.state,
    })
    .select("id")
    .single();

  if (orgError || !org) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { success: false, error: orgError?.message ?? "Could not create organization" };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: authData.user.id,
    organization_id: org.id,
    full_name: input.full_name,
    role: "admin",
  });

  if (profileError) {
    await admin.from("organizations").delete().eq("id", org.id);
    await admin.auth.admin.deleteUser(authData.user.id);
    return { success: false, error: profileError.message };
  }

  const seed = await seedOrganizationDemoData(admin, {
    organizationId: org.id,
    userId: authData.user.id,
    userFullName: input.full_name,
  });

  if (!seed.ok) {
    await admin.from("profiles").delete().eq("id", authData.user.id);
    await admin.from("organizations").delete().eq("id", org.id);
    await admin.auth.admin.deleteUser(authData.user.id);
    return { success: false, error: seed.error ?? "Could not seed sample data" };
  }

  return signIn(input.email, input.password);
}

export async function signOut(): Promise<void> {
  if (isDemoMode()) {
    await signOutDemo();
    return;
  }

  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function signInDemo(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const user = demoLogin(email, password);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }
  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE, "active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return { success: true };
}

export async function signOutDemo(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_COOKIE);
}

export { demoStore, isDemoMode, getDemoSession };
