import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { chemicalImportRowSchema } from "@/lib/validations/chemical-import";

export async function POST(request: Request) {
  const body = await request.json();
  const rows = Array.isArray(body.rows) ? body.rows : [];

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No rows to import" },
      { status: 400 }
    );
  }

  const validRows: Parameters<typeof demoStore.importChemicals>[0] = [];
  const errors: { row: number; message: string }[] = [];

  rows.forEach((row: unknown, index: number) => {
    const parsed = chemicalImportRowSchema.safeParse(row);
    if (!parsed.success) {
      errors.push({
        row: index + 1,
        message: parsed.error.errors.map((e) => e.message).join("; "),
      });
      return;
    }
    validRows.push(parsed.data);
  });

  if (validRows.length === 0) {
    return NextResponse.json(
      { created: [], errors, importedCount: 0 },
      { status: 422 }
    );
  }

  const result = demoStore.importChemicals(validRows);

  return NextResponse.json({
    created: result.created,
    errors: [...errors, ...result.errors],
    importedCount: result.created.length,
  });
}
