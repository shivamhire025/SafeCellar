import { cookies } from "next/headers";
import { demoLogin, demoStore, getDemoSession, isDemoMode } from "@/lib/demo-store";
import type { SessionUser } from "@/types/database";

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
  // Supabase session would be resolved here in production
  return null;
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
