import {
  CHEMICAL_IMPORT_HEADERS,
  chemicalImportRowSchema,
  type ChemicalImportRow,
  type ParsedImportRow,
} from "@/lib/validations/chemical-import";

const HEADER_ALIASES: Record<string, keyof ChemicalImportRow | "hazard_class"> = {
  name: "name",
  chemical_name: "name",
  manufacturer: "manufacturer",
  chemical_type: "chemical_type",
  type: "chemical_type",
  storage_location: "storage_location",
  location: "storage_location",
  trade_name: "trade_name",
  supplier: "supplier",
  cas_number: "cas_number",
  cas: "cas_number",
  barcode: "barcode",
  hazard_class: "hazard_class",
  hazards: "hazard_class",
  notes: "notes",
};

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}

function normalizeChemicalType(value: string): string {
  const v = value.trim().toLowerCase().replace(/\s+/g, "_");
  if (v === "gas" || v === "gas_hazard" || v === "confined_space_gas_hazard") {
    return "gas_hazard";
  }
  if (v === "refrigerant" || v === "process_safety") {
    return "refrigerant";
  }
  if (v === "cip" || v === "cip_chemical") {
    return "cip";
  }
  return v;
}

/** Minimal CSV parser with quoted-field support. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field.trim());
      field = "";
    } else if (char === "\n" || (char === "\r" && next === "\n")) {
      row.push(field.trim());
      field = "";
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      if (char === "\r") i++;
    } else if (char !== "\r") {
      field += char;
    }
  }

  row.push(field.trim());
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  return rows;
}

function rowToRecord(headers: string[], cells: string[]): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((header, index) => {
    const key = HEADER_ALIASES[normalizeHeader(header)];
    if (!key) return;
    const value = cells[index]?.trim() ?? "";
    if (value) record[key] = value;
  });
  return record;
}

function recordToImportRow(
  record: Record<string, string>
): { data?: ChemicalImportRow; error?: string } {
  const hazardRaw = record.hazard_class;
  const hazard_class = hazardRaw
    ? hazardRaw.split(/[,;]/).map((h) => h.trim()).filter(Boolean)
    : undefined;

  const parsed = chemicalImportRowSchema.safeParse({
    name: record.name ?? "",
    manufacturer: record.manufacturer ?? "",
    chemical_type: normalizeChemicalType(record.chemical_type ?? ""),
    storage_location: record.storage_location ?? "",
    trade_name: record.trade_name || undefined,
    supplier: record.supplier || undefined,
    cas_number: record.cas_number || undefined,
    barcode: record.barcode || undefined,
    hazard_class: hazard_class?.length ? hazard_class : undefined,
    notes: record.notes || undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => e.message).join("; ");
    return { error: message };
  }

  return { data: parsed.data };
}

export function parseChemicalImportCsv(text: string): ParsedImportRow[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const matrix = parseCsv(trimmed);
  if (matrix.length === 0) return [];

  const headerRow = matrix[0];
  const normalizedHeaders = headerRow.map(normalizeHeader);
  const hasKnownHeader = normalizedHeaders.some((h) => h in HEADER_ALIASES);

  const dataRows = hasKnownHeader ? matrix.slice(1) : matrix;
  const headers = hasKnownHeader ? headerRow : [...CHEMICAL_IMPORT_HEADERS];

  return dataRows
    .filter((cells) => cells.some((cell) => cell.trim().length > 0))
    .map((cells, index) => {
      const rowNumber = hasKnownHeader ? index + 2 : index + 1;
      const raw = rowToRecord(headers, cells);
      const { data, error } = recordToImportRow(raw);
      return { rowNumber, raw, data, error };
    });
}

export function getChemicalImportTemplateCsv(): string {
  const header = CHEMICAL_IMPORT_HEADERS.join(",");
  const example = [
    "Citric Acid",
    "Five Star Chemicals",
    "standard",
    "Brewhouse - Right Wall",
    "Beer Line Cleaner",
    "Brewers Supply Group",
    "77-92-9",
    "0123456789001",
    "irritant",
    "Bulk import example row",
  ]
    .map((v) => (v.includes(",") ? `"${v}"` : v))
    .join(",");
  return `${header}\n${example}\n`;
}
