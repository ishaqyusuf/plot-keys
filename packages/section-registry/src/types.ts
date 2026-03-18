/**
 * Shared primitive types used across section-registry.
 *
 * These are kept in a separate file to avoid circular imports between
 * index.ts and section component files.
 */

/**
 * Controls how the website is rendered.
 *
 * - `live`    Published tenant site. No editing chrome.
 * - `draft`   Builder / editor view. Empty fields show placeholder outlines;
 *             sections may render a subtle focus outline on hover.
 * - `preview` Authenticated preview (preview-token URL). Renders published
 *             content with a "Preview" badge; no editing controls.
 */
export type RenderMode = "draft" | "live" | "preview";
