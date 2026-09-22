export type ApplicationStatus =
  | "baru"
  | "menunggu"
  | "screening"
  | "tes"
  | "interview_hr"
  | "interview_user"
  | "offering"
  | "diterima"
  | "ditolak"
  | "mundur"
  | "tidak_ada_kabar"
  | "ditutup";

export interface StatusMeta {
  value: ApplicationStatus;
  label: string;
  description: string;
  /** Tailwind color token name registered in styles.css */
  color: string;
  active: boolean;
}

export const STATUSES: StatusMeta[] = [
  { value: "baru", label: "Baru Didaftarkan", description: "Lamaran baru saja dikirim.", color: "status-baru", active: true },
  { value: "menunggu", label: "Menunggu Review", description: "Menunggu perusahaan meninjau lamaran.", color: "status-menunggu", active: true },
  { value: "screening", label: "Lolos Screening", description: "Lolos seleksi administrasi / screening awal.", color: "status-screening", active: true },
  { value: "tes", label: "Tes / Assessment", description: "Sedang menjalani tes kemampuan, psikotes, atau assessment.", color: "status-tes", active: true },
  { value: "interview_hr", label: "Interview HR", description: "Sedang mengikuti wawancara HR.", color: "status-interview-hr", active: true },
  { value: "interview_user", label: "Interview User", description: "Sedang mengikuti wawancara dengan user / departemen terkait.", color: "status-interview-user", active: true },
  { value: "offering", label: "Offering", description: "Mendapatkan penawaran pekerjaan.", color: "status-offering", active: true },
  { value: "diterima", label: "Diterima", description: "Berhasil diterima bekerja.", color: "status-diterima", active: false },
  { value: "ditolak", label: "Ditolak", description: "Lamaran tidak berhasil atau ditolak.", color: "status-ditolak", active: false },
  { value: "mundur", label: "Mengundurkan Diri", description: "Mengundurkan diri dari proses rekrutmen.", color: "status-mundur", active: false },
  { value: "tidak_ada_kabar", label: "Tidak Ada Kabar", description: "Tidak ada informasi lanjutan dari perusahaan.", color: "status-tidak-ada-kabar", active: false },
  { value: "ditutup", label: "Lowongan Ditutup", description: "Lowongan sudah ditutup oleh perusahaan.", color: "status-ditutup", active: false },
];

export const STATUS_MAP: Record<ApplicationStatus, StatusMeta> = Object.fromEntries(
  STATUSES.map((s) => [s.value, s]),
) as Record<ApplicationStatus, StatusMeta>;

export function isStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && value in STATUS_MAP;
}

/** Match a free-text status (label or value, case-insensitive) to a status value. */
export function resolveStatus(raw: unknown): ApplicationStatus | null {
  if (raw == null) return null;
  const text = String(raw).trim().toLowerCase();
  if (!text) return null;
  const normalized = text.replace(/[^a-z]/g, "");
  for (const s of STATUSES) {
    if (s.value === text) return s.value;
    if (s.label.toLowerCase() === text) return s.value;
    if (s.label.toLowerCase().replace(/[^a-z]/g, "") === normalized) return s.value;
  }
  return null;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  link: string;
  status: ApplicationStatus;
  /** ISO date, YYYY-MM-DD (WIB calendar date) */
  appliedDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type JobApplicationInput = Omit<JobApplication, "id" | "createdAt" | "updatedAt">;

/* ---------- Date helpers (WIB / UTC+7) ---------- */

export function todayWIB(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** YYYY-MM-DD -> DD-MM-YYYY */
export function formatDateID(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** Month label from YYYY-MM-DD, e.g. "Sep 2026" */
export function monthLabel(iso: string): string {
  const [y, m] = iso.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${names[Number(m) - 1] ?? m} ${y}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

function validYMD(y: number, m: number, d: number): string | null {
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2200) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** Parse many date shapes (DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, Excel serial, Date) into YYYY-MM-DD. */
export function parseDateFlexible(raw: unknown): string | null {
  if (raw == null || raw === "") return null;
  if (raw instanceof Date && !isNaN(raw.getTime())) {
    return validYMD(raw.getFullYear(), raw.getMonth() + 1, raw.getDate());
  }
  if (typeof raw === "number") {
    // Excel serial date (days since 1899-12-30)
    const ms = Math.round((raw - 25569) * 86400 * 1000);
    const d = new Date(ms);
    return validYMD(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  const text = String(raw).trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(text);
  if (m) return validYMD(Number(m[1]), Number(m[2]), Number(m[3]));
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(text);
  if (m) return validYMD(Number(m[3]), Number(m[2]), Number(m[1]));
  const d = new Date(text);
  if (!isNaN(d.getTime())) return validYMD(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return null;
}

/* ---------- Local storage store ---------- */

const STORAGE_KEY = "job-tracker:applications:v1";
const EMPTY: JobApplication[] = [];

function isValidApplication(value: unknown): value is JobApplication {
  if (value == null || typeof value !== "object") return false;

  const app = value as Record<string, unknown>;
  return (
    typeof app.id === "string" &&
    typeof app.company === "string" &&
    typeof app.position === "string" &&
    typeof app.link === "string" &&
    typeof app.status === "string" &&
    isStatus(app.status) &&
    typeof app.appliedDate === "string" &&
    typeof app.notes === "string" &&
    typeof app.createdAt === "string" &&
    typeof app.updatedAt === "string"
  );
}

function sanitizeApplications(value: unknown): JobApplication[] {
  if (!Array.isArray(value)) return [];
  const cleaned = value.filter(isValidApplication);
  return cleaned;
}

let cache: JobApplication[] | null = null;
const listeners = new Set<() => void>();

function read(): JobApplication[] {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    const sanitized = sanitizeApplications(parsed);
    if (sanitized.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
      cache = sanitized;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      } catch {
        // ignore write failures; keep the app usable even with a broken storage payload
      }
      return cache;
    }
    cache = sanitized;
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: JobApplication[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.error("Gagal menyimpan ke localStorage", e);
  }
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listeners.forEach((l) => l());
    }
  });
}

export const applicationStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => read(),
  getServerSnapshot: () => EMPTY,
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function addApplication(input: JobApplicationInput): JobApplication {
  const now = new Date().toISOString();
  const app: JobApplication = { ...input, id: newId(), createdAt: now, updatedAt: now };
  write([app, ...read()]);
  return app;
}

export function addManyApplications(inputs: JobApplicationInput[]): number {
  const now = new Date().toISOString();
  const apps = inputs.map((input) => ({ ...input, id: newId(), createdAt: now, updatedAt: now }));
  write([...apps, ...read()]);
  return apps.length;
}

export function updateApplication(id: string, input: JobApplicationInput): void {
  const now = new Date().toISOString();
  write(read().map((a) => (a.id === id ? { ...a, ...input, updatedAt: now } : a)));
}

export function deleteApplication(id: string): void {
  write(read().filter((a) => a.id !== id));
}

export function replaceAllApplications(apps: JobApplication[]): void {
  write(apps);
}
