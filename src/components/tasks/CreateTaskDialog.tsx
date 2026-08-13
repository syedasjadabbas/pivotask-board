import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITIES } from "@/data/constants";
import type { Priority } from "@/data/types";
import { dayOffset } from "@/data/mock";
import { assignableUsers } from "@/lib/permissions";
import { useApp } from "@/lib/store";

export function CreateTaskDialog({
  trigger,
  defaultProjectId,
  defaultAssigneeId,
}: {
  trigger: ReactNode;
  defaultProjectId?: string;
  defaultAssigneeId?: string;
}) {
  const { users, projects, departments, currentUser, createTask } = useApp();
  const candidates = assignableUsers(currentUser, users);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState(
    defaultAssigneeId ?? candidates[0]?.id ?? "",
  );
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]!.id);
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState(dayOffset(7, 17).slice(0, 10));
  const [hours, setHours] = useState("8");
  const [error, setError] = useState<string | null>(null);

  const assignee = users.find((u) => u.id === assigneeId);

  function submit() {
    if (!title.trim()) return setError("A task title is required.");
    if (!assignee) return setError("Choose an assignee.");
    setError(null);
    createTask({
      title: title.trim(),
      description: description.trim() || "No description provided yet.",
      assigneeId,
      projectId,
      departmentId:
        assignee.departmentId ?? projects.find((p) => p.id === projectId)!.departmentId,
      priority,
      dueDate: new Date(`${dueDate}T17:00:00.000Z`).toISOString(),
      estimatedHours: Number(hours) || 8,
    });
    setOpen(false);
    setTitle("");
    setDescription("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Assign work within your permission scope. A Slack notification is posted to the
            mapped department channel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              placeholder="Implement payment gateway"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              rows={3}
              value={description}
              placeholder="Context, acceptance criteria, links…"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a person" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} · {u.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-due">Due date</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-hours">Estimated hours</Label>
              <Input
                id="task-hours"
                type="number"
                min={1}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Department</Label>
              <Input
                readOnly
                value={
                  departments.find((d) => d.id === assignee?.departmentId)?.name ??
                  "Derived from assignee"
                }
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Create task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
