import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/AppShell";
import { ApplicationForm } from "@/components/app/ApplicationForm";
import { addApplication } from "@/lib/applications";

export const Route = createFileRoute("/lamaran/baru")({
  head: () => ({
    meta: [
      { title: "Tambah Lamaran — Job Tracker" },
      { name: "description", content: "Catat lamaran kerja baru dengan status, tanggal WIB otomatis, dan catatan." },
      { property: "og:title", content: "Tambah Lamaran — Job Tracker" },
      { property: "og:description", content: "Catat lamaran kerja baru." },
    ],
  }),
  component: NewPage,
});

function NewPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Tambah Lamaran" description="Isi data lamaran baru. Tanggal terisi otomatis dengan waktu Indonesia (WIB)." />
      <ApplicationForm
        submitLabel="Simpan Lamaran"
        onSubmit={(data) => {
          addApplication(data);
          toast.success(`Lamaran ${data.position} di ${data.company} tersimpan.`);
          navigate({ to: "/lamaran" });
        }}
      />
    </div>
  );
}
