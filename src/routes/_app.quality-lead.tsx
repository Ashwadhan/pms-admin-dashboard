import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth-store";
import { UserDashboard } from "@/pages/UserDashboard";

export const Route = createFileRoute("/_app/quality-lead")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (!s) {
      throw redirect({ to: "/login" });
    }
    if (s.role !== "Quality Lead") {
      if (s.role === "Admin") {
        throw redirect({ to: "/users" });
      } else if (s.role === "Inspector") {
        throw redirect({ to: "/inspector" });
      } else {
        throw redirect({ to: "/unauthorized" });
      }
    }
  },
  head: () => ({
    meta: [{ title: "Quality Lead Dashboard — PMS" }],
  }),
  component: () => {
    return <UserDashboard />;
  },
});
