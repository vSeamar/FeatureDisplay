"use client";

import { useState } from "react";
import {
  Map,
  Plus,
  TriangleIcon,
  MessageSquare,
  LayoutGrid,
  List,
  Clock,
  TrendingUp,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FeatureStatus = "Under Review" | "Planned" | "In Development" | "Released";
type Category = "Enhancement" | "Integration" | "Performance" | "Bug" | "Other";

interface Feature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  votes: number;
  comments: number;
  submittedAgo: string;
  category: Category;
  badge?: string;
  badgeColor?: string;
  releasedDate?: string;
  voted: boolean;
}

const initialFeatures: Feature[] = [
  // Under Review
  {
    id: "f-1",
    title: "Dark Mode for Mobile App",
    description:
      "Add a dark mode theme to the mobile app for better usability in low-light environments.",
    status: "Under Review",
    votes: 42,
    comments: 8,
    submittedAgo: "2 weeks ago",
    category: "Enhancement",
    voted: false,
  },
  {
    id: "f-2",
    title: "Export to Google Sheets",
    description:
      "Enable one-click export of project data and reports directly to Google Sheets.",
    status: "Under Review",
    votes: 28,
    comments: 3,
    submittedAgo: "3 weeks ago",
    category: "Integration",
    voted: false,
  },
  {
    id: "f-3",
    title: "Recurring Tasks",
    description:
      "Support creating tasks that automatically repeat on a daily, weekly, or monthly schedule.",
    status: "Under Review",
    votes: 65,
    comments: 12,
    submittedAgo: "1 month ago",
    category: "Enhancement",
    badge: "Trending",
    badgeColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    voted: false,
  },
  {
    id: "f-4",
    title: "Custom Task Fields",
    description:
      "Allow users to define custom fields on tasks for tracking project-specific metadata.",
    status: "Under Review",
    votes: 33,
    comments: 5,
    submittedAgo: "3 weeks ago",
    category: "Enhancement",
    voted: false,
  },
  // Planned
  {
    id: "f-5",
    title: "Time Tracking Integration",
    description:
      "Integrate with popular time tracking tools like Toggl and Harvest to log hours on tasks.",
    status: "Planned",
    votes: 89,
    comments: 15,
    submittedAgo: "2 months ago",
    category: "Integration",
    badge: "Most Requested",
    badgeColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    voted: false,
  },
  {
    id: "f-6",
    title: "Gantt Chart View",
    description:
      "A timeline-based Gantt chart view for visualizing project schedules and dependencies.",
    status: "Planned",
    votes: 56,
    comments: 7,
    submittedAgo: "6 weeks ago",
    category: "Enhancement",
    voted: false,
  },
  {
    id: "f-7",
    title: "Email Integration",
    description:
      "Create tasks from emails and receive task updates directly in your inbox.",
    status: "Planned",
    votes: 41,
    comments: 4,
    submittedAgo: "1 month ago",
    category: "Integration",
    voted: false,
  },
  // In Development
  {
    id: "f-8",
    title: "Real-time Collaboration",
    description:
      "See teammates editing tasks in real-time with live cursors and instant updates.",
    status: "In Development",
    votes: 120,
    comments: 22,
    submittedAgo: "3 months ago",
    category: "Enhancement",
    badge: "In Progress",
    badgeColor:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    voted: false,
  },
  {
    id: "f-9",
    title: "Mobile App v2",
    description:
      "Complete redesign of the mobile app with offline support and improved performance.",
    status: "In Development",
    votes: 95,
    comments: 18,
    submittedAgo: "4 months ago",
    category: "Performance",
    voted: false,
  },
  // Released
  {
    id: "f-10",
    title: "AI Assistant",
    description:
      "AI-powered assistant that helps prioritize tasks, summarize projects, and draft content.",
    status: "Released",
    votes: 145,
    comments: 30,
    submittedAgo: "5 months ago",
    category: "Enhancement",
    badge: "Shipped",
    badgeColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    releasedDate: "March 2026",
    voted: false,
  },
  {
    id: "f-11",
    title: "Advanced Analytics",
    description:
      "Comprehensive analytics dashboard with custom charts, team velocity, and burn-down reports.",
    status: "Released",
    votes: 78,
    comments: 11,
    submittedAgo: "6 months ago",
    category: "Enhancement",
    releasedDate: "February 2026",
    voted: false,
  },
  {
    id: "f-12",
    title: "Webhook Support",
    description:
      "Send webhook events for task updates, enabling custom integrations with external services.",
    status: "Released",
    votes: 52,
    comments: 6,
    submittedAgo: "7 months ago",
    category: "Integration",
    releasedDate: "January 2026",
    voted: false,
  },
];

const statusColumns: {
  status: FeatureStatus;
  color: string;
  bgColor: string;
  dotColor: string;
}[] = [
  {
    status: "Under Review",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800/50",
    dotColor: "bg-slate-400",
  },
  {
    status: "Planned",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    dotColor: "bg-blue-500",
  },
  {
    status: "In Development",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    dotColor: "bg-purple-500",
  },
  {
    status: "Released",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    dotColor: "bg-emerald-500",
  },
];

const categoryColors: Record<Category, string> = {
  Enhancement:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Integration:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Performance:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Bug: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Other:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

export default function RoadmapPage() {
  const [features, setFeatures] = useState(initialFeatures);
  const [view, setView] = useState<"board" | "list">("board");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [newImportance, setNewImportance] = useState<string>("");

  const toggleVote = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              voted: !f.voted,
              votes: f.voted ? f.votes - 1 : f.votes + 1,
            }
          : f
      )
    );
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setNewCategory("");
    setNewImportance("");
  };

  const sortedFeatures = [...features].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Map className="h-6 w-6 text-teal-500" />
            <h1 className="text-2xl font-bold tracking-tight">
              Product Roadmap
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex rounded-lg border bg-muted p-0.5">
            <button
              onClick={() => setView("board")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === "board"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="mr-1.5 inline h-4 w-4" />
              Board
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="mr-1.5 inline h-4 w-4" />
              List
            </button>
          </div>

          <Dialog
            open={submitOpen}
            onOpenChange={(open) => {
              setSubmitOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit Feature Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit Feature Request</DialogTitle>
                <DialogDescription>
                  Share your idea with the team. Popular requests get
                  prioritized.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="feat-title">Title</Label>
                  <Input
                    id="feat-title"
                    placeholder="e.g., Dark mode for mobile"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feat-desc">Description</Label>
                  <Textarea
                    id="feat-desc"
                    placeholder="Describe your feature request in detail..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enhancement">Enhancement</SelectItem>
                      <SelectItem value="Integration">Integration</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Bug">Bug</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>How important is this to you?</Label>
                  <Select
                    value={newImportance}
                    onValueChange={setNewImportance}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select importance..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="Important">Important</SelectItem>
                      <SelectItem value="Nice to have">Nice to have</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setSubmitOpen(false);
                    resetForm();
                  }}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Board View */}
      {view === "board" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statusColumns.map((column) => {
            const columnFeatures = features.filter(
              (f) => f.status === column.status
            );
            return (
              <div key={column.status} className="space-y-3">
                {/* Column Header */}
                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2",
                    column.bgColor
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        column.dotColor
                      )}
                    />
                    <span
                      className={cn("text-sm font-semibold", column.color)}
                    >
                      {column.status}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {columnFeatures.length}
                  </Badge>
                </div>

                {/* Feature Cards */}
                <div className="space-y-2">
                  {columnFeatures.map((feature) => (
                    <Card
                      key={feature.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          {/* Vote Button */}
                          <button
                            onClick={() => toggleVote(feature.id)}
                            className={cn(
                              "flex shrink-0 flex-col items-center rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                              feature.voted
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
                            )}
                          >
                            <TriangleIcon
                              className={cn(
                                "h-3 w-3",
                                feature.voted && "fill-current"
                              )}
                            />
                            <span className="mt-0.5">{feature.votes}</span>
                          </button>

                          {/* Content */}
                          <div className="flex-1 space-y-1.5 overflow-hidden">
                            <div className="flex items-start gap-1.5">
                              <h4 className="text-sm font-semibold leading-tight">
                                {feature.title}
                              </h4>
                            </div>
                            {feature.badge && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[10px]",
                                  feature.badgeColor
                                )}
                              >
                                {feature.badge}
                              </Badge>
                            )}
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {feature.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {feature.comments}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {feature.submittedAgo}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[10px]",
                                  categoryColors[feature.category]
                                )}
                              >
                                {feature.category}
                              </Badge>
                              {feature.releasedDate && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {feature.releasedDate}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="w-16 px-4 py-3 text-left font-medium text-muted-foreground">
                      Votes
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Comments
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFeatures.map((feature) => {
                    const colMeta = statusColumns.find(
                      (c) => c.status === feature.status
                    );
                    return (
                      <tr key={feature.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleVote(feature.id)}
                            className={cn(
                              "flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                              feature.voted
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            )}
                          >
                            <TriangleIcon
                              className={cn(
                                "h-3 w-3",
                                feature.voted && "fill-current"
                              )}
                            />
                            {feature.votes}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {feature.title}
                            </span>
                            {feature.badge && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[10px]",
                                  feature.badgeColor
                                )}
                              >
                                {feature.badge}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                colMeta?.dotColor
                              )}
                            />
                            <span className={cn("text-xs", colMeta?.color)}>
                              {feature.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            {feature.comments}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px]",
                              categoryColors[feature.category]
                            )}
                          >
                            {feature.category}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {feature.submittedAgo}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
