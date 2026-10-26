# Pivotask Board

> Multi-tier organizational task management and workflow coordination web application.

For the initial design requirements and feature specification, see [docs/ORIGINAL_SPEC.md](docs/ORIGINAL_SPEC.md).

---

## Overview

Pivotask Board is an enterprise task and project management web application structured around a five-tier organizational hierarchy. The platform enables leadership, department heads, and team members to plan initiatives, assign tasks, track milestone progress, submit work for review, and enforce structured approval flows across departments.

---

## Organizational Roles & Permissions

The application implements role-based access control (RBAC) across five organizational tiers:

- **CEO**: Complete organization oversight, executive performance dashboards, cross-department analytics, organization-wide user and department administration, and high-level report generation.
- **COO**: Operational management, department performance tracking, cross-department project oversight, workload distribution, and deadline escalation.
- **Head of Department (HOD)**: Department-level administration, task delegation, team workload monitoring, subtask management, and formal task review with approval or rejection actions.
- **Team Lead**: Team-specific task coordination, backlog grooming, peer task delegation, and progress reviews.
- **Employee**: Individual task execution workbench (`My Tasks`), status transitions (`Accepted`, `In Progress`, `Submitted for Review`), subtask checklist completion, commenting, file attachments, and activity tracking.

---

## Key Features

### 1. Task Lifecycle & Approval Workflows
- **Comprehensive Status Pipeline**: Backlog, Assigned, Accepted, In Progress, Blocked, Submitted for Review, Rejected, Approved, and Completed.
- **Priority Tiers**: Critical, High, Medium, and Low.
- **Subtasks & Dependencies**: Nested subtask checklists with percentage tracking and prerequisite task dependency mapping.
- **Formal Review Process**: Employees submit completed work for review; HODs and Leads review deliverables and either approve or reject with contextual feedback.
- **Audit Activity Log**: Chronological timeline tracking every assignment, status change, and approval decision per task.

### 2. Multi-Dimensional Task Views
- **Kanban Board**: Drag-and-drop workflow columns for agile sprint tracking.
- **List View**: Dense tabular view with multi-column sorting and filtering by department, priority, assignee, and status.
- **Calendar View**: Deadline and milestone schedule view organized by due dates.
- **My Tasks View**: Focused workspace for individual contributors grouped by Today, Upcoming, and Overdue.

### 3. Projects, Departments & Teams
- **Project Tracking**: Progress indicators, target deadlines, active member assignments, and task completion metrics.
- **Department Portals**: Dedicated workspaces for Development, Marketing, Sales, HR, Finance, and Design.
- **Interactive Org Chart**: Visual hierarchy tree displaying leadership reporting lines and department staffing.

### 4. Notifications & Slack Integration
- **Notification Center**: In-app notifications for task assignments, reassignments, approaching deadlines, review submissions, and approvals.
- **Slack Workspace Bridge**: Department-to-channel mapping simulation generating structured message cards for task updates.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State & Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI Primitives](https://www.radix-ui.com/)
- **Charts & Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Project Structure

```
pivotask-board/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── docs/
│   └── ORIGINAL_SPEC.md    # Initial design and requirements specification
├── src/
│   ├── routes/             # TanStack file-based router pages
│   │   ├── index.tsx       # Role-dependent executive and employee dashboards
│   │   ├── tasks.*.tsx     # Task list, Kanban, and task detail views
│   │   ├── projects.*.tsx  # Project portfolio and project detail views
│   │   ├── departments.*   # Department management views
│   │   ├── teams.tsx       # Team rosters and workload management
│   │   ├── org-chart.tsx   # Interactive organizational hierarchy tree
│   │   ├── reports.tsx     # Productivity and completion analytics
│   │   ├── slack.tsx       # Slack channel mapping and message feeds
│   │   └── calendar.tsx    # Deadline schedule calendar
│   ├── components/         # Shared UI components and layout shells
│   ├── data/               # Mock organizational data, constants, and types
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility helpers
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
git clone https://github.com/syedasjadabbas/pivotask-board.git
cd pivotask-board
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the port indicated in your terminal).

### Production Build

Build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```
