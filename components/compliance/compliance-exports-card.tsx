"use client";

import { getComplianceTerminology } from "@/lib/compliance/terminology";
import type { Organization } from "@/types/database";
import { DownloadButton } from "@/components/compliance/download-button";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const csvExports = [
  { href: "/api/reports/activity", label: "Activity log (CSV)" },
  { href: "/api/reports/sds-review", label: "SDS review queue (CSV)" },
  { href: "/api/reports/deliveries", label: "Delivery compliance (CSV)" },
  { href: "/api/reports/training-records", label: "Training records (CSV)" },
];

export function ComplianceExportsCard({ org }: { org: Organization }) {
  const terms = getComplianceTerminology(org.regulatory_profile);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 max-w-3xl">
      <h3 className="text-base font-semibold text-neutral-900 mb-2">Exports</h3>
      <p className="text-sm text-neutral-500 mb-4">
        Download documentation for {terms.inspectionContext}. Not government
        filing. Prepare and print or share with inspectors.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <DownloadButton
          href="/api/reports/compliance-packet"
          label={`Download ${terms.packetTitle}`}
          variant="default"
        />
        <DownloadButton
          href="/api/reports/hazcom?format=pdf"
          label="Written program (PDF)"
        />
        <DownloadButton
          href="/api/reports/hazcom"
          label="Written program (HTML)"
        />
      </div>

      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
        Audit spreadsheets
      </p>
      <div className="flex flex-wrap gap-2">
        {csvExports.map((item) => (
          <Button key={item.href} variant="secondary" size="sm" asChild>
            <a href={item.href} download>
              <Download className="h-4 w-4" />
              {item.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
