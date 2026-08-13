import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import {
  ORGANIZATION,
  activityFeed as seedActivity,
  departments,
  notifications as seedNotifications,
  projects,
  slackMessages as seedSlack,
  tasks as seedTasks,
  teams,
  users,
  dayOffset,
} from "@/data/mock";
import type {
  ActivityEntry,
  Notification,
  Priority,
  SlackMessage,
  Task,
  TaskStatus,
  User,
} from "@/data/types";

interface NewTaskInput {
  title: string;
  description: string;
  assigneeId: string;
  projectId: string;
  departmentId: string;
  priority: Priority;
  dueDate: string;
  estimatedHours: number;
}

interface AppContextValue {
  organization: typeof ORGANIZATION;
  users: User[];
  departments: typeof departments;
  teams: typeof teams;
  projects: typeof projects;
  tasks: Task[];
  activity: ActivityEntry[];
  notifications: Notification[];
  slackMessages: SlackMessage[];
  currentUser: User;
  ready: boolean;
  signedIn: boolean;
  signIn: (userId: string) => void;
  signOut: () => void;
  switchUser: (userId: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  slackConnected: boolean;
  setSlackConnected: (v: boolean) => void;
  channelMap: Record<string, string>;
  setChannel: (departmentId: string, channel: string) => void;
  createTask: (input: NewTaskInput) => Task;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTask: (taskId: string, patch: Partial<Task>) => void;
  reassignTask: (taskId: string, assigneeId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (taskId: string, body: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  userById: (id: string | null | undefined) => User | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "zeploy.session.v1";

export function AppProvider({ children }: { children: ReactNode }) {
  const [taskList, setTaskList] = useState<Task[]>(seedTasks);
  const [activity, setActivity] = useState<ActivityEntry[]>(seedActivity);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [slackMessages, setSlackMessages] = useState<SlackMessage[]>(seedSlack);
  const [currentUserId, setCurrentUserId] = useState("u1");
  const [signedIn, setSignedIn] = useState(true);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [slackConnected, setSlackConnected] = useState(true);
  const [channelMap, setChannelMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(departments.map((d) => [d.id, d.slackChannel])),
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          userId?: string;
          theme?: "light" | "dark";
          signedIn?: boolean;
        };
        if (parsed.userId && users.some((u) => u.id === parsed.userId)) {
          setCurrentUserId(parsed.userId);
        }
        if (parsed.theme) setTheme(parsed.theme);
        if (typeof parsed.signedIn === "boolean") setSignedIn(parsed.signedIn);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userId: currentUserId, theme, signedIn }),
    );
  }, [currentUserId, theme, signedIn, ready]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? users[0]!,
    [currentUserId],
  );

  const userById = useCallback(
    (id: string | null | undefined) => users.find((u) => u.id === id),
    [],
  );

  const pushActivity = useCallback((entry: Omit<ActivityEntry, "id" | "at">) => {
    const full: ActivityEntry = {
      ...entry,
      id: `act-${Math.random().toString(36).slice(2, 9)}`,
      at: new Date().toISOString(),
    };
    setActivity((prev) => [full, ...prev]);
    return full;
  }, []);

  const pushSlack = useCallback(
    (message: Omit<SlackMessage, "id" | "at">) => {
      if (!slackConnected) return;
      setSlackMessages((prev) => [
        { ...message, id: `slack-${Math.random().toString(36).slice(2, 9)}`, at: new Date().toISOString() },
        ...prev,
      ]);
    },
    [slackConnected],
  );

  const createTask = useCallback<AppContextValue["createTask"]>(
    (input) => {
      const id = `task-new-${Math.random().toString(36).slice(2, 8)}`;
      const assignee = users.find((u) => u.id === input.assigneeId)!;
      const task: Task = {
        id,
        key: `ZPL-${900 + Math.floor(Math.random() * 99)}`,
        title: input.title,
        description: input.description,
        creatorId: currentUser.id,
        assigneeId: input.assigneeId,
        departmentId: input.departmentId,
        projectId: input.projectId,
        priority: input.priority,
        status: "Assigned",
        startDate: dayOffset(0, 9),
        dueDate: input.dueDate,
        estimatedHours: input.estimatedHours,
        progress: 0,
        subtasks: [],
        dependsOn: [],
        comments: [],
        attachments: [],
        activity: [
          {
            id: `${id}-a1`,
            actorId: currentUser.id,
            action: `created the task and assigned it to ${assignee.name}`,
            objectType: "task",
            objectId: id,
            objectLabel: input.title,
            at: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setTaskList((prev) => [task, ...prev]);
      pushActivity({
        actorId: currentUser.id,
        action: `assigned a task to ${assignee.name}`,
        objectType: "task",
        objectId: id,
        objectLabel: input.title,
      });
      setNotifications((prev) => [
        {
          id: `n-${Math.random().toString(36).slice(2, 8)}`,
          type: "Task assigned",
          title: `Task assigned: ${input.title}`,
          body: `${currentUser.name} · ${input.priority} priority`,
          taskId: id,
          userId: input.assigneeId,
          at: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
      const channel = channelMap[input.departmentId] ?? "#general";
      pushSlack({
        channel,
        title: "New Task Assigned",
        taskId: id,
        fields: [
          { label: "Task", value: input.title },
          { label: "Assigned to", value: assignee.name },
          { label: "Assigned by", value: currentUser.name },
          { label: "Priority", value: input.priority },
          {
            label: "Due",
            value: new Date(input.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
            }),
          },
        ],
      });
      toast.success("Task created", {
        description: slackConnected
          ? `Assigned to ${assignee.name} · posted to ${channel}`
          : `Assigned to ${assignee.name}`,
      });
      return task;
    },
    [currentUser, channelMap, pushActivity, pushSlack, slackConnected],
  );

  const appendTaskActivity = useCallback(
    (taskId: string, action: string) => {
      setTaskList((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                activity: [
                  ...t.activity,
                  {
                    id: `${taskId}-${Math.random().toString(36).slice(2, 8)}`,
                    actorId: currentUser.id,
                    action,
                    objectType: "task" as const,
                    objectId: taskId,
                    objectLabel: t.title,
                    at: new Date().toISOString(),
                  },
                ],
              }
            : t,
        ),
      );
    },
    [currentUser.id],
  );

  const updateTaskStatus = useCallback<AppContextValue["updateTaskStatus"]>(
    (taskId, status) => {
      setTaskList((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status,
                progress:
                  status === "Completed" || status === "Approved"
                    ? 100
                    : status === "In Progress" && t.progress === 0
                      ? 15
                      : t.progress,
              }
            : t,
        ),
      );
      const task = taskList.find((t) => t.id === taskId);
      appendTaskActivity(taskId, `changed status to ${status}`);
      if (task) {
        pushActivity({
          actorId: currentUser.id,
          action: `moved a task to ${status}`,
          objectType: "task",
          objectId: taskId,
          objectLabel: task.title,
        });
        if (status === "Submitted for Review" || status === "Approved" || status === "Blocked") {
          pushSlack({
            channel: channelMap[task.departmentId] ?? "#general",
            title:
              status === "Blocked"
                ? "Task Blocked"
                : status === "Approved"
                  ? "Task Approved"
                  : "Task Submitted for Review",
            taskId,
            fields: [
              { label: "Task", value: task.title },
              { label: "By", value: currentUser.name },
              { label: "Status", value: status },
            ],
          });
        }
      }
      toast.success(`Status updated to ${status}`);
    },
    [appendTaskActivity, channelMap, currentUser.name, currentUser.id, pushActivity, pushSlack, taskList],
  );

  const updateTask = useCallback<AppContextValue["updateTask"]>((taskId, patch) => {
    setTaskList((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
  }, []);

  const reassignTask = useCallback<AppContextValue["reassignTask"]>(
    (taskId, assigneeId) => {
      const assignee = users.find((u) => u.id === assigneeId)!;
      setTaskList((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, assigneeId } : t)),
      );
      appendTaskActivity(taskId, `reassigned the task to ${assignee.name}`);
      toast.success(`Reassigned to ${assignee.name}`);
    },
    [appendTaskActivity],
  );

  const toggleSubtask = useCallback<AppContextValue["toggleSubtask"]>((taskId, subtaskId) => {
    setTaskList((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const subtasks = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, done: !s.done } : s,
        );
        const progress = subtasks.length
          ? Math.round((subtasks.filter((s) => s.done).length / subtasks.length) * 100)
          : t.progress;
        return { ...t, subtasks, progress };
      }),
    );
  }, []);

  const addComment = useCallback<AppContextValue["addComment"]>(
    (taskId, body) => {
      setTaskList((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                comments: [
                  ...t.comments,
                  {
                    id: `c-${Math.random().toString(36).slice(2, 8)}`,
                    authorId: currentUser.id,
                    body,
                    at: new Date().toISOString(),
                  },
                ],
              }
            : t,
        ),
      );
      appendTaskActivity(taskId, "added a comment");
      toast.success("Comment added");
    },
    [appendTaskActivity, currentUser.id],
  );

  const value: AppContextValue = {
    organization: ORGANIZATION,
    users,
    departments,
    teams,
    projects,
    tasks: taskList,
    activity,
    notifications,
    slackMessages,
    currentUser,
    ready,
    signedIn,
    signIn: (userId) => {
      setCurrentUserId(userId);
      setSignedIn(true);
    },
    signOut: () => setSignedIn(false),
    switchUser: (userId) => setCurrentUserId(userId),
    theme,
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    slackConnected,
    setSlackConnected,
    channelMap,
    setChannel: (departmentId, channel) =>
      setChannelMap((prev) => ({ ...prev, [departmentId]: channel })),
    createTask,
    updateTaskStatus,
    updateTask,
    reassignTask,
    toggleSubtask,
    addComment,
    markNotificationRead: (id) =>
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllNotificationsRead: () =>
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    userById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
