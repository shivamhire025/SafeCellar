import type { Incident, IncidentStatus } from "@/types/database";

/** Incidents without at least one photo are incomplete. */
export function deriveIncidentStatus(photos: Incident["photos"]): IncidentStatus {
  return photos.length > 0 ? "complete" : "incomplete";
}

export function withIncidentStatus<T extends Pick<Incident, "photos">>(
  incident: T
): T & { status: IncidentStatus } {
  return {
    ...incident,
    status: deriveIncidentStatus(incident.photos),
  };
}
