"use client";

import { useState } from "react";
import {
  Settings2,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  X,
  Hash,
  Type,
  Calendar,
  CheckSquare,
  ChevronDown,
  Link,
  Mail,
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

type FieldType = "text" | "number" | "date" | "checkbox" | "dropdown" | "url" | "email";

interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  defaultValue: string;
  options?: string[];
}

const taskFields: CustomField[] = [
  { id: "tf1", name: "Sprint Number", type: "number", required: true, defaultValue: "" },
  { id: "tf2", name: "Story Points", type: "number", required: false, defaultValue: "0" },
  {
    id: "tf3",
    name: "Environment",
    type: "dropdown",
    required: false,
    defaultValue: "Development",
    options: ["Production", "Staging", "Development"],
  },
  {
    id: "tf4",
    name: "Customer Impact",
    type: "dropdown",
    required: false,
    defaultValue: "None",
    options: ["Critical", "High", "Medium", "Low", "None"],
  },
  { id: "tf5", name: "Release Version", type: "text", required: false, defaultValue: "" },
  { id: "tf6", name: "QA Approved", type: "checkbox", required: false, defaultValue: "false" },
];

const projectFields: CustomField[] = [
  { id: "pf1", name: "Client Name", type: "text", required: true, defaultValue: "" },
  { id: "pf2", name: "Budget", type: "number", required: false, defaultValue: "0" },
  {
    id: "pf3",
    name: "Department",
    type: "dropdown",
    required: false,
    defaultValue: "Engineering",
    options: ["Engineering", "Design", "Marketing", "Sales"],
  },
  { id: "pf4", name: "Kickoff Date", type: "date", required: false, defaultValue: "" },
];

const typeConfig: Record<FieldType, { label: string; icon: React.ElementType; className: string }> = {
  text: { label: "Text", icon: Type, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  number: { label: "Number", icon: Hash, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  date: { label: "Date", icon: Calendar, className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  checkbox: { label: "Checkbox", icon: CheckSquare, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  dropdown: { label: "Dropdown", icon: ChevronDown, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  url: { label: "URL", icon: Link, className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  email: { label: "Email", icon: Mail, className: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
};

function FieldRow({ field }: { field: CustomField }) {
  const config = typeConfig[field.type];
  const TypeIcon = config.icon;

  return (
    <div className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50">
      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{field.name}</span>
          {field.required && (
            <span className="text-xs font-medium text-red-500">Required</span>
          )}
        </div>
        {field.options && field.options.length > 0 && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Options: {field.options.join(", ")}
          </p>
        )}
        {field.defaultValue && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Default: {field.type === "checkbox" ? (field.defaultValue === "true" ? "Checked" : "Unchecked") : field.defaultValue}
          </p>
        )}
      </div>
      <Badge variant="secondary" className={cn("gap-1 text-xs", config.className)}>
        <TypeIcon className="h-3 w-3" />
        {config.label}
      </Badge>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default function CustomFieldsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldDefault, setFieldDefault] = useState("");
  const [fieldCheckboxDefault, setFieldCheckboxDefault] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState(["Option 1"]);
  const [showOnTaskCard, setShowOnTaskCard] = useState(true);
  const [showOnTaskDetail, setShowOnTaskDetail] = useState(true);
  const [showOnProjectDetail, setShowOnProjectDetail] = useState(false);

  const resetDialog = () => {
    setFieldName("");
    setFieldType("text");
    setFieldRequired(false);
    setFieldDefault("");
    setFieldCheckboxDefault(false);
    setDropdownOptions(["Option 1"]);
    setShowOnTaskCard(true);
    setShowOnTaskDetail(true);
    setShowOnProjectDetail(false);
  };

  const addDropdownOption = () => {
    setDropdownOptions((prev) => [...prev, ""]);
  };

  const removeDropdownOption = (index: number) => {
    setDropdownOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDropdownOption = (index: number, value: string) => {
    setDropdownOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Custom Fields</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Extend tasks and projects with custom data fields.
          </p>
        </div>
        <Dialog
          open={addDialogOpen}
          onOpenChange={(open) => {
            setAddDialogOpen(open);
            if (!open) resetDialog();
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Custom Field</DialogTitle>
              <DialogDescription>Create a new field for tasks or projects.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Field Name</Label>
                <Input
                  placeholder="e.g. Sprint Number"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Field Type</Label>
                <Select value={fieldType} onValueChange={(v) => setFieldType(v as FieldType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(typeConfig) as FieldType[]).map((type) => {
                      const cfg = typeConfig[type];
                      const Icon = cfg.icon;
                      return (
                        <SelectItem key={type} value={type}>
                          <span className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5" />
                            {cfg.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Dropdown Options */}
              {fieldType === "dropdown" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Options</Label>
                    <Button variant="ghost" size="sm" onClick={addDropdownOption}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                  {dropdownOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => updateDropdownOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                      />
                      {dropdownOptions.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeDropdownOption(i)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="field-required">Required</Label>
                <Switch id="field-required" checked={fieldRequired} onCheckedChange={setFieldRequired} />
              </div>

              {/* Default Value - contextual */}
              <div className="space-y-2">
                <Label>Default Value</Label>
                {fieldType === "checkbox" ? (
                  <div className="flex items-center gap-2">
                    <Switch checked={fieldCheckboxDefault} onCheckedChange={setFieldCheckboxDefault} />
                    <span className="text-sm text-muted-foreground">
                      {fieldCheckboxDefault ? "Checked" : "Unchecked"}
                    </span>
                  </div>
                ) : fieldType === "number" ? (
                  <Input
                    type="number"
                    placeholder="0"
                    value={fieldDefault}
                    onChange={(e) => setFieldDefault(e.target.value)}
                  />
                ) : fieldType === "date" ? (
                  <Input
                    type="date"
                    value={fieldDefault}
                    onChange={(e) => setFieldDefault(e.target.value)}
                  />
                ) : fieldType === "dropdown" ? (
                  <Select value={fieldDefault} onValueChange={setFieldDefault}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.filter(Boolean).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder={fieldType === "url" ? "https://..." : fieldType === "email" ? "user@example.com" : "Enter default value"}
                    value={fieldDefault}
                    onChange={(e) => setFieldDefault(e.target.value)}
                  />
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Show on
                </Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-task-card" className="font-normal">Task card</Label>
                  <Switch id="show-task-card" checked={showOnTaskCard} onCheckedChange={setShowOnTaskCard} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-task-detail" className="font-normal">Task detail</Label>
                  <Switch id="show-task-detail" checked={showOnTaskDetail} onCheckedChange={setShowOnTaskDetail} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-project-detail" className="font-normal">Project detail</Label>
                  <Switch id="show-project-detail" checked={showOnProjectDetail} onCheckedChange={setShowOnProjectDetail} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddDialogOpen(false)}>Save Field</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="task-fields">
        <TabsList>
          <TabsTrigger value="task-fields">
            Task Fields
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {taskFields.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="project-fields">
            Project Fields
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {projectFields.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="task-fields">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Task Custom Fields</CardTitle>
              <CardDescription>
                These fields appear on all tasks. Drag to reorder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {taskFields.map((field) => (
                  <FieldRow key={field.id} field={field} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="project-fields">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Project Custom Fields</CardTitle>
              <CardDescription>
                These fields appear on all projects. Drag to reorder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projectFields.map((field) => (
                  <FieldRow key={field.id} field={field} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
