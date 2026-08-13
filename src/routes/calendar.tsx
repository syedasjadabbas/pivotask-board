import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { CalendarView } from "@/components/tasks/CalendarView";
import { TaskFilters, useTaskFilters } from "@/components/tasks/TaskFilters";
import { visibleTasks, visibleUsers } from "@/lib/permissions";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar · Zeploy" },
      { name: "description", content: "Month view of task deadlines across your organization." },
      { property: "og:title", content: "Calendar · Zeploy" },
      { property: "og:description", content: "Month view of every deadline in your scope." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { currentUser, tasks, users } = useApp();
  const scoped = visibleTasks(currentUser, tasks, users);
  const { filters, filtered, set, reset, dirty } = useTaskFilters(scoped);

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Deadlines by month — click any task to open it"
      />
      <TaskFilters
        filters={filters}
        set={set}
        reset={reset}
        dirty={dirty}
        people={visibleUsers(currentUser, users)}
      />
      <CalendarView tasks={filtered} />
    </>
  );
}
