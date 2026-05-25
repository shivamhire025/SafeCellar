import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { notificationsRepository } from "@/lib/notifications/repository";

export async function GET() {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await notificationsRepository.getHighRiskNotifications();
  return NextResponse.json(notifications);
}
