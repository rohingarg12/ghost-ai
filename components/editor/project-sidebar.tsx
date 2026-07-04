"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { FolderClosed, Pencil, Plus, Trash2, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectSidebarProps {
  /** Whether the sidebar is visible. When false it slides off-screen. */
  isOpen: boolean;
  /** Closes the sidebar (header close button and mobile backdrop). */
  onClose: () => void;
  /** Owned projects — shown under "My Projects" with rename/delete actions. */
  ownedProjects: Project[];
  /** Collaborator projects — shown under "Shared" without actions. */
  sharedProjects: Project[];
  /** Opens the Create Project dialog. */
  onCreateProject: () => void;
  /** Opens the Rename Project dialog for an owned project. */
  onRenameProject: (project: Project) => void;
  /** Opens the Delete Project dialog for an owned project. */
  onDeleteProject: (project: Project) => void;
}

/**
 * Floating project sidebar that overlays the editor canvas.
 *
 * It is absolutely positioned inside the editor's (relatively positioned)
 * content region, so opening it overlays the canvas without pushing page
 * content. It slides in from the left based on `isOpen`. On small screens a
 * backdrop scrim behind the panel closes it when tapped; on desktop the panel
 * is a persistent floating overlay with no scrim.
 */
export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      {/* Mobile backdrop scrim — tapping outside the panel closes it. Hidden on
          desktop, where the sidebar stays open as a floating overlay. */}
      {isOpen ? (
        <div
          aria-hidden
          onClick={onClose}
          className="absolute inset-0 z-30 bg-base/70 backdrop-blur-[1px] lg:hidden"
        />
      ) : null}

      <aside
        // When closed, `inert` removes the off-screen panel from the tab order
        // and the accessibility tree, so its controls can't be reached by
        // keyboard while invisible (avoids an aria-hidden-focus violation).
        inert={!isOpen}
        className={cn(
          "absolute top-3 bottom-3 left-3 z-40 flex w-72 max-w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/90 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-in-out",
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
            {ownedProjects.length > 0 ? (
              <ProjectList>
                {ownedProjects.map((project) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    onRename={onRenameProject}
                    onDelete={onDeleteProject}
                  />
                ))}
              </ProjectList>
            ) : (
              <SidebarEmptyState
                icon={FolderClosed}
                title="No projects yet"
                description="Create a project to start designing."
              />
            )}
          </TabsContent>

          <TabsContent value="shared" className="min-h-0 flex-1">
            {sharedProjects.length > 0 ? (
              <ProjectList>
                {sharedProjects.map((project) => (
                  // No action callbacks: collaborators can't rename/delete.
                  <ProjectListItem key={project.id} project={project} />
                ))}
              </ProjectList>
            ) : (
              <SidebarEmptyState
                icon={Users}
                title="Nothing shared yet"
                description="Projects shared with you will appear here."
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="border-t border-surface-border p-3">
          <Button className="w-full" onClick={onCreateProject}>
            <Plus />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}

function ProjectList({ children }: { children: ReactNode }) {
  return (
    <ScrollArea className="h-full">
      <ul className="flex flex-col gap-1 pr-2">{children}</ul>
    </ScrollArea>
  );
}

interface ProjectListItemProps {
  project: Project;
  /** Rename handler — omitted for shared projects, which hides the actions. */
  onRename?: (project: Project) => void;
  /** Delete handler — omitted for shared projects, which hides the actions. */
  onDelete?: (project: Project) => void;
}

function ProjectListItem({ project, onRename, onDelete }: ProjectListItemProps) {
  const hasActions = Boolean(onRename && onDelete);

  return (
    <li className="group flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors hover:bg-subtle">
      <FolderClosed className="size-4 shrink-0 text-copy-faint" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-copy-secondary">{project.name}</p>
        <p className="truncate font-mono text-xs text-copy-faint">
          {project.slug}
        </p>
      </div>
      {hasActions ? (
        <div className="flex shrink-0 items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRename?.(project)}
            aria-label={`Rename ${project.name}`}
            className="text-copy-muted hover:text-copy-primary"
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete?.(project)}
            aria-label={`Delete ${project.name}`}
            className="text-copy-muted hover:text-error"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ) : null}
    </li>
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
