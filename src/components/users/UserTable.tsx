import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Power, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { User } from "@/lib/mock-data";
import { StatusBadge, RoleBadge } from "./StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

export function UserTable({
  users,
  totalCount,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onEdit,
  onToggleStatus,
  onDelete,
  onResetFilters,
  filtersActive,
  loading = false,
}: {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onEdit: (u: User) => void;
  onToggleStatus: (u: User) => void;
  onDelete: (u: User) => void;
  onResetFilters: () => void;
  filtersActive: boolean;
  loading?: boolean;
}) {
  if (!loading && users.length === 0) {
    return (
      <div className="p-12">
        <EmptyState
          title={filtersActive ? "No users match your filters" : "No users yet"}
          description={
            filtersActive
              ? "Try adjusting your search or filter criteria."
              : "Add your first team member to get started."
          }
          action={
            filtersActive ? (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center h-9 px-3.5 rounded-md border border-input bg-card text-sm font-medium hover:bg-accent transition cursor-pointer"
              >
                Reset filters
              </button>
            ) : null
          }
        />
      </div>
    );
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/60">
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Department</Th>
              <Th>Status</Th>
              <Th>Created At</Th>
              <Th>Last Active</Th>
              <Th className="w-24 text-right pr-6">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                        <div className="space-y-1.5 min-w-0">
                          <Skeleton className="h-3.5 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                    </td>
                  </tr>
                ))
              : users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border last:border-0 premium-table-row animate-fade-in"
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold">
                          {initials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground leading-tight">
                            {u.name}
                          </p>
                          <p className="text-xs text-muted-foreground leading-tight">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-2.5 text-sm text-foreground">{u.department}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground tabular-nums">
                      {relativeTime(u.lastActive)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent active:scale-90 transition-all duration-200 shadow-sm cursor-pointer"
                            aria-label="Open actions"
                          >
                            <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => onEdit(u)} className="cursor-pointer">
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onToggleStatus(u)}
                            className={
                              "cursor-pointer " +
                              (u.status === "Active"
                                ? "text-destructive focus:text-destructive focus:bg-destructive-soft"
                                : "")
                            }
                          >
                            <Power className="h-4 w-4" strokeWidth={1.75} />
                            {u.status === "Active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(u)}
                            className="text-destructive focus:text-destructive focus:bg-destructive-soft cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground tabular-nums">
            Showing <span className="font-medium text-foreground">{start}</span>–
            <span className="font-medium text-foreground">{end}</span> of{" "}
            <span className="font-medium text-foreground">{totalCount}</span> users
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all duration-200 shadow-sm cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <span className="px-2 text-xs text-muted-foreground tabular-nums">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all duration-200 shadow-sm cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={
        "px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground " +
        (className ?? "")
      }
    >
      {children}
    </th>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day > 1 ? "s" : ""} ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} mo ago`;
  return `${Math.floor(month / 12)} yr ago`;
}
