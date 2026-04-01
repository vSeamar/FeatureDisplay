"use client";

import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  UserPlus,
  FileEdit,
  FolderOpen,
  ArrowRight,
  CalendarDays,
  Plus,
  FolderPlus,
  Calendar,
  FileBarChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn, formatRelativeDate, getInitials, priorityColors } from "@/lib/utils";

const stats = [
  {
    label: "Total Tasks",
    value: 128,
    icon: ListTodo,
    trend: null,
    trendLabel: "across 6 projects",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    label: "Completed",
    value: 64,
    icon: CheckCircle2,
    trend: "up" as const,
    trendLabel: "+12 this week",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    label: "In Progress",
    value: 38,
    icon: Clock,
    trend: "up" as const,
    trendLabel: "+4 from last week",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    label: "Overdue",
    value: 6,
    icon: AlertTriangle,
    trend: "down" as const,
    trendLabel: "-3 from last week",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40",
  },
];

const recentActivity = [
  {
    id: 1,
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    message: "You completed task 'Update API docs'",
    project: "Backend Revamp",
    time: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    id: 2,
    icon: MessageSquare,
    iconColor: "text-blue-500",
    message: "Sarah commented on 'Design system tokens'",
    project: "UI Library",
    time: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 3,
    icon: UserPlus,
    iconColor: "text-purple-500",
    message: "Alex was assigned to 'Database migration'",
    project: "Backend Revamp",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 4,
    icon: FileEdit,
    iconColor: "text-amber-500",
    message: "You updated task 'Implement auth flow'",
    project: "Mobile App",
    time: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: 5,
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    message: "Maria completed 'User onboarding wireframes'",
    project: "UI Library",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 6,
    icon: FolderOpen,
    iconColor: "text-indigo-500",
    message: "New project 'Analytics Dashboard' was created",
    project: "Analytics Dashboard",
    time: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 7,
    icon: MessageSquare,
    iconColor: "text-blue-500",
    message: "Jake mentioned you in 'Performance audit'",
    project: "Backend Revamp",
    time: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 8,
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    message: "You completed task 'Fix login redirect bug'",
    project: "Mobile App",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const projects = [
  { name: "Backend Revamp", progress: 68, total: 42, completed: 28, color: "bg-blue-500" },
  { name: "Mobile App", progress: 45, total: 36, completed: 16, color: "bg-purple-500" },
  { name: "UI Library", progress: 82, total: 28, completed: 23, color: "bg-emerald-500" },
  { name: "Analytics Dashboard", progress: 20, total: 22, completed: 4, color: "bg-amber-500" },
];

const deadlines = [
  { task: "Finalize API contracts", project: "Backend Revamp", due: "Apr 2", priority: "urgent" },
  { task: "Submit design review", project: "UI Library", due: "Apr 3", priority: "high" },
  { task: "Push notifications setup", project: "Mobile App", due: "Apr 5", priority: "medium" },
  { task: "Metrics collection spec", project: "Analytics Dashboard", due: "Apr 7", priority: "low" },
  { task: "Accessibility audit pass", project: "UI Library", due: "Apr 10", priority: "medium" },
];

const quickActions = [
  { label: "New Task", icon: Plus, variant: "default" as const },
  { label: "New Project", icon: FolderPlus, variant: "outline" as const },
  { label: "View Calendar", icon: Calendar, variant: "outline" as const },
  { label: "Generate Report", icon: FileBarChart, variant: "outline" as const },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "there";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={cn("text-3xl font-bold", stat.label === "Overdue" && "text-red-600 dark:text-red-400")}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend === "up" && (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                )}
                {stat.trend === "down" && (
                  <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                )}
                <span>{stat.trendLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-0">
            {recentActivity.map((item, i) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 py-3",
                  i !== recentActivity.length - 1 && "border-b"
                )}
              >
                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted")}>
                  <item.icon className={cn("h-4 w-4", item.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{item.message}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.project}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(item.time)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-2">
          {/* My Projects */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">My Projects</CardTitle>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {project.completed}/{project.total} tasks
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="h-1.5" />
                    <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              {deadlines.map((item, i) => (
                <div
                  key={item.task}
                  className={cn(
                    "flex items-center justify-between py-3",
                    i !== deadlines.length - 1 && "border-b"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.task}</p>
                    <p className="text-xs text-muted-foreground">{item.project}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <Badge className={cn("text-[10px]", priorityColors[item.priority])}>
                      {item.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.due}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Button key={action.label} variant={action.variant} className="gap-2">
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
