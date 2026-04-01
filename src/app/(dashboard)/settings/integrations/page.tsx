"use client";

import { useState } from "react";
import {
  Github,
  MessageSquare,
  Ticket,
  Figma,
  HardDrive,
  BookOpen,
  Check,
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
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  connected: boolean;
}

const initialIntegrations: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    description:
      "Link repositories, sync issues, and automate workflows with GitHub.",
    icon: Github,
    iconColor: "text-gray-900 dark:text-white",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    connected: true,
  },
  {
    id: "slack",
    name: "Slack",
    description:
      "Get real-time notifications and updates directly in your Slack channels.",
    icon: MessageSquare,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    connected: true,
  },
  {
    id: "jira",
    name: "Jira",
    description:
      "Sync tasks and projects between TaskFlow and your Jira boards.",
    icon: Ticket,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    connected: false,
  },
  {
    id: "figma",
    name: "Figma",
    description:
      "Embed design files and receive updates when designs are modified.",
    icon: Figma,
    iconColor: "text-pink-600 dark:text-pink-400",
    iconBg: "bg-pink-50 dark:bg-pink-950/40",
    connected: false,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description:
      "Attach and preview files from Google Drive directly in your tasks.",
    icon: HardDrive,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    connected: false,
  },
  {
    id: "notion",
    name: "Notion",
    description:
      "Import pages and databases from Notion to keep everything in sync.",
    icon: BookOpen,
    iconColor: "text-gray-700 dark:text-gray-300",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    connected: false,
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] =
    useState<Integration[]>(initialIntegrations);

  const toggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your favorite tools to streamline your workflow.{" "}
          {connectedCount > 0 && (
            <span className="font-medium text-foreground">
              {connectedCount} connected
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className={cn(
              "relative transition-colors",
              integration.connected && "border-emerald-200 dark:border-emerald-900/50"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-lg",
                    integration.iconBg
                  )}
                >
                  <integration.icon
                    className={cn("h-5 w-5", integration.iconColor)}
                  />
                </div>
                {integration.connected && (
                  <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Check className="h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-3 text-base">
                {integration.name}
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {integration.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {integration.connected ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleConnection(integration.id)}
                  >
                    Disconnect
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => toggleConnection(integration.id)}
                >
                  Connect
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
