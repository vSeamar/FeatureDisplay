"use client";

import { useState } from "react";
import {
  Gift,
  Copy,
  Check,
  Mail,
  UserPlus,
  Send,
  DollarSign,
  Users,
  ArrowRight,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const referralStats = [
  {
    label: "Referrals Sent",
    value: "12",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  {
    label: "Signed Up",
    value: "7",
    icon: UserPlus,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  {
    label: "Rewards Earned",
    value: "$175",
    icon: DollarSign,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/40",
  },
];

const steps = [
  {
    title: "Share Your Link",
    description: "Send your unique referral link to friends and colleagues",
    icon: Mail,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  {
    title: "They Sign Up",
    description: "When they create an account and start a trial",
    icon: UserPlus,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  {
    title: "You Both Earn",
    description: "You get $25 credit, they get 20% off first month",
    icon: Gift,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/40",
  },
];

const referralHistory = [
  {
    name: "Alex Kim",
    email: "alex@example.com",
    status: "Signed Up",
    reward: "$25",
    date: "Mar 15",
  },
  {
    name: "Lisa Park",
    email: "lisa@company.com",
    status: "Subscribed",
    reward: "$25",
    date: "Mar 10",
  },
  {
    name: "Mike Chen",
    email: "mike@startup.io",
    status: "Signed Up",
    reward: "$25",
    date: "Mar 5",
  },
  {
    name: "Sarah Lee",
    email: "sarah@agency.com",
    status: "Signed Up",
    reward: "$25",
    date: "Feb 28",
  },
  {
    name: "Tom Nguyen",
    email: "tom@tech.co",
    status: "Pending",
    reward: "",
    date: "Feb 20",
  },
  {
    name: "Anna Wu",
    email: "anna@design.co",
    status: "Subscribed",
    reward: "$25",
    date: "Feb 15",
  },
  {
    name: "James Fox",
    email: "james@corp.com",
    status: "Subscribed",
    reward: "$25",
    date: "Feb 10",
  },
];

const statusStyles: Record<string, string> = {
  Subscribed:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  "Signed Up":
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  Pending:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  Expired:
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800",
};

const socialButtons = [
  { label: "Twitter/X", bg: "bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 text-white" },
  { label: "LinkedIn", bg: "bg-blue-700 text-white" },
  { label: "Email", bg: "bg-red-600 text-white" },
  { label: "WhatsApp", bg: "bg-emerald-600 text-white" },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Refer &amp; Earn
            </h1>
            <p className="text-muted-foreground">
              Invite friends and earn rewards for each signup.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {referralStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    stat.bg
                  )}
                >
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with friends and colleagues to start earning rewards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value="https://taskflow.com/ref/demo-user-abc123"
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              className="shrink-0 gap-1.5"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <Label>Share via</Label>
            <div className="flex flex-wrap gap-2">
              {socialButtons.map((btn) => (
                <button
                  key={btn.label}
                  className={cn(
                    "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90",
                    btn.bg
                  )}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              Share via Email
              <ArrowRight
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  showEmailForm && "rotate-90"
                )}
              />
            </button>

            {showEmailForm && (
              <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient-email">Recipient Email</Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    placeholder="friend@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personal-message">Personal Message</Label>
                  <Textarea
                    id="personal-message"
                    placeholder="Hey! I've been using TaskFlow and thought you'd love it..."
                    rows={3}
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                  />
                </div>
                <Button className="gap-1.5">
                  <Send className="h-4 w-4" />
                  Send Invitation
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                    {index + 1}
                  </div>
                  <div
                    className={cn(
                      "mb-4 flex h-14 w-14 items-center justify-center rounded-lg",
                      step.bg
                    )}
                  >
                    <step.icon className={cn("h-7 w-7", step.color)} />
                  </div>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>
            Track the status of all your referrals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-[1.2fr_1.5fr_1fr_0.7fr_0.7fr] gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>Referred</div>
              <div>Email</div>
              <div>Status</div>
              <div>Reward</div>
              <div>Date</div>
            </div>
            {referralHistory.map((referral, index) => (
              <div
                key={referral.email}
                className={cn(
                  "grid grid-cols-[1.2fr_1.5fr_1fr_0.7fr_0.7fr] gap-4 px-4 py-3 text-sm items-center",
                  index < referralHistory.length - 1 && "border-b"
                )}
              >
                <div className="font-medium">{referral.name}</div>
                <div className="text-muted-foreground">{referral.email}</div>
                <div>
                  <Badge
                    variant="secondary"
                    className={statusStyles[referral.status]}
                  >
                    {referral.status}
                  </Badge>
                </div>
                <div className="font-medium">
                  {referral.reward || <span className="text-muted-foreground">&mdash;</span>}
                </div>
                <div className="text-muted-foreground">{referral.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Rewards</CardTitle>
          <CardDescription>
            Your referral earnings and redemption options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-3xl font-bold tracking-tight">$175</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold tracking-tight">$75</p>
              <p className="mt-1 text-xs text-muted-foreground">
                $100 applied to billing
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-3">
          <Button>Apply to Billing</Button>
          <Button variant="outline" disabled>
            Cash Out
            <span className="ml-1.5 text-xs text-muted-foreground">
              (Available at $100+)
            </span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
