"use client";

import { useState } from "react";
import {
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Download,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getInitials } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

const metrics = [
  {
    label: "Tasks Completed",
    value: "248",
    change: "+12%",
    trend: "up" as const,
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    label: "Team Velocity",
    value: "32",
    unit: "tasks/week",
    change: "+5%",
    trend: "up" as const,
    icon: Zap,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    label: "Avg Completion Time",
    value: "2.4",
    unit: "days",
    change: "-8%",
    trend: "down" as const,
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    label: "Sprint Progress",
    value: "78",
    unit: "%",
    change: null,
    trend: null,
    icon: BarChart3,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40",
  },
];

const weeklyData = [
  { week: "W1", completed: 18 },
  { week: "W2", completed: 22 },
  { week: "W3", completed: 19 },
  { week: "W4", completed: 28 },
  { week: "W5", completed: 24 },
  { week: "W6", completed: 31 },
  { week: "W7", completed: 27 },
  { week: "W8", completed: 35 },
  { week: "W9", completed: 30 },
  { week: "W10", completed: 38 },
  { week: "W11", completed: 33 },
  { week: "W12", completed: 42 },
];

const projectData = [
  { project: "Website Redesign", tasks: 64, fill: "#3b82f6" },
  { project: "Mobile App", tasks: 52, fill: "#8b5cf6" },
  { project: "API Platform", tasks: 48, fill: "#10b981" },
  { project: "Analytics", tasks: 38, fill: "#f59e0b" },
  { project: "Backend Revamp", tasks: 46, fill: "#ef4444" },
];

const statusData = [
  { name: "Done", value: 124, color: "#10b981" },
  { name: "In Progress", value: 56, color: "#3b82f6" },
  { name: "In Review", value: 34, color: "#8b5cf6" },
  { name: "To Do", value: 34, color: "#94a3b8" },
];

const teamPerformance = [
  {
    name: "Sarah Chen",
    role: "Frontend Lead",
    completed: 42,
    avgTime: 1.8,
    percentage: 92,
  },
  {
    name: "Alex Rivera",
    role: "Backend Dev",
    completed: 38,
    avgTime: 2.1,
    percentage: 85,
  },
  {
    name: "Maria Santos",
    role: "Designer",
    completed: 35,
    avgTime: 2.4,
    percentage: 78,
  },
  {
    name: "Jake Wilson",
    role: "Full Stack Dev",
    completed: 31,
    avgTime: 2.6,
    percentage: 72,
  },
  {
    name: "Emily Park",
    role: "QA Engineer",
    completed: 44,
    avgTime: 1.5,
    percentage: 95,
  },
  {
    name: "David Kim",
    role: "DevOps",
    completed: 28,
    avgTime: 3.0,
    percentage: 65,
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track team performance and project metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold">{metric.value}</p>
                    {metric.unit && (
                      <span className="text-sm text-muted-foreground">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-lg",
                    metric.bg
                  )}
                >
                  <metric.icon className={cn("h-5 w-5", metric.color)} />
                </div>
              </div>
              {metric.change ? (
                <div className="mt-3 flex items-center gap-1 text-xs">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      metric.trend === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              ) : (
                <div className="mt-3">
                  <Progress value={78} className="h-1.5" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    78% of sprint goal
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart: Task Completion Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Task Completion Trend</CardTitle>
            <p className="text-xs text-muted-foreground">
              Completed tasks per week over the last 12 weeks
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Tasks by Project */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tasks by Project</CardTitle>
            <p className="text-xs text-muted-foreground">
              Total task count per project
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="project"
                    type="category"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="tasks"
                    radius={[0, 4, 4, 0]}
                    name="Tasks"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donut Chart & Team Performance */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Donut Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Task Distribution by Status
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Current breakdown of all tasks
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={0}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance Table */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Team Performance</CardTitle>
            <p className="text-xs text-muted-foreground">
              Individual metrics for the selected period
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_80px_80px_140px] items-center gap-3 border-b pb-2 text-xs font-medium text-muted-foreground">
                <span>Member</span>
                <span className="text-right">Completed</span>
                <span className="text-right">Avg Time</span>
                <span>Efficiency</span>
              </div>

              {/* Table Rows */}
              {teamPerformance.map((member, i) => (
                <div
                  key={member.name}
                  className={cn(
                    "grid grid-cols-[1fr_80px_80px_140px] items-center gap-3 py-3",
                    i !== teamPerformance.length - 1 && "border-b"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">
                      {member.completed}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {member.avgTime}d
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={member.percentage} className="h-1.5" />
                    <span className="w-8 text-right text-xs font-medium text-muted-foreground">
                      {member.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
