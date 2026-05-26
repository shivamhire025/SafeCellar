import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LandingSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function LandingSectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: LandingSectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/90">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-landing-display text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl",
          eyebrow && "mt-3"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-stone-600 sm:text-lg",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

type LandingSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  align?: "left" | "center";
  /** Omit stacked header; render `LandingSectionHeader` inside children instead. */
  headerInChildren?: boolean;
};

export function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  innerClassName,
  align = "left",
  headerInChildren = false,
}: LandingSectionProps) {
  const centered = align === "center";

  return (
    <section id={id} className={cn("scroll-mt-20 py-16 sm:py-24", className)}>
      <div
        className={cn(
          "mx-auto max-w-6xl px-4 sm:px-6",
          innerClassName,
          centered && !headerInChildren && "text-center"
        )}
      >
        {!headerInChildren && title && (
          <LandingSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            align={align}
          />
        )}
        <div
          className={cn(
            !headerInChildren && (description || eyebrow ? "mt-10" : "mt-0")
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
