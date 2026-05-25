"use client";

import { HeartPulse, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chemical } from "@/types/database";

export function EmergencyQrCard({ chemical }: { chemical: Chemical }) {
  const steps = chemical.first_aid_notes
    ? chemical.first_aid_notes.split("\n").filter(Boolean)
    : [
        "1. Move to fresh air / flush affected area with water.",
        "2. Remove contaminated clothing.",
        "3. Seek immediate medical attention.",
      ];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="rounded-xl bg-neutral-900 text-white p-6 print:bg-neutral-900">
      <div className="flex items-center gap-2 mb-4">
        <HeartPulse className="h-5 w-5 text-red-400" />
        <h3 className="text-base font-semibold">Emergency Quick Response Card</h3>
      </div>
      <div className="mb-4">
        <p className="text-lg font-bold">{chemical.name}</p>
        {chemical.cas_number && (
          <p className="text-sm text-neutral-400 font-mono mt-0.5">
            CAS: {chemical.cas_number}
          </p>
        )}
        {chemical.trade_name && (
          <p className="text-sm text-neutral-400">{chemical.trade_name}</p>
        )}
      </div>
      <div className="mb-4">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
          First Aid Protocol
        </p>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="text-sm text-neutral-100">
              {step}
            </li>
          ))}
        </ol>
      </div>
      {chemical.emergency_contact && (
        <div className="flex items-center gap-2 text-sm text-neutral-300 mb-4">
          <Phone className="h-4 w-4" />
          <span>Emergency: {chemical.emergency_contact}</span>
        </div>
      )}
      <Button
        variant="secondary"
        size="sm"
        onClick={handlePrint}
        className="print:hidden"
      >
        Print Emergency Card
      </Button>
    </div>
  );
}
