import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { AvatarStack, UserAvatar } from "@/components/common/UserAvatar";
import { Progress } from "@/components/ui/progress";
import { taskStats } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams · Zeploy" },
      { name: "description", content: "Team leads, members and delivery performance by team." },
      { property: "og:title", content: "Teams · Zeploy" },
      { property: "og:description", content: "Leads, members and delivery performance." },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const { teams, users, tasks, departments, userById } = useApp();

  return (
    <>
      <PageHeader title="Teams" description={`${teams.length} teams across the organization`} />
      <div className="grid gap-6 xl:grid-cols-2">
        {departments.map((dept) => {
          const deptTeams = teams.filter((t) => t.departmentId === dept.id);
          if (!deptTeams.length) return null;
          return (
            <Section key={dept.id} title={dept.name} description={dept.description}>
              <ul className="space-y-3">
                {deptTeams.map((team) => {
                  const members = users.filter((u) => u.teamId === team.id);
                  const memberIds = new Set(members.map((m) => m.id));
                  const stats = taskStats(tasks.filter((t) => memberIds.has(t.assigneeId)));
                  const lead = userById(team.leadId);
                  return (
                    <li key={team.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        {lead && <UserAvatar user={lead} size="md" />}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{team.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            Lead:{" "}
                            <Link
                              to="/users/$userId"
                              params={{ userId: team.leadId }}
                              className="hover:underline"
                            >
                              {lead?.name}
                            </Link>
                          </p>
                        </div>
                        <AvatarStack users={members} />
                      </div>
                      <Progress value={stats.completion} className="mt-3 h-1.5" />
                      <div className="num mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span>{stats.total} tasks</span>
                        <span>{stats.completion}% complete</span>
                        <span className={stats.overdue ? "text-destructive" : ""}>
                          {stats.overdue} overdue
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Section>
          );
        })}
      </div>
    </>
  );
}
