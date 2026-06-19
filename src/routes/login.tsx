import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { Eye, EyeOff, AlertCircle, Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const s = getSession();
    if (s) {
      let target = "/unauthorized";
      if (s.role === "Admin") target = "/users";
      else if (s.role === "Quality Lead") target = "/quality-lead";
      else if (s.role === "Inspector") target = "/inspector";
      throw redirect({ to: target });
    }
  },
  head: () => ({
    meta: [{ title: "Sign in — PMS Admin Dashboard" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const u = await login(email, password);
      if (u.role === "Admin") {
        navigate({ to: "/users" });
      } else if (u.role === "Quality Lead") {
        navigate({ to: "/quality-lead" });
      } else if (u.role === "Inspector") {
        navigate({ to: "/inspector" });
      } else {
        navigate({ to: "/unauthorized" });
      }
    } catch (err: unknown) {
      const errorResponse = err as { message?: string };
      setError(errorResponse.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] bg-slate-900 overflow-hidden font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border-r border-slate-800/40 relative overflow-hidden select-none animate-gradient-flow">
        {/* Ambient blurs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        {/* Floating Glassmorphism Shapes */}

        {/* Shape 2: Mini Goals Board / Metrics Mock */}
        <motion.div
          className="absolute right-12 bottom-[35%] w-60 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-[0_15px_30px_rgba(0,0,0,0.3)] pointer-events-none flex flex-col gap-2.5"
          animate={{
            y: [0, 16, 0],
            x: [0, -8, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wider text-blue-300 uppercase">
              Q2 Goals
            </span>
            <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              84% Met
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
              <div className="h-full w-[84%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Team Performance</span>
              <span>On Track</span>
            </div>
          </div>
        </motion.div>

        {/* Shape 3: Pill shape */}
        <motion.div
          className="absolute bottom-24 left-16 w-28 h-10 rounded-full bg-gradient-to-r from-white/5 to-white/0 border border-white/10 backdrop-blur-md pointer-events-none"
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Header Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 z-10"
        >
          <Logo />
          <span className="text-sm font-semibold tracking-wider text-slate-200 uppercase">
            PMS Branding
          </span>
        </motion.div>

        {/* Hero Section */}
        <div className="max-w-md z-10 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-blue-200 border border-white/5">
              Enterprise Dashboard
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-5 text-4xl font-extrabold tracking-tight text-white leading-[1.15] sm:text-5xl"
          >
            Performance <br />
            Management <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              System
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 space-y-3.5 border-l-2 border-blue-500/30 pl-4"
          >
            <p className="text-base font-semibold text-slate-200">
              Track goals. Manage teams. Drive performance.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Manage employees, reviews, KPIs, and performance workflows from one centralized
              workspace.
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 z-10">
          © {isClient ? new Date().getFullYear() : 2026} Performance Management System. All rights
          reserved.
        </p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10 relative overflow-hidden bg-slate-50">
        {/* Soft ambient background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100/50 to-indigo-100/50 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-100/30 to-blue-100/30 blur-[110px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] z-10"
        >
          {/* Card Wrapper */}
          <div className="glass-card-login bg-white/75 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.7)] p-8 sm:p-10 hover:border-blue-500/20 hover:shadow-[0_25px_60px_-15px_rgba(37,99,235,0.06)] transition-all duration-500">
            {/* Small header logo for mobile */}
            <div className="lg:hidden mb-8 flex items-center gap-2">
              <Logo />
              <span className="text-sm font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                PMS
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access the admin console.
            </p>

            {/* Form */}
            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-red-200/50 bg-red-50/50 px-4 py-3 text-sm text-red-600 backdrop-blur-sm"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="leading-5">{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300"
                    strokeWidth={1.75}
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    disabled={loading}
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/40 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:shadow-[0_2px_8px_rgba(37,99,235,0.05)] disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300"
                    strokeWidth={1.75}
                  />
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full h-11 rounded-lg border border-slate-200 bg-white/40 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:shadow-[0_2px_8px_rgba(37,99,235,0.05)] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition duration-200"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={show ? "hide" : "show"}
                        initial={{ opacity: 0, scale: 0.8, rotate: show ? 45 : -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: show ? -45 : 45 }}
                        transition={{ duration: 0.15 }}
                      >
                        {show ? (
                          <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                        ) : (
                          <Eye className="h-4 w-4" strokeWidth={1.75} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99, y: 0 }}
                type="submit"
                disabled={loading}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all duration-200 shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Signing in…" : "Sign in"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <span className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 12 L6 4 L10 10 L14 2"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
