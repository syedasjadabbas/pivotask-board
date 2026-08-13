import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { visibleTasks, visibleUsers } from "@/lib/permissions";
import { useApp } from "@/lib/store";
import { navForRole } from "./nav";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const { tasks, users, projects, departments, currentUser, toggleTheme } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const myTasks = visibleTasks(currentUser, tasks, users).slice(0, 6);
  const people = visibleUsers(currentUser, users).slice(0, 6);
  const nav = navForRole(currentUser.role);

  function go(to: string, params?: Record<string, string>) {
    onOpenChange(false);
    void navigate({ to, params } as never);
  }

  if (!mounted) return null;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tasks, projects, people or run an action…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {nav.map((item) => (
            <CommandItem key={item.to} value={`go ${item.label}`} onSelect={() => go(item.to)}>
              <item.icon className="size-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tasks">
          {myTasks.map((t) => (
            <CommandItem
              key={t.id}
              value={`task ${t.title} ${t.key}`}
              onSelect={() => go("/tasks/$taskId", { taskId: t.id })}
            >
              <span className="num text-xs text-muted-foreground">{t.key}</span>
              {t.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={`project ${p.name}`}
              onSelect={() => go("/projects/$projectId", { projectId: p.id })}
            >
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="People">
          {people.map((u) => (
            <CommandItem
              key={u.id}
              value={`person ${u.name} ${u.title}`}
              onSelect={() => go("/users/$userId", { userId: u.id })}
            >
              {u.name}
              <span className="ml-auto text-xs text-muted-foreground">{u.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Departments">
          {departments.map((d) => (
            <CommandItem
              key={d.id}
              value={`department ${d.name}`}
              onSelect={() => go("/departments/$deptId", { deptId: d.id })}
            >
              {d.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="toggle theme appearance" onSelect={() => {
            toggleTheme();
            onOpenChange(false);
          }}>
            Toggle light / dark appearance
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
