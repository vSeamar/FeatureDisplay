"use client";

import { useState, useRef } from "react";
import {
  FileBarChart,
  Plus,
  Clock,
  Play,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  X,
  Table,
  BarChart3,
  LineChart,
  PieChart,
  CalendarClock,
  Filter,
  CheckSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const savedReports = [
  {
    id: 1,
    title: "Weekly Sprint Summary",
    type: "Sprint",
    lastRun: "2 hours ago",
    scheduled: true,
    scheduleFreq: "Weekly",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: 2,
    title: "Team Velocity Report",
    type: "Performance",
    lastRun: "1 day ago",
    scheduled: false,
    scheduleFreq: null,
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    id: 3,
    title: "Overdue Tasks Report",
    type: "Tasks",
    lastRun: "3 hours ago",
    scheduled: false,
    scheduleFreq: null,
    itemsFound: 12,
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    id: 4,
    title: "Project Health Overview",
    type: "Projects",
    lastRun: "5 hours ago",
    scheduled: false,
    scheduleFreq: null,
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

const mockPreviewData = [
  {
    title: "Redesign landing page",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Chen",
    project: "Website Redesign",
    dueDate: "Apr 2, 2026",
    created: "Mar 15, 2026",
    updated: "Mar 30, 2026",
  },
  {
    title: "Fix authentication bug",
    status: "Done",
    priority: "Urgent",
    assignee: "Alex Rivera",
    project: "API Platform",
    dueDate: "Mar 28, 2026",
    created: "Mar 20, 2026",
    updated: "Mar 28, 2026",
  },
  {
    title: "Write API documentation",
    status: "In Review",
    priority: "Medium",
    assignee: "Maria Santos",
    project: "API Platform",
    dueDate: "Apr 5, 2026",
    created: "Mar 18, 2026",
    updated: "Mar 29, 2026",
  },
  {
    title: "Implement dark mode",
    status: "To Do",
    priority: "Low",
    assignee: "Jake Wilson",
    project: "Mobile App",
    dueDate: "Apr 10, 2026",
    created: "Mar 22, 2026",
    updated: "Mar 22, 2026",
  },
  {
    title: "Database migration script",
    status: "In Progress",
    priority: "High",
    assignee: "David Kim",
    project: "Backend Revamp",
    dueDate: "Apr 1, 2026",
    created: "Mar 12, 2026",
    updated: "Mar 31, 2026",
  },
  {
    title: "User onboarding flow",
    status: "In Progress",
    priority: "Medium",
    assignee: "Emily Park",
    project: "Website Redesign",
    dueDate: "Apr 8, 2026",
    created: "Mar 25, 2026",
    updated: "Mar 30, 2026",
  },
  {
    title: "Performance optimization",
    status: "To Do",
    priority: "High",
    assignee: "Alex Rivera",
    project: "Backend Revamp",
    dueDate: "Apr 12, 2026",
    created: "Mar 28, 2026",
    updated: "Mar 28, 2026",
  },
  {
    title: "Push notification service",
    status: "In Review",
    priority: "Medium",
    assignee: "Jake Wilson",
    project: "Mobile App",
    dueDate: "Apr 3, 2026",
    created: "Mar 14, 2026",
    updated: "Mar 31, 2026",
  },
];

const defaultColumns = [
  { key: "title", label: "Title", checked: true },
  { key: "status", label: "Status", checked: true },
  { key: "priority", label: "Priority", checked: true },
  { key: "assignee", label: "Assignee", checked: true },
  { key: "project", label: "Project", checked: true },
  { key: "dueDate", label: "Due Date", checked: true },
  { key: "created", label: "Created", checked: false },
  { key: "updated", label: "Updated", checked: false },
];

const statusColor: Record<string, string> = {
  "To Do": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "In Progress":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "In Review":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const priorityColor: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const chartTypes = [
  { key: "table", label: "Table", icon: Table },
  { key: "bar", label: "Bar Chart", icon: BarChart3 },
  { key: "line", label: "Line Chart", icon: LineChart },
  { key: "pie", label: "Pie Chart", icon: PieChart },
];

export default function ReportsPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("tasks");
  const [dateRange, setDateRange] = useState("30d");
  const [groupBy, setGroupBy] = useState("status");
  const [chartType, setChartType] = useState("table");
  const [columns, setColumns] = useState(defaultColumns);
  const [filters, setFilters] = useState([
    { field: "status", operator: "is", value: "In Progress" },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [scheduleFreq, setScheduleFreq] = useState("weekly");
  const [scheduleDay, setScheduleDay] = useState("monday");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleFormat, setScheduleFormat] = useState("pdf");
  const [recipients, setRecipients] = useState(["team@taskflow.io"]);
  const recipientInputRef = useRef<HTMLInputElement>(null);

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, checked: !col.checked } : col
      )
    );
  };

  const addFilter = () => {
    setFilters((prev) => [
      ...prev,
      { field: "priority", operator: "is", value: "" },
    ]);
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const addRecipient = () => {
    const input = recipientInputRef.current;
    if (input && input.value && input.value.includes("@")) {
      setRecipients((prev) => [...prev, input.value]);
      input.value = "";
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index));
  };

  const visibleColumns = columns.filter((c) => c.checked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
            <FileBarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Build and schedule custom reports for your team.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScheduleOpen(true)}
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setShowBuilder(true);
              setShowPreview(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      {/* Saved Reports Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {savedReports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="text-sm">{report.title}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", report.badge)}
                  >
                    {report.type}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Last run: {report.lastRun}
                </div>
                {report.scheduled && (
                  <div className="flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Auto-scheduled {report.scheduleFreq?.toLowerCase()}
                  </div>
                )}
                {"itemsFound" in report && (
                  <div className="flex items-center gap-1.5">
                    <Filter className="h-3.5 w-3.5" />
                    {report.itemsFound} items found
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Play className="mr-1.5 h-3 w-3" />
                Run Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Report Builder Section */}
      {showBuilder && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Report Builder</CardTitle>
                <CardDescription>
                  Configure your custom report step by step.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowBuilder(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1: Name and Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Report Name</Label>
                <Input
                  placeholder="e.g., Weekly Sprint Summary"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tasks">Tasks</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="performance">
                      Team Performance
                    </SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Date Range and Group By */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Group By</Label>
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="assignee">Assignee</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Filters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Filters</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFilter}
                  className="text-xs"
                >
                  <Plus className="mr-1.5 h-3 w-3" />
                  Add Filter
                </Button>
              </div>
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={filter.field}
                      onValueChange={(val) =>
                        setFilters((prev) =>
                          prev.map((f, i) =>
                            i === index ? { ...f, field: val } : f
                          )
                        )
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="assignee">Assignee</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filter.operator}
                      onValueChange={(val) =>
                        setFilters((prev) =>
                          prev.map((f, i) =>
                            i === index ? { ...f, operator: val } : f
                          )
                        )
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="is">is</SelectItem>
                        <SelectItem value="is_not">is not</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="flex-1"
                      placeholder="Value..."
                      value={filter.value}
                      onChange={(e) =>
                        setFilters((prev) =>
                          prev.map((f, i) =>
                            i === index ? { ...f, value: e.target.value } : f
                          )
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-red-600"
                      onClick={() => removeFilter(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Columns to Include */}
            <div className="space-y-3">
              <Label>Columns to Include</Label>
              <div className="flex flex-wrap gap-3">
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      role="checkbox"
                      aria-checked={col.checked}
                      tabIndex={0}
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                        col.checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-transparent"
                      )}
                      onClick={() => toggleColumn(col.key)}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter")
                          toggleColumn(col.key);
                      }}
                    >
                      {col.checked && <CheckSquare className="h-3 w-3" />}
                    </div>
                    <span className="text-sm">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Chart Type */}
            <div className="space-y-3">
              <Label>Chart Type</Label>
              <div className="flex gap-2">
                {chartTypes.map((ct) => (
                  <Button
                    key={ct.key}
                    variant={chartType === ct.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType(ct.key)}
                    className="gap-1.5"
                  >
                    <ct.icon className="h-4 w-4" />
                    {ct.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Generate */}
            <Button
              onClick={() => setShowPreview(true)}
              className="w-full sm:w-auto"
            >
              Generate Report
            </Button>

            {/* Preview Area */}
            {showPreview && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Report Preview</h3>
                  <Badge variant="secondary" className="text-xs">
                    {mockPreviewData.length} results
                  </Badge>
                </div>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {visibleColumns.map((col) => (
                          <th
                            key={col.key}
                            className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockPreviewData.map((row, i) => (
                        <tr
                          key={i}
                          className={cn(
                            "border-b last:border-0",
                            i % 2 === 0 ? "bg-background" : "bg-muted/20"
                          )}
                        >
                          {visibleColumns.map((col) => {
                            const value =
                              row[col.key as keyof typeof row] ?? "";
                            if (col.key === "status") {
                              return (
                                <td key={col.key} className="px-4 py-2.5">
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      "text-xs",
                                      statusColor[value] || ""
                                    )}
                                  >
                                    {value}
                                  </Badge>
                                </td>
                              );
                            }
                            if (col.key === "priority") {
                              return (
                                <td key={col.key} className="px-4 py-2.5">
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      "text-xs",
                                      priorityColor[value] || ""
                                    )}
                                  >
                                    {value}
                                  </Badge>
                                </td>
                              );
                            }
                            return (
                              <td
                                key={col.key}
                                className="px-4 py-2.5 whitespace-nowrap"
                              >
                                {value}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schedule Report Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>
              Set up automatic report generation and delivery.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={scheduleFreq} onValueChange={setScheduleFreq}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {scheduleFreq === "weekly" && (
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select value={scheduleDay} onValueChange={setScheduleDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select
                  value={scheduleFormat}
                  onValueChange={setScheduleFormat}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex gap-2">
                <Input
                  ref={recipientInputRef}
                  type="email"
                  placeholder="email@example.com"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRecipient();
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={addRecipient}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {recipients.map((email, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {email}
                    <button
                      onClick={() => removeRecipient(i)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setScheduleOpen(false)}>
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
