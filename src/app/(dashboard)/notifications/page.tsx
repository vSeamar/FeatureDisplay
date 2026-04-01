"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Clock,
  AtSign,
  CheckCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatRelativeDate } from "@/lib/utils";

type NotificationType =
  | "task_assigned"
  | "comment_mention"
  | "project_invite"
  | "task_completed"
  | "due_date_reminder";

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  detail: string;
  time: Date;
  read: boolean;
}

const notificationConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  task_assigned: {
    icon: UserPlus,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  comment_mention: {
    icon: AtSign,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/40",
  },
  project_invite: {
    icon: Bell,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/40",
  },
  task_completed: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  due_date_reminder: {
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/40",
  },
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "task_assigned",
    message: "Sarah Chen assigned you to 'Implement SSO login'",
    detail: "Backend Revamp · High priority",
    time: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: 2,
    type: "comment_mention",
    message: "Alex mentioned you in 'API rate limiting discussion'",
    detail: '"@you what do you think about the token bucket approach?"',
    time: new Date(Date.now() - 1000 * 60 * 18),
    read: false,
  },
  {
    id: 3,
    type: "due_date_reminder",
    message: "Task 'Finalize API contracts' is due tomorrow",
    detail: "Backend Revamp · Urgent priority",
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: 4,
    type: "task_completed",
    message: "Maria completed 'User onboarding wireframes'",
    detail: "UI Library · 23 of 28 tasks now complete",
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
  },
  {
    id: 5,
    type: "project_invite",
    message: "You were invited to join 'Data Pipeline v2'",
    detail: "Invited by Jake Williams · 8 team members",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: 6,
    type: "comment_mention",
    message: "Jake mentioned you in 'Performance audit results'",
    detail: '"@you the latency numbers look great after your fix"',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
  },
  {
    id: 7,
    type: "task_assigned",
    message: "You were assigned to 'Set up CI/CD pipeline'",
    detail: "Analytics Dashboard · Medium priority",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
  {
    id: 8,
    type: "task_completed",
    message: "Alex completed 'Database schema migration'",
    detail: "Backend Revamp · All blockers resolved",
    time: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
  },
  {
    id: 9,
    type: "due_date_reminder",
    message: "Task 'Submit design review' is due in 3 days",
    detail: "UI Library · High priority",
    time: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: true,
  },
  {
    id: 10,
    type: "project_invite",
    message: "You were invited to join 'Mobile App Redesign'",
    detail: "Invited by Emily Park · 5 team members",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
  {
    id: 11,
    type: "task_assigned",
    message: "Emily assigned you to 'Write integration tests'",
    detail: "Mobile App · Low priority",
    time: new Date(Date.now() - 1000 * 60 * 60 * 36),
    read: true,
  },
  {
    id: 12,
    type: "comment_mention",
    message: "Sarah mentioned you in 'Sprint retro notes'",
    detail: '"@you great work on the auth module this sprint"',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filterNotifications = (tab: string) => {
    switch (tab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "mentions":
        return notifications.filter((n) => n.type === "comment_mention");
      case "assignments":
        return notifications.filter((n) => n.type === "task_assigned");
      default:
        return notifications;
    }
  };

  const renderList = (items: Notification[]) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCheck className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No notifications here</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {items.map((notification) => {
          const config = notificationConfig[notification.type];
          const Icon = config.icon;
          return (
            <button
              key={notification.id}
              onClick={() => toggleRead(notification.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50",
                !notification.read && "bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  config.bg
                )}
              >
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm leading-snug",
                      !notification.read && "font-medium"
                    )}
                  >
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {notification.detail}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatRelativeDate(notification.time)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread" className="gap-1.5">
            Unread
            {unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-medium text-white">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardContent className="p-2">
            <TabsContent value="all" className="m-0">
              {renderList(filterNotifications("all"))}
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              {renderList(filterNotifications("unread"))}
            </TabsContent>
            <TabsContent value="mentions" className="m-0">
              {renderList(filterNotifications("mentions"))}
            </TabsContent>
            <TabsContent value="assignments" className="m-0">
              {renderList(filterNotifications("assignments"))}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
