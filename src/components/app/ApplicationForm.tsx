import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  STATUSES,
  todayWIB,
  formatDateID,
  type JobApplication,
  type JobApplicationInput,
} from "@/lib/applications";
import { StatusBadge } from "./StatusBadge";

const schema = z.object({
  company: z.string().trim().min(1, "Nama perusahaan wajib diisi").max(150, "Maksimal 150 karakter"),
  position: z.string().trim().min(1, "Posisi wajib diisi").max(150, "Maksimal 150 karakter"),
  link: z
    .string()
    .trim()
    .max(2000, "Link terlalu panjang")
    .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), "Link harus diawali http:// atau https://"),
  status: z.enum(STATUSES.map((s) => s.value) as [string, ...string[]]),
  appliedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal wajib diisi"),
  notes: z.string().trim().max(2000, "Catatan maksimal 2000 karakter"),
});

type FieldErrors = Partial<Record<keyof JobApplicationInput, string>>;

interface Props {
  initial?: JobApplication;
  onSubmit: (data: JobApplicationInput) => void;
  submitLabel: string;
}

export function ApplicationForm({ initial, onSubmit, submitLabel }: Props) {
  const navigate = useNavigate();
  const [values, setValues] = useState<JobApplicationInput>({
    company: initial?.company ?? "",
    position: initial?.position ?? "",
    link: initial?.link ?? "",
    status: initial?.status ?? "baru",
    appliedDate: initial?.appliedDate ?? todayWIB(),
    notes: initial?.notes ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof JobApplicationInput>(key: K, value: JobApplicationInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const next: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof JobApplicationInput;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSaving(true);
    onSubmit(result.data as JobApplicationInput);
  };

  return (
    <form onSubmit={handleSubmit} className="surface p-6 sm:p-8" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nama Perusahaan / Tempat" required error={errors.company}>
          <input
            className="field"
            placeholder="PT ABC Indonesia"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            autoFocus
          />
        </Field>
        <Field label="Posisi yang Dilamar" required error={errors.position}>
          <input
            className="field"
            placeholder="IT Staff, Admin, Data Analyst"
            value={values.position}
            onChange={(e) => set("position", e.target.value)}
          />
        </Field>
        <Field label="Link Pendaftaran" error={errors.link} className="sm:col-span-2">
          <input
            className="field"
            type="url"
            placeholder="https://www.jobstreet.co.id/..."
            value={values.link}
            onChange={(e) => set("link", e.target.value)}
          />
        </Field>
        <Field label="Status Lamaran" required error={errors.status}>
          <select
            className="field"
            value={values.status}
            onChange={(e) => set("status", e.target.value as JobApplicationInput["status"])}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <StatusBadge status={values.status} />
            <span>{STATUSES.find((s) => s.value === values.status)?.description}</span>
          </div>
        </Field>
        <Field
          label="Tanggal Pendaftaran"
          required
          error={errors.appliedDate}
          hint={`Otomatis terisi hari ini (WIB). Tampil sebagai ${formatDateID(values.appliedDate)}.`}
        >
          <div className="relative">
            <input
              className="field pr-10"
              type="date"
              value={values.appliedDate}
              max="2200-12-31"
              onChange={(e) => set("appliedDate", e.target.value)}
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>
        <Field label="Catatan" error={errors.notes} className="sm:col-span-2" hint="Opsional. Jadwal interview, hasil tes, kontak HR, dll.">
          <textarea
            className="field h-28 resize-y py-2"
            placeholder="Contoh: Interview HR Senin 22 Sep pukul 10.00 via Zoom"
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t pt-6">
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/lamaran" })}>
          Batal
        </Button>
        <Button type="submit" disabled={saving} className="shadow-float">
          {saving ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | undefined;
  hint?: string | undefined;
  className?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-destructive">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}
