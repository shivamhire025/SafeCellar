import { NextResponse } from "next/server";
import { signInDemo } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const result = await signInDemo(email, password);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ success: true });
}
