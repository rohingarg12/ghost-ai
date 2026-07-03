/** Access level a user has to a project. Owners can rename/delete; collaborators cannot. */
export type ProjectAccess = "owner" | "collaborator";

/**
 * A project as shown in the editor sidebar.
 *
 * This is the mock/UI-facing shape for the project-dialogs chapter
 * (`context/feature-specs/04-project-dialogs.md`) — there is no persistence
 * layer yet. Real project records (Prisma) arrive in a later phase.
 */
export interface Project {
  id: string;
  name: string;
  /** URL-safe identifier derived from the name at creation time. Stable across renames. */
  slug: string;
  access: ProjectAccess;
}
