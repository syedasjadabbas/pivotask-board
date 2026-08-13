import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { priorityTone } from "@/data/constants";
import { TODAY } from "@/data/mock";
import type { Task } from "@/data/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function CalendarView({ tasks }: { tasks: Task[] }) {
  const [offset, setOffset] = useState(0);
  const base = new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth() + offset, 1));

  const cells = useMemo(() => {
    const first = new Date(base);
    const startWeekday = (first.getUTCDay() + 6) % 7;
    const daysInMonth = new Date(
      Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0),
    ).getUTCDate();
    const list: { date: Date | null }[] = [];
    for (let i = 0; i < startWeekday; i += 1) list.push({ date: null });
    for (let d = 1; d <= daysInMonth; d += 1) {
      list.push({ date: new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), d)) });
    }
    return list;
  }, [base]);

  const byDay = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      const key = t.dueDate.slice(0, 10);
      (map[key] ??= []).push(t);
    });
    return map;
  }, [tasks]);

  const todayKey = toKey(TODAY);

  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-semibold">
          {base.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setOffset((o) => o - 1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOffset(0)}>
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setOffset((o) => o + 1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-border bg-secondary/60">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          if (!cell.date) return <div key={`empty-${i}`} className="min-h-28 border-b border-r border-border/60 bg-muted/30" />;
          const key = toKey(cell.date);
          const dayTasks = byDay[key] ?? [];
          const isToday = key === todayKey;
          return (
            <div
              key={key}
              className={cn(
                "min-h-28 space-y-1 border-b border-r border-border/60 p-1.5",
                isToday && "bg-primary/5",
              )}
            >
              <span
                className={cn(
                  "num inline-grid size-6 place-items-center rounded-full text-xs",
                  isToday ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {cell.date.getUTCDate()}
              </span>
              {dayTasks.slice(0, 3).map((t) => (
                <Link
                  key={t.id}
                  to="/tasks/$taskId"
                  params={{ taskId: t.id }}
                  className={cn(
                    "block truncate rounded border px-1.5 py-0.5 text-[11px] font-medium",
                    priorityTone[t.priority],
                  )}
                  title={t.title}
                >
                  {t.title}
                </Link>
              ))}
              {dayTasks.length > 3 && (
                <p className="px-1 text-[10px] text-muted-foreground">
                  +{dayTasks.length - 3} more
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
