import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/AppShell";
import { StatusBadge } from "@/components/app/StatusBadge";
import { STATUSES } from "@/lib/applications";
import { downloadTemplate, EXCEL_HEADERS } from "@/lib/excel";

export const Route = createFileRoute("/panduan")({
  head: () => ({
    meta: [
      { title: "Panduan — Job Tracker" },
      { name: "description", content: "Cara menggunakan Job Tracker: mencatat lamaran, arti status, import/export Excel, dan backup data." },
      { property: "og:title", content: "Panduan — Job Tracker" },
      { property: "og:description", content: "Panduan penggunaan aplikasi pencatatan lamaran kerja." },
    ],
  }),
  component: GuidePage,
});

const SAMPLE = [
  ["PT ABC Indonesia", "IT Staff", "https://www.jobstreet.co.id/...", "Menunggu Review", "01-09-2026", "Kontak HR: 0812xxxx"],
  ["Bank XYZ", "Data Analyst", "https://www.linkedin.com/jobs/...", "Interview HR", "05-09-2026", "Interview Senin 10.00"],
];

function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Panduan Penggunaan" description="Semua yang perlu Anda ketahui untuk memakai Job Tracker." />

      <Section title="1. Mencatat lamaran">
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Klik <strong>Tambah Lamaran</strong> di pojok kanan atas.</li>
          <li>Isi nama perusahaan dan posisi (wajib), link pendaftaran, status, dan catatan.</li>
          <li>Tanggal pendaftaran terisi otomatis dengan tanggal hari ini (WIB) — ubah manual jika mencatat lamaran lama.</li>
          <li>Buka <Link to="/lamaran" className="font-semibold text-primary hover:underline">Daftar Lamaran</Link> untuk mencari, memfilter status, mengurutkan tanggal, mengedit, atau menghapus.</li>
        </ol>
      </Section>

      <Section title="2. Arti setiap status">
        <ul className="grid gap-2 sm:grid-cols-2">
          {STATUSES.map((s) => (
            <li key={s.value} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
              <StatusBadge status={s.value} className="mt-0.5 shrink-0" />
              <span className="text-xs text-muted-foreground">{s.description}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Status <em>Baru Didaftarkan</em> sampai <em>Offering</em> dihitung sebagai lamaran <strong>aktif</strong> di dashboard.
        </p>
      </Section>

      <Section title="3. Import data dari Excel">
        <p>
          Buka <Link to="/import" className="font-semibold text-primary hover:underline">Import Excel</Link>, pilih file .xlsx/.xls, periksa preview, lalu klik <strong>Tambahkan</strong>. Data lama tidak dihapus — data hasil import ditambahkan ke daftar.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[720px] text-xs">
            <thead className="bg-muted/60">
              <tr>
                {EXCEL_HEADERS.map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((row, i) => (
                <tr key={i} className="border-t">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Kolom <strong>Tempat / Perusahaan</strong> dan <strong>Posisi</strong> wajib diisi; kolom lain opsional.</li>
          <li>Status ditulis sesuai nama di atas (huruf besar/kecil tidak berpengaruh). Kosong → Baru Didaftarkan.</li>
          <li>Tanggal boleh DD-MM-YYYY, DD/MM/YYYY, atau format tanggal Excel. Kosong → hari ini.</li>
        </ul>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => downloadTemplate()}>
          <Download /> Unduh template Excel
        </Button>
      </Section>

      <Section title="4. Penyimpanan, backup, dan restore">
        <p>
          Aplikasi ini berjalan sepenuhnya di browser dan menyimpan data di <strong>localStorage</strong> browser Anda. Data tetap ada setelah halaman di-refresh atau browser ditutup, tanpa memerlukan server atau database online.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li><strong>Backup:</strong> klik <em>Export Excel</em> di Daftar Lamaran untuk mengunduh seluruh data.</li>
          <li><strong>Restore:</strong> impor kembali file hasil export lewat halaman Import Excel.</li>
          <li>Data terikat pada browser dan perangkat ini. Membersihkan data situs (clear site data) atau memakai mode incognito akan menghapus data — lakukan export secara berkala.</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface p-6 text-sm leading-relaxed">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
