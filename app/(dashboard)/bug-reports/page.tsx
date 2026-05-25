import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { getSession } from "@/lib/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Topbar } from "@/components/layout/topbar";
import { BugReportsList } from "@/components/feedback/bug-reports-list";

export default async function BugReportsPage() {
  const session = await getSession();
  const tickets = demoStore.getBugReports();
  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <>
      <Topbar title="Bug reports" userName={session?.full_name ?? "User"} />
      <PageShell
        title="Bug report log"
        description={
          openCount > 0
            ? `${openCount} open ticket${openCount === 1 ? "" : "s"} from in-app feedback`
            : "Tickets submitted via the Report a bug button"
        }
        leading={
          <Link
            href="/settings"
            className="text-sm text-brand-700 hover:underline"
          >
            ← Back to settings
          </Link>
        }
      >
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <BugReportsList initialTickets={tickets} />
        </div>
      </PageShell>
    </>
  );
}
