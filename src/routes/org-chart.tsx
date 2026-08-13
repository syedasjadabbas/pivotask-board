import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { User } from "@/data/types";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/org-chart")({
  head: () => ({
    meta: [
      { title: "Org chart · Zeploy" },
      { name: "description", content: "Reporting hierarchy from the CEO down to every employee." },
      { property: "og:title", content: "Org chart · Zeploy" },
      { property: "og:description", content: "Reporting hierarchy across the organization." },
    ],
  }),
  component: OrgChartPage,
});

function Node({ user, users, depth }: { user: User; users: User[]; depth: number }) {
  const reports = users.filter((u) => u.managerId === user.id);
  return (
    <li className="relative">
      <Link
        to="/users/$userId"
        params={{ userId: user.id }}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40"
      >
        <UserAvatar user={user} size={depth === 0 ? "md" : "sm"} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{user.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{user.title}</span>
        </span>
        <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          {user.role}
        </span>
      </Link>
      {reports.length > 0 && (
        <ul className="mt-3 space-y-3 border-l border-border pl-5">
          {reports.map((r) => (
            <Node key={r.id} user={r} users={users} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function OrgChartPage() {
  const { users } = useApp();
  const roots = users.filter((u) => !u.managerId);

  return (
    <>
      <PageHeader
        title="Org chart"
        description={`${users.length} people · reporting lines from the executive team down`}
      />
      <div className="surface overflow-x-auto p-6">
        <ul className="min-w-[520px] space-y-3">
          {roots.map((r) => (
            <Node key={r.id} user={r} users={users} depth={0} />
          ))}
        </ul>
      </div>
    </>
  );
}
