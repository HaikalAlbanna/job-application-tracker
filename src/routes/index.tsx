import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Activity,
  Hourglass,
  ClipboardList,
  MessagesSquare,
  CheckCircle2,
  XCircle,
  LogOut,
  ArrowRight,
  Plus,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Award,
  BarChart3,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/AppShell";
import { StatusBadge, STATUS_DOT } from "@/components/app/StatusBadge";
import { useApplications, useHydrated } from "@/hooks/useApplications";
import { STATUSES, STATUS_MAP, formatDateID, monthLabel, todayWIB, type JobApplication } from "@/lib/applications";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Job Tracker" },
      { name: "description", content: "Ringkasan statistik seluruh lamaran kerja: aktif, tes, interview, diterima, ditolak." },
      { property: "og:title", content: "Dashboard — Job Tracker" },
      { property: "og:description", content: "Ringkasan statistik seluruh lamaran kerja Anda." },
    ],
  }),
  component: Dashboard,
});

function computeStats(apps: JobApplication[]) {
  const count = (pred: (a: JobApplication) => boolean) => apps.filter(pred).length;
  return {
    total: apps.length,
    aktif: count((a) => STATUS_MAP[a.status]?.active),
    menunggu: count((a) => a.status === "baru" || a.status === "menunggu"),
    tes: count((a) => a.status === "tes"),
    interview: count((a) => a.status === "interview_hr" || a.status === "interview_user"),
    diterima: count((a) => a.status === "diterima"),
    ditolak: count((a) => a.status === "ditolak"),
    mundur: count((a) => a.status === "mundur"),
  };
}

function Dashboard() {
  const navigate = useNavigate();
  const apps = useApplications();
  const hydrated = useHydrated();
  const [loggingOut, setLoggingOut] = useState(false);
  const [hoveredMonthKey, setHoveredMonthKey] = useState<string | null>(null);
  const stats = useMemo(() => computeStats(apps), [apps]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Berhasil logout.");
      navigate({ to: "/auth/login" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal logout.";
      toast.error(message);
    } finally {
      setLoggingOut(false);
    }
  };

  // Lamaran per status (tanpa menampilkan angka jumlah lamaran, hanya persentase distribusi)
  const byStatus = useMemo(
    () => STATUSES.map((s) => ({ ...s, count: apps.filter((a) => a.status === s.value).length })),
    [apps],
  );

  // Analisis Lamaran per Bulan yang diperkaya dengan metrik & tren
  const monthlyAnalytics = useMemo(() => {
    const currentMonthKey = todayWIB().slice(0, 7);
    const map = new Map<string, { count: number; active: number; closed: number }>();

    for (const a of apps) {
      const key = a.appliedDate.slice(0, 7);
      const prev = map.get(key) ?? { count: 0, active: 0, closed: 0 };
      const isActive = STATUS_MAP[a.status]?.active ?? false;
      map.set(key, {
        count: prev.count + 1,
        active: prev.active + (isActive ? 1 : 0),
        closed: prev.closed + (isActive ? 0 : 1),
      });
    }

    const sortedEntries = [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
    const last6Months = sortedEntries.slice(-6).map(([key, data]) => {
      const pctOfTotal = stats.total > 0 ? Math.round((data.count / stats.total) * 100) : 0;
      return {
        key,
        label: monthLabel(`${key}-01`),
        count: data.count,
        active: data.active,
        closed: data.closed,
        pctOfTotal,
        isCurrent: key === currentMonthKey,
      };
    });

    const maxMonth = Math.max(1, ...last6Months.map((m) => m.count));
    const peakMonth = last6Months.reduce(
      (best, cur) => (cur.count > (best?.count ?? 0) ? cur : best),
      null as (typeof last6Months)[number] | null,
    );

    // Hitung rata-rata per bulan
    const avgPerMonth =
      last6Months.length > 0
        ? Math.round(last6Months.reduce((acc, cur) => acc + cur.count, 0) / last6Months.length)
        : 0;

    // Perbandingan bulan ini vs bulan sebelumnya
    const currentIdx = last6Months.findIndex((m) => m.key === currentMonthKey);
    let trendPct: number | null = null;
    let trendDirection: "up" | "down" | "flat" = "flat";

    if (currentIdx > 0) {
      const curMonthItem = last6Months[currentIdx];
      const prevMonthItem = last6Months[currentIdx - 1];
      if (curMonthItem && prevMonthItem) {
        const curCount = curMonthItem.count;
        const prevCount = prevMonthItem.count;
        if (prevCount > 0) {
          trendPct = Math.round(((curCount - prevCount) / prevCount) * 100);
          if (trendPct > 0) trendDirection = "up";
          else if (trendPct < 0) trendDirection = "down";
        } else if (curCount > 0) {
          trendPct = 100;
          trendDirection = "up";
        }
      }
    }

    return {
      months: last6Months,
      maxMonth,
      peakMonth,
      avgPerMonth,
      trendPct,
      trendDirection,
      currentMonth: last6Months.find((m) => m.isCurrent) ?? null,
    };
  }, [apps, stats.total]);

  const recent = useMemo(
    () =>
      [...apps]
        .sort((a, b) =>
          a.appliedDate < b.appliedDate ? 1 : a.appliedDate > b.appliedDate ? -1 : b.createdAt.localeCompare(a.createdAt),
        )
        .slice(0, 6),
    [apps],
  );

  const cards = [
    { label: "Total Lamaran", value: stats.total, icon: Briefcase, tone: "text-primary bg-primary-soft" },
    { label: "Aktif / Dalam Proses", value: stats.aktif, icon: Activity, tone: "text-status-baru bg-status-baru/12" },
    { label: "Menunggu Review", value: stats.menunggu, icon: Hourglass, tone: "text-status-menunggu bg-status-menunggu/15" },
    { label: "Sedang Tes", value: stats.tes, icon: ClipboardList, tone: "text-status-tes bg-status-tes/12" },
    { label: "Sedang Interview", value: stats.interview, icon: MessagesSquare, tone: "text-status-interview-hr bg-status-interview-hr/12" },
    { label: "Diterima", value: stats.diterima, icon: CheckCircle2, tone: "text-status-diterima bg-status-diterima/12" },
    { label: "Ditolak", value: stats.ditolak, icon: XCircle, tone: "text-status-ditolak bg-status-ditolak/12" },
    { label: "Mengundurkan Diri", value: stats.mundur, icon: LogOut, tone: "text-status-mundur bg-status-mundur/12" },
  ];

  const activeHoveredMonth = useMemo(() => {
    if (!hoveredMonthKey) return null;
    return monthlyAnalytics.months.find((m) => m.key === hoveredMonthKey) ?? null;
  }, [hoveredMonthKey, monthlyAnalytics.months]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan seluruh lamaran kerja Anda. Diperbarui otomatis saat data berubah."
        actions={
          <>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs sm:text-sm"
            >
              <Link to="/pengaturan">
                <Sliders className="size-4" />
                <span>Pengaturan</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="gap-1.5 text-xs sm:text-sm"
            >
              <LogOut className="size-4" />
              <span>{loggingOut ? "Logout..." : "Logout"}</span>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm">
              <Link to="/import">
                <FileSpreadsheet className="size-4" />
                <span className="hidden sm:inline">Import Excel</span>
                <span className="sm:hidden">Import</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="shadow-float gap-1.5 text-xs sm:text-sm">
              <Link to="/lamaran/baru">
                <Plus className="size-4" />
                <span className="hidden sm:inline">Tambah Lamaran</span>
                <span className="sm:hidden">Tambah</span>
              </Link>
            </Button>
          </>
        }
      />

      {/* Kartu Ringkasan Status */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="surface p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", tone)}>
                <Icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold tabular-nums tracking-tight">
              {hydrated ? value : <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted" />}
            </p>
          </div>
        ))}
      </section>

      {/* Grid Grafik: Lamaran per Status & Lamaran per Bulan */}
      <section className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Bagian 1: Lamaran per Status (Hapus jumlah angka lamaran, hanya persentase proporsi) */}
        <div className="surface p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold">Lamaran per Status</h2>
              <p className="text-xs text-muted-foreground">Distribusi persentase alur lamaran</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              Proporsi
            </span>
          </div>

          <ul className="space-y-3.5">
            {byStatus.map((s) => {
              const pct = stats.total > 0 ? Math.round((s.count / stats.total) * 100) : 0;
              return (
                <li key={s.value} className="grid grid-cols-[140px_1fr_45px] items-center gap-3 text-sm">
                  <span className="flex items-center gap-2 truncate font-medium text-xs sm:text-sm">
                    <span className={cn("size-2.5 shrink-0 rounded-full", STATUS_DOT[s.value])} />
                    <span className="truncate">{s.label}</span>
                  </span>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", STATUS_DOT[s.value])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {/* Hapus jumlah angka lamaran, hanya tampilkan persentase */}
                  <span className="text-right text-xs font-semibold tabular-nums text-foreground">
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bagian 2: Lamaran per Bulan (Tampilan visual menarik & analitik kaya) */}
        <div className="surface p-6 lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="size-5 text-primary" />
                  <span>Tren Lamaran per Bulan</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Aktivitas pengiriman lamaran 6 bulan terakhir
                </p>
              </div>

              {/* Badge tren bulan berjalan */}
              {monthlyAnalytics.trendPct !== null && (
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-semibold",
                    monthlyAnalytics.trendDirection === "up" && "bg-emerald-500/15 text-emerald-600",
                    monthlyAnalytics.trendDirection === "down" && "bg-amber-500/15 text-amber-600",
                    monthlyAnalytics.trendDirection === "flat" && "bg-muted text-muted-foreground",
                  )}
                >
                  {monthlyAnalytics.trendDirection === "up" && <TrendingUp className="size-3.5" />}
                  {monthlyAnalytics.trendDirection === "down" && <TrendingDown className="size-3.5" />}
                  {monthlyAnalytics.trendDirection === "flat" && <Minus className="size-3.5" />}
                  <span>
                    {monthlyAnalytics.trendPct > 0 ? `+${monthlyAnalytics.trendPct}%` : `${monthlyAnalytics.trendPct}%`}{" "}
                    vs bulan lalu
                  </span>
                </div>
              )}
            </div>

            {/* Banner info saat hover */}
            <div className="min-h-7 mb-2 flex items-center">
              {activeHoveredMonth ? (
                <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary animate-in fade-in duration-200">
                  <span className="font-bold">{activeHoveredMonth.label}:</span>
                  <span>{activeHoveredMonth.count} lamaran ({activeHoveredMonth.pctOfTotal}% total)</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{activeHoveredMonth.active} aktif, {activeHoveredMonth.closed} selesai</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Arahkan kursor pada batang untuk melihat rincian bulan.
                </span>
              )}
            </div>

            {monthlyAnalytics.months.length === 0 ? (
              <div className="py-14 text-center">
                <Calendar className="mx-auto size-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Belum ada riwayat lamaran per bulan.</p>
              </div>
            ) : (
              <div className="flex h-44 items-end gap-3 sm:gap-4 pt-2 pb-1 border-b">
                {monthlyAnalytics.months.map((m) => {
                  const heightPercent = Math.max(12, (m.count / monthlyAnalytics.maxMonth) * 100);
                  const isHovered = hoveredMonthKey === m.key;

                  return (
                    <div
                      key={m.key}
                      className="group relative flex flex-1 flex-col items-center gap-2 h-full justify-end cursor-pointer"
                      onMouseEnter={() => setHoveredMonthKey(m.key)}
                      onMouseLeave={() => setHoveredMonthKey(null)}
                    >
                      {/* Nilai di atas batang dengan style menarik */}
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums transition-all",
                          isHovered
                            ? "bg-primary text-primary-foreground scale-110 shadow-xs"
                            : m.isCurrent
                              ? "bg-primary/20 text-primary font-extrabold"
                              : "text-muted-foreground",
                        )}
                      >
                        {m.count}
                      </span>

                      {/* Batang grafik bergaya gradient dengan highlight */}
                      <div className="relative w-full flex-1 flex items-end">
                        <div
                          className={cn(
                            "w-full rounded-t-lg transition-all duration-300 relative overflow-hidden",
                            m.isCurrent
                              ? "bg-linear-to-t from-primary to-primary/80 shadow-md ring-2 ring-primary/30"
                              : "bg-linear-to-t from-primary/70 to-primary/40 group-hover:from-primary/90 group-hover:to-primary/60",
                            isHovered && "ring-2 ring-primary brightness-110",
                          )}
                          style={{ height: `${heightPercent}%` }}
                        >
                          {/* Garis kilau subtle di atas bar */}
                          <div className="absolute inset-x-0 top-0 h-1 bg-white/30" />
                        </div>
                      </div>

                      {/* Label Bulan */}
                      <span
                        className={cn(
                          "text-[11px] font-medium transition-colors truncate max-w-full text-center",
                          m.isCurrent ? "font-bold text-primary" : "text-muted-foreground",
                          isHovered && "text-foreground font-semibold",
                        )}
                      >
                        {m.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3 Kartu Mini Ringkasan Statistik Bulan */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 pt-1">
            <div className="rounded-xl border bg-muted/30 p-2.5 text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Bulan Ini</p>
              <p className="mt-0.5 text-base font-extrabold text-primary tabular-nums">
                {monthlyAnalytics.currentMonth?.count ?? 0}
              </p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-2.5 text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Rata-rata</p>
              <p className="mt-0.5 text-base font-extrabold text-foreground tabular-nums">
                ~{monthlyAnalytics.avgPerMonth}/bln
              </p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-2.5 text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center justify-center gap-1">
                <Award className="size-3 text-amber-500" />
                <span>Puncak</span>
              </p>
              <p className="mt-0.5 text-xs font-bold text-foreground truncate" title={monthlyAnalytics.peakMonth?.label}>
                {monthlyAnalytics.peakMonth?.label ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lamaran Terbaru */}
      <section className="surface mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Lamaran Terbaru</h2>
          <Link to="/lamaran" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Lihat semua <ArrowRight className="size-4" />
          </Link>
        </div>
        {hydrated && recent.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="font-medium">Belum ada lamaran yang dicatat.</p>
            <p className="mt-1 text-sm text-muted-foreground">Mulai dengan menambah lamaran atau mengimpor file Excel lama Anda.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {recent.map((a) => (
              <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{a.position}</p>
                  <p className="truncate text-sm text-muted-foreground">{a.company}</p>
                </div>
                <StatusBadge status={a.status} />
                <span className="hidden w-24 text-right text-sm tabular-nums text-muted-foreground sm:block">
                  {formatDateID(a.appliedDate)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
