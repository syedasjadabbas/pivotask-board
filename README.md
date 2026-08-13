# Unity Taskflow

Organization Task Management System

Build a polished, production-style organization task management web application.

The product is an internal organization management platform where the CEO, COO, HODs, Team Leads, and Employees manage tasks, projects, departments, teams, deadlines, approvals, and communication.

The application must feel like a modern SaaS product similar in quality to Linear, ClickUp, Asana, Monday.com, and modern enterprise dashboards.

Do not make this look like a generic Bootstrap admin panel.

1. Main Goal

Create a centralized task management platform with this organizational hierarchy:

CEO
→ COO
→ HOD
→ Team Lead
→ Employee

Users should see different dashboards and actions based on their role.

The platform should also integrate with Slack so task events and notifications appear in the appropriate Slack channels.

2. UI Direction

Prioritize UI quality.

Use:

Modern SaaS design

Clean typography

Excellent spacing

Premium dashboard layouts

Responsive design

Subtle borders

Rounded cards

Clear visual hierarchy

Professional charts

Smooth hover states

Smooth transitions

Skeleton loading states

Empty states

Confirmation dialogs

Toast notifications

Light and dark mode

Consistent design system

Avoid:

Generic Bootstrap styling

Excessive gradients

Huge cards

Cluttered dashboards

Too many colors

Old-fashioned enterprise UI

Excessive shadows

Poor spacing

Tiny text

Use a professional neutral color system with one strong primary accent.

The interface should feel suitable for a real company.

3. Application Layout

Use a persistent sidebar on desktop.

Sidebar:

Dashboard
My Tasks
Projects
Tasks
Teams
Departments
Calendar
Reports
Activity
Notifications
Slack
Users
Settings

At the bottom:

User profile
Role
Organization

The sidebar should change according to permissions.

Example:

CEO sees organization-wide modules.

HOD sees department-level modules.

Employee sees primarily:

Dashboard
My Tasks
Projects
Calendar
Notifications

Use a responsive mobile navigation.

4. CEO Dashboard

Create a high-quality executive dashboard.

Header:

Good morning, [Name]

Show:

Organization task completion

Active projects

Total employees

Overdue tasks

Critical tasks

Tasks completed this week

Create an organization performance section.

Example:

Development
87%

Marketing
91%

Sales
78%

HR
94%

Finance
89%

Use clean charts.

Include:

Task Overview

Total Tasks
326

Completed
214

In Progress
82

Blocked
12

Overdue
18

Department Performance

Show department cards with:

Completion percentage

Active tasks

Overdue tasks

Team size

Critical Tasks

Display a clean table:

Task
Department
Assigned To
Priority
Due Date
Status

Recent Activity

Show:

CEO assigned task
COO updated project
HOD approved task
Employee completed task

5. COO Dashboard

Focus on operational management.

Show:

Department performance

Active projects

Overdue tasks

Blocked tasks

Team workload

Upcoming deadlines

Allow COO to:

Assign tasks to HODs

Create cross-department tasks

Monitor departments

Reassign tasks

Escalate overdue work

6. HOD Dashboard

HOD should see their department.

Show:

Department completion

Team members

Active tasks

Overdue tasks

Blocked tasks

Upcoming deadlines

Include employee workload.

Example:

Ahmed
12 active tasks
85% completion

Ali
8 active tasks
92% completion

Usman
14 active tasks
76% completion

HOD can:

Create tasks

Assign tasks

Assign subtasks

Approve completed tasks

Reject submitted work

Monitor team workload

7. Employee Dashboard

Keep the employee dashboard simple.

Show:

My Tasks

Today
Tomorrow
Upcoming
Overdue

Each task should show:

Title

Project

Priority

Due date

Status

Progress

Include a progress overview.

Example:

Weekly Progress
80%

Completed 8
In Progress 3
Overdue 1

8. Task Management

Create a full task management system.

Task fields:

Task title

Description

Creator

Assignee

Department

Project

Priority

Status

Start date

Due date

Estimated hours

Attachments

Subtasks

Dependencies

Comments

Statuses:

Backlog
Assigned
Accepted
In Progress
Blocked
Submitted for Review
Rejected
Approved
Completed

Priorities:

Critical
High
Medium
Low

9. Task Details Page

Create a polished task details interface.

Left side:

Task title
Description
Subtasks
Attachments
Comments

Right side:

Status
Priority
Assignee
Created by
Department
Project
Start date
Due date

Bottom:

Activity timeline.

Example:

13:42
HOD assigned task to Ali

13:48
Ali accepted task

14:10
Ali changed status to In Progress

16:32
Ali submitted task

17:01
HOD approved task

10. Task Views

Provide multiple views.

List View

Columns:

Task
Assignee
Project
Priority
Status
Due Date

Kanban View

Columns:

Backlog
Assigned
In Progress
Review
Completed

Calendar View

Show tasks according to deadlines.

My Tasks

Personal task-focused view.

Allow filtering by:

Status

Priority

Department

Assignee

Project

Due date

11. Projects

Create a project management section.

Project card:

Project name
Description
Owner
Team
Progress
Deadline
Task count

Project details should include:

Overview
Tasks
Kanban
Calendar
Members
Files
Activity

Example project:

Website Redesign

Progress 72%

25 Tasks
18 Completed
5 In Progress
1 Blocked
1 Overdue

12. Subtasks

Tasks should support nested subtasks.

Example:

Build Website

Design homepage

Build frontend

Implement authentication

Integrate API

Testing

Deployment

Show completion:

4 / 6 completed

13. Task Dependencies

Support dependencies.

Example:

Design Homepage
↓
Frontend Development
↓
Backend Integration
↓
Testing
↓
Deployment

Show blocked tasks clearly.

14. Departments

Create a department management section.

Departments:

Development
Marketing
Sales
HR
Finance
Design

Each department page should show:

Department head

Team members

Active projects

Tasks

Completion rate

Overdue tasks

Workload

15. Teams

Create team pages.

Show:

Team members
Roles
Current workload
Projects
Tasks
Performance

16. Organization Chart

Create a visual organization hierarchy.

Example:

CEO

↓
COO

↓
HOD Development
HOD Marketing
HOD HR

↓
Team Leads

↓
Employees

Make this interactive.

Clicking a person should open their profile and responsibilities.

17. Role-Based Permissions

Implement proper RBAC.

CEO:

Full organization access

Assign tasks to anyone

View all departments

View reports

Manage users

Manage roles

COO:

Manage departments

Assign tasks to HODs

View organization operations

View reports

HOD:

Manage own department

Assign department tasks

Manage team workload

Approve/reject submissions

Team Lead:

Manage own team

Assign team tasks

Review team work

Employee:

View assigned tasks

Update task status

Add comments

Upload files

Submit work

Do not expose actions outside a user's permission level.

18. Notifications

Create a notification center.

Notification types:

Task assigned
Task reassigned
Task due soon
Task overdue
Task blocked
Task submitted
Task approved
Task rejected
New comment
Mention

Use notification badges.

19. Slack Integration

Create a dedicated Slack integration section.

The system should support connecting an organization's Slack workspace.

Allow administrators to map departments to Slack channels.

Example:

Development
→ #development

Marketing
→ #marketing

HR
→ #hr

Management
→ #management

When a task is assigned, send a Slack notification.

Example:

New Task Assigned

Task:
Implement Payment Gateway

Assigned to:
Ahmed

Assigned by:
HOD Development

Priority:
High

Due:
20 August

View Task

Use Slack-style notification cards inside the application as well.

20. Slack Two-Way Workflow

Design the architecture so Slack actions can update tasks.

Examples:

Mark Complete
Start Task
View Task
Add Comment

When an employee clicks "Mark Complete" in Slack, the corresponding task status should update in the application.

Also support slash-command concepts such as:

/task my
/task create
/task overdue
/task status

If real Slack credentials are unavailable during development, create a realistic Slack integration UI and mock integration service.

Do not pretend a real Slack connection exists.

21. Reports

Create a professional reports section.

Reports:

Organization Performance
Department Performance
Employee Workload
Task Completion
Overdue Tasks
Project Progress
Productivity Trends

Use:

Line charts

Bar charts

Donut charts

KPI cards

Tables

Keep charts clean and readable.

22. Employee Profile

Create employee profile pages.

Show:

Name
Role
Department
Team
Manager
Active Tasks
Completed Tasks
Completion Rate
Current Projects

Activity timeline:

Assigned task
Completed task
Submitted work
Commented
Joined project

23. Search

Create global search.

Search:

Tasks
Projects
Employees
Departments
Teams

Use keyboard-friendly search.

Add a command palette style interface.

Example:

Ctrl + K

Search or run actions.

24. Activity Log

Create an organization activity page.

Examples:

CEO created project
COO assigned task
HOD changed priority
Ahmed started task
Ali submitted task
HOD approved task

Include:

User
Action
Object
Timestamp

25. Authentication

Create:

Login
Register
Forgot Password
Reset Password

After login, route users to the correct dashboard based on their role.

Use realistic demo accounts for development:

CEO
COO
HOD
Team Lead
Employee

26. Settings

Create settings pages for:

Profile
Organization
Users
Roles
Departments
Teams
Notifications
Slack Integration
Security
Appearance

27. Demo Data

Populate the application with realistic demo data.

Organization:

Zeploy Technologies

Departments:

Development
Marketing
Sales
HR
Finance

Users:

CEO
COO
HOD Development
HOD Marketing
HOD HR
Team Leads
Employees

Projects:

Website Redesign
Mobile Application
Marketing Campaign
Recruitment Drive
Internal CRM

Create enough tasks to make dashboards look realistic.

28. Technical Direction

Prefer:

React
TypeScript
Tailwind CSS
shadcn/ui
Lucide icons

Use reusable components.

Create a proper component architecture.

Do not put everything into one large component.

Use mock data initially if backend integration is unavailable.

Keep the data layer structured so a real backend can replace mock data later.

29. Important UI Requirement

The application should look finished.

Do not create empty placeholder pages.

Every major page should contain realistic data and useful interactions.

Buttons should have meaningful behavior.

Tables should support filtering.

Cards should open relevant pages.

Dropdowns should work.

Dialogs should work.

Tabs should work.

Navigation should work.

Task creation should work.

Task assignment should work.

Status changes should work.

Use realistic loading, empty, and error states.

30. Overall Design Standard

The final result should look like a premium modern SaaS product.

Think:

Linear
ClickUp
Asana
Monday.com
Notion
Slack

But do not copy their branding or UI directly.

Create an original design system.

The most important screens are:

CEO Dashboard

COO Dashboard

HOD Dashboard

Employee Dashboard

Task List

Kanban Board

Task Details

Project Details

Department Dashboard

Team Dashboard

Organization Chart

Reports

Slack Integration

Notifications

User Management

Build these screens with consistent spacing, typography, components, interactions, and responsive behavior.

Start by building the complete frontend experience with realistic demo data. Prioritize visual quality and usability before backend integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f0850662-3eb4-40a6-a7df-6670ccb833c0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
