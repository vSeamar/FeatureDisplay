"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Building2,
  Users,
  FolderKanban,
  Rocket,
  Upload,
  X,
  Mail,
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEPS = [
  { label: "Workspace", icon: Building2 },
  { label: "Team", icon: Users },
  { label: "Project", icon: FolderKanban },
  { label: "Ready", icon: Rocket },
];

const INDUSTRIES = [
  "Technology",
  "Marketing",
  "Design",
  "Finance",
  "Healthcare",
  "Education",
  "Other",
];

const TEMPLATES = [
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch",
    color: "bg-slate-100 dark:bg-slate-800",
  },
  {
    id: "software",
    name: "Software Development",
    description: "Sprints, backlog, bugs",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "marketing",
    name: "Marketing Campaign",
    description: "Content, launch, analytics",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Timeline, tasks, milestones",
    color: "bg-orange-100 dark:bg-orange-900/30",
  },
];

// Decorative confetti dots for the success step
function ConfettiDots() {
  const dots = [
    { size: "h-3 w-3", color: "bg-primary", top: "top-[10%]", left: "left-[15%]", delay: "0s" },
    { size: "h-2 w-2", color: "bg-green-400", top: "top-[20%]", left: "left-[80%]", delay: "0.2s" },
    { size: "h-4 w-4", color: "bg-yellow-400", top: "top-[15%]", left: "left-[60%]", delay: "0.4s" },
    { size: "h-2 w-2", color: "bg-pink-400", top: "top-[35%]", left: "left-[10%]", delay: "0.1s" },
    { size: "h-3 w-3", color: "bg-blue-400", top: "top-[8%]", left: "left-[40%]", delay: "0.3s" },
    { size: "h-2 w-2", color: "bg-indigo-400", top: "top-[25%]", left: "left-[90%]", delay: "0.5s" },
    { size: "h-3 w-3", color: "bg-emerald-400", top: "top-[5%]", left: "left-[25%]", delay: "0.6s" },
    { size: "h-2 w-2", color: "bg-orange-400", top: "top-[30%]", left: "left-[70%]", delay: "0.15s" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full opacity-60",
            dot.size,
            dot.color,
            dot.top,
            dot.left,
            "animate-bounce"
          )}
          style={{ animationDelay: dot.delay, animationDuration: "2s" }}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Workspace
  const [workspaceName, setWorkspaceName] = useState("");
  const [industry, setIndustry] = useState("");
  const [logoFile, setLogoFile] = useState<string | null>(null);

  // Step 2: Team
  const [emailInput, setEmailInput] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  // Step 3: Project
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");

  const addEmail = useCallback(() => {
    const trimmed = emailInput.trim();
    if (trimmed && trimmed.includes("@") && !invitedEmails.includes(trimmed)) {
      setInvitedEmails((prev) => [...prev, trimmed]);
      setEmailInput("");
    }
  }, [emailInput, invitedEmails]);

  const removeEmail = useCallback((email: string) => {
    setInvitedEmails((prev) => prev.filter((e) => e !== email));
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return workspaceName.trim().length > 0;
    if (currentStep === 2) return projectName.trim().length > 0;
    return true;
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}% complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="mb-10 flex items-center justify-center">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  i < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === currentStep
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {i < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[11px] font-medium transition-colors",
                  i <= currentStep ? "text-foreground" : "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 mb-5 h-0.5 w-12 rounded transition-colors duration-300",
                  i < currentStep ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="relative">
          {/* Step 1: Welcome / Workspace */}
          {currentStep === 0 && (
            <div className="space-y-6 p-8 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Welcome to TaskFlow</h1>
                <p className="mt-2 text-muted-foreground">
                  Let&apos;s set up your workspace in a few quick steps.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input
                    id="workspace-name"
                    placeholder="e.g. Acme Corp"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed bg-muted/50">
                      {logoFile ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : (
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setLogoFile(e.target.files[0].name);
                            }
                          }}
                        />
                        <span className="text-sm font-medium text-primary hover:underline">
                          Upload logo
                        </span>
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {logoFile || "PNG, JPG up to 2MB"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind.toLowerCase()}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Invite Team */}
          {currentStep === 1 && (
            <div className="space-y-6 p-8 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold">Invite Your Team</h1>
                <p className="mt-2 text-muted-foreground">
                  Collaboration is better together. Add your teammates.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="colleague@company.com"
                      className="pl-9"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEmail();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={addEmail} size="default">
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>

                {invitedEmails.length > 0 && (
                  <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                    {invitedEmails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between rounded-md bg-card px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {email[0].toUpperCase()}
                          </div>
                          <span className="text-sm">{email}</span>
                        </div>
                        <button
                          onClick={() => removeEmail(email)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <p className="text-center text-xs text-muted-foreground">
                      {invitedEmails.length} teammate{invitedEmails.length !== 1 ? "s" : ""} invited
                    </p>
                  </div>
                )}

                {invitedEmails.length === 0 && (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <Mail className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      No teammates added yet. Enter an email above or skip this step.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Create Project */}
          {currentStep === 2 && (
            <div className="space-y-6 p-8 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                  <FolderKanban className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h1 className="text-2xl font-bold">Create Your First Project</h1>
                <p className="mt-2 text-muted-foreground">
                  Start organizing your work right away.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="e.g. Website Redesign"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-desc">Description (optional)</Label>
                  <Textarea
                    id="project-desc"
                    placeholder="What is this project about?"
                    rows={3}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Template</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all",
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:border-muted-foreground/40 hover:bg-muted/50"
                        )}
                      >
                        <div
                          className={cn(
                            "mb-1 h-2 w-8 rounded-full",
                            template.color
                          )}
                        />
                        <span className="text-sm font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {template.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 3 && (
            <div className="relative space-y-6 p-8 animate-in slide-in-from-right-4 duration-300">
              <ConfettiDots />

              <div className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
                  <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold">You&apos;re All Set!</h1>
                <p className="mt-2 text-muted-foreground">
                  Your workspace is ready. Here&apos;s a summary of what we set up.
                </p>
              </div>

              <div className="relative space-y-3">
                {/* Summary cards */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Workspace</p>
                      <p className="text-xs text-muted-foreground">
                        {workspaceName || "My Workspace"}
                        {industry ? ` - ${industry.charAt(0).toUpperCase() + industry.slice(1)}` : ""}
                      </p>
                    </div>
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Team</p>
                      <p className="text-xs text-muted-foreground">
                        {invitedEmails.length > 0
                          ? `${invitedEmails.length} teammate${invitedEmails.length !== 1 ? "s" : ""} invited`
                          : "No teammates invited yet"}
                      </p>
                    </div>
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <FolderKanban className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Project</p>
                      <p className="text-xs text-muted-foreground">
                        {projectName || "No project"} -{" "}
                        {TEMPLATES.find((t) => t.id === selectedTemplate)?.name || "Blank"}
                      </p>
                    </div>
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="relative pt-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                  size="lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between border-t px-8 py-4">
            <div>
              {currentStep > 0 ? (
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}
            </div>
            <div className="flex items-center gap-3">
              {currentStep === 1 && (
                <Button variant="ghost" onClick={handleNext} className="text-muted-foreground">
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} disabled={!canProceed()}>
                {currentStep === 2 ? "Finish" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
