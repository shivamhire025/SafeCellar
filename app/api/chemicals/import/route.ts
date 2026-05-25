import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { chemicalsRepository } from "@/lib/chemicals/repository";
import { isDemoMode } from "@/lib/demo-mode";
import { chemicalImportRowSchema } from "@/lib/validations/chemical-import";
import type { ChemicalImportRow } from "@/lib/validations/chemical-import";

export async function POST(request: Request) {
  if (!isDemoMode() && !(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const rows = Array.isArray(body.rows) ? body.rows : [];

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No rows to import" },
      { status: 400 }
    );
  }

  const validRows: ChemicalImportRow[] = [];
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

  const result = await chemicalsRepository.importChemicals(validRows);

  return NextResponse.json({
    created: result.created,
    errors: [...errors, ...result.errors],
    importedCount: result.created.length,
  });
}
