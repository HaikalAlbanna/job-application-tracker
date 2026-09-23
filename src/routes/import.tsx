import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/AppShell";
import { StatusBadge } from "@/components/app/StatusBadge";
import { addManyApplications, formatDateID } from "@/lib/applications";
import { parseExcelFile, downloadTemplate, EXCEL_HEADERS, type ImportRow } from "@/lib/excel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/import")({
  head: () => ({
    meta: [
      { title: "Import Excel — Job Tracker" },
      { name: "description", content: "Impor data lamaran kerja lama dari file Excel (.xlsx / .xls) dengan preview dan validasi." },
      { property: "og:title", content: "Import Excel — Job Tracker" },
      { property: "og:description", content: "Impor data lamaran lama dari file Excel." },
    ],
  }),
  component: ImportPage,
});

function ImportPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setRows(null);
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      setError("Format file tidak didukung. Gunakan file .xlsx atau .xls.");
      return;
    }
    setFileName(file.name);
    setLoading(true);
    try {
      const result = await parseExcelFile(file);
      setRows(result.rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membaca file.");
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRows(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const valid = rows?.filter((r) => r.data) ?? [];
  const invalid = rows?.filter((r) => !r.data) ?? [];

  const handleImport = async () => {
    if (valid.length === 0) return;
    try {
      const n = await addManyApplications(valid.map((r) => r.data!));
      toast.success(`${n} data berhasil diimpor.${invalid.length ? ` ${invalid.length} baris dilewati karena tidak valid.` : ""}`);
      navigate({ to: "/lamaran" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengimpor data.";
      toast.error(message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Import Excel"
        description="Masukkan data lamaran lama dari file .xlsx / .xls. Data baru akan ditambahkan tanpa menghapus data yang sudah ada."
        actions={
          <Button variant="outline" onClick={() => downloadTemplate()}>
            <Download /> Unduh Template
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {!rows && (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              className={cn(
                "surface flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-12 text-center transition-colors",
                dragging ? "border-primary bg-primary-soft/50" : "hover:border-primary/50 hover:bg-muted/40",
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                {loading ? <FileSpreadsheet className="size-7 animate-pulse" /> : <Upload className="size-7" />}
              </span>
              <p className="mt-4 text-base font-bold">{loading ? "Membaca file..." : "Pilih atau seret file Excel ke sini"}</p>
              <p className="mt-1 text-sm text-muted-foreground">Mendukung .xlsx dan .xls. Sheet pertama akan dibaca.</p>
              <span className="mt-5 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-float">
                Import Excel
              </span>
            </label>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 p-4 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {rows && (
            <div className="surface overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/60 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2 text-sm">
                  <FileSpreadsheet className="size-4 shrink-0 text-primary" />
                  <span className="truncate font-semibold">{fileName}</span>
                  <span className="text-muted-foreground">· {rows.length} baris</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 text-success">
                    <CheckCircle2 className="size-3.5" /> {valid.length} valid
                  </span>
                  <span className={cn("inline-flex items-center gap-1", invalid.length ? "text-destructive" : "text-muted-foreground")}>
                    <AlertTriangle className="size-3.5" /> {invalid.length} gagal
                  </span>
                  <Button variant="ghost" size="icon" onClick={reset} aria-label="Batalkan">
                    <X />
                  </Button>
                </div>
              </div>
              <div className="max-h-130 overflow-auto">
                <table className="w-full min-w-205 text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2 font-semibold">#</th>
                      <th className="px-4 py-2 font-semibold">Perusahaan</th>
                      <th className="px-4 py-2 font-semibold">Posisi</th>
                      <th className="px-4 py-2 font-semibold">Status</th>
                      <th className="px-4 py-2 font-semibold">Tanggal</th>
                      <th className="px-4 py-2 font-semibold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.rowNumber} className={cn("border-b last:border-0", !r.data && "bg-destructive/5")}>
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">{r.rowNumber}</td>
                        <td className="px-4 py-2 font-medium">{r.data?.company ?? String(Object.values(r.raw)[0] ?? "")}</td>
                        <td className="px-4 py-2">{r.data?.position ?? "—"}</td>
                        <td className="px-4 py-2">{r.data ? <StatusBadge status={r.data.status} /> : "—"}</td>
                        <td className="px-4 py-2 tabular-nums">{r.data ? formatDateID(r.data.appliedDate) : "—"}</td>
                        <td className="px-4 py-2">
                          {r.data ? (
                            <span className="text-xs font-semibold text-success">Siap diimpor</span>
                          ) : (
                            <ul className="text-xs text-destructive">
                              {r.errors.map((e) => (
                                <li key={e}>{e}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Baris yang gagal akan dilewati. Perbaiki di Excel lalu impor ulang jika perlu.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={reset}>
                    Pilih file lain
                  </Button>
                  <Button onClick={handleImport} disabled={valid.length === 0} className="shadow-float">
                    Tambahkan {valid.length} data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="surface h-fit p-5 text-sm">
          <h2 className="font-bold">Format kolom Excel</h2>
          <p className="mt-1 text-xs text-muted-foreground">Baris pertama adalah judul kolom. Urutan kolom bebas.</p>
          <ul className="mt-4 space-y-2">
            {EXCEL_HEADERS.map((h, i) => (
              <li key={h} className="flex items-start justify-between gap-2 rounded-md bg-muted/60 px-3 py-2">
                <span className="font-semibold">{h}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{i < 2 ? "wajib" : "opsional"}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <p>• Status kosong → <em>Baru Didaftarkan</em>.</p>
            <p>• Tanggal kosong → hari ini (WIB). Format DD-MM-YYYY, DD/MM/YYYY, atau tanggal Excel.</p>
            <p>• Status harus sesuai salah satu nama status di aplikasi.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
