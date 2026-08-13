import { DONE_STATUSES, OPEN_STATUSES } from "@/data/constants";
import type { Department, Task, User } from "@/data/types";
import { daysFromToday, pct } from "./format";

export const isDone = (t: Task) => DONE_STATUSES.includes(t.status);
export const isOpen = (t: Task) => OPEN_STATUSES.includes(t.status);
export const isOverdue = (t: Task) => isOpen(t) && daysFromToday(t.dueDate) < 0;

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  overdue: number;
  critical: number;
  review: number;
  completion: number;
}

export function taskStats(tasks: Task[]): TaskStats {
  const completed = tasks.filter(isDone).length;
  return {
    total: tasks.length,
    completed,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    blocked: tasks.filter((t) => t.status === "Blocked").length,
    overdue: tasks.filter(isOverdue).length,
    critical: tasks.filter((t) => t.priority === "Critical" && isOpen(t)).length,
    review: tasks.filter((t) => t.status === "Submitted for Review").length,
    completion: pct(completed, tasks.length),
  };
}

export function completedThisWeek(tasks: Task[]) {
  return tasks.filter((t) => isDone(t) && daysFromToday(t.dueDate) >= -7).length;
}

export interface DepartmentStat extends TaskStats {
  department: Department;
  headName: string;
  teamSize: number;
  activeTasks: number;
}

export function departmentStats(
  departments: Department[],
  tasks: Task[],
  users: User[],
): DepartmentStat[] {
  return departments.map((department) => {
    const deptTasks = tasks.filter((t) => t.departmentId === department.id);
    const stats = taskStats(deptTasks);
    return {
      ...stats,
      department,
      headName: users.find((u) => u.id === department.headId)?.name ?? "Unassigned",
      teamSize: users.filter((u) => u.departmentId === department.id).length,
      activeTasks: deptTasks.filter(isOpen).length,
    };
  });
}

export interface WorkloadRow {
  user: User;
  active: number;
  completed: number;
  overdue: number;
  completion: number;
}

export function workload(users: User[], tasks: Task[]): WorkloadRow[] {
  return users
    .map((user) => {
      const own = tasks.filter((t) => t.assigneeId === user.id);
      const completed = own.filter(isDone).length;
      return {
        user,
        active: own.filter(isOpen).length,
        completed,
        overdue: own.filter(isOverdue).length,
        completion: pct(completed, own.length),
      };
    })
    .sort((a, b) => b.active - a.active);
}

export function projectStats(tasks: Task[], projectId: string) {
  const own = tasks.filter((t) => t.projectId === projectId);
  const stats = taskStats(own);
  return { ...stats, tasks: own };
}

/** Weekly completion trend for charts (deterministic, derived from the data set). */
export function completionTrend(tasks: Task[]) {
  const weeks = [-5, -4, -3, -2, -1, 0];
  return weeks.map((w) => {
    const inWindow = tasks.filter((t) => {
      const d = daysFromToday(t.dueDate);
      return d > w * 7 - 7 && d <= w * 7;
    });
    return {
      label: w === 0 ? "This week" : `W${6 + w}`,
      completed: inWindow.filter(isDone).length,
      created: inWindow.length,
      overdue: inWindow.filter(isOverdue).length,
    };
  });
}

export function statusBreakdown(tasks: Task[]) {
  const buckets: { name: string; value: number }[] = [
    { name: "Completed", value: tasks.filter(isDone).length },
    { name: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length },
    { name: "Review", value: tasks.filter((t) => t.status === "Submitted for Review").length },
    { name: "Blocked", value: tasks.filter((t) => t.status === "Blocked").length },
    {
      name: "Not started",
      value: tasks.filter((t) => t.status === "Backlog" || t.status === "Assigned").length,
    },
  ];
  return buckets.filter((b) => b.value > 0);
}

export function upcomingDeadlines(tasks: Task[], days = 7) {
  return tasks
    .filter((t) => isOpen(t) && daysFromToday(t.dueDate) >= 0 && daysFromToday(t.dueDate) <= days)
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
}
