"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Pin,
  Clock,
  User,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Trash2,
  ArrowLeft,
  FileText,
  Tag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface Article {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  updatedAgo: string;
  readTime: string;
  preview: string;
  pinned?: boolean;
  category: string;
  tags: string[];
  content: ArticleContent;
  relatedArticles: string[];
  helpful: number;
  notHelpful: number;
}

interface ArticleContent {
  sections: {
    type: "heading" | "paragraph" | "bullets" | "code";
    text?: string;
    items?: string[];
  }[];
}

const categories = [
  { name: "All Articles", count: 21 },
  { name: "Getting Started", count: 4 },
  { name: "Development", count: 6 },
  { name: "Design", count: 3 },
  { name: "Processes", count: 5 },
  { name: "Policies", count: 3 },
];

const articles: Article[] = [
  {
    id: "welcome",
    title: "Welcome to TaskFlow",
    author: "Demo User",
    authorInitials: "DU",
    updatedAgo: "2 days ago",
    readTime: "5 min read",
    preview:
      "Welcome to the team! This guide covers everything you need to know...",
    pinned: true,
    category: "Getting Started",
    tags: ["onboarding", "welcome"],
    helpful: 24,
    notHelpful: 1,
    relatedArticles: [
      "Setting Up Your Development Environment",
      "How to Create Your First Project",
      "Team Communication Guidelines",
    ],
    content: {
      sections: [
        { type: "heading", text: "Welcome to TaskFlow" },
        {
          type: "paragraph",
          text: "Welcome to the team! We are thrilled to have you on board. This guide is designed to help you get up to speed quickly and start contributing from day one. TaskFlow is our project management platform that keeps everyone aligned and productive.",
        },
        { type: "heading", text: "What is TaskFlow?" },
        {
          type: "paragraph",
          text: "TaskFlow is an all-in-one project management and collaboration tool built for modern teams. It combines task tracking, documentation, real-time communication, and analytics into a single platform.",
        },
        { type: "heading", text: "Key Features" },
        {
          type: "bullets",
          items: [
            "Project boards with customizable workflows",
            "Real-time collaboration and commenting",
            "Time tracking and reporting",
            "Integrations with GitHub, Slack, and Figma",
            "Automated workflows and notifications",
          ],
        },
        { type: "heading", text: "Getting Your Account Set Up" },
        {
          type: "paragraph",
          text: "Your admin should have sent you an invitation email. Click the link to create your account. Once logged in, you will see the dashboard with your assigned projects and tasks.",
        },
        { type: "heading", text: "Quick Start Commands" },
        {
          type: "code",
          text: "# Clone the team repository\ngit clone https://github.com/team/taskflow-app.git\n\n# Install dependencies\nnpm install\n\n# Start the development server\nnpm run dev",
        },
        { type: "heading", text: "Need Help?" },
        {
          type: "paragraph",
          text: "If you have any questions, do not hesitate to reach out in the #general channel on Slack, or contact your team lead directly. We are here to help you succeed!",
        },
      ],
    },
  },
  {
    id: "dev-env",
    title: "Setting Up Your Development Environment",
    author: "Sarah Chen",
    authorInitials: "SC",
    updatedAgo: "1 week ago",
    readTime: "8 min read",
    preview:
      "Follow these steps to get your local development environment running...",
    category: "Getting Started",
    tags: ["development", "setup"],
    helpful: 18,
    notHelpful: 2,
    relatedArticles: [
      "Welcome to TaskFlow",
      "How to Create Your First Project",
    ],
    content: {
      sections: [
        { type: "heading", text: "Development Environment Setup" },
        {
          type: "paragraph",
          text: "This guide walks you through setting up your local development environment for TaskFlow. Follow each step carefully to ensure everything is configured correctly.",
        },
        { type: "heading", text: "Prerequisites" },
        {
          type: "bullets",
          items: [
            "Node.js 18 or later",
            "npm or yarn package manager",
            "Git version control",
            "VS Code (recommended) or your preferred editor",
            "Docker Desktop (for local database)",
          ],
        },
        { type: "heading", text: "Installation" },
        {
          type: "code",
          text: "# 1. Clone the repository\ngit clone https://github.com/team/taskflow-app.git\ncd taskflow-app\n\n# 2. Install dependencies\nnpm install\n\n# 3. Copy environment variables\ncp .env.example .env.local\n\n# 4. Start the database\ndocker-compose up -d\n\n# 5. Run migrations\nnpm run db:migrate\n\n# 6. Start the dev server\nnpm run dev",
        },
        { type: "heading", text: "Troubleshooting" },
        {
          type: "paragraph",
          text: "If you encounter issues with the database connection, make sure Docker Desktop is running and the containers are healthy. You can check with docker ps to see the status of running containers.",
        },
      ],
    },
  },
  {
    id: "first-project",
    title: "How to Create Your First Project",
    author: "Alex Rivera",
    authorInitials: "AR",
    updatedAgo: "3 days ago",
    readTime: "3 min read",
    preview:
      "Projects are the core unit of work in TaskFlow. Here's how to...",
    category: "Getting Started",
    tags: ["projects", "beginner"],
    helpful: 12,
    notHelpful: 0,
    relatedArticles: [
      "Welcome to TaskFlow",
      "Team Communication Guidelines",
    ],
    content: {
      sections: [
        { type: "heading", text: "Creating Your First Project" },
        {
          type: "paragraph",
          text: "Projects are the core unit of work in TaskFlow. Each project has its own board, tasks, timeline, and team members. Here is how to create one.",
        },
        { type: "heading", text: "Steps" },
        {
          type: "bullets",
          items: [
            'Navigate to the Projects page from the sidebar',
            'Click the "New Project" button in the top right',
            "Fill in the project name, description, and select a template",
            "Invite team members by email or select from your team",
            'Click "Create Project" to finish setup',
          ],
        },
        { type: "heading", text: "Project Templates" },
        {
          type: "paragraph",
          text: "TaskFlow offers several pre-built templates: Kanban Board, Sprint Planning, Bug Tracker, and Marketing Campaign. Each template comes with predefined columns and sample tasks to help you get started faster.",
        },
      ],
    },
  },
  {
    id: "communication",
    title: "Team Communication Guidelines",
    author: "Jordan Kim",
    authorInitials: "JK",
    updatedAgo: "5 days ago",
    readTime: "4 min read",
    preview:
      "We use TaskFlow for all project communication. Here are the...",
    category: "Getting Started",
    tags: ["communication", "guidelines"],
    helpful: 15,
    notHelpful: 3,
    relatedArticles: [
      "Welcome to TaskFlow",
      "How to Create Your First Project",
    ],
    content: {
      sections: [
        { type: "heading", text: "Team Communication Guidelines" },
        {
          type: "paragraph",
          text: "Effective communication is key to our success as a team. We use TaskFlow as our primary communication platform for project-related discussions. Here are the guidelines everyone should follow.",
        },
        { type: "heading", text: "Communication Channels" },
        {
          type: "bullets",
          items: [
            "Task comments: For task-specific discussions and updates",
            "Project chat: For general project-level conversations",
            "Slack #engineering: For urgent technical issues",
            "Email: For external communication and formal requests",
          ],
        },
        { type: "heading", text: "Best Practices" },
        {
          type: "bullets",
          items: [
            "Use @mentions to notify specific team members",
            "Keep task comments focused and on-topic",
            "Provide context when sharing links or screenshots",
            "Respond to mentions within 24 hours",
            "Use threads to keep conversations organized",
          ],
        },
      ],
    },
  },
  {
    id: "api-standards",
    title: "API Design Standards",
    author: "Sarah Chen",
    authorInitials: "SC",
    updatedAgo: "1 week ago",
    readTime: "10 min read",
    preview:
      "Our API follows RESTful conventions with consistent naming...",
    category: "Development",
    tags: ["api", "standards"],
    helpful: 22,
    notHelpful: 1,
    relatedArticles: [
      "Setting Up Your Development Environment",
      "Code Review Process",
    ],
    content: {
      sections: [
        { type: "heading", text: "API Design Standards" },
        {
          type: "paragraph",
          text: "Our API follows RESTful conventions with consistent naming and response structures. All endpoints should adhere to these standards.",
        },
        { type: "heading", text: "Naming Conventions" },
        {
          type: "bullets",
          items: [
            "Use lowercase kebab-case for URLs: /api/project-tasks",
            "Use camelCase for JSON properties: { projectName: ... }",
            "Use plural nouns for collection endpoints: /api/users",
            "Use HTTP verbs for actions: GET, POST, PUT, DELETE",
          ],
        },
      ],
    },
  },
  {
    id: "code-review",
    title: "Code Review Process",
    author: "Alex Rivera",
    authorInitials: "AR",
    updatedAgo: "4 days ago",
    readTime: "6 min read",
    preview:
      "Every pull request must be reviewed by at least one team member...",
    category: "Development",
    tags: ["code-review", "process"],
    helpful: 19,
    notHelpful: 2,
    relatedArticles: ["API Design Standards", "Git Workflow"],
    content: {
      sections: [
        { type: "heading", text: "Code Review Process" },
        {
          type: "paragraph",
          text: "Every pull request must be reviewed by at least one team member before merging. This document outlines our code review expectations and best practices.",
        },
      ],
    },
  },
  {
    id: "git-workflow",
    title: "Git Workflow",
    author: "Demo User",
    authorInitials: "DU",
    updatedAgo: "2 weeks ago",
    readTime: "5 min read",
    preview: "We follow a feature-branch workflow with main as the...",
    category: "Development",
    tags: ["git", "workflow"],
    helpful: 14,
    notHelpful: 0,
    relatedArticles: ["Code Review Process"],
    content: {
      sections: [
        { type: "heading", text: "Git Workflow" },
        {
          type: "paragraph",
          text: "We follow a feature-branch workflow with main as the primary branch. All work is done in feature branches and merged via pull requests.",
        },
      ],
    },
  },
  {
    id: "testing-guide",
    title: "Testing Guide",
    author: "Sarah Chen",
    authorInitials: "SC",
    updatedAgo: "6 days ago",
    readTime: "7 min read",
    preview:
      "We use Jest for unit tests and Playwright for end-to-end...",
    category: "Development",
    tags: ["testing", "jest", "playwright"],
    helpful: 16,
    notHelpful: 1,
    relatedArticles: ["Setting Up Your Development Environment"],
    content: {
      sections: [
        { type: "heading", text: "Testing Guide" },
        {
          type: "paragraph",
          text: "We use Jest for unit tests and Playwright for end-to-end tests. All new features must have accompanying tests.",
        },
      ],
    },
  },
  {
    id: "ci-cd",
    title: "CI/CD Pipeline",
    author: "Jordan Kim",
    authorInitials: "JK",
    updatedAgo: "1 week ago",
    readTime: "6 min read",
    preview:
      "Our CI/CD pipeline runs on GitHub Actions with automated...",
    category: "Development",
    tags: ["ci-cd", "deployment"],
    helpful: 11,
    notHelpful: 0,
    relatedArticles: ["Git Workflow", "Testing Guide"],
    content: {
      sections: [
        { type: "heading", text: "CI/CD Pipeline" },
        {
          type: "paragraph",
          text: "Our CI/CD pipeline runs on GitHub Actions with automated testing, linting, and deployment stages.",
        },
      ],
    },
  },
  {
    id: "perf-guidelines",
    title: "Performance Guidelines",
    author: "Alex Rivera",
    authorInitials: "AR",
    updatedAgo: "3 days ago",
    readTime: "9 min read",
    preview:
      "Follow these guidelines to maintain high performance across...",
    category: "Development",
    tags: ["performance", "optimization"],
    helpful: 8,
    notHelpful: 1,
    relatedArticles: ["API Design Standards", "Testing Guide"],
    content: {
      sections: [
        { type: "heading", text: "Performance Guidelines" },
        {
          type: "paragraph",
          text: "Follow these guidelines to maintain high performance across the application. Page load times should stay under 2 seconds.",
        },
      ],
    },
  },
  {
    id: "design-system",
    title: "Design System Overview",
    author: "Demo User",
    authorInitials: "DU",
    updatedAgo: "1 week ago",
    readTime: "5 min read",
    preview:
      "Our design system is built on Tailwind CSS with Radix UI...",
    category: "Design",
    tags: ["design", "ui"],
    helpful: 13,
    notHelpful: 0,
    relatedArticles: ["Component Library", "Accessibility Standards"],
    content: {
      sections: [
        { type: "heading", text: "Design System Overview" },
        {
          type: "paragraph",
          text: "Our design system is built on Tailwind CSS with Radix UI primitives. It provides a consistent set of components and patterns.",
        },
      ],
    },
  },
  {
    id: "component-library",
    title: "Component Library",
    author: "Sarah Chen",
    authorInitials: "SC",
    updatedAgo: "4 days ago",
    readTime: "4 min read",
    preview:
      "Browse our reusable component library and usage examples...",
    category: "Design",
    tags: ["components", "library"],
    helpful: 9,
    notHelpful: 0,
    relatedArticles: ["Design System Overview"],
    content: {
      sections: [
        { type: "heading", text: "Component Library" },
        {
          type: "paragraph",
          text: "Browse our reusable component library and usage examples. All components are accessible and follow our design guidelines.",
        },
      ],
    },
  },
  {
    id: "accessibility",
    title: "Accessibility Standards",
    author: "Jordan Kim",
    authorInitials: "JK",
    updatedAgo: "2 weeks ago",
    readTime: "6 min read",
    preview:
      "We follow WCAG 2.1 AA standards for accessibility across...",
    category: "Design",
    tags: ["accessibility", "a11y"],
    helpful: 10,
    notHelpful: 0,
    relatedArticles: ["Design System Overview", "Component Library"],
    content: {
      sections: [
        { type: "heading", text: "Accessibility Standards" },
        {
          type: "paragraph",
          text: "We follow WCAG 2.1 AA standards for accessibility across all our products. Every component and page must be keyboard navigable and screen-reader friendly.",
        },
      ],
    },
  },
  {
    id: "sprint-planning",
    title: "Sprint Planning Process",
    author: "Alex Rivera",
    authorInitials: "AR",
    updatedAgo: "3 days ago",
    readTime: "5 min read",
    preview:
      "We run two-week sprints with planning sessions every other...",
    category: "Processes",
    tags: ["sprint", "agile"],
    helpful: 17,
    notHelpful: 2,
    relatedArticles: ["Retrospective Guide"],
    content: {
      sections: [
        { type: "heading", text: "Sprint Planning Process" },
        {
          type: "paragraph",
          text: "We run two-week sprints with planning sessions every other Monday. This guide covers how to estimate, prioritize, and assign work.",
        },
      ],
    },
  },
  {
    id: "retro-guide",
    title: "Retrospective Guide",
    author: "Demo User",
    authorInitials: "DU",
    updatedAgo: "1 week ago",
    readTime: "3 min read",
    preview:
      "At the end of each sprint we hold a retrospective to review...",
    category: "Processes",
    tags: ["retrospective", "agile"],
    helpful: 12,
    notHelpful: 0,
    relatedArticles: ["Sprint Planning Process"],
    content: {
      sections: [
        { type: "heading", text: "Retrospective Guide" },
        {
          type: "paragraph",
          text: "At the end of each sprint we hold a retrospective to review what went well, what could be improved, and action items for the next sprint.",
        },
      ],
    },
  },
  {
    id: "onboarding-checklist",
    title: "New Hire Onboarding Checklist",
    author: "Jordan Kim",
    authorInitials: "JK",
    updatedAgo: "5 days ago",
    readTime: "4 min read",
    preview:
      "A complete checklist for onboarding new team members...",
    category: "Processes",
    tags: ["onboarding", "hr"],
    helpful: 20,
    notHelpful: 1,
    relatedArticles: ["Welcome to TaskFlow"],
    content: {
      sections: [
        { type: "heading", text: "New Hire Onboarding Checklist" },
        {
          type: "paragraph",
          text: "A complete checklist for onboarding new team members, from account setup to first sprint participation.",
        },
      ],
    },
  },
  {
    id: "release-process",
    title: "Release Process",
    author: "Sarah Chen",
    authorInitials: "SC",
    updatedAgo: "2 days ago",
    readTime: "7 min read",
    preview:
      "Our release process follows a bi-weekly cadence with...",
    category: "Processes",
    tags: ["release", "deployment"],
    helpful: 15,
    notHelpful: 1,
    relatedArticles: ["CI/CD Pipeline", "Git Workflow"],
    content: {
      sections: [
        { type: "heading", text: "Release Process" },
        {
          type: "paragraph",
          text: "Our release process follows a bi-weekly cadence with staging deployments on Wednesdays and production on Fridays.",
        },
      ],
    },
  },
  {
    id: "incident-response",
    title: "Incident Response Playbook",
    author: "Alex Rivera",
    authorInitials: "AR",
    updatedAgo: "1 week ago",
    readTime: "8 min read",
    preview:
      "When an incident occurs, follow this playbook to ensure...",
    category: "Processes",
    tags: ["incident", "response"],
    helpful: 13,
    notHelpful: 0,
    relatedArticles: ["Release Process"],
    content: {
      sections: [
        { type: "heading", text: "Incident Response Playbook" },
        {
          type: "paragraph",
          text: "When an incident occurs, follow this playbook to ensure quick resolution and clear communication with stakeholders.",
        },
      ],
    },
  },
  {
    id: "pto-policy",
    title: "PTO & Leave Policy",
    author: "Jordan Kim",
    authorInitials: "JK",
    updatedAgo: "2 weeks ago",
    readTime: "4 min read",
    preview:
      "Our PTO policy provides flexible time off for all team...",
    category: "Policies",
    tags: ["pto", "leave", "hr"],
    helpful: 25,
    notHelpful: 0,
    relatedArticles: ["Remote Work Policy"],
    content: {
      sections: [
        { type: "heading", text: "PTO & Leave Policy" },
        {
          type: "paragraph",
          text: "Our PTO policy provides flexible time off for all team members. Full-time employees receive 20 days of PTO per year plus company holidays.",
        },
      ],
    },
  },
  {
    id: "remote-work",
    title: "Remote Work Policy",
    author: "Demo User",
    authorInitials: "DU",
    updatedAgo: "1 week ago",
    readTime: "3 min read",
    preview:
      "We are a remote-first company. This policy outlines...",
    category: "Policies",
    tags: ["remote", "work-from-home"],
    helpful: 21,
    notHelpful: 1,
    relatedArticles: ["PTO & Leave Policy", "Team Communication Guidelines"],
    content: {
      sections: [
        { type: "heading", text: "Remote Work Policy" },
        {
          type: "paragraph",
          text: "We are a remote-first company. This policy outlines expectations for communication, availability, and collaboration when working remotely.",
        },
      ],
    },
  },
  {
    id: "security-policy",
    title: "Security Policy",
    author: "Sarah Chen",
    authorInitials: "SC",
    updatedAgo: "3 days ago",
    readTime: "6 min read",
    preview:
      "Security is everyone's responsibility. This policy covers...",
    category: "Policies",
    tags: ["security", "compliance"],
    helpful: 18,
    notHelpful: 0,
    relatedArticles: ["Incident Response Playbook"],
    content: {
      sections: [
        { type: "heading", text: "Security Policy" },
        {
          type: "paragraph",
          text: "Security is everyone's responsibility. This policy covers password requirements, data handling, and reporting security vulnerabilities.",
        },
      ],
    },
  },
];

export default function WikiPage() {
  const [selectedCategory, setSelectedCategory] = useState("Getting Started");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newArticleOpen, setNewArticleOpen] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, "up" | "down" | null>>({});

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All Articles" ||
      article.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVote = (articleId: string, vote: "up" | "down") => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [articleId]: prev[articleId] === vote ? null : vote,
    }));
  };

  const renderArticleContent = (article: Article) => {
    return article.content.sections.map((section, index) => {
      switch (section.type) {
        case "heading":
          return (
            <h2
              key={index}
              className="mt-8 mb-3 text-lg font-semibold first:mt-0"
            >
              {section.text}
            </h2>
          );
        case "paragraph":
          return (
            <p key={index} className="text-sm leading-relaxed text-muted-foreground mb-4">
              {section.text}
            </p>
          );
        case "bullets":
          return (
            <ul key={index} className="mb-4 space-y-2 pl-5">
              {section.items?.map((item, i) => (
                <li
                  key={i}
                  className="list-disc text-sm leading-relaxed text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        case "code":
          return (
            <pre
              key={index}
              className="mb-4 overflow-x-auto rounded-lg bg-neutral-950 p-4 text-sm text-neutral-200 dark:bg-neutral-900"
            >
              <code>{section.text}</code>
            </pre>
          );
        default:
          return null;
      }
    });
  };

  // Article Detail View
  if (selectedArticle) {
    const currentVote = helpfulVotes[selectedArticle.id] ?? null;
    const helpfulCount =
      selectedArticle.helpful + (currentVote === "up" ? 1 : 0);
    const notHelpfulCount =
      selectedArticle.notHelpful + (currentVote === "down" ? 1 : 0);

    const relatedArticleObjects = articles.filter((a) =>
      selectedArticle.relatedArticles.includes(a.title)
    );

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => setSelectedArticle(null)}
            className="hover:text-foreground transition-colors"
          >
            Knowledge Base
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <button
            onClick={() => {
              setSelectedArticle(null);
              setSelectedCategory(selectedArticle.category);
            }}
            className="hover:text-foreground transition-colors"
          >
            {selectedArticle.category}
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">
            {selectedArticle.title}
          </span>
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => setSelectedArticle(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Button>

        {/* Article */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <CardTitle className="text-2xl">
                  {selectedArticle.title}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">
                        {selectedArticle.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {selectedArticle.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Updated {selectedArticle.updatedAgo}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedArticle.readTime}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {selectedArticle.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose-sm max-w-none">
              {renderArticleContent(selectedArticle)}
            </div>
          </CardContent>
        </Card>

        {/* Helpful? */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-6">
              <span className="text-sm font-medium">
                Was this article helpful?
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant={currentVote === "up" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => handleVote(selectedArticle.id, "up")}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {helpfulCount}
                </Button>
                <Button
                  variant={currentVote === "down" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => handleVote(selectedArticle.id, "down")}
                >
                  <ThumbsDown className="h-4 w-4" />
                  {notHelpfulCount}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedArticleObjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relatedArticleObjects.map((related) => (
                <button
                  key={related.id}
                  onClick={() => setSelectedArticle(related)}
                  className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {related.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {related.preview}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
            <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Knowledge Base
            </h1>
            <p className="text-muted-foreground">
              Team documentation and guides.
            </p>
          </div>
        </div>
        <Dialog open={newArticleOpen} onOpenChange={setNewArticleOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Article</DialogTitle>
              <DialogDescription>
                Create a new knowledge base article for your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="article-title">Title</Label>
                <Input id="article-title" placeholder="Article title..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-category">Category</Label>
                <Select defaultValue="getting-started">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="getting-started">
                      Getting Started
                    </SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="processes">Processes</SelectItem>
                    <SelectItem value="policies">Policies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-content">Content</Label>
                <Textarea
                  id="article-content"
                  placeholder="Write your article content..."
                  rows={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-tags">Tags</Label>
                <Input
                  id="article-tags"
                  placeholder="Add tags separated by commas..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewArticleOpen(false)}>
                Save as Draft
              </Button>
              <Button onClick={() => setNewArticleOpen(false)}>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0">
          <nav className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSearchQuery("");
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  selectedCategory === category.name
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{category.name}</span>
                <span
                  className={cn(
                    "text-xs",
                    selectedCategory === category.name
                      ? "text-primary"
                      : "text-muted-foreground/60"
                  )}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Articles List */}
        <div className="flex-1 space-y-3">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No articles found
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try a different search or category.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="block w-full text-left"
              >
                <Card className="transition-colors hover:bg-muted/30">
                  <CardContent className="py-4 px-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold truncate">
                            {article.title}
                          </h3>
                          {article.pinned && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 gap-1 text-[10px] py-0"
                            >
                              <Pin className="h-2.5 w-2.5" />
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {article.preview}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {article.updatedAgo}
                          </div>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
