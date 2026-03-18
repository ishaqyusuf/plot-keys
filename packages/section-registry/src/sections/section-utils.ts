import type { RenderMode } from "../types";

/**
 * Returns a CSS class string that applies a blue hover ring to a section
 * wrapper when in draft mode, signalling it is click-to-edit.
 */
export function draftEditableClass(renderMode: RenderMode): string {
  if (renderMode !== "draft") return "";
  return "ring-2 ring-inset ring-blue-400/40 hover:ring-blue-500/60 cursor-pointer transition-shadow";
}
