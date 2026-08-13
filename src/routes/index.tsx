import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  ListChecks,
  TrendingUp,
} from "lucide-react";

import { ActivityTimeline } from "@/components/common/ActivityTimeline";
import { Chip, PriorityBadge, StatusBadge } from "@/components/common/Badges";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { StatCard } from "@/components/common/StatCard";
import { UserAvatar } from "@/components/common/UserAvatar";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Progress } from "@/components/ui/progress";
import { relativeDay } from "@/lib/format";
import { visibleTasks, visibleUsers } from "@/lib/permissions";
import {
  completionTrend,
  departmentStats,
  isOpen,
  isOverdue,
  taskStats,
  upcomingDeadlines,
  workload,
} from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Zeploy" },
      {
        name: "description",
        content:
          "Role-aware dashboard with live task metrics, department workload, deadlines and activity.",
      },
      { property: "og:title", content: "Dashboard · Zeploy" },
      {
        property: "og:description",
        content: "Role-aware dashboard with live task metrics, workload and deadlines.",
      },
    ],
  }),
  component: Dashboard,
});

function TrendChart({ tasks }: { tasks: ReturnType<typeof visibleTasks> }) {
  const trend = completionTrend(tasks);
  const max = Math.max(...trend.map((t) => Math.max(t.created, t.completed)), 1);
  return (
    <div className="flex h-44 items-end gap-4">
      {trend.map((week) => (
        <div key={week.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end justify-center gap-1">
            <div
              className="w-1/3 rounded-t bg-primary/25"
              style={{ height: `${(week.created / max) * 100}%` }}
              title={`${week.created} created`}
            />
            <div
              className="w-1/3 rounded-t bg-primary"
              style={{ height: `${(week.completed / max) * 100}%` }}
              title={`${week.completed} completed`}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">{week.label}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const { currentUser, tasks, users, departments, projects, activity } = useApp();
  const scoped = visibleTasks(currentUser, tasks, users);
  const stats = taskStats(scoped);
  const people = visibleUsers(currentUser, users).filter((u) => u.id !== currentUser.id);
  const rows = workload(people, tasks).slice(0, 6);
  const deptStats = departmentStats(departments, tasks, users);
  const deadlines = upcomingDeadlines(scoped, 7).slice(0, 6);
  const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id && isOpen(t));
  const isExec = currentUser.role === "CEO" || currentUser.role === "COO";

  const greeting = `${currentUser.name.split(" ")[0]}, here's ${
    isExec ? "the organization" : currentUser.role === "Employee" ? "your work" : "your team"
  } today`;

  return (
    <>
      <PageHeader
        title={greeting}
        description={`${stats.total} tasks in scope · ${stats.completion}% completion rate · ${stats.overdue} overdue`}
        actions={
          <>
            <Chip>{currentUser.role}</Chip>
            <Chip className="border-primary/20 bg-primary/10 text-primary">
              {departments.find((d) => d.id === currentUser.departmentId)?.name ?? "Executive"}
            </Chip>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={isExec ? "Total tasks" : "Tasks in scope"}
          value={stats.total}
          hint={`${stats.inProgress} in progress`}
          icon={ListChecks}
          tone="primary"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          hint={`${stats.completion}% completion rate`}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          hint={`${stats.blocked} blocked right now`}
          icon={AlertTriangle}
          tone="danger"
        />
        <StatCard
          label="Awaiting review"
          value={stats.review}
          hint={`${stats.critical} critical open`}
          icon={Clock}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section
          title="Delivery trend"
          description="Created vs completed over the last six weeks"
          className="xl:col-span-2"
          action={
            <span className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-primary/25" /> Created
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-primary" /> Completed
              </span>
            </span>
          }
        >
          <TrendChart tasks={scoped} />
        </Section>

        <Section title="My open work" description={`${myTasks.length} tasks assigned to you`}>
          <ul className="space-y-3">
            {myTasks.slice(0, 5).map((task) => (
              <li key={task.id}>
                <Link
                  to="/tasks/$taskId"
                  params={{ taskId: task.id }}
                  className="block rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="num text-[11px] text-muted-foreground">{task.key}</span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm font-medium">{task.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={task.progress} className="h-1.5" />
                    <span
                      className={`num shrink-0 text-[11px] ${
                        isOverdue(task) ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {relativeDay(task.dueDate)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
            {myTasks.length === 0 && (
              <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                You're all caught up.
              </li>
            )}
          </ul>
          <Link
            to="/my-tasks"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View my tasks <ArrowRight className="size-3.5" />
          </Link>
        </Section>
      </div>

      {isExec && (
        <Section title="Department performance" description="Live workload across the org">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deptStats.map((d) => (
              <Link
                key={d.department.id}
                to="/departments/$deptId"
                params={{ deptId: d.department.id }}
                className="rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-accent/30"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{d.department.name}</p>
                  <span className="num text-sm text-muted-foreground">{d.completion}%</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {d.headName} · {d.teamSize} people
                </p>
                <Progress value={d.completion} className="mt-3 h-1.5" />
                <div className="num mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span>{d.activeTasks} active</span>
                  <span className={d.overdue ? "text-destructive" : ""}>{d.overdue} overdue</span>
                  <span>{d.critical} critical</span>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <Section
          title="Upcoming deadlines"
          description="Next 7 days"
          className="xl:col-span-2"
          bodyClassName="p-0"
        >
          <TaskTable tasks={deadlines} compact emptyTitle="No deadlines in the next week" />
        </Section>
        <Section title="Recent activity" description="Across everything you can see">
          <ActivityTimeline entries={activity.slice(0, 7)} />
        </Section>
      </div>

      {people.length > 0 && (
        <Section
          title="Team workload"
          description="Who is carrying what right now"
          action={
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Full report <TrendingUp className="size-3.5" />
            </Link>
          }
        >
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row.user.id} className="flex items-center gap-3 py-3">
                <UserAvatar user={row.user} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{row.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{row.user.title}</p>
                </div>
                <div className="hidden w-40 sm:block">
                  <Progress value={row.completion} className="h-1.5" />
                </div>
                <div className="num flex w-40 justify-end gap-4 text-xs text-muted-foreground">
                  <span>{row.active} active</span>
                  <span className={row.overdue ? "text-destructive" : ""}>
                    {row.overdue} late
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {isExec && (
        <Section title="Projects at risk" description="Owner attention needed">
          <div className="grid gap-3 md:grid-cols-2">
            {projects
              .filter((p) => p.status === "At Risk" || p.status === "Delayed")
              .map((p) => (
                <Link
                  key={p.id}
                  to="/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
                    <Flame className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {p.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <StatusBadge status="Blocked" className="hidden" />
                      <Chip className="border-destructive/20 bg-destructive/10 text-destructive">
                        {p.status}
                      </Chip>
                      <span className="num text-xs text-muted-foreground">
                        due {relativeDay(p.deadline)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </Section>
      )}
    </>
  );
}
