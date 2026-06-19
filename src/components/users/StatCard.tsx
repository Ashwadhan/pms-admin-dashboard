import React from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  iconBgClass,
}: {
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  iconBgClass?: string;
}) {
  return (
    <div className="glass-card-premium rounded-[16px] p-5 flex items-center justify-between select-none">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{label}</p>
        <p className="text-3xl font-bold tracking-tight text-[#111827] tabular-nums">{value}</p>
      </div>
      {Icon && (
        <div
          className={cn(
            "h-11 w-11 rounded-full flex items-center justify-center shadow-sm",
            iconBgClass || "bg-[#2563EB]/10",
          )}
        >
          <Icon className={cn("h-5 w-5", iconClass || "text-[#2563EB]")} />
        </div>
      )}
    </div>
  );
}
