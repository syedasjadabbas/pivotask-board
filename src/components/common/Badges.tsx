import { priorityTone, statusTone } from "@/data/constants";
import type { Priority, TaskStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return <span className={cn(base, statusTone[status], className)}>{status}</span>;
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  return (
    <span className={cn(base, priorityTone[priority], className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {priority}
    </span>
  );
}

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        base,
        "border-border bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
