import { X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITIES, STATUSES } from "@/data/constants";
import type { Task } from "@/data/types";
import { daysFromToday } from "@/lib/format";
import { isOverdue } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export interface FilterState {
  q: string;
  status: string;
  priority: string;
  department: string;
  assignee: string;
  project: string;
  due: string;
}

const initial: FilterState = {
  q: "",
  status: "all",
  priority: "all",
  department: "all",
  assignee: "all",
  project: "all",
  due: "all",
};

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<FilterState>(initial);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.q && !`${t.title} ${t.key}`.toLowerCase().includes(filters.q.toLowerCase()))
        return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.department !== "all" && t.departmentId !== filters.department) return false;
      if (filters.assignee !== "all" && t.assigneeId !== filters.assignee) return false;
      if (filters.project !== "all" && t.projectId !== filters.project) return false;
      if (filters.due !== "all") {
        const d = daysFromToday(t.dueDate);
        if (filters.due === "overdue" && !isOverdue(t)) return false;
        if (filters.due === "today" && d !== 0) return false;
        if (filters.due === "week" && (d < 0 || d > 7)) return false;
        if (filters.due === "month" && (d < 0 || d > 30)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const dirty = JSON.stringify(filters) !== JSON.stringify(initial);

  return {
    filters,
    filtered,
    dirty,
    set: (patch: Partial<FilterState>) => setFilters((f) => ({ ...f, ...patch })),
    reset: () => setFilters(initial),
  };
}

export function TaskFilters({
  filters,
  set,
  reset,
  dirty,
  people,
  hideDepartment,
}: {
  filters: FilterState;
  set: (patch: Partial<FilterState>) => void;
  reset: () => void;
  dirty: boolean;
  people: { id: string; name: string }[];
  hideDepartment?: boolean;
}) {
  const { departments, projects } = useApp();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        value={filters.q}
        onChange={(e) => set({ q: e.target.value })}
        placeholder="Filter tasks…"
        className="h-9 w-full sm:w-56"
      />
      <Select value={filters.status} onValueChange={(v) => set({ status: v })}>
        <SelectTrigger className="h-9 w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.priority} onValueChange={(v) => set({ priority: v })}>
        <SelectTrigger className="h-9 w-[135px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideDepartment && (
        <Select value={filters.department} onValueChange={(v) => set({ department: v })}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Select value={filters.assignee} onValueChange={(v) => set({ assignee: v })}>
        <SelectTrigger className="h-9 w-[150px]">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {people.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.project} onValueChange={(v) => set({ project: v })}>
        <SelectTrigger className="h-9 w-[160px]">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.due} onValueChange={(v) => set({ due: v })}>
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="Due date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any date</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="today">Due today</SelectItem>
          <SelectItem value="week">Next 7 days</SelectItem>
          <SelectItem value="month">Next 30 days</SelectItem>
        </SelectContent>
      </Select>
      {dirty && (
        <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
          <X className="size-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}
