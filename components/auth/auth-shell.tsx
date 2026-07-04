import { Ghost } from "lucide-react";

interface AuthShellProps {
  /** The Clerk form (`<SignIn />` / `<SignUp />`) rendered in the right panel. */
  children: React.ReactNode;
}

/** Short, text-only value props shown beside the form on large screens. */
const FEATURES = [
  "AI-generated architecture from a prompt",
  "Real-time collaborative design canvas",
  "One-click Markdown technical spec",
] as const;

/**
 * Minimal two-panel shell for the auth pages.
 *
 * - Large screens: left brand panel (compact logo, tagline, text-only feature
 *   list) + right panel with the centered Clerk form.
 * - Small screens: the form only — the brand panel is hidden.
 *
 * No gradients, hero sections, or feature cards; every color is a design token.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-base">
      {/* Brand panel — large screens only */}
      <aside className="hidden w-1/2 flex-col justify-center gap-10 border-r border-surface-border px-16 lg:flex">
        <div className="flex items-center gap-2">
          <Ghost className="size-6 text-brand" />
          <span className="text-lg font-semibold text-copy-primary">
            Ghost AI
          </span>
        </div>

        <p className="max-w-sm text-sm leading-relaxed text-copy-secondary">
          A real-time collaborative workspace for system design — describe a
          system, shape it on a shared canvas, and generate its spec.
        </p>

        <ul className="flex flex-col gap-3">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-sm text-copy-secondary"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-brand" />
              {feature}
            </li>
          ))}
        </ul>
      </aside>

      {/* Form panel */}
      <main className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        {children}
      </main>
    </div>
  );
}
