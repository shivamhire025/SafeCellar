"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BulkImportDialog } from "@/components/chemicals/bulk-import-dialog";
export function ChemicalInventoryActions() {
  return (
    <>
      <Button variant="secondary" asChild>
        <Link href="/compliance">Compliance & Exports</Link>
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
