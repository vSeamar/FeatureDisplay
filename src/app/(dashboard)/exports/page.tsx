"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download,
  FileText,
  Clock,
  Plus,
  CheckCircle2,
  Loader2,
  FileDown,
  CalendarClock,
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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
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
import { cn } from "@/lib/utils";

const dataTypes = [
  { key: "tasks", label: "Tasks", estimate: "1.2 MB" },
  { key: "projects", label: "Projects", estimate: "0.4 MB" },
  { key: "documents", label: "Documents", estimate: "3.8 MB" },
  { key: "team", label: "Team Members", estimate: "0.1 MB" },
  { key: "comments", label: "Comments", estimate: "2.1 MB" },
  { key: "activity", label: "Activity Log", estimate: "5.6 MB" },
];

const scheduledExports = [
  {
    id: 1,
    name: "Weekly Tasks Backup",
    format: "CSV",
    schedule: "Every Monday 9am",
    active: true,
  },
  {
    id: 2,
    name: "Monthly Analytics",
    format: "PDF",
    schedule: "1st of month",
    active: true,
  },
];

const exportHistory = [
  {
    id: 1,
    filename: "tasks_export_2026-03-28.csv",
    format: "CSV",
    size: "2.4 MB",
    date: "Mar 28, 2026",
    status: "Completed",
  },
  {
    id: 2,
    filename: "projects_backup_2026-03-25.json",
    format: "JSON",
    size: "1.1 MB",
    date: "Mar 25, 2026",
    status: "Completed",
  },
  {
    id: 3,
    filename: "team_report_2026-03-20.pdf",
    format: "PDF",
    size: "3.7 MB",
    date: "Mar 20, 2026",
    status: "Completed",
  },
  {
    id: 4,
    filename: "activity_log_2026-03-18.csv",
    format: "CSV",
    size: "5.2 MB",
    date: "Mar 18, 2026",
    status: "Completed",
  },
  {
    id: 5,
    filename: "full_export_2026-03-31.json",
    format: "JSON",
    size: "12.8 MB",
    date: "Mar 31, 2026",
    status: "Processing",
  },
  {
    id: 6,
    filename: "documents_2026-03-15.pdf",
    format: "PDF",
    size: "8.3 MB",
    date: "Mar 15, 2026",
    status: "Completed",
  },
];

const formatBadge: Record<string, string> = {
  CSV: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  JSON: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PDF: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function ExportsPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "tasks",
    "projects",
  ]);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportDateRange, setExportDateRange] = useState("all");
  const [schedules, setSchedules] = useState(scheduledExports);
  const [addScheduleOpen, setAddScheduleOpen] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState("");
  const [newScheduleFormat, setNewScheduleFormat] = useState("csv");
  const [newScheduleFreq, setNewScheduleFreq] = useState("weekly");

  // Export progress states
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDone, setExportDone] = useState(false);

  const toggleDataType = (key: string) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const toggleSchedule = (id: number) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const estimatedSize = dataTypes
    .filter((d) => selectedTypes.includes(d.key))
    .reduce((sum, d) => sum + parseFloat(d.estimate), 0)
    .toFixed(1);

  const runExport = useCallback(() => {
    setExporting(true);
    setExportProgress(0);
    setExportDone(false);
  }, []);

  useEffect(() => {
    if (!exporting || exportDone) return;
    if (exportProgress >= 100) {
      setExportDone(true);
      setExporting(false);
      return;
    }
    const timer = setTimeout(() => {
      setExportProgress((prev) => Math.min(prev + 5, 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [exporting, exportProgress, exportDone]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
            <Download className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Export Data</h1>
            <p className="text-sm text-muted-foreground">
              Export your data in various formats for backup or analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Export Options Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileDown className="h-4 w-4" />
              Quick Export
            </CardTitle>
            <CardDescription>
              Select data types and export instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2.5">
              <Label className="text-xs text-muted-foreground">
                Data Types
              </Label>
              {dataTypes.map((dt) => (
                <label
                  key={dt.key}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      role="checkbox"
                      aria-checked={selectedTypes.includes(dt.key)}
                      tabIndex={0}
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                        selectedTypes.includes(dt.key)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-transparent"
                      )}
                      onClick={() => toggleDataType(dt.key)}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter")
                          toggleDataType(dt.key);
                      }}
                    >
                      {selectedTypes.includes(dt.key) && (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-sm">{dt.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {dt.estimate}
                  </span>
                </label>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Date Range
              </Label>
              <Select
                value={exportDateRange}
                onValueChange={setExportDateRange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
              <span className="text-xs text-muted-foreground">
                Estimated size
              </span>
              <span className="text-sm font-medium">{estimatedSize} MB</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={runExport}
              disabled={selectedTypes.length === 0 || exporting}
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Now
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Scheduled Exports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-4 w-4" />
              Scheduled Exports
            </CardTitle>
            <CardDescription>
              Automatic exports on a recurring schedule.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {schedule.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        formatBadge[schedule.format] || ""
                      )}
                    >
                      {schedule.format}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {schedule.schedule}
                    </span>
                  </div>
                </div>
                <Switch
                  checked={schedule.active}
                  onCheckedChange={() => toggleSchedule(schedule.id)}
                />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAddScheduleOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </CardFooter>
        </Card>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Export History
            </CardTitle>
            <CardDescription>
              Previously generated exports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_60px_60px_70px] items-center gap-2 border-b pb-2 text-xs font-medium text-muted-foreground">
                <span>File</span>
                <span>Size</span>
                <span>Status</span>
                <span className="text-right">Action</span>
              </div>
              {/* Table Rows */}
              {exportHistory.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "grid grid-cols-[1fr_60px_60px_70px] items-center gap-2 py-2.5",
                    i !== exportHistory.length - 1 && "border-b"
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {item.filename}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          formatBadge[item.format] || ""
                        )}
                      >
                        {item.format}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.size}
                  </span>
                  <div>
                    {item.status === "Completed" ? (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      >
                        Done
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />
                        ...
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2"
                      disabled={item.status !== "Completed"}
                    >
                      <FileDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Progress Section */}
      {(exporting || exportDone) && (
        <Card>
          <CardContent className="py-6">
            {!exportDone ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Preparing export...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Processing {selectedTypes.length} data{" "}
                      {selectedTypes.length === 1 ? "type" : "types"} in{" "}
                      {exportFormat.toUpperCase()} format
                    </p>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {exportProgress}%
                  </span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Export ready! Click to download.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {estimatedSize} MB &middot;{" "}
                      {exportFormat.toUpperCase()} format
                    </p>
                  </div>
                </div>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Schedule Dialog */}
      <Dialog open={addScheduleOpen} onOpenChange={setAddScheduleOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Add Export Schedule</DialogTitle>
            <DialogDescription>
              Configure a new recurring data export.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Schedule Name</Label>
              <Input
                placeholder="e.g., Weekly Tasks Backup"
                value={newScheduleName}
                onChange={(e) => setNewScheduleName(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select
                  value={newScheduleFormat}
                  onValueChange={setNewScheduleFormat}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={newScheduleFreq}
                  onValueChange={setNewScheduleFreq}
                >
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
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddScheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newScheduleName) {
                  setSchedules((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      name: newScheduleName,
                      format: newScheduleFormat.toUpperCase(),
                      schedule:
                        newScheduleFreq === "daily"
                          ? "Every day 9am"
                          : newScheduleFreq === "weekly"
                            ? "Every Monday 9am"
                            : "1st of month",
                      active: true,
                    },
                  ]);
                  setNewScheduleName("");
                  setAddScheduleOpen(false);
                }
              }}
            >
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
