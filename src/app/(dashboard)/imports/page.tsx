"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  FileText,
  FileJson,
  X,
  CheckCircle2,
  Loader2,
  ArrowRight,
  UploadCloud,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const importSources = [
  {
    id: "csv",
    title: "CSV File",
    description: "Upload a CSV file",
    icon: FileText,
    available: true,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    id: "json",
    title: "JSON File",
    description: "Upload a JSON file",
    icon: FileJson,
    available: true,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    id: "jira",
    title: "From Jira",
    description: "Import from Jira",
    icon: ExternalLink,
    available: false,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40",
  },
  {
    id: "asana",
    title: "From Asana",
    description: "Import from Asana",
    icon: ExternalLink,
    available: false,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/40",
  },
];

const sampleCsvData = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Frontend Developer",
    department: "Engineering",
    status: "Active",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Product Manager",
    department: "Product",
    status: "Active",
  },
  {
    name: "Carol Williams",
    email: "carol@example.com",
    role: "UX Designer",
    department: "Design",
    status: "Active",
  },
  {
    name: "David Brown",
    email: "david@example.com",
    role: "Backend Developer",
    department: "Engineering",
    status: "Inactive",
  },
  {
    name: "Eve Davis",
    email: "eve@example.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "Active",
  },
];

const csvColumns = ["Name", "Email", "Role", "Department", "Status"];

const taskFlowFields = [
  "Full Name",
  "Email Address",
  "Role / Title",
  "Team / Department",
  "Status",
  "-- Skip --",
];

export default function ImportsPage() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [file, setFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [skipHeaders, setSkipHeaders] = useState(true);
  const [importTarget, setImportTarget] = useState("members");
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    Name: "Full Name",
    Email: "Email Address",
    Role: "Role / Title",
    Department: "Team / Department",
    Status: "Status",
  });

  // Import progress
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importDone, setImportDone] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const sizeKB = (selectedFile.size / 1024).toFixed(1);
      const sizeLabel =
        selectedFile.size > 1048576
          ? `${(selectedFile.size / 1048576).toFixed(1)} MB`
          : `${sizeKB} KB`;
      setFile({
        name: selectedFile.name,
        size: sizeLabel,
        type: selectedFile.type || "text/csv",
      });
      setShowConfig(false);
      setImportDone(false);
      setImporting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setShowConfig(false);
    setImportDone(false);
    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const useSampleData = () => {
    setFile({
      name: "sample_team_data.csv",
      size: "4.2 KB",
      type: "text/csv",
    });
    setShowConfig(true);
    setImportDone(false);
    setImporting(false);
  };

  const startImport = useCallback(() => {
    setImporting(true);
    setImportProgress(0);
    setImportDone(false);
    setImportedCount(0);
  }, []);

  useEffect(() => {
    if (!importing || importDone) return;
    if (importProgress >= 100) {
      setImportDone(true);
      setImporting(false);
      setImportedCount(156);
      return;
    }
    const timer = setTimeout(() => {
      setImportProgress((prev) => {
        const next = Math.min(prev + 2, 100);
        setImportedCount(Math.floor((next / 100) * 156));
        return next;
      });
    }, 60);
    return () => clearTimeout(timer);
  }, [importing, importProgress, importDone]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/40">
            <Upload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Import Data</h1>
            <p className="text-sm text-muted-foreground">
              Import data from files or other tools to get started quickly.
            </p>
          </div>
        </div>
      </div>

      {/* Import Source Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {importSources.map((source) => (
          <Card
            key={source.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedSource === source.id && "ring-2 ring-primary",
              !source.available && "opacity-70"
            )}
            onClick={() => {
              if (source.available) setSelectedSource(source.id);
            }}
          >
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg",
                  source.bg
                )}
              >
                <source.icon className={cn("h-6 w-6", source.color)} />
              </div>
              <div>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-medium">{source.title}</p>
                  {!source.available && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      Coming soon
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {source.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Drag & Drop Upload Zone */}
      <Card>
        <CardContent className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            className="hidden"
            onChange={handleFileSelect}
          />

          {!file ? (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Accepts .csv and .json files
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span>&middot;</span>
                    <span>{file.type}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {!showConfig && !importing && !importDone && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" onClick={useSampleData}>
                Use Sample Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Configuration */}
      {showConfig && !importing && !importDone && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Configuration</CardTitle>
            <CardDescription>
              Preview your data and configure how it maps to TaskFlow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Preview */}
            <div className="space-y-3">
              <Label>Data Preview</Label>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {csvColumns.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleCsvData.map((row, i) => (
                      <tr
                        key={i}
                        className={cn(
                          "border-b last:border-0",
                          i % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {row.email}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {row.role}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {row.department}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              row.status === "Active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            )}
                          >
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Column Mapping */}
            <div className="space-y-3">
              <Label>Column Mapping</Label>
              <p className="text-xs text-muted-foreground">
                Map your CSV columns to TaskFlow fields.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {csvColumns.map((col) => (
                  <div key={col} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      {col}
                    </Label>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      <Select
                        value={columnMapping[col]}
                        onValueChange={(val) =>
                          setColumnMapping((prev) => ({
                            ...prev,
                            [col]: val,
                          }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {taskFlowFields.map((field) => (
                            <SelectItem key={field} value={field}>
                              {field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Options Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                {/* Skip Headers Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    role="checkbox"
                    aria-checked={skipHeaders}
                    tabIndex={0}
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                      skipHeaders
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-transparent"
                    )}
                    onClick={() => setSkipHeaders(!skipHeaders)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter")
                        setSkipHeaders(!skipHeaders);
                    }}
                  >
                    {skipHeaders && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                  </div>
                  <span className="text-sm">Skip first row (headers)</span>
                </label>

                {/* Import Target */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Import as
                  </Label>
                  <div className="flex gap-2">
                    {[
                      { value: "tasks", label: "Create as Tasks" },
                      { value: "members", label: "Create as Team Members" },
                      { value: "projects", label: "Create as Projects" },
                    ].map((opt) => (
                      <Button
                        key={opt.value}
                        variant={
                          importTarget === opt.value ? "default" : "outline"
                        }
                        size="sm"
                        className="text-xs"
                        onClick={() => setImportTarget(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={startImport}>
                <Upload className="mr-2 h-4 w-4" />
                Start Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Progress */}
      {(importing || importDone) && (
        <Card>
          <CardContent className="py-6">
            {!importDone ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Importing {importedCount} of 156 records...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Please do not close this page.
                    </p>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {importProgress}%
                  </span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Import complete!</p>
                    <p className="text-xs text-muted-foreground">
                      156 records imported, 3 skipped, 0 errors.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Imported Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
