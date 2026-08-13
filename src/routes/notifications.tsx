import { createFileRoute, Link } from "@tanstack/react-router";
import { BellOff } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { relativeTime } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · Zeploy" },
      { name: "description", content: "Assignment, approval and deadline alerts for your account." },
      { property: "og:title", content: "Notifications · Zeploy" },
      { property: "og:description", content: "Assignment, approval and deadline alerts." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, currentUser, markNotificationRead, markAllNotificationsRead } = useApp();
  const mine = notifications.filter((n) => n.userId === currentUser.id);
  const unread = mine.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`${unread} unread of ${mine.length}`}
        actions={
          mine.length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
              Mark all as read
            </Button>
          )
        }
      />
      <Section bodyClassName="p-0">
        {mine.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={BellOff} title="No notifications" description="You're all clear." />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {mine.map((n) => (
              <li key={n.id}>
                <Link
                  to="/tasks/$taskId"
                  params={{ taskId: n.taskId ?? "" }}
                  onClick={() => markNotificationRead(n.id)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-accent/40",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      n.read ? "bg-border" : "bg-primary",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{n.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{n.body}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {relativeTime(n.at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
