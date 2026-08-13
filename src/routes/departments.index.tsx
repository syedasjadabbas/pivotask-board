import { createFileRoute, Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { AvatarStack, UserAvatar } from "@/components/common/UserAvatar";
import { Progress } from "@/components/ui/progress";
import { departmentStats } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/departments/")({
  head: () => ({
    meta: [
      { title: "Departments · Zeploy" },
      { name: "description", content: "Department heads, headcount, workload and Slack channels." },
      { property: "og:title", content: "Departments · Zeploy" },
      { property: "og:description", content: "Heads, headcount, workload and Slack channels." },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const { departments, tasks, users, channelMap } = useApp();
  const stats = departmentStats(departments, tasks, users);

  return (
    <>
      <PageHeader
        title="Departments"
        description={`${departments.length} departments · ${users.length} people`}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((d) => {
          const members = users.filter((u) => u.departmentId === d.department.id);
          const head = users.find((u) => u.id === d.department.headId);
          return (
            <Link
              key={d.department.id}
              to="/departments/$deptId"
              params={{ deptId: d.department.id }}
              className="surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-pop)]"
            >
              <div className="flex items-center gap-3">
                {head && <UserAvatar user={head} size="md" />}
                <div className="min-w-0">
                  <p className="truncate font-semibold">{d.department.name}</p>
                  <p className="truncate text-xs text-muted-foreground">Led by {d.headName}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {d.department.description}
              </p>
              <Progress value={d.completion} className="mt-4 h-1.5" />
              <div className="num mt-3 flex justify-between text-xs text-muted-foreground">
                <span>{d.activeTasks} active</span>
                <span className={d.overdue ? "text-destructive" : ""}>{d.overdue} overdue</span>
                <span>{d.completion}% done</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <AvatarStack users={members} />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Hash className="size-3" />
                  {(channelMap[d.department.id] ?? d.department.slackChannel).replace("#", "")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
