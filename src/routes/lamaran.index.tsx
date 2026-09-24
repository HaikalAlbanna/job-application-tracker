import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Download,
  Plus,
  FileSpreadsheet,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/AppShell";
import { ApplicationTable } from "@/components/app/ApplicationTable";
import { useApplications, useHydrated } from "@/hooks/useApplications";
import { useDebounce } from "@/hooks/useDebounce";
import { STATUSES, type ApplicationStatus } from "@/lib/applications";
import { exportApplicationsToExcel } from "@/lib/excel";

export const Route = createFileRoute("/lamaran/")({
  head: () => ({
    meta: [
      { title: "Daftar Lamaran — Job Tracker" },
      {
        name: "description",
        content: "Tabel seluruh lamaran kerja dengan pencarian responsif, filter status, pengurutan, dan navigasi 10 data per halaman.",
      },
      { property: "og:title", content: "Daftar Lamaran — Job Tracker" },
      { property: "og:description", content: "Kelola seluruh lamaran kerja Anda dalam satu tabel." },
    ],
  }),
  component: ListPage,
});

type SortDir = "desc" | "asc";

const PAGE_SIZE = 10; // Menampilkan 10 item saja per halaman

function ListPage() {
  const apps = useApplications();
  const hydrated = useHydrated();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [sort, setSort] = useState<SortDir>("desc");
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce input pencarian (350ms) agar tidak mengeksekusi filter berulang-ulang dan tidak membebani server
  const debouncedQuery = useDebounce(query, 350);

  // Reset ke halaman 1 saat pencarian, filter status, atau pengurutan berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, status, sort]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return apps
      .filter((a) => status === "all" || a.status === status)
      .filter((a) => !q || a.company.toLowerCase().includes(q) || a.position.toLowerCase().includes(q))
      .sort((a, b) => {
        const cmp = a.appliedDate.localeCompare(b.appliedDate) || a.createdAt.localeCompare(b.createdAt);
        return sort === "desc" ? -cmp : cmp;
      });
  }, [apps, debouncedQuery, status, sort]);

  // Kalkulasi pagination (10 item per halaman)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedApplications = useMemo(() => {
    const start = (validCurrentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, validCurrentPage]);

  const startIndex = filtered.length > 0 ? (validCurrentPage - 1) * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min(validCurrentPage * PAGE_SIZE, filtered.length);

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

  const clearSearch = () => {
    setQuery("");
  };

  // Generate nomor halaman untuk pagination bar
  const getPaginationNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, "ellipsis", totalPages);
      }
    }
    return pages;
  };

  return (
    <div>
      <PageHeader
        title="Daftar Lamaran"
        description={hydrated ? `${apps.length} lamaran tercatat` : "Memuat data..."}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              className="gap-1.5 text-xs sm:text-sm"
            >
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

      {/* Filter & Pencarian dengan Debounce */}
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="field pl-9 pr-9"
            placeholder="Cari perusahaan atau posisi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Bersihkan pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <select
          className="field"
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus | "all")}
        >
          <option value="all">Semua status</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          className="h-10"
          onClick={() => setSort((s) => (s === "desc" ? "asc" : "desc"))}
        >
          {sort === "desc" ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
          {sort === "desc" ? "Terbaru" : "Terlama"}
        </Button>
      </div>

      {/* Tabel Lamaran (Menampilkan 10 item per halaman) */}
      <ApplicationTable
        applications={paginatedApplications}
        hydrated={hydrated}
        emptyMessage={apps.length > 0 ? "Tidak ada lamaran yang cocok dengan pencarian/filter" : undefined}
      />

      {/* Footer Navigasi Halaman (Pagination) */}
      {hydrated && filtered.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Menampilkan <span className="font-semibold text-foreground">{startIndex}</span>–
            <span className="font-semibold text-foreground">{endIndex}</span> dari{" "}
            <span className="font-semibold text-foreground">{filtered.length}</span> lamaran
            {filtered.length !== apps.length && ` (total ${apps.length})`} • Halaman{" "}
            <span className="font-semibold text-foreground">{validCurrentPage}</span> dari{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </p>

          {/* Kontrol Next / Prev & Angka Halaman */}
          {totalPages > 1 && (
            <nav
              role="navigation"
              aria-label="Navigasi Halaman"
              className="flex items-center gap-1 self-center sm:self-auto"
            >
              {/* Tombol Ke Halaman Pertama */}
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setCurrentPage(1)}
                disabled={validCurrentPage === 1}
                title="Halaman Pertama"
              >
                <ChevronsLeft className="size-4" />
              </Button>

              {/* Tombol Sebelumnya */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2.5 text-xs"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
              >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>

              {/* Nomor Halaman */}
              <div className="flex items-center gap-1">
                {getPaginationNumbers().map((item, idx) => {
                  if (item === "ellipsis") {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
                        …
                      </span>
                    );
                  }
                  const isActive = item === validCurrentPage;
                  return (
                    <Button
                      key={item}
                      variant={isActive ? "default" : "outline"}
                      size="icon"
                      className={`size-8 text-xs font-semibold ${
                        isActive ? "shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setCurrentPage(item)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>

              {/* Tombol Berikutnya (Next) */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2.5 text-xs"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="size-4" />
              </Button>

              {/* Tombol Ke Halaman Terakhir */}
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setCurrentPage(totalPages)}
                disabled={validCurrentPage === totalPages}
                title="Halaman Terakhir"
              >
                <ChevronsRight className="size-4" />
              </Button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
