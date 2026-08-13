import { createFileRoute } from "@tanstack/react-router";

import { ActivityTimeline } from "@/components/common/ActivityTimeline";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity · Zeploy" },
      { name: "description", content: "Chronological audit trail of every action in the workspace." },
      { property: "og:title", content: "Activity · Zeploy" },
      { property: "og:description", content: "Audit trail of workspace actions." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const { activity } = useApp();
  return (
    <>
      <PageHeader title="Activity" description="Audit trail across tasks, projects and people" />
      <Section>
        <ActivityTimeline entries={activity.slice(0, 60)} showDate />
      </Section>
    </>
  );
}
