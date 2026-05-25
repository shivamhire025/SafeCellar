import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { bugReportSchema } from "@/lib/validations/bug-report";

export async function GET() {
  return NextResponse.json(demoStore.getBugReports());
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bugReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const ticket = demoStore.createBugReport({
    description: parsed.data.description,
    page_url: parsed.data.page_url,
    screenshot_file_name: parsed.data.screenshot_file_name ?? null,
    screenshot_original_url: parsed.data.screenshot_original_url ?? null,
    screenshot_annotated_url:
      parsed.data.screenshot_annotated_url ??
      parsed.data.screenshot_original_url ??
      null,
    annotation_strokes: parsed.data.annotation_strokes ?? null,
  });

  return NextResponse.json(ticket, { status: 201 });
}
