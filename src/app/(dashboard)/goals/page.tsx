"use client";

import { useState } from "react";
import {
  Target,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { cn, getInitials } from "@/lib/utils";

interface KeyResult {
  id: string;
  title: string;
  progress: number;
  current: string;
  status: "completed" | "on-track" | "at-risk" | "behind";
}

interface Goal {
  id: string;
  title: string;
  owner: string;
  ownerColor: string;
  status: "on-track" | "at-risk" | "behind";
  progress: number;
  keyResults: KeyResult[];
}

const goalsData: Goal[] = [
  {
    id: "g1",
    title: "Launch Mobile App v2",
    owner: "Alex Rivera",
    ownerColor: "bg-violet-600",
    status: "on-track",
    progress: 75,
    keyResults: [
      { id: "kr1a", title: "Complete UI redesign", progress: 100, current: "Completed", status: "completed" },
      { id: "kr1b", title: "Achieve 4.5+ App Store rating", progress: 60, current: "Current: 4.3/5", status: "on-track" },
      { id: "kr1c", title: "Onboard 1000 beta users", progress: 65, current: "Current: 650/1000", status: "on-track" },
    ],
  },
  {
    id: "g2",
    title: "Improve API Response Time",
    owner: "Sarah Chen",
    ownerColor: "bg-blue-600",
    status: "at-risk",
    progress: 45,
    keyResults: [
      { id: "kr2a", title: "Reduce p95 latency below 200ms", progress: 40, current: "Current: 280ms", status: "at-risk" },
      { id: "kr2b", title: "Implement caching layer", progress: 80, current: "Almost done", status: "on-track" },
      { id: "kr2c", title: "Zero downtime deployments", progress: 15, current: "Just started", status: "behind" },
    ],
  },
  {
    id: "g3",
    title: "Grow Revenue 30% QoQ",
    owner: "Demo User",
    ownerColor: "bg-indigo-600",
    status: "on-track",
    progress: 68,
    keyResults: [
      { id: "kr3a", title: "Acquire 50 new enterprise accounts", progress: 70, current: "Current: 35/50", status: "on-track" },
      { id: "kr3b", title: "Increase ARPU to $85", progress: 55, current: "Current: $72", status: "at-risk" },
      { id: "kr3c", title: "Reduce churn below 3%", progress: 80, current: "Current: 2.8%", status: "on-track" },
    ],
  },
  {
    id: "g4",
    title: "Build World-Class Engineering Culture",
    owner: "Jordan Kim",
    ownerColor: "bg-emerald-600",
    status: "behind",
    progress: 30,
    keyResults: [
      { id: "kr4a", title: "Hire 5 senior engineers", progress: 40, current: "Current: 2/5", status: "at-risk" },
      { id: "kr4b", title: "100% test coverage on critical paths", progress: 25, current: "In progress", status: "behind" },
      { id: "kr4c", title: "Ship weekly engineering blog posts", progress: 25, current: "3/12 posts", status: "behind" },
    ],
  },
];

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  "on-track": {
    label: "On Track",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: TrendingUp,
  },
  "at-risk": {
    label: "At Risk",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertTriangle,
  },
  behind: {
    label: "Behind",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertCircle,
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
};

function progressBarColor(progress: number): string {
  if (progress >= 80) return "[&>div]:bg-green-500";
  if (progress >= 50) return "[&>div]:bg-blue-500";
  if (progress >= 30) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
}

export default function GoalsPage() {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(["g1"]));
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingKR, setEditingKR] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [period, setPeriod] = useState("q1-2026");

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalOwner, setNewGoalOwner] = useState("");
  const [newGoalKeyResults, setNewGoalKeyResults] = useState([
    { title: "", target: "" },
  ]);

  const toggleGoal = (id: string) => {
    setExpandedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addKeyResultRow = () => {
    setNewGoalKeyResults((prev) => [...prev, { title: "", target: "" }]);
  };

  const removeKeyResultRow = (index: number) => {
    setNewGoalKeyResults((prev) => prev.filter((_, i) => i !== index));
  };

  const onTrackCount = goalsData.filter((g) => g.status === "on-track").length;
  const overallPercentage = Math.round(
    (onTrackCount / goalsData.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Goals & OKRs</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Track objectives and key results across your team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1-2026">Q1 2026</SelectItem>
              <SelectItem value="q2-2026">Q2 2026</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Goal</DialogTitle>
                <DialogDescription>Define a new objective with measurable key results.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Goal Title</Label>
                  <Input
                    placeholder="e.g. Launch Mobile App v2"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the objective..."
                    value={newGoalDescription}
                    onChange={(e) => setNewGoalDescription(e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Owner</Label>
                    <Select value={newGoalOwner} onValueChange={setNewGoalOwner}>
                      <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alex">Alex Rivera</SelectItem>
                        <SelectItem value="sarah">Sarah Chen</SelectItem>
                        <SelectItem value="demo">Demo User</SelectItem>
                        <SelectItem value="jordan">Jordan Kim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Period</Label>
                    <Select defaultValue="q1-2026">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1-2026">Q1 2026</SelectItem>
                        <SelectItem value="q2-2026">Q2 2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Target Metric</Label>
                  <Input placeholder="e.g. 1000 beta users" />
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Key Results</Label>
                    <Button variant="ghost" size="sm" onClick={addKeyResultRow}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                  {newGoalKeyResults.map((kr, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Key result title"
                          value={kr.title}
                          onChange={(e) => {
                            const copy = [...newGoalKeyResults];
                            copy[i] = { ...copy[i], title: e.target.value };
                            setNewGoalKeyResults(copy);
                          }}
                        />
                        <Input
                          placeholder="Target value (e.g. 4.5 rating)"
                          value={kr.target}
                          onChange={(e) => {
                            const copy = [...newGoalKeyResults];
                            copy[i] = { ...copy[i], target: e.target.value };
                            setNewGoalKeyResults(copy);
                          }}
                        />
                      </div>
                      {newGoalKeyResults.length > 1 && (
                        <Button variant="ghost" size="icon" className="mt-1 h-8 w-8 shrink-0" onClick={() => removeKeyResultRow(i)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setCreateDialogOpen(false)}>Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overall progress card */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Q1 2026 Progress</p>
                <p className="text-xs text-muted-foreground">
                  {onTrackCount} of {goalsData.length} goals on track &mdash; {overallPercentage}% overall
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-muted-foreground">On Track ({goalsData.filter((g) => g.status === "on-track").length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">At Risk ({goalsData.filter((g) => g.status === "at-risk").length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Behind ({goalsData.filter((g) => g.status === "behind").length})</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        {goalsData.map((goal) => {
          const isExpanded = expandedGoals.has(goal.id);
          const config = statusConfig[goal.status];
          return (
            <Card key={goal.id}>
              <div
                className="flex cursor-pointer items-center gap-4 p-5"
                onClick={() => toggleGoal(goal.id)}
              >
                <button className="shrink-0 text-muted-foreground transition-transform">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <Badge variant="secondary" className={cn("text-xs", config.className)}>
                      {config.label}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className={cn("text-[10px] text-white", goal.ownerColor)}>
                          {getInitials(goal.owner)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{goal.owner}</span>
                    </div>
                    <span>&middot;</span>
                    <span>{goal.keyResults.length} key results</span>
                  </div>
                </div>
                <div className="flex w-32 shrink-0 flex-col items-end gap-1.5">
                  <span className="text-sm font-semibold">{goal.progress}%</span>
                  <Progress
                    value={goal.progress}
                    className={cn("h-2 w-full", progressBarColor(goal.progress))}
                  />
                </div>
              </div>

              {isExpanded && (
                <>
                  <Separator />
                  <div className="space-y-1 px-5 py-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Key Results
                    </p>
                    {goal.keyResults.map((kr) => {
                      const krConfig = statusConfig[kr.status];
                      const isEditing = editingKR === kr.id;
                      return (
                        <div
                          key={kr.id}
                          className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {kr.status === "completed" ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                              ) : (
                                <div className={cn(
                                  "h-2 w-2 shrink-0 rounded-full",
                                  kr.status === "on-track" && "bg-green-500",
                                  kr.status === "at-risk" && "bg-yellow-500",
                                  kr.status === "behind" && "bg-red-500",
                                )} />
                              )}
                              <span className={cn("text-sm font-medium", kr.status === "completed" && "line-through text-muted-foreground")}>
                                {kr.title}
                              </span>
                            </div>
                            <p className="ml-6 mt-0.5 text-xs text-muted-foreground">{kr.current}</p>
                          </div>
                          <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                            <Progress
                              value={kr.progress}
                              className={cn("h-1.5 flex-1", progressBarColor(kr.progress))}
                            />
                            <span className="w-10 text-right text-xs font-medium tabular-nums">
                              {kr.progress}%
                            </span>
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  className="h-7 w-16 text-xs"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingKR(null);
                                  }}
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs text-muted-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingKR(kr.id);
                                  setEditValue(String(kr.progress));
                                }}
                              >
                                Update
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
