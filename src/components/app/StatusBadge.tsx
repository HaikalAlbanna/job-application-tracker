import { STATUS_MAP, type ApplicationStatus } from "@/lib/applications";
import { cn } from "@/lib/utils";

const COLOR_CLASSES: Record<ApplicationStatus, string> = {
  baru: "bg-status-baru/12 text-status-baru border-status-baru/25",
  menunggu: "bg-status-menunggu/15 text-status-menunggu border-status-menunggu/30",
  screening: "bg-status-screening/12 text-status-screening border-status-screening/25",
  tes: "bg-status-tes/12 text-status-tes border-status-tes/25",
  interview_hr: "bg-status-interview-hr/12 text-status-interview-hr border-status-interview-hr/25",
  interview_user: "bg-status-interview-user/12 text-status-interview-user border-status-interview-user/25",
  offering: "bg-status-offering/15 text-status-offering border-status-offering/30",
  diterima: "bg-status-diterima/12 text-status-diterima border-status-diterima/25",
  ditolak: "bg-status-ditolak/12 text-status-ditolak border-status-ditolak/25",
  mundur: "bg-status-mundur/12 text-status-mundur border-status-mundur/25",
  tidak_ada_kabar: "bg-status-tidak-ada-kabar/15 text-status-tidak-ada-kabar border-status-tidak-ada-kabar/30",
  ditutup: "bg-status-ditutup/12 text-status-ditutup border-status-ditutup/25",
};

export const STATUS_DOT: Record<ApplicationStatus, string> = {
  baru: "bg-status-baru",
  menunggu: "bg-status-menunggu",
  screening: "bg-status-screening",
  tes: "bg-status-tes",
  interview_hr: "bg-status-interview-hr",
  interview_user: "bg-status-interview-user",
  offering: "bg-status-offering",
  diterima: "bg-status-diterima",
  ditolak: "bg-status-ditolak",
  mundur: "bg-status-mundur",
  tidak_ada_kabar: "bg-status-tidak-ada-kabar",
  ditutup: "bg-status-ditutup",
};

export function StatusBadge({ status, className }: { status: ApplicationStatus; className?: string }) {
  const meta = STATUS_MAP[status];
  if (!meta) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        COLOR_CLASSES[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
      {meta.label}
    </span>
  );
}
