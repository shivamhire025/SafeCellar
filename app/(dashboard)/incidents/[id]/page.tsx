import { notFound } from "next/navigation";
import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { formatDateTime } from "@/lib/utils";
import { IncidentDetailClient } from "./incident-detail-client";

export default async function IncidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const incident = demoStore.getIncident(params.id);
  if (!incident) notFound();

  const chemicals = demoStore.getChemicals();

  return (
    <>
      <Topbar
        title="Incident detail"
        userName={session?.full_name ?? "User"}
      />
      <PageShell
        title={formatDateTime(incident.occurred_at)}
        description={incident.location}
        leading={
          <Link
            href="/incidents"
            className="text-sm text-brand-700 hover:underline"
          >
            ← Back to incident log
          </Link>
        }
      >
        <IncidentDetailClient
          initialIncident={incident}
          chemicals={chemicals}
        />
      </PageShell>
    </>
  );
}
