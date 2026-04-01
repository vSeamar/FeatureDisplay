"use client";

import { useState } from "react";
import {
  UserPlus,
  Mail,
  MoreHorizontal,
  Shield,
  Crown,
  User,
  Eye,
  Users,
  FolderOpen,
  UserCog,
  UserMinus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials, formatDate } from "@/lib/utils";

const roleConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Owner: {
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Crown,
  },
  Admin: {
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Shield,
  },
  Member: {
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    icon: User,
  },
  Viewer: {
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    icon: Eye,
  },
};

const statusConfig: Record<string, { color: string; dot: string }> = {
  Active: {
    color: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Inactive: {
    color: "text-gray-500 dark:text-gray-400",
    dot: "bg-gray-400",
  },
};

const avatarColors = [
  "bg-blue-600 text-white",
  "bg-emerald-600 text-white",
  "bg-purple-600 text-white",
  "bg-amber-600 text-white",
  "bg-rose-600 text-white",
  "bg-indigo-600 text-white",
  "bg-teal-600 text-white",
  "bg-orange-600 text-white",
];

const teamMembers = [
  {
    id: 1,
    name: "Carlos Martinez",
    email: "carlos@taskflow.io",
    role: "Owner",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@taskflow.io",
    role: "Admin",
    status: "Active",
    joinDate: "2024-02-08",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex@taskflow.io",
    role: "Admin",
    status: "Active",
    joinDate: "2024-03-12",
  },
  {
    id: 4,
    name: "Maria Lopez",
    email: "maria@taskflow.io",
    role: "Member",
    status: "Active",
    joinDate: "2024-05-20",
  },
  {
    id: 5,
    name: "Jake Williams",
    email: "jake@taskflow.io",
    role: "Member",
    status: "Active",
    joinDate: "2024-06-03",
  },
  {
    id: 6,
    name: "Emily Park",
    email: "emily@taskflow.io",
    role: "Member",
    status: "Active",
    joinDate: "2024-08-14",
  },
  {
    id: 7,
    name: "David Kim",
    email: "david@taskflow.io",
    role: "Viewer",
    status: "Inactive",
    joinDate: "2024-09-22",
  },
  {
    id: 8,
    name: "Rachel Nguyen",
    email: "rachel@taskflow.io",
    role: "Member",
    status: "Active",
    joinDate: "2024-10-05",
  },
];

const teamStats = [
  { label: "Members", value: 8, icon: Users },
  { label: "Admins", value: 3, icon: Shield },
  { label: "Active Projects", value: 5, icon: FolderOpen },
];

export default function TeamPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team. They will receive an email
                with a link to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {inviteRole === "Admin"
                    ? "Admins can manage projects, members, and settings."
                    : inviteRole === "Viewer"
                      ? "Viewers can view projects and tasks but cannot make changes."
                      : "Members can view and manage tasks assigned to them."}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  setInviteEmail("");
                  setInviteRole("Member");
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {teamStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Members</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, i) => {
                  const role = roleConfig[member.role];
                  const RoleIcon = role.icon;
                  const status = statusConfig[member.status];
                  return (
                    <tr
                      key={member.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback
                              className={cn(
                                "text-xs font-semibold",
                                avatarColors[i % avatarColors.length]
                              )}
                            >
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-tight">
                              {member.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn("gap-1", role.color)}>
                          <RoleIcon className="h-3 w-3" />
                          {member.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              status.dot
                            )}
                          />
                          <span
                            className={cn("text-sm", status.color)}
                          >
                            {member.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(member.joinDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {member.role !== "Owner" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <UserCog className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <UserMinus className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
