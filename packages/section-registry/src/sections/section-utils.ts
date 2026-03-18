/**
 * Shared utilities for section components.
 *
 * Kept in this file (not index.ts) to avoid circular import issues.
 * Both section components and index.ts may import from here.
 */

import type { RenderMode } from "../types";

/**
 * Returns true when a content field value should be treated as empty/missing
 * and should show a placeholder outline in draft rendering mode.
 */
export function isContentFieldEmpty(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Returns a CSS class string to apply to a content field wrapper when in
 * draft mode and the field has no user-supplied value.
 *
 * @example
 *   <h1 className={`... ${draftPlaceholderClass(renderMode, config.title)}`}>
 */
export function draftPlaceholderClass(
  renderMode: RenderMode,
  value: string | undefined | null,
): string {
  if (renderMode !== "draft") return "";
  return isContentFieldEmpty(value)
    ? "outline-dashed outline-2 outline-offset-2 outline-amber-400/60 rounded"
    : "";
}

/**
 * Returns a class string that shows a subtle hover ring in draft mode.
 * Used to indicate that a section block is editable.
 */
export function draftEditableClass(renderMode: RenderMode): string {
  if (renderMode !== "draft") return "";
  return "hover:ring-2 hover:ring-offset-1 hover:ring-blue-400/40 hover:cursor-pointer transition-shadow rounded";
}
