"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  MessageSquare,
  Calendar,
  Users,
  MoreHorizontal,
  GripVertical,
  Clock,
  Send,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate, getInitials, priorityColors, statusColors } from "@/lib/utils";

// --- Types ---

interface TaskLabel {
  name: string;
  color: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: "urgent" | "high" | "medium" | "low";
  assignee: string;
  assigneeColor: string;
  dueDate: string | null;
  labels: TaskLabel[];
  commentCount: number;
  comments: Comment[];
  startDate: string | null;
}

interface Column {
  id: string;
  title: string;
  headerColor: string;
  dotColor: string;
  taskIds: string[];
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  colorClass: string;
  members: { name: string; color: string }[];
}

// --- Data ---

const projectsMap: Record<string, ProjectData> = {
  "1": {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design patterns and improved UX",
    colorClass: "bg-blue-500",
    members: [
      { name: "Sarah Chen", color: "bg-blue-600" },
      { name: "Alex Rivera", color: "bg-emerald-600" },
      { name: "Jake Patel", color: "bg-purple-600" },
      { name: "Maria Lopez", color: "bg-amber-600" },
    ],
  },
  "2": {
    id: "2",
    name: "Mobile App v2",
    description: "Second major release of the mobile application with push notifications and offline support",
    colorClass: "bg-purple-500",
    members: [
      { name: "Jake Patel", color: "bg-purple-600" },
      { name: "Lisa Wang", color: "bg-pink-600" },
      { name: "Tom Harris", color: "bg-cyan-600" },
    ],
  },
  "3": {
    id: "3",
    name: "API Platform",
    description: "Build a scalable API platform with rate limiting, authentication, and developer documentation",
    colorClass: "bg-emerald-500",
    members: [
      { name: "Alex Rivera", color: "bg-emerald-600" },
      { name: "Sarah Chen", color: "bg-blue-600" },
      { name: "Tom Harris", color: "bg-cyan-600" },
      { name: "Nina Kowalski", color: "bg-rose-600" },
      { name: "David Kim", color: "bg-indigo-600" },
    ],
  },
  "4": {
    id: "4",
    name: "Marketing Campaign",
    description: "Q2 digital marketing campaign across social media, email, and content channels",
    colorClass: "bg-orange-500",
    members: [
      { name: "Maria Lopez", color: "bg-amber-600" },
      { name: "Lisa Wang", color: "bg-pink-600" },
    ],
  },
  "5": {
    id: "5",
    name: "Data Pipeline",
    description: "Real-time data pipeline for analytics and reporting using modern streaming architecture",
    colorClass: "bg-red-500",
    members: [
      { name: "David Kim", color: "bg-indigo-600" },
      { name: "Nina Kowalski", color: "bg-rose-600" },
      { name: "Alex Rivera", color: "bg-emerald-600" },
    ],
  },
  "6": {
    id: "6",
    name: "Design System",
    description: "Unified component library and design tokens for consistent UI across all products",
    colorClass: "bg-teal-500",
    members: [
      { name: "Sarah Chen", color: "bg-blue-600" },
      { name: "Maria Lopez", color: "bg-amber-600" },
      { name: "Lisa Wang", color: "bg-pink-600" },
      { name: "Jake Patel", color: "bg-purple-600" },
    ],
  },
};

const labelColors: Record<string, string> = {
  Frontend: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Backend: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Bug: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Design: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  DevOps: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Docs: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Feature: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  Performance: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

function buildInitialTasks(): Record<string, Task> {
  return {
    "t-1": {
      id: "t-1",
      title: "Redesign landing page hero section",
      description: "Update the hero section with new illustrations, copy, and a more compelling CTA layout. Consider A/B testing two variants.",
      status: "todo",
      priority: "high",
      assignee: "Sarah Chen",
      assigneeColor: "bg-blue-600",
      dueDate: "2026-04-05",
      labels: [{ name: "Frontend", color: labelColors.Frontend }, { name: "Design", color: labelColors.Design }],
      commentCount: 3,
      comments: [
        { id: "c1", author: "Alex Rivera", text: "I have some reference designs from Dribbble we can look at.", timestamp: "2026-03-28T10:00:00Z" },
        { id: "c2", author: "Sarah Chen", text: "Great, let us review those in the standup tomorrow.", timestamp: "2026-03-28T11:30:00Z" },
        { id: "c3", author: "Maria Lopez", text: "Added some copy options in the shared doc.", timestamp: "2026-03-29T09:00:00Z" },
      ],
      startDate: "2026-04-01",
    },
    "t-2": {
      id: "t-2",
      title: "Set up CI/CD pipeline for staging",
      description: "Configure GitHub Actions for automatic builds and deployments to the staging environment.",
      status: "todo",
      priority: "medium",
      assignee: "Alex Rivera",
      assigneeColor: "bg-emerald-600",
      dueDate: "2026-04-08",
      labels: [{ name: "DevOps", color: labelColors.DevOps }],
      commentCount: 1,
      comments: [
        { id: "c4", author: "Alex Rivera", text: "I will base this on our existing workflow template.", timestamp: "2026-03-27T14:00:00Z" },
      ],
      startDate: "2026-04-03",
    },
    "t-3": {
      id: "t-3",
      title: "Create responsive navigation component",
      description: "Build a mobile-friendly navigation with hamburger menu, dropdown submenus, and smooth animations.",
      status: "todo",
      priority: "high",
      assignee: "Jake Patel",
      assigneeColor: "bg-purple-600",
      dueDate: "2026-04-04",
      labels: [{ name: "Frontend", color: labelColors.Frontend }],
      commentCount: 2,
      comments: [
        { id: "c5", author: "Jake Patel", text: "Should we support mega-menus or keep it simple?", timestamp: "2026-03-29T08:00:00Z" },
        { id: "c6", author: "Sarah Chen", text: "Simple for now, we can iterate later.", timestamp: "2026-03-29T09:15:00Z" },
      ],
      startDate: "2026-04-01",
    },
    "t-4": {
      id: "t-4",
      title: "Write API endpoint documentation",
      description: "Document all REST endpoints including request/response schemas, auth requirements, and examples.",
      status: "todo",
      priority: "low",
      assignee: "Maria Lopez",
      assigneeColor: "bg-amber-600",
      dueDate: "2026-04-12",
      labels: [{ name: "Docs", color: labelColors.Docs }],
      commentCount: 0,
      comments: [],
      startDate: "2026-04-08",
    },
    "t-5": {
      id: "t-5",
      title: "Implement user authentication flow",
      description: "Build login, registration, and password reset flows with OAuth provider support.",
      status: "in-progress",
      priority: "urgent",
      assignee: "Alex Rivera",
      assigneeColor: "bg-emerald-600",
      dueDate: "2026-04-02",
      labels: [{ name: "Backend", color: labelColors.Backend }, { name: "Feature", color: labelColors.Feature }],
      commentCount: 4,
      comments: [
        { id: "c7", author: "Alex Rivera", text: "OAuth with Google and GitHub is working. Working on email/password now.", timestamp: "2026-03-29T16:00:00Z" },
        { id: "c8", author: "Sarah Chen", text: "Make sure to add rate limiting on the login endpoint.", timestamp: "2026-03-30T08:00:00Z" },
        { id: "c9", author: "Jake Patel", text: "Frontend forms are ready whenever the API is done.", timestamp: "2026-03-30T09:00:00Z" },
        { id: "c10", author: "Alex Rivera", text: "Rate limiting added. Testing now.", timestamp: "2026-03-30T14:00:00Z" },
      ],
      startDate: "2026-03-26",
    },
    "t-6": {
      id: "t-6",
      title: "Build dashboard analytics widgets",
      description: "Create reusable chart components for KPI cards, line graphs, bar charts, and pie charts.",
      status: "in-progress",
      priority: "medium",
      assignee: "Sarah Chen",
      assigneeColor: "bg-blue-600",
      dueDate: "2026-04-07",
      labels: [{ name: "Frontend", color: labelColors.Frontend }, { name: "Design", color: labelColors.Design }],
      commentCount: 2,
      comments: [
        { id: "c11", author: "Sarah Chen", text: "Using Recharts for the chart library. KPI cards are done.", timestamp: "2026-03-30T10:00:00Z" },
        { id: "c12", author: "Maria Lopez", text: "Can we add a date range picker for the charts?", timestamp: "2026-03-30T11:00:00Z" },
      ],
      startDate: "2026-03-28",
    },
    "t-7": {
      id: "t-7",
      title: "Fix cross-browser CSS issues",
      description: "Address layout inconsistencies in Safari and Firefox, particularly in the grid layouts and sticky headers.",
      status: "in-progress",
      priority: "high",
      assignee: "Jake Patel",
      assigneeColor: "bg-purple-600",
      dueDate: "2026-04-03",
      labels: [{ name: "Bug", color: labelColors.Bug }, { name: "Frontend", color: labelColors.Frontend }],
      commentCount: 1,
      comments: [
        { id: "c13", author: "Jake Patel", text: "Found the Safari issue - it is a flexbox gap rendering bug. Applying workaround.", timestamp: "2026-03-31T09:00:00Z" },
      ],
      startDate: "2026-03-29",
    },
    "t-8": {
      id: "t-8",
      title: "Review and merge color system PR",
      description: "Review the pull request for the new color token system and ensure it meets design spec.",
      status: "in-review",
      priority: "medium",
      assignee: "Maria Lopez",
      assigneeColor: "bg-amber-600",
      dueDate: "2026-04-01",
      labels: [{ name: "Design", color: labelColors.Design }],
      commentCount: 3,
      comments: [
        { id: "c14", author: "Maria Lopez", text: "PR is up. Please check the dark mode tokens especially.", timestamp: "2026-03-29T15:00:00Z" },
        { id: "c15", author: "Sarah Chen", text: "Looks good overall. Left a few minor comments.", timestamp: "2026-03-30T08:00:00Z" },
        { id: "c16", author: "Maria Lopez", text: "Addressed all comments. Ready for final approval.", timestamp: "2026-03-30T12:00:00Z" },
      ],
      startDate: "2026-03-27",
    },
    "t-9": {
      id: "t-9",
      title: "Performance audit and optimization",
      description: "Run Lighthouse audits and optimize Core Web Vitals. Target 90+ scores across all metrics.",
      status: "in-review",
      priority: "high",
      assignee: "Alex Rivera",
      assigneeColor: "bg-emerald-600",
      dueDate: "2026-04-02",
      labels: [{ name: "Performance", color: labelColors.Performance }, { name: "DevOps", color: labelColors.DevOps }],
      commentCount: 2,
      comments: [
        { id: "c17", author: "Alex Rivera", text: "Current scores: Performance 72, Accessibility 95, Best Practices 88.", timestamp: "2026-03-30T16:00:00Z" },
        { id: "c18", author: "Sarah Chen", text: "The main bottleneck is the unoptimized images. Can we add next/image?", timestamp: "2026-03-31T08:00:00Z" },
      ],
      startDate: "2026-03-28",
    },
    "t-10": {
      id: "t-10",
      title: "Implement dark mode toggle",
      description: "Add system/light/dark theme switching with persistent user preference.",
      status: "done",
      priority: "medium",
      assignee: "Jake Patel",
      assigneeColor: "bg-purple-600",
      dueDate: "2026-03-28",
      labels: [{ name: "Frontend", color: labelColors.Frontend }, { name: "Feature", color: labelColors.Feature }],
      commentCount: 1,
      comments: [
        { id: "c19", author: "Jake Patel", text: "Done! Using next-themes with CSS variables.", timestamp: "2026-03-28T14:00:00Z" },
      ],
      startDate: "2026-03-25",
    },
    "t-11": {
      id: "t-11",
      title: "Set up database schema and migrations",
      description: "Design and implement the initial Prisma schema with user, project, and task models.",
      status: "done",
      priority: "urgent",
      assignee: "Alex Rivera",
      assigneeColor: "bg-emerald-600",
      dueDate: "2026-03-25",
      labels: [{ name: "Backend", color: labelColors.Backend }],
      commentCount: 2,
      comments: [
        { id: "c20", author: "Alex Rivera", text: "Schema is ready. Running initial migration now.", timestamp: "2026-03-24T16:00:00Z" },
        { id: "c21", author: "Sarah Chen", text: "Verified the relations look correct. Nice work.", timestamp: "2026-03-25T08:00:00Z" },
      ],
      startDate: "2026-03-22",
    },
    "t-12": {
      id: "t-12",
      title: "Design system token documentation",
      description: "Create comprehensive docs for spacing, typography, and color tokens with usage examples.",
      status: "done",
      priority: "low",
      assignee: "Maria Lopez",
      assigneeColor: "bg-amber-600",
      dueDate: "2026-03-26",
      labels: [{ name: "Docs", color: labelColors.Docs }, { name: "Design", color: labelColors.Design }],
      commentCount: 0,
      comments: [],
      startDate: "2026-03-20",
    },
  };
}

function buildInitialColumns(): Record<string, Column> {
  return {
    todo: {
      id: "todo",
      title: "To Do",
      headerColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      dotColor: "bg-slate-400",
      taskIds: ["t-1", "t-2", "t-3", "t-4"],
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      headerColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      dotColor: "bg-blue-500",
      taskIds: ["t-5", "t-6", "t-7"],
    },
    "in-review": {
      id: "in-review",
      title: "In Review",
      headerColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      dotColor: "bg-purple-500",
      taskIds: ["t-8", "t-9"],
    },
    done: {
      id: "done",
      title: "Done",
      headerColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      dotColor: "bg-emerald-500",
      taskIds: ["t-10", "t-11", "t-12"],
    },
  };
}

const columnOrder = ["todo", "in-progress", "in-review", "done"];

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
  { value: "done", label: "Done" },
];

const priorityOptions = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

// --- Subcomponents ---

function TaskCard({
  task,
  index,
  onClick,
}: {
  task: Task;
  index: number;
  onClick: () => void;
}) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "rounded-lg border bg-card p-3 shadow-sm transition-shadow select-none",
            snapshot.isDragging && "shadow-lg ring-2 ring-primary/20 rotate-[2deg]"
          )}
        >
          <div className="flex items-start gap-2">
            <div
              {...provided.dragHandleProps}
              className="mt-0.5 shrink-0 cursor-grab text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 cursor-pointer" onClick={onClick}>
              <p className="text-sm font-medium leading-snug">{task.title}</p>

              {/* Labels */}
              {task.labels.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {task.labels.map((label) => (
                    <span
                      key={label.name}
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                        label.color
                      )}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom row */}
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-5 capitalize border-0",
                      priorityColors[task.priority]
                    )}
                  >
                    {task.priority}
                  </Badge>
                  {task.dueDate && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {task.commentCount > 0 && (
                    <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {task.commentCount}
                    </span>
                  )}
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className={cn("text-[9px] text-white", task.assigneeColor)}
                    >
                      {getInitials(task.assignee)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onUpdate,
  onStatusChange,
  members,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  members: { name: string; color: string }[];
}) {
  const [newComment, setNewComment] = useState("");

  if (!task) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c-new-${Date.now()}`,
      author: "You",
      text: newComment,
      timestamp: new Date().toISOString(),
    };
    onUpdate(task.id, {
      comments: [...task.comments, comment],
      commentCount: task.commentCount + 1,
    });
    setNewComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-8">
            <Input
              value={task.title}
              onChange={(e) => onUpdate(task.id, { title: e.target.value })}
              className="text-lg font-semibold border-0 p-0 h-auto shadow-none focus-visible:ring-0"
            />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Task details and management
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          {/* Meta fields row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={task.status}
                onValueChange={(value) => onStatusChange(task.id, value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select
                value={task.priority}
                onValueChange={(value) =>
                  onUpdate(task.id, { priority: value as Task["priority"] })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            opt.value === "urgent" && "bg-red-500",
                            opt.value === "high" && "bg-orange-500",
                            opt.value === "medium" && "bg-yellow-500",
                            opt.value === "low" && "bg-green-500"
                          )}
                        />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Assignee</Label>
              <Select
                value={task.assignee}
                onValueChange={(value) => {
                  const member = members.find((m) => m.name === value);
                  onUpdate(task.id, {
                    assignee: value,
                    assigneeColor: member?.color || "bg-slate-600",
                  });
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.name} value={member.name}>
                      <span className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback
                            className={cn(
                              "text-[8px] text-white",
                              member.color
                            )}
                          >
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Due Date</Label>
              <Input
                type="date"
                value={task.dueDate || ""}
                onChange={(e) =>
                  onUpdate(task.id, { dueDate: e.target.value || null })
                }
                className="h-9"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={task.description}
              onChange={(e) =>
                onUpdate(task.id, { description: e.target.value })
              }
              rows={3}
              placeholder="Add a description..."
            />
          </div>

          {/* Labels */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Labels
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {task.labels.map((label) => (
                <span
                  key={label.name}
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                    label.color
                  )}
                >
                  {label.name}
                </span>
              ))}
              {task.labels.length === 0 && (
                <span className="text-xs text-muted-foreground">No labels</span>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Comments ({task.commentCount})
            </Label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5">
                  <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[9px] bg-muted">
                      {getInitials(comment.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.author}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
              {task.comments.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No comments yet. Be the first to comment.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- List Tab ---

function ListTab({
  tasks,
  columns,
  onTaskClick,
}: {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  onTaskClick: (taskId: string) => void;
}) {
  const [sortField, setSortField] = useState<string>("status");
  const [sortAsc, setSortAsc] = useState(true);

  const allTasks = columnOrder.flatMap((colId) =>
    columns[colId].taskIds.map((tid) => tasks[tid])
  );

  const statusOrder: Record<string, number> = { todo: 0, "in-progress": 1, "in-review": 2, done: 3 };
  const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

  const sorted = [...allTasks].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "title":
        cmp = a.title.localeCompare(b.title);
        break;
      case "status":
        cmp = statusOrder[a.status] - statusOrder[b.status];
        break;
      case "priority":
        cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case "assignee":
        cmp = a.assignee.localeCompare(b.assignee);
        break;
      case "dueDate":
        cmp = (a.dueDate || "z").localeCompare(b.dueDate || "z");
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortAsc ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const headers = [
    { field: "title", label: "Title", span: "col-span-4" },
    { field: "status", label: "Status", span: "col-span-2" },
    { field: "priority", label: "Priority", span: "col-span-2" },
    { field: "assignee", label: "Assignee", span: "col-span-2" },
    { field: "dueDate", label: "Due Date", span: "col-span-2" },
  ];

  return (
    <Card>
      <div className="divide-y">
        <div className="grid grid-cols-12 gap-4 px-5 py-3">
          {headers.map((h) => (
            <button
              key={h.field}
              type="button"
              className={cn(
                h.span,
                "flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors text-left"
              )}
              onClick={() => toggleSort(h.field)}
            >
              {h.label}
              <SortIcon field={h.field} />
            </button>
          ))}
        </div>
        {sorted.map((task) => (
          <button
            key={task.id}
            type="button"
            className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-muted/50 transition-colors w-full text-left"
            onClick={() => onTaskClick(task.id)}
          >
            <div className="col-span-4 text-sm font-medium truncate">
              {task.title}
            </div>
            <div className="col-span-2">
              <Badge
                className={cn(
                  "text-[10px] capitalize border-0",
                  statusColors[task.status]
                )}
              >
                {task.status.replace("-", " ")}
              </Badge>
            </div>
            <div className="col-span-2">
              <Badge
                className={cn(
                  "text-[10px] capitalize border-0",
                  priorityColors[task.priority]
                )}
              >
                {task.priority}
              </Badge>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback
                  className={cn("text-[9px] text-white", task.assigneeColor)}
                >
                  {getInitials(task.assignee)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">{task.assignee.split(" ")[0]}</span>
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {task.dueDate ? formatDate(task.dueDate) : "--"}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

// --- Timeline Tab ---

function TimelineTab({
  tasks,
  columns,
  onTaskClick,
}: {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  onTaskClick: (taskId: string) => void;
}) {
  const allTasks = columnOrder.flatMap((colId) =>
    columns[colId].taskIds.map((tid) => tasks[tid])
  );

  // Determine date range
  const dates: Date[] = [];
  allTasks.forEach((t) => {
    if (t.startDate) dates.push(new Date(t.startDate));
    if (t.dueDate) dates.push(new Date(t.dueDate));
  });

  if (dates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No tasks with dates to display on the timeline.
        </CardContent>
      </Card>
    );
  }

  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
  // Add padding
  minDate.setDate(minDate.getDate() - 1);
  maxDate.setDate(maxDate.getDate() + 2);

  const totalDays = Math.ceil(
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Generate day labels
  const dayLabels: { date: Date; label: string }[] = [];
  for (let i = 0; i <= totalDays; i++) {
    const d = new Date(minDate);
    d.setDate(d.getDate() + i);
    dayLabels.push({
      date: d,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }

  const getPosition = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = d.getTime() - minDate.getTime();
    return (diff / (maxDate.getTime() - minDate.getTime())) * 100;
  };

  const barColorMap: Record<string, string> = {
    todo: "bg-slate-400 dark:bg-slate-500",
    "in-progress": "bg-blue-500",
    "in-review": "bg-purple-500",
    done: "bg-emerald-500",
  };

  return (
    <Card>
      <CardContent className="p-5 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Day headers */}
          <div className="relative flex mb-2 border-b pb-2">
            <div className="w-48 shrink-0 text-xs font-medium text-muted-foreground">
              Task
            </div>
            <div className="flex-1 relative h-5">
              {dayLabels
                .filter((_, i) => i % Math.max(1, Math.floor(totalDays / 12)) === 0)
                .map((day, i) => {
                  const left = getPosition(day.date.toISOString());
                  return (
                    <span
                      key={i}
                      className="absolute text-[10px] text-muted-foreground -translate-x-1/2"
                      style={{ left: `${left}%` }}
                    >
                      {day.label}
                    </span>
                  );
                })}
            </div>
          </div>

          {/* Task rows */}
          <div className="space-y-1.5">
            {allTasks.map((task) => {
              const start = task.startDate || task.dueDate;
              const end = task.dueDate || task.startDate;
              if (!start || !end) return null;

              const left = getPosition(start);
              const right = getPosition(end);
              const width = Math.max(right - left, 2);

              return (
                <div
                  key={task.id}
                  className="flex items-center group cursor-pointer hover:bg-muted/30 rounded py-1 -mx-1 px-1"
                  onClick={() => onTaskClick(task.id)}
                >
                  <div className="w-48 shrink-0 text-xs truncate pr-3 font-medium">
                    {task.title}
                  </div>
                  <div className="flex-1 relative h-6">
                    <div
                      className={cn(
                        "absolute h-5 rounded-full top-0.5 transition-all group-hover:h-6 group-hover:top-0",
                        barColorMap[task.status]
                      )}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        minWidth: "12px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projectsMap[params.id] || projectsMap["1"];
  const [tasks, setTasks] = useState<Record<string, Task>>(buildInitialTasks);
  const [columns, setColumns] = useState<Record<string, Column>>(buildInitialColumns);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedTask = selectedTaskId ? tasks[selectedTaskId] : null;

  // --- Drag-and-drop handler ---
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const sourceCol = columns[source.droppableId];
      const destCol = columns[destination.droppableId];

      if (sourceCol.id === destCol.id) {
        // Reorder within same column
        const newTaskIds = Array.from(sourceCol.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        setColumns((prev) => ({
          ...prev,
          [sourceCol.id]: { ...sourceCol, taskIds: newTaskIds },
        }));
      } else {
        // Move between columns
        const sourceTaskIds = Array.from(sourceCol.taskIds);
        sourceTaskIds.splice(source.index, 1);

        const destTaskIds = Array.from(destCol.taskIds);
        destTaskIds.splice(destination.index, 0, draggableId);

        setColumns((prev) => ({
          ...prev,
          [sourceCol.id]: { ...sourceCol, taskIds: sourceTaskIds },
          [destCol.id]: { ...destCol, taskIds: destTaskIds },
        }));

        // Update the task status
        setTasks((prev) => ({
          ...prev,
          [draggableId]: { ...prev[draggableId], status: destCol.id },
        }));
      }
    },
    [columns]
  );

  // --- Task update handler ---
  const handleUpdateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) => ({
        ...prev,
        [taskId]: { ...prev[taskId], ...updates },
      }));
    },
    []
  );

  // --- Status change (moves task between columns) ---
  const handleStatusChange = useCallback(
    (taskId: string, newStatus: string) => {
      const currentTask = tasks[taskId];
      if (currentTask.status === newStatus) return;

      const oldStatus = currentTask.status;

      setColumns((prev) => {
        const oldCol = prev[oldStatus];
        const newCol = prev[newStatus];
        return {
          ...prev,
          [oldStatus]: {
            ...oldCol,
            taskIds: oldCol.taskIds.filter((id) => id !== taskId),
          },
          [newStatus]: {
            ...newCol,
            taskIds: [...newCol.taskIds, taskId],
          },
        };
      });

      setTasks((prev) => ({
        ...prev,
        [taskId]: { ...prev[taskId], status: newStatus },
      }));
    },
    [tasks]
  );

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDialogOpen(true);
  };

  // Progress calculation
  const totalTasks = Object.keys(tasks).length;
  const doneTasks = columns.done.taskIds.length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                project.colorClass
              )}
            >
              <span className="text-white font-bold text-sm">
                {project.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {project.name}
              </h1>
              <p className="text-muted-foreground mt-0.5">
                {project.description}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((member) => (
                      <Avatar
                        key={member.name}
                        className="h-7 w-7 border-2 border-background"
                      >
                        <AvatarFallback
                          className={cn("text-[9px] text-white", member.color)}
                        >
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 4 && (
                      <Avatar className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="text-[9px] bg-muted">
                          +{project.members.length - 4}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.members.length} members
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{doneTasks}/{totalTasks} done</span>
                  <Progress value={progress} className="h-1.5 w-24" />
                  <span className="font-medium">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* ===== BOARD TAB ===== */}
        <TabsContent value="board">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {columnOrder.map((colId) => {
                const column = columns[colId];
                return (
                  <div key={colId} className="flex flex-col min-w-0">
                    {/* Column header */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
                          column.headerColor
                        )}
                      >
                        <span
                          className={cn("h-2 w-2 rounded-full", column.dotColor)}
                        />
                        {column.title}
                        <span className="ml-1 text-xs opacity-70">
                          {column.taskIds.length}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Droppable column */}
                    <Droppable droppableId={colId}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "flex-1 space-y-2 rounded-lg p-2 min-h-[120px] transition-colors",
                            snapshot.isDraggingOver
                              ? "bg-muted/70 ring-2 ring-dashed ring-primary/20"
                              : "bg-muted/30"
                          )}
                        >
                          {column.taskIds.map((taskId, index) => {
                            const task = tasks[taskId];
                            if (!task) return null;
                            return (
                              <TaskCard
                                key={taskId}
                                task={task}
                                index={index}
                                onClick={() => handleTaskClick(taskId)}
                              />
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </TabsContent>

        {/* ===== LIST TAB ===== */}
        <TabsContent value="list">
          <ListTab
            tasks={tasks}
            columns={columns}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>

        {/* ===== TIMELINE TAB ===== */}
        <TabsContent value="timeline">
          <TimelineTab
            tasks={tasks}
            columns={columns}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>
      </Tabs>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={handleUpdateTask}
        onStatusChange={handleStatusChange}
        members={project.members}
      />
    </div>
  );
}
