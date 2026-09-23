import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ArrowDownWideNarrow, ArrowUpNarrowWide, Download, Plus, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/AppShell";
import { ApplicationTable } from "@/components/app/ApplicationTable";
import { useApplications, useHydrated } from "@/hooks/useApplications";
import { STATUSES, type ApplicationStatus } from "@/lib/applications";
import { exportApplicationsToExcel } from "@/lib/excel";

export const Route = createFileRoute("/lamaran/")({
  head: () => ({
    meta: [
      { title: "Daftar Lamaran — Job Tracker" },
      { name: "description", content: "Tabel seluruh lamaran kerja dengan pencarian, filter status, dan pengurutan tanggal." },
      { property: "og:title", content: "Daftar Lamaran — Job Tracker" },
      { property: "og:description", content: "Kelola seluruh lamaran kerja Anda dalam satu tabel." },
    ],
  }),
  component: ListPage,
});

type SortDir = "desc" | "asc";

function ListPage() {
  const apps = useApplications();
  const hydrated = useHydrated();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [sort, setSort] = useState<SortDir>("desc");
  const [exporting, setExporting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps
      .filter((a) => status === "all" || a.status === status)
      .filter((a) => !q || a.company.toLowerCase().includes(q) || a.position.toLowerCase().includes(q))
      .sort((a, b) => {
        const cmp = a.appliedDate.localeCompare(b.appliedDate) || a.createdAt.localeCompare(b.createdAt);
        return sort === "desc" ? -cmp : cmp;
      });
  }, [apps, query, status, sort]);

  const handleExport = async () => {
    if (apps.length === 0) {
      toast.error("Belum ada data untuk diekspor.");
      return;
    }
    setExporting(true);
    try {
      await exportApplicationsToExcel(apps);
      toast.success(`${apps.length} data diekspor ke Excel.`);
    } catch (e) {
      toast.error("Gagal mengekspor data.");
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Daftar Lamaran"
        description={hydrated ? `${apps.length} lamaran tercatat` : "Memuat data..."}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting} className="gap-1.5 text-xs sm:text-sm">
              <Download className="size-4" />
              <span>{exporting ? "Mengekspor..." : "Export Excel"}</span>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm">
              <Link to="/import">
                <FileSpreadsheet className="size-4" /> <span>Import</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="shadow-float gap-1.5 text-xs sm:text-sm">
              <Link to="/lamaran/baru">
                <Plus className="size-4" /> <span>Tambah</span>
              </Link>
            </Button>
          </>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="field pl-9"
            placeholder="Cari perusahaan atau posisi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="field" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus | "all")}>
          <option value="all">Semua status</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Button variant="outline" className="h-10" onClick={() => setSort((s) => (s === "desc" ? "asc" : "desc"))}>
          {sort === "desc" ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
          {sort === "desc" ? "Terbaru" : "Terlama"}
        </Button>
      </div>

      <ApplicationTable
        applications={filtered}
        hydrated={hydrated}
        emptyMessage={apps.length > 0 ? "Tidak ada lamaran yang cocok dengan pencarian/filter" : undefined}
      />
      {hydrated && apps.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Menampilkan {filtered.length} dari {apps.length} lamaran.
        </p>
      )}
    </div>
  );
}
