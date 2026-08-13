import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronsUpDown,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  LogOut,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { can } from "@/lib/permissions";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./CommandPalette";
import { navForRole, type NavItem } from "./nav";

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups: NavItem["group"][] = ["Workspace", "Organization", "System"];

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {groups.map((group) => {
        const groupItems = items.filter((i) => i.group === group);
        if (!groupItems.length) return null;
        return (
          <div key={group}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group}
            </p>
            <ul className="space-y-0.5">
              {groupItems.map((item) => {
                const active =
                  item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon
                        className={cn("size-4", active && "text-sidebar-primary")}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Brand() {
  const { organization } = useApp();
  return (
    <Link to="/" className="flex items-center gap-2.5 px-5 py-4">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        Z
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold">{organization.name}</span>
        <span className="block text-[11px] text-muted-foreground">
          {organization.plan} workspace
        </span>
      </span>
    </Link>
  );
}

function UserFooter() {
  const { currentUser, users, switchUser, signOut, departments } = useApp();
  const dept = departments.find((d) => d.id === currentUser.departmentId);
  const demoAccounts = useMemo(
    () => ["u1", "u2", "u3", "u9", "u15"].map((id) => users.find((u) => u.id === id)!),
    [users],
  );

  return (
    <div className="border-t border-sidebar-border p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent/70">
            <UserAvatar user={currentUser} size="sm" />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-medium">{currentUser.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {currentUser.role}
                {dept ? ` · ${dept.name}` : ""}
              </span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Switch demo account</DropdownMenuLabel>
          {demoAccounts.map((u) => (
            <DropdownMenuItem key={u.id} onSelect={() => switchUser(u.id)}>
              <UserAvatar user={u} size="xs" />
              <span className="flex-1">{u.name}</span>
              <span className="text-xs text-muted-foreground">{u.role}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/users/$userId" params={{ userId: currentUser.id }}>
              <UserRound className="size-4" /> My profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={signOut}>
            <LogOut className="size-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, notifications, theme, toggleTheme } = useApp();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = navForRole(currentUser.role);
  const unread = notifications.filter((n) => !n.read && n.userId === currentUser.id).length;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <NavLinks items={items} />
        <UserFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Brand />
              <NavLinks items={items} onNavigate={() => setMobileOpen(false)} />
              <UserFooter />
            </SheetContent>
          </Sheet>

          <button
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 max-w-md flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Search or run a command</span>
            <span className="num ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] sm:inline">
              Ctrl K
            </span>
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            {can(currentUser, "create:task") && (
              <CreateTaskDialog
                trigger={
                  <Button size="sm" className="gap-1.5">
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">New task</span>
                  </Button>
                }
              />
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Notifications">
              <Link to="/notifications" className="relative">
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
