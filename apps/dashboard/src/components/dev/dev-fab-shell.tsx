"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevFabShell must not be imported in production.");
}

/**
 * Base floating action button shell for dev tools.
 *
 * Renders a fixed dev tools button at the bottom-right of the viewport.
 * Click toggles an upward popover panel. Children are rendered inside.
 *
 * Usage:
 *   <DevFabShell label="Accounts">
 *     <div>...menu items...</div>
 *   </DevFabShell>
 */

import { Button } from "@plotkeys/ui/button";
import { cn } from "@plotkeys/ui/cn";
import { Icon } from "@plotkeys/ui/icons";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  /** Items rendered inside the dropdown panel. */
  children: ReactNode;
  /** Short label shown next to the tool icon. */
  label: string;
  /** Optional extra classes on the fixed-position wrapper. */
  containerClassName?: string;
  /** Whether the dropdown panel should start open. */
  defaultOpen?: boolean;
  /** Optional extra classes on the trigger button. */
  triggerClassName?: string;
};

export function DevFabShell({
  children,
  containerClassName = "",
  defaultOpen = false,
  label,
  triggerClassName = "",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div
      ref={ref}
      className={cn(
        "fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2",
        containerClassName,
      )}
    >
      {/* Dropdown panel */}
      {open && (
        <div className="mb-1 w-72 overflow-hidden border border-border bg-background">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Dev - {label}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              aria-label="Close dev panel"
              onClick={() => setOpen(false)}
              type="button"
            >
              <Icon.Close className="size-3.5" />
            </Button>
          </div>

          {/* Panel body */}
          <div className="max-h-80 overflow-y-auto">{children}</div>
        </div>
      )}

      {/* FAB trigger */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "gap-1.5 bg-background active:scale-95",
          triggerClassName,
        )}
        aria-label={`Dev tools — ${label}`}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <Icon.Wrench className="size-3.5" />
        {label}
      </Button>
    </div>
  );
}
