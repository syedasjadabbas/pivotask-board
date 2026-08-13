import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  return null;
}
