import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { DEPARTMENTS, ROLES, type User, type Role, type Department } from "@/lib/mock-data";

export type UserFormValues = {
  name: string;
  email: string;
  role: Role;
  department: Department;
};

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .max(120, "Email is too long"),
  role: z.enum(["Admin", "Quality Lead", "Inspector"]),
  department: z.enum(DEPARTMENTS as unknown as [string, ...string[]]),
});

const empty: UserFormValues = {
  name: "",
  email: "",
  role: "Inspector",
  department: "Engineering",
};

export function UserFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: User | null;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
  submitting: boolean;
}) {
  const [values, setValues] = useState<UserFormValues>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormValues, string>>>({});

  useEffect(() => {
    if (open) {
      setValues(
        initial
          ? {
              name: initial.name,
              email: initial.email,
              role: initial.role,
              department: initial.department,
            }
          : empty,
      );
      setErrors({});
    }
  }, [open, initial]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = schema.safeParse(values);
    if (!res.success) {
      const fe: Partial<Record<keyof UserFormValues, string>> = {};
      for (const issue of res.error.issues) {
        const k = issue.path[0] as keyof UserFormValues;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    onSubmit(res.data as UserFormValues);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit user" : "Add new user"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update this team member's details and access."
              : "Invite a new team member to the workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 pt-1">
          <Field label="Full name" error={errors.name}>
            <input
              autoFocus
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Jane Cooper"
              className={`form-input ${errors.name ? "error" : ""}`}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              placeholder="jane@pms.com"
              className={`form-input ${errors.email ? "error" : ""}`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Role" error={errors.role}>
              <select
                value={values.role}
                onChange={(e) => setValues({ ...values, role: e.target.value as Role })}
                className="form-input cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Department" error={errors.department}>
              <select
                value={values.department}
                onChange={(e) => setValues({ ...values, department: e.target.value as Department })}
                className="form-input cursor-pointer"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-9 px-3.5 rounded-md border border-input bg-card text-sm font-medium text-foreground hover:bg-accent transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary-hover transition disabled:opacity-70"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {initial ? "Save changes" : "Create user"}
            </button>
          </DialogFooter>
        </form>

        {/* Local utility class */}
        <style>{`
          .form-input {
            width: 100%;
            height: 2.25rem;
            border-radius: 0.375rem;
            border: 1px solid rgba(229, 231, 235, 0.8);
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 0 0.75rem;
            font-size: 0.875rem;
            color: var(--color-foreground);
            outline: none;
            transition: all 0.30s ease;
          }
          .form-input:focus {
            background: rgba(255, 255, 255, 0.95);
            border-color: #2563EB;
            box-shadow: 
              0 0 0 3px rgba(37, 99, 235, 0.12),
              0 2px 4px rgba(0, 0, 0, 0.02);
          }
          .form-input.error {
            border-color: var(--color-destructive, #EF4444);
          }
          .form-input.error:focus {
            background: rgba(255, 255, 255, 0.95);
            border-color: var(--color-destructive, #EF4444);
            box-shadow: 
              0 0 0 3px rgba(239, 68, 68, 0.12),
              0 2px 4px rgba(0, 0, 0, 0.02);
          }
          .form-input::placeholder { color: var(--color-muted-foreground); }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
