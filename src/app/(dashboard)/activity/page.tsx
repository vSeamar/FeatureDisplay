"use client";

import { useState, useMemo } from "react";
import {
  ScrollText,
  Download,
  Filter,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getInitials } from "@/lib/utils";

type ActionType =
  | "Created"
  | "Updated"
  | "Deleted"
  | "Commented"
  | "Moved"
  | "Archived"
  | "Invited"
  | "Changed";

interface ActivityEntry {
  id: number;
  user: string;
  action: ActionType;
  description: string;
  target: string;
  context?: string;
  metadata?: string;
  timestamp: string;
}

const actionBadgeColors: Record<ActionType, string> = {
  Created:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Updated:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Deleted:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Commented:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Moved:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Archived:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Invited:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Changed:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const avatarColors: Record<string, string> = {
  "Sarah Chen": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Alex Rivera": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Maria Santos": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Jake Wilson": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Emily Park": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "David Kim": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
};

const initialEntries: ActivityEntry[] = [
  {
    id: 1,
    user: "Sarah Chen",
    action: "Created",
    description: "created task",
    target: "Fix login redirect bug",
    context: "Website Redesign",
    metadata: "Priority: High | Assigned to: Alex Rivera",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    user: "Alex Rivera",
    action: "Updated",
    description: "updated task",
    target: "API rate limiting implementation",
    context: "API Platform",
    metadata: "Status: Todo \u2192 In Progress",
    timestamp: "8 minutes ago",
  },
  {
    id: 3,
    user: "Maria Santos",
    action: "Commented",
    description: "commented on",
    target: "Dashboard wireframes v2",
    context: "Website Redesign",
    metadata: '"I think we should use the card layout for the metrics section"',
    timestamp: "15 minutes ago",
  },
  {
    id: 4,
    user: "Jake Wilson",
    action: "Moved",
    description: "moved task",
    target: "Set up CI/CD pipeline",
    context: "API Platform",
    metadata: "Column: In Progress \u2192 In Review",
    timestamp: "22 minutes ago",
  },
  {
    id: 5,
    user: "Emily Park",
    action: "Created",
    description: "created project",
    target: "Q2 Marketing Campaign",
    metadata: "Template: Agile Board | Members: 6",
    timestamp: "35 minutes ago",
  },
  {
    id: 6,
    user: "David Kim",
    action: "Updated",
    description: "updated task",
    target: "Database migration script",
    context: "Backend Revamp",
    metadata: "Priority: Medium \u2192 High",
    timestamp: "45 minutes ago",
  },
  {
    id: 7,
    user: "Sarah Chen",
    action: "Deleted",
    description: "deleted task",
    target: "Old homepage hero section",
    context: "Website Redesign",
    metadata: "Reason: Duplicate of #142",
    timestamp: "1 hour ago",
  },
  {
    id: 8,
    user: "Alex Rivera",
    action: "Commented",
    description: "commented on",
    target: "Authentication service refactor",
    context: "API Platform",
    metadata: '"Need to check backward compatibility with v1 tokens"',
    timestamp: "1 hour ago",
  },
  {
    id: 9,
    user: "Maria Santos",
    action: "Created",
    description: "created document",
    target: "Brand Guidelines v3",
    context: "Website Redesign",
    metadata: "Type: Design Document | 12 pages",
    timestamp: "2 hours ago",
  },
  {
    id: 10,
    user: "Jake Wilson",
    action: "Updated",
    description: "updated task",
    target: "WebSocket connection handler",
    context: "API Platform",
    metadata: "Status: In Review \u2192 Done",
    timestamp: "2 hours ago",
  },
  {
    id: 11,
    user: "Emily Park",
    action: "Invited",
    description: "invited",
    target: "Chris Thompson",
    context: "Mobile App",
    metadata: "Role: Developer | Sent via email",
    timestamp: "3 hours ago",
  },
  {
    id: 12,
    user: "David Kim",
    action: "Moved",
    description: "moved task",
    target: "Redis cache layer",
    context: "Backend Revamp",
    metadata: "Column: Todo \u2192 In Progress",
    timestamp: "3 hours ago",
  },
  {
    id: 13,
    user: "Sarah Chen",
    action: "Updated",
    description: "edited document",
    target: "Technical Architecture Overview",
    context: "API Platform",
    metadata: "Changes: 14 additions, 3 deletions",
    timestamp: "4 hours ago",
  },
  {
    id: 14,
    user: "Alex Rivera",
    action: "Created",
    description: "created task",
    target: "Implement OAuth2 PKCE flow",
    context: "API Platform",
    metadata: "Priority: Urgent | Due: Apr 5, 2026",
    timestamp: "5 hours ago",
  },
  {
    id: 15,
    user: "Maria Santos",
    action: "Commented",
    description: "commented on",
    target: "Mobile responsive layout",
    context: "Website Redesign",
    metadata: '"The breakpoints need adjustment for tablet portrait mode"',
    timestamp: "5 hours ago",
  },
  {
    id: 16,
    user: "Jake Wilson",
    action: "Changed",
    description: "changed role for",
    target: "Emily Park",
    context: "API Platform",
    metadata: "Role: Viewer \u2192 Editor",
    timestamp: "6 hours ago",
  },
  {
    id: 17,
    user: "Emily Park",
    action: "Deleted",
    description: "deleted task",
    target: "Legacy API endpoint cleanup",
    context: "Backend Revamp",
    metadata: "Reason: Completed in separate PR",
    timestamp: "7 hours ago",
  },
  {
    id: 18,
    user: "David Kim",
    action: "Archived",
    description: "archived project",
    target: "Infrastructure Migration Q4",
    metadata: "Tasks completed: 47/47 | Duration: 3 months",
    timestamp: "8 hours ago",
  },
  {
    id: 19,
    user: "Sarah Chen",
    action: "Changed",
    description: "updated settings for",
    target: "Website Redesign",
    metadata: "Notification preferences: Email digest enabled",
    timestamp: "9 hours ago",
  },
  {
    id: 20,
    user: "Alex Rivera",
    action: "Created",
    description: "created task",
    target: "GraphQL subscription handler",
    context: "API Platform",
    metadata: "Priority: Medium | Labels: backend, real-time",
    timestamp: "10 hours ago",
  },
];

const extraEntries: ActivityEntry[] = [
  {
    id: 21,
    user: "Maria Santos",
    action: "Updated",
    description: "updated task",
    target: "Icon set migration to Lucide",
    context: "Website Redesign",
    metadata: "Status: In Progress \u2192 In Review",
    timestamp: "11 hours ago",
  },
  {
    id: 22,
    user: "Jake Wilson",
    action: "Commented",
    description: "commented on",
    target: "Load testing results",
    context: "API Platform",
    metadata: '"p99 latency dropped from 340ms to 120ms after the cache update"',
    timestamp: "12 hours ago",
  },
  {
    id: 23,
    user: "Emily Park",
    action: "Created",
    description: "created task",
    target: "Accessibility audit for forms",
    context: "Website Redesign",
    metadata: "Priority: High | Labels: a11y, compliance",
    timestamp: "13 hours ago",
  },
  {
    id: 24,
    user: "David Kim",
    action: "Moved",
    description: "moved task",
    target: "Kubernetes pod autoscaling",
    context: "Backend Revamp",
    metadata: "Column: In Review \u2192 Done",
    timestamp: "14 hours ago",
  },
  {
    id: 25,
    user: "Sarah Chen",
    action: "Invited",
    description: "invited",
    target: "Lisa Martinez",
    context: "Website Redesign",
    metadata: "Role: Designer | Sent via email",
    timestamp: "15 hours ago",
  },
];

const users = [
  "All Users",
  "Sarah Chen",
  "Alex Rivera",
  "Maria Santos",
  "Jake Wilson",
  "Emily Park",
  "David Kim",
];

const filterableActionTypes: ActionType[] = [
  "Created",
  "Updated",
  "Deleted",
  "Commented",
  "Moved",
];

function mapActionToFilter(action: ActionType): ActionType {
  if (action === "Archived") return "Deleted";
  if (action === "Invited" || action === "Changed") return "Updated";
  return action;
}

export default function ActivityPage() {
  const [dateRange, setDateRange] = useState("all");
  const [userFilter, setUserFilter] = useState("All Users");
  const [actionFilter, setActionFilter] = useState("All");
  const [showExtra, setShowExtra] = useState(false);

  const allEntries = useMemo(
    () => (showExtra ? [...initialEntries, ...extraEntries] : initialEntries),
    [showExtra]
  );

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      if (userFilter !== "All Users" && entry.user !== userFilter) return false;
      if (actionFilter !== "All") {
        const mapped = mapActionToFilter(entry.action);
        if (mapped !== actionFilter) return false;
      }
      if (dateRange === "today") {
        const idx = allEntries.indexOf(entry);
        if (idx > 14) return false;
      }
      if (dateRange === "7d") {
        return true;
      }
      if (dateRange === "30d") {
        return true;
      }
      return true;
    });
  }, [allEntries, userFilter, actionFilter, dateRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ScrollText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
            <p className="text-sm text-muted-foreground">
              Track all actions and changes across your workspace.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Actions</SelectItem>
              {filterableActionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">
            {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {filteredEntries.map((entry, index) => (
            <div key={entry.id} className="relative flex gap-4 pb-6">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <Avatar className="h-[46px] w-[46px] border-2 border-background shadow-sm">
                  <AvatarFallback
                    className={cn(
                      "text-xs font-semibold",
                      avatarColors[entry.user] || "bg-muted"
                    )}
                  >
                    {getInitials(entry.user)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-foreground">
                        {entry.user}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {entry.description}
                      </span>{" "}
                      <span className="font-semibold text-foreground">
                        {entry.target}
                      </span>
                      {entry.context && (
                        <>
                          {" "}
                          <span className="text-muted-foreground">in</span>{" "}
                          <span className="font-medium text-foreground">
                            {entry.context}
                          </span>
                        </>
                      )}
                    </p>
                    {entry.metadata && (
                      <p className="text-xs text-muted-foreground">
                        {entry.metadata}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      className={cn(
                        "text-[11px] font-medium border-0",
                        actionBadgeColors[entry.action]
                      )}
                    >
                      {entry.action}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {entry.timestamp}
                    </span>
                  </div>
                </div>
                {index < filteredEntries.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ScrollText className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              No activity found
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredEntries.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowExtra(!showExtra)}
            className="px-8"
          >
            {showExtra ? "Show Less" : "Load More"}
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 transition-transform",
                showExtra && "rotate-180"
              )}
            />
          </Button>
        </div>
      )}
    </div>
  );
}
