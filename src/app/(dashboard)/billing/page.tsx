"use client";

import { useState } from "react";
import {
  CreditCard,
  Download,
  CheckCircle2,
  Crown,
  Building2,
  Rocket,
  CalendarDays,
  Users,
  Video,
  FolderOpen,
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
import { cn } from "@/lib/utils";

const usageMetrics = [
  {
    label: "Videos",
    used: 15,
    total: 30,
    icon: Video,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Projects",
    used: 3,
    total: 10,
    icon: FolderOpen,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    label: "Team Members",
    used: 4,
    total: 5,
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
  },
];

const plans = [
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For individuals and small teams",
    icon: Crown,
    current: true,
    features: [
      "30 videos per month",
      "10 projects",
      "5 team members",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
    ],
    color: "border-primary",
    bg: "bg-primary/5",
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    description: "For growing teams and companies",
    icon: Building2,
    current: false,
    features: [
      "100 videos per month",
      "Unlimited projects",
      "25 team members",
      "Priority support",
      "Custom branding",
      "Advanced analytics",
      "API access",
      "SSO integration",
    ],
    color: "border-border",
    bg: "",
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "/month",
    description: "For large organizations",
    icon: Rocket,
    current: false,
    features: [
      "Unlimited videos",
      "Unlimited projects",
      "Unlimited team members",
      "Dedicated support",
      "Custom branding",
      "Advanced analytics",
      "API access",
      "SSO & SAML",
      "Custom SLA",
      "On-premise option",
    ],
    color: "border-border",
    bg: "",
  },
];

const invoices = [
  {
    date: "Mar 15, 2026",
    description: "Pro Plan - Monthly",
    amount: "$12.00",
    status: "Paid",
  },
  {
    date: "Feb 15, 2026",
    description: "Pro Plan - Monthly",
    amount: "$12.00",
    status: "Paid",
  },
  {
    date: "Jan 15, 2026",
    description: "Pro Plan - Monthly",
    amount: "$12.00",
    status: "Paid",
  },
  {
    date: "Dec 15, 2025",
    description: "Pro Plan - Monthly",
    amount: "$12.00",
    status: "Paid",
  },
  {
    date: "Nov 15, 2025",
    description: "Pro Plan - Monthly",
    amount: "$12.00",
    status: "Paid",
  },
  {
    date: "Oct 15, 2025",
    description: "Free Trial",
    amount: "$0.00",
    status: "Paid",
  },
];

export default function BillingPage() {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your plan, payment method, and invoices
        </p>
      </div>

      {/* Current Plan Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Pro Plan &mdash; $12/month
                </CardTitle>
                <CardDescription>
                  Next billing date: April 15, 2026
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {usageMetrics.map((metric) => {
            const percentage = Math.round(
              (metric.used / metric.total) * 100
            );
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <metric.icon
                      className={cn("h-4 w-4", metric.color)}
                    />
                    <span className="font-medium">{metric.label}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {metric.used} of {metric.total} used
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className={cn(
                    "h-2",
                    percentage >= 80 ? "[&>div]:bg-amber-500" : ""
                  )}
                />
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex gap-3 pt-2">
          <Button>Upgrade Plan</Button>
          <Button variant="outline" className="text-destructive hover:text-destructive">
            Cancel Subscription
          </Button>
        </CardFooter>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Compare Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col",
                plan.current && "border-primary border-2 shadow-md",
                plan.bg
              )}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="shadow-sm">Current Plan</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      plan.current
                        ? "bg-primary/10"
                        : "bg-muted"
                    )}
                  >
                    <plan.icon
                      className={cn(
                        "h-5 w-5",
                        plan.current
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
                <CardDescription className="mt-1">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.current ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full">
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </div>
            <Dialog
              open={paymentDialogOpen}
              onOpenChange={setPaymentDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">Update Payment Method</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Payment Method</DialogTitle>
                  <DialogDescription>
                    Enter your new card details below
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="John Doe" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setPaymentDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setPaymentDialogOpen(false)}>
                    Update Card
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-muted-foreground">
                Expires 12/27
              </p>
            </div>
            <Badge variant="secondary">Default</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-[1fr_1.5fr_0.75fr_0.75fr_0.5fr] gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>Date</div>
              <div>Description</div>
              <div>Amount</div>
              <div>Status</div>
              <div className="text-right">Invoice</div>
            </div>
            {invoices.map((invoice, index) => (
              <div
                key={index}
                className={cn(
                  "grid grid-cols-[1fr_1.5fr_0.75fr_0.75fr_0.5fr] gap-4 px-4 py-3 text-sm items-center",
                  index < invoices.length - 1 && "border-b"
                )}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{invoice.date}</span>
                </div>
                <div>{invoice.description}</div>
                <div className="font-medium">{invoice.amount}</div>
                <div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
