import Image from "next/image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/components/landing/landing-images";

const pillars = [
  {
    num: "01",
    title: "Know your gaps before inspection day",
    body: "Live compliance score, queue tiles, and high-risk notifications with links straight to the work.",
  },
  {
    num: "02",
    title: "Gate chemicals on real SDS coverage",
    body: "Non-compliant inventory stays blocked until a current SDS is uploaded, reviewed, and on file.",
  },
  {
    num: "03",
    title: "Walk in with a complete packet",
    body: "Export a written HazCom or WHMIS program, SDS library, and audit CSVs in one ZIP.",
  },
];

export function LandingValue() {
  return (
    <LandingSection
      id="value"
      eyebrow="Why SafeCellar"
      title="Value for teams under real inspection pressure"
      description="Inspectors ask for current SDS, training, written program, and records that match what is on the floor. SafeCellar keeps those pieces linked."
      className="border-b border-stone-200/80 bg-white"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-stone-200 shadow-[0_20px_50px_-20px_rgba(28,25,23,0.35)] sm:aspect-[3/4] lg:order-2">
          <Image
            src={landingImages.cellar}
            alt="Wooden barrels stacked in a brewery aging cellar"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 right-4 font-landing-display text-lg text-white">
            On the floor, not in a binder
          </p>
        </div>

        <ul className="space-y-6 lg:order-1">
          {pillars.map((p) => (
            <li
              key={p.num}
              className="rounded-xl border border-amber-100/80 bg-gradient-to-br from-stone-50 to-amber-50/40 p-6 transition hover:shadow-md"
            >
              <span className="font-landing-display text-sm font-medium text-amber-800">
                {p.num}
              </span>
              <h3 className="mt-2 font-landing-display text-xl font-semibold text-stone-900">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </LandingSection>
  );
}
