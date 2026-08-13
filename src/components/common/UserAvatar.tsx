import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import type { User } from "@/data/types";

const sizes = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
};

export function UserAvatar({
  user,
  size = "sm",
  className,
}: {
  user: Pick<User, "name" | "avatarColor">;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-card",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: user.avatarColor }}
      aria-hidden
    >
      {initials(user.name)}
    </span>
  );
}

export function AvatarStack({ users, max = 4 }: { users: User[]; max?: number }) {
  const shown = users.slice(0, max);
  const rest = users.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((u) => (
        <UserAvatar key={u.id} user={u} size="xs" />
      ))}
      {rest > 0 && (
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
          +{rest}
        </span>
      )}
    </div>
  );
}
