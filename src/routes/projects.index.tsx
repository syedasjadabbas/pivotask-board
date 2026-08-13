import { createFileRoute, Link } from "@tanstack/react-router";

import { Chip } from "@/components/common/Badges";
import { PageHeader } from "@/components/common/PageHeader";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Progress } from "@/components/ui/progress";
import { relativeDay } from "@/lib/format";
import { projectStats } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects · Zeploy" },
      { name: "description", content: "Every active project with owners, deadlines and delivery health." },
      { property: "og:title", content: "Projects · Zeploy" },
      { property: "og:description", content: "Owners, deadlines and delivery health at a glance." },
    ],
  }),
  component: ProjectsPage,
});

const statusTone: Record<string, string> = {
  "On Track": "border-success/20 bg-success/10 text-success",
  "At Risk": "border-warning/25 bg-warning/15 text-warning",
  Delayed: "border-destructive/20 bg-destructive/10 text-destructive",
  Completed: "border-border bg-secondary text-secondary-foreground",
};

function ProjectsPage() {
  const { projects, tasks, departments, userById } = useApp();

  return (
    <>
      <PageHeader
        title="Projects"
        description={`${projects.length} projects across ${departments.length} departments`}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const stats = projectStats(tasks, project.id);
          const owner = userById(project.ownerId);
          const dept = departments.find((d) => d.id === project.departmentId);
          return (
            <Link
              key={project.id}
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="surface flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-pop)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{project.name}</p>
                <Chip className={cn(statusTone[project.status])}>{project.status}</Chip>
              </div>
              <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stats.completed} / {stats.total} tasks</span>
                  <span className="num">{stats.completion}%</span>
                </div>
                <Progress value={stats.completion} className="mt-2 h-1.5" />
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                {owner && <UserAvatar user={owner} size="xs" />}
                <span className="truncate">{owner?.name}</span>
                <span className="ml-auto num">{relativeDay(project.deadline)}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">{dept?.name}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
