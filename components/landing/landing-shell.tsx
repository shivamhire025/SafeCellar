import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-landing-display",
  weight: ["400", "600", "700"],
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
        sourceSerif.variable,
        sourceSans.variable,
        "landing-page min-h-screen flex flex-col bg-stone-50 font-landing-body text-stone-900 antialiased",
        className
      )}
    >
      {children}
    </div>
  );
}
