"use client";

import type { LucideIcon } from "lucide-react";
import { FolderClosed, Plus, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  /** Whether the sidebar is visible. When false it slides off-screen. */
  isOpen: boolean;
  /** Closes the sidebar (header close button). */
  onClose: () => void;
}

/**
 * Floating project sidebar that overlays the editor canvas.
 *
 * It is absolutely positioned inside the editor's (relatively positioned)
 * content region, so opening it overlays the canvas without pushing page
 * content. It slides in from the left based on `isOpen`.
 */
export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      // When closed, `inert` removes the off-screen panel from the tab order
      // and the accessibility tree, so its controls can't be reached by
      // keyboard while invisible (avoids an aria-hidden-focus violation).
      inert={!isOpen}
      className={cn(
        "absolute top-3 bottom-3 left-3 z-40 flex w-72 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/90 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+0.75rem)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="font-heading text-sm font-medium text-copy-primary">
          Projects
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close projects sidebar"
          className="text-copy-muted"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="mine"
        className="flex min-h-0 flex-1 flex-col gap-3 px-3 pt-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="mine" className="flex-1">
            My Projects
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex-1">
            Shared
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="min-h-0 flex-1">
          <SidebarEmptyState
            icon={FolderClosed}
            title="No projects yet"
            description="Create a project to start designing."
          />
        </TabsContent>

        <TabsContent value="shared" className="min-h-0 flex-1">
          <SidebarEmptyState
            icon={Users}
            title="Nothing shared yet"
            description="Projects shared with you will appear here."
          />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="border-t border-surface-border p-3">
        <Button className="w-full">
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  );
}

interface SidebarEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function SidebarEmptyState({
  icon: Icon,
  title,
  description,
}: SidebarEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <Icon className="size-8 text-copy-faint" />
      <p className="text-sm font-medium text-copy-secondary">{title}</p>
      <p className="text-xs text-copy-muted">{description}</p>
    </div>
  );
}
