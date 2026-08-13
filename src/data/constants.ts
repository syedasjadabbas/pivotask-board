import type { Priority, TaskStatus } from "./types";

export const STATUSES: TaskStatus[] = [
  "Backlog",
  "Assigned",
  "Accepted",
  "In Progress",
  "Blocked",
  "Submitted for Review",
  "Rejected",
  "Approved",
  "Completed",
];

export const PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"];

export const KANBAN_COLUMNS: { id: string; label: string; statuses: TaskStatus[] }[] = [
  { id: "backlog", label: "Backlog", statuses: ["Backlog"] },
  { id: "assigned", label: "Assigned", statuses: ["Assigned", "Accepted"] },
  { id: "progress", label: "In Progress", statuses: ["In Progress", "Blocked"] },
  { id: "review", label: "Review", statuses: ["Submitted for Review", "Rejected"] },
  { id: "done", label: "Completed", statuses: ["Approved", "Completed"] },
];

export const OPEN_STATUSES: TaskStatus[] = [
  "Backlog",
  "Assigned",
  "Accepted",
  "In Progress",
  "Blocked",
  "Submitted for Review",
  "Rejected",
];

export const DONE_STATUSES: TaskStatus[] = ["Approved", "Completed"];

export const statusTone: Record<TaskStatus, string> = {
  Backlog: "bg-muted text-muted-foreground border-border",
  Assigned: "bg-info/10 text-info border-info/20",
  Accepted: "bg-info/10 text-info border-info/20",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Blocked: "bg-destructive/10 text-destructive border-destructive/20",
  "Submitted for Review": "bg-warning/15 text-warning border-warning/25",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Approved: "bg-success/10 text-success border-success/20",
  Completed: "bg-success/10 text-success border-success/20",
};

export const priorityTone: Record<Priority, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-warning/15 text-warning border-warning/25",
  Medium: "bg-info/10 text-info border-info/20",
  Low: "bg-muted text-muted-foreground border-border",
};
