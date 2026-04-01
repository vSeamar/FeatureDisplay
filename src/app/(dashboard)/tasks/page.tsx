"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  MessageSquare,
  Filter,
  CheckCircle2,
  Clock,
  CircleDot,
  Circle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate, getInitials, priorityColors, statusColors } from "@/lib/utils";

interface TaskItem {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  projectColor: string;
  status: string;
  priority: "urgent" | "high" | "medium" | "low";
  assignee: string;
  assigneeColor: string;
  dueDate: string | null;
  commentCount: number;
  createdBy: string;
}

const allTasks: TaskItem[] = [
  {
    id: "t-1",
    title: "Redesign landing page hero section",
    projectId: "1",
    projectName: "Website Redesign",
    projectColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    status: "todo",
    priority: "high",
    assignee: "Sarah Chen",
    assigneeColor: "bg-blue-600",
    dueDate: "2026-04-05",
    commentCount: 3,
    createdBy: "You",
  },
  {
    id: "t-2",
    title: "Implement user authentication flow",
    projectId: "1",
    projectName: "Website Redesign",
    projectColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    status: "in-progress",
    priority: "urgent",
    assignee: "You",
    assigneeColor: "bg-indigo-600",
    dueDate: "2026-04-02",
    commentCount: 4,
    createdBy: "Sarah Chen",
  },
  {
    id: "t-3",
    title: "Push notification system design",
    projectId: "2",
    projectName: "Mobile App v2",
    projectColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    status: "todo",
    priority: "medium",
    assignee: "Jake Patel",
    assigneeColor: "bg-purple-600",
    dueDate: "2026-04-10",
    commentCount: 1,
    createdBy: "You",
  },
  {
    id: "t-4",
    title: "Build offline sync module",
    projectId: "2",
    projectName: "Mobile App v2",
    projectColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    status: "in-progress",
    priority: "high",
    assignee: "You",
    assigneeColor: "bg-indigo-600",
    dueDate: "2026-04-07",
    commentCount: 2,
    createdBy: "Tom Harris",
  },
  {
    id: "t-5",
    title: "Rate limiting middleware",
    projectId: "3",
    projectName: "API Platform",
    projectColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    status: "done",
    priority: "urgent",
    assignee: "Alex Rivera",
    assigneeColor: "bg-emerald-600",
    dueDate: "2026-03-28",
    commentCount: 5,
    createdBy: "You",
  },
  {
    id: "t-6",
    title: "API key management dashboard",
    projectId: "3",
    projectName: "API Platform",
    projectColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    status: "in-review",
    priority: "medium",
    assignee: "You",
    assigneeColor: "bg-indigo-600",
    dueDate: "2026-04-03",
    commentCount: 2,
    createdBy: "Alex Rivera",
  },
  {
    id: "t-7",
    title: "Write developer onboarding guide",
    projectId: "3",
    projectName: "API Platform",
    projectColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    status: "todo",
    priority: "low",
    assignee: "Nina Kowalski",
    assigneeColor: "bg-rose-600",
    dueDate: "2026-04-15",
    commentCount: 0,
    createdBy: "Sarah Chen",
  },
  {
    id: "t-8",
    title: "Design email campaign templates",
    projectId: "4",
    projectName: "Marketing Campaign",
    projectColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    status: "in-progress",
    priority: "medium",
    assignee: "Maria Lopez",
    assigneeColor: "bg-amber-600",
    dueDate: "2026-04-06",
    commentCount: 1,
    createdBy: "You",
  },
  {
    id: "t-9",
    title: "Set up social media scheduler",
    projectId: "4",
    projectName: "Marketing Campaign",
    projectColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    status: "todo",
    priority: "high",
    assignee: "You",
    assigneeColor: "bg-indigo-600",
    dueDate: "2026-04-09",
    commentCount: 0,
    createdBy: "Maria Lopez",
  },
  {
    id: "t-10",
    title: "Configure Kafka topic partitioning",
    projectId: "5",
    projectName: "Data Pipeline",
    projectColor: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    status: "in-progress",
    priority: "high",
    assignee: "David Kim",
    assigneeColor: "bg-indigo-600",
    dueDate: "2026-04-04",
    commentCount: 3,
    createdBy: "You",
  },
  {
    id: "t-11",
    title: "Build data validation layer",
    projectId: "5",
    projectName: "Data Pipeline",
    projectColor: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    status: "in-review",
    priority: "medium",
    assignee: "You",
    assigneeColor: "bg-indigo-600",
    dueDate: "2026-04-01",
    commentCount: 2,
    createdBy: "Nina Kowalski",
  },
  {
    id: "t-12",
    title: "Create Button component variants",
    projectId: "6",
    projectName: "Design System",
    projectColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    status: "done",
    priority: "medium",
    assignee: "Sarah Chen",
    assigneeColor: "bg-blue-600",
    dueDate: "2026-03-25",
    commentCount: 4,
    createdBy: "You",
  },
  {
    id: "t-13",
    title: "Document color token system",
    projectId: "6",
    projectName: "Design System",
    projectColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    status: "done",
    priority: "low",
    assignee: "You",
    assigneeColor: "bg-indigo-600",
    dueDate: "2026-03-27",
    commentCount: 1,
    createdBy: "Maria Lopez",
  },
  {
    id: "t-14",
    title: "Implement dark mode for all components",
    projectId: "6",
    projectName: "Design System",
    projectColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    status: "in-progress",
    priority: "high",
    assignee: "Jake Patel",
    assigneeColor: "bg-purple-600",
    dueDate: "2026-04-08",
    commentCount: 2,
    createdBy: "You",
  },
  {
    id: "t-15",
    title: "Performance testing for streaming ingestion",
    projectId: "5",
    projectName: "Data Pipeline",
    projectColor: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    status: "todo",
    priority: "urgent",
    assignee: "You",
    assigneeColor: "bg-indigo-600",
    dueDate: "2026-04-03",
    commentCount: 1,
    createdBy: "David Kim",
  },
];

const statusIcon: Record<string, React.ElementType> = {
  todo: Circle,
  "in-progress": Clock,
  "in-review": CircleDot,
  done: CheckCircle2,
};

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    return allTasks.filter((task) => {
      // Search
      if (
        search &&
        !task.title.toLowerCase().includes(search.toLowerCase()) &&
        !task.projectName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Status
      if (statusFilter !== "all" && task.status !== statusFilter) return false;

      // Priority
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;

      // Tab
      if (activeTab === "assigned" && task.assignee !== "You") return false;
      if (activeTab === "created" && task.createdBy !== "You") return false;

      return true;
    });
  }, [search, statusFilter, priorityFilter, activeTab]);

  const counts = useMemo(() => {
    const base = allTasks.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase()) && !task.projectName.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
      return true;
    });
    return {
      all: base.length,
      assigned: base.filter((t) => t.assignee === "You").length,
      created: base.filter((t) => t.createdBy === "You").length,
    };
  }, [search, statusFilter, priorityFilter]);

  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSearch("");
  };

  const hasActiveFilters =
    statusFilter !== "all" || priorityFilter !== "all" || search !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">
          View and manage tasks across all your projects
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-muted-foreground"
            >
              <Filter className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all">
            All
            <span className="ml-1.5 rounded-full bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] font-medium">
              {counts.all}
            </span>
          </TabsTrigger>
          <TabsTrigger value="assigned">
            Assigned to Me
            <span className="ml-1.5 rounded-full bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] font-medium">
              {counts.assigned}
            </span>
          </TabsTrigger>
          <TabsTrigger value="created">
            Created by Me
            <span className="ml-1.5 rounded-full bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] font-medium">
              {counts.created}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Shared content for all tabs -- filtering handled by state */}
        <TabsContent value={activeTab} className="mt-4">
          {filtered.length > 0 ? (
            <Card>
              <div className="divide-y">
                {filtered.map((task) => {
                  const StatusIcon = statusIcon[task.status] || Circle;
                  return (
                    <Link
                      key={task.id}
                      href={`/projects/${task.projectId}`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/50 transition-colors group"
                    >
                      {/* Status icon */}
                      <StatusIcon
                        className={cn(
                          "h-4.5 w-4.5 shrink-0",
                          task.status === "done"
                            ? "text-emerald-500"
                            : task.status === "in-progress"
                            ? "text-blue-500"
                            : task.status === "in-review"
                            ? "text-purple-500"
                            : "text-muted-foreground"
                        )}
                      />

                      {/* Title + project */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm font-medium truncate group-hover:text-primary transition-colors",
                            task.status === "done" &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            className={cn(
                              "text-[10px] border-0 px-1.5 py-0",
                              task.projectColor
                            )}
                          >
                            {task.projectName}
                          </Badge>
                        </div>
                      </div>

                      {/* Status badge */}
                      <Badge
                        className={cn(
                          "text-[10px] capitalize border-0 shrink-0 hidden sm:inline-flex",
                          statusColors[task.status]
                        )}
                      >
                        {task.status.replace("-", " ")}
                      </Badge>

                      {/* Priority */}
                      <Badge
                        className={cn(
                          "text-[10px] capitalize border-0 shrink-0 hidden md:inline-flex",
                          priorityColors[task.priority]
                        )}
                      >
                        {task.priority}
                      </Badge>

                      {/* Assignee */}
                      <div className="hidden lg:flex items-center gap-2 shrink-0 w-28">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback
                            className={cn(
                              "text-[9px] text-white",
                              task.assigneeColor
                            )}
                          >
                            {getInitials(task.assignee)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate">
                          {task.assignee === "You" ? "You" : task.assignee.split(" ")[0]}
                        </span>
                      </div>

                      {/* Due date */}
                      <div className="hidden md:flex items-center gap-1 shrink-0 w-24 text-xs text-muted-foreground">
                        {task.dueDate ? (
                          <>
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </>
                        ) : (
                          "--"
                        )}
                      </div>

                      {/* Comments */}
                      {task.commentCount > 0 && (
                        <span className="hidden sm:flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
                          <MessageSquare className="h-3 w-3" />
                          {task.commentCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms"
                  : "You have no tasks yet"}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
