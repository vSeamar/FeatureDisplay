"use client";

import { useState } from "react";
import {
  Key,
  Copy,
  Check,
  Plus,
  MoreHorizontal,
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Pencil,
  Info,
  Shield,
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
import { Progress } from "@/components/ui/progress";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  maskedKey: string;
  fullKey: string;
  prefix: string;
  created: string;
  lastUsed: string;
  permissions: "Full Access" | "Read Only" | "Write Only";
}

const initialKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production Key",
    maskedKey: "tf_live_sk_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20224a2f",
    fullKey: "tf_live_sk_a1b2c3d4e5f6g7h84a2f",
    prefix: "tf_live_sk_",
    created: "Jan 15, 2026",
    lastUsed: "2 hours ago",
    permissions: "Full Access",
  },
  {
    id: "2",
    name: "CI/CD Pipeline",
    maskedKey: "tf_live_sk_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20229b3e",
    fullKey: "tf_live_sk_j9k8l7m6n5o4p3q29b3e",
    prefix: "tf_live_sk_",
    created: "Feb 20, 2026",
    lastUsed: "1 day ago",
    permissions: "Read Only",
  },
  {
    id: "3",
    name: "Development",
    maskedKey: "tf_test_sk_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20227c1d",
    fullKey: "tf_test_sk_r1s2t3u4v5w6x7y87c1d",
    prefix: "tf_test_sk_",
    created: "Mar 1, 2026",
    lastUsed: "Never",
    permissions: "Full Access",
  },
];

const permissionColors: Record<string, string> = {
  "Full Access":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Read Only":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Write Only":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [revokeOpen, setRevokeOpen] = useState(false);

  // Generate dialog state
  const [generateOpen, setGenerateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermission, setNewKeyPermission] = useState("Full Access");
  const [newKeyExpiration, setNewKeyExpiration] = useState("never");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [generatedKeyCopied, setGeneratedKeyCopied] = useState(false);

  const handleCopy = async (key: ApiKey) => {
    await navigator.clipboard.writeText(key.fullKey);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = () => {
    if (revokeTarget) {
      setKeys((prev) => prev.filter((k) => k.id !== revokeTarget.id));
      setRevokeTarget(null);
      setRevokeOpen(false);
    }
  };

  const handleGenerate = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 22);
    const prefix =
      newKeyPermission === "Read Only" ? "tf_live_ro_" : "tf_live_sk_";
    const fakeKey = `${prefix}${randomSuffix}`;
    setGeneratedKey(fakeKey);
  };

  const handleGeneratedKeyCopy = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey);
      setGeneratedKeyCopied(true);
      setTimeout(() => setGeneratedKeyCopied(false), 2000);
    }
  };

  const handleSaveGeneratedKey = () => {
    if (generatedKey && newKeyName) {
      const last4 = generatedKey.slice(-4);
      const prefix = generatedKey.slice(0, 11);
      const newKey: ApiKey = {
        id: String(Date.now()),
        name: newKeyName,
        maskedKey: `${prefix}\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022${last4}`,
        fullKey: generatedKey,
        prefix,
        created: "Just now",
        lastUsed: "Never",
        permissions: newKeyPermission as ApiKey["permissions"],
      };
      setKeys((prev) => [newKey, ...prev]);
    }
    setGenerOpen(false);
  };

  const resetGenerateDialog = () => {
    setNewKeyName("");
    setNewKeyPermission("Full Access");
    setNewKeyExpiration("never");
    setGeneratedKey(null);
    setGeneratedKeyCopied(false);
  };

  const setGenerOpen = (open: boolean) => {
    setGenerateOpen(open);
    if (!open) resetGenerateDialog();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
            <p className="text-sm text-muted-foreground">
              Manage your API keys and access tokens.
            </p>
          </div>
        </div>
        <Dialog open={generateOpen} onOpenChange={setGenerOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Generate API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to authenticate with the TaskFlow API.
              </DialogDescription>
            </DialogHeader>
            {!generatedKey ? (
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production Backend"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Full Access", "Read Only", "Write Only"].map((perm) => (
                      <button
                        key={perm}
                        onClick={() => setNewKeyPermission(perm)}
                        className={cn(
                          "rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors",
                          newKeyPermission === perm
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                        )}
                      >
                        {perm}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Expiration</Label>
                  <Select
                    value={newKeyExpiration}
                    onValueChange={setNewKeyExpiration}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="90d">90 days</SelectItem>
                      <SelectItem value="1y">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      Copy this key now. It will not be shown again for security
                      reasons.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-md border bg-muted/50 px-3 py-2.5 text-sm font-mono break-all">
                      {generatedKey}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={handleGeneratedKeyCopy}
                    >
                      {generatedKeyCopied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Name: <strong className="text-foreground">{newKeyName}</strong>
                  </span>
                  <span>
                    Permissions:{" "}
                    <strong className="text-foreground">{newKeyPermission}</strong>
                  </span>
                  <span>
                    Expires:{" "}
                    <strong className="text-foreground">
                      {newKeyExpiration === "never"
                        ? "Never"
                        : newKeyExpiration}
                    </strong>
                  </span>
                </div>
              </div>
            )}
            <DialogFooter>
              {!generatedKey ? (
                <Button
                  onClick={handleGenerate}
                  disabled={!newKeyName.trim()}
                >
                  Generate Key
                </Button>
              ) : (
                <Button onClick={handleSaveGeneratedKey}>Done</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
            Keep your API keys secure
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
            API keys allow you to authenticate with the TaskFlow API. Keep your
            keys secret — never share them in client-side code or expose them in
            public repositories.
          </p>
        </div>
      </div>

      {/* API Key List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Keys</CardTitle>
          <CardDescription>
            {keys.length} API {keys.length === 1 ? "key" : "keys"} configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {keys.map((key, index) => (
            <div key={key.id}>
              <div className="flex items-start gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                  <Key className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{key.name}</span>
                    <Badge
                      className={cn(
                        "text-[11px] font-medium border-0",
                        permissionColors[key.permissions]
                      )}
                    >
                      {key.permissions}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5">
                      {key.maskedKey}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleCopy(key)}
                    >
                      {copiedId === key.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Created: {key.created}</span>
                    <span>
                      Last used:{" "}
                      <span
                        className={cn(
                          key.lastUsed === "Never" &&
                            "text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {key.lastUsed}
                      </span>
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setRevokeTarget(key);
                        setRevokeOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Revoke
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < keys.length - 1 && <Separator />}
            </div>
          ))}

          {keys.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Key className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No API keys
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Generate your first API key to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Revoke API Key
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke{" "}
              <strong>{revokeTarget?.name}</strong>? Any applications using this
              key will immediately lose access. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRevokeOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke}>
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Usage */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">API Usage</CardTitle>
            <CardDescription>Current billing period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Requests this month</span>
                <span className="font-semibold">12,450 / 50,000</span>
              </div>
              <Progress value={24.9} className="h-2" />
              <p className="text-xs text-muted-foreground">
                24.9% of monthly quota used. Resets on Apr 1, 2026.
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rate limit</span>
              <span className="font-medium">100 requests / minute</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg. response time</span>
              <span className="font-medium">142ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Links</CardTitle>
            <CardDescription>Resources and documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950/40">
                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">API Documentation</p>
                <p className="text-xs text-muted-foreground">
                  Full reference for all endpoints
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-50 dark:bg-purple-950/40">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Authentication Guide</p>
                <p className="text-xs text-muted-foreground">
                  Learn how to authenticate API requests
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/40">
                <Key className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Rate Limits & Quotas</p>
                <p className="text-xs text-muted-foreground">
                  Understand usage limits and billing
                </p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
