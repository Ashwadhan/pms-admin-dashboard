import { cn } from "@/lib/utils";
import type { Status } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full text-[11px] font-medium",
        status === "Active" ? "bg-[#DCFCE7] text-[#10B981]" : "bg-[#F3F4F6] text-[#6B7280]",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "Active" ? "bg-[#10B981]" : "bg-[#6B7280]/60",
        )}
      />
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const tone =
    role === "Admin"
      ? "bg-[#DBEAFE] text-[#2563EB]"
      : role === "Quality Lead"
        ? "bg-[#CCFBF1] text-[#0D9488]"
        : role === "Inspector"
          ? "bg-[#F3E8FF] text-[#9333EA]"
          : "bg-[#F3F4F6] text-[#6B7280]";
  return (
    <span
      className={cn(
        "inline-flex items-center h-[22px] px-2.5 rounded-md text-[11px] font-medium",
        tone,
      )}
    >
      {role}
    </span>
  );
}
