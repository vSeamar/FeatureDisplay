"use client";

import { useEffect, useState } from "react";
import { X, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shortcut {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  name: string;
  shortcuts: Shortcut[];
}

const shortcutCategories: ShortcutCategory[] = [
  {
    name: "Navigation",
    shortcuts: [
      { keys: ["G", "D"], description: "Go to Dashboard" },
      { keys: ["G", "P"], description: "Go to Projects" },
      { keys: ["G", "T"], description: "Go to Tasks" },
      { keys: ["G", "C"], description: "Go to Calendar" },
      { keys: ["G", "A"], description: "Go to Analytics" },
    ],
  },
  {
    name: "Actions",
    shortcuts: [
      { keys: ["C"], description: "Create task" },
      { keys: ["N"], description: "New project" },
      { keys: ["/"], description: "Focus search" },
    ],
  },
  {
    name: "General",
    shortcuts: [
      { keys: ["Ctrl", "K"], description: "Command palette" },
      { keys: ["?"], description: "Show shortcuts" },
      { keys: ["Esc"], description: "Close modal" },
      { keys: ["Ctrl", "B"], description: "Toggle sidebar" },
    ],
  },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground shadow-sm">
      {children}
    </kbd>
  );
}

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Animate in
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setOpen(false), 200);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center p-4 min-h-screen">
        <div
          className={cn(
            "relative w-full max-w-2xl rounded-xl border bg-card shadow-2xl transition-all duration-200",
            isVisible
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {shortcutCategories.map((category) => (
              <div key={category.name}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category.name}
                </h3>
                <div className="space-y-2.5">
                  {category.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.description}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-sm text-foreground">
                        {shortcut.description}
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span key={i} className="flex items-center gap-1">
                            {i > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                +
                              </span>
                            )}
                            <Kbd>{key}</Kbd>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-3">
            <p className="text-center text-xs text-muted-foreground">
              Press <Kbd>?</Kbd> to toggle this dialog
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
