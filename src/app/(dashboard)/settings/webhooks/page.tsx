"use client";

import { useState } from "react";
import {
  Webhook,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Send,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Copy,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { cn } from "@/lib/utils";

interface Delivery {
  id: string;
  timestamp: string;
  status: number;
  responseTime: string;
  requestId: string;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  displayUrl: string;
  events: string[];
  active: boolean;
  failing: boolean;
  failureNote?: string;
  secret: string;
  lastTriggered: string;
  successRate: string;
  deliveries: Delivery[];
}

const allEvents = [
  "task.created",
  "task.updated",
  "task.completed",
  "task.deleted",
  "task.status_changed",
  "project.created",
  "project.updated",
  "comment.created",
  "member.invited",
];

const initialWebhooks: WebhookConfig[] = [
  {
    id: "1",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/T01ABC/B02DEF/abcdef123456",
    displayUrl: "https://hooks.slack.com/services/T01.../B02.../abc...",
    events: ["task.created", "task.completed", "project.created"],
    active: true,
    failing: false,
    secret: "whsec_a1b2c3d4e5f6g7h8i9j0",
    lastTriggered: "3 hours ago",
    successRate: "98%",
    deliveries: [
      {
        id: "del_01",
        timestamp: "3 hours ago",
        status: 200,
        responseTime: "89ms",
        requestId: "req_9f8e7d6c5b4a",
      },
      {
        id: "del_02",
        timestamp: "5 hours ago",
        status: 200,
        responseTime: "102ms",
        requestId: "req_3a2b1c0d9e8f",
      },
      {
        id: "del_03",
        timestamp: "8 hours ago",
        status: 200,
        responseTime: "95ms",
        requestId: "req_7g6h5i4j3k2l",
      },
    ],
  },
  {
    id: "2",
    name: "CI/CD Trigger",
    url: "https://ci.example.com/webhooks/taskflow",
    displayUrl: "https://ci.example.com/webhooks/taskflow",
    events: ["task.completed", "task.status_changed"],
    active: true,
    failing: false,
    secret: "whsec_k1l2m3n4o5p6q7r8s9t0",
    lastTriggered: "1 day ago",
    successRate: "100%",
    deliveries: [
      {
        id: "del_04",
        timestamp: "1 day ago",
        status: 200,
        responseTime: "145ms",
        requestId: "req_1m2n3o4p5q6r",
      },
      {
        id: "del_05",
        timestamp: "2 days ago",
        status: 200,
        responseTime: "132ms",
        requestId: "req_7s8t9u0v1w2x",
      },
      {
        id: "del_06",
        timestamp: "3 days ago",
        status: 200,
        responseTime: "128ms",
        requestId: "req_3y4z5a6b7c8d",
      },
    ],
  },
  {
    id: "3",
    name: "Analytics Sync",
    url: "https://analytics.example.com/ingest",
    displayUrl: "https://analytics.example.com/ingest",
    events: allEvents,
    active: true,
    failing: true,
    failureNote: "3 failures in last 24h",
    secret: "whsec_u1v2w3x4y5z6a7b8c9d0",
    lastTriggered: "30 minutes ago",
    successRate: "72%",
    deliveries: [
      {
        id: "del_07",
        timestamp: "30 minutes ago",
        status: 500,
        responseTime: "2,041ms",
        requestId: "req_9e0f1g2h3i4j",
      },
      {
        id: "del_08",
        timestamp: "2 hours ago",
        status: 500,
        responseTime: "3,012ms",
        requestId: "req_5k6l7m8n9o0p",
      },
      {
        id: "del_09",
        timestamp: "4 hours ago",
        status: 200,
        responseTime: "312ms",
        requestId: "req_1q2r3s4t5u6v",
      },
    ],
  },
];

function generateSecret(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "whsec_";
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(initialWebhooks);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { status: string; loading: boolean }>
  >({});
  const [deleteTarget, setDeleteTarget] = useState<WebhookConfig | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Add Webhook dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newSecret, setNewSecret] = useState(generateSecret());
  const [newEvents, setNewEvents] = useState<string[]>([]);
  const [newActive, setNewActive] = useState(true);

  const handleTest = (webhook: WebhookConfig) => {
    setTestResults((prev) => ({
      ...prev,
      [webhook.id]: { status: "", loading: true },
    }));

    setTimeout(() => {
      if (webhook.failing) {
        setTestResults((prev) => ({
          ...prev,
          [webhook.id]: {
            status: "Failed: 500 Internal Server Error (2,340ms)",
            loading: false,
          },
        }));
      } else {
        const ms = Math.floor(Math.random() * 200) + 80;
        setTestResults((prev) => ({
          ...prev,
          [webhook.id]: {
            status: `Success: 200 OK (${ms}ms)`,
            loading: false,
          },
        }));
      }
    }, 1500);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setWebhooks((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteOpen(false);
    }
  };

  const toggleEvent = (event: string) => {
    setNewEvents((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event]
    );
  };

  const toggleSelectAll = () => {
    if (newEvents.length === allEvents.length) {
      setNewEvents([]);
    } else {
      setNewEvents([...allEvents]);
    }
  };

  const handleAddWebhook = () => {
    const newWebhook: WebhookConfig = {
      id: String(Date.now()),
      name: new URL(newUrl).hostname.replace("www.", ""),
      url: newUrl,
      displayUrl:
        newUrl.length > 50 ? newUrl.substring(0, 50) + "..." : newUrl,
      events: newEvents,
      active: newActive,
      failing: false,
      secret: newSecret,
      lastTriggered: "Never",
      successRate: "--",
      deliveries: [],
    };
    setWebhooks((prev) => [...prev, newWebhook]);
    resetAddDialog();
  };

  const resetAddDialog = () => {
    setAddOpen(false);
    setNewUrl("");
    setNewSecret(generateSecret());
    setNewEvents([]);
    setNewActive(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Webhook className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
            <p className="text-sm text-muted-foreground">
              Configure endpoints to receive real-time event notifications.
            </p>
          </div>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[540px]">
            <DialogHeader>
              <DialogTitle>Add Webhook</DialogTitle>
              <DialogDescription>
                Configure a new webhook endpoint to receive event notifications.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-2 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Payload URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://example.com/webhooks/taskflow"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Signing Secret</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm font-mono truncate">
                    {newSecret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewSecret(generateSecret())}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Used to verify webhook payloads. Store this securely.
                </p>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Events</Label>
                  <button
                    onClick={toggleSelectAll}
                    className="text-xs text-primary hover:underline"
                  >
                    {newEvents.length === allEvents.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {allEvents.map((event) => (
                    <label
                      key={event}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                        newEvents.includes(event)
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                          newEvents.includes(event)
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {newEvents.includes(event) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span className="font-mono text-xs">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable this webhook to start receiving events immediately.
                  </p>
                </div>
                <Switch checked={newActive} onCheckedChange={setNewActive} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetAddDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleAddWebhook}
                disabled={!newUrl.trim() || newEvents.length === 0}
              >
                Save Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
            How webhooks work
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
            Webhooks notify your application when events happen in TaskFlow. We
            send an HTTP POST request to your configured URL with a JSON payload
            containing event details. All payloads are signed with your webhook
            secret for verification.
          </p>
        </div>
      </div>

      {/* Webhook List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Main Row */}
              <div className="flex items-start gap-4 p-5">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0",
                    webhook.failing
                      ? "bg-red-100 dark:bg-red-950/40"
                      : webhook.active
                        ? "bg-emerald-100 dark:bg-emerald-950/40"
                        : "bg-muted"
                  )}
                >
                  <Webhook
                    className={cn(
                      "h-4 w-4",
                      webhook.failing
                        ? "text-red-600 dark:text-red-400"
                        : webhook.active
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-semibold">{webhook.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          webhook.failing
                            ? "bg-red-500"
                            : webhook.active
                              ? "bg-emerald-500"
                              : "bg-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium",
                          webhook.failing
                            ? "text-red-600 dark:text-red-400"
                            : webhook.active
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                        )}
                      >
                        {webhook.failing
                          ? "Failing"
                          : webhook.active
                            ? "Active"
                            : "Inactive"}
                      </span>
                    </div>
                    {webhook.failureNote && (
                      <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {webhook.failureNote}
                      </span>
                    )}
                  </div>
                  <code className="block text-xs font-mono text-muted-foreground truncate">
                    {webhook.displayUrl}
                  </code>
                  <div className="flex flex-wrap gap-1.5">
                    {webhook.events.length === allEvents.length ? (
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-mono"
                      >
                        All events
                      </Badge>
                    ) : (
                      webhook.events.map((event) => (
                        <Badge
                          key={event}
                          variant="secondary"
                          className="text-[11px] font-mono"
                        >
                          {event}
                        </Badge>
                      ))
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-0.5">
                    <span>Last triggered: {webhook.lastTriggered}</span>
                    <span>
                      Success rate:{" "}
                      <span
                        className={cn(
                          "font-medium",
                          parseFloat(webhook.successRate) >= 95
                            ? "text-emerald-600 dark:text-emerald-400"
                            : parseFloat(webhook.successRate) >= 80
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {webhook.successRate}
                      </span>
                    </span>
                    <span>
                      Secret:{" "}
                      <code className="font-mono">
                        whsec_{"..."}
                        {webhook.secret.slice(-4)}
                      </code>
                    </span>
                  </div>

                  {/* Test result */}
                  {testResults[webhook.id] && (
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-xs mt-1",
                        testResults[webhook.id].loading
                          ? "bg-muted text-muted-foreground"
                          : testResults[webhook.id].status.startsWith("Success")
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      )}
                    >
                      {testResults[webhook.id].loading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Sending test webhook...
                        </>
                      ) : testResults[webhook.id].status.startsWith(
                          "Success"
                        ) ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Test webhook sent. Response:{" "}
                          {testResults[webhook.id].status.replace(
                            "Success: ",
                            ""
                          )}
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          Test failed. Response:{" "}
                          {testResults[webhook.id].status.replace(
                            "Failed: ",
                            ""
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleTest(webhook)}
                    disabled={testResults[webhook.id]?.loading}
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      setExpandedId(
                        expandedId === webhook.id ? null : webhook.id
                      )
                    }
                  >
                    {expandedId === webhook.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => {
                      setDeleteTarget(webhook);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Expandable Deliveries */}
              {expandedId === webhook.id && webhook.deliveries.length > 0 && (
                <div className="border-t bg-muted/30 px-5 py-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Recent Deliveries
                    </span>
                  </div>
                  <div className="space-y-0">
                    {/* Table header */}
                    <div className="grid grid-cols-[100px_80px_90px_1fr] gap-3 pb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      <span>Timestamp</span>
                      <span>Status</span>
                      <span>Duration</span>
                      <span>Request ID</span>
                    </div>
                    {webhook.deliveries.map((delivery, idx) => (
                      <div
                        key={delivery.id}
                        className={cn(
                          "grid grid-cols-[100px_80px_90px_1fr] gap-3 py-2.5 text-xs",
                          idx !== webhook.deliveries.length - 1 && "border-b"
                        )}
                      >
                        <span className="text-muted-foreground">
                          {delivery.timestamp}
                        </span>
                        <span>
                          <Badge
                            className={cn(
                              "text-[10px] border-0 px-1.5",
                              delivery.status >= 200 && delivery.status < 300
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            )}
                          >
                            {delivery.status}
                          </Badge>
                        </span>
                        <span className="text-muted-foreground font-mono">
                          {delivery.responseTime}
                        </span>
                        <span className="text-muted-foreground font-mono truncate">
                          {delivery.requestId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expandedId === webhook.id &&
                webhook.deliveries.length === 0 && (
                  <div className="border-t bg-muted/30 px-5 py-6 text-center">
                    <p className="text-xs text-muted-foreground">
                      No deliveries yet. Send a test to see results here.
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}

        {webhooks.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Webhook className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-sm font-medium text-muted-foreground">
                No webhooks configured
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1 mb-4">
                Add your first webhook to start receiving event notifications.
              </p>
              <Button variant="outline" onClick={() => setAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Webhook
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Webhook
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the webhook{" "}
              <strong>{deleteTarget?.name}</strong>? Your endpoint will no longer
              receive event notifications. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
