"use client";

import { useState } from "react";
import {
  LifeBuoy,
  Search,
  BookOpen,
  Keyboard,
  Code,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Send,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const quickLinks = [
  {
    title: "Getting Started",
    description: "Learn the basics of TaskFlow",
    icon: BookOpen,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Keyboard Shortcuts",
    description: "Speed up your workflow",
    icon: Keyboard,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "API Documentation",
    description: "Integrate with your tools",
    icon: Code,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    title: "Contact Support",
    description: "Get help from our team",
    icon: MessageCircle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

const faqs = [
  {
    question: "How do I create a new project?",
    answer:
      'To create a new project, click the "New Project" button in the sidebar or on your dashboard. Give it a name, choose a color, and optionally add a description. You can then invite team members and start adding tasks right away. Projects can be organized into folders for easier management.',
  },
  {
    question: "Can I invite external collaborators?",
    answer:
      'Yes! You can invite external collaborators by going to your project settings and clicking "Invite Members." Enter their email address and choose their permission level (Viewer, Commenter, or Editor). External collaborators will receive an email invitation and can join without needing a full TaskFlow account.',
  },
  {
    question: "How does the AI Assistant work?",
    answer:
      "TaskFlow's AI Assistant analyzes your task history, deadlines, and team workload to provide intelligent suggestions. It can recommend task priorities, estimate completion times, help with sprint planning, and even draft task descriptions. Access it from the AI tab in your sidebar. The AI learns from your team's patterns and gets smarter over time.",
  },
  {
    question: "What's included in each plan?",
    answer:
      "TaskFlow offers three plans: Pro ($12/month) includes 30 videos, 10 projects, and 5 team members. Business ($29/month) offers 100 videos, unlimited projects, 25 team members, and API access. Enterprise ($79/month) provides unlimited everything, dedicated support, SSO/SAML, and custom SLA. Visit the Billing page for a detailed comparison.",
  },
  {
    question: "How do I export my data?",
    answer:
      'You can export your data at any time from Settings > Data Management. TaskFlow supports CSV export for tasks and projects, and PDF export for reports and analytics. Bulk exports are available for Enterprise users. Your data belongs to you — we make it easy to take it with you.',
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. TaskFlow uses AES-256 encryption at rest and TLS 1.3 for data in transit. We are SOC 2 Type II certified, GDPR compliant, and undergo regular third-party security audits. All data is stored in geographically redundant data centers. We also support two-factor authentication and SSO for Enterprise customers.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [priority, setPriority] = useState("");

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const handleSend = () => {
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <LifeBuoy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground mt-1">
            Find answers, learn features, and get in touch with support
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search help articles..."
          className="pl-9 h-11"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Card
            key={link.title}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
          >
            <CardContent className="p-5">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg mb-3",
                  link.bg
                )}
              >
                <link.icon className={cn("h-5 w-5", link.color)} />
              </div>
              <h3 className="font-semibold">{link.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {link.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {filteredFaqs.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No matching questions found. Try a different search term or
                contact support below.
              </CardContent>
            </Card>
          )}
          {filteredFaqs.map((faq, index) => {
            const originalIndex = faqs.indexOf(faq);
            const isExpanded = expandedFaq === originalIndex;
            return (
              <Card key={originalIndex}>
                <div
                  className={cn(
                    "flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-muted/30",
                    isExpanded ? "rounded-t-xl" : "rounded-xl"
                  )}
                  onClick={() =>
                    setExpandedFaq(isExpanded ? null : originalIndex)
                  }
                >
                  <h3 className="font-medium pr-4">{faq.question}</h3>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </div>
                {isExpanded && (
                  <CardContent className="border-t pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Contact Support Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <MessageCircle className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Can&apos;t find what you need? Send us a message and we&apos;ll
                help.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {messageSent ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold">Message Sent!</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                We&apos;ll get back to you within 24 hours. Check your email for
                a confirmation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="support-name">Name</Label>
                  <Input id="support-name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="support-subject">Subject</Label>
                  <Input
                    id="support-subject"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-message">Message</Label>
                <Textarea
                  id="support-message"
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                />
              </div>
            </div>
          )}
        </CardContent>
        {!messageSent && (
          <CardFooter>
            <Button onClick={handleSend} className="gap-2">
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
