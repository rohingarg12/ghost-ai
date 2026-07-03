# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 4 complete: Project Dialogs & Editor Home (`context/feature-specs/04-project-dialogs.md`). The `/editor` home screen, editor shell, the three project dialogs (Create/Rename/Delete), a dedicated dialog-state hook, mock project data, and owner-only sidebar project actions are all wired end to end with mock data (no API/persistence). `next build`, `tsc`, and `eslint` all pass; adversarial multi-agent review returned zero confirmed findings. Ready to start Phase 5.

## Current Goal

- Begin 05-prisma (`context/feature-specs/05-prisma.md`).

## Phase 4 Tasks (04-project-dialogs) — done

- [x] `/editor` route + editor shell that owns sidebar-open state and composes `EditorNavbar` + `ProjectSidebar` + editor home (reuses phase-02 chrome; does not change navbar/sidebar open-close behavior).
- [x] Editor home center content: heading `Create a project or open an existing one`, description, `New Project` button with `Plus` icon. Minimal, no cards. Button opens the Create dialog.
- [x] Create Project dialog: name input + live slug preview that updates as the user types.
- [x] Rename Project dialog: prefilled name input, current name in the description, input auto-focuses, Enter submits.
- [x] Delete Project dialog: destructive confirmation only, no input, destructive-styled confirm button.
- [x] Sidebar project-item actions (rename/delete) shown only for owned projects, hidden for shared/collaborator projects; wire sidebar create/rename/delete to their dialogs; footer `New Project` opens Create.
- [x] Mobile: tapping outside the sidebar closes it via a backdrop scrim.
- [x] Dedicated hook managing dialog state, form state, and loading state; mock project data only (no API/persistence).
- [x] Verify: no TypeScript errors, no lint errors, `next build` passes.

## Completed

- Next.js boilerplate cleanup (stripped `globals.css` to the Tailwind import, removed template SVGs, removed page module CSS, minimal home page).
- 01-design-system — shadcn/ui installed and configured (radix base, Nova preset, lucide icons); UI primitives added: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea in `components/ui/` (unmodified); `lucide-react` installed; `lib/utils.ts` `cn()` helper in place; dark-only theme tokens from `context/ui-context.md` wired into `globals.css` (raw palette + shadcn semantic tokens mapped onto it) with `dark` applied on `<html>`. Verified: `tsc` clean and `next build` prerenders a page rendering all 7 components without errors.
- 02-editor-chrome — three app-level chrome components added under `components/editor/` (all token-styled, `components/ui/*` untouched):
  - `editor-navbar.tsx` (`EditorNavbar`) — client component; fixed-height (`h-14`) top bar, 3-column grid (left/center/right); left holds a ghost icon-button sidebar toggle showing `PanelLeftOpen` when closed / `PanelLeftClose` when open; center + right are empty placeholders; `bg-surface` with `border-b border-surface-border`. Props: `isSidebarOpen`, `onToggleSidebar`.
  - `project-sidebar.tsx` (`ProjectSidebar`) — client component; floating overlay (`absolute` inside a `relative` content region → does not push content), slides in from the left via `translate-x` transition; `Projects` header + close button; shadcn `Tabs` (My Projects / Shared) each with a muted empty placeholder (`size-8` feature icon); full-width `New Project` button with `Plus`. Props: `isOpen`, `onClose`.
  - `editor-dialog.tsx` (`EditorDialog`) — reusable dialog pattern composing shadcn `Dialog`; supports `title`, optional `description`, `footer` actions, body `children`, `trigger`, and controlled `open`/`onOpenChange`; `rounded-3xl` elevated surface per ui-context. No concrete/feature dialogs built yet — this is the shell later chapters compose.
  - Verified: `tsc` clean, `eslint` clean, `next build` succeeds (rendered end-to-end via a temporary harness route, since removed). Reviewed by an adversarial multi-agent pass; one confirmed a11y finding fixed (see Architecture Decisions).
- 03-auth — Clerk authentication wired into the app (`context/feature-specs/03-auth.md`). `@clerk/ui` installed. All APIs verified against the installed packages (Clerk v7 / Next 16 ship breaking changes vs. defaults).
  - `app/layout.tsx` — root wrapped in `ClerkProvider`; `appearance` uses Clerk's `dark` base theme from `@clerk/ui/themes` with every color mapped onto the app's own CSS custom properties (`colorBackground: var(--bg-surface)`, `colorPrimary: var(--accent-primary)`, `colorForeground: var(--text-primary)`, state colors, etc.) — no hardcoded colors. Set once on the provider so it applies to sign-in, sign-up, and `UserButton` uniformly.
  - `proxy.ts` (project root — Next 16's renamed Middleware) — `clerkMiddleware` + `createRouteMatcher`; public routes derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (with `(.*)` so Clerk sub-paths like SSO callbacks stay public); `auth.protect()` guards everything else. Uses Clerk's canonical matcher config.
  - `components/auth/auth-shell.tsx` — shared minimal two-panel shell (brand panel `hidden lg:flex`: compact `Ghost` logo + tagline + text-only feature list; centered form panel). Small screens show the form only. No gradients/hero/feature-cards. Server component, token-styled.
  - `app/sign-in/[[...sign-in]]/page.tsx` & `app/sign-up/[[...sign-up]]/page.tsx` — Clerk `<SignIn>` / `<SignUp>` inside the shell; path-routed via the env vars.
  - `app/page.tsx` — server component; `auth()` → redirect authenticated to `/editor`, else `/sign-in`.
  - `components/editor/editor-navbar.tsx` — Clerk `<UserButton>` added to the right section (default menu/profile flows kept intact); `components/ui/*` untouched.
  - `.env.local` — added Clerk's canonical `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`.
  - Verified: `npm run build` passes, TypeScript clean, proxy detected (`ƒ Proxy (Middleware)`). Adversarial multi-agent review (API correctness · spec compliance · design tokens · bug/edge-case, each finding independently verified) returned zero confirmed findings.
- 04-project-dialogs — `/editor` home + project dialogs wired with mock data only (no API/persistence), per `context/feature-specs/04-project-dialogs.md`:
  - `app/editor/page.tsx` — thin server route rendering the client `EditorShell` (route protection handled by `proxy.ts`). This resolves the earlier `/` → `/editor` 404 (see Open Questions).
  - `components/editor/editor-shell.tsx` (`EditorShell`) — client component; owns the single `isSidebarOpen` boolean (shared by navbar toggle + sidebar) and consumes the `useProjectDialogs` hook; composes `EditorNavbar` + a `relative` content region holding `ProjectSidebar` (overlay) and `EditorHome`, plus the three dialogs. Full-viewport `h-dvh`.
  - `components/editor/editor-home.tsx` (`EditorHome`) — centered empty state: heading `Create a project or open an existing one`, description, `New Project` button with `Plus`. Minimal, no cards. Button opens the Create dialog.
  - `components/editor/project-dialogs.tsx` — `CreateProjectDialog` (name input + live slug preview), `RenameProjectDialog` (prefilled + `autoFocus` + select-on-focus, current name in description, Enter submits), `DeleteProjectDialog` (destructive confirm, no input). All compose the phase-02 `EditorDialog` shell; single-input `<form onSubmit>` gives Enter-to-submit; footer actions call the hook's submit handlers.
  - `components/editor/project-sidebar.tsx` — extended: renders owned projects (My Projects) with hover/focus rename+delete icon actions and shared projects (Shared) without actions; footer `New Project` wired to Create; mobile-only backdrop scrim (`lg:hidden`, `bg-base/70`, z-30 under the z-40 panel) that closes the sidebar on tap. Lists use `ScrollArea`. Open/close slide behavior and `inert`-when-closed unchanged from phase 02.
  - `hooks/use-project-dialogs.ts` (`useProjectDialogs`) — dedicated hook owning dialog state (`activeDialog`/`activeProject`), form state (`name` + derived `slugPreview`), loading state (`isSubmitting`), and the in-memory mock project list. Submit handlers mutate the mock list (create/rename/delete) behind an awaited seam where a real API call will later live.
  - `lib/slug.ts` (`slugify`), `lib/mock-projects.ts` (`mockProjects`), `types/project.ts` (`Project` / `ProjectAccess`).
  - Verified: `next build` passes (`/editor` prerenders `○`), `tsc` clean, `eslint` exit 0, the real `slugify` passes 10 spec/edge cases (empty, symbols-only, unicode, whitespace-collapse). Adversarial multi-agent review (spec-compliance · design-tokens · api-correctness · bug/edge-case, each finding independently verified) returned zero confirmed findings.

## In Progress

- None.

## Next Up

- 05-prisma (`context/feature-specs/05-prisma.md`)

## Open Questions

- ~~`/` redirects authenticated users to `/editor` which does not exist yet.~~ Resolved in 04-project-dialogs: `/editor` now exists as the mock home screen (`app/editor/page.tsx` → `EditorShell`). Phases 07/08 replace this mock home/workspace with the persistence-backed versions.

## Architecture Decisions

- Dark-only theme lives in `globals.css` as CSS custom properties mapped to Tailwind tokens via `@theme inline`, per `context/ui-context.md`. shadcn semantic tokens (`--background`, `--foreground`, `--primary`, etc.) are mapped onto the same dark palette, and `<html>` carries the `dark` class, so generated `components/ui/*` render dark without modification. Custom utility tokens are exposed too (`bg-base`, `bg-surface`, `text-copy-*`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-ai`, state colors).
- shadcn config: `style: radix-nova`, `baseColor: neutral`, `iconLibrary: lucide`, aliases under `@/*` (`components.json`).
- Editor chrome components are stateless/presentational and lift the sidebar open state to their (future) parent editor shell: `EditorNavbar` takes `isSidebarOpen` + `onToggleSidebar`; `ProjectSidebar` takes `isOpen` + `onClose`. The navbar and sidebar share a single boolean owned by the parent. `ProjectSidebar` is `absolute`-positioned and expects to live inside a `relative` content region that starts below the navbar, so it overlays the canvas without covering the navbar toggle or pushing layout.
- `ProjectSidebar` uses the native `inert` attribute (`inert={!isOpen}`, first-class boolean prop in React 19 / Next 16) to make the closed off-screen panel non-interactive and hidden from the accessibility tree in one step — this removes its controls from the tab order and supersedes separate `aria-hidden`/`pointer-events-none`. Chosen over `aria-hidden` alone, which left the panel's buttons/tabs keyboard-focusable while invisible (an `aria-hidden-focus` / WCAG violation surfaced by the review pass).
- Dialog styling: modals follow ui-context (`rounded-3xl`, elevated dark surface, subtle border). Since `components/ui/dialog.tsx` is a protected shadcn primitive (default `rounded-xl`), the project-specific modal shape is applied at the app level via `EditorDialog`'s `className` overrides on `DialogContent`/`DialogFooter` rather than modifying the primitive.
- Auth (03-auth) uses Clerk v7 + Next.js 16 conventions verified against the installed packages, since this project ships breaking-change versions vs. training defaults: route protection lives in `proxy.ts` at the project root (Next 16 renamed Middleware → Proxy), exported as `export default clerkMiddleware(...)`; `auth` / `auth.protect()` import from `@clerk/nextjs/server`.
- Clerk appearance override: in `@clerk/ui@1.24.1` the base-theme key is `theme` (not the older `baseTheme`). Colors are themed via `appearance.variables` referencing the app's CSS custom properties, keeping the dark-only, token-driven design system with zero hardcoded colors. Set on `ClerkProvider` so it cascades to all Clerk components.
- Public routes are defined from Clerk's canonical `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars (added to `.env.local`) — Clerk's own env var names, used rather than invented/renamed. They also drive `<SignIn>` / `<SignUp>` path routing. `proxy.ts` falls back to `/sign-in` / `/sign-up` if the vars are unset so the route matcher can never be malformed.
- `/` is a protected server component (`auth()` + `redirect`) that sends authenticated users to `/editor` and everyone else to `/sign-in`; unauthenticated requests are additionally caught earlier by `proxy.ts`. As of 04-project-dialogs the `/editor` target exists (mock home); phases 07/08 swap in the persistence-backed version.
- Editor state ownership (04): `EditorShell` is the single stateful parent — it owns `isSidebarOpen` and the `useProjectDialogs` hook, and passes presentational props down to the phase-02 chrome. All project-dialog concerns (which dialog, form field, loading, and the mock list) live in `useProjectDialogs` so the dialogs and sidebar stay presentational.
- Mock-CRUD decision (04): submit handlers mutate the mock project list **in memory** (create prepends, rename updates the display name, delete removes) so sidebar/home actions are genuinely functional in-session. This is "mock data only, no persistence" per the 04 spec — state resets on reload. `slug` is set from the name at creation via `slugify` and is intentionally left stable across renames (the Rename dialog exposes no slug field); real persistence arrives in 05/06/07.
- Dialog composition (04): concrete dialogs compose the phase-02 `EditorDialog` shell (its intended role). Enter-to-submit uses native single-input `<form onSubmit>` implicit submission; footer buttons are `type="button"` that call the same submit handler, so no cross-boundary `form` attribute wiring is needed. Rename auto-focus uses the input's `autoFocus` (first focusable inside Radix `DialogContent`) plus select-on-focus.
- Symbol-only project names (e.g. `"!!!"`) slugify to `""`; the create button gates on the trimmed name, so such a project can be created with an empty slug. Reviewed and accepted as out-of-scope for phase 04 (mock, no routing by slug, cosmetic only); slug validation is a later-phase hardening item, deliberately not invented here per `ai-workflow-rules.md`.

## Session Notes

- `components/ui/*` are shadcn-generated foundation components and must not be modified (see `context/ai-workflow-rules.md`). Project-specific styling belongs in app-level components using the design tokens.
- Font wiring: `@theme` maps `--font-sans`/`--font-mono` to the `--font-geist-sans`/`--font-geist-mono` variables set by `next/font` in `app/layout.tsx`.
- IMPORTANT — backed-up future-phase files: at the start of 04, `app/editor/page.tsx` (phase-07 `EditorHomeClient`, persistence-backed) and `app/editor/[roomId]/page.tsx` (phase-08 `EditorWorkspaceClient`, Liveblocks room) were already present in the working tree but **broken** (they import `@/lib/projects`, `@/lib/project-access`, and client components that don't exist yet) and conflicted with phase 04's mock `/editor`. With user approval they were moved to the session scratchpad backup at `…/scratchpad/backup/app/editor/{page.tsx,[roomId]/page.tsx}` and `app/editor/page.tsx` was replaced with the phase-04 mock route. When implementing phases 07/08, consult those backups as reference for the intended persistence-backed shape (they will need `lib/projects`, `lib/project-access`, `editor-home-client`, `editor-workspace-client`, `access-denied` built first).
