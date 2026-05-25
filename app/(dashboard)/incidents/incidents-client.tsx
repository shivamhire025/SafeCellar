"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ClipboardList } from "lucide-react";
import { IncidentStatusBadge } from "@/components/incidents/incident-status-badge";
import { IncidentTypeBadge } from "@/components/incidents/incident-type-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { INCIDENT_TYPES } from "@/lib/constants";
import type { Incident } from "@/types/database";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "incomplete", label: "Incomplete" },
  { key: "complete", label: "Complete" },
] as const;

export function IncidentsClient({
  initialIncidents,
}: {
  initialIncidents: Incident[];
}) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = initialIncidents;
    if (statusFilter !== "all") {
      list = list.filter((i) => i.status === statusFilter);
    }
    if (typeFilter !== "all") {
      list = list.filter((i) => i.incident_type === typeFilter);
    }
    return list;
  }, [initialIncidents, statusFilter, typeFilter]);

  const incompleteCount = initialIncidents.filter(
    (i) => i.status === "incomplete"
  ).length;

  return (
    <div className="space-y-4">
      {incompleteCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p>
            <strong>{incompleteCount}</strong> incident
            {incompleteCount === 1 ? "" : "s"} missing photo documentation.
            Add photos to mark them complete.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-1 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                statusFilter === f.key
                  ? "bg-brand-700 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700"
        >
          <option value="all">All types</option>
          {INCIDENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <EmptyState
            icon={ClipboardList}
            title="No incidents logged"
            description="Record near misses, injuries, illnesses, and property damage to build your facility incident log."
            action={
              <Button asChild>
                <Link href="/incidents/new">Log incident</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm hidden md:table">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Date & time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Photos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((incident) => (
                <tr
                  key={incident.id}
                  className="hover:bg-neutral-50 transition-colors duration-100"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/incidents/${incident.id}`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {formatDateTime(incident.occurred_at)}
                    </Link>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1 max-w-xs">
                      {incident.description}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <IncidentTypeBadge type={incident.incident_type} />
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {incident.location}
                  </td>
                  <td className="px-4 py-3">
                    <IncidentStatusBadge status={incident.status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {incident.photos.length === 0 ? (
                      <span className="text-amber-700 text-xs font-medium">
                        None
                      </span>
                    ) : (
                      `${incident.photos.length} photo${incident.photos.length === 1 ? "" : "s"}`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="md:hidden divide-y divide-neutral-100">
            {filtered.map((incident) => (
              <li key={incident.id}>
                <Link
                  href={`/incidents/${incident.id}`}
                  className="block p-4 hover:bg-neutral-50"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <IncidentTypeBadge type={incident.incident_type} />
                    <IncidentStatusBadge status={incident.status} />
                  </div>
                  <p className="font-medium text-neutral-900">
                    {formatDateTime(incident.occurred_at)}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    {incident.location}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                    {incident.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
