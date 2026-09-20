import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/AppShell";
import { ApplicationForm } from "@/components/app/ApplicationForm";
import { useApplications, useHydrated } from "@/hooks/useApplications";
import { updateApplication } from "@/lib/applications";

export const Route = createFileRoute("/lamaran/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Lamaran — Job Tracker" },
      { name: "description", content: "Ubah data lamaran kerja yang sudah tercatat." },
      { property: "og:title", content: "Edit Lamaran — Job Tracker" },
      { property: "og:description", content: "Ubah data lamaran kerja." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const apps = useApplications();
  const hydrated = useHydrated();
  const app = apps.find((a) => a.id === id);

  if (!hydrated) {
    return <div className="surface mx-auto h-96 max-w-3xl animate-pulse" />;
  }

  if (!app) {
    return (
      <div className="surface mx-auto max-w-lg p-10 text-center">
        <h1 className="text-xl font-bold">Lamaran tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted-foreground">Data mungkin sudah dihapus.</p>
        <Button asChild className="mt-6">
          <Link to="/lamaran">Kembali ke daftar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit Lamaran" description={`${app.position} — ${app.company}`} />
      <ApplicationForm
        key={app.id}
        initial={app}
        submitLabel="Simpan Perubahan"
        onSubmit={(data) => {
          updateApplication(app.id, data);
          toast.success("Perubahan tersimpan.");
          navigate({ to: "/lamaran" });
        }}
      />
    </div>
  );
}
