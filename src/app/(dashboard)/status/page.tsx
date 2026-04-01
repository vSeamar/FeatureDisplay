"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
  Server,
  Database,
  Shield,
  HardDrive,
  Mail,
  Radio,
  Cloud,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ServiceStatus = "operational" | "degraded" | "down";

const statusConfig: Record<
  ServiceStatus,
  { label: string; color: string; dotColor: string; icon: typeof CheckCircle2 }
> = {
  operational: {
    label: "Operational",
    color: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
    icon: CheckCircle2,
  },
  degraded: {
    label: "Degraded Performance",
    color: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
    icon: AlertTriangle,
  },
  down: {
    label: "Down",
    color: "text-red-600 dark:text-red-400",
    dotColor: "bg-red-500",
    icon: XCircle,
  },
};

const services = [
  {
    name: "Web Application",
    status: "operational" as ServiceStatus,
    uptime: "99.99%",
    icon: Globe,
  },
  {
    name: "API",
    status: "operational" as ServiceStatus,
    uptime: "99.98%",
    icon: Server,
  },
  {
    name: "Database",
    status: "operational" as ServiceStatus,
    uptime: "99.99%",
    icon: Database,
  },
  {
    name: "Authentication",
    status: "operational" as ServiceStatus,
    uptime: "99.95%",
    icon: Shield,
  },
  {
    name: "File Storage",
    status: "degraded" as ServiceStatus,
    uptime: "98.50%",
    icon: HardDrive,
  },
  {
    name: "Email Service",
    status: "operational" as ServiceStatus,
    uptime: "99.97%",
    icon: Mail,
  },
  {
    name: "WebSocket (Real-time)",
    status: "operational" as ServiceStatus,
    uptime: "99.90%",
    icon: Radio,
  },
  {
    name: "CDN",
    status: "operational" as ServiceStatus,
    uptime: "99.99%",
    icon: Cloud,
  },
];

// Generate 30 days of uptime data — day 10 (about 20 days ago) is degraded
const uptimeData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  status: i === 9 ? ("degraded" as const) : ("operational" as const),
  uptime: i === 9 ? 97.5 : 99.5 + Math.random() * 0.5,
}));

type IncidentStatus = "monitoring" | "resolved" | "completed";

const incidentStatusStyles: Record<IncidentStatus, string> = {
  monitoring:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  resolved:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  completed:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
};

const incidents = [
  {
    date: "March 25, 2026",
    title: "File Storage Degraded",
    status: "monitoring" as IncidentStatus,
    description:
      "Increased latency on file uploads. Team is investigating the root cause and working with our cloud provider to resolve the issue.",
    updates: [
      {
        time: "2:30 PM",
        text: "Monitoring — Latency has improved but remains above normal levels.",
      },
      {
        time: "1:00 PM",
        text: "Identified — Root cause identified as increased load on storage nodes.",
      },
      {
        time: "12:15 PM",
        text: "Investigating — Reports of slow file uploads received.",
      },
    ],
  },
  {
    date: "March 10, 2026",
    title: "API Intermittent Errors",
    status: "resolved" as IncidentStatus,
    description:
      "Brief 502 errors resolved by scaling up API instances. Total downtime was approximately 8 minutes.",
    updates: [
      {
        time: "4:45 PM",
        text: "Resolved — All API endpoints operating normally.",
      },
      {
        time: "4:20 PM",
        text: "Fix deployed — Scaled up API instances to handle traffic.",
      },
      {
        time: "4:05 PM",
        text: "Investigating — Intermittent 502 errors on API endpoints.",
      },
    ],
  },
  {
    date: "February 28, 2026",
    title: "Scheduled Maintenance",
    status: "completed" as IncidentStatus,
    description:
      "Database migration completed successfully. No data loss. All services resumed normal operation.",
    updates: [
      {
        time: "6:00 AM",
        text: "Completed — All services back online after successful migration.",
      },
      {
        time: "3:00 AM",
        text: "In progress — Database migration underway. Services are read-only.",
      },
      {
        time: "2:00 AM",
        text: "Started — Maintenance window has begun.",
      },
    ],
  },
];

export default function StatusPage() {
  const [expandedIncident, setExpandedIncident] = useState<number | null>(0);

  const operationalCount = services.filter(
    (s) => s.status === "operational"
  ).length;
  const allOperational = operationalCount === services.length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-muted-foreground mt-1">
          Real-time status and uptime monitoring for all TaskFlow services
        </p>
      </div>

      {/* Overall Status Banner */}
      <Card
        className={cn(
          "border-2",
          allOperational
            ? "border-emerald-200 dark:border-emerald-800"
            : "border-amber-200 dark:border-amber-800"
        )}
      >
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                allOperational
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : "bg-amber-100 dark:bg-amber-900/30"
              )}
            >
              {allOperational ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {allOperational
                  ? "All Systems Operational"
                  : "Some Systems Experiencing Issues"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {operationalCount} of {services.length} services operational
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last checked 2 minutes ago</span>
          </div>
        </CardContent>
      </Card>

      {/* Service Status Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const config = statusConfig[service.status];
            return (
              <Card key={service.name} className="transition-colors hover:bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <service.icon className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          config.dotColor,
                          service.status !== "operational" && "animate-pulse"
                        )}
                      />
                      <span
                        className={cn("text-xs font-medium", config.color)}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm">{service.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uptime: {service.uptime}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Uptime Chart */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Uptime</CardTitle>
          <CardDescription>
            Daily system availability over the past month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-[3px] h-24">
            {uptimeData.map((day) => (
              <div
                key={day.day}
                className="group relative flex-1"
              >
                <div
                  className={cn(
                    "w-full rounded-sm transition-opacity hover:opacity-80 cursor-default",
                    day.status === "operational"
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-amber-500 dark:bg-amber-400"
                  )}
                  style={{
                    height: `${((day.uptime - 95) / 5) * 100}%`,
                    minHeight: "20%",
                  }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="rounded-md bg-popover border shadow-md px-2.5 py-1.5 text-xs whitespace-nowrap">
                    <div className="font-medium">Day {day.day}</div>
                    <div className="text-muted-foreground">
                      {day.uptime.toFixed(2)}% uptime
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>30 days ago</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400" />
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-amber-500 dark:bg-amber-400" />
                <span>Degraded</span>
              </div>
            </div>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <Card key={index}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-xl"
                onClick={() =>
                  setExpandedIncident(
                    expandedIncident === index ? null : index
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      incident.status === "monitoring"
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : incident.status === "resolved"
                          ? "bg-emerald-100 dark:bg-emerald-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                    )}
                  >
                    {incident.status === "monitoring" ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4",
                          incident.status === "resolved"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-blue-600 dark:text-blue-400"
                        )}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{incident.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {incident.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={incidentStatusStyles[incident.status]}
                  >
                    {incident.status.charAt(0).toUpperCase() +
                      incident.status.slice(1)}
                  </Badge>
                  {expandedIncident === index ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              {expandedIncident === index && (
                <CardContent className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {incident.description}
                  </p>
                  <div className="space-y-3">
                    {incident.updates.map((update, updateIndex) => (
                      <div
                        key={updateIndex}
                        className="flex gap-3 text-sm"
                      >
                        <span className="shrink-0 font-mono text-muted-foreground w-16">
                          {update.time}
                        </span>
                        <span>{update.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
