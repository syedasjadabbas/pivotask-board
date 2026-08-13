export type Role = "CEO" | "COO" | "HOD" | "Team Lead" | "Employee";

export type TaskStatus =
  | "Backlog"
  | "Assigned"
  | "Accepted"
  | "In Progress"
  | "Blocked"
  | "Submitted for Review"
  | "Rejected"
  | "Approved"
  | "Completed";

export type Priority = "Critical" | "High" | "Medium" | "Low";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string | null;
  teamId: string | null;
  managerId: string | null;
  title: string;
  avatarColor: string;
  joined: string;
}

export interface Department {
  id: string;
  name: string;
  headId: string;
  slackChannel: string;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  departmentId: string;
  leadId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  departmentId: string;
  deadline: string;
  startDate: string;
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  at: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  kind: string;
}

export interface ActivityEntry {
  id: string;
  actorId: string;
  action: string;
  objectType: "task" | "project" | "user" | "department";
  objectId: string;
  objectLabel: string;
  at: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description: string;
  creatorId: string;
  assigneeId: string;
  departmentId: string;
  projectId: string;
  priority: Priority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  progress: number;
  subtasks: Subtask[];
  dependsOn: string[];
  comments: Comment[];
  attachments: Attachment[];
  activity: ActivityEntry[];
  createdAt: string;
}

export interface Notification {
  id: string;
  type:
    | "Task assigned"
    | "Task reassigned"
    | "Task due soon"
    | "Task overdue"
    | "Task blocked"
    | "Task submitted"
    | "Task approved"
    | "Task rejected"
    | "New comment"
    | "Mention";
  title: string;
  body: string;
  taskId?: string;
  userId: string;
  at: string;
  read: boolean;
}

export interface SlackMessage {
  id: string;
  channel: string;
  at: string;
  title: string;
  fields: { label: string; value: string }[];
  taskId?: string;
}
