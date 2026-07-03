"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  /** Whether the project sidebar is currently open. Drives the toggle icon. */
  isSidebarOpen: boolean;
  /** Toggles the project sidebar open/closed. */
  onToggleSidebar: () => void;
}

/**
 * Fixed-height top navbar that frames every editor screen.
 *
 * Three sections — left, center, right. The left section holds the sidebar
 * toggle; center and right are intentionally empty placeholders that later
 * chapters extend.
 */
export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
  return (
    <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-surface-border bg-surface px-3">
      {/* Left */}
      <div className="flex items-center gap-2 justify-self-start">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-pressed={isSidebarOpen}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="text-copy-secondary"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="size-5" />
          ) : (
            <PanelLeftOpen className="size-5" />
          )}
        </Button>
      </div>

      {/* Center — empty for now */}
      <div className="flex items-center gap-2 justify-self-center" />

      {/* Right — empty for now */}
      <div className="flex items-center gap-2 justify-self-end" />
    </header>
  );
}
