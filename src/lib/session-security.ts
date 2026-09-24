import { signOut } from "./auth";
import { toast } from "sonner";

const LAST_ACTIVE_KEY = "job-tracker:last-active-time";
const DEFAULT_TIMEOUT_MS = 60 * 60 * 1000; // 1 jam (60 menit)

/**
 * Menyimpan timestamp aktivitas user saat ini.
 */
export function recordUserActivity(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
}

/**
 * Menghapus data waktu sesi saat logout manual.
 */
export function clearSessionSecurity(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LAST_ACTIVE_KEY);
  } catch {
    // Abaikan
  }
}

/**
 * Mendapatkan timestamp aktivitas terakhir.
 */
export function getLastActiveTime(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_ACTIVE_KEY);
    if (!raw) return null;
    const time = Number(raw);
    return isNaN(time) ? null : time;
  } catch {
    return null;
  }
}

/**
 * Memeriksa apakah sesi telah kedaluwarsa karena tidak dibuka / tidak aktif selama > 1 jam.
 */
export function isSessionExpired(timeoutMs: number = DEFAULT_TIMEOUT_MS): boolean {
  const lastActive = getLastActiveTime();
  if (lastActive === null) return false;
  return Date.now() - lastActive > timeoutMs;
}

/**
 * Setup keamanan sesi otomatis:
 * - Jika aplikasi dibuka kembali dalam waktu <= 1 jam, sesi tetap aktif (otomatis login).
 * - Jika aplikasi tidak dibuka atau inaktif > 1 jam, otomatis logout demi keamanan.
 */
export function setupSessionSecurity(options?: {
  timeoutMs?: number;
  onExpired?: () => void;
}) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let isLoggingOut = false;

  const handleExpiry = async (reason: "idle" | "unopened") => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    clearSessionSecurity();

    try {
      await signOut();
    } catch {
      // Abaikan error jaringan saat logout
    }

    const message =
      reason === "unopened"
        ? "Sesi Anda telah kedaluwarsa demi keamanan karena aplikasi tidak dibuka selama lebih dari 1 jam. Silakan login kembali."
        : "Sesi Anda telah berakhir otomatis demi keamanan karena tidak ada aktivitas selama 1 jam.";

    toast.warning(message, {
      duration: 6000,
    });

    if (options?.onExpired) {
      options.onExpired();
    } else {
      window.location.assign("/auth/login");
    }
  };

  // 1. Cek langsung saat aplikasi pertama kali dimuat
  const lastActive = getLastActiveTime();
  if (lastActive !== null && Date.now() - lastActive > timeoutMs) {
    void handleExpiry("unopened");
    return () => {};
  }

  // Jika masih dalam rentang 1 jam atau baru pertama kali, catat aktivitas baru
  recordUserActivity();

  // 2. Pasang throttle listener untuk mencatat interaksi user
  let lastRecorded = Date.now();
  const onActivity = () => {
    const now = Date.now();
    // Throttle pembaruan localStorage tiap 5 detik
    if (now - lastRecorded > 5000) {
      lastRecorded = now;
      recordUserActivity();
    }
  };

  const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
  events.forEach((evt) => {
    window.addEventListener(evt, onActivity, { passive: true });
  });

  // 3. Listener saat tab kembali dibuka / visibility change (misal laptop baru dibuka kembali dari sleep)
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      const saved = getLastActiveTime();
      if (saved !== null && Date.now() - saved > timeoutMs) {
        void handleExpiry("unopened");
      } else {
        recordUserActivity();
      }
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("focus", onVisibilityChange);

  // 4. Timer interval untuk mendeteksi inaktivitas secara realtime (tiap 15 detik)
  const intervalId = window.setInterval(() => {
    const saved = getLastActiveTime();
    if (saved !== null && Date.now() - saved > timeoutMs) {
      void handleExpiry("idle");
    }
  }, 15000);

  return () => {
    window.clearInterval(intervalId);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("focus", onVisibilityChange);
    events.forEach((evt) => {
      window.removeEventListener(evt, onActivity);
    });
  };
}
