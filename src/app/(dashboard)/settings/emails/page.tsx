"use client";

import { useState } from "react";
import {
  Mail,
  Bell,
  Clock,
  CheckSquare,
  FolderOpen,
  MessageSquare,
  Users,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type NotificationSetting = {
  id: string;
  category: string;
  categoryIcon: React.ElementType;
  name: string;
  email: boolean;
  inApp: string;
};

const initialNotifications: NotificationSetting[] = [
  { id: "task-assigned", category: "Tasks", categoryIcon: CheckSquare, name: "Task assigned to me", email: true, inApp: "Always" },
  { id: "task-updated", category: "Tasks", categoryIcon: CheckSquare, name: "Task I created is updated", email: true, inApp: "Always" },
  { id: "task-due", category: "Tasks", categoryIcon: CheckSquare, name: "Task due date approaching", email: true, inApp: "Always" },
  { id: "task-overdue", category: "Tasks", categoryIcon: CheckSquare, name: "Task overdue", email: true, inApp: "Always" },
  { id: "project-invite", category: "Projects", categoryIcon: FolderOpen, name: "New project invitation", email: true, inApp: "Always" },
  { id: "project-status", category: "Projects", categoryIcon: FolderOpen, name: "Project status changed", email: false, inApp: "Always" },
  { id: "comment-mention", category: "Comments", categoryIcon: MessageSquare, name: "Mentioned in a comment", email: true, inApp: "Always" },
  { id: "comment-reply", category: "Comments", categoryIcon: MessageSquare, name: "Reply to my comment", email: true, inApp: "Always" },
  { id: "comment-task", category: "Comments", categoryIcon: MessageSquare, name: "New comment on my task", email: false, inApp: "Always" },
  { id: "team-join", category: "Team", categoryIcon: Users, name: "New member joined", email: false, inApp: "Always" },
  { id: "team-role", category: "Team", categoryIcon: Users, name: "Member role changed", email: false, inApp: "Always" },
  { id: "system-weekly", category: "System", categoryIcon: Settings, name: "Weekly summary report", email: true, inApp: "N/A" },
  { id: "system-updates", category: "System", categoryIcon: Settings, name: "Product updates & changelog", email: true, inApp: "N/A" },
  { id: "system-security", category: "System", categoryIcon: Settings, name: "Security alerts", email: true, inApp: "Always" },
];

const frequencyOptions = [
  { value: "instant", label: "Instant" },
  { value: "daily", label: "Daily Digest" },
  { value: "weekly", label: "Weekly Digest" },
  { value: "never", label: "Never" },
];

const timeOptions = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function EmailPreferencesPage() {
  const [frequency, setFrequency] = useState("weekly");
  const [deliveryTime, setDeliveryTime] = useState("9:00 AM");
  const [deliveryDay, setDeliveryDay] = useState("Monday");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unsubscribeDialogOpen, setUnsubscribeDialogOpen] = useState(false);

  const toggleEmailNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, email: !n.email } : n))
    );
  };

  // Group notifications by category
  const groupedNotifications = notifications.reduce<Record<string, NotificationSetting[]>>(
    (acc, n) => {
      if (!acc[n.category]) acc[n.category] = [];
      acc[n.category].push(n);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Email Preferences</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Control which emails you receive and how often.
          </p>
        </div>
        <Dialog open={unsubscribeDialogOpen} onOpenChange={setUnsubscribeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="text-destructive hover:text-destructive px-0">
              Unsubscribe from all
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Unsubscribe from all emails?
              </DialogTitle>
              <DialogDescription>
                This will disable all email notifications. You will still receive critical security alerts. You can re-enable notifications at any time.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUnsubscribeDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setNotifications((prev) => prev.map((n) => ({ ...n, email: false })));
                  setFrequency("never");
                  setUnsubscribeDialogOpen(false);
                }}
              >
                Unsubscribe from All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Email Digest */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Email Digest</CardTitle>
          </div>
          <CardDescription>Get a summary of activity delivered to your inbox.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(frequency === "daily" || frequency === "weekly") && (
              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select value={deliveryDay} onValueChange={setDeliveryDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notification Types</CardTitle>
          </div>
          <CardDescription>Choose which notifications you want to receive by email.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {/* Table header */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_80px_80px] gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b">
              <div>Notification</div>
              <div className="text-center">Email</div>
              <div className="text-center">In-App</div>
            </div>

            {Object.entries(groupedNotifications).map(([category, items], catIdx) => {
              const CategoryIcon = items[0].categoryIcon;
              return (
                <div key={category}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{category}</span>
                  </div>
                  {/* Notification rows */}
                  {items.map((n, idx) => (
                    <div
                      key={n.id}
                      className={cn(
                        "grid grid-cols-1 sm:grid-cols-[1fr_80px_80px] gap-2 sm:gap-4 items-center px-4 py-3",
                        idx < items.length - 1 || catIdx < Object.keys(groupedNotifications).length - 1
                          ? "border-b"
                          : ""
                      )}
                    >
                      <div className="text-sm pl-6">{n.name}</div>
                      <div className="flex items-center sm:justify-center gap-2">
                        <span className="sm:hidden text-xs text-muted-foreground">Email:</span>
                        <Switch
                          checked={n.email}
                          onCheckedChange={() => toggleEmailNotification(n.id)}
                        />
                      </div>
                      <div className="flex items-center sm:justify-center gap-2">
                        <span className="sm:hidden text-xs text-muted-foreground">In-App:</span>
                        <span className="text-xs text-muted-foreground">{n.inApp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Email Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>This is how your weekly digest email will look.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-white dark:bg-gray-950 overflow-hidden max-w-lg mx-auto">
            {/* Email header */}
            <div className="bg-primary px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TF</span>
                </div>
                <span className="text-white font-semibold text-lg">TaskFlow</span>
              </div>
            </div>

            {/* Email body */}
            <div className="px-6 py-5 space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Your Weekly Digest
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Here is a summary of your activity this week.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">12</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">Tasks Completed</p>
                </div>
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">New Tasks</p>
                </div>
                <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</p>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">Comments</p>
                </div>
              </div>

              <Separator />

              {/* Recent activity */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Recent Activity
                </h4>
                <div className="space-y-2.5">
                  {[
                    { action: "Completed", item: "Update landing page copy", time: "2 hours ago", color: "bg-emerald-500" },
                    { action: "Assigned", item: "Review API documentation", time: "5 hours ago", color: "bg-blue-500" },
                    { action: "Commented on", item: "Design system colors", time: "1 day ago", color: "bg-purple-500" },
                    { action: "Created", item: "Sprint planning agenda", time: "2 days ago", color: "bg-amber-500" },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", activity.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{activity.action}</span>{" "}
                          {activity.item}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <div className="text-center pt-2">
                <div className="inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white">
                  View Full Report
                </div>
              </div>
            </div>

            {/* Email footer */}
            <div className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-900">
              <div className="text-center space-y-1.5">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  You are receiving this because you are subscribed to weekly digests.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  <span className="underline cursor-pointer">Unsubscribe</span>
                  {" "}&middot;{" "}
                  <span className="underline cursor-pointer">Email Preferences</span>
                  {" "}&middot;{" "}
                  <span className="underline cursor-pointer">Help Center</span>
                </p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
                  TaskFlow Inc. &middot; San Francisco, CA
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end pb-4">
        <Button size="lg">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
