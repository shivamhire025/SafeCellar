import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Barcode,
  Bell,
  ClipboardCheck,
  ClipboardList,
  FileCheck,
  FileText,
  FlaskConical,
  HardHat,
  LayoutDashboard,
  MapPin,
  Package,
  QrCode,
  Shield,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LandingDashboardPreview } from "@/components/landing/landing-dashboard-preview";
import { LandingPacketDiagram } from "@/components/landing/landing-packet-diagram";
import { LandingWorkflow } from "@/components/landing/landing-workflow";

const valuePillars = [
  {
    icon: LayoutDashboard,
    title: "Know your gaps before inspection day",
    body: "A live compliance score, queue tiles, and high-risk notifications show missing SDS, pending scans, and review backlog, with links straight to the work.",
  },
  {
    icon: ShieldCheck,
    title: "Gate chemicals on real SDS coverage",
    body: "Non-compliant inventory stays blocked until a current SDS is uploaded, reviewed, and tied to the chemical record, not just a checkbox in a spreadsheet.",
  },
  {
    icon: FileCheck,
    title: "Walk in with a complete packet",
    body: "Export a written HazCom or WHMIS program, SDS library, and audit CSVs in one ZIP, aligned to US, Canada, or both regulatory profiles.",
  },
];

const featureGroups = [
  {
    title: "Operations & visibility",
    description:
      "Day-to-day receiving and inventory tied to a single source of truth on the dashboard.",
    items: [
      {
        icon: LayoutDashboard,
        title: "Compliance dashboard",
        description:
          "Score gauge, SDS/delivery/review tiles, pending actions, and training alerts with deep links into Chemicals and Deliveries.",
      },
      {
        icon: Bell,
        title: "High-risk notifications",
        description:
          "Bell surfaces overdue SDS reviews, blocked chemicals, incomplete incidents, and other items that need a decision now.",
      },
      {
        icon: Truck,
        title: "Deliveries & receiving",
        description:
          "Log shipments, track inventory-pending scans, and connect receiving events back to chemical records.",
      },
      {
        icon: Barcode,
        title: "Barcode scanning",
        description:
          "Scan products when receiving or adding inventory so records stay accurate on the floor.",
      },
    ],
  },
  {
    title: "Chemicals & SDS",
    description:
      "Inventory, documents, and review workflows built for OSHA HazCom and Canadian WHMIS.",
    items: [
      {
        icon: FlaskConical,
        title: "Chemical inventory",
        description:
          "Track chemicals with locations, quantities, hazards, and compliance status. Filter by missing SDS, review due, or compliant.",
      },
      {
        icon: FileText,
        title: "SDS library & compliance gate",
        description:
          "Upload and version SDS files; chemicals without a current sheet stay non-compliant until resolved.",
      },
      {
        icon: ClipboardCheck,
        title: "SDS review queue",
        description:
          "Approve new, annual, or supplier-change uploads before they go live in the library.",
      },
      {
        icon: QrCode,
        title: "Emergency QR cards",
        description:
          "Print QR labels for fast SDS and hazard access during spills or exposures.",
      },
    ],
  },
  {
    title: "People, incidents & safety programs",
    description:
      "Documentation inspectors expect beyond the chemical list: training, incidents, and confined-space work.",
    items: [
      {
        icon: Users,
        title: "Workers & training",
        description:
          "Roster with per-worker training records; dashboard flags when certifications need attention.",
      },
      {
        icon: ClipboardList,
        title: "Incident logging",
        description:
          "Log exposures and spills with photos, annotations, and follow-up status tied into notifications when incomplete.",
      },
      {
        icon: HardHat,
        title: "Equipment registry",
        description:
          "Track confined-space and related equipment used in permit workflows.",
      },
      {
        icon: Shield,
        title: "Confined space permits",
        description:
          "Entry permits with hazards prefilled from gas chemicals on site, with less retyping and fewer gaps.",
      },
    ],
  },
  {
    title: "Inspection readiness",
    description:
      "Turn live data into auditor-facing artifacts without rebuilding folders the night before.",
    items: [
      {
        icon: FileCheck,
        title: "Compliance & Exports hub",
        description:
          "Readiness summary, regulatory profile (US / Canada / both), and one-click compliance packet download.",
      },
      {
        icon: FileText,
        title: "Written HazCom / WHMIS program",
        description:
          "Generate jurisdiction-appropriate written programs from your site profile and inventory.",
      },
      {
        icon: Package,
        title: "Individual CSV exports",
        description:
          "Activity log, SDS queue, deliveries, and training, or bundle everything in the packet ZIP.",
      },
      {
        icon: MapPin,
        title: "Multi-site ready",
        description:
          "Designed for production teams managing chemicals across cellar, brewhouse, and packaging areas.",
      },
    ],
  },
];

function TryNowButton({
  size = "default" as const,
  className,
}: {
  size?: "default" | "lg";
  className?: string;
}) {
  return (
    <Button size={size} className={className} asChild>
      <Link href="/login">Try Now</Link>
    </Button>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="hidden text-sm font-medium text-neutral-600 hover:text-brand-700 sm:inline"
    >
      {children}
    </a>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" size="md" />
          <nav className="flex items-center gap-4 sm:gap-6">
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#value">Why SafeCellar</NavLink>
            <NavLink href="#features">Features</NavLink>
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
                For craft breweries &amp; wineries
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                HazCom compliance you can see, fix, and prove
              </h1>
              <p className="mt-6 text-lg text-brand-100">
                SafeCellar connects receiving, chemical inventory, SDS review, training,
                and exports into one system so small production teams stay
                inspection-ready without spreadsheet chaos.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <TryNowButton
                  size="lg"
                  className="bg-white text-brand-800 hover:bg-brand-50"
                />
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-brand-100 underline-offset-4 hover:text-white hover:underline"
                >
                  See how it works
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="value" className="scroll-mt-16 border-b border-neutral-200 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-neutral-900">
                Value for teams under real inspection pressure
              </h2>
              <p className="mt-4 text-neutral-600">
                OSHA and provincial inspectors ask for the same evidence: current SDS,
                training, written program, and records that match what&apos;s on the floor.
                SafeCellar keeps those pieces linked.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {valuePillars.map(({ icon: Icon, title, body }) => (
                <li
                  key={title}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-700 text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-16 bg-neutral-50 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-neutral-900">
              From delivery scan to inspection packet
            </h2>
            <p className="mt-4 max-w-3xl text-neutral-600">
              Chemical compliance is a chain of small decisions. SafeCellar makes
              each step visible and routes you to the right screen when something
              is out of date.
            </p>
            <div className="mt-8">
              <LandingWorkflow />
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                  At a glance
                </p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900">
                  Compliance overview on the dashboard
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                  The score reflects how many chemicals have a current SDS on file.
                  Tiles drill into missing sheets, pending delivery scans, and the SDS
                  review queue. Hover for a preview of the top items, then jump to fix
                  them.
                </p>
              </div>
              <div>
                <LandingDashboardPreview />
                <p className="mt-3 flex items-start gap-2 text-xs text-neutral-500">
                  <AlertTriangle
                    className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600"
                    aria-hidden
                  />
                  Illustrative demo values. Your workspace reflects live inventory.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="inspection-ready"
          className="scroll-mt-16 border-y border-neutral-200 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900">
                  Built for the walkthrough, not just the binder
                </h2>
                <p className="mt-4 text-neutral-600">
                  The Compliance &amp; Exports hub shows whether you&apos;re ready,
                  which regulatory profile applies (US HazCom, Canadian WHMIS, or both),
                  and lets you download everything in one pass.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-neutral-700">
                  <li className="flex gap-2">
                    <span className="text-brand-700 font-bold" aria-hidden>
                      →
                    </span>
                    Written program PDF/HTML generated from your site data
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-700 font-bold" aria-hidden>
                      →
                    </span>
                    SDS folder matching chemicals currently on site
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-700 font-bold" aria-hidden>
                      →
                    </span>
                    CSVs for activity, reviews, deliveries, and training
                  </li>
                </ul>
              </div>
              <LandingPacketDiagram />
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-neutral-900">
                Full platform for chemical safety compliance
              </h2>
              <p className="mt-4 text-neutral-600">
                Dashboard, inventory, SDS workflows, people and incidents, confined
                space permits, and exports, designed for craft production teams, not
                enterprise EHS suites.
              </p>
            </div>

            <div className="mt-14 space-y-16">
              {featureGroups.map((group) => (
                <div key={group.title}>
                  <div className="border-l-4 border-brand-700 pl-4">
                    <h3 className="text-xl font-bold text-neutral-900">{group.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{group.description}</p>
                  </div>
                  <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                    {group.items.map(({ icon: Icon, title, description }) => (
                      <li
                        key={title}
                        className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card"
                      >
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                          <Icon className="h-4 w-4" aria-hidden />
                        </div>
                        <h4 className="font-semibold text-neutral-900">{title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                          {description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-brand-900 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <Package className="mx-auto h-10 w-10 text-brand-200" aria-hidden />
            <h2 className="mt-6 text-3xl font-bold">
              Ready to walk the floor with confidence?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-brand-100">
              Sign in to explore the demo brewery workspace: dashboard, chemicals,
              compliance packet, and more. No credit card or setup call required.
            </p>
            <div className="mt-8">
              <TryNowButton
                size="lg"
                className="bg-white text-brand-800 hover:bg-brand-50"
              />
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
