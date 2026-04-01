"use client";

import { useState } from "react";
import {
  LayoutTemplate,
  Plus,
  Star,
  Eye,
  ListChecks,
  FileText,
  Copy,
  Pencil,
  Tag,
  Clock,
  CheckSquare,
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  duration: string;
  badge?: string;
  badgeColor?: string;
  starred: boolean;
  columns: string[];
  sampleTasks: { column: string; tasks: string[] }[];
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  labels: { text: string; color: string }[];
  priority?: string;
  checklist?: string[];
  descriptionTemplate?: string;
}

const initialProjectTemplates: ProjectTemplate[] = [
  {
    id: "pt-1",
    name: "Software Sprint",
    description:
      "Agile sprint template with 4 default columns, 12 starter tasks, and an estimated 2-week cycle for development teams.",
    taskCount: 12,
    duration: "2 weeks",
    badge: "Popular",
    badgeColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    starred: true,
    columns: ["Backlog", "In Progress", "In Review", "Done"],
    sampleTasks: [
      {
        column: "Backlog",
        tasks: [
          "Set up project repository",
          "Define sprint goals",
          "Write user stories",
        ],
      },
      {
        column: "In Progress",
        tasks: ["Implement authentication", "Build API endpoints"],
      },
      {
        column: "In Review",
        tasks: ["Code review: payment flow", "QA testing: dashboard"],
      },
      {
        column: "Done",
        tasks: [
          "Sprint planning meeting",
          "Set up CI/CD pipeline",
          "Design system setup",
          "Database schema design",
          "Environment configuration",
        ],
      },
    ],
  },
  {
    id: "pt-2",
    name: "Marketing Campaign",
    description:
      "3-phase campaign template covering Planning, Execution, and Analysis with 8 tasks for structured marketing workflows.",
    taskCount: 8,
    duration: "4 weeks",
    badge: "New",
    badgeColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    starred: false,
    columns: ["Planning", "Execution", "Analysis"],
    sampleTasks: [
      {
        column: "Planning",
        tasks: [
          "Define target audience",
          "Create content calendar",
          "Set campaign budget",
        ],
      },
      {
        column: "Execution",
        tasks: [
          "Launch social media ads",
          "Send email blast",
          "Publish blog posts",
        ],
      },
      {
        column: "Analysis",
        tasks: ["Analyze campaign metrics", "Create final report"],
      },
    ],
  },
  {
    id: "pt-3",
    name: "Product Launch",
    description:
      "Comprehensive launch template with 5 milestones, 20 tasks, and a full launch checklist for coordinated product releases.",
    taskCount: 20,
    duration: "6 weeks",
    starred: false,
    columns: ["Research", "Development", "Testing", "Pre-Launch", "Launch"],
    sampleTasks: [
      {
        column: "Research",
        tasks: ["Market analysis", "Competitor review", "User interviews"],
      },
      {
        column: "Development",
        tasks: ["Build MVP features", "Design landing page"],
      },
      {
        column: "Testing",
        tasks: ["Beta testing program", "Gather feedback"],
      },
      {
        column: "Pre-Launch",
        tasks: ["Press kit preparation", "Launch email sequence"],
      },
      {
        column: "Launch",
        tasks: [
          "Social media announcement",
          "Product Hunt launch",
          "Monitor metrics",
        ],
      },
    ],
  },
  {
    id: "pt-4",
    name: "Bug Triage",
    description:
      "Priority-based bug tracking template with auto-labels and SLA tracking for engineering teams.",
    taskCount: 6,
    duration: "Ongoing",
    starred: false,
    columns: ["Critical", "High", "Medium", "Low", "Resolved"],
    sampleTasks: [
      { column: "Critical", tasks: ["Production down: fix immediately"] },
      { column: "High", tasks: ["Data loss on export", "Auth timeout errors"] },
      { column: "Medium", tasks: ["UI misalignment on mobile"] },
      { column: "Low", tasks: ["Typo in settings page"] },
      { column: "Resolved", tasks: ["Memory leak in worker process"] },
    ],
  },
  {
    id: "pt-5",
    name: "Design Project",
    description:
      "End-to-end design workflow with Research, Wireframe, Design, and Review phases and 10 starter tasks.",
    taskCount: 10,
    duration: "3 weeks",
    starred: false,
    columns: ["Research", "Wireframe", "Design", "Review"],
    sampleTasks: [
      {
        column: "Research",
        tasks: ["User persona mapping", "Competitive UI analysis"],
      },
      {
        column: "Wireframe",
        tasks: ["Low-fi wireframes", "User flow diagrams"],
      },
      {
        column: "Design",
        tasks: [
          "High-fidelity mockups",
          "Design system components",
          "Responsive layouts",
        ],
      },
      {
        column: "Review",
        tasks: [
          "Design critique session",
          "Stakeholder feedback",
          "Final handoff",
        ],
      },
    ],
  },
  {
    id: "pt-6",
    name: "Client Onboarding",
    description:
      "Guided onboarding template with welcome sequence, 15 checklist items, and email templates for client success teams.",
    taskCount: 15,
    duration: "1 week",
    starred: false,
    columns: ["Welcome", "Setup", "Training", "Go Live"],
    sampleTasks: [
      {
        column: "Welcome",
        tasks: [
          "Send welcome email",
          "Schedule kickoff call",
          "Share access credentials",
        ],
      },
      {
        column: "Setup",
        tasks: [
          "Configure workspace",
          "Import client data",
          "Set up integrations",
        ],
      },
      {
        column: "Training",
        tasks: [
          "Product walkthrough",
          "Best practices session",
          "Q&A session",
        ],
      },
      {
        column: "Go Live",
        tasks: [
          "Launch checklist review",
          "Go-live confirmation",
          "Post-launch check-in",
        ],
      },
    ],
  },
];

const taskTemplates: TaskTemplate[] = [
  {
    id: "tt-1",
    name: "Bug Report",
    description:
      "Pre-filled bug report template with structured fields for reproducing and triaging issues.",
    labels: [
      {
        text: "Bug",
        color:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
    ],
    priority: "High",
    descriptionTemplate:
      "## Steps to Reproduce\n1. \n2. \n3. \n\n## Expected Behavior\n\n\n## Actual Behavior\n\n\n## Environment\n- Browser: \n- OS: \n- Version: ",
  },
  {
    id: "tt-2",
    name: "Feature Request",
    description:
      "Structured feature request with problem statement, proposed solution, and acceptance criteria.",
    labels: [
      {
        text: "Enhancement",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
    ],
    descriptionTemplate:
      "## Problem\nDescribe the problem this feature would solve.\n\n## Proposed Solution\nDescribe your ideal solution.\n\n## Acceptance Criteria\n- [ ] \n- [ ] \n- [ ] ",
  },
  {
    id: "tt-3",
    name: "Code Review",
    description:
      "Code review checklist ensuring tests, docs, security, and performance are all verified.",
    labels: [
      {
        text: "Review",
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      },
    ],
    checklist: [
      "Tests passing",
      "Docs updated",
      "No security issues",
      "Performance checked",
    ],
  },
  {
    id: "tt-4",
    name: "Sprint Retrospective",
    description:
      "Retrospective template with subtasks for what went well, areas for improvement, and action items.",
    labels: [
      {
        text: "Process",
        color:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
    ],
    checklist: ["What went well", "What could improve", "Action items"],
  },
  {
    id: "tt-5",
    name: "Design Review",
    description:
      "Design review template with attachments section, reviewer assignment, and approval checklist.",
    labels: [
      {
        text: "Design",
        color:
          "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
      },
    ],
    checklist: [
      "Attachments uploaded",
      "Reviewer assigned",
      "Accessibility checked",
      "Responsive verified",
      "Approved",
    ],
  },
  {
    id: "tt-6",
    name: "Meeting Notes",
    description:
      "Structured meeting notes with date, attendees, agenda, and action items template.",
    labels: [
      {
        text: "Meeting",
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      },
    ],
    descriptionTemplate:
      "## Date\n\n\n## Attendees\n- \n\n## Agenda\n1. \n2. \n3. \n\n## Discussion Notes\n\n\n## Action Items\n- [ ] \n- [ ] ",
  },
  {
    id: "tt-7",
    name: "Release Checklist",
    description:
      "Comprehensive 10-item deployment checklist covering testing, staging, and production release steps.",
    labels: [
      {
        text: "Release",
        color:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      },
    ],
    checklist: [
      "All tests passing",
      "Staging deployment verified",
      "Database migrations reviewed",
      "API backward compatibility confirmed",
      "Security scan completed",
      "Performance benchmarks met",
      "Release notes drafted",
      "Rollback plan documented",
      "Monitoring alerts configured",
      "Production deployment approved",
    ],
  },
  {
    id: "tt-8",
    name: "Customer Feedback",
    description:
      "Customer feedback intake template with source, priority, category, and response tracking.",
    labels: [
      {
        text: "Feedback",
        color:
          "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      },
    ],
    descriptionTemplate:
      "## Source\nWhere did this feedback come from?\n\n## Priority\n\n\n## Category\n\n\n## Feedback Details\n\n\n## Response Template\nHi [Name],\n\nThank you for your feedback. We appreciate you taking the time to share your thoughts.\n\n[Response]\n\nBest regards,\nThe TaskFlow Team",
  },
];

export default function TemplatesPage() {
  const [projectTemplates, setProjectTemplates] = useState(
    initialProjectTemplates
  );
  const [previewTemplate, setPreviewTemplate] =
    useState<ProjectTemplate | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<"project" | "task">("project");
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createColumns, setCreateColumns] = useState<string[]>([
    "Todo",
    "In Progress",
    "Done",
  ]);
  const [createPriority, setCreatePriority] = useState("");
  const [createLabels, setCreateLabels] = useState("");
  const [createDescTemplate, setCreateDescTemplate] = useState("");
  const [createChecklist, setCreateChecklist] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newColumn, setNewColumn] = useState("");

  const toggleStar = (id: string) => {
    setProjectTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t))
    );
  };

  const resetForm = () => {
    setCreateName("");
    setCreateDesc("");
    setCreateColumns(["Todo", "In Progress", "Done"]);
    setCreatePriority("");
    setCreateLabels("");
    setCreateDescTemplate("");
    setCreateChecklist([]);
    setNewChecklistItem("");
    setNewColumn("");
  };

  const addColumn = () => {
    if (newColumn.trim()) {
      setCreateColumns((prev) => [...prev, newColumn.trim()]);
      setNewColumn("");
    }
  };

  const removeColumn = (index: number) => {
    setCreateColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setCreateChecklist((prev) => [...prev, newChecklistItem.trim()]);
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index: number) => {
    setCreateChecklist((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6 text-violet-500" />
            <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          </div>
        </div>
        <Dialog
          open={createOpen}
          onOpenChange={(open) => {
            setCreateOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
              <DialogDescription>
                Build a reusable template for projects or tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              {/* Type */}
              <div className="space-y-2">
                <Label>Template Type</Label>
                <Select
                  value={createType}
                  onValueChange={(v) => setCreateType(v as "project" | "task")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Project Template</SelectItem>
                    <SelectItem value="task">Task Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="tmpl-name">Name</Label>
                <Input
                  id="tmpl-name"
                  placeholder="e.g., Sprint Planning"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="tmpl-desc">Description</Label>
                <Textarea
                  id="tmpl-desc"
                  placeholder="Describe what this template is for..."
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  rows={2}
                />
              </div>

              <Separator />

              {createType === "project" ? (
                <>
                  {/* Columns */}
                  <div className="space-y-3">
                    <Label>Columns</Label>
                    <div className="flex flex-wrap gap-2">
                      {createColumns.map((col, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="cursor-pointer gap-1 pr-1"
                          onClick={() => removeColumn(i)}
                        >
                          {col}
                          <span className="ml-1 text-muted-foreground hover:text-destructive">
                            x
                          </span>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add column name..."
                        value={newColumn}
                        onChange={(e) => setNewColumn(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addColumn();
                          }
                        }}
                      />
                      <Button variant="outline" onClick={addColumn}>
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Sample Tasks */}
                  <div className="space-y-2">
                    <Label>Sample Tasks</Label>
                    <Textarea
                      placeholder="Enter sample tasks, one per line..."
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Default Priority */}
                  <div className="space-y-2">
                    <Label>Default Priority</Label>
                    <Select
                      value={createPriority}
                      onValueChange={setCreatePriority}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Labels */}
                  <div className="space-y-2">
                    <Label htmlFor="tmpl-labels">Labels</Label>
                    <Input
                      id="tmpl-labels"
                      placeholder="Comma-separated, e.g., Bug, Frontend"
                      value={createLabels}
                      onChange={(e) => setCreateLabels(e.target.value)}
                    />
                  </div>

                  {/* Description Template */}
                  <div className="space-y-2">
                    <Label>Description Template</Label>
                    <Textarea
                      placeholder="Markdown template for the task description..."
                      value={createDescTemplate}
                      onChange={(e) => setCreateDescTemplate(e.target.value)}
                      rows={5}
                    />
                  </div>

                  {/* Checklist */}
                  <div className="space-y-3">
                    <Label>Checklist Items</Label>
                    {createChecklist.length > 0 && (
                      <div className="space-y-1">
                        {createChecklist.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
                              {item}
                            </span>
                            <button
                              onClick={() => removeChecklistItem(i)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add checklist item..."
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addChecklistItem();
                          }
                        }}
                      />
                      <Button variant="outline" onClick={addChecklistItem}>
                        Add
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setCreateOpen(false);
                  resetForm();
                }}
              >
                Save Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Project Templates</TabsTrigger>
          <TabsTrigger value="tasks">Task Templates</TabsTrigger>
        </TabsList>

        {/* Project Templates */}
        <TabsContent value="projects" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectTemplates.map((template) => (
              <Card key={template.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        {template.badge && (
                          <Badge
                            variant="secondary"
                            className={cn("text-xs", template.badgeColor)}
                          >
                            {template.badge}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs leading-relaxed">
                        {template.description}
                      </CardDescription>
                    </div>
                    <button
                      onClick={() => toggleStar(template.id)}
                      className={cn(
                        "shrink-0 p-1 transition-colors",
                        template.starred
                          ? "text-amber-500"
                          : "text-muted-foreground hover:text-amber-500"
                      )}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          template.starred && "fill-current"
                        )}
                      />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ListChecks className="h-3.5 w-3.5" />
                      {template.taskCount} tasks
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {template.duration}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.columns.map((col) => (
                      <Badge
                        key={col}
                        variant="outline"
                        className="text-[10px] font-normal"
                      >
                        {col}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="gap-2 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{template.name}</DialogTitle>
                        <DialogDescription>
                          {template.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {template.sampleTasks.map((group) => (
                            <div
                              key={group.column}
                              className="rounded-lg border bg-muted/30 p-3"
                            >
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {group.column}
                              </h4>
                              <div className="space-y-1.5">
                                {group.tasks.map((task) => (
                                  <div
                                    key={task}
                                    className="rounded-md border bg-background px-2.5 py-1.5 text-xs"
                                  >
                                    {task}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>
                          <Copy className="mr-2 h-4 w-4" />
                          Use Template
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" className="flex-1">
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Task Templates */}
        <TabsContent value="tasks" className="mt-4">
          <div className="space-y-3">
            {taskTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{template.name}</h3>
                        {template.priority && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              template.priority === "High"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            )}
                          >
                            {template.priority}
                          </Badge>
                        )}
                        {template.labels.map((label) => (
                          <Badge
                            key={label.text}
                            variant="secondary"
                            className={cn("text-xs", label.color)}
                          >
                            {label.text}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      {template.checklist && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                          {template.checklist.map((item) => (
                            <span
                              key={item}
                              className="flex items-center gap-1 text-xs text-muted-foreground"
                            >
                              <CheckSquare className="h-3 w-3" />
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      {template.descriptionTemplate && (
                        <div className="mt-2 rounded-md border bg-muted/30 p-2">
                          <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                            {template.descriptionTemplate.slice(0, 120)}...
                          </pre>
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button size="sm">
                        <Copy className="mr-1 h-3.5 w-3.5" />
                        Use
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
