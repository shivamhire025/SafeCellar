"use client";

import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BulkImportDialog } from "@/components/chemicals/bulk-import-dialog";
import { AbbreviationText } from "@/components/shared/abbreviation-tooltip";

export function ChemicalInventoryActions() {
  return (
    <>
      <Button variant="secondary" asChild>
        <a href="/api/reports/hazcom?format=pdf" download>
          <Download className="h-4 w-4" />
          <AbbreviationText text="HazCom PDF" />
        </a>
      </Button>
      <Button variant="secondary" asChild>
        <a href="/api/reports/inspection-packet" download>
          <Download className="h-4 w-4" />
          Inspection packet
        </a>
      </Button>
      <BulkImportDialog />
      <Button asChild>
        <Link href="/chemicals/new">
          <Plus className="h-4 w-4" />
          Add Chemical
        </Link>
      </Button>
    </>
  );
}
