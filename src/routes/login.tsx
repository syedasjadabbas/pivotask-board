import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · Zeploy" },
      { name: "description", content: "Choose a demo role to explore Zeploy task management." },
      { property: "og:title", content: "Sign in · Zeploy" },
      { property: "og:description", content: "Choose a demo role and explore the workspace." },
    ],
  }),
  component: LoginPage,
});

const DEMO_IDS = ["u1", "u2", "u3", "u9", "u15"];

function LoginPage() {
  const { users, signIn, signedIn, ready, organization } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && signedIn) void navigate({ to: "/" });
  }, [ready, signedIn, navigate]);

  const accounts = DEMO_IDS.map((id) => users.find((u) => u.id === id)!);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">
            Z
          </span>
          <span className="font-semibold">{organization.name}</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Every task, every team, one accountable chain of command.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Zeploy connects executive visibility with day-to-day delivery — role-based dashboards,
            approval workflows, and Slack notifications that keep everyone in sync.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {[
              "Role-aware dashboards for CEO, COO, HOD, Leads and Employees",
              "Kanban, list and calendar views with dependencies and subtasks",
              "Automatic Slack updates on assignment, blockers and approvals",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          Demo workspace · data resets on reload of local storage
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to Zeploy</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a demo account to see the workspace through that role.
          </p>
          <ul className="mt-8 space-y-2">
            {accounts.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => {
                    signIn(u.id);
                    void navigate({ to: "/" });
                  }}
                  className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[var(--shadow-pop)]"
                >
                  <UserAvatar user={u} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{u.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {u.title}
                    </span>
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                    {u.role}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            className="mt-6 w-full"
            onClick={() => {
              signIn("u1");
              void navigate({ to: "/" });
            }}
          >
            Continue as CEO
          </Button>
        </div>
      </div>
    </div>
  );
}
