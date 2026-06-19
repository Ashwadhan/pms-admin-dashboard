import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";
import { toast } from "sonner";
import type { Role } from "@/lib/mock-data";
import { signOut as mockSignOut, setSession } from "@/lib/auth-store";
import { apiService } from "@/services/api";

import { configureAmplify } from "@/aws-config";

// Initialize AWS Amplify Cognito using credentials in aws-config
configureAmplify();
const IS_AMPLIFY_CONFIGURED = true;

export type AuthUser = {
  email: string;
  name: string;
  role: Role;
  idToken?: string;
};

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeCognitoRole(roleVal: string | undefined): Role {
  if (!roleVal) return "Inspector";
  const norm = roleVal
    .toLowerCase()
    .trim()
    .replace(/[\s_-]/g, "");
  if (norm === "admin" || norm === "administrator") return "Admin";
  if (norm === "qualitylead" || norm === "lead" || norm === "manager" || norm === "quality") {
    return "Quality Lead";
  }
  if (norm === "inspector" || norm === "employee") return "Inspector";
  return "Inspector";
}

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setAndLogUser = (user: AuthUser | null) => {
    setCurrentUser(user);
  };

  const handleDeactivatedUser = useCallback(async () => {
    try {
      if (IS_AMPLIFY_CONFIGURED) {
        await amplifySignOut();
      }
    } catch (e) {
      console.warn("Amplify signout during deactivation check failed:", e);
    }
    // Clean up mock auth store & active session
    mockSignOut();
    setSession(null);
    setAndLogUser(null);

    // Clear all storage to wipe Cognito and any other auth cached states
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/access-restricted");
    }
  }, []);

  // Synchronize state from active Cognito session on mount
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        if (IS_AMPLIFY_CONFIGURED) {
          const user = await getCurrentUser();
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken;
          if (!idToken) {
            throw new Error("No idToken found in Cognito session.");
          }
          const email = (idToken?.payload?.email as string) || user.signInDetails?.loginId || "";
          const name = (idToken?.payload?.name as string) || email.split("@")[0] || "User";

          // Map Cognito custom claim custom:role to Role (possible values: Admin, Quality Lead, Inspector)
          const cognitoRole = idToken?.payload?.["custom:role"] as string;
          let role = normalizeCognitoRole(cognitoRole);

          // Fallback check if it normalized to default Inspector but email suggests otherwise
          if (role === "Inspector") {
            if (email.toLowerCase().includes("admin")) {
              role = "Admin";
            } else if (
              email.toLowerCase().includes("quality") ||
              email.toLowerCase().includes("lead") ||
              email.toLowerCase().includes("manager")
            ) {
              role = "Quality Lead";
            }
          }

          // Validate status from Users API
          try {
            const users = await apiService.getUsers();
            const dbUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
            if (dbUser && dbUser.status === "Inactive") {
              await handleDeactivatedUser();
              return;
            }
          } catch (apiErr) {
            console.error("API error checking user status on session restore:", apiErr);
          }

          const activeUser: AuthUser = {
            email,
            name,
            role,
            idToken: idToken?.toString(),
          };

          // Keep local auth-store hydrated for routing guards
          setSession({ email, name, role });
          setAndLogUser(activeUser);
        }
      } catch (err: unknown) {
        const error = err as { name?: string };
        if (error && error.name !== "UserUnAuthenticatedException") {
          console.error("Error verifying active auth session:", err);
        }
        setSession(null);
        setAndLogUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkCurrentSession();
  }, [handleDeactivatedUser]);

  // Background check to verify user status remains Active
  useEffect(() => {
    if (!currentUser) return;

    const intervalId = setInterval(async () => {
      try {
        const users = await apiService.getUsers();
        const dbUser = users.find((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());

        if (dbUser && dbUser.status === "Inactive") {
          toast.error("Your account has been deactivated by an administrator. Logging out...");
          await handleDeactivatedUser();
        }
      } catch (err) {
        console.error("Background user status validation failed:", err);
      }
    }, 15000); // 15 seconds

    return () => clearInterval(intervalId);
  }, [currentUser, handleDeactivatedUser]);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    try {
      if (IS_AMPLIFY_CONFIGURED) {
        try {
          await amplifySignOut();
        } catch {
          // ignore
        }

        // Authenticate with real AWS Amplify Cognito User Pool
        const result = await amplifySignIn({ username: email, password });

        if (result.isSignedIn) {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken;
          if (!idToken) {
            throw new Error("No idToken found in Cognito session.");
          }
          const emailVal = (idToken?.payload?.email as string) || email;
          const nameVal = (idToken?.payload?.name as string) || email.split("@")[0] || "User";

          const cognitoRoleVal = idToken?.payload?.["custom:role"] as string;
          let roleVal = normalizeCognitoRole(cognitoRoleVal);

          // Fallback check if it normalized to default Inspector but email suggests otherwise
          if (roleVal === "Inspector") {
            if (email.toLowerCase().includes("admin")) {
              roleVal = "Admin";
            } else if (
              email.toLowerCase().includes("quality") ||
              email.toLowerCase().includes("lead") ||
              email.toLowerCase().includes("manager")
            ) {
              roleVal = "Quality Lead";
            }
          }

          // Validate user status in DB
          const users = await apiService.getUsers();
          const dbUser = users.find((u) => u.email.toLowerCase() === emailVal.toLowerCase());
          if (dbUser && dbUser.status === "Inactive") {
            await handleDeactivatedUser();
            throw new Error("Your account has been deactivated by an administrator.");
          }

          const activeUser: AuthUser = {
            email: emailVal,
            name: nameVal,
            role: roleVal,
            idToken: idToken?.toString(),
          };

          // Synchronize local session for synchronous routes checks
          setSession({ email: emailVal, name: nameVal, role: roleVal });

          setAndLogUser(activeUser);
          return activeUser;
        } else {
          throw new Error("MFA or additional authentication steps are required.");
        }
      } else {
        throw new Error("Cognito is not configured.");
      }
    } catch (err: unknown) {
      const errorResponse = err as { message?: string };
      const errorMsg = errorResponse.message || "Authentication failed.";
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      if (IS_AMPLIFY_CONFIGURED) {
        try {
          await amplifySignOut();
        } catch (e) {
          console.error("Amplify signout error:", e);
        }
      }

      // Clean up mock auth store & active session
      mockSignOut();
      setSession(null);
      setAndLogUser(null);

      // Clear all storage to wipe Cognito and any other auth cached states
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      toast.success("Successfully logged out.");

      // Immediately replace location with login page to refresh browser state and prevent back navigation
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    } catch (err: unknown) {
      const errorResponse = err as { message?: string };
      console.error("Signout error:", err);
      toast.error(errorResponse.message || "Sign out failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
