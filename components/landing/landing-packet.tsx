import Image from "next/image";
import { Check, FileArchive } from "lucide-react";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/components/landing/landing-images";

const checklist = [
  "Written program PDF/HTML generated from your site data",
  "SDS folder matching chemicals currently on site",
  "CSVs for activity, reviews, deliveries, and training",
];

export function LandingPacket() {
  return (
    <LandingSection
      id="inspection-ready"
      eyebrow="Inspection ready"
      title="Built for the walkthrough, not just the binder"
      description="The Compliance & Exports hub shows readiness, your regulatory profile (US HazCom, Canadian WHMIS, or both), and lets you download everything in one pass."
      className="border-y border-stone-200/80 bg-white"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <ul className="space-y-4">
          {checklist.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-stone-700">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
          <Image
            src={landingImages.complianceFloor}
            alt="Safety manager reviewing compliance documents at a desk"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-white/20 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-700 text-white">
              <FileArchive className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="font-landing-display font-semibold text-stone-900">
                One-click compliance packet
              </p>
              <p className="text-xs text-stone-600">
                Program, SDS library, summaries, and audit CSVs in one ZIP
              </p>
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
