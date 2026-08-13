import { createFileRoute } from "@tanstack/react-router";
import { Columns3, Rows3 } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { StatCard } from "@/components/common/StatCard";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskFilters, useTaskFilters } from "@/components/tasks/TaskFilters";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { taskStats } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/my-tasks")({
  head: () => ({
    meta: [
      { title: "My tasks · Zeploy" },
      { name: "description", content: "Everything assigned to you, with board and list views." },
      { property: "og:title", content: "My tasks · Zeploy" },
      { property: "og:description", content: "Everything assigned to you in one focused view." },
    ],
  }),
  component: MyTasks,
});

function MyTasks() {
  const { currentUser, tasks } = useApp();
  const mine = tasks.filter(
    (t) => t.assigneeId === currentUser.id || t.creatorId === currentUser.id,
  );
  const { filters, filtered, set, reset, dirty } = useTaskFilters(mine);
  const [view, setView] = useState("list");
  const stats = taskStats(mine.filter((t) => t.assigneeId === currentUser.id));

  return (
    <>
      <PageHeader
        title="My tasks"
        description="Work assigned to you and work you created"
        actions={
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="list" className="gap-1.5">
                <Rows3 className="size-4" /> List
              </TabsTrigger>
              <TabsTrigger value="board" className="gap-1.5">
                <Columns3 className="size-4" /> Board
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned to me" value={stats.total} tone="primary" />
        <StatCard label="In progress" value={stats.inProgress} tone="default" />
        <StatCard label="Overdue" value={stats.overdue} tone="danger" />
        <StatCard label="Completed" value={stats.completed} tone="success" />
      </div>

      <TaskFilters
        filters={filters}
        set={set}
        reset={reset}
        dirty={dirty}
        people={[currentUser]}
      />

      {view === "list" ? (
        <Section bodyClassName="p-0">
          <TaskTable tasks={filtered} emptyTitle="No tasks assigned to you" />
        </Section>
      ) : (
        <KanbanBoard tasks={filtered} />
      )}
    </>
  );
}
