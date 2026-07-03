# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 2 complete: Editor chrome (`context/feature-specs/02-editor-chrome.md`). Base chrome components that frame every editor screen (navbar, project sidebar shell, reusable dialog pattern) are in place. Ready to start Phase 3.

## Current Goal

- Begin 03-auth (`context/feature-specs/03-auth.md`).

## Completed

- Next.js boilerplate cleanup (stripped `globals.css` to the Tailwind import, removed template SVGs, removed page module CSS, minimal home page).
- 01-design-system — shadcn/ui installed and configured (radix base, Nova preset, lucide icons); UI primitives added: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea in `components/ui/` (unmodified); `lucide-react` installed; `lib/utils.ts` `cn()` helper in place; dark-only theme tokens from `context/ui-context.md` wired into `globals.css` (raw palette + shadcn semantic tokens mapped onto it) with `dark` applied on `<html>`. Verified: `tsc` clean and `next build` prerenders a page rendering all 7 components without errors.
- 02-editor-chrome — three app-level chrome components added under `components/editor/` (all token-styled, `components/ui/*` untouched):
  - `editor-navbar.tsx` (`EditorNavbar`) — client component; fixed-height (`h-14`) top bar, 3-column grid (left/center/right); left holds a ghost icon-button sidebar toggle showing `PanelLeftOpen` when closed / `PanelLeftClose` when open; center + right are empty placeholders; `bg-surface` with `border-b border-surface-border`. Props: `isSidebarOpen`, `onToggleSidebar`.
  - `project-sidebar.tsx` (`ProjectSidebar`) — client component; floating overlay (`absolute` inside a `relative` content region → does not push content), slides in from the left via `translate-x` transition; `Projects` header + close button; shadcn `Tabs` (My Projects / Shared) each with a muted empty placeholder (`size-8` feature icon); full-width `New Project` button with `Plus`. Props: `isOpen`, `onClose`.
  - `editor-dialog.tsx` (`EditorDialog`) — reusable dialog pattern composing shadcn `Dialog`; supports `title`, optional `description`, `footer` actions, body `children`, `trigger`, and controlled `open`/`onOpenChange`; `rounded-3xl` elevated surface per ui-context. No concrete/feature dialogs built yet — this is the shell later chapters compose.
  - Verified: `tsc` clean, `eslint` clean, `next build` succeeds (rendered end-to-end via a temporary harness route, since removed). Reviewed by an adversarial multi-agent pass; one confirmed a11y finding fixed (see Architecture Decisions).

## In Progress

- None.

## Next Up

- 03-auth (`context/feature-specs/03-auth.md`)

## Open Questions

- None yet.

## Architecture Decisions

- Dark-only theme lives in `globals.css` as CSS custom properties mapped to Tailwind tokens via `@theme inline`, per `context/ui-context.md`. shadcn semantic tokens (`--background`, `--foreground`, `--primary`, etc.) are mapped onto the same dark palette, and `<html>` carries the `dark` class, so generated `components/ui/*` render dark without modification. Custom utility tokens are exposed too (`bg-base`, `bg-surface`, `text-copy-*`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-ai`, state colors).
- shadcn config: `style: radix-nova`, `baseColor: neutral`, `iconLibrary: lucide`, aliases under `@/*` (`components.json`).
- Editor chrome components are stateless/presentational and lift the sidebar open state to their (future) parent editor shell: `EditorNavbar` takes `isSidebarOpen` + `onToggleSidebar`; `ProjectSidebar` takes `isOpen` + `onClose`. The navbar and sidebar share a single boolean owned by the parent. `ProjectSidebar` is `absolute`-positioned and expects to live inside a `relative` content region that starts below the navbar, so it overlays the canvas without covering the navbar toggle or pushing layout.
- `ProjectSidebar` uses the native `inert` attribute (`inert={!isOpen}`, first-class boolean prop in React 19 / Next 16) to make the closed off-screen panel non-interactive and hidden from the accessibility tree in one step — this removes its controls from the tab order and supersedes separate `aria-hidden`/`pointer-events-none`. Chosen over `aria-hidden` alone, which left the panel's buttons/tabs keyboard-focusable while invisible (an `aria-hidden-focus` / WCAG violation surfaced by the review pass).
- Dialog styling: modals follow ui-context (`rounded-3xl`, elevated dark surface, subtle border). Since `components/ui/dialog.tsx` is a protected shadcn primitive (default `rounded-xl`), the project-specific modal shape is applied at the app level via `EditorDialog`'s `className` overrides on `DialogContent`/`DialogFooter` rather than modifying the primitive.

## Session Notes

- `components/ui/*` are shadcn-generated foundation components and must not be modified (see `context/ai-workflow-rules.md`). Project-specific styling belongs in app-level components using the design tokens.
- Font wiring: `@theme` maps `--font-sans`/`--font-mono` to the `--font-geist-sans`/`--font-geist-mono` variables set by `next/font` in `app/layout.tsx`.
