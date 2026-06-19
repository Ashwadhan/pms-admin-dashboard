import { createFileRoute, useNavigate, useRouter, redirect } from "@tanstack/react-router";
import { ArrowLeft, ShieldOff } from "lucide-react";
import { signOut, getSession } from "@/lib/auth-store";

export const Route = createFileRoute("/unauthorized")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (s && s.role !== "Admin") {
      let target = "/unauthorized";
      if (s.role === "Quality Lead") target = "/quality-lead";
      else if (s.role === "Inspector") target = "/inspector";
      throw redirect({ to: target });
    }
  },
  head: () => ({
    meta: [{ title: "Access denied — PMS Admin Dashboard" }],
  }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  const router = useRouter();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-info-soft text-info-foreground">
          <ShieldOff className="h-7 w-7" strokeWidth={1.75} />
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Error 403
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          You don't have access to this page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your account doesn't have permission to view the admin console. Contact your workspace
          administrator if you believe this is a mistake.
        </p>

        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => router.history.back()}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border border-input bg-card text-sm font-medium text-foreground hover:bg-accent transition"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back
          </button>
          <button
            onClick={() => {
              signOut();
              navigate({ to: "/login" });
            }}
            className="inline-flex items-center h-10 px-4 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary-hover transition"
          >
            Sign in as different user
          </button>
        </div>
      </div>
    </div>
  );
}
