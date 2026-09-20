import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Pencil, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteApplication, formatDateID, type JobApplication } from "@/lib/applications";
import { StatusBadge } from "./StatusBadge";

interface Props {
  applications: JobApplication[];
  hydrated: boolean;
  emptyMessage?: string | undefined;
}

export function ApplicationTable({ applications, hydrated, emptyMessage }: Props) {
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteApplication(pendingDelete.id);
    toast.success(`Lamaran di ${pendingDelete.company} dihapus.`);
    setPendingDelete(null);
  };

  return (
    <>
      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Perusahaan</th>
                <th className="px-4 py-3 font-semibold">Posisi</th>
                <th className="px-4 py-3 font-semibold">Link</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Catatan</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {!hydrated ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Inbox className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                    <p className="font-medium text-foreground">{emptyMessage ?? "Belum ada data lamaran"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tambah lamaran baru atau impor dari file Excel.
                    </p>
                  </td>
                </tr>
              ) : (
                applications.map((a) => (
                  <tr key={a.id} className="border-b transition-colors last:border-0 hover:bg-muted/40">
                    <td className="max-w-[220px] px-4 py-3 font-semibold text-foreground">
                      <span className="line-clamp-2">{a.company}</span>
                    </td>
                    <td className="max-w-[200px] px-4 py-3 text-foreground">
                      <span className="line-clamp-2">{a.position}</span>
                    </td>
                    <td className="px-4 py-3">
                      {a.link ? (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          Buka <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-foreground">
                      {formatDateID(a.appliedDate)}
                    </td>
                    <td className="max-w-[260px] px-4 py-3 text-muted-foreground">
                      {a.notes ? (
                        <span className="line-clamp-2" title={a.notes}>
                          {a.notes}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label="Edit">
                          <Link to="/lamaran/$id/edit" params={{ id: a.id }}>
                            <Pencil />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Hapus"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setPendingDelete(a)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus lamaran ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Data lamaran <strong>{pendingDelete?.position}</strong> di{" "}
              <strong>{pendingDelete?.company}</strong> akan dihapus permanen dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
