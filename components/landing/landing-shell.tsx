import { Fraunces, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-landing-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-landing-body",
  display: "swap",
});

export function LandingShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-landing
      className={cn(
        fraunces.variable,
        sourceSans.variable,
        "landing-page min-h-screen flex flex-col bg-stone-50 font-landing-body text-stone-900 antialiased",
        className
      )}
    >
      {children}
    </div>
  );
}
