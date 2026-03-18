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
// Style preset
// ---------------------------------------------------------------------------

/** Named style presets aligned with the Template Config Mode brain doc. */
export type StylePreset = "vega" | "nova" | "maia" | "myra" | "lyra";

export type StylePresetDefinition = {
  key: StylePreset;
  name: string;
  /** Tailwind spacing classes applied to section layout. */
  spacing: {
    sectionY: string;
    sectionGap: string;
    containerX: string;
    gridGap: string;
  };
  /** Tailwind border-radius classes applied per UI element type. */
  radius: {
    card: string;
    button: string;
    input: string;
    modal: string;
  };
  density: "compact" | "balanced" | "airy";
};

export const stylePresets: Record<StylePreset, StylePresetDefinition> = {
  /** Clean, minimal — great for lead-gen residential brands. */
  vega: {
    key: "vega",
    name: "Vega",
    spacing: {
      sectionY: "py-20",
      sectionGap: "gap-10",
      containerX: "px-4 md:px-6",
      gridGap: "gap-6",
    },
    radius: {
      card: "rounded-2xl",
      button: "rounded-md",
      input: "rounded-md",
      modal: "rounded-2xl",
    },
    density: "balanced",
  },
  /** Dark, editorial luxury — best for high-end brands. */
  nova: {
    key: "nova",
    name: "Nova",
    spacing: {
      sectionY: "py-24",
      sectionGap: "gap-12",
      containerX: "px-5 md:px-8",
      gridGap: "gap-8",
    },
    radius: {
      card: "rounded-3xl",
      button: "rounded-full",
      input: "rounded-xl",
      modal: "rounded-3xl",
    },
    density: "airy",
  },
  /** Warm editorial serif — perfect for boutique and family agencies. */
  maia: {
    key: "maia",
    name: "Maia",
    spacing: {
      sectionY: "py-28",
      sectionGap: "gap-14",
      containerX: "px-6 md:px-10",
      gridGap: "gap-8",
    },
    radius: {
      card: "rounded-none",
      button: "rounded-none",
      input: "rounded-sm",
      modal: "rounded-sm",
    },
    density: "airy",
  },
  /** Minimal neutral — versatile for any market segment. */
  myra: {
    key: "myra",
    name: "Myra",
    spacing: {
      sectionY: "py-16",
      sectionGap: "gap-8",
      containerX: "px-4 md:px-5",
      gridGap: "gap-4",
    },
    radius: {
      card: "rounded-lg",
      button: "rounded-full",
      input: "rounded-full",
      modal: "rounded-xl",
    },
    density: "compact",
  },
  /** Bold, high-contrast — ideal for commercial and investor audiences. */
  lyra: {
    key: "lyra",
    name: "Lyra",
    spacing: {
      sectionY: "py-20",
      sectionGap: "gap-10",
      containerX: "px-4 md:px-8",
      gridGap: "gap-6",
    },
    radius: {
      card: "rounded-xl",
      button: "rounded-lg",
      input: "rounded-lg",
      modal: "rounded-2xl",
    },
    density: "balanced",
  },
};

// ---------------------------------------------------------------------------
// Color system
// ---------------------------------------------------------------------------

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

export type ColorSystem = {
  dark: ColorTokenSet;
  light: ColorTokenSet;
  name: string;
};

export const colorSystems: Record<string, ColorSystem> = {
  slate: {
    name: "Slate",
    light: {
      accent: "240 4.8% 95.9%",
      accentForeground: "240 5.9% 10%",
      background: "0 0% 100%",
      border: "240 5.9% 90%",
      card: "0 0% 100%",
      cardForeground: "240 10% 3.9%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      foreground: "240 10% 3.9%",
      input: "240 5.9% 90%",
      muted: "240 4.8% 95.9%",
      mutedForeground: "240 3.8% 46.1%",
      popover: "0 0% 100%",
      popoverForeground: "240 10% 3.9%",
      primary: "221 83% 53%",
      primaryForeground: "0 0% 98%",
      ring: "221 83% 53%",
      secondary: "240 4.8% 95.9%",
      secondaryForeground: "240 5.9% 10%",
    },
    dark: {
      accent: "240 3.7% 15.9%",
      accentForeground: "0 0% 98%",
      background: "240 10% 3.9%",
      border: "240 3.7% 15.9%",
      card: "240 10% 3.9%",
      cardForeground: "0 0% 98%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "0 0% 98%",
      foreground: "0 0% 98%",
      input: "240 3.7% 15.9%",
      muted: "240 3.7% 15.9%",
      mutedForeground: "240 5% 64.9%",
      popover: "240 10% 3.9%",
      popoverForeground: "0 0% 98%",
      primary: "221 83% 53%",
      primaryForeground: "0 0% 98%",
      ring: "221 83% 53%",
      secondary: "240 3.7% 15.9%",
      secondaryForeground: "0 0% 98%",
    },
  },
  ocean: {
    name: "Ocean",
    light: {
      accent: "199 89% 94%",
      accentForeground: "199 89% 20%",
      background: "204 100% 98%",
      border: "199 50% 88%",
      card: "0 0% 100%",
      cardForeground: "199 80% 8%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      foreground: "199 80% 8%",
      input: "199 50% 88%",
      muted: "199 50% 94%",
      mutedForeground: "199 30% 46%",
      popover: "0 0% 100%",
      popoverForeground: "199 80% 8%",
      primary: "199 89% 48%",
      primaryForeground: "0 0% 100%",
      ring: "199 89% 48%",
      secondary: "199 50% 92%",
      secondaryForeground: "199 80% 14%",
    },
    dark: {
      accent: "199 60% 18%",
      accentForeground: "199 89% 80%",
      background: "199 80% 6%",
      border: "199 40% 16%",
      card: "199 70% 8%",
      cardForeground: "199 30% 96%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "0 0% 98%",
      foreground: "199 30% 96%",
      input: "199 40% 16%",
      muted: "199 40% 14%",
      mutedForeground: "199 20% 60%",
      popover: "199 70% 8%",
      popoverForeground: "199 30% 96%",
      primary: "199 89% 48%",
      primaryForeground: "0 0% 100%",
      ring: "199 89% 48%",
      secondary: "199 40% 14%",
      secondaryForeground: "199 30% 96%",
    },
  },
  forest: {
    name: "Forest",
    light: {
      accent: "142 52% 92%",
      accentForeground: "142 52% 18%",
      background: "138 30% 98%",
      border: "142 30% 86%",
      card: "0 0% 100%",
      cardForeground: "142 60% 7%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      foreground: "142 60% 7%",
      input: "142 30% 86%",
      muted: "142 20% 94%",
      mutedForeground: "142 15% 45%",
      popover: "0 0% 100%",
      popoverForeground: "142 60% 7%",
      primary: "142 71% 45%",
      primaryForeground: "0 0% 100%",
      ring: "142 71% 45%",
      secondary: "142 20% 91%",
      secondaryForeground: "142 60% 12%",
    },
    dark: {
      accent: "142 40% 16%",
      accentForeground: "142 52% 78%",
      background: "142 60% 5%",
      border: "142 30% 14%",
      card: "142 50% 7%",
      cardForeground: "142 20% 96%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "0 0% 98%",
      foreground: "142 20% 96%",
      input: "142 30% 14%",
      muted: "142 30% 12%",
      mutedForeground: "142 12% 60%",
      popover: "142 50% 7%",
      popoverForeground: "142 20% 96%",
      primary: "142 71% 45%",
      primaryForeground: "0 0% 100%",
      ring: "142 71% 45%",
      secondary: "142 30% 12%",
      secondaryForeground: "142 20% 96%",
    },
  },
};

// ---------------------------------------------------------------------------
// Config type
// ---------------------------------------------------------------------------

export type ColorScheme = {
  accentColor: string;
  backgroundColor: string;
  /** Optional override for the foreground/text color. */
  foregroundColor?: string;
};

/**
 * Controlled template configuration stored in `SiteConfiguration.themeJson`.
 */
export type TemplateConfig = {
  /** The chosen accent color as a CSS hex value. */
  accentColor?: string;
  /** The chosen background color. */
  backgroundColor?: string;
  /** Active color system key (e.g. "slate", "ocean", "forest"). */
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
// Serialization helpers
// ---------------------------------------------------------------------------

export function serializeTemplateConfig(
  config: TemplateConfig,
): Record<string, string> {
  const output: Record<string, string> = {};

  if (config.accentColor) output.accentColor = config.accentColor;
  if (config.backgroundColor) output.backgroundColor = config.backgroundColor;
  if (config.colorSystem) output.colorSystem = config.colorSystem;
  if (config.fontFamily) output.fontFamily = config.fontFamily;
  if (config.headingFontFamily)
    output.headingFontFamily = config.headingFontFamily;
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
    headingFontFamily: raw.headingFontFamily,
    logo: raw.logo,
    market: raw.market,
    namedImages: Object.keys(namedImages).length > 0 ? namedImages : undefined,
    stylePreset: raw.stylePreset as StylePreset | undefined,
    supportLine: raw.supportLine,
  };
}

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
 * Merges tenant-supplied overrides into a TemplateConfig anchored to the
 * given style preset. The preset controls layout (spacing, radius, density)
 * only; colors and fonts are separate concerns managed via their own fields.
 */
export function resolvePresetConfig(
  presetKey: StylePreset | undefined,
  overrides: Partial<TemplateConfig> = {},
): TemplateConfig {
  return {
    ...overrides,
    stylePreset: overrides.stylePreset ?? presetKey,
  };
}
