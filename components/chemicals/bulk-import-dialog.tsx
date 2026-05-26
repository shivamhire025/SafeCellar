"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  getChemicalImportTemplateCsv,
  parseChemicalImportCsv,
} from "@/lib/chemical-import";
import { CHEMICAL_IMPORT_HEADERS } from "@/lib/validations/chemical-import";

export function BulkImportDialog() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);

  const parsed = useMemo(
    () => (csvText.trim() ? parseChemicalImportCsv(csvText) : []),
    [csvText]
  );

  const validRows = parsed.filter((r) => r.data);
  const invalidRows = parsed.filter((r) => r.error);

  function downloadTemplate() {
    const blob = new Blob([getChemicalImportTemplateCsv()], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "safecellar-chemical-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(String(reader.result ?? ""));
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (validRows.length === 0) {
      toast({
        title: "Nothing to import",
        description: "Add a valid CSV with at least one row.",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const res = await fetch("/api/chemicals/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: validRows.map((r) => r.data),
        }),
      });
      const data = await res.json();

      if (!res.ok && !data.importedCount) {
        toast({
          title: "Import failed",
          description: data.error ?? "Could not import chemicals",
          variant: "destructive",
        });
        return;
      }

      const count = data.importedCount ?? 0;
      const extraErrors = (data.errors ?? []).length;

      toast({
        title: `Imported ${count} chemical${count === 1 ? "" : "s"}`,
        description:
          extraErrors > 0
            ? `${extraErrors} row(s) skipped. Upload SDS for each new chemical.`
            : "SDS review queue items created. Upload SDS to clear compliance gates.",
        variant: extraErrors > 0 ? "warning" : "success",
      });

      setOpen(false);
      setCsvText("");
      router.refresh();
    } catch {
      toast({
        title: "Import failed",
        description: "Network error. Try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  }

  function resetDialog(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setCsvText("");
  }

  return (
    <Dialog open={open} onOpenChange={resetDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary" type="button">
          <Upload className="h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk import chemicals</DialogTitle>
          <p className="text-sm text-neutral-500">
            Upload or paste a CSV. Required columns:{" "}
            <span className="font-medium text-neutral-700">
              {CHEMICAL_IMPORT_HEADERS.slice(0, 4).join(", ")}
            </span>
            . New chemicals start with missing SDS and appear in the review queue.
          </p>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={downloadTemplate}>
            Download template
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="h-4 w-4" />
            Choose CSV file
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>

        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder={`Paste CSV here, e.g.\n${getChemicalImportTemplateCsv().split("\n").slice(0, 2).join("\n")}`}
          className="w-full min-h-[120px] rounded-md border border-neutral-300 px-3 py-2 text-sm font-mono"
        />

        {parsed.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-4 text-sm">
              <span className="text-brand-700 font-medium">
                {validRows.length} ready to import
              </span>
              {invalidRows.length > 0 && (
                <span className="text-red-600 font-medium">
                  {invalidRows.length} with errors
                </span>
              )}
            </div>

            <div className="border border-neutral-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-neutral-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left font-semibold text-neutral-500">
                      Row
                    </th>
                    <th className="px-2 py-2 text-left font-semibold text-neutral-500">
                      Name
                    </th>
                    <th className="px-2 py-2 text-left font-semibold text-neutral-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {parsed.map((row) => (
                    <tr key={row.rowNumber}>
                      <td className="px-2 py-2 text-neutral-500">{row.rowNumber}</td>
                      <td className="px-2 py-2 font-medium text-neutral-900">
                        {row.data?.name ?? row.raw.name ?? "N/A"}
                      </td>
                      <td className="px-2 py-2">
                        {row.error ? (
                          <span className="text-red-600">{row.error}</span>
                        ) : (
                          <span className="text-brand-700">Valid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => resetDialog(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={importing || validRows.length === 0}
            onClick={handleImport}
          >
            {importing
              ? "Importing…"
              : `Import ${validRows.length} chemical${validRows.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
