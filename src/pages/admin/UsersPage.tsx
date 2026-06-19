import { useMemo, useState, useEffect } from "react";
import { Plus, Users, UserCheck, UserX, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, type Variants } from "framer-motion";

import { apiService } from "@/services/api";
import { type User, ROLES, DEPARTMENTS } from "@/lib/mock-data";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/users/StatCard";
import { UserToolbar, type Filters } from "@/components/users/UserToolbar";
import { UserTable } from "@/components/users/UserTable";
import { UserFormDialog, type UserFormValues } from "@/components/users/UserFormDialog";
import { ConfirmDialog } from "@/components/users/ConfirmDialog";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
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

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    role: "all",
    department: "all",
    status: "all",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [confirming, setConfirming] = useState(false);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiService.getUsers();

      setUsers(data);
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        errorResponse.response?.data?.message ||
        errorResponse.message ||
        "Failed to load users from API.";
      setError(msg);
      toast.error("Failed to load users from API.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return users.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
        return false;
      }

      if (filters.role !== "all" && u.role !== filters.role) {
        return false;
      }

      if (filters.department !== "all" && u.department !== filters.department) {
        return false;
      }

      if (filters.status !== "all" && u.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [users, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const stats = useMemo(() => {
    const total = users.length;

    const active = users.filter((u) => u.status === "Active").length;

    const inactive = total - active;

    const thirtyAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const newThisMonth = users.filter((u) => new Date(u.createdAt).getTime() > thirtyAgo).length;

    return {
      total,
      active,
      inactive,
      newThisMonth,
    };
  }, [users]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setFormOpen(true);
  }

  async function handleSubmit(values: UserFormValues) {
    setSubmitting(true);

    try {
      if (editing) {
        await apiService.updateUser(editing.id, {
          ...values,
          status: editing.status,
        });

        toast.success("User updated", {
          description: `${values.name}'s details were saved.`,
        });
      } else {
        await apiService.createUser(values);

        toast.success("User created", {
          description: `${values.name} was added to the workspace.`,
        });
      }

      setFormOpen(false);
      setEditing(null);

      await fetchUsers();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");

      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmToggle() {
    if (!confirmUser) return;

    setConfirming(true);

    const wasActive = confirmUser.status === "Active";
    const newStatus = wasActive ? "Inactive" : "Active";

    try {
      await apiService.toggleUserStatus(confirmUser.id, newStatus);

      toast.success(wasActive ? "User deactivated" : "User activated", {
        description: `${confirmUser.name} is now ${wasActive ? "inactive" : "active"}.`,
      });

      setConfirmUser(null);

      await fetchUsers();
    } catch (err) {
      toast.error("Couldn't update user status.");

      console.error(err);
    } finally {
      setConfirming(false);
    }
  }

  async function confirmDelete() {
    if (!deleteUser) return;

    setDeleting(true);

    try {
      await apiService.deleteUser(deleteUser.id);

      toast.success("User deleted", {
        description: `${deleteUser.name} was removed from the workspace.`,
      });

      setDeleteUser(null);

      await fetchUsers();
    } catch (err) {
      toast.error("Couldn't delete user.");

      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  function clearFilters() {
    setFilters({
      search: "",
      role: "all",
      department: "all",
      status: "all",
    });

    setPage(1);
  }

  const filtersActive =
    !!filters.search ||
    filters.role !== "all" ||
    filters.department !== "all" ||
    filters.status !== "all";

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Users"
          description="Manage team members, roles, and access to the workspace."
          action={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] bg-[#2563EB] text-sm font-medium text-white hover:bg-[#1D4ED8] active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add User
            </button>
          }
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="Total Users"
          value={stats.total}
          icon={Users}
          iconClass="text-[#2563EB]"
          iconBgClass="bg-[#2563EB]/10"
        />

        <StatCard
          label="Active"
          value={stats.active}
          icon={UserCheck}
          iconClass="text-[#10B981]"
          iconBgClass="bg-[#10B981]/10"
        />

        <StatCard
          label="Inactive"
          value={stats.inactive}
          icon={UserX}
          iconClass="text-[#6B7280]"
          iconBgClass="bg-[#F3F4F6]"
        />

        <StatCard
          label="New Users"
          value={stats.newThisMonth}
          icon={UserPlus}
          iconClass="text-[#4F46E5]"
          iconBgClass="bg-[#4F46E5]/10"
        />
      </motion.div>

      {error && (
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" strokeWidth={2} />
            <div>
              <p className="font-semibold text-sm">Failed to connect to backend</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchUsers}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 active:scale-95 text-xs font-semibold transition cursor-pointer"
          >
            Retry Connection
          </button>
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="rounded-[16px] overflow-hidden glass-table-premium transition-all duration-300 hover:shadow-premium-glow"
      >
        <UserToolbar
          filters={filters}
          onChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
          onClear={clearFilters}
          roles={ROLES}
          departments={[...DEPARTMENTS]}
          filtersActive={filtersActive}
        />

        <UserTable
          users={paged}
          totalCount={filtered.length}
          page={safePage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={openEdit}
          onToggleStatus={(u) => setConfirmUser(u)}
          onDelete={(u) => setDeleteUser(u)}
          onResetFilters={clearFilters}
          filtersActive={filtersActive}
          loading={loading}
        />
      </motion.div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);

          if (!o) {
            setEditing(null);
          }
        }}
        initial={editing}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!confirmUser}
        onOpenChange={(o) => !o && setConfirmUser(null)}
        title={confirmUser?.status === "Active" ? "Deactivate user?" : "Activate user?"}
        description={
          confirmUser?.status === "Active"
            ? `${confirmUser?.name} will lose access to the workspace until reactivated.`
            : `${confirmUser?.name} will regain access to the workspace.`
        }
        confirmLabel={confirmUser?.status === "Active" ? "Deactivate" : "Activate"}
        destructive={confirmUser?.status === "Active"}
        loading={confirming}
        onConfirm={confirmToggle}
      />

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(o) => !o && setDeleteUser(null)}
        title="Delete user?"
        description={`Are you sure you want to delete ${deleteUser?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive={true}
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
}
