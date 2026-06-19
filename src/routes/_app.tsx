import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getSession } from "@/lib/auth-store";
import { AppShell } from "@/components/layout/AppShell";
import { apiService } from "@/services/api";
import { signOut as amplifySignOut } from "aws-amplify/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (!s) {
      throw redirect({ to: "/login" });
    }

    try {
      const users = await apiService.getUsers();
      const dbUser = users.find((u) => u.email.toLowerCase() === s.email.toLowerCase());
      if (dbUser && dbUser.status === "Inactive") {
        // Clear all storage locally
        localStorage.clear();
        sessionStorage.clear();

        try {
          await amplifySignOut();
        } catch (e) {
          console.warn("Cognito signout in route guard failed:", e);
        }

        throw redirect({ to: "/access-restricted" });
      }
    } catch (err) {
      if (err && typeof err === "object" && "to" in err) {
        throw err;
      }
      console.error("Error verifying status in route guard:", err);
    }
  },
  component: () => {
    return (
      <AppShell>
        <Outlet />
      </AppShell>
    );
  },
});
