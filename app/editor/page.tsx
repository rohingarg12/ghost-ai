import { EditorShell } from "@/components/editor/editor-shell";

/**
 * `/editor` — the editor workspace home. Route protection is handled by
 * `proxy.ts`; this server component renders the interactive client shell.
 */
export default function EditorPage() {
  return <EditorShell />;
}
