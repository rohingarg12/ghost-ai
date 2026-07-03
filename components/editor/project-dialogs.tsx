"use client";

import type { FormEvent } from "react";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/types/project";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  slugPreview: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Create Project dialog — a name field with a live slug preview that updates as
 * the user types. Submitting via Enter or the footer button creates the
 * project (mock, in-memory).
 */
export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  slugPreview,
  isSubmitting,
  onSubmit,
  onCancel,
}: CreateProjectDialogProps) {
  const canSubmit = name.trim().length > 0 && !isSubmitting;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canSubmit) onSubmit();
  };

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create project"
      description="Name your workspace. You can change this later."
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={!canSubmit}>
            {isSubmitting ? "Creating…" : "Create project"}
          </Button>
        </>
      }
    >
      {/* Single-field form: pressing Enter submits. */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-project-name"
            className="text-xs font-medium text-copy-secondary"
          >
            Project name
          </label>
          <Input
            id="create-project-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Payments Platform"
            autoComplete="off"
            disabled={isSubmitting}
          />
        </div>
        <p className="text-xs text-copy-muted">
          Slug{" "}
          <span className="font-mono text-copy-secondary">
            {slugPreview || "your-project"}
          </span>
        </p>
      </form>
    </EditorDialog>
  );
}

interface RenameProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  name: string;
  onNameChange: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Rename Project dialog — a prefilled name field that auto-focuses and selects
 * its contents so the user can overtype immediately. The current name is shown
 * in the description, and Enter submits.
 */
export function RenameProjectDialog({
  open,
  onOpenChange,
  project,
  name,
  onNameChange,
  isSubmitting,
  onSubmit,
  onCancel,
}: RenameProjectDialogProps) {
  const currentName = project?.name ?? "";
  const canSubmit = name.trim().length > 0 && !isSubmitting;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canSubmit) onSubmit();
  };

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Rename project"
      description={currentName ? `Currently named “${currentName}”.` : undefined}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={!canSubmit}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
        <label
          htmlFor="rename-project-name"
          className="text-xs font-medium text-copy-secondary"
        >
          Project name
        </label>
        <Input
          id="rename-project-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          autoComplete="off"
          autoFocus
          onFocus={(event) => event.currentTarget.select()}
          disabled={isSubmitting}
        />
      </form>
    </EditorDialog>
  );
}

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Delete Project dialog — a destructive confirmation with no input. The confirm
 * button uses the destructive variant.
 */
export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  isSubmitting,
  onConfirm,
  onCancel,
}: DeleteProjectDialogProps) {
  const projectName = project?.name ?? "this project";

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete project"
      description={`This permanently deletes “${projectName}” and its canvas. This action cannot be undone.`}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting…" : "Delete project"}
          </Button>
        </>
      }
    />
  );
}
