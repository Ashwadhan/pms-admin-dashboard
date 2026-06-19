import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-border text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" strokeWidth={1.75} />}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
