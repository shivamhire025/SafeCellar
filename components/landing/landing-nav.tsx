"use client";

import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LandingCtaButton } from "@/components/landing/landing-cta-button";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#value", label: "Why SafeCellar" },
  { href: "#features", label: "Features" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-stone-200/80 bg-stone-50/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 transition-colors",
            scrolled ? "text-brand-800" : "text-white"
          )}
        >
          <FlaskConical className="h-6 w-6" aria-hidden />
          <span className="font-landing-display text-xl font-semibold tracking-tight">
            SafeCellar
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "hidden text-sm font-medium transition-colors sm:inline",
                scrolled
                  ? "text-stone-600 hover:text-brand-700"
                  : "text-stone-100 hover:text-white"
              )}
            >
              {link.label}
            </a>
          ))}
          <LandingCtaButton
            className={cn(
              !scrolled &&
                "border border-white/30 bg-white/95 text-brand-800 hover:bg-white"
            )}
          />
        </nav>
      </div>
    </header>
  );
}
