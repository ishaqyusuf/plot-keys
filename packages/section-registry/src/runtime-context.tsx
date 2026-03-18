"use client";

/**
 * Tenant website runtime context.
 *
 * Provides RenderMode and TemplateConfig to all section components via React
 * context so sections do not need prop-drilling or direct imports of config.
 *
 * Usage in apps:
 *   - Wrap the page tree with <WebsiteRuntimeProvider>
 *   - Use hooks inside section components: useRenderMode(), useTemplateConfig()
 */

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

import type { RenderMode } from "./types";
import type { ColorSystem, StylePreset, StylePresetDefinition, TemplateConfig } from "./template-config";
import { colorSystems, resolvePresetConfig, resolveSlotFont, stylePresets } from "./template-config";

// ---------------------------------------------------------------------------
// Context shapes
// ---------------------------------------------------------------------------

type WebsiteRuntimeContextValue = {
  /**
   * Resolved color system for the active named color system.
   * Falls back to the slate system when no colorSystem key is set.
   */
  colorSystem: ColorSystem;
  /**
   * Current render mode.
   *
   * - `live`    — Published site, no editing chrome.
   * - `draft`   — Builder view with placeholder outlines on empty fields.
   * - `preview` — Authenticated preview, renders published content with badge.
   */
  renderMode: RenderMode;
  /** Active style preset definition (spacing, radius, density). */
  stylePresetDefinition: StylePresetDefinition;
  /** The resolved template config for the active session. */
  templateConfig: TemplateConfig;
};

const defaultColorSystem = colorSystems.slate as ColorSystem;
const defaultStylePreset = stylePresets.vega;

const WebsiteRuntimeContext = createContext<WebsiteRuntimeContextValue>({
  colorSystem: defaultColorSystem,
  renderMode: "live",
  stylePresetDefinition: defaultStylePreset,
  templateConfig: {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export type WebsiteRuntimeProviderProps = {
  children: ReactNode;
  renderMode?: RenderMode;
  templateConfig?: TemplateConfig;
};

/**
 * Wraps the website page tree and makes runtime values available to all
 * section components via context hooks.
 *
 * @example
 * ```tsx
 * <WebsiteRuntimeProvider renderMode="draft" templateConfig={config}>
 *   {sections.map(s => <SectionRenderer key={s.id} section={s} />)}
 * </WebsiteRuntimeProvider>
 * ```
 */
export function WebsiteRuntimeProvider({
  children,
  renderMode = "live",
  templateConfig = {},
}: WebsiteRuntimeProviderProps) {
  const value = useMemo<WebsiteRuntimeContextValue>(() => {
    const preset = (templateConfig.stylePreset ?? "vega") as StylePreset;
    const resolved = resolvePresetConfig(preset, templateConfig);

    const colorSystemKey = templateConfig.colorSystem ?? "slate";
    const activeColorSystem = colorSystems[colorSystemKey] ?? defaultColorSystem;

    return {
      colorSystem: activeColorSystem,
      renderMode,
      stylePresetDefinition: stylePresets[preset] ?? defaultStylePreset,
      templateConfig: resolved,
    };
  }, [renderMode, templateConfig]);

  return (
    <WebsiteRuntimeContext.Provider value={value}>
      {children}
    </WebsiteRuntimeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Returns the current render mode. */
export function useRenderMode(): RenderMode {
  return useContext(WebsiteRuntimeContext).renderMode;
}

/** Returns `true` when the page is rendering in draft (builder) mode. */
export function useIsDraftMode(): boolean {
  return useContext(WebsiteRuntimeContext).renderMode === "draft";
}

/** Returns the resolved TemplateConfig for the active session. */
export function useTemplateConfig(): TemplateConfig {
  return useContext(WebsiteRuntimeContext).templateConfig;
}

/** Returns the resolved active color system (light + dark token set). */
export function useColorSystem(): ColorSystem {
  return useContext(WebsiteRuntimeContext).colorSystem;
}

/** Returns the style preset definition (spacing, radius, density). */
export function useTemplateStylePreset(): StylePresetDefinition {
  return useContext(WebsiteRuntimeContext).stylePresetDefinition;
}

/**
 * Returns the resolved font family for a specific UI slot.
 *
 * Applies internal font-fallback mappings so sections don't need to know
 * about per-slot typography overrides.
 *
 * @example
 *   const font = useResolvedFont("subscribeButton"); // "Roboto" when Inter is selected
 */
export function useResolvedFont(slot?: string): string {
  const { templateConfig } = useContext(WebsiteRuntimeContext);
  const selectedFont = templateConfig.fontFamily ?? "Inter";
  if (!slot) return selectedFont;
  return resolveSlotFont(selectedFont, slot);
}

/**
 * Returns the resolved URL for a named template image slot.
 * Falls back to `undefined` when the slot has no assignment.
 *
 * @example
 *   const heroUrl = useTemplateImage("heroImage");
 */
export function useTemplateImage(slot: string): string | undefined {
  const { templateConfig } = useContext(WebsiteRuntimeContext);
  return templateConfig.namedImages?.[slot];
}
