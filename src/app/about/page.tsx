import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Zap,
  Lightbulb,
  Eye,
  Users,
  Heart,
} from "lucide-react";

const stats = [
  { label: "Teams", value: "10,000+" },
  { label: "Tasks Completed", value: "2M+" },
  { label: "Countries", value: "150+" },
  { label: "Uptime", value: "99.9%" },
];

const team = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-founder",
    initials: "AR",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    name: "Priya Sharma",
    role: "CTO & Co-founder",
    initials: "PS",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  {
    name: "Jordan Kim",
    role: "VP of Design",
    initials: "JK",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  {
    name: "Taylor Brooks",
    role: "VP of Engineering",
    initials: "TB",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We push boundaries by investing in AI and cutting-edge technology to solve real workflow problems, not just follow trends.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Open pricing, a public roadmap, and honest communication. We believe trust is built through visibility, not marketing speak.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We build for teams because we are a team. Every feature is tested internally before it ships, and feedback drives every decision.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Our customers' success is our success. We measure ourselves by the outcomes our users achieve, not just the features we ship.",
  },
];

export default function AboutPage() {
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
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground transition-colors"
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
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_60%)]" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Built for teams that{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              ship
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            We started TaskFlow because we were tired of project management tools
            that felt like they were designed in 2010. Modern teams deserve
            software that is fast, intelligent, and genuinely enjoyable to use.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Our mission is simple: help every team on earth ship their best work
            — on time and without the chaos. We combine AI-powered insights with
            beautiful, intuitive design so teams can focus on what matters:
            building great products together.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Meet the team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A small, passionate team building tools we want to use every day.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="pt-8 pb-6">
                  <Avatar className="mx-auto h-20 w-20">
                    <AvatarFallback
                      className={`text-lg font-bold ${member.color}`}
                    >
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-base font-semibold">{member.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we build.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <Card
                key={value.title}
                className="border-transparent bg-background shadow-none"
              >
                <CardContent className="flex gap-5 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of teams already shipping faster with TaskFlow. Start
            for free, no credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="px-8">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8">
              <Link href="/pricing">See Pricing</Link>
            </Button>
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
