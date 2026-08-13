import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { StatCard } from "@/components/common/StatCard";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Progress } from "@/components/ui/progress";
import { visibleTasks, visibleUsers } from "@/lib/permissions";
import {
  completionTrend,
  departmentStats,
  statusBreakdown,
  taskStats,
  workload,
} from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Zeploy" },
      { name: "description", content: "Completion trends, status breakdown and workload analytics." },
      { property: "og:title", content: "Reports · Zeploy" },
      { property: "og:description", content: "Completion trends, status breakdown and workload." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { currentUser, tasks, users, departments } = useApp();
  const scoped = visibleTasks(currentUser, tasks, users);
  const stats = taskStats(scoped);
  const trend = completionTrend(scoped);
  const maxTrend = Math.max(...trend.map((t) => Math.max(t.created, t.completed)), 1);
  const breakdown = statusBreakdown(scoped);
  const totalBreakdown = breakdown.reduce((s, b) => s + b.value, 0) || 1;
  const rows = workload(visibleUsers(currentUser, users), tasks).slice(0, 10);
  const deptRows = departmentStats(departments, scoped, users);

  return (
    <>
      <PageHeader title="Reports" description="Performance analytics across your visible scope" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tasks tracked" value={stats.total} tone="primary" />
        <StatCard label="Completion rate" value={`${stats.completion}%`} tone="success" />
        <StatCard label="Overdue" value={stats.overdue} tone="danger" />
        <StatCard label="Blocked" value={stats.blocked} tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section
          title="Weekly delivery"
          description="Created vs completed"
          className="xl:col-span-2"
        >
          <div className="flex h-52 items-end gap-4">
            {trend.map((w) => (
              <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end justify-center gap-1">
                  <div
                    className="w-1/3 rounded-t bg-primary/25"
                    style={{ height: `${(w.created / maxTrend) * 100}%` }}
                  />
                  <div
                    className="w-1/3 rounded-t bg-primary"
                    style={{ height: `${(w.completed / maxTrend) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{w.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Status mix" description="Distribution of all tracked work">
          <ul className="space-y-3">
            {breakdown.map((b) => (
              <li key={b.name}>
                <div className="flex justify-between text-sm">
                  <span>{b.name}</span>
                  <span className="num text-muted-foreground">{b.value}</span>
                </div>
                <Progress
                  value={Math.round((b.value / totalBreakdown) * 100)}
                  className="mt-1.5 h-1.5"
                />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Department performance">
        <ul className="divide-y divide-border">
          {deptRows.map((d) => (
            <li key={d.department.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.department.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {d.headName} · {d.teamSize} people
                </p>
              </div>
              <div className="hidden w-40 sm:block">
                <Progress value={d.completion} className="h-1.5" />
              </div>
              <div className="num flex w-48 justify-end gap-4 text-xs text-muted-foreground">
                <span>{d.total} tasks</span>
                <span>{d.completion}%</span>
                <span className={d.overdue ? "text-destructive" : ""}>{d.overdue} late</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Top workload" description="People carrying the most active work">
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.user.id} className="flex items-center gap-3 py-3">
              <UserAvatar user={row.user} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{row.user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{row.user.title}</p>
              </div>
              <div className="num flex w-52 justify-end gap-4 text-xs text-muted-foreground">
                <span>{row.active} active</span>
                <span>{row.completed} done</span>
                <span className={row.overdue ? "text-destructive" : ""}>{row.overdue} late</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
