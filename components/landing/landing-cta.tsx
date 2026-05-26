import Image from "next/image";
import { LandingCtaButton } from "@/components/landing/landing-cta-button";
import { landingImages } from "@/components/landing/landing-images";

export function LandingCta() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Image
        src={landingImages.barrelRoom}
        alt="Stainless fermentation tanks in a craft brewery"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-stone-950/75" aria-hidden />
      <div className="landing-grain absolute inset-0 opacity-20" aria-hidden />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-landing-display text-3xl font-semibold text-white sm:text-4xl">
          Ready to walk the floor with confidence?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-stone-200">
          Sign in to explore the demo brewery workspace: dashboard, chemicals,
          compliance packet, and more. No credit card or setup call required.
        </p>
        <div className="mt-10 flex justify-center">
          <LandingCtaButton size="lg" variant="light" />
        </div>
      </div>
    </section>
  );
}
