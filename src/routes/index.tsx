import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/AppShell";
import { StatusBadge, STATUS_DOT } from "@/components/app/StatusBadge";
import { useApplications, useHydrated } from "@/hooks/useApplications";
import { STATUSES, STATUS_MAP, formatDateID, monthLabel, type JobApplication } from "@/lib/applications";
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
  const apps = useApplications();
  const hydrated = useHydrated();
  const stats = useMemo(() => computeStats(apps), [apps]);

  const byStatus = useMemo(
    () => STATUSES.map((s) => ({ ...s, count: apps.filter((a) => a.status === s.value).length })),
    [apps],
  );
  const maxStatus = Math.max(1, ...byStatus.map((s) => s.count));

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of apps) {
      const key = a.appliedDate.slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-6)
      .map(([key, count]) => ({ key, label: monthLabel(`${key}-01`), count }));
  }, [apps]);
  const maxMonth = Math.max(1, ...byMonth.map((m) => m.count));

  const recent = useMemo(
    () => [...apps].sort((a, b) => (a.appliedDate < b.appliedDate ? 1 : a.appliedDate > b.appliedDate ? -1 : b.createdAt.localeCompare(a.createdAt))).slice(0, 6),
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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan seluruh lamaran kerja Anda. Diperbarui otomatis saat data berubah."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/import">
                <FileSpreadsheet /> Import Excel
              </Link>
            </Button>
            <Button asChild className="shadow-float">
              <Link to="/lamaran/baru">
                <Plus /> Tambah Lamaran
              </Link>
            </Button>
          </>
        }
      />

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

      <section className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="surface p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Lamaran per Status</h2>
            <span className="text-xs text-muted-foreground">{stats.total} total</span>
          </div>
          <ul className="space-y-3">
            {byStatus.map((s) => {
              const pct = stats.total ? Math.round((s.count / stats.total) * 100) : 0;
              return (
                <li key={s.value} className="grid grid-cols-[150px_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[170px_1fr_auto]">
                  <span className="flex items-center gap-2 truncate font-medium">
                    <span className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[s.value])} />
                    <span className="truncate">{s.label}</span>
                  </span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", STATUS_DOT[s.value])}
                      style={{ width: `${(s.count / maxStatus) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-right tabular-nums text-muted-foreground">
                    <span className="font-semibold text-foreground">{s.count}</span> · {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="surface p-6 lg:col-span-2">
          <h2 className="mb-5 text-lg font-bold">Lamaran per Bulan</h2>
          {byMonth.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Belum ada data.</p>
          ) : (
            <div className="flex h-48 items-end gap-3">
              {byMonth.map((m) => (
                <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-sm font-bold tabular-nums">{m.count}</span>
                  <div className="relative w-full flex-1">
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-md bg-primary/85 transition-all duration-500"
                      style={{ height: `${Math.max(6, (m.count / maxMonth) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
