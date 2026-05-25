import { notFound } from "next/navigation";
import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { StatusBadge } from "@/components/shared/status-badge";
import { ComplianceGate } from "@/components/shared/compliance-gate";
import { ChemicalTypeBadge } from "@/components/chemicals/chemical-type-badge";
import { EmergencyQrCard } from "@/components/chemicals/emergency-qr-card";
import { ChemicalDetailClient } from "./chemical-detail-client";
import { formatDate } from "@/lib/utils";
import { PPE_OPTIONS } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { Abbr } from "@/components/shared/abbreviation-tooltip";

export default async function ChemicalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const chemical = demoStore.getChemical(params.id);
  if (!chemical) notFound();

  const showGate = chemical.sds_status !== "compliant";

  return (
    <>
      <Topbar title={chemical.name} userName={session?.full_name ?? "User"} />
      <PageShell
        title={chemical.name}
        description={chemical.trade_name ?? undefined}
        leading={
          <Link
            href="/chemicals"
            className="text-sm text-brand-700 hover:underline"
          >
            ← Back to inventory
          </Link>
        }
      >
        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <ChemicalTypeBadge type={chemical.chemical_type} />
            <StatusBadge status={chemical.sds_status} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mr-1">
              <Abbr term="PPE">PPE</Abbr>
            </span>
            {(chemical.ppe_required ?? []).length > 0 ? (
              chemical.ppe_required!.map((ppe) => {
                const opt = PPE_OPTIONS.find((o) => o.value === ppe);
                return (
                  <span
                    key={ppe}
                    className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800 shadow-sm"
                  >
                    {opt?.label ?? ppe}
                  </span>
                );
              })
            ) : (
              <span className="text-xs text-neutral-500">Not specified</span>
            )}
          </div>

          {(chemical.hazard_class ?? []).length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mr-1">
                Hazards
              </span>
              {chemical.hazard_class!.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium capitalize text-amber-900 shadow-sm"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {showGate && (
          <div className="mb-6" id="sds-upload">
            <ComplianceGate chemicalName={chemical.name} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-neutral-900 mb-4">
                Chemical Information
              </h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-neutral-500">Manufacturer</dt>
                  <dd className="font-medium">{chemical.manufacturer ?? "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Supplier</dt>
                  <dd className="font-medium">{chemical.supplier ?? "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">
                    <Abbr term="CAS">CAS</Abbr> Number
                  </dt>
                  <dd className="font-mono">{chemical.cas_number ?? "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Barcode</dt>
                  <dd className="font-mono">{chemical.barcode ?? "N/A"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-neutral-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Storage Location
                  </dt>
                  <dd className="font-medium">{chemical.storage_location ?? "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Date Added</dt>
                  <dd>{formatDate(chemical.created_at)}</dd>
                </div>
              </dl>
            </div>

            <ChemicalDetailClient chemical={chemical} showGate={showGate} />
          </div>

          <div>
            <EmergencyQrCard chemical={chemical} />
          </div>
        </div>
      </PageShell>
    </>
  );
}
