import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";

import { Chip } from "@/components/common/Badges";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { StatCard } from "@/components/common/StatCard";
import { UserAvatar } from "@/components/common/UserAvatar";
import { TaskTable } from "@/components/tasks/TaskTable";
import { fmtDate } from "@/lib/format";
import { taskStats } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/users/$userId")({
  head: () => ({
    meta: [
      { title: "Profile · Zeploy" },
      { name: "description", content: "Individual profile with assigned work, performance and reporting line." },
      { property: "og:title", content: "Profile · Zeploy" },
      { property: "og:description", content: "Assigned work, performance and reporting line." },
    ],
  }),
  component: UserDetail,
});

function UserDetail() {
  const { userId } = Route.useParams();
  const { users, tasks, departments, teams, userById } = useApp();
  const user = users.find((u) => u.id === userId);
  if (!user) return <p className="py-20 text-center">Person not found.</p>;

  const own = tasks.filter((t) => t.assigneeId === user.id);
  const stats = taskStats(own);
  const manager = userById(user.managerId);
  const reports = users.filter((u) => u.managerId === user.id);
  const dept = departments.find((d) => d.id === user.departmentId);
  const team = teams.find((t) => t.id === user.teamId);

  return (
    <>
      <Link
        to="/users"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> People
      </Link>

      <div className="surface flex flex-wrap items-center gap-4 p-6">
        <UserAvatar user={user} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>{user.role}</Chip>
            {dept && <Chip>{dept.name}</Chip>}
            {team && <Chip>{team.name}</Chip>}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Mail className="size-4" /> {user.email}
          </p>
          <p className="num mt-1">Joined {fmtDate(user.joined)}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned tasks" value={stats.total} tone="primary" />
        <StatCard label="Completed" value={stats.completed} hint={`${stats.completion}%`} tone="success" />
        <StatCard label="Overdue" value={stats.overdue} tone="danger" />
        <StatCard label="In progress" value={stats.inProgress} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section title="Reporting line" className="xl:col-span-1">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Reports to</p>
              {manager ? (
                <Link
                  to="/users/$userId"
                  params={{ userId: manager.id }}
                  className="mt-1.5 flex items-center gap-2 hover:underline"
                >
                  <UserAvatar user={manager} size="xs" /> {manager.name}
                </Link>
              ) : (
                <p className="mt-1">Board of directors</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Direct reports ({reports.length})</p>
              <ul className="mt-1.5 space-y-1.5">
                {reports.map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/users/$userId"
                      params={{ userId: r.id }}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <UserAvatar user={r} size="xs" /> {r.name}
                    </Link>
                  </li>
                ))}
                {reports.length === 0 && (
                  <li className="text-muted-foreground">No direct reports</li>
                )}
              </ul>
            </div>
          </div>
        </Section>
        <Section title="Assigned work" className="xl:col-span-2" bodyClassName="p-0">
          <TaskTable tasks={own.slice(0, 20)} compact emptyTitle="No tasks assigned" />
        </Section>
      </div>
    </>
  );
}
