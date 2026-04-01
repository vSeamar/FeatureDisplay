"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Calendar,
  Bug,
  Zap,
  Palette,
  BarChart3,
  Users,
  Bell,
  ListChecks,
  Paintbrush,
  Bot,
  FileEdit,
  GaugeCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type BadgeType = "New" | "Fix" | "Improvement" | "Major";

const badgeStyles: Record<BadgeType, string> = {
  New: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  Fix: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  Improvement:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  Major:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
};

const releases = [
  {
    version: "v2.4.0",
    date: "March 28, 2026",
    badge: "New" as BadgeType,
    changes: [
      {
        title: "AI-Powered Task Suggestions",
        description:
          "AI assistant now recommends task priorities based on deadlines and workload patterns.",
        icon: Wand2,
      },
      {
        title: "Calendar Week View",
        description:
          "New weekly calendar view with hourly slots for more granular scheduling.",
        icon: Calendar,
      },
    ],
  },
  {
    version: "v2.3.1",
    date: "March 15, 2026",
    badge: "Fix" as BadgeType,
    changes: [
      {
        title: "Kanban Drag Fix",
        description:
          "Fixed issue where tasks would jump to the wrong column on fast drag operations.",
        icon: Bug,
      },
      {
        title: "Performance Improvement",
        description:
          "Dashboard loads 40% faster with optimized data fetching and rendering.",
        icon: GaugeCircle,
      },
    ],
  },
  {
    version: "v2.3.0",
    date: "March 1, 2026",
    badge: "New" as BadgeType,
    changes: [
      {
        title: "Document Collaboration",
        description:
          "Real-time editing with team members — see cursors and changes instantly.",
        icon: FileEdit,
      },
      {
        title: "Custom Project Colors",
        description:
          "Choose from 12 project accent colors to keep your workspace organized.",
        icon: Palette,
      },
    ],
  },
  {
    version: "v2.2.0",
    date: "February 15, 2026",
    badge: "New" as BadgeType,
    changes: [
      {
        title: "Advanced Analytics",
        description:
          "New chart types and date range filters for deeper project insights.",
        icon: BarChart3,
      },
      {
        title: "Team Performance Metrics",
        description:
          "Track team velocity and completion rates across sprints.",
        icon: Users,
      },
    ],
  },
  {
    version: "v2.1.0",
    date: "February 1, 2026",
    badge: "Improvement" as BadgeType,
    changes: [
      {
        title: "Notification Center Redesign",
        description:
          "Cleaner, faster notification experience with grouped alerts and quick actions.",
        icon: Bell,
      },
      {
        title: "Bulk Task Actions",
        description:
          "Select multiple tasks and update status, assignee, or priority at once.",
        icon: ListChecks,
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "January 15, 2026",
    badge: "Major" as BadgeType,
    changes: [
      {
        title: "Complete UI Overhaul",
        description:
          "New design system with dark mode support, refined typography, and improved accessibility.",
        icon: Paintbrush,
      },
      {
        title: "AI Assistant Launch",
        description:
          "Integrated AI for sprint planning, task management, and intelligent workload balancing.",
        icon: Bot,
      },
    ],
  },
];

export default function ChangelogPage() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              What&apos;s New
            </h1>
            <p className="text-muted-foreground mt-1">
              The latest features, fixes, and improvements to TaskFlow
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="subscribe-updates"
            className="text-sm text-muted-foreground"
          >
            Subscribe to updates
          </Label>
          <Switch
            id="subscribe-updates"
            checked={subscribed}
            onCheckedChange={setSubscribed}
          />
        </div>
      </div>

      {subscribed && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          You&apos;ll receive email notifications when new updates are released.
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {releases.map((release, releaseIndex) => (
          <div key={release.version} className="relative flex gap-6 pb-10 last:pb-0">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                  releaseIndex === 0
                    ? "border-primary"
                    : "border-muted-foreground/30"
                )}
              >
                <div
                  className={cn(
                    "h-3 w-3 rounded-full",
                    releaseIndex === 0
                      ? "bg-primary"
                      : "bg-muted-foreground/40"
                  )}
                />
              </div>
              {releaseIndex < releases.length - 1 && (
                <div className="w-0.5 flex-1 bg-border" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-2 pt-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold">{release.version}</h2>
                <Badge
                  variant="secondary"
                  className={cn(badgeStyles[release.badge])}
                >
                  {release.badge}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {release.date}
                </span>
              </div>

              <div className="space-y-3">
                {release.changes.map((change) => (
                  <Card key={change.title} className="transition-colors hover:bg-muted/30">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <change.icon className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{change.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {change.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
