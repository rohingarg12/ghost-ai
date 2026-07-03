"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EditorDialogProps {
  /** Controlled open state. Omit for uncontrolled usage with `trigger`. */
  open?: boolean;
  /** Controlled open-change handler. */
  onOpenChange?: (open: boolean) => void;
  /** Optional element that opens the dialog (rendered via `DialogTrigger`). */
  trigger?: ReactNode;
  /** Dialog title. */
  title: string;
  /** Optional supporting description under the title. */
  description?: string;
  /** Optional footer actions (buttons). Rendered in the footer bar. */
  footer?: ReactNode;
  /** Dialog body content. */
  children?: ReactNode;
  /** Extra classes for the dialog content surface. */
  className?: string;
}

/**
 * Reusable dialog pattern built on the shadcn `Dialog` primitives and styled
 * with the design tokens from `globals.css` (rounded-3xl modal surface, dark
 * elevated background, subtle border).
 *
 * This is the shared shell that concrete dialogs in later chapters compose —
 * pass a `title`, optional `description`, body `children`, and `footer`
 * actions. No feature-specific dialogs are built here yet.
 */
export function EditorDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  children,
  className,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className={cn(
          "gap-5 rounded-3xl border border-surface-border bg-elevated p-6 text-copy-primary sm:max-w-md",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-copy-muted">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {children}

        {footer ? (
          <DialogFooter className="-mx-6 -mb-6 rounded-b-3xl">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
