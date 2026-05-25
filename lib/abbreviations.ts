export interface AbbreviationEntry {
  full: string;
  description: string;
}

/** Glossary for hover tooltips on abbreviated terms in the UI. */
export const ABBREVIATIONS: Record<string, AbbreviationEntry> = {
  CIP: {
    full: "Clean-In-Place",
    description:
      "Chemicals used to clean and sanitize tanks and lines without disassembly (e.g. caustic, sanitizer).",
  },
  SDS: {
    full: "Safety Data Sheet",
    description:
      "Manufacturer document with hazard, handling, and emergency information for a chemical (OSHA HazCom).",
  },
  HazCom: {
    full: "Hazard Communication",
    description:
      "U.S. OSHA standard requiring employers to inform workers about chemical hazards via SDS and labeling.",
  },
  WHMIS: {
    full: "Workplace Hazardous Materials Information System",
    description:
      "Canadian system for classifying hazardous products and communicating hazards via SDS and labels in the workplace.",
  },
  PPE: {
    full: "Personal Protective Equipment",
    description:
      "Gear worn to reduce exposure (gloves, goggles, respirators, aprons, etc.).",
  },
  OSHA: {
    full: "Occupational Safety and Health Administration",
    description: "U.S. agency that sets and enforces workplace safety standards.",
  },
  CAS: {
    full: "Chemical Abstracts Service Number",
    description: "Unique numeric identifier for a chemical substance.",
  },
  LOTO: {
    full: "Lockout/Tagout",
    description:
      "Procedure to isolate hazardous energy before maintenance on equipment.",
  },
};

export function getAbbreviation(term: string): AbbreviationEntry | undefined {
  const match = Object.entries(ABBREVIATIONS).find(
    ([key]) => key.toLowerCase() === term.toLowerCase()
  );
  return match?.[1];
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const sortedKeys = Object.keys(ABBREVIATIONS).sort((a, b) => b.length - a.length);

/** Matches known abbreviations as whole words (case-insensitive). */
export const ABBREVIATION_PATTERN = new RegExp(
  `\\b(${sortedKeys.map(escapeRegex).join("|")})\\b`,
  "gi"
);

export function isKnownAbbreviation(term: string): boolean {
  return Boolean(getAbbreviation(term));
}
