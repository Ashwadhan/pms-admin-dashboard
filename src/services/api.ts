import axios from "axios";
import { toast } from "sonner";
import { fetchAuthSession } from "aws-amplify/auth";
import type { User } from "@/lib/mock-data";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const axiosInstance = axios.create({
  baseURL: BASE_URL || "https://pxflyf1glk.execute-api.ap-southeast-2.amazonaws.com/dev",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT token and log request details
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Failed to fetch Cognito session token:", e);
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Response Interceptor: Success & Error logging with detailed error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "unknown";
    const method = error.config?.method?.toUpperCase() || "unknown";

    console.error(`[API Response Error] Method: ${method} | URL: ${url}`);

    if (error.response) {
      console.error(`Status: ${status} | Body:`, error.response.data);

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        if (typeof window !== "undefined") {
          localStorage.removeItem("pms.session");
          window.location.href = "/login";
        }
      } else if (status === 403) {
        toast.error("Permission denied (403): You are not authorized to perform this action.");
      } else if (status === 404) {
        toast.error("Resource not found (404). Please verify the endpoint.");
      } else if (status >= 500) {
        toast.error("Internal Server Error (500). Please contact support.");
      } else {
        toast.error(`Request failed with status ${status}.`);
      }
    } else if (error.request) {
      console.error("No response received. Request details:", error.request);

      const isOnline = typeof window !== "undefined" ? window.navigator.onLine : true;
      if (!isOnline) {
        console.error("Network Failure: Client is offline.");
        toast.error("Network failure: Please check your internet connection.");
      } else {
        console.error("CORS Error or Network Unreachable: Connection refused.");
        toast.error(
          "CORS or Network Error: Connection blocked by CORS policy or the API server is unreachable.",
        );
      }
    } else {
      console.error("Error setting up request:", error.message);
      toast.error(`API Error: ${error.message}`);
    }

    return Promise.reject(error);
  },
);

interface BackendUser {
  id?: string;
  userId?: string;
  pk?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  status?: string;
  lastActive?: string;
  createdAt?: string;
}

function mapBackendUser(u: BackendUser): User {
  let role: User["role"] = "Inspector";
  const r = (u.role || "").toLowerCase().replace(/[\s_-]/g, "");
  if (r === "admin" || r === "administrator") {
    role = "Admin";
  } else if (r === "qualitylead" || r === "lead" || r === "manager" || r === "quality") {
    role = "Quality Lead";
  } else if (r === "inspector" || r === "employee") {
    role = "Inspector";
  } else {
    const email = (u.email || "").toLowerCase();
    if (email.includes("admin")) role = "Admin";
    else if (email.includes("quality") || email.includes("lead") || email.includes("manager")) {
      role = "Quality Lead";
    }
  }

  return {
    id: u.id || u.userId || u.pk || "",
    name: u.fullName || u.name || "",
    email: u.email || "",
    role,
    department: (u.department || "Engineering") as User["department"],
    status: (u.status === "Inactive" || u.status === "inactive"
      ? "Inactive"
      : "Active") as User["status"],
    lastActive: u.lastActive || new Date().toISOString(),
    createdAt: u.createdAt || new Date().toISOString(),
  };
}

interface GetUsersResponse {
  body?: string;
  users?: BackendUser[];
}

function parseBackendUserResponse(responseData: unknown): BackendUser {
  const data = responseData as { body?: string; user?: BackendUser } | null | undefined;
  if (data?.body && typeof data.body === "string") {
    try {
      const parsed = JSON.parse(data.body);
      return parsed.user || parsed;
    } catch (e) {
      console.error("Failed to parse backend user response body:", e);
    }
  }
  return data?.user || (data as BackendUser) || {};
}

export const apiService = {
  async getUsers(): Promise<User[]> {
    const response = await axiosInstance.get<GetUsersResponse | BackendUser[]>("/users");

    const data = response.data;

    let rawUsers: BackendUser[] = [];

    if (data && !Array.isArray(data) && typeof data.body === "string") {
      try {
        const parsed = JSON.parse(data.body);
        rawUsers = Array.isArray(parsed.users) ? parsed.users : [];
      } catch (err) {
        console.error("Failed to parse response.data.body JSON string:", err);
      }
    } else if (data && !Array.isArray(data) && Array.isArray(data.users)) {
      rawUsers = data.users;
    } else if (Array.isArray(data)) {
      rawUsers = data;
    }

    return rawUsers.map(mapBackendUser);
  },

  async createUser(data: Omit<User, "id" | "status" | "lastActive" | "createdAt">): Promise<User> {
    const payload = {
      userId: undefined,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      status: "Active" as const,
    };
    const response = await axiosInstance.post<unknown>("/users", payload);
    const parsed = parseBackendUserResponse(response.data);
    return mapBackendUser(parsed);
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const payload = {
      userId: id,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      status: data.status,
    };
    const response = await axiosInstance.put<unknown>("/users", payload);
    const parsed = parseBackendUserResponse(response.data);
    return mapBackendUser(parsed);
  },

  async toggleUserStatus(id: string, newStatus: "Active" | "Inactive"): Promise<User> {
    const payload = {
      userId: id,
      status: newStatus,
    };
    const response = await axiosInstance.patch<unknown>("/users", payload);
    const parsed = parseBackendUserResponse(response.data);
    return mapBackendUser(parsed);
  },

  async deleteUser(id: string): Promise<User> {
    const response = await axiosInstance.delete<unknown>("/users", {
      data: {
        userId: id,
      },
    });
    const parsed = parseBackendUserResponse(response.data);
    return mapBackendUser(parsed);
  },
};
