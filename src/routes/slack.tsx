import { createFileRoute } from "@tanstack/react-router";
import { Hash } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { relativeTime } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/slack")({
  head: () => ({
    meta: [
      { title: "Slack integration · Zeploy" },
      { name: "description", content: "Channel mapping and the live feed of task notifications sent to Slack." },
      { property: "og:title", content: "Slack integration · Zeploy" },
      { property: "og:description", content: "Channel mapping and live notification feed." },
    ],
  }),
  component: SlackPage,
});

function SlackPage() {
  const { slackMessages, slackConnected, setSlackConnected, departments, channelMap, setChannel } =
    useApp();

  return (
    <>
      <PageHeader
        title="Slack integration"
        description="Task events are pushed to department channels in real time"
        actions={
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={slackConnected} onCheckedChange={setSlackConnected} />
            {slackConnected ? "Connected" : "Disconnected"}
          </label>
        }
      />

      <Section title="Channel mapping" description="Where each department receives updates">
        <ul className="grid gap-3 md:grid-cols-2">
          {departments.map((d) => (
            <li key={d.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{d.name}</span>
              <Input
                value={channelMap[d.id] ?? d.slackChannel}
                onChange={(e) => setChannel(d.id, e.target.value)}
                className="h-8 w-44"
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Message feed" description={`${slackMessages.length} notifications sent`}>
        <ul className="space-y-3">
          {slackMessages.map((m) => (
            <li key={m.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Hash className="size-3.5" />
                <span className="font-medium text-foreground">{m.channel.replace("#", "")}</span>
                <span className="ml-auto">{relativeTime(m.at)}</span>
              </div>
              <p className="mt-2 text-sm font-semibold">{m.title}</p>
              <dl className="mt-2 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
                {m.fields.map((f) => (
                  <div key={f.label} className="flex gap-2">
                    <dt className="text-muted-foreground">{f.label}:</dt>
                    <dd className="truncate">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
