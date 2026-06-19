import { Link, useRouterState } from "@tanstack/react-router";
import { Users, PanelLeftClose, PanelLeft, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  to?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  soon?: boolean;
};

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { currentUser: session, logout } = useAuth();

  const role = session?.role || "Inspector";

  // Dynamically calculate NAV items based on user's role
  const NAV: Item[] = [];
  if (role === "Admin") {
    NAV.push({ label: "Users", to: "/users", icon: Users });
  } else if (role === "Quality Lead") {
    NAV.push({ label: "Dashboard", to: "/quality-lead", icon: LayoutDashboard });
  } else {
    // Inspector
    NAV.push({ label: "Dashboard", to: "/inspector", icon: LayoutDashboard });
  }

  return (
    <aside
      className={cn(
        "shrink-0 glass-sidebar-premium flex flex-col transition-[width] duration-200",
        collapsed ? "w-[64px]" : "w-[240px]",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "h-14 flex items-center border-b border-sidebar-border group/logo cursor-pointer",
          collapsed ? "justify-center px-2" : "px-4 gap-2",
        )}
      >
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform duration-300 group-hover/logo:scale-110">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 12 L6 4 L10 10 L14 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-sidebar-foreground leading-tight group-hover/logo:text-primary transition-colors">
              PMS
            </p>
            <p className="text-[11px] text-sidebar-muted leading-tight">
              {role === "Admin" ? "Admin Workspace" : `${role} Workspace`}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {!collapsed && (
          <p className="px-2 pt-2 pb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-sidebar-muted">
            Workspace
          </p>
        )}
        {NAV.map((item) => {
          const active = item.to ? pathname.startsWith(item.to) : false;
          const Icon = item.icon;
          const content = (
            <>
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110",
                  active ? "text-sidebar-accent-foreground" : "text-sidebar-muted",
                )}
                strokeWidth={1.75}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.soon && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-muted">
                      Soon
                    </span>
                  )}
                </>
              )}
            </>
          );
          const base = cn(
            "group flex items-center gap-2.5 rounded-md text-sm font-medium transition-all premium-sidebar-item",
            collapsed ? "h-9 w-9 justify-center mx-auto" : "h-9 px-2.5",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm shadow-primary/10 border-l-[3px] border-primary rounded-l-none pl-[7px]"
              : "text-sidebar-foreground hover:bg-sidebar-accent/60",
            item.soon && "opacity-60 cursor-not-allowed hover:bg-transparent",
          );
          if (item.soon || !item.to) {
            return (
              <div key={item.label} className={base} title={item.label}>
                {content}
              </div>
            );
          }
          return (
            <Link key={item.label} to={item.to} className={base} title={item.label}>
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        {!collapsed && session && (
          <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
            <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
              {initials(session.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">
                {session.name}
              </p>
              <p className="text-[11px] text-sidebar-muted truncate leading-tight">
                {session.email}
              </p>
            </div>
            <button
              onClick={async () => {
                await logout();
              }}
              className="h-7 w-7 inline-flex items-center justify-center rounded text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-2 rounded-md text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition",
            collapsed ? "h-9 w-9 justify-center mx-auto" : "h-9 px-2.5 w-full",
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
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
