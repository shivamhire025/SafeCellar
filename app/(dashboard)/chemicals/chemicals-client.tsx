"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { ChemicalTypeBadge } from "@/components/chemicals/chemical-type-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { AbbreviationText } from "@/components/shared/abbreviation-tooltip";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { FlaskConical, Plus } from "lucide-react";
import type { Chemical, SdsStatus } from "@/types/database";

const tabs = [
  { key: "all", label: "All" },
  { key: "missing", label: "Missing SDS" },
  { key: "review_due", label: "Review Due" },
  { key: "compliant", label: "Compliant" },
] as const;

function ChemicalsFiltersFallback() {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {tabs.map((t) => (
        <div
          key={t.key}
          className="h-9 w-24 animate-pulse rounded-md bg-neutral-100"
        />
      ))}
    </div>
  );
}

function ChemicalsClientInner({
  initialChemicals,
  counts,
  initialTab = "all",
}: {
  initialChemicals: Chemical[];
  counts: Record<string, number>;
  initialTab?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const urlTab = searchParams.get("tab") ?? "all";
    const valid = tabs.some((t) => t.key === urlTab);
    if (valid) {
      setTab(urlTab);
    }
  }, [searchParams]);

  function selectTab(key: string) {
    setTab(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("tab");
    } else {
      params.set("tab", key);
    }
    const qs = params.toString();
    router.replace(qs ? `/chemicals?${qs}` : "/chemicals", { scroll: false });
  }

  const filtered = useMemo(() => {
    let list = initialChemicals;
    if (tab !== "all") {
      list = list.filter((c) => c.sds_status === tab);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.trade_name?.toLowerCase().includes(q) ||
          c.manufacturer?.toLowerCase().includes(q) ||
          c.supplier?.toLowerCase().includes(q) ||
          c.cas_number?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [initialChemicals, tab, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => selectTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                tab === t.key
                  ? "bg-brand-700 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <AbbreviationText text={t.label} />
              <span className="ml-1.5 text-xs opacity-80">
                ({counts[t.key] ?? counts.all})
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search chemicals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <EmptyState
            icon={FlaskConical}
            title="No chemicals yet"
            description="Add your first chemical to get started with SDS compliance tracking."
            action={
              <Button asChild>
                <Link href="/chemicals/new">
                  <Plus className="h-4 w-4" />
                  Add Chemical
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm hidden md:table">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Chemical Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  <AbbreviationText text="SDS Status" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Last Verified
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-neutral-50 transition-colors duration-100"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{c.name}</p>
                    {c.trade_name && (
                      <p className="text-xs text-neutral-500">{c.trade_name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ChemicalTypeBadge type={c.chemical_type} />
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {c.storage_location ?? "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.sds_status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(c.sds_last_verified)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/chemicals/${c.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden divide-y divide-neutral-100">
            {filtered.map((c) => (
              <Link
                key={c.id}
                href={`/chemicals/${c.id}`}
                className="block p-4 hover:bg-neutral-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-neutral-900">{c.name}</p>
                    {c.trade_name && (
                      <p className="text-xs text-neutral-500">{c.trade_name}</p>
                    )}
                  </div>
                  <StatusBadge status={c.sds_status} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <ChemicalTypeBadge type={c.chemical_type} />
                  <span className="text-xs text-neutral-500">
                    {c.storage_location}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ChemicalsClient(props: {
  initialChemicals: Chemical[];
  counts: Record<string, number>;
  initialTab?: string;
}) {
  return (
    <Suspense fallback={<ChemicalsFiltersFallback />}>
      <ChemicalsClientInner {...props} />
    </Suspense>
  );
}
