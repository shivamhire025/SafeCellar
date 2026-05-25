import { NextResponse } from "next/server";
import { signOutDemo } from "@/lib/auth";

export async function POST() {
  await signOutDemo();
  return NextResponse.json({ success: true });
}
