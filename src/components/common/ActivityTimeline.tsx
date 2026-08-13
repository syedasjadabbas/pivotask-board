import type { ActivityEntry } from "@/data/types";
import { fmtShort, fmtTime } from "@/lib/format";
import { useApp } from "@/lib/store";
import { UserAvatar } from "./UserAvatar";

export function ActivityTimeline({
  entries,
  showDate = false,
}: {
  entries: ActivityEntry[];
  showDate?: boolean;
}) {
  const { userById } = useApp();
  return (
    <ol className="relative space-y-5 pl-1">
      {entries.map((entry, i) => {
        const actor = userById(entry.actorId);
        return (
          <li key={entry.id} className="relative flex gap-3">
            {i < entries.length - 1 && (
              <span className="absolute left-4 top-9 h-[calc(100%-0.5rem)] w-px bg-border" />
            )}
            {actor ? (
              <UserAvatar user={actor} size="sm" />
            ) : (
              <span className="size-8 rounded-full bg-muted" />
            )}
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-sm leading-relaxed">
                <span className="font-medium">{actor?.name ?? "System"}</span>{" "}
                <span className="text-muted-foreground">{entry.action}</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {showDate && `${fmtShort(entry.at)} · `}
                {fmtTime(entry.at)} · {entry.objectLabel}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
