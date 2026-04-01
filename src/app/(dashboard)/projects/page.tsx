"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  FolderOpen,
  Users,
  CheckCircle2,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate, getInitials } from "@/lib/utils";

interface ProjectMember {
  name: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  colorClass: string;
  taskCount: number;
  progress: number;
  members: ProjectMember[];
  lastUpdated: string;
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design patterns and improved UX",
    color: "blue",
    colorClass: "bg-blue-500",
    taskCount: 24,
    progress: 67,
    members: [
      { name: "Sarah Chen", color: "bg-blue-600" },
      { name: "Alex Rivera", color: "bg-emerald-600" },
      { name: "Jake Patel", color: "bg-purple-600" },
      { name: "Maria Lopez", color: "bg-amber-600" },
    ],
    lastUpdated: "2026-03-29T14:30:00Z",
  },
  {
    id: "2",
    name: "Mobile App v2",
    description: "Second major release of the mobile application with push notifications and offline support",
    color: "purple",
    colorClass: "bg-purple-500",
    taskCount: 18,
    progress: 42,
    members: [
      { name: "Jake Patel", color: "bg-purple-600" },
      { name: "Lisa Wang", color: "bg-pink-600" },
      { name: "Tom Harris", color: "bg-cyan-600" },
    ],
    lastUpdated: "2026-03-30T09:15:00Z",
  },
  {
    id: "3",
    name: "API Platform",
    description: "Build a scalable API platform with rate limiting, authentication, and developer documentation",
    color: "green",
    colorClass: "bg-emerald-500",
    taskCount: 31,
    progress: 89,
    members: [
      { name: "Alex Rivera", color: "bg-emerald-600" },
      { name: "Sarah Chen", color: "bg-blue-600" },
      { name: "Tom Harris", color: "bg-cyan-600" },
      { name: "Nina Kowalski", color: "bg-rose-600" },
      { name: "David Kim", color: "bg-indigo-600" },
    ],
    lastUpdated: "2026-03-31T08:00:00Z",
  },
  {
    id: "4",
    name: "Marketing Campaign",
    description: "Q2 digital marketing campaign across social media, email, and content channels",
    color: "orange",
    colorClass: "bg-orange-500",
    taskCount: 12,
    progress: 25,
    members: [
      { name: "Maria Lopez", color: "bg-amber-600" },
      { name: "Lisa Wang", color: "bg-pink-600" },
    ],
    lastUpdated: "2026-03-28T16:45:00Z",
  },
  {
    id: "5",
    name: "Data Pipeline",
    description: "Real-time data pipeline for analytics and reporting using modern streaming architecture",
    color: "red",
    colorClass: "bg-red-500",
    taskCount: 15,
    progress: 53,
    members: [
      { name: "David Kim", color: "bg-indigo-600" },
      { name: "Nina Kowalski", color: "bg-rose-600" },
      { name: "Alex Rivera", color: "bg-emerald-600" },
    ],
    lastUpdated: "2026-03-27T11:20:00Z",
  },
  {
    id: "6",
    name: "Design System",
    description: "Unified component library and design tokens for consistent UI across all products",
    color: "teal",
    colorClass: "bg-teal-500",
    taskCount: 20,
    progress: 71,
    members: [
      { name: "Sarah Chen", color: "bg-blue-600" },
      { name: "Maria Lopez", color: "bg-amber-600" },
      { name: "Lisa Wang", color: "bg-pink-600" },
      { name: "Jake Patel", color: "bg-purple-600" },
    ],
    lastUpdated: "2026-03-30T13:00:00Z",
  },
];

const colorSwatches = [
  { name: "blue", class: "bg-blue-500" },
  { name: "purple", class: "bg-purple-500" },
  { name: "green", class: "bg-emerald-500" },
  { name: "orange", class: "bg-orange-500" },
  { name: "red", class: "bg-red-500" },
  { name: "teal", class: "bg-teal-500" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    color: "blue",
  });

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    const swatch = colorSwatches.find((s) => s.name === newProject.color);
    const project: Project = {
      id: String(projects.length + 1),
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      colorClass: swatch?.class || "bg-blue-500",
      taskCount: 0,
      progress: 0,
      members: [],
      lastUpdated: new Date().toISOString(),
    };
    setProjects([...projects, project]);
    setNewProject({ name: "", description: "", color: "blue" });
    setDialogOpen(false);
  };

  const completedTasks = (p: Project) =>
    Math.round((p.taskCount * p.progress) / 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your team projects
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to organize your team&apos;s work.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g. Website Redesign"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-desc">Description</Label>
                <Textarea
                  id="project-desc"
                  placeholder="What is this project about?"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {colorSwatches.map((swatch) => (
                    <button
                      key={swatch.name}
                      type="button"
                      className={cn(
                        "h-8 w-8 rounded-full transition-all",
                        swatch.class,
                        newProject.color === swatch.name
                          ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                          : "opacity-60 hover:opacity-100"
                      )}
                      onClick={() =>
                        setNewProject({ ...newProject, color: swatch.name })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProject.name.trim()}
              >
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters / Search bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className="h-7 px-2"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
            className="h-7 px-2"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-foreground/20">
                <div className={cn("h-1.5 rounded-t-xl", project.colorClass)} />
                <CardContent className="p-5 pt-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member) => (
                        <Avatar
                          key={member.name}
                          className="h-7 w-7 border-2 border-background"
                        >
                          <AvatarFallback
                            className={cn(
                              "text-[10px] text-white",
                              member.color
                            )}
                          >
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 3 && (
                        <Avatar className="h-7 w-7 border-2 border-background">
                          <AvatarFallback className="text-[10px] bg-muted">
                            +{project.members.length - 3}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>
                        {completedTasks(project)}/{project.taskCount} tasks
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Updated {formatDate(project.lastUpdated)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card>
          <div className="divide-y">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-4">Project</div>
              <div className="col-span-2">Members</div>
              <div className="col-span-2">Tasks</div>
              <div className="col-span-2">Progress</div>
              <div className="col-span-2">Updated</div>
            </div>
            {/* Rows */}
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-muted/50 transition-colors group"
              >
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                      project.colorClass
                    )}
                  >
                    <FolderOpen className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((member) => (
                      <Avatar
                        key={member.name}
                        className="h-7 w-7 border-2 border-background"
                      >
                        <AvatarFallback
                          className={cn(
                            "text-[10px] text-white",
                            member.color
                          )}
                        >
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 3 && (
                      <Avatar className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="text-[10px] bg-muted">
                          +{project.members.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {completedTasks(project)}/{project.taskCount}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={project.progress}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs font-medium w-8 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>

                <div className="col-span-2 text-sm text-muted-foreground">
                  {formatDate(project.lastUpdated)}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-medium">No projects found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try adjusting your search terms"
              : "Create your first project to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
