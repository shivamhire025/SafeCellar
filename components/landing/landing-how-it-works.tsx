import { LandingProductShot } from "@/components/landing/landing-product-shot";
import { LandingSection } from "@/components/landing/landing-section";
import { LandingWorkflow } from "@/components/landing/landing-workflow";

export function LandingHowItWorks() {
  return (
    <LandingSection
      id="how-it-works"
      eyebrow="How it works"
      title="From delivery scan to inspection packet"
      description="Chemical compliance is a chain of small decisions. SafeCellar makes each step visible and routes you to the right screen when something is out of date."
      className="bg-stone-100/80"
    >
      <LandingWorkflow />

      <div className="mt-16 grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/90">
            At a glance
          </p>
          <h3 className="mt-2 font-landing-display text-2xl font-semibold text-stone-900">
            Compliance overview on the dashboard
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            The score reflects how many chemicals have a current SDS on file. Tiles
            drill into missing sheets, pending delivery scans, and the SDS review queue.
            Hover for a preview of the top items, then jump to fix them.
          </p>
          <p className="mt-4 text-xs text-stone-500">
            Illustrative demo values. Your workspace reflects live inventory.
          </p>
        </div>
        <div className="lg:col-span-3">
          <LandingProductShot className="w-full max-w-none" />
        </div>
      </div>
    </LandingSection>
  );
}
