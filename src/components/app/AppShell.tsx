import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  ListChecks,
  FileSpreadsheet,
  BookOpen,
  Settings,
  LogIn,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { setupSessionSecurity } from "@/lib/session-security";
import { executeAutoStatusCheck, getAutoStatusSettings } from "@/lib/auto-status";
import { applicationStore } from "@/lib/applications";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/lamaran", label: "Daftar Lamaran", icon: ListChecks },
  { to: "/import", label: "Import Excel", icon: FileSpreadsheet },
  { to: "/panduan", label: "Panduan", icon: BookOpen },
  { to: "/pengaturan", label: "Pengaturan", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<"loading" | "authed" | "guest">("loading");
  const autoStatusCheckedRef = useRef(false);

  useEffect(() => {
    const isAuthRoute = location.pathname.startsWith("/auth");
    const client = getSupabaseClient();

    if (isAuthRoute) {
      setAuthState("guest");
      return;
    }

    if (!client) {
      setAuthState("guest");
      return;
    }

    let active = true;

    client.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;

      if (!session) {
        setAuthState("guest");
        if (location.pathname !== "/auth/login") {
          navigate({ to: "/auth/login" });
        }
        return;
      }

      setAuthState("authed");
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (!session) {
        setAuthState("guest");
        if (location.pathname !== "/auth/login") {
          navigate({ to: "/auth/login" });
        }
        return;
      }

      setAuthState("authed");
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

  // Keamanan sesi: otomatis login jika dibuka <= 1 jam, otomatis logout jika > 1 jam tidak dibuka / inaktif
  useEffect(() => {
    if (authState !== "authed") return;

    const cleanup = setupSessionSecurity({
      timeoutMs: 60 * 60 * 1000, // 1 jam
      onExpired: () => {
        navigate({ to: "/auth/login" });
      },
    });

    return cleanup;
  }, [authState, navigate]);

  // Otomatisasi status lamaran saat user login / data siap
  useEffect(() => {
    if (authState !== "authed" || autoStatusCheckedRef.current) return;

    const runAutoStatus = async () => {
      const settings = getAutoStatusSettings();
      if (!settings.enabled) return;

      const apps = applicationStore.getSnapshot();
      if (apps.length === 0) return;

      autoStatusCheckedRef.current = true;
      try {
        const result = await executeAutoStatusCheck(apps, settings);
        if (result.updatedCount > 0) {
          toast.info(
            `Pembaruan Otomatis: ${result.updatedCount} status lamaran disesuaikan (Menunggu Review / Tidak Ada Kabar).`,
            {
              duration: 5000,
              action: {
                label: "Lihat",
                onClick: () => navigate({ to: "/pengaturan" }),
              },
            },
          );
        }
      } catch (err) {
        console.error("Gagal menjalankan pemeriksaan status otomatis", err);
      }
    };

    // Beri jeda singkat agar store terhidrasi
    const timer = setTimeout(runAutoStatus, 1500);
    return () => clearTimeout(timer);
  }, [authState, navigate]);

  const handleHeaderLogout = async () => {
    try {
      await signOut();
      toast.success("Berhasil logout.");
      navigate({ to: "/auth/login" });
    } catch {
      toast.error("Gagal logout.");
    }
  };

  const isAuthRoute = location.pathname.startsWith("/auth");

  if (isAuthRoute) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="surface max-w-md p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">Memeriksa sesi akun...</p>
        </div>
      </div>
    );
  }

  if (authState === "guest") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="surface max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <LogIn className="size-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Login diperlukan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Silakan masuk untuk mengelola data lamaran kerja Anda.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/auth/login">Masuk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth/register">Daftar</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-2.5 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-0">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-float">
                <BriefcaseBusiness className="size-5" />
              </span>
              <span className="text-base font-extrabold tracking-tight">
                Job Tracker
              </span>
            </Link>

            {/* Tombol Logout untuk tampilan mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHeaderLogout}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground sm:hidden"
              title="Logout akun"
            >
              <LogOut className="size-4" />
              <span>Keluar</span>
            </Button>
          </div>

          {/* Navigasi Utama */}
          <nav className="flex items-center gap-1 overflow-x-auto [-ms-overflow-style:none] scrollbar-none pb-1 sm:pb-0 sm:flex-1 sm:justify-center">
            <div className="flex min-w-max items-center gap-1">
              {NAV.map(({ to, label, icon: Icon, ...rest }) => (
                <Link
                  key={to}
                  to={to}
                  activeOptions={{ exact: "exact" in rest }}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-3 sm:py-2 sm:text-sm"
                  activeProps={{ className: "bg-primary-soft text-primary font-semibold hover:bg-primary-soft hover:text-primary" }}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Sisi Kanan Desktop: Status Sesi & Logout */}
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600"
              title="Autentikasi keamanan aktif: Sesi otomatis bertahan 1 jam"
            >
              <ShieldCheck className="size-3.5" />
              <span>Sesi Aman 1 Jam</span>
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleHeaderLogout}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              title="Logout akun"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-muted-foreground sm:px-6">
        Data tersimpan secara aman per akun dan terhubung ke Supabase.
      </footer>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
