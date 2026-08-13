import { createFileRoute } from "@tanstack/react-router";

import { Chip } from "@/components/common/Badges";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Zeploy" },
      { name: "description", content: "Appearance, profile and notification preferences." },
      { property: "og:title", content: "Settings · Zeploy" },
      { property: "og:description", content: "Appearance, profile and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { currentUser, theme, toggleTheme, slackConnected, setSlackConnected, users, switchUser } =
    useApp();

  return (
    <>
      <PageHeader title="Settings" description="Workspace preferences for this demo account" />

      <Section title="Profile">
        <div className="flex items-center gap-4">
          <UserAvatar user={currentUser} size="lg" />
          <div>
            <p className="font-medium">{currentUser.name}</p>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            <div className="mt-2 flex gap-2">
              <Chip>{currentUser.role}</Chip>
              <Chip>{currentUser.title}</Chip>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Appearance" description="Switch between light and dark mode">
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Dark mode</span>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </label>
      </Section>

      <Section title="Notifications" description="Slack delivery for task events">
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Send task updates to Slack</span>
          <Switch checked={slackConnected} onCheckedChange={setSlackConnected} />
        </label>
      </Section>

      <Section title="Demo accounts" description="Switch role to explore different permissions">
        <div className="flex flex-wrap gap-2">
          {["u1", "u2", "u3", "u9", "u15"].map((id) => {
            const u = users.find((x) => x.id === id)!;
            return (
              <Button
                key={id}
                variant={u.id === currentUser.id ? "default" : "outline"}
                size="sm"
                onClick={() => switchUser(u.id)}
              >
                {u.name} · {u.role}
              </Button>
            );
          })}
        </div>
      </Section>
    </>
  );
}
