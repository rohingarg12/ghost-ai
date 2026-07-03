import { useCallback, useState } from "react";

import { mockProjects } from "@/lib/mock-projects";
import { slugify } from "@/lib/slug";
import type { Project } from "@/types/project";

export type ProjectDialogKind = "create" | "rename" | "delete";

export interface UseProjectDialogsResult {
  /** Owned projects — rendered under "My Projects" with rename/delete actions. */
  ownedProjects: Project[];
  /** Collaborator projects — rendered under "Shared" without actions. */
  sharedProjects: Project[];

  /** Which dialog is currently open, or `null` when none is. */
  activeDialog: ProjectDialogKind | null;
  /** The project targeted by the Rename/Delete dialogs. */
  activeProject: Project | null;
  /** Shared project-name field value (Create + Rename). */
  name: string;
  /** Live slug derived from `name` for the Create dialog preview. */
  slugPreview: string;
  /** True while a submit is in flight. Disables actions and blocks close. */
  isSubmitting: boolean;

  setName: (value: string) => void;
  openCreate: () => void;
  openRename: (project: Project) => void;
  openDelete: (project: Project) => void;
  closeDialog: () => void;
  /** Bridges Radix's `onOpenChange` (overlay click / Esc / close button) to close. */
  handleOpenChange: (open: boolean) => void;

  submitCreate: () => Promise<void>;
  submitRename: () => Promise<void>;
  submitDelete: () => Promise<void>;
}

/**
 * Dedicated hook that owns all project-dialog state: which dialog is open, the
 * shared form field, the submit/loading flag, and the in-memory mock project
 * list the sidebar renders.
 *
 * Submissions mutate the mock list in memory only — there are no API calls or
 * persistence in this chapter (`context/feature-specs/04-project-dialogs.md`).
 * The awaited seam inside `runSubmit` is where the real API call will live in a
 * later phase, which is why loading state is threaded through now.
 */
export function useProjectDialogs(): UseProjectDialogsResult {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeDialog, setActiveDialog] = useState<ProjectDialogKind | null>(
    null
  );
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ownedProjects = projects.filter((project) => project.access === "owner");
  const sharedProjects = projects.filter(
    (project) => project.access === "collaborator"
  );
  const slugPreview = slugify(name);

  const openCreate = useCallback(() => {
    setActiveProject(null);
    setName("");
    setActiveDialog("create");
  }, []);

  const openRename = useCallback((project: Project) => {
    setActiveProject(project);
    setName(project.name);
    setActiveDialog("rename");
  }, []);

  const openDelete = useCallback((project: Project) => {
    setActiveProject(project);
    setActiveDialog("delete");
  }, []);

  const closeDialog = useCallback(() => {
    // Keep `activeProject` set so the closing dialog retains its text through
    // the exit animation; it is overwritten the next time a dialog opens.
    setActiveDialog(null);
    setName("");
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      // Never let the dialog vanish while a submit is running.
      if (!open && !isSubmitting) closeDialog();
    },
    [isSubmitting, closeDialog]
  );

  const runSubmit = useCallback(async (work: () => void) => {
    setIsSubmitting(true);
    try {
      // Seam for the future API call. Mutates mock data only for now.
      await Promise.resolve();
      work();
      setActiveDialog(null);
      setName("");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitCreate = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await runSubmit(() => {
      const project: Project = {
        id: crypto.randomUUID(),
        name: trimmed,
        slug: slugify(trimmed),
        access: "owner",
      };
      setProjects((prev) => [project, ...prev]);
    });
  }, [name, runSubmit]);

  const submitRename = useCallback(async () => {
    const trimmed = name.trim();
    const target = activeProject;
    if (!trimmed || !target) return;
    await runSubmit(() => {
      // Rename updates the display name only; `slug` is a stable identifier set
      // at creation, and the Rename dialog exposes no slug field.
      setProjects((prev) =>
        prev.map((project) =>
          project.id === target.id ? { ...project, name: trimmed } : project
        )
      );
    });
  }, [name, activeProject, runSubmit]);

  const submitDelete = useCallback(async () => {
    const target = activeProject;
    if (!target) return;
    await runSubmit(() => {
      setProjects((prev) => prev.filter((project) => project.id !== target.id));
    });
  }, [activeProject, runSubmit]);

  return {
    ownedProjects,
    sharedProjects,
    activeDialog,
    activeProject,
    name,
    slugPreview,
    isSubmitting,
    setName,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    handleOpenChange,
    submitCreate,
    submitRename,
    submitDelete,
  };
}
