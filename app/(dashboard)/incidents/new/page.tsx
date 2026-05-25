import { demoStore } from "@/lib/demo-store";
import { NewIncidentForm } from "@/components/incidents/new-incident-form";

export default function NewIncidentPage() {
  const chemicals = demoStore.getChemicals();
  return <NewIncidentForm chemicals={chemicals} />;
}
