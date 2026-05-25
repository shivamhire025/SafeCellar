"use client";

import { useEffect, useState } from "react";
import type { Chemical } from "@/types/database";
import { Phone } from "lucide-react";

export function EmergencyPublicView({
  chemical,
  token,
}: {
  chemical: Chemical;
  token: string;
}) {
  const [sdsUrl, setSdsUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!chemical.sds_file_path) return;
    fetch(`/api/emergency/${token}/sds`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.url) setSdsUrl(data.url);
      })
      .catch(() => {});
  }, [chemical.sds_file_path, token]);

  const steps = chemical.first_aid_notes
    ? chemical.first_aid_notes.split("\n").filter(Boolean)
    : [
        "Move to fresh air / flush affected area with water.",
        "Remove contaminated clothing.",
        "Seek immediate medical attention.",
      ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 max-w-lg mx-auto">
      <p className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
        Emergency Quick Response
      </p>
      <h1 className="text-2xl font-bold">{chemical.name}</h1>
      {chemical.trade_name && (
        <p className="text-neutral-300 text-sm mt-1">{chemical.trade_name}</p>
      )}

      <div className="mt-6 rounded-lg bg-red-600 p-4">
        <h2 className="font-bold uppercase text-sm mb-2">First Aid</h2>
        <ol className="space-y-2 text-sm">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {chemical.emergency_contact && (
          <p className="flex items-center gap-2 mt-4 text-sm font-semibold">
            <Phone className="h-4 w-4" />
            {chemical.emergency_contact}
          </p>
        )}
      </div>

      {(chemical.ppe_required ?? []).length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-semibold uppercase text-neutral-400 mb-2">
            PPE Required
          </h2>
          <p className="text-sm">{chemical.ppe_required!.join(", ")}</p>
        </div>
      )}

      {sdsUrl && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase text-neutral-400 mb-2">
            Safety Data Sheet
          </h2>
          <iframe
            src={sdsUrl}
            title={`SDS for ${chemical.name}`}
            className="w-full h-96 rounded-lg bg-white"
          />
        </div>
      )}

      <p className="mt-8 text-xs text-neutral-500">
        SafeCellar emergency access. For life-threatening emergencies call 911.
      </p>
    </div>
  );
}
