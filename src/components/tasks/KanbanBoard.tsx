import { Link } from "@tanstack/react-router";
import { MessageSquare, Paperclip } from "lucide-react";

import { PriorityBadge } from "@/components/common/Badges";
import { UserAvatar } from "@/components/common/UserAvatar";
import { KANBAN_COLUMNS } from "@/data/constants";
import type { Task } from "@/data/types";
import { fmtShort } from "@/lib/format";
import { isOverdue } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const { userById, projects } = useApp();

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {KANBAN_COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => col.statuses.includes(t.status));
        return (
          <div key={col.id} className="flex w-[300px] shrink-0 flex-col gap-3">
            <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
              <span className="text-sm font-semibold">{col.label}</span>
              <span className="num rounded-full bg-card px-2 py-0.5 text-xs text-muted-foreground">
                {colTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {colTasks.slice(0, 20).map((task) => {
                const assignee = userById(task.assigneeId);
                return (
                  <Link
                    key={task.id}
                    to="/tasks/$taskId"
                    params={{ taskId: task.id }}
                    className="surface block p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-pop)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="num text-[11px] text-muted-foreground">{task.key}</span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-medium">{task.title}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {projects.find((p) => p.id === task.projectId)?.name}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      {assignee && <UserAvatar user={assignee} size="xs" />}
                      <span className={cn("num", isOverdue(task) && "text-destructive")}>
                        {fmtShort(task.dueDate)}
                      </span>
                      <span className="ml-auto flex items-center gap-2">
                        {task.comments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="size-3" />
                            {task.comments.length}
                          </span>
                        )}
                        {task.attachments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Paperclip className="size-3" />
                            {task.attachments.length}
                          </span>
                        )}
                      </span>
                    </div>
                  </Link>
                );
              })}
              {colTasks.length === 0 && (
                <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Nothing here
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
