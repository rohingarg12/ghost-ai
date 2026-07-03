import type { Project } from "@/types/project";

/**
 * Seed project data for the editor sidebar. In-memory only — there is no API or
 * persistence in this chapter (see `context/feature-specs/04-project-dialogs.md`).
 *
 * `owner` projects appear under "My Projects" with rename/delete actions;
 * `collaborator` projects appear under "Shared" without actions.
 */
export const mockProjects: Project[] = [
  {
    id: "prj_payments",
    name: "Payments Platform",
    slug: "payments-platform",
    access: "owner",
  },
  {
    id: "prj_notifications",
    name: "Notification Pipeline",
    slug: "notification-pipeline",
    access: "owner",
  },
  {
    id: "prj_analytics",
    name: "Realtime Analytics",
    slug: "realtime-analytics",
    access: "owner",
  },
  {
    id: "prj_search",
    name: "Search Infrastructure",
    slug: "search-infrastructure",
    access: "collaborator",
  },
  {
    id: "prj_billing",
    name: "Billing Service",
    slug: "billing-service",
    access: "collaborator",
  },
];
