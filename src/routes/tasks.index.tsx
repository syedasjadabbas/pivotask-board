import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Columns3, Plus, Rows3 } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskFilters, useTaskFilters } from "@/components/tasks/TaskFilters";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { can, visibleTasks, visibleUsers } from "@/lib/permissions";
import { useApp } from "@/lib/store";
import { CalendarView } from "@/components/tasks/CalendarView";

export const Route = createFileRoute("/tasks/")({
  head: () => ({
    meta: [
      { title: "All tasks · Zeploy" },
      {
        name: "description",
        content: "Board, list and calendar views of every task you have permission to see.",
      },
      { property: "og:title", content: "All tasks · Zeploy" },
      {
        property: "og:description",
        content: "Board, list and calendar views of organization tasks.",
      },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { currentUser, tasks, users } = useApp();
  const scoped = visibleTasks(currentUser, tasks, users);
  const { filters, filtered, set, reset, dirty } = useTaskFilters(scoped);
  const [view, setView] = useState("board");
  const people = visibleUsers(currentUser, users);

  return (
    <>
      <PageHeader
        title="Tasks"
        description={`${filtered.length} of ${scoped.length} tasks visible to you`}
        actions={
          <>
            <Tabs value={view} onValueChange={setView}>
              <TabsList>
                <TabsTrigger value="board" className="gap-1.5">
                  <Columns3 className="size-4" /> Board
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-1.5">
                  <Rows3 className="size-4" /> List
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-1.5">
                  <CalendarDays className="size-4" /> Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {can(currentUser, "create:task") && (
              <CreateTaskDialog
                trigger={
                  <Button className="gap-1.5">
                    <Plus className="size-4" /> New task
                  </Button>
                }
              />
            )}
          </>
        }
      />

      <TaskFilters filters={filters} set={set} reset={reset} dirty={dirty} people={people} />

      {view === "board" && <KanbanBoard tasks={filtered} />}
      {view === "list" && (
        <Section bodyClassName="p-0">
          <TaskTable tasks={filtered} />
        </Section>
      )}
      {view === "calendar" && <CalendarView tasks={filtered} />}
    </>
  );
}
