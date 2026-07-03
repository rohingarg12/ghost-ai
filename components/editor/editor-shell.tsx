"use client";

import { useState } from "react";

import { EditorHome } from "@/components/editor/editor-home";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

/**
 * Top-level editor workspace. Owns the single sidebar-open boolean shared by the
 * navbar toggle and the sidebar, and wires the project-dialog hook to the editor
 * home, the sidebar actions, and the Create/Rename/Delete dialogs.
 *
 * The canvas arrives in a later phase; for now the center region is the editor
 * home empty state, over which the sidebar floats.
 */
export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      {/* Relative content region: the sidebar floats over the editor home. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={dialogs.ownedProjects}
          sharedProjects={dialogs.sharedProjects}
          onCreateProject={dialogs.openCreate}
          onRenameProject={dialogs.openRename}
          onDeleteProject={dialogs.openDelete}
        />
        <EditorHome onCreateProject={dialogs.openCreate} />
      </div>

      <CreateProjectDialog
        open={dialogs.activeDialog === "create"}
        onOpenChange={dialogs.handleOpenChange}
        name={dialogs.name}
        onNameChange={dialogs.setName}
        slugPreview={dialogs.slugPreview}
        isSubmitting={dialogs.isSubmitting}
        onSubmit={dialogs.submitCreate}
        onCancel={dialogs.closeDialog}
      />
      <RenameProjectDialog
        open={dialogs.activeDialog === "rename"}
        onOpenChange={dialogs.handleOpenChange}
        project={dialogs.activeProject}
        name={dialogs.name}
        onNameChange={dialogs.setName}
        isSubmitting={dialogs.isSubmitting}
        onSubmit={dialogs.submitRename}
        onCancel={dialogs.closeDialog}
      />
      <DeleteProjectDialog
        open={dialogs.activeDialog === "delete"}
        onOpenChange={dialogs.handleOpenChange}
        project={dialogs.activeProject}
        isSubmitting={dialogs.isSubmitting}
        onConfirm={dialogs.submitDelete}
        onCancel={dialogs.closeDialog}
      />
    </div>
  );
}
