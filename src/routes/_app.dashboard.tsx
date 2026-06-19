import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth-store";

export const Route = createFileRoute("/_app/dashboard")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (!s) {
      throw redirect({ to: "/login" });
    }
    if (s.role === "Admin") {
      throw redirect({ to: "/users" });
    }
    if (s.role === "Quality Lead") {
      throw redirect({ to: "/quality-lead" });
    }
    if (s.role === "Inspector") {
      throw redirect({ to: "/inspector" });
    }
    throw redirect({ to: "/unauthorized" });
  },
  head: () => ({
    meta: [{ title: "Dashboard — PMS" }],
  }),
  component: () => null,
});
