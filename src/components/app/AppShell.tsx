import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, LayoutDashboard, ListChecks, FileSpreadsheet, BookOpen, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/lamaran", label: "Daftar Lamaran", icon: ListChecks },
  { to: "/import", label: "Import Excel", icon: FileSpreadsheet },
  { to: "/panduan", label: "Panduan", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-float">
              <BriefcaseBusiness className="size-5" />
            </span>
            <span className="hidden truncate text-base font-extrabold tracking-tight sm:block">
              Job Tracker
            </span>
          </Link>

          <nav className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto">
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
          </nav>

          <Button asChild size="sm" className="shrink-0 shadow-float">
            <Link to="/lamaran/baru">
              <Plus /> <span className="hidden sm:inline">Tambah Lamaran</span>
              <span className="sm:hidden">Tambah</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-muted-foreground sm:px-6">
        Data tersimpan secara lokal di browser ini. Ekspor ke Excel secara berkala untuk cadangan.
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
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
