import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/slack")({
  component: SlackPage,
});

function SlackPage() {
  return null;
}
