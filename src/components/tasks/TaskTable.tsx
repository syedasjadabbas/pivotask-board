import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CircleAlert } from "lucide-react";

import { PriorityBadge, StatusBadge } from "@/components/common/Badges";
import { UserAvatar } from "@/components/common/UserAvatar";
import { EmptyState } from "@/components/common/EmptyState";
import type { Task } from "@/data/types";
import { fmtShort, relativeDay } from "@/lib/format";
import { isOverdue } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function TaskTable({
  tasks,
  compact = false,
  emptyTitle = "No tasks match these filters",
}: {
  tasks: Task[];
  compact?: boolean;
  emptyTitle?: string;
}) {
  const { userById, projects } = useApp();

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CircleAlert}
        title={emptyTitle}
        description="Try clearing a filter or changing the date range."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Task</th>
            <th className="px-4 py-2.5 font-medium">Assignee</th>
            {!compact && <th className="px-4 py-2.5 font-medium">Project</th>}
            <th className="px-4 py-2.5 font-medium">Priority</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Due date</th>
            <th className="w-10 px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const assignee = userById(task.assigneeId);
            const project = projects.find((p) => p.id === task.projectId);
            const overdue = isOverdue(task);
            return (
              <tr
                key={task.id}
                className="group border-b border-border/70 transition-colors last:border-0 hover:bg-accent/40"
              >
                <td className="max-w-[320px] px-4 py-3">
                  <Link
                    to="/tasks/$taskId"
                    params={{ taskId: task.id }}
                    className="block truncate font-medium hover:text-primary"
                  >
                    {task.title}
                  </Link>
                  <span className="num text-xs text-muted-foreground">{task.key}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    {assignee && <UserAvatar user={assignee} size="xs" />}
                    <span className="truncate">{assignee?.name}</span>
                  </span>
                </td>
                {!compact && (
                  <td className="px-4 py-3 text-muted-foreground">{project?.name}</td>
                )}
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className={cn("num px-4 py-3", overdue && "text-destructive")}>
                  <span className="block">{fmtShort(task.dueDate)}</span>
                  <span className="text-xs text-muted-foreground">
                    {relativeDay(task.dueDate)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to="/tasks/$taskId"
                    params={{ taskId: task.id }}
                    className="inline-flex text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary"
                    aria-label={`Open ${task.title}`}
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
