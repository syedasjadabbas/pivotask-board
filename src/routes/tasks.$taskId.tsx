import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Link2,
  Paperclip,
  Send,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { ActivityTimeline } from "@/components/common/ActivityTimeline";
import { Chip, PriorityBadge, StatusBadge } from "@/components/common/Badges";
import { Section } from "@/components/common/Section";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { STATUSES } from "@/data/constants";
import type { TaskStatus } from "@/data/types";
import { fmtDate, relativeDay, relativeTime } from "@/lib/format";
import { assignableUsers, canApprove } from "@/lib/permissions";
import { isOverdue } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/tasks/$taskId")({
  head: () => ({
    meta: [
      { title: "Task detail · Zeploy" },
      { name: "description", content: "Task detail with subtasks, dependencies, comments and approvals." },
      { property: "og:title", content: "Task detail · Zeploy" },
      { property: "og:description", content: "Subtasks, dependencies, comments and approvals." },
    ],
  }),
  component: TaskDetail,
});

function TaskDetail() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const {
    tasks,
    users,
    projects,
    departments,
    currentUser,
    userById,
    updateTaskStatus,
    reassignTask,
    toggleSubtask,
    addComment,
  } = useApp();
  const [comment, setComment] = useState("");

  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium">Task not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => void navigate({ to: "/tasks" })}>
          Back to tasks
        </Button>
      </div>
    );
  }

  const assignee = userById(task.assigneeId);
  const creator = userById(task.creatorId);
  const project = projects.find((p) => p.id === task.projectId);
  const department = departments.find((d) => d.id === task.departmentId);
  const deps = task.dependsOn
    .map((id) => tasks.find((t) => t.id === id))
    .filter(Boolean);
  const isAssignee = task.assigneeId === currentUser.id;
  const approver = canApprove(currentUser, task, users);
  const assignables = assignableUsers(currentUser, users);
  const doneSubtasks = task.subtasks.filter((s) => s.done).length;

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/tasks" className="inline-flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="size-4" /> Tasks
        </Link>
        <span>/</span>
        <span className="num">{task.key}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {isOverdue(task) && (
                <Chip className="border-destructive/20 bg-destructive/10 text-destructive">
                  {relativeDay(task.dueDate)}
                </Chip>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">{task.title}</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">{task.description}</p>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="num text-muted-foreground">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="mt-2 h-2" />
            </div>

            {(isAssignee || approver) && (
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
                <Select
                  value={task.status}
                  onValueChange={(v) => updateTaskStatus(task.id, v as TaskStatus)}
                >
                  <SelectTrigger className="h-9 w-[210px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isAssignee && task.status !== "Submitted for Review" && (
                  <Button
                    variant="secondary"
                    onClick={() => updateTaskStatus(task.id, "Submitted for Review")}
                  >
                    Submit for review
                  </Button>
                )}
                {approver && task.status === "Submitted for Review" && (
                  <>
                    <Button
                      className="gap-1.5"
                      onClick={() => updateTaskStatus(task.id, "Approved")}
                    >
                      <CheckCircle2 className="size-4" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => updateTaskStatus(task.id, "Rejected")}
                    >
                      <XCircle className="size-4" /> Request changes
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {task.subtasks.length > 0 && (
            <Section
              title="Subtasks"
              description={`${doneSubtasks} of ${task.subtasks.length} complete`}
            >
              <ul className="space-y-2">
                {task.subtasks.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                  >
                    <Checkbox
                      checked={s.done}
                      onCheckedChange={() => toggleSubtask(task.id, s.id)}
                      disabled={!isAssignee && !approver}
                    />
                    <span
                      className={`text-sm ${s.done ? "text-muted-foreground line-through" : ""}`}
                    >
                      {s.title}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {deps.length > 0 && (
            <Section title="Dependencies" description="This task is blocked until these finish">
              <ul className="space-y-2">
                {deps.map((d) => (
                  <li key={d!.id}>
                    <Link
                      to="/tasks/$taskId"
                      params={{ taskId: d!.id }}
                      className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:border-primary/40"
                    >
                      <Link2 className="size-4 text-muted-foreground" />
                      <span className="num text-xs text-muted-foreground">{d!.key}</span>
                      <span className="flex-1 truncate text-sm">{d!.title}</span>
                      <StatusBadge status={d!.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Comments" description={`${task.comments.length} messages`}>
            <ul className="space-y-4">
              {task.comments.map((c) => {
                const author = userById(c.authorId);
                return (
                  <li key={c.id} className="flex gap-3">
                    {author && <UserAvatar user={author} />}
                    <div className="min-w-0 flex-1 rounded-lg bg-secondary/70 px-3 py-2">
                      <p className="text-sm">
                        <span className="font-medium">{author?.name}</span>{" "}
                        <span className="text-xs text-muted-foreground">
                          {relativeTime(c.at)}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                    </div>
                  </li>
                );
              })}
              {task.comments.length === 0 && (
                <li className="text-sm text-muted-foreground">No comments yet.</li>
              )}
            </ul>
            <form
              className="mt-4 flex items-start gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                addComment(task.id, comment.trim());
                setComment("");
              }}
            >
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment…"
                className="min-h-[72px]"
              />
              <Button type="submit" size="icon" className="mt-0.5" aria-label="Send comment">
                <Send className="size-4" />
              </Button>
            </form>
          </Section>

          <Section title="Activity" description="Full audit trail for this task">
            <ActivityTimeline entries={task.activity} showDate />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Details">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Assignee</dt>
                <dd className="mt-1.5 flex items-center gap-2">
                  {assignee && <UserAvatar user={assignee} />}
                  <Link
                    to="/users/$userId"
                    params={{ userId: task.assigneeId }}
                    className="font-medium hover:underline"
                  >
                    {assignee?.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Assigned by</dt>
                <dd className="mt-1">{creator?.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Project</dt>
                <dd className="mt-1">
                  {project && (
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: project.id }}
                      className="hover:underline"
                    >
                      {project.name}
                    </Link>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Department</dt>
                <dd className="mt-1">{department?.name}</dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Start</dt>
                  <dd className="num mt-1">{fmtDate(task.startDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Due</dt>
                  <dd
                    className={`num mt-1 ${isOverdue(task) ? "text-destructive" : ""}`}
                  >
                    {fmtDate(task.dueDate)}
                  </dd>
                </div>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Estimate</dt>
                <dd className="num mt-1">{task.estimatedHours}h</dd>
              </div>
            </dl>
          </Section>

          {assignables.length > 0 && (
            <Section title="Reassign" description="Move this task to someone else">
              <Select value={task.assigneeId} onValueChange={(v) => reassignTask(task.id, v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assignables.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} · {u.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Section>
          )}

          {task.attachments.length > 0 && (
            <Section title="Attachments">
              <ul className="space-y-2">
                {task.attachments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <Paperclip className="size-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{a.name}</span>
                    <span className="num text-xs text-muted-foreground">{a.size}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </>
  );
}
