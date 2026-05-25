import { NextResponse } from "next/server";
import { chemicalsRepository } from "@/lib/chemicals/repository";

/** Demo mode: minimal PDF placeholder for SDS viewer iframe */
export async function GET(
  _request: Request,
  { params }: { params: { chemicalId: string } }
) {
  const chemical = await chemicalsRepository.getChemical(params.chemicalId);
  if (!chemical?.sds_file_path) {
    return new NextResponse("SDS not found", { status: 404 });
  }

  const pdf = `%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj
4 0 obj<< /Length 120 >>stream
BT /F1 14 Tf 50 700 Td (SafeCellar Demo SDS) Tj 0 -24 Td (${chemical.name.replace(/[()\\]/g, "")}) Tj ET
endstream endobj
5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj
xref
0 6
trailer<< /Size 6 /Root 1 0 R >>
startxref
0
%%EOF`;

  return new NextResponse(pdf, {
    headers: { "Content-Type": "application/pdf" },
  });
}
