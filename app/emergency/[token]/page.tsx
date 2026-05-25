import { notFound } from "next/navigation";
import { incidentsRepository } from "@/lib/incidents/repository";
import { EmergencyPublicView } from "@/components/emergency/emergency-public-view";

export default async function EmergencyPublicPage({
  params,
}: {
  params: { token: string };
}) {
  const chemical = await incidentsRepository.getChemicalByEmergencyToken(
    params.token
  );
  if (!chemical) notFound();

  return <EmergencyPublicView chemical={chemical} token={params.token} />;
}
