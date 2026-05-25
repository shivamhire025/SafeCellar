import Link from "next/link";
import {
  Barcode,
  ClipboardCheck,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Package,
  QrCode,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: LayoutDashboard,
    title: "Compliance dashboard",
    description:
      "See your compliance score, open actions, and recent activity in one place.",
  },
  {
    icon: FlaskConical,
    title: "Chemical inventory",
    description:
      "Track every chemical on site with locations, quantities, and hazard details.",
  },
  {
    icon: FileText,
    title: "SDS management",
    description:
      "Upload safety data sheets and block non-compliant chemicals until SDS is on file.",
  },
  {
    icon: Barcode,
    title: "Barcode scanning",
    description:
      "Scan products when receiving deliveries or adding new inventory items.",
  },
  {
    icon: Truck,
    title: "Deliveries & receiving",
    description:
      "Log shipments, receive against POs, and tie scans back to your inventory.",
  },
  {
    icon: ClipboardCheck,
    title: "SDS review queue",
    description:
      "Review and approve uploaded SDS documents before they go live.",
  },
  {
    icon: QrCode,
    title: "Emergency QR cards",
    description:
      "Print QR codes on chemical labels for fast access during an incident.",
  },
  {
    icon: ShieldCheck,
    title: "HazCom program export",
    description:
      "Generate inspection-ready HazCom documentation for OSHA walkthroughs.",
  },
];

function TryNowButton({ size = "default" as const, className }: { size?: "default" | "lg"; className?: string }) {
  return (
    <Button size={size} className={className} asChild>
      <Link href="/login">Try Now</Link>
    </Button>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" size="md" />
          <nav className="flex items-center gap-4 sm:gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-neutral-600 hover:text-brand-700 sm:inline"
            >
              Features
            </a>
            <TryNowButton />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative min-h-[28rem] overflow-hidden text-white sm:min-h-[32rem]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/brewery-hero.jpg')" }}
            role="img"
            aria-label="Craft brewery production floor with stainless steel fermentation tanks"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/85 to-brand-800/70" />
          <div className="relative mx-auto flex min-h-[28rem] max-w-6xl items-center px-4 py-20 sm:min-h-[32rem] sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-wide text-brand-200">
                For craft breweries & wineries
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                HazCom compliance without the spreadsheet chaos
              </h1>
              <p className="mt-6 text-lg text-brand-100">
                SafeCellar keeps your chemical inventory, SDS library, and OSHA
                paperwork in one system so you stay inspection-ready.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <TryNowButton
                  size="lg"
                  className="bg-white text-brand-800 hover:bg-brand-50"
                />
                <a
                  href="#features"
                  className="text-sm font-medium text-brand-100 underline-offset-4 hover:text-white hover:underline"
                >
                  See what&apos;s included
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 bg-neutral-50 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-neutral-900">
                Everything you need for Phase 1 compliance
              </h2>
              <p className="mt-4 text-neutral-600">
                Built for small production teams who need clear workflows, not
                enterprise complexity.
              </p>
            </div>
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-neutral-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-neutral-200 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <Package className="mx-auto h-10 w-10 text-brand-700" aria-hidden />
            <h2 className="mt-6 text-3xl font-bold text-neutral-900">
              Ready to walk the floor with confidence?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-600">
              Sign in to explore the demo brewery workspace. No credit card, no
              setup call required.
            </p>
            <div className="mt-8">
              <TryNowButton size="lg" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-neutral-500 sm:flex-row sm:px-6">
          <Logo href="/" size="sm" />
          <p>Inspection-ready. Always.</p>
        </div>
      </footer>
    </div>
  );
}
