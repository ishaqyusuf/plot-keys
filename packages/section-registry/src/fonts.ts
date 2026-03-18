/**
 * Font-fallback resolution for the section-registry design system.
 *
 * Maps font family names used in ThemeConfig to full CSS `font-family` stacks
 * with appropriate web-safe and system fallbacks. This keeps font complexity
 * out of the template configuration layer.
 */

/** Maps a canonical font-family name to a CSS font-family stack with fallbacks. */
export function resolveFontStack(fontFamily: string | undefined): string {
  if (!fontFamily) return systemFontStack;

  const lower = fontFamily.toLowerCase();

  // Satoshi (the default brand body font)
  if (lower.includes("satoshi")) {
    return "Satoshi, 'Avenir Next', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  }

  // Inter (clean/minimal system-close font)
  if (lower.includes("inter")) {
    return "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  }

  // Avenir Next (secondary sans)
  if (lower.includes("avenir")) {
    return "'Avenir Next', Avenir, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  }

  // Georgia / serif heading fonts
  if (lower.includes("georgia")) {
    return "Georgia, 'Times New Roman', Times, serif";
  }

  // Playfair Display (editorial heading)
  if (lower.includes("playfair")) {
    return "'Playfair Display', Georgia, 'Times New Roman', Times, serif";
  }

  // Libre Baskerville / Baskerville
  if (lower.includes("baskerville")) {
    return "Baskerville, 'Libre Baskerville', Georgia, 'Times New Roman', serif";
  }

  // Fraunces (warm, editorial serif)
  if (lower.includes("fraunces")) {
    return "Fraunces, 'Libre Baskerville', Georgia, serif";
  }

  // Epilogue (modern geometric sans)
  if (lower.includes("epilogue")) {
    return "Epilogue, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  }

  // Space Grotesk
  if (lower.includes("space grotesk")) {
    return "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  }

  // Pass through verbatim if it's already a comma-separated stack
  if (fontFamily.includes(",")) return fontFamily;

  // Unknown single value — append system fallbacks
  return `${fontFamily}, ${systemFontStack}`;
}

/**
 * Returns the resolved heading font stack. Falls back to the body font
 * stack when no separate heading font is configured.
 */
export function resolveHeadingFontStack(
  headingFontFamily: string | undefined,
  bodyFontFamily: string | undefined,
): string {
  if (headingFontFamily) return resolveFontStack(headingFontFamily);
  return resolveFontStack(bodyFontFamily);
}

const systemFontStack =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// ---------------------------------------------------------------------------
// Slot-level font overrides
// ---------------------------------------------------------------------------

/**
 * Per-slot font override map.
 *
 * Some UI slots benefit from a different typeface than the body/heading fonts
 * (e.g. a badge should stay compact; eyebrows benefit from letter-spacing).
 * Keys are slot identifiers; values are resolved CSS font-family stacks.
 */
export type FontFallbackMap = {
  badge?: string;
  eyebrow?: string;
  subscribeButton?: string;
};

/** Default per-slot font overrides keyed by font-family name. */
export const fontFallbacks: Record<string, FontFallbackMap> = {
  satoshi: {
    badge: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    eyebrow: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    subscribeButton: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  georgia: {
    badge: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    eyebrow: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    subscribeButton: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  inter: {
    badge: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    eyebrow: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    subscribeButton: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  playfair: {
    badge: "'Playfair Display', Georgia, serif",
    eyebrow: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    subscribeButton: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
};

/**
 * Resolves the font stack for a specific UI slot, falling back to the
 * base font stack when no slot override is configured.
 *
 * @param fontFamily - The base font family name (e.g. "Satoshi", "Georgia")
 * @param slot - The UI slot key (e.g. "badge", "eyebrow", "subscribeButton")
 */
export function resolveSlotFont(
  fontFamily: string | undefined,
  slot: keyof FontFallbackMap,
): string {
  const key = (fontFamily ?? "").toLowerCase().split(",")[0]?.trim() ?? "";
  const slotOverride = fontFallbacks[key]?.[slot];
  return slotOverride ?? resolveFontStack(fontFamily);
}
