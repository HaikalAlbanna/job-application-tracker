import {
  type JobApplication,
  type ApplicationStatus,
  updateApplication,
} from "./applications";

export interface AutoStatusSettings {
  /** Aktifkan pembaruan status otomatis */
  enabled: boolean;
  /** Jumlah hari lamaran 'baru' otomatis berpindah ke 'menunggu' (3x 24 jam = 3 hari) */
  reviewAfterDays: number;
  /** Jumlah hari sejak tanggal didaftarkan untuk otomatis berubah ke 'tidak_ada_kabar' (10 hari) */
  noUpdateAfterDays: number;
  /** Waktu eksekusi pemeriksaan terakhir (ISO string) */
  lastRunAt: string | null;
  /** Jumlah pembaruan pada pemeriksaan terakhir */
  lastUpdatedCount: number;
}

export const DEFAULT_AUTO_STATUS_SETTINGS: AutoStatusSettings = {
  enabled: true,
  reviewAfterDays: 3, // 3x 24 jam
  noUpdateAfterDays: 10, // 10 hari tidak di-update
  lastRunAt: null,
  lastUpdatedCount: 0,
};

const SETTINGS_KEY = "job-tracker:auto-status-settings:v1";

/**
 * Membaca pengaturan pembaruan otomatis dari localStorage.
 */
export function getAutoStatusSettings(): AutoStatusSettings {
  if (typeof window === "undefined") return DEFAULT_AUTO_STATUS_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_AUTO_STATUS_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AutoStatusSettings>;
    return {
      enabled: parsed.enabled ?? DEFAULT_AUTO_STATUS_SETTINGS.enabled,
      reviewAfterDays: parsed.reviewAfterDays ?? DEFAULT_AUTO_STATUS_SETTINGS.reviewAfterDays,
      noUpdateAfterDays: parsed.noUpdateAfterDays ?? DEFAULT_AUTO_STATUS_SETTINGS.noUpdateAfterDays,
      lastRunAt: parsed.lastRunAt ?? null,
      lastUpdatedCount: parsed.lastUpdatedCount ?? 0,
    };
  } catch {
    return DEFAULT_AUTO_STATUS_SETTINGS;
  }
}

/**
 * Menyimpan pengaturan pembaruan otomatis ke localStorage.
 */
export function saveAutoStatusSettings(settings: Partial<AutoStatusSettings>): AutoStatusSettings {
  const current = getAutoStatusSettings();
  const next: AutoStatusSettings = { ...current, ...settings };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Gagal menyimpan pengaturan auto status", e);
    }
  }
  return next;
}

export interface StatusUpdateResult {
  updatedCount: number;
  details: Array<{
    id: string;
    company: string;
    position: string;
    oldStatus: ApplicationStatus;
    newStatus: ApplicationStatus;
    reason: string;
  }>;
}

/**
 * Mengurai string tanggal atau ISO string menjadi timestamp milidetik.
 */
function parseDateToMs(dateStr: string): number {
  const parsed = new Date(dateStr).getTime();
  if (!isNaN(parsed)) return parsed;

  // Fallback jika format YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime();
  }
  return Date.now();
}

/**
 * Mengecek dan menerapkan aturan pembaruan status otomatis pada daftar lamaran:
 * 1. Jika lamaran sudah 3x 24 jam didaftarkan -> berubah ke 'menunggu' (Menunggu Review).
 * 2. Jika setelah 10 hari masih tidak di-update -> berubah ke 'tidak_ada_kabar' (Tidak Ada Kabar).
 */
export async function executeAutoStatusCheck(
  applications: JobApplication[],
  customSettings?: AutoStatusSettings,
): Promise<StatusUpdateResult> {
  const settings = customSettings ?? getAutoStatusSettings();
  if (!settings.enabled || applications.length === 0) {
    return { updatedCount: 0, details: [] };
  }

  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const reviewThresholdMs = settings.reviewAfterDays * msInDay; // 3 x 24 jam
  const noUpdateThresholdMs = settings.noUpdateAfterDays * msInDay; // 10 hari

  const updatesToApply: Array<{
    app: JobApplication;
    newStatus: ApplicationStatus;
    reason: string;
  }> = [];

  for (const app of applications) {
    // Tanggal kapan lamaran didaftarkan/diajukan
    const registeredTimeMs = parseDateToMs(app.appliedDate || app.createdAt);
    const elapsedSinceRegistered = now - registeredTimeMs;

    // Aturan 2: Jika sudah >= 10 hari sejak lamaran didaftarkan dan masih belum ada kabar (status 'baru' atau 'menunggu')
    // Otomatis berubah status menjadi 'tidak_ada_kabar'
    if ((app.status === "baru" || app.status === "menunggu") && elapsedSinceRegistered >= noUpdateThresholdMs) {
      updatesToApply.push({
        app,
        newStatus: "tidak_ada_kabar",
        reason: `Sudah ${settings.noUpdateAfterDays} hari sejak tanggal lamaran didaftarkan (otomatis ke Tidak Ada Kabar)`,
      });
      continue;
    }

    // Aturan 1: Jika lamaran berstatus 'baru' dan sudah >= 3x 24 jam (3 hari) sejak didaftarkan
    // Otomatis berubah status menjadi 'menunggu' (Menunggu Review)
    if (app.status === "baru" && elapsedSinceRegistered >= reviewThresholdMs) {
      updatesToApply.push({
        app,
        newStatus: "menunggu",
        reason: `Sudah ${settings.reviewAfterDays}x 24 jam sejak didaftarkan (otomatis ke Menunggu Review)`,
      });
      continue;
    }
  }

  const details: StatusUpdateResult["details"] = [];

  for (const item of updatesToApply) {
    const oldStatus = item.app.status;
    const newStatus = item.newStatus;

    try {
      await updateApplication(item.app.id, {
        company: item.app.company,
        position: item.app.position,
        link: item.app.link,
        status: newStatus,
        appliedDate: item.app.appliedDate,
        notes: item.app.notes,
      });

      details.push({
        id: item.app.id,
        company: item.app.company,
        position: item.app.position,
        oldStatus,
        newStatus,
        reason: item.reason,
      });
    } catch (err) {
      console.error(`Gagal mengupdate status otomatis untuk lamaran ${item.app.id}`, err);
    }
  }

  // Simpan timestamp eksekusi terakhir
  saveAutoStatusSettings({
    lastRunAt: new Date().toISOString(),
    lastUpdatedCount: details.length,
  });

  return {
    updatedCount: details.length,
    details,
  };
}
