"use client";

import { useState, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Smartphone,
  Monitor,
  Laptop,
  LogOut,
  Eye,
  EyeOff,
  Key,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Link2,
  Chrome,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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

const backupCodes = [
  { code: "A3K9-M2P7", used: true },
  { code: "B7L2-N4Q8", used: true },
  { code: "C1M5-R6S3", used: true },
  { code: "D8N3-T9U2", used: true },
  { code: "E4P1-V7W5", used: true },
  { code: "F6Q8-X2Y4", used: true },
  { code: "G2R4-Z1A6", used: true },
  { code: "H5S7-B3C9", used: false },
  { code: "J9T1-D8E2", used: false },
  { code: "K3U6-F4G7", used: false },
];

const sessions = [
  {
    id: 1,
    device: "Chrome on Windows",
    icon: Chrome,
    ip: "192.168.1.42",
    location: "San Francisco, CA",
    lastActive: "Now",
    current: true,
  },
  {
    id: 2,
    device: "Safari on iPhone",
    icon: Smartphone,
    ip: "10.0.0.15",
    location: "San Francisco, CA",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: 3,
    device: "Firefox on MacOS",
    icon: Laptop,
    ip: "72.134.92.11",
    location: "New York, NY",
    lastActive: "3 days ago",
    current: false,
  },
];

const connectedAccounts = [
  {
    id: 1,
    provider: "Google",
    identifier: "demo@gmail.com",
    connected: true,
    icon: "G",
    color: "bg-red-500 text-white",
  },
  {
    id: 2,
    provider: "GitHub",
    identifier: "demo-user",
    connected: true,
    icon: "GH",
    color: "bg-gray-900 text-white dark:bg-gray-700",
  },
  {
    id: 3,
    provider: "Microsoft",
    identifier: "",
    connected: false,
    icon: "MS",
    color: "bg-blue-600 text-white",
  },
  {
    id: 4,
    provider: "Apple",
    identifier: "",
    connected: false,
    icon: "A",
    color: "bg-gray-800 text-white",
  },
];

const loginHistory = [
  { id: 1, date: "Mar 31, 2026 10:23 AM", ip: "192.168.1.42", location: "San Francisco, CA", device: "Chrome / Windows", status: "Success" as const },
  { id: 2, date: "Mar 31, 2026 08:15 AM", ip: "10.0.0.15", location: "San Francisco, CA", device: "Safari / iPhone", status: "Success" as const },
  { id: 3, date: "Mar 30, 2026 09:45 PM", ip: "72.134.92.11", location: "New York, NY", device: "Firefox / MacOS", status: "Success" as const },
  { id: 4, date: "Mar 30, 2026 03:12 PM", ip: "192.168.1.42", location: "San Francisco, CA", device: "Chrome / Windows", status: "Success" as const },
  { id: 5, date: "Mar 29, 2026 11:30 AM", ip: "45.67.89.12", location: "Chicago, IL", device: "Chrome / Linux", status: "Failed" as const },
  { id: 6, date: "Mar 29, 2026 08:05 AM", ip: "192.168.1.42", location: "San Francisco, CA", device: "Chrome / Windows", status: "Success" as const },
  { id: 7, date: "Mar 28, 2026 07:20 PM", ip: "10.0.0.15", location: "San Francisco, CA", device: "Safari / iPhone", status: "Success" as const },
  { id: 8, date: "Mar 27, 2026 02:45 PM", ip: "98.76.54.32", location: "Austin, TX", device: "Edge / Windows", status: "Failed" as const },
  { id: 9, date: "Mar 27, 2026 09:10 AM", ip: "192.168.1.42", location: "San Francisco, CA", device: "Chrome / Windows", status: "Success" as const },
  { id: 10, date: "Mar 26, 2026 04:30 PM", ip: "72.134.92.11", location: "New York, NY", device: "Firefox / MacOS", status: "Success" as const },
];

function getPasswordStrength(password: string): { label: string; value: number; color: string } {
  if (!password) return { label: "", value: 0, color: "" };
  if (password.length < 4) return { label: "Weak", value: 20, color: "bg-red-500" };
  if (password.length < 8) return { label: "Fair", value: 45, color: "bg-orange-500" };
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const variety = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (password.length >= 12 && variety >= 3) return { label: "Very Strong", value: 100, color: "bg-emerald-500" };
  if (password.length >= 8 && variety >= 2) return { label: "Strong", value: 75, color: "bg-green-500" };
  return { label: "Fair", value: 45, color: "bg-orange-500" };
}

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [codesDialogOpen, setCodesDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Manage your security settings, connected accounts, and sessions.
        </p>
      </div>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>Two-Factor Authentication</CardTitle>
            </div>
            <Badge
              className={cn(
                "text-xs",
                twoFactorEnabled
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100"
              )}
            >
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {twoFactorEnabled ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Method</p>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Authenticator App</p>
                  </div>
                </div>
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Backup Codes</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">3 of 10 remaining</p>
                    <Dialog open={codesDialogOpen} onOpenChange={setCodesDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          View Codes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Backup Codes</DialogTitle>
                          <DialogDescription>
                            Save these codes in a secure place. Each code can only be used once.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-2">
                          {backupCodes.map((bc, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "rounded-md border px-3 py-2 font-mono text-sm text-center",
                                bc.used
                                  ? "line-through text-muted-foreground bg-muted/50"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                              )}
                            >
                              {bc.code}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span>7 codes have been used. Consider generating new codes.</span>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCodesDialogOpen(false)}>
                            Close
                          </Button>
                          <Button>Generate New Codes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setTwoFactorEnabled(false)}
              >
                Disable Two-Factor
              </Button>
            </>
          ) : (
            <Button onClick={() => setTwoFactorEnabled(true)}>
              <Shield className="h-4 w-4 mr-2" />
              Enable Two-Factor Authentication
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Devices currently logged into your account.</CardDescription>
            </div>
            <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Revoke All Other Sessions
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Revoke All Other Sessions?</DialogTitle>
                  <DialogDescription>
                    This will sign out all other devices. You will remain logged in on this device only. Other sessions will need to re-authenticate.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => setRevokeDialogOpen(false)}>
                    Revoke All Sessions
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((session) => {
              const Icon = session.icon;
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{session.device}</p>
                      {session.current && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 text-xs">
                          Current session
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span>IP: {session.ip}</span>
                      <span>{session.location}</span>
                      <span>Last active: {session.lastActive}</span>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive shrink-0">
                      Revoke
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Connected Accounts
          </CardTitle>
          <CardDescription>Manage third-party accounts linked to your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold",
                    account.color
                  )}
                >
                  {account.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{account.provider}</p>
                  {account.connected ? (
                    <p className="text-xs text-muted-foreground">{account.identifier}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Not connected</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {account.connected && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 text-xs">
                      Connected
                    </Badge>
                  )}
                  <Button
                    variant={account.connected ? "outline" : "default"}
                    size="sm"
                  >
                    {account.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>Recent login attempts for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="hidden md:grid md:grid-cols-[180px_130px_150px_150px_90px] gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b min-w-[700px]">
              <div>Date & Time</div>
              <div>IP Address</div>
              <div>Location</div>
              <div>Device / Browser</div>
              <div>Status</div>
            </div>
            {loginHistory.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-1 md:grid-cols-[180px_130px_150px_150px_90px] gap-2 md:gap-4 items-center px-4 py-3 border-b last:border-b-0 min-w-[700px]"
              >
                <div className="text-sm">{entry.date}</div>
                <div className="text-sm font-mono text-muted-foreground">{entry.ip}</div>
                <div className="text-sm text-muted-foreground">{entry.location}</div>
                <div className="text-sm text-muted-foreground">{entry.device}</div>
                <div>
                  {entry.status === "Success" ? (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 text-xs gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Success
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 text-xs gap-1">
                      <XCircle className="h-3 w-3" />
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md space-y-4">
            {/* Current password */}
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* New password */}
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {/* Password strength indicator */}
              {newPassword && (
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-300", strength.color)}
                      style={{ width: `${strength.value}%` }}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium",
                      strength.value <= 20 && "text-red-600",
                      strength.value === 45 && "text-orange-600",
                      strength.value === 75 && "text-green-600",
                      strength.value === 100 && "text-emerald-600"
                    )}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {confirmPassword && newPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button className="mt-2">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
