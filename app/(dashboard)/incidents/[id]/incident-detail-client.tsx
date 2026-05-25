"use client";

import { useState } from "react";
import { IncidentPhotosPanel } from "@/components/incidents/incident-photos-panel";
import { IncidentStatusBadge } from "@/components/incidents/incident-status-badge";
import { IncidentTypeBadge } from "@/components/incidents/incident-type-badge";
import type { Chemical, Incident } from "@/types/database";

export function IncidentDetailClient({
  initialIncident,
  chemicals,
}: {
  initialIncident: Incident;
  chemicals: Chemical[];
}) {
  const [incident, setIncident] = useState(initialIncident);

  const linkedChemicals = (incident.chemical_ids ?? [])
    .map((id) => chemicals.find((c) => c.id === id))
    .filter(Boolean) as Chemical[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <IncidentTypeBadge type={incident.incident_type} />
        <IncidentStatusBadge status={incident.status} />
        {incident.status === "incomplete" && (
          <span className="text-xs text-amber-700">
            Missing photo documentation
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-neutral-900 mb-3">
              Description
            </h2>
            <p className="text-sm text-neutral-800 whitespace-pre-wrap">
              {incident.description}
            </p>
            {incident.notes && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                  Notes
                </h3>
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                  {incident.notes}
                </p>
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <IncidentPhotosPanel
              incidentId={incident.id}
              photos={incident.photos}
              onIncidentUpdate={setIncident}
            />
          </section>
        </div>

        <div className="space-y-4">
          <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-neutral-900 mb-4">
              Details
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-neutral-500">Reported by</dt>
                <dd className="font-medium">
                  {incident.reported_by_name ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Chemical exposure</dt>
                <dd className="font-medium">
                  {incident.chemical_exposure ? "Yes" : "No"}
                </dd>
              </div>
              {incident.chemical_exposure && linkedChemicals.length > 0 && (
                <div>
                  <dt className="text-neutral-500">Chemicals</dt>
                  <dd className="font-medium">
                    {linkedChemicals.map((c) => c.name).join(", ")}
                  </dd>
                </div>
              )}
              {incident.exposure_details && (
                <div>
                  <dt className="text-neutral-500">Exposure details</dt>
                  <dd className="text-neutral-800">{incident.exposure_details}</dd>
                </div>
              )}
              {incident.conditions && (
                <div>
                  <dt className="text-neutral-500">Conditions</dt>
                  <dd className="text-neutral-800">{incident.conditions}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
