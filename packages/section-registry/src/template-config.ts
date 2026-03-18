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

/**
 * The five named style presets available in the builder.
 *
 * - `vega`  — Minimal, tech-forward; soft purple accent, clean spacing.
 * - `nova`  — Dark, ultra-luxury; slate tones, dramatic editorial feel.
 * - `maia`  — Warm editorial; amber accent, serif headings, generous padding.
 * - `myra`  — Professional and approachable; green accent, neutral surfaces.
 * - `lyra`  — Bold and energetic; red accent, tight density, strong CTAs.
 */
export type StylePreset = "lyra" | "maia" | "myra" | "nova" | "vega";

/** Full shadcn-compatible color token set for one color mode. */
export type ColorTokenSet = {
  accent: string;
  accentForeground: string;
  background: string;
  border: string;
  card: string;
  cardForeground: string;
  destructive: string;
  destructiveForeground: string;
  foreground: string;
  input: string;
  muted: string;
  mutedForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  ring: string;
  secondary: string;
  secondaryForeground: string;
};

/** Light + dark token pair for a full color system. */
export type ColorSystem = {
  dark: ColorTokenSet;
  description: string;
  label: string;
  light: ColorTokenSet;
};

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
  /** Named color system key (e.g. "ocean", "forest", "slate"). */
  colorSystem?: string;
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
// Style presets (Vega / Nova / Maia / Myra / Lyra)
// ---------------------------------------------------------------------------

export type StylePresetDefinition = ColorScheme & {
  /** Spacing/density variant: "comfortable" | "compact" | "spacious" */
  density: "comfortable" | "compact" | "spacious";
  fontFamily: string;
  headingFontFamily: string;
  label: string;
  /** Tailwind border-radius class applied globally: "none" | "sm" | "md" | "lg" | "full" */
  radius: "full" | "lg" | "md" | "none" | "sm";
};

export const stylePresets: Record<StylePreset, StylePresetDefinition> = {
  /** Vega — Minimal, tech-forward; soft purple accent, clean spacing */
  vega: {
    accentColor: "#7c3aed",
    backgroundColor: "#faf5ff",
    density: "comfortable",
    fontFamily: "Inter",
    headingFontFamily: "Inter",
    label: "Vega — Minimal & Tech-Forward",
    radius: "md",
  },
  /** Nova — Dark, ultra-luxury; slate tones, dramatic editorial feel */
  nova: {
    accentColor: "#92400e",
    backgroundColor: "#1c1917",
    density: "spacious",
    fontFamily: "Playfair Display",
    headingFontFamily: "Playfair Display",
    label: "Nova — Dark Luxury Editorial",
    radius: "none",
  },
  /** Maia — Warm editorial; amber accent, serif headings, generous padding */
  maia: {
    accentColor: "#d97706",
    backgroundColor: "#fffbeb",
    density: "spacious",
    fontFamily: "Manrope",
    headingFontFamily: "Fraunces",
    label: "Maia — Warm & Editorial",
    radius: "lg",
  },
  /** Myra — Professional and approachable; green accent, neutral surfaces */
  myra: {
    accentColor: "#059669",
    backgroundColor: "#f0fdf4",
    density: "comfortable",
    fontFamily: "Roboto",
    headingFontFamily: "Roboto",
    label: "Myra — Professional & Approachable",
    radius: "sm",
  },
  /** Lyra — Bold and energetic; red accent, tight density, strong CTAs */
  lyra: {
    accentColor: "#dc2626",
    backgroundColor: "#fff7f7",
    density: "compact",
    fontFamily: "Lato",
    headingFontFamily: "Lato",
    label: "Lyra — Bold & Energetic",
    radius: "sm",
  },
};

// ---------------------------------------------------------------------------
// Named color systems (20 shadcn tokens, light + dark)
// ---------------------------------------------------------------------------

export const colorSystems: Record<string, ColorSystem> = {
  forest: {
    dark: {
      accent: "#4ade80",
      accentForeground: "#14532d",
      background: "#0f1a0f",
      border: "#1a2e1a",
      card: "#111f11",
      cardForeground: "#f0fdf4",
      destructive: "#ef4444",
      destructiveForeground: "#fef2f2",
      foreground: "#f0fdf4",
      input: "#1a2e1a",
      muted: "#14532d",
      mutedForeground: "#86efac",
      popover: "#111f11",
      popoverForeground: "#f0fdf4",
      primary: "#4ade80",
      primaryForeground: "#14532d",
      ring: "#4ade80",
      secondary: "#14532d",
      secondaryForeground: "#f0fdf4",
    },
    description: "Deep greens and natural tones for eco-friendly or nature-adjacent brands.",
    label: "Forest",
    light: {
      accent: "#4ade80",
      accentForeground: "#14532d",
      background: "#f0fdf4",
      border: "#bbf7d0",
      card: "#ffffff",
      cardForeground: "#14532d",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      foreground: "#14532d",
      input: "#bbf7d0",
      muted: "#dcfce7",
      mutedForeground: "#166534",
      popover: "#ffffff",
      popoverForeground: "#14532d",
      primary: "#16a34a",
      primaryForeground: "#ffffff",
      ring: "#16a34a",
      secondary: "#dcfce7",
      secondaryForeground: "#14532d",
    },
  },
  ocean: {
    dark: {
      accent: "#38bdf8",
      accentForeground: "#0c4a6e",
      background: "#0c1824",
      border: "#164e63",
      card: "#0f2231",
      cardForeground: "#f0f9ff",
      destructive: "#ef4444",
      destructiveForeground: "#fef2f2",
      foreground: "#f0f9ff",
      input: "#164e63",
      muted: "#0c4a6e",
      mutedForeground: "#7dd3fc",
      popover: "#0f2231",
      popoverForeground: "#f0f9ff",
      primary: "#38bdf8",
      primaryForeground: "#0c4a6e",
      ring: "#38bdf8",
      secondary: "#0c4a6e",
      secondaryForeground: "#f0f9ff",
    },
    description: "Deep blues and aqua tones for coastal, beachfront, and waterfront properties.",
    label: "Ocean",
    light: {
      accent: "#38bdf8",
      accentForeground: "#0c4a6e",
      background: "#f0f9ff",
      border: "#bae6fd",
      card: "#ffffff",
      cardForeground: "#0c4a6e",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      foreground: "#0c4a6e",
      input: "#bae6fd",
      muted: "#e0f2fe",
      mutedForeground: "#0369a1",
      popover: "#ffffff",
      popoverForeground: "#0c4a6e",
      primary: "#0284c7",
      primaryForeground: "#ffffff",
      ring: "#0284c7",
      secondary: "#e0f2fe",
      secondaryForeground: "#0c4a6e",
    },
  },
  slate: {
    dark: {
      accent: "#94a3b8",
      accentForeground: "#0f172a",
      background: "#020617",
      border: "#1e293b",
      card: "#0f172a",
      cardForeground: "#f8fafc",
      destructive: "#ef4444",
      destructiveForeground: "#fef2f2",
      foreground: "#f8fafc",
      input: "#1e293b",
      muted: "#1e293b",
      mutedForeground: "#94a3b8",
      popover: "#0f172a",
      popoverForeground: "#f8fafc",
      primary: "#e2e8f0",
      primaryForeground: "#0f172a",
      ring: "#94a3b8",
      secondary: "#1e293b",
      secondaryForeground: "#f8fafc",
    },
    description: "Monochromatic slate tones for ultra-clean, high-contrast professional brands.",
    label: "Slate",
    light: {
      accent: "#64748b",
      accentForeground: "#f8fafc",
      background: "#f8fafc",
      border: "#e2e8f0",
      card: "#ffffff",
      cardForeground: "#0f172a",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      foreground: "#0f172a",
      input: "#e2e8f0",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      popover: "#ffffff",
      popoverForeground: "#0f172a",
      primary: "#0f172a",
      primaryForeground: "#f8fafc",
      ring: "#0f172a",
      secondary: "#f1f5f9",
      secondaryForeground: "#0f172a",
    },
  },
};

// ---------------------------------------------------------------------------
// Font fallback resolution
// ---------------------------------------------------------------------------

/**
 * Internal font fallback overrides for special UI slots.
 *
 * Some UI slots intentionally use a different font from the selected primary
 * font to preserve refined typography without exposing complexity to users.
 *
 * Usage: `fontFallbacks[selectedFont]?.subscribeButton ?? selectedFont`
 */
export type FontFallbackMap = Record<string, string>;

export const fontFallbacks: Record<string, FontFallbackMap> = {
  fraunces: {
    badge: "Manrope",
    subscribeButton: "Manrope",
  },
  inter: {
    badge: "Inter",
    subscribeButton: "Roboto",
  },
  lato: {
    badge: "Lato",
    subscribeButton: "Lato",
  },
  manrope: {
    badge: "Inter",
    subscribeButton: "Inter",
  },
  "playfair display": {
    badge: "Inter",
    eyebrow: "Inter",
    subscribeButton: "Inter",
  },
  roboto: {
    badge: "Roboto",
    subscribeButton: "Roboto",
  },
  satoshi: {
    badge: "Inter",
    subscribeButton: "Inter",
  },
};

/**
 * Resolves the font family for a specific UI slot.
 *
 * Falls back to the selected font when no slot-level override exists.
 *
 * @example
 *   resolveSlotFont("Inter", "subscribeButton") // → "Roboto"
 *   resolveSlotFont("Inter", "heroTitle")       // → "Inter"
 */
export function resolveSlotFont(selectedFont: string, slot: string): string {
  const key = selectedFont.toLowerCase();
  return fontFallbacks[key]?.[slot] ?? selectedFont;
}

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
  if (config.colorSystem) output.colorSystem = config.colorSystem;
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
    colorSystem: raw.colorSystem,
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
    colorSystem: derived.colorSystem,
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

/**
 * Resolves the effective TemplateConfig for a style preset, merging preset
 * defaults under any tenant-supplied overrides.
 */
export function resolvePresetConfig(
  preset: StylePreset,
  overrides?: Partial<TemplateConfig>,
): TemplateConfig {
  const base = stylePresets[preset];
  return {
    accentColor: base.accentColor,
    backgroundColor: base.backgroundColor,
    fontFamily: base.fontFamily,
    headingFontFamily: base.headingFontFamily,
    stylePreset: preset,
    ...overrides,
  };
}
