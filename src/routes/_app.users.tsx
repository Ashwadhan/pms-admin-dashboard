import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth-store";
import { UsersPage } from "@/pages/admin/UsersPage";

export const Route = createFileRoute("/_app/users")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (!s) {
      throw redirect({ to: "/login" });
    }
    if (s.role !== "Admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [{ title: "Users — PMS Admin Dashboard" }],
  }),
  component: () => {
    return <UsersPage />;
  },
});
