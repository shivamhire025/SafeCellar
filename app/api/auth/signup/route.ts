import { NextResponse } from "next/server";
import { signUp } from "@/lib/auth";
import type { FacilityType } from "@/types/database";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await signUp({
    email: body.email,
    password: body.password,
    full_name: body.full_name,
    org_name: body.org_name,
    facility_type: (body.facility_type ?? "brewery") as FacilityType,
    state: body.state ?? "",
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
