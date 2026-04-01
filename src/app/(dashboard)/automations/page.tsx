"use client";

import { useState } from "react";
import {
  Zap,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  runs: number;
  lastTriggered: string;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ExecutionLog {
  id: string;
  automationName: string;
  trigger: string;
  result: "Success" | "Failed";
  timestamp: string;
}

const initialAutomations: Automation[] = [
  {
    id: "a-1",
    name: "Auto-assign Bug Tasks",
    trigger: "When task is created with label \"Bug\"",
    action: "Assign to Sarah Chen",
    active: true,
    runs: 45,
    lastTriggered: "2 hours ago",
  },
  {
    id: "a-2",
    name: "Move to Done on PR Merge",
    trigger: "When GitHub PR is merged",
    action: "Move linked task to Done",
    active: true,
    runs: 89,
    lastTriggered: "30 minutes ago",
  },
  {
    id: "a-3",
    name: "Slack Notification on Overdue",
    trigger: "When task becomes overdue",
    action: "Send Slack message to #alerts",
    active: true,
    runs: 12,
    lastTriggered: "1 day ago",
  },
  {
    id: "a-4",
    name: "Weekly Digest Email",
    trigger: "Every Monday 9am",
    action: "Send weekly summary email to team",
    active: true,
    runs: 14,
    lastTriggered: "3 days ago",
  },
  {
    id: "a-5",
    name: "Auto-close Stale Tasks",
    trigger: "When task has no activity for 30 days",
    action: "Add \"stale\" label",
    active: false,
    runs: 67,
    lastTriggered: "1 week ago",
  },
  {
    id: "a-6",
    name: "Priority Escalation",
    trigger: "When high-priority task is unassigned for 24h",
    action: "Notify project lead",
    active: true,
    runs: 7,
    lastTriggered: "5 hours ago",
  },
];

const executionLogs: ExecutionLog[] = [
  {
    id: "e-1",
    automationName: "Move to Done on PR Merge",
    trigger: "PR #482 merged",
    result: "Success",
    timestamp: "Mar 31, 2026 10:24 AM",
  },
  {
    id: "e-2",
    automationName: "Auto-assign Bug Tasks",
    trigger: "Task \"Login timeout error\" created",
    result: "Success",
    timestamp: "Mar 31, 2026 09:15 AM",
  },
  {
    id: "e-3",
    automationName: "Priority Escalation",
    trigger: "Task \"API rate limiting\" unassigned 24h",
    result: "Success",
    timestamp: "Mar 31, 2026 08:00 AM",
  },
  {
    id: "e-4",
    automationName: "Slack Notification on Overdue",
    trigger: "Task \"Update docs\" overdue",
    result: "Success",
    timestamp: "Mar 30, 2026 05:00 PM",
  },
  {
    id: "e-5",
    automationName: "Move to Done on PR Merge",
    trigger: "PR #479 merged",
    result: "Failed",
    timestamp: "Mar 30, 2026 03:42 PM",
  },
  {
    id: "e-6",
    automationName: "Auto-assign Bug Tasks",
    trigger: "Task \"Memory leak in dashboard\" created",
    result: "Success",
    timestamp: "Mar 30, 2026 11:30 AM",
  },
  {
    id: "e-7",
    automationName: "Weekly Digest Email",
    trigger: "Scheduled: Monday 9:00 AM",
    result: "Success",
    timestamp: "Mar 28, 2026 09:00 AM",
  },
  {
    id: "e-8",
    automationName: "Auto-close Stale Tasks",
    trigger: "5 tasks inactive 30+ days",
    result: "Success",
    timestamp: "Mar 27, 2026 12:00 AM",
  },
];

const triggers = [
  "Task Created",
  "Task Updated",
  "Task Status Changed",
  "Task Overdue",
  "PR Merged",
  "Schedule (Cron)",
  "Comment Added",
];

const actions = [
  "Assign to User",
  "Change Status",
  "Add Label",
  "Send Email",
  "Send Slack Message",
  "Create Task",
  "Move to Project",
];

const conditionFields = ["Priority", "Label", "Project", "Assignee"];
const conditionOperators = ["equals", "contains", "is empty"];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(initialAutomations);
  const [logOpen, setLogOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [actionConfig, setActionConfig] = useState("");

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, field: "", operator: "", value: "" },
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCondition = (id: string, key: keyof Condition, value: string) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  const resetForm = () => {
    setNewName("");
    setSelectedTrigger("");
    setSelectedAction("");
    setConditions([]);
    setActionConfig("");
  };

  const activeCount = automations.filter((a) => a.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight">Automations</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Automate repetitive tasks with if-then rules.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Automation</DialogTitle>
              <DialogDescription>
                Set up an automated workflow with triggers, conditions, and actions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="auto-name">Automation Name</Label>
                <Input
                  id="auto-name"
                  placeholder="e.g., Auto-assign Bug Tasks"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <Separator />

              {/* Trigger */}
              <div className="space-y-2">
                <Label>Trigger</Label>
                <p className="text-xs text-muted-foreground">
                  What event should start this automation?
                </p>
                <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trigger..." />
                  </SelectTrigger>
                  <SelectContent>
                    {triggers.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTrigger === "Schedule (Cron)" && (
                  <Input placeholder="e.g., Every Monday at 9:00 AM" className="mt-2" />
                )}
              </div>

              <Separator />

              {/* Conditions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Conditions</Label>
                    <p className="text-xs text-muted-foreground">
                      Optional filters to narrow when this runs.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addCondition}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Condition
                  </Button>
                </div>
                {conditions.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No conditions added. Automation will run on every trigger.
                  </p>
                )}
                {conditions.map((cond) => (
                  <div key={cond.id} className="flex items-center gap-2">
                    <Select
                      value={cond.field}
                      onValueChange={(v) => updateCondition(cond.id, "field", v)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionFields.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={cond.operator}
                      onValueChange={(v) => updateCondition(cond.id, "operator", v)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOperators.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {cond.operator !== "is empty" && (
                      <Input
                        placeholder="Value"
                        className="flex-1"
                        value={cond.value}
                        onChange={(e) => updateCondition(cond.id, "value", e.target.value)}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(cond.id)}
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Action */}
              <div className="space-y-2">
                <Label>Action</Label>
                <p className="text-xs text-muted-foreground">
                  What should happen when conditions are met?
                </p>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action..." />
                  </SelectTrigger>
                  <SelectContent>
                    {actions.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedAction === "Assign to User" && (
                  <Select value={actionConfig} onValueChange={setActionConfig}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a user..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                      <SelectItem value="Alex Kim">Alex Kim</SelectItem>
                      <SelectItem value="Marcus Johnson">Marcus Johnson</SelectItem>
                      <SelectItem value="Emily Park">Emily Park</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {selectedAction === "Change Status" && (
                  <Select value={actionConfig} onValueChange={setActionConfig}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {selectedAction === "Add Label" && (
                  <Input
                    placeholder="Label name, e.g., stale"
                    className="mt-2"
                    value={actionConfig}
                    onChange={(e) => setActionConfig(e.target.value)}
                  />
                )}
                {selectedAction === "Send Email" && (
                  <Input
                    placeholder="Recipient email or group"
                    className="mt-2"
                    value={actionConfig}
                    onChange={(e) => setActionConfig(e.target.value)}
                  />
                )}
                {selectedAction === "Send Slack Message" && (
                  <Input
                    placeholder="Channel, e.g., #alerts"
                    className="mt-2"
                    value={actionConfig}
                    onChange={(e) => setActionConfig(e.target.value)}
                  />
                )}
                {selectedAction === "Move to Project" && (
                  <Select value={actionConfig} onValueChange={setActionConfig}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a project..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App">Mobile App</SelectItem>
                      <SelectItem value="API v2">API v2</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={() => { setCreateOpen(false); resetForm(); }}>
                Save Automation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Automations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">234</p>
              <p className="text-xs text-muted-foreground">Executions This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">99.2%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Cards */}
      <div className="space-y-3">
        {automations.map((automation) => (
          <Card
            key={automation.id}
            className={cn(
              "transition-opacity",
              !automation.active && "opacity-60"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{automation.name}</h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        automation.active
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      )}
                    >
                      {automation.active ? "Active" : "Paused"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {automation.runs} runs
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                      {automation.trigger}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                      {automation.action}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="mr-1 inline h-3 w-3" />
                    Last triggered {automation.lastTriggered}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={automation.active}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Execution Log */}
      <Card>
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setLogOpen(!logOpen)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Execution Log</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {logOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {logOpen && (
          <CardContent className="pt-0">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Automation
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Trigger
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Result
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {executionLogs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">
                        {log.automationName}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {log.trigger}
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            log.result === "Success"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {log.result === "Success" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {log.result}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {log.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
