import type {
  ActivityEntry,
  Department,
  Notification,
  Project,
  SlackMessage,
  Task,
  Team,
  User,
  TaskStatus,
  Priority,
} from "./types";
import { PRIORITIES, STATUSES } from "./constants";

/** Deterministic PRNG so the demo data is identical on server and client. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** Fixed "today" keeps SSR and client markup identical. */
export const TODAY = new Date("2026-08-13T09:00:00.000Z");

export function dayOffset(days: number, hour = 12): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const ORGANIZATION = {
  name: "Zeploy Technologies",
  plan: "Enterprise",
  slackWorkspace: "zeploy-hq",
};

export const departments: Department[] = [
  {
    id: "d-dev",
    name: "Development",
    headId: "u3",
    slackChannel: "#development",
    description: "Platform engineering, mobile and internal tooling.",
  },
  {
    id: "d-mkt",
    name: "Marketing",
    headId: "u4",
    slackChannel: "#marketing",
    description: "Brand, demand generation and product marketing.",
  },
  {
    id: "d-sales",
    name: "Sales",
    headId: "u5",
    slackChannel: "#sales",
    description: "Enterprise pipeline, partnerships and renewals.",
  },
  {
    id: "d-hr",
    name: "HR",
    headId: "u6",
    slackChannel: "#hr",
    description: "Talent acquisition, people operations and culture.",
  },
  {
    id: "d-fin",
    name: "Finance",
    headId: "u7",
    slackChannel: "#finance",
    description: "Budgeting, procurement and financial reporting.",
  },
  {
    id: "d-des",
    name: "Design",
    headId: "u8",
    slackChannel: "#design",
    description: "Product design, design systems and brand craft.",
  },
];

export const teams: Team[] = [
  { id: "t-fe", name: "Frontend Guild", departmentId: "d-dev", leadId: "u9" },
  { id: "t-be", name: "Platform & API", departmentId: "d-dev", leadId: "u10" },
  { id: "t-growth", name: "Growth", departmentId: "d-mkt", leadId: "u11" },
  { id: "t-sdr", name: "Enterprise Sales", departmentId: "d-sales", leadId: "u12" },
  { id: "t-people", name: "People Ops", departmentId: "d-hr", leadId: "u13" },
  { id: "t-acct", name: "Accounting", departmentId: "d-fin", leadId: "u14" },
  { id: "t-des", name: "Product Design", departmentId: "d-des", leadId: "u8" },
];

const c = [
  "oklch(0.52 0.16 258)",
  "oklch(0.6 0.13 155)",
  "oklch(0.72 0.15 72)",
  "oklch(0.6 0.19 25)",
  "oklch(0.63 0.11 200)",
  "oklch(0.55 0.14 300)",
];

export const users: User[] = [
  {
    id: "u1",
    name: "Imran Zeb",
    email: "imran.zeb@zeploy.com",
    role: "CEO",
    departmentId: null,
    teamId: null,
    managerId: null,
    title: "Chief Executive Officer",
    avatarColor: c[0]!,
    joined: "2019-02-01",
  },
  {
    id: "u2",
    name: "Sana Malik",
    email: "sana.malik@zeploy.com",
    role: "COO",
    departmentId: null,
    teamId: null,
    managerId: "u1",
    title: "Chief Operating Officer",
    avatarColor: c[1]!,
    joined: "2019-08-12",
  },
  {
    id: "u3",
    name: "Bilal Ahmed",
    email: "bilal.ahmed@zeploy.com",
    role: "HOD",
    departmentId: "d-dev",
    teamId: null,
    managerId: "u2",
    title: "Head of Development",
    avatarColor: c[2]!,
    joined: "2020-01-06",
  },
  {
    id: "u4",
    name: "Hira Naveed",
    email: "hira.naveed@zeploy.com",
    role: "HOD",
    departmentId: "d-mkt",
    teamId: null,
    managerId: "u2",
    title: "Head of Marketing",
    avatarColor: c[3]!,
    joined: "2020-03-16",
  },
  {
    id: "u5",
    name: "Faisal Khan",
    email: "faisal.khan@zeploy.com",
    role: "HOD",
    departmentId: "d-sales",
    teamId: null,
    managerId: "u2",
    title: "Head of Sales",
    avatarColor: c[4]!,
    joined: "2020-06-01",
  },
  {
    id: "u6",
    name: "Nida Rauf",
    email: "nida.rauf@zeploy.com",
    role: "HOD",
    departmentId: "d-hr",
    teamId: null,
    managerId: "u2",
    title: "Head of HR",
    avatarColor: c[5]!,
    joined: "2020-09-21",
  },
  {
    id: "u7",
    name: "Omar Siddiqui",
    email: "omar.siddiqui@zeploy.com",
    role: "HOD",
    departmentId: "d-fin",
    teamId: null,
    managerId: "u2",
    title: "Head of Finance",
    avatarColor: c[1]!,
    joined: "2021-01-11",
  },
  {
    id: "u8",
    name: "Zara Sheikh",
    email: "zara.sheikh@zeploy.com",
    role: "HOD",
    departmentId: "d-des",
    teamId: "t-des",
    managerId: "u2",
    title: "Head of Design",
    avatarColor: c[0]!,
    joined: "2021-04-05",
  },
  {
    id: "u9",
    name: "Ahmed Raza",
    email: "ahmed.raza@zeploy.com",
    role: "Team Lead",
    departmentId: "d-dev",
    teamId: "t-fe",
    managerId: "u3",
    title: "Frontend Lead",
    avatarColor: c[2]!,
    joined: "2021-05-17",
  },
  {
    id: "u10",
    name: "Ali Hassan",
    email: "ali.hassan@zeploy.com",
    role: "Team Lead",
    departmentId: "d-dev",
    teamId: "t-be",
    managerId: "u3",
    title: "Platform Lead",
    avatarColor: c[3]!,
    joined: "2021-07-19",
  },
  {
    id: "u11",
    name: "Maria Iqbal",
    email: "maria.iqbal@zeploy.com",
    role: "Team Lead",
    departmentId: "d-mkt",
    teamId: "t-growth",
    managerId: "u4",
    title: "Growth Lead",
    avatarColor: c[4]!,
    joined: "2021-09-02",
  },
  {
    id: "u12",
    name: "Kamran Tariq",
    email: "kamran.tariq@zeploy.com",
    role: "Team Lead",
    departmentId: "d-sales",
    teamId: "t-sdr",
    managerId: "u5",
    title: "Enterprise Sales Lead",
    avatarColor: c[5]!,
    joined: "2022-01-10",
  },
  {
    id: "u13",
    name: "Sadia Noor",
    email: "sadia.noor@zeploy.com",
    role: "Team Lead",
    departmentId: "d-hr",
    teamId: "t-people",
    managerId: "u6",
    title: "People Ops Lead",
    avatarColor: c[0]!,
    joined: "2022-02-14",
  },
  {
    id: "u14",
    name: "Hamza Yousaf",
    email: "hamza.yousaf@zeploy.com",
    role: "Team Lead",
    departmentId: "d-fin",
    teamId: "t-acct",
    managerId: "u7",
    title: "Accounting Lead",
    avatarColor: c[1]!,
    joined: "2022-03-28",
  },
  {
    id: "u15",
    name: "Usman Javed",
    email: "usman.javed@zeploy.com",
    role: "Employee",
    departmentId: "d-dev",
    teamId: "t-fe",
    managerId: "u9",
    title: "Senior Frontend Engineer",
    avatarColor: c[2]!,
    joined: "2022-05-09",
  },
  {
    id: "u16",
    name: "Ayesha Siddiq",
    email: "ayesha.siddiq@zeploy.com",
    role: "Employee",
    departmentId: "d-dev",
    teamId: "t-fe",
    managerId: "u9",
    title: "Frontend Engineer",
    avatarColor: c[3]!,
    joined: "2022-08-15",
  },
  {
    id: "u17",
    name: "Hassan Raza",
    email: "hassan.raza@zeploy.com",
    role: "Employee",
    departmentId: "d-dev",
    teamId: "t-be",
    managerId: "u10",
    title: "Backend Engineer",
    avatarColor: c[4]!,
    joined: "2022-10-03",
  },
  {
    id: "u18",
    name: "Fatima Noor",
    email: "fatima.noor@zeploy.com",
    role: "Employee",
    departmentId: "d-dev",
    teamId: "t-be",
    managerId: "u10",
    title: "QA Engineer",
    avatarColor: c[5]!,
    joined: "2023-01-16",
  },
  {
    id: "u19",
    name: "Danish Alam",
    email: "danish.alam@zeploy.com",
    role: "Employee",
    departmentId: "d-mkt",
    teamId: "t-growth",
    managerId: "u11",
    title: "Content Strategist",
    avatarColor: c[0]!,
    joined: "2023-02-20",
  },
  {
    id: "u20",
    name: "Rabia Aslam",
    email: "rabia.aslam@zeploy.com",
    role: "Employee",
    departmentId: "d-mkt",
    teamId: "t-growth",
    managerId: "u11",
    title: "Performance Marketer",
    avatarColor: c[1]!,
    joined: "2023-04-11",
  },
  {
    id: "u21",
    name: "Talha Munir",
    email: "talha.munir@zeploy.com",
    role: "Employee",
    departmentId: "d-sales",
    teamId: "t-sdr",
    managerId: "u12",
    title: "Account Executive",
    avatarColor: c[2]!,
    joined: "2023-06-05",
  },
  {
    id: "u22",
    name: "Mehwish Anwar",
    email: "mehwish.anwar@zeploy.com",
    role: "Employee",
    departmentId: "d-sales",
    teamId: "t-sdr",
    managerId: "u12",
    title: "Sales Development Rep",
    avatarColor: c[3]!,
    joined: "2023-09-18",
  },
  {
    id: "u23",
    name: "Bushra Kamal",
    email: "bushra.kamal@zeploy.com",
    role: "Employee",
    departmentId: "d-hr",
    teamId: "t-people",
    managerId: "u13",
    title: "Talent Partner",
    avatarColor: c[4]!,
    joined: "2023-11-27",
  },
  {
    id: "u24",
    name: "Zeeshan Akram",
    email: "zeeshan.akram@zeploy.com",
    role: "Employee",
    departmentId: "d-fin",
    teamId: "t-acct",
    managerId: "u14",
    title: "Financial Analyst",
    avatarColor: c[5]!,
    joined: "2024-01-22",
  },
  {
    id: "u25",
    name: "Iqra Shah",
    email: "iqra.shah@zeploy.com",
    role: "Employee",
    departmentId: "d-des",
    teamId: "t-des",
    managerId: "u8",
    title: "Product Designer",
    avatarColor: c[0]!,
    joined: "2024-03-04",
  },
  {
    id: "u26",
    name: "Saad Bhatti",
    email: "saad.bhatti@zeploy.com",
    role: "Employee",
    departmentId: "d-des",
    teamId: "t-des",
    managerId: "u8",
    title: "Brand Designer",
    avatarColor: c[1]!,
    joined: "2024-05-13",
  },
];

export const projects: Project[] = [
  {
    id: "p-web",
    name: "Website Redesign",
    description:
      "Rebuild the marketing site on the new design system with a headless CMS and faster page loads.",
    ownerId: "u3",
    departmentId: "d-dev",
    deadline: dayOffset(34),
    startDate: dayOffset(-58),
    status: "On Track",
  },
  {
    id: "p-mob",
    name: "Mobile Application",
    description:
      "Ship the v1 iOS and Android client with offline task sync and push notifications.",
    ownerId: "u10",
    departmentId: "d-dev",
    deadline: dayOffset(61),
    startDate: dayOffset(-40),
    status: "At Risk",
  },
  {
    id: "p-cmp",
    name: "Marketing Campaign",
    description: "Q3 demand generation campaign across paid, lifecycle and partner channels.",
    ownerId: "u4",
    departmentId: "d-mkt",
    deadline: dayOffset(19),
    startDate: dayOffset(-30),
    status: "On Track",
  },
  {
    id: "p-rec",
    name: "Recruitment Drive",
    description: "Hire 14 roles across engineering, design and sales before the end of the quarter.",
    ownerId: "u6",
    departmentId: "d-hr",
    deadline: dayOffset(45),
    startDate: dayOffset(-25),
    status: "On Track",
  },
  {
    id: "p-crm",
    name: "Internal CRM",
    description: "Replace the legacy spreadsheet pipeline with an internal CRM tied to billing.",
    ownerId: "u5",
    departmentId: "d-sales",
    deadline: dayOffset(-4),
    startDate: dayOffset(-90),
    status: "Delayed",
  },
  {
    id: "p-fin",
    name: "FY26 Budget Planning",
    description: "Department budget consolidation, vendor review and board reporting pack.",
    ownerId: "u7",
    departmentId: "d-fin",
    deadline: dayOffset(27),
    startDate: dayOffset(-18),
    status: "On Track",
  },
];

const titlesByDept: Record<string, string[]> = {
  "d-dev": [
    "Implement payment gateway",
    "Refactor authentication service",
    "Fix checkout race condition",
    "Add offline task sync",
    "Optimise dashboard queries",
    "Set up end-to-end test suite",
    "Migrate CI pipeline to new runners",
    "Build notification service",
    "Harden API rate limiting",
    "Ship design tokens package",
    "Instrument error monitoring",
    "Write API integration docs",
  ],
  "d-mkt": [
    "Launch Q3 paid search campaign",
    "Publish product launch blog",
    "Refresh customer case studies",
    "Build lifecycle email sequence",
    "Run webinar with partner",
    "Update messaging framework",
    "Audit SEO landing pages",
    "Design campaign creative set",
  ],
  "d-sales": [
    "Migrate pipeline to internal CRM",
    "Prepare enterprise proposal deck",
    "Run renewal outreach batch",
    "Qualify inbound demo requests",
    "Update pricing calculator",
    "Close Q3 partner agreement",
  ],
  "d-hr": [
    "Screen senior engineer applicants",
    "Roll out onboarding checklist",
    "Schedule performance review cycle",
    "Update employee handbook",
    "Plan quarterly offsite",
    "Publish four open roles",
  ],
  "d-fin": [
    "Consolidate department budgets",
    "Review vendor contracts",
    "Close monthly books",
    "Prepare board reporting pack",
    "Automate expense approvals",
  ],
  "d-des": [
    "Design homepage concepts",
    "Update component library",
    "Prototype mobile onboarding",
    "Run usability review",
    "Refresh brand illustration set",
  ],
};

const subtaskPool = [
  "Draft the approach",
  "Review with the team lead",
  "Implement first pass",
  "Handle edge cases",
  "Write tests",
  "Prepare handover notes",
  "Ship to staging",
];

const commentPool = [
  "Picked this up — will share an update by end of day.",
  "Blocked on the API contract, following up with the platform team.",
  "Latest revision is ready for review.",
  "Nice work here, only small copy changes needed.",
  "Pushed the fix, waiting on the pipeline to go green.",
  "Can we move the deadline by two days? Scope grew slightly.",
];

const attachmentPool = [
  { name: "requirements.pdf", size: "412 KB", kind: "PDF" },
  { name: "wireframes-v3.fig", size: "2.1 MB", kind: "Figma" },
  { name: "api-contract.json", size: "18 KB", kind: "JSON" },
  { name: "budget-sheet.xlsx", size: "96 KB", kind: "Sheet" },
];

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length) % arr.length]!;
}

function buildTasks(): Task[] {
  const rand = makeRandom(20260813);
  const out: Task[] = [];
  const assignablePerDept: Record<string, User[]> = {};
  for (const d of departments) {
    const members = users.filter((u) => u.departmentId === d.id && u.role !== "HOD");
    assignablePerDept[d.id] = members.length
      ? members
      : users.filter((u) => u.departmentId === d.id);
  }

  let n = 0;
  for (const dept of departments) {
    const pool = titlesByDept[dept.id]!;
    const deptProjects = projects.filter(
      (p) => p.departmentId === dept.id || rand() > 0.75,
    );
    const count = dept.id === "d-dev" ? 42 : dept.id === "d-mkt" ? 24 : 16;
    for (let i = 0; i < count; i++) {
      n++;
      const assignee = pick(rand, assignablePerDept[dept.id]!);
      const creator =
        rand() > 0.7 ? users.find((u) => u.id === dept.headId)! : users.find((u) => u.id === (assignee.managerId ?? dept.headId))!;
      const status: TaskStatus = weightedStatus(rand);
      const dueIn = Math.floor(rand() * 34) - 12;
      const priority: Priority = weightedPriority(rand);
      const subCount = 2 + Math.floor(rand() * 4);
      const subs = Array.from({ length: subCount }, (_, k) => ({
        id: `st-${n}-${k}`,
        title: subtaskPool[(i + k) % subtaskPool.length]!,
        done:
          status === "Completed" || status === "Approved"
            ? true
            : rand() > 0.45,
      }));
      const progress =
        status === "Completed" || status === "Approved"
          ? 100
          : status === "Backlog" || status === "Assigned"
            ? 0
            : Math.round((subs.filter((s) => s.done).length / subs.length) * 100);
      const project = pick(rand, deptProjects.length ? deptProjects : projects);
      const createdAt = dayOffset(-20 - Math.floor(rand() * 30), 9);
      const title = `${pool[i % pool.length]}${i >= pool.length ? ` (phase ${Math.floor(i / pool.length) + 1})` : ""}`;

      const comments = Array.from(
        { length: Math.floor(rand() * 3) },
        (_, k) => ({
          id: `c-${n}-${k}`,
          authorId: k % 2 === 0 ? assignee.id : creator.id,
          body: pick(rand, commentPool),
          at: dayOffset(-Math.floor(rand() * 6), 10 + k),
        }),
      );

      out.push({
        id: `task-${n}`,
        key: `ZPL-${100 + n}`,
        title,
        description: `${title}. Coordinate with ${creator.name} and keep the ${dept.name.toLowerCase()} channel updated on progress. Definition of done is agreed in the project brief.`,
        creatorId: creator.id,
        assigneeId: assignee.id,
        departmentId: dept.id,
        projectId: project.id,
        priority,
        status,
        startDate: dayOffset(-Math.floor(rand() * 14), 9),
        dueDate: dayOffset(dueIn, 17),
        estimatedHours: [2, 4, 6, 8, 12, 16, 24][Math.floor(rand() * 7)]!,
        progress,
        subtasks: subs,
        dependsOn: [],
        comments,
        attachments:
          rand() > 0.6 ? [{ id: `a-${n}`, ...pick(rand, attachmentPool) }] : [],
        activity: [],
        createdAt,
      });
    }
  }

  // Dependency chains inside the Website Redesign project.
  const webTasks = out.filter((t) => t.projectId === "p-web").slice(0, 5);
  for (let i = 1; i < webTasks.length; i++) {
    webTasks[i]!.dependsOn = [webTasks[i - 1]!.id];
  }

  // Seeded activity timeline per task.
  for (const t of out) {
    const creator = users.find((u) => u.id === t.creatorId)!;
    const assignee = users.find((u) => u.id === t.assigneeId)!;
    const entries: ActivityEntry[] = [
      {
        id: `${t.id}-a1`,
        actorId: creator.id,
        action: `created the task and assigned it to ${assignee.name}`,
        objectType: "task",
        objectId: t.id,
        objectLabel: t.title,
        at: t.createdAt,
      },
    ];
    const order = STATUSES.indexOf(t.status);
    if (order >= STATUSES.indexOf("Accepted")) {
      entries.push({
        id: `${t.id}-a2`,
        actorId: assignee.id,
        action: "accepted the task",
        objectType: "task",
        objectId: t.id,
        objectLabel: t.title,
        at: dayOffset(-9, 10),
      });
    }
    if (order >= STATUSES.indexOf("In Progress")) {
      entries.push({
        id: `${t.id}-a3`,
        actorId: assignee.id,
        action: "changed status to In Progress",
        objectType: "task",
        objectId: t.id,
        objectLabel: t.title,
        at: dayOffset(-7, 11),
      });
    }
    if (order >= STATUSES.indexOf("Submitted for Review")) {
      entries.push({
        id: `${t.id}-a4`,
        actorId: assignee.id,
        action: "submitted the task for review",
        objectType: "task",
        objectId: t.id,
        objectLabel: t.title,
        at: dayOffset(-3, 16),
      });
    }
    if (t.status === "Approved" || t.status === "Completed") {
      entries.push({
        id: `${t.id}-a5`,
        actorId: creator.id,
        action: "approved the submitted work",
        objectType: "task",
        objectId: t.id,
        objectLabel: t.title,
        at: dayOffset(-2, 17),
      });
    }
    t.activity = entries;
  }

  return out;
}

function weightedStatus(rand: () => number): TaskStatus {
  const r = rand();
  if (r < 0.3) return STATUSES[8]!; // Completed
  if (r < 0.42) return STATUSES[7]!; // Approved
  if (r < 0.62) return STATUSES[3]!; // In Progress
  if (r < 0.7) return STATUSES[5]!; // Submitted for Review
  if (r < 0.76) return STATUSES[4]!; // Blocked
  if (r < 0.8) return STATUSES[6]!; // Rejected
  if (r < 0.9) return STATUSES[1]!; // Assigned
  if (r < 0.95) return STATUSES[2]!; // Accepted
  return STATUSES[0]!;
}

function weightedPriority(rand: () => number): Priority {
  const r = rand();
  if (r < 0.1) return PRIORITIES[0]!;
  if (r < 0.35) return PRIORITIES[1]!;
  if (r < 0.75) return PRIORITIES[2]!;
  return PRIORITIES[3]!;
}

export const tasks: Task[] = buildTasks();

export const activityFeed: ActivityEntry[] = tasks
  .flatMap((t) => t.activity)
  .sort((a, b) => (a.at < b.at ? 1 : -1))
  .slice(0, 60);

export const notifications: Notification[] = tasks.slice(0, 14).map((t, i) => {
  const types: Notification["type"][] = [
    "Task assigned",
    "Task due soon",
    "Task overdue",
    "Task submitted",
    "Task approved",
    "New comment",
    "Task blocked",
    "Mention",
    "Task rejected",
    "Task reassigned",
  ];
  const type = types[i % types.length]!;
  return {
    id: `n-${i + 1}`,
    type,
    title: `${type}: ${t.title}`,
    body: `${users.find((u) => u.id === t.creatorId)!.name} · ${t.key} · ${t.priority} priority`,
    taskId: t.id,
    userId: t.assigneeId,
    at: dayOffset(-Math.floor(i / 3), 9 + (i % 8)),
    read: i > 5,
  };
});

export const slackMessages: SlackMessage[] = tasks.slice(0, 8).map((t, i) => ({
  id: `slack-${i + 1}`,
  channel: departments.find((d) => d.id === t.departmentId)!.slackChannel,
  at: dayOffset(-Math.floor(i / 2), 10 + i),
  title: "New Task Assigned",
  taskId: t.id,
  fields: [
    { label: "Task", value: t.title },
    { label: "Assigned to", value: users.find((u) => u.id === t.assigneeId)!.name },
    { label: "Assigned by", value: users.find((u) => u.id === t.creatorId)!.name },
    { label: "Priority", value: t.priority },
    {
      label: "Due",
      value: new Date(t.dueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
      }),
    },
  ],
}));
