"use client";

/**
 * PreviewBanner — a slim, fixed bar at the top of the page in non-live modes.
 *
 * Shows the current render mode label and a note that interactions are disabled.
 * Transparent passthrough in "live" mode — renders nothing.
 */

import { useRenderMode } from "../runtime-context";

const modeLabels: Record<string, string> = {
  draft: "Draft preview",
  preview: "Preview mode",
  template: "Template preview",
};

export function PreviewBanner() {
  const renderMode = useRenderMode();

  if (renderMode === "live") return null;

  const label = modeLabels[renderMode] ?? "Preview";

  return (
    <div className="sticky top-0 z-[9998] flex items-center justify-center gap-2 border-b border-amber-300/40 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/80 dark:text-amber-200">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
      {label} — links, forms and actions are disabled
    </div>
  );
}
