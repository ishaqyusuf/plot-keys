/**
 * Structured content nodes.
 *
 * Evolution path for editable fields:
 *
 * V1 (current) — flat `Record<string, string>` stored as `contentJson`.
 *   Simple string lookup by content key. No type information, no history.
 *
 * V2 (this module) — `ContentNode` adds type, AI provenance, and optional
 *   rich-text delta alongside the plain string value. The flat format is
 *   preserved as the canonical read path; V2 nodes live in a separate
 *   `contentNodesJson` column (future migration) and override V1 values
 *   when present.
 *
 * V3 (future) — section schemas define node types explicitly; structured
 *   delta replaces the plain string for rich-text sections.
 */

// ---------------------------------------------------------------------------
// Node types
// ---------------------------------------------------------------------------

/** How the node's value was last set. */
export type ContentNodeProvenance =
  | "ai_assisted"     // AI generated, human reviewed
  | "ai_generated"    // Fully AI generated, not reviewed
  | "human"           // Written by a human
  | "imported"        // Imported from an external source
  | "template_default"; // Copied from the template's default content

/** The expected rendering context for the field. */
export type ContentNodeKind =
  | "heading"       // Short headline, no formatting
  | "label"         // Very short UI label (< 40 chars)
  | "paragraph"     // Multi-sentence prose
  | "rich_text"     // HTML-capable (reserved for V3)
  | "url"           // URL field
  | "cta";          // Call-to-action button label

/** A structured content node wrapping a string value. */
export type ContentNode = {
  /**
   * AI-generated context stored alongside the value. Helps the AI understand
   * the field's purpose when re-generating or improving the copy.
   */
  aiContext?: {
    /** The prompt used to generate this value, if AI-generated. */
    generationPrompt?: string;
    /** The model that generated this value. */
    model?: string;
    /** ISO timestamp of when the AI last touched this node. */
    touchedAt?: string;
  };
  /** Timestamp of the last manual edit (ISO string). */
  editedAt?: string;
  /** Stable key matching the V1 `contentJson` key. */
  key: string;
  /** The rendering kind. Informs the editor widget and AI prompts. */
  kind: ContentNodeKind;
  /** How the current value was set. */
  provenance: ContentNodeProvenance;
  /** Reserved for V3 rich-text delta format. */
  richTextDelta?: unknown;
  /** Plain string value. Always present; authoritative for V1 compatibility. */
  value: string;
};

/** Full structured content record keyed by content key. */
export type ContentNodeRecord = Record<string, ContentNode>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Lifts a flat V1 `Record<string, string>` into a `ContentNodeRecord` with
 * `template_default` provenance. Used during migration.
 */
export function liftFlatContent(
  flat: Record<string, string>,
): ContentNodeRecord {
  return Object.fromEntries(
    Object.entries(flat).map(([key, value]) => [
      key,
      {
        key,
        kind: inferKindFromKey(key),
        provenance: "template_default" as ContentNodeProvenance,
        value,
      } satisfies ContentNode,
    ]),
  );
}

/**
 * Collapses a `ContentNodeRecord` back into a flat `Record<string, string>`
 * for backward-compatible reads.
 */
export function flattenContentNodes(
  nodes: ContentNodeRecord,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(nodes).map(([key, node]) => [key, node.value]),
  );
}

/**
 * Returns a new `ContentNode` with an updated value and provenance, suitable
 * for persisting after a human edit.
 */
export function applyHumanEdit(
  existing: ContentNode | undefined,
  key: string,
  value: string,
): ContentNode {
  return {
    ...(existing ?? { key, kind: inferKindFromKey(key) }),
    editedAt: new Date().toISOString(),
    key,
    provenance: "human",
    value,
  };
}

/**
 * Returns a new `ContentNode` after an AI generation pass.
 */
export function applyAiGeneration(
  existing: ContentNode | undefined,
  key: string,
  value: string,
  meta: { model: string; prompt: string },
): ContentNode {
  return {
    ...(existing ?? { key, kind: inferKindFromKey(key) }),
    aiContext: {
      generationPrompt: meta.prompt,
      model: meta.model,
      touchedAt: new Date().toISOString(),
    },
    key,
    provenance: "ai_generated",
    value,
  };
}

// ---------------------------------------------------------------------------
// Internal utilities
// ---------------------------------------------------------------------------

/**
 * Heuristically infers the `ContentNodeKind` from a content key.
 * The builder can override this via the `EditableFieldDefinition.fieldType`.
 */
function inferKindFromKey(key: string): ContentNodeKind {
  const lower = key.toLowerCase();

  if (lower.includes("cta") && !lower.includes("label")) return "cta";
  if (lower.includes("url") || lower.includes("link")) return "url";
  if (
    lower.includes("title") ||
    lower.includes("heading") ||
    lower.includes("eyebrow")
  ) {
    return "heading";
  }
  if (lower.includes("label") || lower.includes("badge")) return "label";
  if (
    lower.includes("body") ||
    lower.includes("description") ||
    lower.includes("subtitle") ||
    lower.includes("text")
  ) {
    return "paragraph";
  }

  return "label";
}
