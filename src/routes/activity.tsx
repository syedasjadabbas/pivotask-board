import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  return null;
}
