"use client";

/**
 * Tenant website runtime context.
 *
 * Provides render mode, template configuration, color system, and style preset
 * to all section components without prop-drilling. Also applies the active
 * color system tokens as CSS custom properties on a wrapper div so section
 * components can consume `--pk-*` variables directly in their styles.
 *
 * Usage:
 *   <WebsiteRuntimeProvider renderMode="draft" templateConfig={config}>
 *     {sections}
 *   </WebsiteRuntimeProvider>
 */

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { resolveFontStack, resolveHeadingFontStack, resolveSlotFont, type FontFallbackMap } from "./fonts";
import {
  colorSystems,
  type ColorSystem,
  type StylePreset,
  type StylePresetDefinition,
  stylePresets,
  type TemplateConfig,
} from "./template-config";
import type { RenderMode } from "./types";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

export type WebsiteRuntimeContextValue = {
  colorSystem: ColorSystem | undefined;
  renderMode: RenderMode;
  stylePreset: StylePresetDefinition | undefined;
  templateConfig: TemplateConfig;
};

const WebsiteRuntimeContext = createContext<WebsiteRuntimeContextValue>({
  colorSystem: undefined,
  renderMode: "live",
  stylePreset: undefined,
  templateConfig: {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export type WebsiteRuntimeProviderProps = {
  children: ReactNode;
  colorSystemKey?: string;
  renderMode?: RenderMode;
  templateConfig?: TemplateConfig;
};

/**
 * Wraps section content with runtime context and applies color system tokens
 * as inline CSS custom properties (`--pk-*`) so sections can use them.
 */
export function WebsiteRuntimeProvider({
  children,
  colorSystemKey,
  renderMode = "live",
  templateConfig = {},
}: WebsiteRuntimeProviderProps) {
  const resolvedColorSystemKey =
    colorSystemKey ?? templateConfig.colorSystem ?? "slate";
  const colorSystem = colorSystems[resolvedColorSystemKey];
  const stylePresetKey = templateConfig.stylePreset as StylePreset | undefined;
  const stylePreset = stylePresetKey ? stylePresets[stylePresetKey] : undefined;

  // Build CSS vars from the light token set
  const cssVars = useMemo<React.CSSProperties>(() => {
    if (!colorSystem) return {};
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(colorSystem.light)) {
      // Convert camelCase to kebab-case for CSS var names
      const kebab = key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
      vars[`--pk-${kebab}`] = String(value);
    }
    return vars as React.CSSProperties;
  }, [colorSystem]);

  const value = useMemo<WebsiteRuntimeContextValue>(
    () => ({ colorSystem, renderMode, stylePreset, templateConfig }),
    [colorSystem, renderMode, stylePreset, templateConfig],
  );

  return (
    <WebsiteRuntimeContext.Provider value={value}>
      <div style={cssVars}>{children}</div>
    </WebsiteRuntimeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Returns the current render mode ("live", "draft", or "preview"). */
export function useRenderMode(): RenderMode {
  return useContext(WebsiteRuntimeContext).renderMode;
}

/** Returns true when the current render mode is "draft". */
export function useIsDraftMode(): boolean {
  return useContext(WebsiteRuntimeContext).renderMode === "draft";
}

/** Returns the resolved TemplateConfig for the current tenant site. */
export function useTemplateConfig(): TemplateConfig {
  return useContext(WebsiteRuntimeContext).templateConfig;
}

/** Returns the active ColorSystem, or undefined when none is configured. */
export function useColorSystem(): ColorSystem | undefined {
  return useContext(WebsiteRuntimeContext).colorSystem;
}

/** Returns the resolved StylePresetDefinition, or undefined when none is set. */
export function useTemplateStylePreset(): StylePresetDefinition | undefined {
  return useContext(WebsiteRuntimeContext).stylePreset;
}

/**
 * Returns the resolved CSS font-family stack for the given UI slot.
 * Falls back to the base body font when no slot-specific override exists.
 */
export function useResolvedFont(slot: keyof FontFallbackMap = "eyebrow"): string {
  const { templateConfig } = useContext(WebsiteRuntimeContext);
  return resolveSlotFont(templateConfig.fontFamily, slot);
}

/**
 * Returns the URL for a named image slot from the active TemplateConfig.
 * Returns undefined when the slot has no image assigned.
 */
export function useTemplateImage(slot: string): string | undefined {
  const { templateConfig } = useContext(WebsiteRuntimeContext);
  return templateConfig.namedImages?.[slot];
}

// Re-export font helpers for convenience
export { resolveFontStack, resolveHeadingFontStack };
