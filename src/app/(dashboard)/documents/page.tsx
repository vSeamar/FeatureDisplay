"use client";

import { useState } from "react";
import {
  FileText,
  FolderOpen,
  FolderClosed,
  Plus,
  Search,
  Save,
  Clock,
  Bold,
  Italic,
  Heading,
  List,
  ChevronRight,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn, getInitials, formatRelativeDate } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  author: string;
  lastModified: Date;
  project: string;
  projectColor: string;
  content: string;
  folder: string;
}

const folders = [
  { id: "all", name: "All Documents", icon: FolderOpen, count: 8 },
  { id: "website-redesign", name: "Website Redesign", icon: FolderClosed, count: 3 },
  { id: "mobile-app", name: "Mobile App", icon: FolderClosed, count: 2 },
  { id: "api-platform", name: "API Platform", icon: FolderClosed, count: 3 },
];

const projectColors: Record<string, string> = {
  "Website Redesign": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Mobile App": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "API Platform": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const initialDocuments: Document[] = [
  {
    id: "1",
    title: "Product Requirements",
    author: "Sarah Chen",
    lastModified: new Date(Date.now() - 1000 * 60 * 30),
    project: "Website Redesign",
    projectColor: "blue",
    content: "# Product Requirements Document\n\n## Overview\nThis document outlines the product requirements for the Website Redesign project. The goal is to modernize our web presence and improve user engagement metrics by 40%.\n\n## Goals\n- Improve page load time to under 2 seconds\n- Increase conversion rate by 25%\n- Implement responsive design for all breakpoints\n- Achieve WCAG 2.1 AA accessibility compliance\n\n## User Stories\n1. As a visitor, I want to quickly find product information so I can make purchasing decisions.\n2. As an admin, I want to update content without developer assistance.\n3. As a mobile user, I want a seamless experience across all devices.\n\n## Timeline\nPhase 1: Research & Design (4 weeks)\nPhase 2: Development (8 weeks)\nPhase 3: Testing & Launch (2 weeks)",
    folder: "website-redesign",
  },
  {
    id: "2",
    title: "API Specification",
    author: "Alex Rivera",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 3),
    project: "API Platform",
    projectColor: "emerald",
    content: "# API Specification v2.0\n\n## Base URL\nhttps://api.taskflow.dev/v2\n\n## Authentication\nAll requests require a Bearer token in the Authorization header.\n\n## Endpoints\n\n### GET /projects\nReturns a list of all projects for the authenticated user.\n\nResponse: 200 OK\n```json\n{\n  \"projects\": [...],\n  \"total\": 42\n}\n```\n\n### POST /tasks\nCreates a new task within a project.\n\nRequired fields: title, project_id\nOptional fields: description, assignee_id, priority, due_date\n\n### PUT /tasks/:id\nUpdates an existing task.\n\n### DELETE /tasks/:id\nSoft-deletes a task (moves to trash).",
    folder: "api-platform",
  },
  {
    id: "3",
    title: "Design Guidelines",
    author: "Maria Santos",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 8),
    project: "Website Redesign",
    projectColor: "blue",
    content: "# Design Guidelines\n\n## Brand Colors\n- Primary: #3B82F6 (Blue)\n- Secondary: #8B5CF6 (Purple)\n- Success: #10B981 (Green)\n- Warning: #F59E0B (Amber)\n- Error: #EF4444 (Red)\n\n## Typography\n- Headings: Inter, 600-700 weight\n- Body: Inter, 400 weight\n- Code: JetBrains Mono\n\n## Spacing\nUse 4px base unit. Common spacings: 4, 8, 12, 16, 24, 32, 48, 64px\n\n## Component Standards\n- Border radius: 8px for cards, 6px for inputs, 4px for badges\n- Shadows: Use subtle shadows for elevation\n- Transitions: 150ms ease for interactions",
    folder: "website-redesign",
  },
  {
    id: "4",
    title: "Sprint Notes",
    author: "Jake Wilson",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24),
    project: "Mobile App",
    projectColor: "purple",
    content: "# Sprint 14 Notes\n\n## Sprint Goal\nComplete push notification system and offline mode foundations.\n\n## Completed\n- Push notification registration flow\n- Notification preference settings UI\n- Local database schema for offline cache\n- Background sync service skeleton\n\n## In Progress\n- Rich notification templates\n- Offline queue manager\n- Conflict resolution strategy\n\n## Blockers\n- Waiting on backend team for notification API endpoints\n- iOS certificate renewal pending (blocks push testing)\n\n## Action Items\n- Jake: Follow up with backend team by EOD Tuesday\n- Sarah: Submit iOS certificate request\n- Alex: Document offline sync architecture",
    folder: "mobile-app",
  },
  {
    id: "5",
    title: "Meeting Minutes",
    author: "Emily Park",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 48),
    project: "Mobile App",
    projectColor: "purple",
    content: "# Meeting Minutes - March 27, 2026\n\n## Attendees\nSarah Chen, Alex Rivera, Maria Santos, Jake Wilson, Emily Park\n\n## Agenda\n1. Sprint review\n2. Release timeline discussion\n3. Resource allocation\n\n## Key Decisions\n- Release v2.0 moved to March 20 to allow more QA time\n- Hiring one additional frontend developer\n- Adopting new code review guidelines starting next sprint\n\n## Action Items\n- Sarah: Update project timeline in TaskFlow\n- Alex: Set up interview pipeline for frontend role\n- Maria: Create onboarding materials for new hire\n- Emily: Update QA test plan for v2.0 release\n\n## Next Meeting\nApril 3, 2026 at 10:00 AM",
    folder: "mobile-app",
  },
  {
    id: "6",
    title: "Architecture Overview",
    author: "Alex Rivera",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 72),
    project: "API Platform",
    projectColor: "emerald",
    content: "# Architecture Overview\n\n## System Design\nThe API Platform uses a microservices architecture with the following core services:\n\n### API Gateway\n- Rate limiting and throttling\n- Authentication and authorization\n- Request routing\n- Response caching\n\n### Core Services\n1. User Service: Authentication, profiles, preferences\n2. Project Service: CRUD operations, permissions\n3. Task Service: Task management, assignments, status\n4. Notification Service: Email, push, in-app\n5. Analytics Service: Metrics, reporting, dashboards\n\n### Data Layer\n- PostgreSQL for relational data\n- Redis for caching and sessions\n- S3 for file storage\n\n### Infrastructure\n- Kubernetes for orchestration\n- Docker containers\n- CI/CD with GitHub Actions",
    folder: "api-platform",
  },
  {
    id: "7",
    title: "Onboarding Guide",
    author: "Maria Santos",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 120),
    project: "Website Redesign",
    projectColor: "blue",
    content: "# New Developer Onboarding Guide\n\n## Welcome!\nWelcome to the TaskFlow team. This guide will help you get up and running quickly.\n\n## Setup Steps\n1. Clone the repository: `git clone https://github.com/taskflow/app`\n2. Install dependencies: `npm install`\n3. Copy `.env.example` to `.env` and configure\n4. Run database migrations: `npm run db:push`\n5. Seed the database: `npm run db:seed`\n6. Start dev server: `npm run dev`\n\n## Key Technologies\n- Next.js 14 (App Router)\n- TypeScript\n- Tailwind CSS\n- Prisma ORM\n- PostgreSQL\n\n## Code Conventions\n- Use functional components with hooks\n- Follow existing file naming patterns\n- Write tests for business logic\n- Use Conventional Commits for messages",
    folder: "website-redesign",
  },
  {
    id: "8",
    title: "Release Checklist",
    author: "David Kim",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 168),
    project: "API Platform",
    projectColor: "emerald",
    content: "# Release Checklist - v2.0\n\n## Pre-Release\n- [ ] All critical bugs resolved\n- [ ] Performance benchmarks passing\n- [ ] Security audit completed\n- [ ] API documentation updated\n- [ ] Database migrations tested on staging\n- [ ] Load testing completed (target: 10k concurrent)\n\n## Release Day\n- [ ] Create release branch\n- [ ] Run full test suite\n- [ ] Deploy to staging environment\n- [ ] Smoke test critical paths\n- [ ] Deploy to production (blue-green)\n- [ ] Monitor error rates for 30 minutes\n- [ ] Send release announcement\n\n## Post-Release\n- [ ] Monitor performance dashboards\n- [ ] Review error logs\n- [ ] Update status page\n- [ ] Schedule retrospective\n- [ ] Archive release branch",
    folder: "api-platform",
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [newDoc, setNewDoc] = useState({ title: "", project: "Website Redesign" });

  const filteredDocs = documents.filter((doc) => {
    const matchesFolder =
      selectedFolder === "all" || doc.folder === selectedFolder;
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleOpenDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setEditingTitle(doc.title);
    setEditingContent(doc.content);
    setLastSaved(doc.lastModified);
  };

  const handleSave = () => {
    if (!selectedDoc) return;
    const now = new Date();
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === selectedDoc.id
          ? { ...d, title: editingTitle, content: editingContent, lastModified: now }
          : d
      )
    );
    setLastSaved(now);
    setSelectedDoc((prev) =>
      prev
        ? { ...prev, title: editingTitle, content: editingContent, lastModified: now }
        : null
    );
  };

  const handleCreateDoc = () => {
    if (!newDoc.title) return;
    const folderMap: Record<string, string> = {
      "Website Redesign": "website-redesign",
      "Mobile App": "mobile-app",
      "API Platform": "api-platform",
    };
    const doc: Document = {
      id: Date.now().toString(),
      title: newDoc.title,
      author: "You",
      lastModified: new Date(),
      project: newDoc.project,
      projectColor:
        newDoc.project === "Website Redesign"
          ? "blue"
          : newDoc.project === "Mobile App"
            ? "purple"
            : "emerald",
      content: `# ${newDoc.title}\n\nStart writing here...`,
      folder: folderMap[newDoc.project] || "website-redesign",
    };
    setDocuments((prev) => [doc, ...prev]);
    setNewDoc({ title: "", project: "Website Redesign" });
    setDialogOpen(false);
    handleOpenDoc(doc);
  };

  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("doc-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editingContent.substring(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix || prefix}`;
    const newContent =
      editingContent.substring(0, start) +
      replacement +
      editingContent.substring(end);
    setEditingContent(newContent);
  };

  // Editor view
  if (selectedDoc) {
    return (
      <div className="space-y-4">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDoc(null)}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
            <Badge
              className={cn(
                "text-xs",
                projectColors[selectedDoc.project]
              )}
            >
              {selectedDoc.project}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Saved {formatRelativeDate(lastSaved)}
              </span>
            )}
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Editor Card */}
        <Card>
          <CardContent className="p-6">
            {/* Editable Title */}
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="w-full border-none bg-transparent text-2xl font-bold tracking-tight outline-none placeholder:text-muted-foreground"
              placeholder="Document title..."
            />

            {/* Toolbar */}
            <div className="mt-4 flex items-center gap-1 border-b pb-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertFormatting("**")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertFormatting("*")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertFormatting("## ", "")}
                title="Heading"
              >
                <Heading className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertFormatting("- ", "")}
                title="List"
              >
                <List className="h-4 w-4" />
              </Button>
              <div className="mx-2 h-5 w-px bg-border" />
              <span className="text-xs text-muted-foreground">
                Markdown supported
              </span>
            </div>

            {/* Content Editor */}
            <textarea
              id="doc-editor"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="mt-4 min-h-[500px] w-full resize-none border-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground font-mono"
              placeholder="Start writing..."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Document list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Create, organize, and collaborate on documents.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Add a new document to your workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doc-title">Title</Label>
                <Input
                  id="doc-title"
                  placeholder="Document title"
                  value={newDoc.title}
                  onChange={(e) =>
                    setNewDoc((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={newDoc.project}
                  onValueChange={(v) =>
                    setNewDoc((prev) => ({ ...prev, project: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website Redesign">
                      Website Redesign
                    </SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="API Platform">API Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDoc}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar: Folder Tree */}
        <div className="space-y-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Folders
          </p>
          {folders.map((folder) => {
            const Icon = folder.icon;
            const isActive = selectedFolder === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate text-left">{folder.name}</span>
                <span className="text-xs tabular-nums">{folder.count}</span>
              </button>
            );
          })}
        </div>

        {/* Main area: Document list */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Document Cards */}
          <div className="space-y-2">
            {filteredDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleOpenDoc(doc)}
                className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium truncate">
                      {doc.title}
                    </h3>
                    <Badge
                      className={cn(
                        "shrink-0 text-[10px]",
                        projectColors[doc.project]
                      )}
                    >
                      {doc.project}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{doc.author}</span>
                    <span>·</span>
                    <span>{formatRelativeDate(doc.lastModified)}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
            {filteredDocs.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No documents found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
