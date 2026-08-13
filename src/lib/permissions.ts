import type { Role, Task, User } from "@/data/types";

export type Capability =
  | "view:organization"
  | "view:department"
  | "manage:users"
  | "manage:roles"
  | "manage:departments"
  | "manage:teams"
  | "manage:slack"
  | "view:reports"
  | "create:task"
  | "assign:anyone"
  | "assign:department"
  | "approve:task"
  | "escalate:task"
  | "update:own-task";

const matrix: Record<Role, Capability[]> = {
  CEO: [
    "view:organization",
    "view:department",
    "manage:users",
    "manage:roles",
    "manage:departments",
    "manage:teams",
    "manage:slack",
    "view:reports",
    "create:task",
    "assign:anyone",
    "assign:department",
    "approve:task",
    "escalate:task",
    "update:own-task",
  ],
  COO: [
    "view:organization",
    "view:department",
    "manage:departments",
    "manage:teams",
    "manage:slack",
    "view:reports",
    "create:task",
    "assign:anyone",
    "assign:department",
    "approve:task",
    "escalate:task",
    "update:own-task",
  ],
  HOD: [
    "view:department",
    "manage:teams",
    "view:reports",
    "create:task",
    "assign:department",
    "approve:task",
    "escalate:task",
    "update:own-task",
  ],
  "Team Lead": [
    "view:department",
    "view:reports",
    "create:task",
    "assign:department",
    "approve:task",
    "update:own-task",
  ],
  Employee: ["update:own-task"],
};

export function can(user: User, capability: Capability) {
  return matrix[user.role].includes(capability);
}

/** Which tasks a user is allowed to see. */
export function visibleTasks(user: User, tasks: Task[], users: User[]) {
  if (user.role === "CEO" || user.role === "COO") return tasks;
  if (user.role === "HOD") return tasks.filter((t) => t.departmentId === user.departmentId);
  if (user.role === "Team Lead") {
    const teamMembers = new Set(
      users.filter((u) => u.teamId === user.teamId).map((u) => u.id),
    );
    return tasks.filter((t) => teamMembers.has(t.assigneeId) || t.creatorId === user.id);
  }
  return tasks.filter((t) => t.assigneeId === user.id || t.creatorId === user.id);
}

export function visibleUsers(user: User, users: User[]) {
  if (user.role === "CEO" || user.role === "COO") return users;
  if (user.role === "HOD") return users.filter((u) => u.departmentId === user.departmentId);
  if (user.role === "Team Lead") return users.filter((u) => u.teamId === user.teamId);
  return users.filter((u) => u.id === user.id || u.id === user.managerId);
}

/** Users this person is allowed to assign work to. */
export function assignableUsers(user: User, users: User[]) {
  if (can(user, "assign:anyone")) return users.filter((u) => u.id !== user.id);
  if (user.role === "HOD")
    return users.filter((u) => u.departmentId === user.departmentId && u.id !== user.id);
  if (user.role === "Team Lead")
    return users.filter((u) => u.teamId === user.teamId && u.id !== user.id);
  return [];
}

export function canApprove(user: User, task: Task, users: User[]) {
  if (!can(user, "approve:task")) return false;
  if (user.role === "CEO" || user.role === "COO") return true;
  if (user.role === "HOD") return task.departmentId === user.departmentId;
  const assignee = users.find((u) => u.id === task.assigneeId);
  return assignee?.teamId === user.teamId;
}
