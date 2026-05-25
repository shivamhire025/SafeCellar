import Link from "next/link";
import { Plus } from "lucide-react";
import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { IncidentsClient } from "./incidents-client";

export default async function IncidentsPage() {
  const session = await getSession();
  const incidents = demoStore.getIncidents();

  return (
    <>
      <Topbar title="Incidents" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Incident Log"
        description="Near misses, injuries, illnesses, and property damage with photo documentation"
        actions={
          <Button asChild>
            <Link href="/incidents/new">
              <Plus className="h-4 w-4" />
              Log incident
            </Link>
          </Button>
        }
      >
        <IncidentsClient initialIncidents={incidents} />
      </PageShell>
    </>
  );
}
