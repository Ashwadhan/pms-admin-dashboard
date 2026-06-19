import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth-store";
import { UserDashboard } from "@/pages/UserDashboard";

export const Route = createFileRoute("/_app/inspector")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (!s) {
      throw redirect({ to: "/login" });
    }
    if (s.role !== "Inspector") {
      if (s.role === "Admin") {
        throw redirect({ to: "/users" });
      } else if (s.role === "Quality Lead") {
        throw redirect({ to: "/quality-lead" });
      } else {
        throw redirect({ to: "/unauthorized" });
      }
    }
  },
  head: () => ({
    meta: [{ title: "Inspector Dashboard — PMS" }],
  }),
  component: () => {
    return <UserDashboard />;
  },
});
