import Image from "next/image";
import { LandingCtaButton } from "@/components/landing/landing-cta-button";
import { LandingProductShot } from "@/components/landing/landing-product-shot";
import { landingImages } from "@/components/landing/landing-images";

export function LandingHero() {
  return (
    <section className="relative min-h-[32rem] overflow-hidden text-white sm:min-h-[40rem]">
      <Image
        src={landingImages.hero}
        alt="Craft brewery production floor with stainless steel fermentation tanks"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-stone-950/90 via-brand-900/80 to-amber-950/50"
        aria-hidden
      />
      <div className="landing-grain absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl min-w-0 gap-12 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-28 lg:pt-28">
        <div className="min-w-0 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200/90">
            For craft breweries &amp; wineries
          </p>
          <h1 className="mt-4 font-landing-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            HazCom compliance you can see, fix, and prove
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-100/95">
            SafeCellar connects receiving, chemical inventory, SDS review, training,
            and exports into one system so production teams stay inspection-ready
            without spreadsheet chaos.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <LandingCtaButton size="lg" variant="light" />
            <a
              href="#how-it-works"
              className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
            >
              See how it works
            </a>
          </div>
          <p className="mt-8 text-sm text-stone-200/80">
            HazCom · WHMIS · Built for craft production teams
          </p>
        </div>

        <div className="relative min-w-0 w-full max-w-lg justify-self-center lg:max-w-none lg:justify-self-end">
          <LandingProductShot tilt />
        </div>
      </div>
    </section>
  );
}
