"use client";

import { useState } from "react";
import {
  Zap,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  ArrowRightLeft,
  Trash2,
  Globe,
  Database,
  Download,
  ExternalLink,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const brandColors = [
  { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Green", value: "green", class: "bg-emerald-500" },
  { name: "Red", value: "red", class: "bg-red-500" },
  { name: "Orange", value: "orange", class: "bg-orange-500" },
  { name: "Purple", value: "purple", class: "bg-purple-500" },
  { name: "Pink", value: "pink", class: "bg-pink-500" },
  { name: "Teal", value: "teal", class: "bg-teal-500" },
];

const fonts = [
  {
    name: "Inter",
    value: "inter",
    preview: "The quick brown fox jumps over the lazy dog",
    className: "font-sans",
  },
  {
    name: "System Default",
    value: "system",
    preview: "The quick brown fox jumps over the lazy dog",
    className: "font-sans",
  },
  {
    name: "Montserrat",
    value: "montserrat",
    preview: "The quick brown fox jumps over the lazy dog",
    className: "font-sans tracking-tight",
  },
  {
    name: "Space Grotesk",
    value: "space-grotesk",
    preview: "The quick brown fox jumps over the lazy dog",
    className: "font-mono",
  },
];

export default function WorkspaceSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("TaskFlow Team");
  const [workspaceUrl, setWorkspaceUrl] = useState("taskflow-team");
  const [brandColor, setBrandColor] = useState("indigo");
  const [accentColor, setAccentColor] = useState("blue");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [copiedId, setCopiedId] = useState(false);
  const [dataRetention, setDataRetention] = useState("90-days");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCopyId = () => {
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your workspace details and branding.
        </p>
      </div>

      {/* Workspace Info */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Information</CardTitle>
          <CardDescription>
            Basic details about your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace-url">Workspace URL</Label>
            <div className="flex items-center gap-0">
              <Input
                id="workspace-url"
                value={workspaceUrl}
                onChange={(e) => setWorkspaceUrl(e.target.value)}
                className="rounded-r-none border-r-0"
              />
              <div className="flex h-9 items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
                .taskflow.com
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your workspace will be accessible at {workspaceUrl}.taskflow.com
            </p>
          </div>

          <div className="space-y-2">
            <Label>Workspace ID</Label>
            <div className="flex items-center gap-2">
              <div className="flex h-9 flex-1 items-center rounded-md border bg-muted/50 px-3 text-sm font-mono text-muted-foreground">
                wks_a1b2c3d4
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5"
                onClick={handleCopyId}
              >
                {copiedId ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Customize how your workspace looks and feels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Logo Upload */}
          <div className="space-y-3">
            <Label>Workspace Logo</Label>
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-indigo-500 shadow-sm">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:border-muted-foreground/40 hover:bg-muted/50">
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Upload Logo
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    PNG, JPG or SVG. Max 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brand Color */}
          <div className="space-y-3">
            <Label>Brand Color</Label>
            <div className="flex items-center gap-3">
              {brandColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBrandColor(color.value)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110",
                    color.class,
                    brandColor === color.value &&
                      "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                  )}
                  title={color.name}
                >
                  {brandColor === color.value && (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Accent Color */}
          <div className="space-y-3">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-3">
              {brandColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110",
                    color.class,
                    accentColor === color.value &&
                      "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                  )}
                  title={color.name}
                >
                  {accentColor === color.value && (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Font Selector */}
          <div className="space-y-3">
            <Label>Font</Label>
            <div className="grid gap-3">
              {fonts.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setSelectedFont(font.value)}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-colors hover:bg-muted/50",
                    selectedFont === font.value
                      ? "border-primary bg-muted/30"
                      : "border-transparent bg-muted/10"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      selectedFont === font.value
                        ? "border-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {selectedFont === font.value && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{font.name}</p>
                    <p
                      className={cn(
                        "mt-1 text-sm text-muted-foreground",
                        font.className
                      )}
                    >
                      {font.preview}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Data &amp; Privacy</CardTitle>
              <CardDescription>
                Manage data storage, retention, and privacy settings.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Data Region</Label>
              <div className="flex items-center gap-2">
                <div className="flex h-9 flex-1 items-center rounded-md border bg-muted/50 px-3 text-sm">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  US East
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Region cannot be changed after workspace creation.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Data Retention</Label>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-days">30 days</SelectItem>
                  <SelectItem value="90-days">90 days</SelectItem>
                  <SelectItem value="1-year">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How long deleted items are kept before permanent removal.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Export All Data</Label>
              <p className="text-xs text-muted-foreground">
                Request a full export of all your workspace data.
              </p>
            </div>
            <Button variant="outline" className="gap-1.5">
              <Download className="h-4 w-4" />
              Request Full Data Export
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>GDPR</Label>
              <p className="text-xs text-muted-foreground">
                Submit a data deletion request under GDPR.
              </p>
            </div>
            <Button variant="link" className="gap-1.5 text-blue-600 dark:text-blue-400">
              Process data deletion request
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-red-600 dark:text-red-400">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-900/50 p-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Transfer Ownership</p>
              <p className="text-xs text-muted-foreground">
                Transfer this workspace to another admin.
              </p>
            </div>
            <Button variant="outline" className="gap-1.5">
              <ArrowRightLeft className="h-4 w-4" />
              Transfer
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-900/50 p-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Delete Workspace</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete this workspace and all data.
              </p>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-1.5">
                  <Trash2 className="h-4 w-4" />
                  Delete Workspace
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Workspace</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the
                    workspace, all projects, tasks, and data associated with it.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-900/20">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      Please type{" "}
                      <span className="font-mono font-bold">{workspaceName}</span>{" "}
                      to confirm.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirm">Workspace Name</Label>
                    <Input
                      id="delete-confirm"
                      placeholder={workspaceName}
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteDialogOpen(false);
                      setDeleteConfirmText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={deleteConfirmText !== workspaceName}
                  >
                    I understand, delete this workspace
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button size="lg">Save Changes</Button>
      </div>
    </div>
  );
}
