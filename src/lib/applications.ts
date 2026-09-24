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

/* ---------- Supabase-backed store ---------- */

import { getSupabaseClient } from "./supabase";

const STORAGE_KEY = "job-tracker:applications:v1";
const EMPTY: JobApplication[] = [];

function isValidApplication(value: unknown): value is JobApplication {
  if (value == null || typeof value !== "object") return false;

  const app = value as Record<string, unknown>;
  return (
    typeof app["id"] === "string" &&
    typeof app["company"] === "string" &&
    typeof app["position"] === "string" &&
    typeof app["link"] === "string" &&
    typeof app["status"] === "string" &&
    isStatus(app["status"]) &&
    typeof app["appliedDate"] === "string" &&
    typeof app["notes"] === "string" &&
    typeof app["createdAt"] === "string" &&
    typeof app["updatedAt"] === "string"
  );
}

function sanitizeApplications(value: unknown): JobApplication[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isValidApplication);
}

function readLocalStorage(): JobApplication[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    const sanitized = sanitizeApplications(parsed);
    if (sanitized.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch {
    return [];
  }
}

function persistLocalFallback(next: JobApplication[]) {
  if (typeof window === "undefined") return;
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.error("Gagal menyimpan ke localStorage", e);
  }
  listeners.forEach((l) => l());
}

function mapDbRow(row: Record<string, unknown>): JobApplication {
  const status = typeof row["status"] === "string" && isStatus(row["status"]) ? row["status"] : "baru";

  return {
    id: String(row["id"] ?? cryptoRandomId()),
    company: String(row["company"] ?? ""),
    position: String(row["position"] ?? ""),
    link: String(row["link"] ?? ""),
    status,
    appliedDate: String(row["applied_date"] ?? row["appliedDate"] ?? todayWIB()),
    notes: String(row["notes"] ?? ""),
    createdAt: String(row["created_at"] ?? row["createdAt"] ?? new Date().toISOString()),
    updatedAt: String(row["updated_at"] ?? row["updatedAt"] ?? new Date().toISOString()),
  };
}

function dbInsertPayload(input: JobApplicationInput) {
  return {
    company: input.company,
    position: input.position,
    link: input.link,
    status: input.status,
    applied_date: input.appliedDate,
    notes: input.notes,
  };
}

let cache: JobApplication[] | null = null;
let syncInFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function getCurrentUserId(): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return null;
    return user.id;
  } catch {
    return null;
  }
}

async function syncFromSupabase(): Promise<void> {
  if (typeof window === "undefined") return;

  const client = getSupabaseClient();
  if (!client) return;

  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      const fallback = readLocalStorage();
      cache = fallback;
      notify();
      return;
    }

    const { data, error } = await client
      .from("job_applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    const next = (data ?? []).map((row) => mapDbRow(row as Record<string, unknown>));
    cache = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore local persistence failures and keep app usable
    }
    notify();
  } catch (e) {
    console.warn("Gagal mengambil data dari Supabase, fallback ke localStorage.", e);
    const fallback = readLocalStorage();
    cache = fallback;
    notify();
  }
}

export const applicationStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (typeof window !== "undefined" && !syncInFlight) {
      syncInFlight = syncFromSupabase().finally(() => {
        syncInFlight = null;
      });
    }
    return () => listeners.delete(listener);
  },
  getSnapshot: () => {
    if (typeof window !== "undefined" && cache === null) {
      cache = readLocalStorage();
      if (!syncInFlight) {
        syncInFlight = syncFromSupabase().finally(() => {
          syncInFlight = null;
        });
      }
    }
    return cache ?? EMPTY;
  },
  getServerSnapshot: () => EMPTY,
};

export async function addApplication(input: JobApplicationInput): Promise<JobApplication> {
  if (typeof window === "undefined") {
    return { ...input, id: cryptoRandomId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  }

  const client = getSupabaseClient();
  if (!client) {
    const local: JobApplication = {
      ...input,
      id: cryptoRandomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persistLocalFallback([local, ...readLocalStorage()]);
    return local;
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error("User belum login. Silakan login terlebih dahulu.");
    }

    const { data, error } = await (client.from("job_applications") as any)
      .insert({ ...dbInsertPayload(input), user_id: userId })
      .select()
      .single();

    if (error) throw error;
    const created = mapDbRow(data as Record<string, unknown>);
    const next = [created, ...(cache ?? readLocalStorage())];
    persistLocalFallback(next);
    return created;
  } catch (e) {
    console.warn("Supabase insert gagal; fallback ke localStorage.", e);
    const local: JobApplication = {
      ...input,
      id: cryptoRandomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persistLocalFallback([local, ...readLocalStorage()]);
    return local;
  }
}

export async function addManyApplications(inputs: JobApplicationInput[]): Promise<number> {
  if (inputs.length === 0) return 0;

  const client = getSupabaseClient();
  if (!client) {
    const localApps = inputs.map((input) => ({
      ...input,
      id: cryptoRandomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    persistLocalFallback([...localApps, ...readLocalStorage()]);
    return localApps.length;
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error("User belum login. Silakan login terlebih dahulu.");
    }

    const rows = inputs.map((input) => ({ ...dbInsertPayload(input), user_id: userId }));
    const { data, error } = await (client.from("job_applications") as any).insert(rows).select();
    if (error) throw error;
    const imported = ((data ?? []) as Array<Record<string, unknown>>).map((row: Record<string, unknown>) => mapDbRow(row));
    const next = [...imported, ...(cache ?? readLocalStorage())];
    persistLocalFallback(next);
    return imported.length;
  } catch (e) {
    console.warn("Supabase bulk insert gagal; fallback ke localStorage.", e);
    const localApps = inputs.map((input) => ({
      ...input,
      id: cryptoRandomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    persistLocalFallback([...localApps, ...readLocalStorage()]);
    return localApps.length;
  }
}

export async function updateApplication(id: string, input: JobApplicationInput): Promise<void> {
  if (typeof window === "undefined") return;

  const client = getSupabaseClient();
  if (!client) {
    const next = (cache ?? readLocalStorage()).map((a) => (a.id === id ? { ...a, ...input, updatedAt: new Date().toISOString() } : a));
    persistLocalFallback(next);
    return;
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error("User belum login. Silakan login terlebih dahulu.");
    }

    const { error } = await (client.from("job_applications") as any)
      .update({
        company: input.company,
        position: input.position,
        link: input.link,
        status: input.status,
        applied_date: input.appliedDate,
        notes: input.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    const next = (cache ?? readLocalStorage()).map((a) => (a.id === id ? { ...a, ...input, updatedAt: new Date().toISOString() } : a));
    persistLocalFallback(next);
    await syncFromSupabase();
  } catch (e) {
    console.warn("Supabase update gagal; fallback ke localStorage.", e);
    const next = (cache ?? readLocalStorage()).map((a) => (a.id === id ? { ...a, ...input, updatedAt: new Date().toISOString() } : a));
    persistLocalFallback(next);
  }
}

export async function deleteApplication(id: string): Promise<void> {
  if (typeof window === "undefined") return;

  const client = getSupabaseClient();
  if (!client) {
    const next = (cache ?? readLocalStorage()).filter((a) => a.id !== id);
    persistLocalFallback(next);
    return;
  }

  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error("User belum login. Silakan login terlebih dahulu.");
    }

    const { error } = await client.from("job_applications").delete().eq("id", id).eq("user_id", userId);
    if (error) throw error;
    const next = (cache ?? readLocalStorage()).filter((a) => a.id !== id);
    persistLocalFallback(next);
    await syncFromSupabase();
  } catch (e) {
    console.warn("Supabase delete gagal; fallback ke localStorage.", e);
    const next = (cache ?? readLocalStorage()).filter((a) => a.id !== id);
    persistLocalFallback(next);
  }
}

export function replaceAllApplications(apps: JobApplication[]): void {
  persistLocalFallback(apps);
}
