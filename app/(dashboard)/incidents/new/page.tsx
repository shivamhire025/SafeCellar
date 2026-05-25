import { chemicalsRepository } from "@/lib/chemicals/repository";
import { NewIncidentForm } from "@/components/incidents/new-incident-form";

export default function NewIncidentPage() {
  const chemicals = await chemicalsRepository.getChemicals();
  return <NewIncidentForm chemicals={chemicals} />;
}
