import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Input } from "@/components/ui/input";
import { visibleUsers } from "@/lib/permissions";
import { workload } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/users/")({
  head: () => ({
    meta: [
      { title: "People · Zeploy" },
      { name: "description", content: "Directory of everyone in the organization with live workload." },
      { property: "og:title", content: "People · Zeploy" },
      { property: "og:description", content: "Directory with roles, departments and workload." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { users, tasks, currentUser, departments } = useApp();
  const [q, setQ] = useState("");
  const scoped = visibleUsers(currentUser, users).filter((u) =>
    `${u.name} ${u.title} ${u.role}`.toLowerCase().includes(q.toLowerCase()),
  );
  const rows = workload(scoped, tasks);

  return (
    <>
      <PageHeader title="People" description={`${scoped.length} people in your directory`} />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search people…"
        className="h-9 max-w-sm"
      />
      <Section bodyClassName="p-0">
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.user.id} className="flex items-center gap-3 px-4 py-3">
              <UserAvatar user={row.user} size="md" />
              <div className="min-w-0 flex-1">
                <Link
                  to="/users/$userId"
                  params={{ userId: row.user.id }}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {row.user.name}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  {row.user.title} ·{" "}
                  {departments.find((d) => d.id === row.user.departmentId)?.name ?? "Executive"}
                </p>
              </div>
              <span className="hidden rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground sm:inline">
                {row.user.role}
              </span>
              <div className="num flex w-40 justify-end gap-4 text-xs text-muted-foreground">
                <span>{row.active} active</span>
                <span className={row.overdue ? "text-destructive" : ""}>{row.overdue} late</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
