"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevFabShell must not be imported in production.");
}

/**
 * Base floating action button shell for dev tools.
 *
 * Renders a fixed ⚡ button at the bottom-right of the viewport.
 * Click toggles an upward popover panel. Children are rendered inside.
 *
 * Usage:
 *   <DevFabShell label="Accounts">
 *     <div>...menu items...</div>
 *   </DevFabShell>
 */

import { type ReactNode, useEffect, useRef, useState } from "react";

type DevFabShellProps = {
  /** Items rendered inside the dropdown panel. */
  children: ReactNode;
  /** Short label shown next to the ⚡ icon. */
  label: string;
  /** Optional extra classes on the fixed-position wrapper. */
  containerClassName?: string;
  /** Optional extra classes on the trigger button. */
  triggerClassName?: string;
};

export function DevFabShell({
  children,
  containerClassName = "",
  label,
  triggerClassName = "",
}: DevFabShellProps) {
  const [open, setOpen] = useState(false);
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
      className={[
        "fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2",
        containerClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Dropdown panel */}
      {open && (
        <div className="mb-1 w-72 overflow-hidden rounded-xl border border-amber-500/35 bg-card/95 shadow-2xl backdrop-blur">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-amber-500/25 bg-amber-500/10 px-3 py-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
              ⚡ DEV — {label}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-0.5 text-amber-600 transition-colors hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 dark:text-amber-300"
              aria-label="Close dev panel"
            >
              ✕
            </button>
          </div>

          {/* Panel body */}
          <div className="max-h-80 overflow-y-auto">{children}</div>
        </div>
      )}

      {/* FAB trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-amber-400 px-3 py-2 font-mono text-xs font-bold text-amber-950 shadow-lg transition-all hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 active:scale-95 dark:border-amber-400 dark:bg-amber-400",
          triggerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={`Dev tools — ${label}`}
      >
        ⚡ {label}
      </button>
    </div>
  );
}
