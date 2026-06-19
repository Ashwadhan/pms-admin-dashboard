import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role, Status } from "@/lib/mock-data";

export type Filters = {
  search: string;
  role: Role | "all";
  department: string;
  status: Status | "all";
};

export function UserToolbar({
  filters,
  onChange,
  onClear,
  roles,
  departments,
  filtersActive,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
  roles: Role[];
  departments: string[];
  filtersActive: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-white/20 bg-white/40 backdrop-blur-[12px]">
      <div className="relative flex-1 min-w-[220px] group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary"
          strokeWidth={1.75}
        />
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by name or email"
          className="w-full h-9 rounded-md glass-input-premium pl-9 pr-3 text-sm placeholder:text-muted-foreground outline-none transition-all duration-300"
        />
      </div>

      <SelectFilter
        value={filters.role}
        onChange={(v) => onChange({ ...filters, role: v as Role | "all" })}
        options={[
          { value: "all", label: "All roles" },
          ...roles.map((r) => ({ value: r, label: r })),
        ]}
      />
      <SelectFilter
        value={filters.department}
        onChange={(v) => onChange({ ...filters, department: v })}
        options={[
          { value: "all", label: "All departments" },
          ...departments.map((d) => ({ value: d, label: d })),
        ]}
      />
      <SelectFilter
        value={filters.status}
        onChange={(v) => onChange({ ...filters, status: v as Status | "all" })}
        options={[
          { value: "all", label: "All status" },
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
        ]}
      />

      {filtersActive && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 h-9 px-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 active:scale-95"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          Clear
        </button>
      )}
    </div>
  );
}

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-9 appearance-none rounded-md glass-input-premium pl-3 pr-8 text-sm text-foreground outline-none hover:border-border-strong transition-all duration-300 cursor-pointer",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300"
        strokeWidth={1.75}
      />
    </div>
  );
}
