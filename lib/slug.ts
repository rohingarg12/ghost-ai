/**
 * Convert a human-entered project name into a URL-safe slug.
 *
 * Lowercases, collapses every run of non-alphanumeric characters into a single
 * hyphen, and trims leading/trailing hyphens. Pure and deterministic so the
 * live preview in the Create Project dialog always matches the value stored on
 * the project.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
