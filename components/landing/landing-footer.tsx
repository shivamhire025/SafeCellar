import Link from "next/link";
import { FlaskConical } from "lucide-react";

const footerLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#value", label: "Why SafeCellar" },
  { href: "#features", label: "Features" },
  { href: "/login", label: "Demo login" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-800 hover:opacity-90"
          >
            <FlaskConical className="h-5 w-5" aria-hidden />
            <span className="font-landing-display text-lg font-semibold">
              SafeCellar
            </span>
          </Link>
          <p className="mt-2 text-sm text-stone-500">Inspection-ready. Always.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-brand-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/images/ATTRIBUTION.md"
            className="hover:text-brand-700 transition-colors"
          >
            Image credits
          </a>
        </nav>
      </div>
    </footer>
  );
}
