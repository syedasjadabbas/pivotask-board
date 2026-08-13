import {
  Activity,
  Bell,
  Building2,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Hash,
  LayoutDashboard,
  ListTodo,
  Network,
  PieChart,
  Settings,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { Role } from "@/data/types";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  roles: Role[];
  group: "Workspace" | "Organization" | "System";
}

const ALL: Role[] = ["CEO", "COO", "HOD", "Team Lead", "Employee"];
const LEADERSHIP: Role[] = ["CEO", "COO", "HOD", "Team Lead"];
const EXEC: Role[] = ["CEO", "COO"];

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, roles: ALL, group: "Workspace" },
  { label: "My Tasks", to: "/my-tasks", icon: CheckSquare, roles: ALL, group: "Workspace" },
  { label: "Projects", to: "/projects", icon: FolderKanban, roles: ALL, group: "Workspace" },
  { label: "Tasks", to: "/tasks", icon: ListTodo, roles: LEADERSHIP, group: "Workspace" },
  { label: "Calendar", to: "/calendar", icon: CalendarDays, roles: ALL, group: "Workspace" },
  {
    label: "Teams",
    to: "/teams",
    icon: UsersRound,
    roles: LEADERSHIP,
    group: "Organization",
  },
  {
    label: "Departments",
    to: "/departments",
    icon: Building2,
    roles: LEADERSHIP,
    group: "Organization",
  },
  {
    label: "Org Chart",
    to: "/org-chart",
    icon: Network,
    roles: LEADERSHIP,
    group: "Organization",
  },
  { label: "Reports", to: "/reports", icon: PieChart, roles: LEADERSHIP, group: "Organization" },
  { label: "Activity", to: "/activity", icon: Activity, roles: LEADERSHIP, group: "Organization" },
  { label: "Notifications", to: "/notifications", icon: Bell, roles: ALL, group: "System" },
  { label: "Slack", to: "/slack", icon: Hash, roles: LEADERSHIP, group: "System" },
  { label: "Users", to: "/users", icon: Users, roles: EXEC, group: "System" },
  { label: "Settings", to: "/settings", icon: Settings, roles: ALL, group: "System" },
];

export function navForRole(role: Role) {
  return navItems.filter((item) => item.roles.includes(role));
}
