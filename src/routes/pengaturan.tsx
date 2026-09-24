import { createFileRoute } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import {
  Clock,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Hourglass,
  HelpCircle,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/app/AppShell";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useApplications } from "@/hooks/useApplications";
import {
  getAutoStatusSettings,
  saveAutoStatusSettings,
  executeAutoStatusCheck,
  type AutoStatusSettings,
  type StatusUpdateResult,
} from "@/lib/auto-status";
import { formatDateID } from "@/lib/applications";

export const Route = createFileRoute("/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan — Job Tracker" },
      {
        name: "description",
        content: "Konfigurasi otomatisasi status lamaran dan keamanan sesi akun.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const applications = useApplications();
  const [settings, setSettings] = useState<AutoStatusSettings>(() => getAutoStatusSettings());
  const [isPending, startTransition] = useTransition();
  const [lastResult, setLastResult] = useState<StatusUpdateResult | null>(null);

  const handleToggleAutoStatus = (checked: boolean) => {
    const updated = saveAutoStatusSettings({ enabled: checked });
    setSettings(updated);
    toast.success(
      checked
        ? "Pembaruan status otomatis diaktifkan."
        : "Pembaruan status otomatis dinonaktifkan.",
    );
  };

  const handleRunManualCheck = () => {
    startTransition(async () => {
      try {
        const result = await executeAutoStatusCheck(applications, settings);
        setLastResult(result);
        setSettings(getAutoStatusSettings());

        if (result.updatedCount > 0) {
          toast.success(
            `Pemeriksaan selesai: ${result.updatedCount} status lamaran berhasil diperbarui secara otomatis.`,
          );
        } else {
          toast.info("Pemeriksaan selesai: Tidak ada status lamaran yang perlu diperbarui saat ini.");
        }
      } catch (err) {
        toast.error("Terjadi kesalahan saat memeriksa pembaruan status.");
        console.error(err);
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola otomatisasi alur status lamaran kerja dan fitur keamanan akun Anda."
      />

      {/* Bagian 1: Otomatisasi Status Lamaran */}
      <section className="surface p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
                <Sliders className="size-4" />
              </span>
              <h2 className="text-lg font-bold">Otomatisasi Status Lamaran</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistem akan memantau lamaran dan otomatis memperbarui status sesuai durasi waktu yang ditentukan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">
              {settings.enabled ? (
                <span className="text-primary flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  Aktif
                </span>
              ) : (
                <span className="text-muted-foreground">Nonaktif</span>
              )}
            </span>
            <Switch
              checked={settings.enabled}
              onCheckedChange={handleToggleAutoStatus}
              aria-label="Aktifkan Pembaruan Status Otomatis"
            />
          </div>
        </div>

        {/* Aturan Otomatisasi */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Aturan 1 */}
          <div className="rounded-xl border bg-card/60 p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-status-menunggu/15 text-status-menunggu">
                <Clock className="size-4" />
              </span>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">
                  Aturan 1: Menunggu Review (3x 24 Jam)
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Lamaran yang baru didaftarkan (<StatusBadge status="baru" className="inline-flex py-0.5 text-[10px]" />)
                  selama <strong>3x 24 jam (3 hari)</strong> akan otomatis dialihkan ke status{" "}
                  <StatusBadge status="menunggu" className="inline-flex py-0.5 text-[10px]" />.
                </p>
              </div>
            </div>
          </div>

          {/* Aturan 2 */}
          <div className="rounded-xl border bg-card/60 p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-status-tidak-ada-kabar/15 text-status-tidak-ada-kabar">
                <Hourglass className="size-4" />
              </span>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">
                  Aturan 2: Tidak Ada Kabar (10 Hari)
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Lamaran yang sudah lebih dari <strong>10 hari</strong> sejak tanggal didaftarkan/ditambahkan sampai hari ini (dan belum ada kabar lanjut) akan otomatis diubah ke status{" "}
                  <StatusBadge status="tidak_ada_kabar" className="inline-flex py-0.5 text-[10px]" />.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Trigger & History */}
        <div className="mt-6 flex flex-col gap-4 rounded-xl bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Status Pemeriksaan Sistem</p>
            <p>
              {settings.lastRunAt
                ? `Terakhir diperiksa: ${new Date(settings.lastRunAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })} WIB`
                : "Belum pernah dijalankan secara manual"}
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleRunManualCheck}
            disabled={isPending || !settings.enabled}
            className="gap-2 shrink-0 shadow-xs"
          >
            <RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
            <span>{isPending ? "Memeriksa Status..." : "Jalankan Pemeriksaan Sekarang"}</span>
          </Button>
        </div>

        {/* Detail Riwayat Hasil Pemeriksaan Terbaru */}
        {lastResult && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <CheckCircle2 className="size-4" />
              <span>
                Hasil Pemeriksaan: {lastResult.updatedCount} lamaran otomatis diperbarui.
              </span>
            </div>
            {lastResult.details.length > 0 && (
              <ul className="mt-2 divide-y divide-border/60 text-xs">
                {lastResult.details.map((d) => (
                  <li key={d.id} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-semibold text-foreground">{d.position}</span> — {d.company}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={d.oldStatus} className="py-0.5 text-[10px]" />
                      <span>→</span>
                      <StatusBadge status={d.newStatus} className="py-0.5 text-[10px]" />
                      <span className="text-muted-foreground">({d.reason})</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Bagian 2: Autentikasi & Keamanan Sesi */}
      <section className="surface p-6 sm:p-7">
        <div className="flex items-center gap-2 border-b pb-4">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <ShieldCheck className="size-4" />
          </span>
          <div>
            <h2 className="text-lg font-bold">Keamanan Sesi & Autentikasi</h2>
            <p className="text-xs text-muted-foreground">
              Perlindungan otomatis untuk mencegah akses tanpa izin saat perangkat ditinggalkan.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border bg-card/60 p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Clock className="size-4" />
              </span>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">Sesi Otomatis & Batas Waktu 1 Jam</p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                    Aktif
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Jika Anda membuka kembali aplikasi dalam rentang <strong>1 jam</strong> sejak aktivitas terakhir,
                  Anda akan <strong>otomatis langsung login</strong> tanpa perlu memasukkan password kembali.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  Demi keamanan data Anda, apabila aplikasi <strong>tidak dibuka atau tidak ada aktivitas selama lebih dari 1 jam</strong>,
                  sesi akan otomatis kedaluwarsa dan Anda akan diminta login ulang.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-lg bg-muted/40 p-3">
            <HelpCircle className="size-4 shrink-0 text-primary" />
            <span>
              Waktu aktivitas terakhir otomatis diperbarui saat Anda menavigasi halaman, menambah data, atau berinteraksi di aplikasi.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
