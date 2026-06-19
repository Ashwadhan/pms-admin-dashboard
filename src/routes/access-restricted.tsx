import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/access-restricted")({
  head: () => ({
    meta: [{ title: "Access Restricted — PMS" }],
  }),
  component: AccessRestrictedPage,
});

function AccessRestrictedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden font-sans relative">
      {/* Premium Glassmorphism Glowing Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-red-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[110px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] px-6 z-10"
      >
        <div className="bg-slate-950/40 backdrop-blur-2xl border border-red-500/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 sm:p-10 text-center hover:border-red-500/30 transition-all duration-500">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
            <ShieldAlert className="h-8 w-8" strokeWidth={1.75} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Account Access Restricted
          </h1>

          <div className="mt-4 space-y-2 text-sm text-slate-400 leading-relaxed">
            <p className="font-medium text-slate-300">
              Your account has been deactivated by an administrator.
            </p>
            <p>Please contact your administrator for assistance.</p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/40">
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99, y: 0 }}
              onClick={() => navigate({ to: "/login" })}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 text-sm font-semibold text-slate-200 hover:text-white transition-all duration-200 cursor-pointer shadow-md"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back to Login
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
