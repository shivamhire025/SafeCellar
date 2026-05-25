"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SdsUpload } from "@/components/chemicals/sds-upload";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import type { Chemical } from "@/types/database";

export function ChemicalDetailClient({
  chemical,
  showGate,
}: {
  chemical: Chemical;
  showGate: boolean;
}) {
  const router = useRouter();

  async function handleVerify() {
    const res = await fetch(`/api/chemicals/${chemical.id}/verify`, {
      method: "POST",
    });
    if (res.ok) {
      toast({ title: "SDS verified", variant: "success" });
      router.refresh();
    }
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-neutral-900 mb-4">
        SDS Management
      </h3>
      <div className="mb-4">
        <StatusBadge status={chemical.sds_status} />
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm mb-6">
        <div>
          <dt className="text-neutral-500">SDS Version</dt>
          <dd className="font-medium">{chemical.sds_version ?? "N/A"}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Uploaded</dt>
          <dd>{formatDate(chemical.sds_uploaded_at)}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Last Verified</dt>
          <dd>{formatDate(chemical.sds_last_verified)}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Review Due</dt>
          <dd>{formatDate(chemical.sds_review_due_at)}</dd>
        </div>
      </dl>
      {chemical.sds_status === "compliant" && (
        <Button variant="secondary" size="sm" className="mb-4" onClick={handleVerify}>
          Mark as Verified Today
        </Button>
      )}
      {showGate && (
        <SdsUpload
          chemicalId={chemical.id}
          onSuccess={() => router.refresh()}
        />
      )}
      {chemical.sds_file_path && !showGate && (
        <p className="text-sm text-neutral-500 mt-2">
          SDS on file: {chemical.sds_file_path}
        </p>
      )}
    </div>
  );
}
