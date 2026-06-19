import { Search, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { currentUser: session, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!session) return null;

  const email = session.email || "";
  const name = session.name || email.split("@")[0] || "User";
  const role = session.role || "Employee";

  // Generate initials
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <header
      className={cn(
        "h-14 shrink-0 glass-topbar-premium flex items-center px-6 gap-4 sticky top-0 z-40 transition-all duration-300",
        scrolled ? "shadow-sm shadow-primary/5 bg-white/85" : "",
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground select-none">
        <span className="text-foreground/90 font-medium transition-colors hover:text-primary cursor-pointer">
          Workspace
        </span>
        <span className="text-border-strong">/</span>
        <span className="text-foreground font-semibold">Users</span>
      </div>

      <div className="flex-1 max-w-md mx-auto hidden md:flex">
        <div className="relative w-full group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary"
            strokeWidth={1.75}
          />
          <input
            placeholder="Search…"
            className="w-full h-9 rounded-md border border-input bg-surface pl-9 pr-14 text-sm placeholder:text-muted-foreground outline-none focus:bg-card focus:border-ring focus:ring-2 focus:ring-ring/15 transition-all duration-300 focus:shadow-premium-glow"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 h-5 px-1.5 rounded border border-border bg-card text-[10px] font-medium text-muted-foreground pointer-events-none group-focus-within:opacity-0 transition-opacity duration-200">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:translate-y-[-1px] hover:shadow-sm transition-all duration-300 cursor-pointer select-none outline-none group text-left">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shadow-sm transition-transform duration-300 group-hover:scale-105">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col min-w-0 pr-1">
                <span className="text-xs font-semibold text-foreground leading-none group-hover:text-primary transition-colors duration-200 truncate">
                  {name}
                </span>
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5 leading-none">
                  {role}
                </span>
              </div>
              <ChevronDown
                className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 group-hover:translate-y-0.5 group-data-[state=open]:rotate-180"
                strokeWidth={2}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2.5">
            <div className="flex flex-col gap-1 p-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shadow-sm">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm text-foreground truncate">{name}</span>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {role}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground truncate px-1">{email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await logout();
              }}
              className="text-destructive focus:text-destructive focus:bg-destructive-soft cursor-pointer flex items-center gap-2 w-full"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
