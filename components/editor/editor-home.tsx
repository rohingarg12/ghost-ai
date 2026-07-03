"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorHomeProps {
  /** Opens the Create Project dialog. */
  onCreateProject: () => void;
}

/**
 * Editor home — the empty workspace shown before a project is opened. Minimal,
 * centered content (no cards) that invites the user to create or open a project.
 */
export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="mx-auto max-w-md text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
      </div>
      <Button size="lg" onClick={onCreateProject}>
        <Plus />
        New Project
      </Button>
    </div>
  );
}
