import { Fragment, type ReactNode } from "react";
import {
  ABBREVIATION_PATTERN,
  getAbbreviation,
  type AbbreviationEntry,
} from "@/lib/abbreviations";
import { cn } from "@/lib/utils";

function TooltipBubble({ entry }: { entry: AbbreviationEntry }) {
  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[16rem] -translate-x-1/2",
        "rounded-md bg-neutral-900 px-2.5 py-2 text-left text-xs font-normal text-white shadow-md",
        "opacity-0 transition-opacity duration-150",
        "group-hover/abbr:opacity-100 group-focus-visible/abbr:opacity-100"
      )}
    >
      <span className="block font-semibold">{entry.full}</span>
      <span className="mt-0.5 block text-neutral-300 leading-snug">
        {entry.description}
      </span>
      <span
        className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900"
        aria-hidden
      />
    </span>
  );
}

interface AbbrProps {
  /** Glossary key; defaults to string children when children is plain text. */
  term?: string;
  /** Override glossary (e.g. short label with a longer tooltip). */
  full?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Wraps a single abbreviation with a hover/focus tooltip. */
export function Abbr({ term, full, description, children, className }: AbbrProps) {
  const key =
    term ??
    (typeof children === "string" ? children : undefined);
  const entry =
    full && description
      ? { full, description }
      : key
        ? getAbbreviation(key)
        : undefined;

  if (!entry) {
    return <>{children}</>;
  }

  return (
    <span
      tabIndex={0}
      className={cn(
        "group/abbr relative inline cursor-help underline decoration-dotted decoration-neutral-400 underline-offset-2",
        className
      )}
    >
      {children}
      <TooltipBubble entry={entry} />
    </span>
  );
}

interface AbbreviationTextProps {
  text: string;
  className?: string;
}

/** Renders text and auto-wraps known abbreviations with tooltips. */
export function AbbreviationText({ text, className }: AbbreviationTextProps) {
  const parts = text.split(ABBREVIATION_PATTERN);

  if (parts.length === 1) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;
        const entry = getAbbreviation(part);
        if (entry) {
          return (
            <Abbr key={`${index}-${part}`} term={part}>
              {part}
            </Abbr>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </span>
  );
}
