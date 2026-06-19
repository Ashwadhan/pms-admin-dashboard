import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleBadge } from "@/components/users/StatusBadge";
import { motion, type Variants } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function UserDashboard() {
  const { currentUser: session } = useAuth();

  const name = session?.name || session?.email?.split("@")[0] || "User";
  const email = session?.email || "";
  const role = session?.role || "Inspector";

  // Generate initials
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  // Role-specific static mock content
  const dashboardData = useMemo(() => {
    if (role === "Quality Lead") {
      return {
        metrics: {
          assignedTasks: 4,
          pendingReviews: 5,
          completedReviews: 14,
        },
        tasks: [
          { id: "t1", title: "Review Q2 Quality Standards documents", due: "In 3 days" },
          { id: "t2", title: "Verify calibration logs for Department C", due: "Tomorrow" },
          { id: "t3", title: "Audit safety records on Assembly Line 1", due: "Next week" },
          { id: "t4", title: "Update standard operating procedures (SOP)", due: "In 2 weeks" },
        ],
        reviews: [
          { id: "r1", user: "Sofia Rivera", type: "Performance Review", status: "Pending" },
          { id: "r2", user: "Liam Becker", type: "KPI Assessment", status: "Pending" },
          { id: "r3", user: "Olivia Park", type: "Annual Review", status: "Pending" },
        ],
        activities: [
          { id: "a1", text: "Completed performance review for Amelia Chen", time: "2 hours ago" },
          { id: "a2", text: "Approved calibration standards report", time: "Yesterday" },
          { id: "a3", text: "Created new compliance audit checklists", time: "3 days ago" },
          { id: "a4", text: "Logged in to PMS Dashboard", time: "Just now" },
        ],
        actions: [
          { label: "Start Audit Check", actionName: "Audit" },
          { label: "Request Feedback", actionName: "Feedback" },
          { label: "Add Department Goal", actionName: "Goal" },
        ],
      };
    } else {
      // Inspector and others
      return {
        metrics: {
          assignedTasks: 2,
          pendingReviews: 2,
          completedReviews: 8,
        },
        tasks: [
          { id: "t1", title: "Inspect incoming shipments at Dock 4", due: "Today" },
          { id: "t2", title: "Verify compliance checklist for Line 2", due: "In 2 days" },
        ],
        reviews: [
          { id: "r1", user: "Self-Assessment", type: "Q2 Self Review", status: "Pending" },
          {
            id: "r2",
            user: "Safety Compliance",
            type: "Quarterly Safety Check-in",
            status: "Pending",
          },
        ],
        activities: [
          { id: "a1", text: "Submitted inspection checklist for Line 1", time: "4 hours ago" },
          { id: "a2", text: "Updated Q2 personal training goals", time: "3 days ago" },
          { id: "a3", text: "Logged in to PMS Dashboard", time: "Just now" },
        ],
        actions: [
          { label: "Start Safety Checklist", actionName: "Safety" },
          { label: "Complete Self-Assessment", actionName: "Self-Review" },
          { label: "View Goals Details", actionName: "Goals" },
        ],
      };
    }
  }, [role]);

  const handleActionClick = (name: string) => {
    toast.info(`${name} feature coming soon!`);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Dashboard"
          description={`Overview of reviews, goals, and tasks for ${role} role.`}
        />
      </motion.div>

      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="rounded-[16px] overflow-hidden glass-panel-premium p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/20 bg-white/40 shadow-sm relative"
      >
        <div className="space-y-1 z-10">
          <h2 className="text-xl font-bold text-foreground">Welcome back, {name}! 👋</h2>
          <p className="text-sm text-muted-foreground">
            You are logged in as a <strong>{role}</strong>. Here is your overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 z-10">
          <TrendingUp className="h-4 w-4" />
          Status: On Track
        </div>
      </motion.div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card + Metrics */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-[16px] glass-panel-premium border border-white/30 bg-white/50 p-6 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-premium-glow transition-all duration-300"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shadow-md ring-4 ring-primary/5">
              {initials}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground truncate max-w-[200px]">{name}</h3>
              <p className="text-xs text-muted-foreground truncate max-w-[200px] pb-1">{email}</p>
              <RoleBadge role={role} />
            </div>
          </motion.div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-4">
            <motion.div
              variants={itemVariants}
              className="rounded-[16px] glass-panel-premium border border-white/30 bg-white/50 p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Assigned Tasks
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.metrics.assignedTasks}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-[16px] glass-panel-premium border border-white/30 bg-white/50 p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Pending Reviews
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.metrics.pendingReviews}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-[16px] glass-panel-premium border border-white/30 bg-white/50 p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Completed Reviews
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.metrics.completedReviews}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Center/Right Column: Tasks, Activity, Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Tasks Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-[16px] glass-panel-premium border border-white/30 bg-white/50 p-6 shadow-sm"
          >
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-500" />
              Assigned Tasks
            </h3>
            <div className="space-y-3">
              {dashboardData.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/30 hover:bg-white/40 transition-colors duration-200"
                >
                  <p className="text-xs font-semibold text-foreground line-clamp-1">{task.title}</p>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {task.due}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pending Reviews Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-[16px] glass-panel-premium border border-white/30 bg-white/50 p-6 shadow-sm"
          >
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Pending Reviews
            </h3>
            <div className="space-y-3">
              {dashboardData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/30 hover:bg-white/40 transition-colors duration-200"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">{review.user}</p>
                    <p className="text-[10px] text-muted-foreground">{review.type}</p>
                  </div>
                  <button
                    onClick={() => handleActionClick("Assessment")}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-primary-hover transition cursor-pointer"
                  >
                    Start
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Grid for Activity and Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-[16px] glass-panel-premium border border-white/30 bg-white/50 p-6 shadow-sm flex flex-col"
            >
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                Recent Activity
              </h3>
              <div className="space-y-4 flex-1">
                {dashboardData.activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex flex-col gap-0.5 border-l-2 border-primary/20 pl-3 py-0.5"
                  >
                    <p className="text-xs text-foreground leading-snug">{act.text}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{act.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions Panel */}
            <motion.div
              variants={itemVariants}
              className="rounded-[16px] glass-panel-premium border border-white/30 bg-white/50 p-6 shadow-sm"
            >
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                Quick Actions
              </h3>
              <div className="flex flex-col gap-3">
                {dashboardData.actions.map((act) => (
                  <button
                    key={act.label}
                    onClick={() => handleActionClick(act.actionName)}
                    className="w-full h-10 px-4 rounded-xl border border-white/40 bg-white/30 hover:bg-white/60 active:scale-95 text-xs font-semibold text-foreground flex items-center justify-between transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <span>{act.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
