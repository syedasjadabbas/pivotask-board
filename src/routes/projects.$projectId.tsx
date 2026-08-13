import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { Chip } from "@/components/common/Badges";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { StatCard } from "@/components/common/StatCard";
import { UserAvatar } from "@/components/common/UserAvatar";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate, relativeDay } from "@/lib/format";
import { visibleTasks } from "@/lib/permissions";
import { projectStats, workload } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project detail · Zeploy" },
      { name: "description", content: "Project health, milestones, contributors and task board." },
      { property: "og:title", content: "Project detail · Zeploy" },
      { property: "og:description", content: "Project health, contributors and task board." },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const { projects, tasks, users, departments, currentUser, userById } = useApp();
  const [view, setView] = useState("board");

  const project = projects.find((p) => p.id === projectId);
  if (!project) return <p className="py-20 text-center">Project not found.</p>;

  const scoped = visibleTasks(currentUser, tasks, users).filter(
    (t) => t.projectId === project.id,
  );
  const stats = projectStats(tasks, project.id);
  const owner = userById(project.ownerId);
  const dept = departments.find((d) => d.id === project.departmentId);
  const contributorIds = [...new Set(stats.tasks.map((t) => t.assigneeId))];
  const contributors = workload(
    users.filter((u) => contributorIds.includes(u.id)),
    stats.tasks,
  );

  return (
    <>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Projects
      </Link>

      <PageHeader
        title={project.name}
        description={project.description}
        actions={
          <>
            <Chip>{project.status}</Chip>
            <Chip>{dept?.name}</Chip>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} tone="primary" />
        <StatCard label="Completed" value={stats.completed} hint={`${stats.completion}%`} tone="success" />
        <StatCard label="Overdue" value={stats.overdue} tone="danger" />
        <StatCard label="Deadline" value={relativeDay(project.deadline)} hint={fmtDate(project.deadline)} />
      </div>

      <Section title="Delivery progress">
        <Progress value={stats.completion} className="h-2" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Owner</p>
            <p className="mt-1 flex items-center gap-2">
              {owner && <UserAvatar user={owner} size="xs" />}
              {owner?.name}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Started</p>
            <p className="num mt-1">{fmtDate(project.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="num mt-1">{fmtDate(project.deadline)}</p>
          </div>
        </div>
      </Section>

      <Section
        title="Tasks"
        description={`${scoped.length} tasks visible to you`}
        action={
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        }
        bodyClassName={view === "list" ? "p-0" : ""}
      >
        {view === "board" ? <KanbanBoard tasks={scoped} /> : <TaskTable tasks={scoped} />}
      </Section>

      <Section title="Contributors" description="Workload on this project">
        <ul className="divide-y divide-border">
          {contributors.map((row) => (
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
              <div className="num flex gap-4 text-xs text-muted-foreground">
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
