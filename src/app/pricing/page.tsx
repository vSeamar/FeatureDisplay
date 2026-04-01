"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap, Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    monthlyPrice: 0,
    description: "For individuals and small experiments.",
    features: [
      { text: "3 projects", included: true },
      { text: "50 tasks", included: true },
      { text: "1 team member", included: true },
      { text: "Basic Kanban board", included: true },
      { text: "Community support", included: true },
      { text: "AI assistant", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Priority support", included: false },
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    description:
      "For growing teams that need more power and AI-driven insights.",
    features: [
      { text: "10 projects", included: true },
      { text: "Unlimited tasks", included: true },
      { text: "5 team members", included: true },
      { text: "AI assistant", included: true },
      { text: "Calendar view", included: true },
      { text: "Priority email support", included: true },
      { text: "Advanced analytics", included: false },
      { text: "SSO / SAML", included: false },
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    name: "Business",
    monthlyPrice: 39,
    description:
      "For scaling organizations that need advanced analytics and support.",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Unlimited tasks", included: true },
      { text: "25 team members", included: true },
      { text: "Advanced analytics", included: true },
      { text: "AI assistant", included: true },
      { text: "Priority support", included: true },
      { text: "Custom workflows", included: true },
      { text: "API access", included: true },
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    description:
      "For large organizations needing enterprise-grade security and control.",
    features: [
      { text: "Everything in Business", included: true },
      { text: "Unlimited team members", included: true },
      { text: "SSO / SAML", included: true },
      { text: "Audit log", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "99.9% SLA", included: true },
      { text: "On-premise option", included: true },
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

const faqs = [
  {
    question: "Can I try TaskFlow for free before committing?",
    answer:
      "Absolutely. The Free plan has no time limit, and paid plans come with a 14-day free trial -- no credit card required. You can explore all features and upgrade, downgrade, or cancel at any time.",
  },
  {
    question: "How does the annual billing discount work?",
    answer:
      "When you choose annual billing, you save 20% compared to monthly pricing. You pay once a year and the discount is applied automatically. You can switch between monthly and annual at any time.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, the new features are available immediately and you'll be charged a prorated amount for the rest of the billing period. Downgrades take effect at the next billing cycle.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "You'll receive a notification when you're approaching your project or task limits. You can upgrade at any time to unlock more capacity. We never delete your data -- you just won't be able to create new items until you upgrade.",
  },
  {
    question: "Do you offer discounts for nonprofits or education?",
    answer:
      "Yes! We offer a 50% discount for registered nonprofits and educational institutions. Contact our sales team at sales@taskflow.com with your organization details and we'll get you set up.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  function getDisplayPrice(monthlyPrice: number | null): string {
    if (monthlyPrice === null) return "Custom";
    if (monthlyPrice === 0) return "$0";
    if (annual) {
      const discounted = Math.round(monthlyPrice * 0.8);
      return `$${discounted}`;
    }
    return `$${monthlyPrice}`;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pb-4 pt-20 sm:pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_60%)]" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <Label
              htmlFor="billing-toggle"
              className={cn(
                "text-sm font-medium",
                !annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={annual}
              onCheckedChange={setAnnual}
            />
            <Label
              htmlFor="billing-toggle"
              className={cn(
                "text-sm font-medium",
                annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Annual
            </Label>
            {annual && (
              <Badge variant="secondary" className="ml-1 text-xs font-medium">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={cn(
                  "relative flex flex-col",
                  tier.popular &&
                    "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1 text-xs">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-8">
                    <span className="text-4xl font-bold">
                      {getDisplayPrice(tier.monthlyPrice)}
                    </span>
                    {tier.monthlyPrice !== null && (
                      <span className="text-muted-foreground">/mo</span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature.text}
                        className="flex items-center gap-3 text-sm"
                      >
                        {feature.included ? (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <Minus className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                        )}
                        <span
                          className={cn(
                            !feature.included && "text-muted-foreground/60"
                          )}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/signup">{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-base font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/" className="text-foreground hover:text-primary">
            TaskFlow
          </Link>{" "}
          &copy; {new Date().getFullYear()}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
