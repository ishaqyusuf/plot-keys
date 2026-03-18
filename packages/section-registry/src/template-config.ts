/**
 * Controlled template configuration.
 *
 * `TemplateConfig` is a typed, validated representation of the design choices
 * a tenant makes for their website. It replaces freeform `themeJson` access
 * patterns with explicit, named fields that the builder can present as
 * structured controls (color pickers, font selectors, preset cards).
 *
 * The canonical storage format is `themeJson` on `SiteConfiguration`. This
 * module provides serialization helpers so callers never access `themeJson`
 * keys as raw strings.
 */

import type { DerivedDesignConfig } from "./recommendation";

// ---------------------------------------------------------------------------
// Config type
// ---------------------------------------------------------------------------

export type StylePreset = "bold" | "clean" | "editorial" | "warm";

export type ColorScheme = {
  accentColor: string;
  backgroundColor: string;
  /** Optional override for the foreground/text color. */
  foregroundColor?: string;
};

/**
 * Controlled template configuration stored in `SiteConfiguration.themeJson`.
 *
 * Extends the raw `ThemeConfig` with explicit labels for the builder.
 */
export type TemplateConfig = {
  /** The chosen accent color as a CSS hex value. */
  accentColor?: string;
  /** The chosen background color. */
  backgroundColor?: string;
  /** Body font family name (resolved via `resolveFontStack`). */
  fontFamily?: string;
  /** Heading font family name (resolved via `resolveHeadingFontStack`). */
  headingFontFamily?: string;
  /** Company logo text or URL for the site header. */
  logo?: string;
  /** The primary market label shown in the hero and metadata. */
  market?: string;
  /**
   * Named image assignments for sections (e.g. hero background, story photo).
   * Keys are section slot IDs; values are image URLs or Cloudinary public IDs.
   */
  namedImages?: Record<string, string>;
  /** The active style preset key. */
  stylePreset?: StylePreset;
  /** Support tagline or contact line shown in the footer/header. */
  supportLine?: string;
};

// ---------------------------------------------------------------------------
// Style presets
// ---------------------------------------------------------------------------

export const stylePresets: Record<StylePreset, ColorScheme & { fontFamily: string; headingFontFamily: string; label: string }> = {
  bold: {
    accentColor: "#1e293b",
    backgroundColor: "#0f172a",
    fontFamily: "Inter",
    headingFontFamily: "Space Grotesk",
    label: "Bold & Modern",
  },
  clean: {
    accentColor: "#0369a1",
    backgroundColor: "#f0f9ff",
    fontFamily: "Inter",
    headingFontFamily: "Epilogue",
    label: "Clean & Professional",
  },
  editorial: {
    accentColor: "#0f766e",
    backgroundColor: "#f4efe7",
    fontFamily: "Georgia",
    headingFontFamily: "Playfair Display",
    label: "Editorial & Refined",
  },
  warm: {
    accentColor: "#16a34a",
    backgroundColor: "#fdf6ee",
    fontFamily: "Avenir",
    headingFontFamily: "Fraunces",
    label: "Warm & Inviting",
  },
};

// ---------------------------------------------------------------------------
// Serialization helpers
// ---------------------------------------------------------------------------

/**
 * Serializes a `TemplateConfig` into the flat `themeJson`-compatible shape.
 * Unknown fields are preserved via spread so custom ad-hoc keys survive.
 */
export function serializeTemplateConfig(
  config: TemplateConfig,
): Record<string, string> {
  const output: Record<string, string> = {};

  if (config.accentColor) output.accentColor = config.accentColor;
  if (config.backgroundColor) output.backgroundColor = config.backgroundColor;
  if (config.foregroundColor) output.foregroundColor = config.foregroundColor;
  if (config.fontFamily) output.fontFamily = config.fontFamily;
  if (config.headingFontFamily) output.headingFontFamily = config.headingFontFamily;
  if (config.logo) output.logo = config.logo;
  if (config.market) output.market = config.market;
  if (config.stylePreset) output.stylePreset = config.stylePreset;
  if (config.supportLine) output.supportLine = config.supportLine;

  if (config.namedImages) {
    for (const [slot, url] of Object.entries(config.namedImages)) {
      output[`namedImage.${slot}`] = url;
    }
  }

  return output;
}

/**
 * Deserializes a flat `themeJson` record back into a `TemplateConfig`.
 * Unknown keys are ignored.
 */
export function deserializeTemplateConfig(
  raw: Record<string, string>,
): TemplateConfig {
  const namedImages: Record<string, string> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("namedImage.")) {
      const slot = key.slice("namedImage.".length);
      namedImages[slot] = value;
    }
  }

  return {
    accentColor: raw.accentColor,
    backgroundColor: raw.backgroundColor,
    fontFamily: raw.fontFamily,
    foregroundColor: raw.foregroundColor,
    headingFontFamily: raw.headingFontFamily,
    logo: raw.logo,
    market: raw.market,
    namedImages: Object.keys(namedImages).length > 0 ? namedImages : undefined,
    stylePreset: raw.stylePreset as StylePreset | undefined,
    supportLine: raw.supportLine,
  };
}

/**
 * Converts a `DerivedDesignConfig` (from the recommendation engine) into a
 * `TemplateConfig` so onboarding-driven defaults can be stored in the same
 * structured format.
 */
export function fromDerivedDesignConfig(
  derived: DerivedDesignConfig,
): TemplateConfig {
  return {
    accentColor: derived.accentColor,
    backgroundColor: derived.backgroundColor,
    fontFamily: derived.fontFamily,
    headingFontFamily: derived.headingFontFamily,
    stylePreset: derived.stylePreset as StylePreset | undefined,
  };
}

/**
 * Applies a partial `TemplateConfig` update over an existing config.
 * Returns the merged result.
 */
export function applyConfigUpdate(
  existing: TemplateConfig,
  update: Partial<TemplateConfig>,
): TemplateConfig {
  const mergedNamedImages = update.namedImages
    ? { ...(existing.namedImages ?? {}), ...update.namedImages }
    : existing.namedImages;

  return {
    ...existing,
    ...update,
    namedImages: mergedNamedImages,
  };
}
