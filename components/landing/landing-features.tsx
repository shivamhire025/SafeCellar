import Image from "next/image";
import { LandingSection } from "@/components/landing/landing-section";
import { landingImages } from "@/components/landing/landing-images";
import { cn } from "@/lib/utils";

const panels = [
  {
    title: "Operations & visibility",
    image: landingImages.operations,
    imageAlt: "Stainless tanks and oak barrels on a brewery production floor with gauges and valves",
    featured: true,
    bullets: [
      "Compliance dashboard with score and queue tiles",
      "High-risk notifications bell",
      "Deliveries, barcode scanning, and deep links",
    ],
  },
  {
    title: "Chemicals & SDS",
    image: landingImages.chemicalsSds,
    imageAlt: "Safety officer reviewing a hazardous chemical form with NFPA hazard symbols",
    bullets: ["Inventory with compliance gate", "SDS review queue and emergency QR"],
  },
  {
    title: "People & safety",
    image: landingImages.safetyWalk,
    imageAlt: "Warehouse team in high-visibility vests collaborating on the production floor",
    bullets: ["Workers, training, and incidents", "Equipment registry and CS permits"],
  },
  {
    title: "Inspection exports",
    image: landingImages.inspectionWalk,
    imageAlt: "Brewery workers inspecting stainless tanks and logging data on a tablet",
    bullets: ["Compliance & Exports hub", "HazCom / WHMIS program and packet ZIP"],
  },
];

export function LandingFeatures() {
  return (
    <LandingSection
      id="features"
      eyebrow="Platform"
      title="Full platform for chemical safety compliance"
      description="Dashboard, inventory, SDS workflows, people and incidents, confined space permits, and exports. Designed for craft production teams, not enterprise EHS suites."
      align="center"
      className="bg-stone-50"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {panels.map((panel) => (
          <article
            key={panel.title}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg",
              panel.featured && "md:col-span-2"
            )}
          >
            <div
              className={cn(
                "relative w-full",
                panel.featured ? "aspect-[21/9]" : "aspect-[16/10]"
              )}
            >
              <Image
                src={panel.image}
                alt={panel.imageAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes={panel.featured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3
                className={cn(
                  "font-landing-display font-semibold",
                  panel.featured ? "text-2xl" : "text-lg"
                )}
              >
                {panel.title}
              </h3>
              <ul className="mt-2 space-y-1.5 text-base leading-snug text-stone-200/95">
                {panel.bullets.map((b) => (
                  <li key={b}>· {b}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </LandingSection>
  );
}
