# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1 complete: Design system & UI primitives (`context/feature-specs/01-design-system.md`). Ready to start Phase 2.

## Current Goal

- Begin 02-editor-chrome (`context/feature-specs/02-editor-chrome.md`).

## Completed

- Next.js boilerplate cleanup (stripped `globals.css` to the Tailwind import, removed template SVGs, removed page module CSS, minimal home page).
- 01-design-system — shadcn/ui installed and configured (radix base, Nova preset, lucide icons); UI primitives added: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea in `components/ui/` (unmodified); `lucide-react` installed; `lib/utils.ts` `cn()` helper in place; dark-only theme tokens from `context/ui-context.md` wired into `globals.css` (raw palette + shadcn semantic tokens mapped onto it) with `dark` applied on `<html>`. Verified: `tsc` clean and `next build` prerenders a page rendering all 7 components without errors.

## In Progress

- None.

## Next Up

- 02-editor-chrome (`context/feature-specs/02-editor-chrome.md`)

## Open Questions

- None yet.

## Architecture Decisions

- Dark-only theme lives in `globals.css` as CSS custom properties mapped to Tailwind tokens via `@theme inline`, per `context/ui-context.md`. shadcn semantic tokens (`--background`, `--foreground`, `--primary`, etc.) are mapped onto the same dark palette, and `<html>` carries the `dark` class, so generated `components/ui/*` render dark without modification. Custom utility tokens are exposed too (`bg-base`, `bg-surface`, `text-copy-*`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-ai`, state colors).
- shadcn config: `style: radix-nova`, `baseColor: neutral`, `iconLibrary: lucide`, aliases under `@/*` (`components.json`).

## Session Notes

- `components/ui/*` are shadcn-generated foundation components and must not be modified (see `context/ai-workflow-rules.md`). Project-specific styling belongs in app-level components using the design tokens.
- Font wiring: `@theme` maps `--font-sans`/`--font-mono` to the `--font-geist-sans`/`--font-geist-mono` variables set by `next/font` in `app/layout.tsx`.
