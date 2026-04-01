"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  FileText,
  BarChart3,
  Users,
  Bot,
  Settings,
  CreditCard,
  Newspaper,
  HelpCircle,
  Plus,
  FileEdit,
  Moon,
  Bell,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface CommandItem {
  id: string;
  label: string;
  icon: typeof Search;
  category: "Pages" | "Actions" | "Recent";
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      setCommandPaletteOpen(false);
    },
    [router, setCommandPaletteOpen]
  );

  const allItems: CommandItem[] = useMemo(
    () => [
      // Pages
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Pages", shortcut: "G D", action: () => navigate("/dashboard") },
      { id: "projects", label: "Projects", icon: FolderKanban, category: "Pages", shortcut: "G P", action: () => navigate("/projects") },
      { id: "tasks", label: "Tasks", icon: CheckSquare, category: "Pages", shortcut: "G T", action: () => navigate("/tasks") },
      { id: "calendar", label: "Calendar", icon: Calendar, category: "Pages", shortcut: "G C", action: () => navigate("/calendar") },
      { id: "documents", label: "Documents", icon: FileText, category: "Pages", action: () => navigate("/documents") },
      { id: "analytics", label: "Analytics", icon: BarChart3, category: "Pages", shortcut: "G A", action: () => navigate("/analytics") },
      { id: "team", label: "Team", icon: Users, category: "Pages", action: () => navigate("/team") },
      { id: "ai-assistant", label: "AI Assistant", icon: Bot, category: "Pages", action: () => navigate("/ai-assistant") },
      { id: "settings", label: "Settings", icon: Settings, category: "Pages", action: () => navigate("/settings") },
      { id: "billing", label: "Billing", icon: CreditCard, category: "Pages", action: () => navigate("/settings/billing") },
      { id: "changelog", label: "Changelog", icon: Newspaper, category: "Pages", action: () => navigate("/changelog") },
      { id: "help", label: "Help", icon: HelpCircle, category: "Pages", action: () => navigate("/help") },
      // Actions
      { id: "create-task", label: "Create Task", icon: Plus, category: "Actions", shortcut: "C", action: () => navigate("/tasks?new=1") },
      { id: "create-project", label: "Create Project", icon: Plus, category: "Actions", shortcut: "N", action: () => navigate("/projects?new=1") },
      { id: "new-document", label: "New Document", icon: FileEdit, category: "Actions", action: () => navigate("/documents?new=1") },
      {
        id: "toggle-theme",
        label: "Toggle Theme",
        icon: Moon,
        category: "Actions",
        action: () => {
          setTheme(theme === "dark" ? "light" : "dark");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "open-notifications",
        label: "Open Notifications",
        icon: Bell,
        category: "Actions",
        action: () => navigate("/notifications"),
      },
    ],
    [navigate, setCommandPaletteOpen, setTheme, theme]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const lower = query.toLowerCase();
    return allItems.filter((item) => item.label.toLowerCase().includes(lower));
  }, [allItems, query]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filteredItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filteredItems]);

  const flatFiltered = filteredItems;

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Close on route change
  useEffect(() => {
    setCommandPaletteOpen(false);
  }, [pathname, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setActiveIndex(0);
      // Small delay to let DOM render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Keyboard navigation inside the palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % flatFiltered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + flatFiltered.length) % flatFiltered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatFiltered[activeIndex]) {
          flatFiltered[activeIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    },
    [flatFiltered, activeIndex, setCommandPaletteOpen]
  );

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!commandPaletteOpen) return null;

  let itemIndex = -1;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Dialog */}
      <div className="relative mx-auto mt-[15vh] w-full max-w-xl px-4">
        <div
          className="overflow-hidden rounded-xl border bg-card shadow-2xl"
          onKeyDown={handleKeyDown}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
            {flatFiltered.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {items.map((item) => {
                    itemIndex++;
                    const currentIndex = itemIndex;
                    const isActive = currentIndex === activeIndex;
                    return (
                      <button
                        key={item.id}
                        data-index={currentIndex}
                        onClick={() => item.action()}
                        onMouseEnter={() => setActiveIndex(currentIndex)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.shortcut && (
                          <div className="flex items-center gap-1">
                            {item.shortcut.split(" ").map((key, i) => (
                              <kbd
                                key={i}
                                className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                        {isActive && (
                          <ArrowRight className="h-3 w-3 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">&uarr;</kbd>
                <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">&darr;</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">&crarr;</kbd>
                <span>select</span>
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {flatFiltered.length} result{flatFiltered.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
