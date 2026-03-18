/**
 * Shared primitive types extracted to break circular import chains.
 *
 * Import from here rather than from index.ts when a type is needed inside
 * a module that index.ts also imports from.
 */

export type RenderMode = "live" | "draft" | "preview";
