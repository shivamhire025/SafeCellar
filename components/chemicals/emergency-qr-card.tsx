"use client";

import type { ReactNode } from "react";
import { Droplets, Flame, Phone, Plus, Skull, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HAZARD_LABEL_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Chemical } from "@/types/database";

function FirstAidIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm bg-red-600 shadow-sm",
        className
      )}
      aria-hidden
    >
      <Plus className="h-4 w-4 text-white" strokeWidth={3} />
    </span>
  );
}

function HazardOctagon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-14 w-14 flex-shrink-0 items-center justify-center border-[3px] border-neutral-900 bg-white",
        className
      )}
      style={{
        clipPath:
          "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
      }}
    >
      {children}
    </div>
  );
}

function HazardPictogram({ hazard }: { hazard: string }) {
  const iconClass = "h-7 w-7 text-neutral-900";
  switch (hazard) {
    case "corrosive":
      return (
        <HazardOctagon>
          <Droplets className={iconClass} />
        </HazardOctagon>
      );
    case "toxic":
      return (
        <HazardOctagon>
          <Skull className={iconClass} />
        </HazardOctagon>
      );
    case "flammable":
      return (
        <HazardOctagon>
          <Flame className={iconClass} />
        </HazardOctagon>
      );
    case "asphyxiant":
      return (
        <HazardOctagon>
          <Wind className={iconClass} />
        </HazardOctagon>
      );
    default:
      return (
        <HazardOctagon>
          <span className="text-xs font-bold text-neutral-900">!</span>
        </HazardOctagon>
      );
  }
}

export function EmergencyQrCard({ chemical }: { chemical: Chemical }) {
  const steps = chemical.first_aid_notes
    ? chemical.first_aid_notes.split("\n").filter(Boolean)
    : [
        "1. Move to fresh air / flush affected area with water.",
        "2. Remove contaminated clothing.",
        "3. Seek immediate medical attention.",
      ];

  const hazards = chemical.hazard_class ?? [];

  function handlePrint() {
    const source = document.getElementById("emergency-print-card");
    if (!source) return;

    const root = document.createElement("div");
    root.id = "emergency-print-root";
    const clone = source.cloneNode(true) as HTMLElement;
    clone.querySelector("button")?.remove();

    root.appendChild(clone);
    document.body.appendChild(root);
    document.body.classList.add("print-emergency-only");

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      document.body.classList.remove("print-emergency-only");
      root.remove();
    };

    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  }

  return (
    <div
      id="emergency-print-card"
      className="rounded-xl bg-neutral-900 p-6 shadow-lg border-2 border-neutral-800 text-white"
    >
      <h3 className="text-base font-bold uppercase tracking-wide text-white mb-5">
        Emergency Quick Response Card
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 mb-3">
            <FirstAidIcon />
            <h4 className="text-xl font-black uppercase tracking-wide text-white">
              First Aid Protocol
            </h4>
          </div>
          <ol className="space-y-2 flex-1">
            {steps.map((step, i) => (
              <li key={i} className="text-sm font-medium text-white leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
          {chemical.emergency_contact && (
            <div className="flex items-center gap-2 text-sm font-semibold text-white mt-4">
              <Phone className="h-4 w-4 flex-shrink-0 text-white" />
              <span>Emergency: {chemical.emergency_contact}</span>
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            className="print:hidden mt-4 w-fit bg-red-600 text-white hover:bg-red-700 border-0 font-semibold"
          >
            Print Emergency Card
          </Button>
        </div>

        <div className="rounded-lg border-2 border-red-800 bg-red-600 p-4 shadow-md text-white">
          <p className="text-lg font-bold leading-tight text-white">
            {chemical.name}
          </p>
          {chemical.trade_name && (
            <p className="text-sm text-red-100 mt-1">{chemical.trade_name}</p>
          )}
          <dl className="mt-3 space-y-1 text-sm font-mono text-white/90">
            {chemical.cas_number && (
              <div>
                <dt className="sr-only">CAS Number</dt>
                <dd>CAS No: {chemical.cas_number}</dd>
              </div>
            )}
            {chemical.molecular_formula && (
              <div>
                <dt className="sr-only">Formula</dt>
                <dd>Formula: {chemical.molecular_formula}</dd>
              </div>
            )}
          </dl>

          {hazards.length > 0 && (
            <>
              <p className="mt-4 text-2xl font-black tracking-tight text-white">
                DANGER
              </p>
              <div className="mt-2 flex flex-col gap-0.5">
                {hazards.map((h) => {
                  const info = HAZARD_LABEL_INFO[h as keyof typeof HAZARD_LABEL_INFO];
                  if (!info) return null;
                  return (
                    <p
                      key={h}
                      className="text-sm font-bold uppercase tracking-wide text-white"
                    >
                      {info.label}
                      {info.labelFr ? ` / ${info.labelFr}` : ""}
                    </p>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {hazards.map((h) => (
                  <HazardPictogram key={h} hazard={h} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
