"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  FileText,
  BarChart3,
  Users,
  Settings,
  Bot,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Zap,
  CreditCard,
  Activity,
  HelpCircle,
  Radio,
  Sparkles,
  FileBarChart,
  Download,
  Upload,
  Workflow,
  LayoutTemplate,
  Map,
  UserPlus,
  Clock,
  Target,
  Gift,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Wiki", href: "/wiki", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
];

const teamNav = [
  { name: "Team", href: "/team", icon: Users },
  { name: "Invite & Share", href: "/invite", icon: UserPlus },
  { name: "Activity Log", href: "/activity", icon: Activity },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

const toolsNav = [
  { name: "Time Tracking", href: "/time-tracking", icon: Clock },
  { name: "Goals & OKRs", href: "/goals", icon: Target },
  { name: "Automations", href: "/automations", icon: Workflow },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Imports", href: "/imports", icon: Upload },
  { name: "Exports", href: "/exports", icon: Download },
  { name: "Referrals", href: "/referral", icon: Gift },
];

const workspaceNav = [
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "What's New", href: "/changelog", icon: Sparkles },
  { name: "Status", href: "/status", icon: Radio },
  { name: "Help", href: "/help", icon: HelpCircle },
];

const bottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
];

function NavSection({ items, label, sidebarOpen, pathname }: {
  items: typeof mainNav;
  label: string;
  sidebarOpen: boolean;
  pathname: string | null;
}) {
  return (
    <div>
      {sidebarOpen && (
        <p className="mb-1 px-3 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </p>
      )}
      {!sidebarOpen && <div className="my-1" />}
      {items.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
        const link = (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              !sidebarOpen && "justify-center px-2"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>{item.name}</span>}
          </Link>
        );

        if (!sidebarOpen) {
          return (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          );
        }
        return <div key={item.name}>{link}</div>;
      })}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-card transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className={cn("flex h-14 items-center border-b px-4", sidebarOpen ? "justify-between" : "justify-center")}>
          {sidebarOpen && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">TaskFlow</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          <NavSection items={mainNav} label="Main" sidebarOpen={sidebarOpen} pathname={pathname} />
          <NavSection items={teamNav} label="Team" sidebarOpen={sidebarOpen} pathname={pathname} />
          <NavSection items={toolsNav} label="Tools" sidebarOpen={sidebarOpen} pathname={pathname} />
          <NavSection items={workspaceNav} label="Workspace" sidebarOpen={sidebarOpen} pathname={pathname} />
        </nav>

        {/* Bottom navigation */}
        <div className="border-t p-2">
          {bottomNav.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const link = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  !sidebarOpen && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );

            if (!sidebarOpen) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            }
            return <div key={item.name}>{link}</div>;
          })}
        </div>
      </aside>
    </TooltipProvider>
  );
}
