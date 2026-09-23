import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { BriefcaseBusiness, LayoutDashboard, ListChecks, FileSpreadsheet, BookOpen, Plus, LogIn } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/lamaran", label: "Daftar Lamaran", icon: ListChecks },
  { to: "/import", label: "Import Excel", icon: FileSpreadsheet },
  { to: "/panduan", label: "Panduan", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<"loading" | "authed" | "guest">("loading");

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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-float">
              <BriefcaseBusiness className="size-5" />
            </span>
            <span className="hidden truncate text-base font-extrabold tracking-tight sm:block">
              Job Tracker
            </span>
          </Link>

          <nav className="order-3 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:order-none">
            <div className="flex min-w-max items-center gap-1">
              {NAV.map(({ to, label, icon: Icon, ...rest }) => (
                <Link
                  key={to}
                  to={to}
                  activeOptions={{ exact: "exact" in rest }}
                  className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  activeProps={{ className: "bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary" }}
                >
                  <Icon className="size-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <Button asChild size="sm" className="ml-auto shrink-0 shadow-float sm:ml-0">
            <Link to="/lamaran/baru">
              <Plus /> <span className="hidden sm:inline">Tambah Lamaran</span>
              <span className="sm:hidden">Tambah</span>
            </Link>
          </Button>
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
    <div className="mb-6 flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
