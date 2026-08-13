import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Hash } from "lucide-react";

import { Chip } from "@/components/common/Badges";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { StatCard } from "@/components/common/StatCard";
import { UserAvatar } from "@/components/common/UserAvatar";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Progress } from "@/components/ui/progress";
import { taskStats, workload } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/departments/$deptId")({
  head: () => ({
    meta: [
      { title: "Department detail · Zeploy" },
      { name: "description", content: "Department teams, people, workload and open tasks." },
      { property: "og:title", content: "Department detail · Zeploy" },
      { property: "og:description", content: "Teams, people, workload and open tasks." },
    ],
  }),
  component: DepartmentDetail,
});

function DepartmentDetail() {
  const { deptId } = Route.useParams();
  const { departments, teams, users, tasks, projects, channelMap, userById } = useApp();

  const dept = departments.find((d) => d.id === deptId);
  if (!dept) return <p className="py-20 text-center">Department not found.</p>;

  const members = users.filter((u) => u.departmentId === dept.id);
  const deptTasks = tasks.filter((t) => t.departmentId === dept.id);
  const stats = taskStats(deptTasks);
  const rows = workload(members, tasks);
  const head = userById(dept.headId);
  const deptTeams = teams.filter((t) => t.departmentId === dept.id);
  const deptProjects = projects.filter((p) => p.departmentId === dept.id);

  return (
    <>
      <Link
        to="/departments"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Departments
      </Link>

      <PageHeader
        title={dept.name}
        description={dept.description}
        actions={
          <Chip>
            <Hash className="size-3" />
            {(channelMap[dept.id] ?? dept.slackChannel).replace("#", "")}
          </Chip>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Headcount" value={members.length} hint={`Led by ${head?.name}`} tone="primary" />
        <StatCard label="Active tasks" value={stats.total - stats.completed} />
        <StatCard label="Overdue" value={stats.overdue} tone="danger" />
        <StatCard label="Completion" value={`${stats.completion}%`} tone="success" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Teams" description={`${deptTeams.length} teams in this department`}>
          <ul className="space-y-3">
            {deptTeams.map((team) => {
              const lead = userById(team.leadId);
              const size = users.filter((u) => u.teamId === team.id).length;
              return (
                <li
                  key={team.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  {lead && <UserAvatar user={lead} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{team.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead?.name} · {size} members
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Projects" description={`${deptProjects.length} owned by this department`}>
          <ul className="space-y-3">
            {deptProjects.map((p) => (
              <li key={p.id}>
                <Link
                  to="/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
                  <Chip>{p.status}</Chip>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Workload" description="Task distribution across the department">
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.user.id} className="flex items-center gap-3 py-3">
              <UserAvatar user={row.user} />
              <div className="min-w-0 flex-1">
                <Link
                  to="/users/$userId"
                  params={{ userId: row.user.id }}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {row.user.name}
                </Link>
                <p className="truncate text-xs text-muted-foreground">{row.user.title}</p>
              </div>
              <div className="hidden w-36 sm:block">
                <Progress value={row.completion} className="h-1.5" />
              </div>
              <div className="num flex w-36 justify-end gap-3 text-xs text-muted-foreground">
                <span>{row.active} active</span>
                <span className={row.overdue ? "text-destructive" : ""}>{row.overdue} late</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Department tasks" bodyClassName="p-0">
        <TaskTable tasks={deptTasks.slice(0, 25)} />
      </Section>
    </>
  );
}
