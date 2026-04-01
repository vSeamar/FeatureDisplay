"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  DollarSign,
  TrendingUp,
  Timer,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

interface TimesheetRow {
  id: string;
  project: string;
  task: string;
  hours: number[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const initialTimesheetData: TimesheetRow[] = [
  { id: "r1", project: "Website Redesign", task: "Homepage design", hours: [2, 1.5, 2, 0, 1.5, 1, 0] },
  { id: "r2", project: "API Platform", task: "Auth endpoints", hours: [3, 2, 2.5, 2, 1.5, 0, 1] },
  { id: "r3", project: "Mobile App", task: "Push notifications", hours: [0, 1, 1.5, 2, 1.5, 0, 0] },
  { id: "r4", project: "Marketing", task: "Campaign setup", hours: [0, 0, 1.5, 0, 1.5, 0, 0] },
  { id: "r5", project: "Design System", task: "Component library", hours: [1.5, 1, 0, 1.5, 1, 0, 0] },
  { id: "r6", project: "Meetings", task: "Team standup", hours: [0.5, 0.5, 0.5, 0.5, 0.5, 0, 0] },
];

const projects = [
  "Website Redesign",
  "API Platform",
  "Mobile App",
  "Marketing",
  "Design System",
  "Meetings",
];

const tasks: Record<string, string[]> = {
  "Website Redesign": ["Homepage design", "Navigation rework", "Contact page", "Fix login redirect bug"],
  "API Platform": ["Auth endpoints", "Rate limiting", "Documentation"],
  "Mobile App": ["Push notifications", "Offline mode", "UI polish"],
  "Marketing": ["Campaign setup", "Social media", "Email templates"],
  "Design System": ["Component library", "Color tokens", "Typography"],
  "Meetings": ["Team standup", "Sprint planning", "Retrospective"],
};

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimeTrackingPage() {
  const [timesheetData, setTimesheetData] = useState<TimesheetRow[]>(initialTimesheetData);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTimerTask, setCurrentTimerTask] = useState("Fix login redirect bug");
  const [currentTimerProject, setCurrentTimerProject] = useState("Website Redesign");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [logProject, setLogProject] = useState("");
  const [logTask, setLogTask] = useState("");
  const [logDate, setLogDate] = useState("2026-03-31");
  const [logDuration, setLogDuration] = useState("");
  const [logDescription, setLogDescription] = useState("");
  const [logBillable, setLogBillable] = useState(true);

  const startTimer = useCallback(() => {
    setTimerRunning(true);
    setTimerPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setTimerPaused(false);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerPaused(false);
    setElapsedSeconds(0);
  }, []);

  useEffect(() => {
    if (timerRunning && !timerPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerPaused]);

  const updateHours = (rowIndex: number, dayIndex: number, value: string) => {
    const parsed = parseFloat(value);
    const newVal = isNaN(parsed) ? 0 : parsed;
    setTimesheetData((prev) =>
      prev.map((row, i) =>
        i === rowIndex ? { ...row, hours: row.hours.map((h, j) => (j === dayIndex ? newVal : h)) } : row
      )
    );
  };

  const addRow = () => {
    setTimesheetData((prev) => [
      ...prev,
      { id: `r${prev.length + 1}`, project: "Website Redesign", task: "New task", hours: [0, 0, 0, 0, 0, 0, 0] },
    ]);
  };

  const getRowTotal = (row: TimesheetRow) => row.hours.reduce((sum, h) => sum + h, 0);

  const getDayTotal = (dayIndex: number) =>
    timesheetData.reduce((sum, row) => sum + row.hours[dayIndex], 0);

  const grandTotal = timesheetData.reduce((sum, row) => sum + getRowTotal(row), 0);

  const billableHours = 28;
  const weeklyTarget = 40;

  const mostTimeProject = timesheetData.reduce(
    (best, row) => {
      const total = getRowTotal(row);
      return total > best.hours ? { project: row.project, hours: total } : best;
    },
    { project: "", hours: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Time Tracking</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Track time across projects and manage your weekly timesheet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Log Time
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Log Time Entry</DialogTitle>
                <DialogDescription>Manually log time for a task.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select value={logProject} onValueChange={setLogProject}>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Task</Label>
                  <Select value={logTask} onValueChange={setLogTask}>
                    <SelectTrigger><SelectValue placeholder="Select task" /></SelectTrigger>
                    <SelectContent>
                      {(tasks[logProject] || []).map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (hours)</Label>
                    <Input type="text" placeholder="e.g. 2:30" value={logDuration} onChange={(e) => setLogDuration(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="What did you work on?"
                    value={logDescription}
                    onChange={(e) => setLogDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="billable-toggle">Billable</Label>
                  <Switch id="billable-toggle" checked={logBillable} onCheckedChange={setLogBillable} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLogDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setLogDialogOpen(false)}>Save Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            size="sm"
            onClick={() => {
              if (!timerRunning) {
                startTimer();
              } else {
                setLogDialogOpen(true);
              }
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Start Timer
          </Button>
        </div>
      </div>

      {/* Active Timer */}
      {timerRunning && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Currently tracking</p>
                  <p className="font-medium">
                    {currentTimerTask} <span className="text-muted-foreground">&mdash; {currentTimerProject}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-3xl font-bold tabular-nums tracking-wider">
                  {formatTime(elapsedSeconds)}
                </span>
                <div className="flex items-center gap-2">
                  {timerPaused ? (
                    <Button size="icon" variant="outline" onClick={resumeTimer} className="h-9 w-9">
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="icon" variant="outline" onClick={pauseTimer} className="h-9 w-9">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="destructive" onClick={stopTimer} className="h-9 w-9">
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period Tabs */}
      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-6">
          {/* Timesheet Grid */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Weekly Timesheet</CardTitle>
              <CardDescription>Mar 25 &ndash; Mar 31, 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 pr-4 font-medium text-muted-foreground" style={{ minWidth: 200 }}>
                        Project / Task
                      </th>
                      {DAYS.map((day) => (
                        <th key={day} className="pb-3 text-center font-medium text-muted-foreground" style={{ minWidth: 64 }}>
                          {day}
                        </th>
                      ))}
                      <th className="pb-3 text-center font-medium text-muted-foreground" style={{ minWidth: 64 }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timesheetData.map((row, rowIndex) => (
                      <tr key={row.id} className="border-b last:border-0">
                        <td className="py-2.5 pr-4">
                          <p className="font-medium">{row.project}</p>
                          <p className="text-xs text-muted-foreground">{row.task}</p>
                        </td>
                        {row.hours.map((h, dayIndex) => (
                          <td key={dayIndex} className="py-2.5 text-center">
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              max="24"
                              value={h || ""}
                              onChange={(e) => updateHours(rowIndex, dayIndex, e.target.value)}
                              className="mx-auto h-8 w-14 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              placeholder="0"
                            />
                          </td>
                        ))}
                        <td className="py-2.5 text-center">
                          <span className="font-semibold tabular-nums">{getRowTotal(row)}h</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td className="py-3 pr-4 font-semibold">Daily Total</td>
                      {DAYS.map((_, dayIndex) => (
                        <td key={dayIndex} className="py-3 text-center font-semibold tabular-nums">
                          {getDayTotal(dayIndex)}h
                        </td>
                      ))}
                      <td className="py-3 text-center">
                        <Badge variant="default" className="text-sm font-bold">
                          {grandTotal}h
                        </Badge>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={addRow}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Row
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Timer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Total this week</p>
                    <p className="text-2xl font-bold tabular-nums">{grandTotal}h</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{grandTotal}h logged</span>
                    <span>{weeklyTarget}h target</span>
                  </div>
                  <Progress value={(grandTotal / weeklyTarget) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billable hours</p>
                    <p className="text-2xl font-bold tabular-nums">{billableHours}h</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {Math.round((billableHours / grandTotal) * 100)}% of total hours are billable
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Most time spent on</p>
                    <p className="text-lg font-bold">{mostTimeProject.project}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {mostTimeProject.hours}h this week
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg font-medium">Monthly View</p>
              <p className="mt-1 text-sm text-muted-foreground">
                March 2026 &mdash; 145.5 hours logged across 4 weeks.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
