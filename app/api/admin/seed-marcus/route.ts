import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ensureMarcusDemoAccount,
  MARCUS_DEMO_ACCOUNT,
} from "@/lib/seed/marcus-demo-account";

/**
 * One-time provisioning for the Marcus demo account on production.
 * Requires header: x-seed-secret: <SEED_MARCUS_SECRET>
 * Body (optional): { "password": "your-chosen-password" }
 */
export async function POST(request: Request) {
  const secret = process.env.SEED_MARCUS_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "SEED_MARCUS_SECRET is not configured on the server" },
      { status: 503 }
    );
  }

  const header = request.headers.get("x-seed-secret");
  if (header !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase service role is not configured" },
      { status: 503 }
    );
  }

  let password = process.env.MARCUS_DEMO_PASSWORD ?? "CascadeCreek2025!";
  try {
    const body = await request.json();
    if (body?.password && typeof body.password === "string") {
      password = body.password;
    }
  } catch {
    // empty body is fine
  }

  const result = await ensureMarcusDemoAccount(admin, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    ...result,
    login: {
      email: MARCUS_DEMO_ACCOUNT.email,
      password,
      note: "Set NEXT_PUBLIC_DEMO_MODE=false; sign in at /login with these credentials.",
    },
  });
}
