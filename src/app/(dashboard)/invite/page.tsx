"use client";

import { useState } from "react";
import {
  UserPlus,
  Copy,
  RefreshCw,
  Send,
  RotateCw,
  X,
  Link2,
  FolderOpen,
  FileText,
  Users,
  Eye,
  Globe,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { cn, getInitials } from "@/lib/utils";

const pendingInvitations = [
  {
    id: 1,
    email: "alex.new@company.com",
    role: "Member",
    sent: "2 days ago",
    status: "Pending" as const,
  },
  {
    id: 2,
    email: "contractor@freelance.io",
    role: "Viewer",
    sent: "5 days ago",
    status: "Pending" as const,
  },
  {
    id: 3,
    email: "partner@agency.com",
    role: "Member",
    sent: "1 day ago",
    status: "Expired" as const,
  },
];

const sharedProjects = [
  {
    id: 1,
    name: "Website Redesign",
    members: 4,
    external: 2,
    externalLabel: "external viewers",
    people: [
      { name: "Carlos Martinez", email: "carlos@taskflow.io", role: "Owner", color: "bg-blue-600" },
      { name: "Sarah Chen", email: "sarah@taskflow.io", role: "Editor", color: "bg-emerald-600" },
      { name: "Alex Johnson", email: "alex@taskflow.io", role: "Editor", color: "bg-purple-600" },
      { name: "Maria Lopez", email: "maria@taskflow.io", role: "Editor", color: "bg-amber-600" },
      { name: "Tom External", email: "tom@external.com", role: "Viewer", color: "bg-rose-600" },
      { name: "Lisa Viewer", email: "lisa@client.com", role: "Viewer", color: "bg-indigo-600" },
    ],
    linkSharing: true,
  },
  {
    id: 2,
    name: "API Platform",
    members: 5,
    external: 0,
    externalLabel: "external",
    people: [
      { name: "Carlos Martinez", email: "carlos@taskflow.io", role: "Owner", color: "bg-blue-600" },
      { name: "Sarah Chen", email: "sarah@taskflow.io", role: "Editor", color: "bg-emerald-600" },
      { name: "Jake Williams", email: "jake@taskflow.io", role: "Editor", color: "bg-amber-600" },
      { name: "Emily Park", email: "emily@taskflow.io", role: "Editor", color: "bg-rose-600" },
      { name: "David Kim", email: "david@taskflow.io", role: "Viewer", color: "bg-indigo-600" },
    ],
    linkSharing: false,
  },
  {
    id: 3,
    name: "Marketing Campaign",
    members: 2,
    external: 1,
    externalLabel: "external editor",
    people: [
      { name: "Carlos Martinez", email: "carlos@taskflow.io", role: "Owner", color: "bg-blue-600" },
      { name: "Maria Lopez", email: "maria@taskflow.io", role: "Editor", color: "bg-amber-600" },
      { name: "Agency Partner", email: "partner@agency.com", role: "Editor", color: "bg-teal-600" },
    ],
    linkSharing: false,
  },
];

const sharedDocuments = [
  {
    id: 1,
    name: "Product Requirements",
    sharedWith: "Shared with 3 people",
    link: "https://app.taskflow.com/docs/prod-req-x7k2",
    linkEnabled: true,
  },
  {
    id: 2,
    name: "API Specification",
    sharedWith: "Shared with team",
    link: "https://app.taskflow.com/docs/api-spec-m3n1",
    linkEnabled: true,
  },
  {
    id: 3,
    name: "Design Guidelines",
    sharedWith: "Shared with 2 external",
    link: "",
    linkEnabled: false,
  },
];

export default function InvitePage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [linkCopied, setLinkCopied] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState<number | null>(null);
  const [projectLinkSharing, setProjectLinkSharing] = useState<Record<number, boolean>>(
    Object.fromEntries(sharedProjects.map((p) => [p.id, p.linkSharing]))
  );

  const handleCopyLink = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const currentProject = sharedProjects.find((p) => p.id === manageDialogOpen);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Invite & Share</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Invite people to collaborate on your workspace and projects.
        </p>
      </div>

      {/* Quick Invite Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Invite</CardTitle>
          <CardDescription>Send an invitation by email or share an invite link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email invite */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40 space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send Invite
            </Button>
          </div>

          <Separator />

          {/* Invite link */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              Or share invite link
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                readOnly
                value="https://app.taskflow.com/invite/wks_a1b2c3d4"
                className="flex-1 font-mono text-sm bg-muted"
              />
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                  {linkCopied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate Link
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Link expires in 7 days</p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>{pendingInvitations.length} invitations awaiting response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="hidden sm:grid sm:grid-cols-[1fr_100px_100px_100px_160px] gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b">
              <div>Email</div>
              <div>Role</div>
              <div>Sent</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            {pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_100px_160px] gap-2 sm:gap-4 items-center px-4 py-3 border-b last:border-b-0"
              >
                <div className="font-medium text-sm truncate">{inv.email}</div>
                <div>
                  <Badge variant="outline" className="text-xs">
                    {inv.role}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{inv.sent}</div>
                <div>
                  <Badge
                    className={cn(
                      "text-xs",
                      inv.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100"
                    )}
                  >
                    {inv.status}
                  </Badge>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                    <RotateCw className="h-3 w-3" />
                    Resend
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                    {inv.status === "Expired" ? "Remove" : "Revoke"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shared Projects */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Shared Projects</h2>
          <p className="text-sm text-muted-foreground">Projects shared with team members and external collaborators.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sharedProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FolderOpen className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{project.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {project.members} members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    {project.external} {project.externalLabel}
                  </span>
                </div>
                <Dialog
                  open={manageDialogOpen === project.id}
                  onOpenChange={(open) => setManageDialogOpen(open ? project.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Access
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Manage Access - {project.name}</DialogTitle>
                      <DialogDescription>
                        Control who has access to this project.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Add people input */}
                      <div className="flex gap-2">
                        <Input placeholder="Add people by email..." className="flex-1" />
                        <Button size="sm">Add</Button>
                      </div>

                      <Separator />

                      {/* People list */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {project.people.map((person, idx) => (
                          <div key={idx} className="flex items-center gap-3 py-1.5">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={cn("text-xs text-white", person.color)}>
                                {getInitials(person.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{person.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{person.email}</p>
                            </div>
                            {person.role === "Owner" ? (
                              <Badge variant="outline" className="text-xs shrink-0">Owner</Badge>
                            ) : (
                              <div className="flex items-center gap-2 shrink-0">
                                <Select defaultValue={person.role}>
                                  <SelectTrigger className="h-7 w-24 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Editor">Editor</SelectItem>
                                    <SelectItem value="Viewer">Viewer</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Link sharing toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Anyone with the link can view</p>
                            <p className="text-xs text-muted-foreground">Public link sharing</p>
                          </div>
                        </div>
                        <Switch
                          checked={projectLinkSharing[project.id] ?? false}
                          onCheckedChange={(checked) =>
                            setProjectLinkSharing((prev) => ({ ...prev, [project.id]: checked }))
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setManageDialogOpen(null)}>
                        Done
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Shared Documents */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Shared Documents</h2>
          <p className="text-sm text-muted-foreground">Documents shared within and outside your workspace.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sharedDocuments.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base">{doc.name}</CardTitle>
                    <CardDescription className="text-xs">{doc.sharedWith}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {doc.linkEnabled ? (
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={doc.link}
                      className="flex-1 text-xs font-mono bg-muted h-8"
                    />
                    <Button variant="outline" size="sm" className="h-8 gap-1 shrink-0">
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link2 className="h-4 w-4" />
                    <span>Link sharing disabled</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {doc.linkEnabled ? "Public link enabled" : "No public link"}
                  </span>
                  <Badge variant={doc.linkEnabled ? "default" : "secondary"} className="text-xs">
                    {doc.linkEnabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
