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

import {
  type AnchorHTMLAttributes,
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import {
  resolveFontStack,
  resolveHeadingFontStack,
  resolveSlotFont,
  type FontFallbackMap,
} from "./fonts";
import {
  colorSystems,
  type ColorSystem,
  type StylePreset,
  type StylePresetDefinition,
  stylePresets,
  type TemplateConfig,
} from "./template-config";
import type { RenderMode, TenantContentRecord } from "./types";

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

export type RegistryTenantInfo = {
  companyId?: string;
  companyName?: string;
  logoUrl?: string | null;
  market?: string | null;
  subdomain?: string;
};

export type RegistryPageInfo = {
  canonicalPath?: string;
  pageDisabled: boolean;
  pageKey?: string;
  pageNotSupported: boolean;
  routeSlug?: string | null;
};

export type RegistryLinkComponentProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  children: ReactNode;
  href: string;
  page?: string;
};

export type RegistryLinkComponent = ComponentType<RegistryLinkComponentProps>;

export type RegistrySectionData = {
  config: unknown;
  id: string;
  type: string;
};

function DefaultRegistryLink({
  children,
  href,
  page: _page,
  ...props
}: RegistryLinkComponentProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export type RegistryContextValue = {
  commitContent?: (contentKey: string, value: string) => Promise<void> | void;
  content: TenantContentRecord;
  isDevMode: boolean;
  linkComponent: RegistryLinkComponent;
  mode: RenderMode;
  page: RegistryPageInfo;
  renderMode: RenderMode;
  sections: RegistrySectionData[];
  templateConfig: TemplateConfig;
  templateKey?: string;
  tenant?: RegistryTenantInfo;
  theme: TemplateConfig;
};

const defaultRegistryPageInfo: RegistryPageInfo = {
  pageDisabled: false,
  pageNotSupported: false,
  routeSlug: null,
};

const RegistryContext = createContext<RegistryContextValue>({
  commitContent: undefined,
  linkComponent: DefaultRegistryLink,
  content: {},
  isDevMode: false,
  mode: "live",
  page: defaultRegistryPageInfo,
  renderMode: "live",
  sections: [],
  templateConfig: {},
  theme: {},
});

const namedCssColors: Record<string, string> = {
  amber: "hsl(38 92% 50%)",
  blue: "hsl(221 83% 53%)",
  cyan: "hsl(188 86% 53%)",
  emerald: "hsl(160 84% 39%)",
  fuchsia: "hsl(292 84% 61%)",
  green: "hsl(142 71% 45%)",
  indigo: "hsl(243 75% 59%)",
  lime: "hsl(84 81% 44%)",
  orange: "hsl(18 93% 42%)",
  pink: "hsl(330 81% 60%)",
  purple: "hsl(271 81% 56%)",
  red: "hsl(0 84% 60%)",
  rose: "hsl(346 77% 50%)",
  sky: "hsl(199 89% 48%)",
  taupe: "hsl(30 18% 45%)",
  teal: "hsl(173 80% 40%)",
  violet: "hsl(258 90% 66%)",
  yellow: "hsl(48 96% 53%)",
};

function toCssColor(value: string): string {
  const trimmed = value.trim();
  const named = namedCssColors[trimmed.toLowerCase()];
  if (named) return named;
  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("rgb(") ||
    trimmed.startsWith("rgba(") ||
    trimmed.startsWith("hsl(") ||
    trimmed.startsWith("hsla(") ||
    trimmed.startsWith("lab(") ||
    trimmed.startsWith("var(")
  ) {
    return trimmed;
  }

  return `hsl(${trimmed})`;
}

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
  const requestedColorSystemKey =
    colorSystemKey ?? templateConfig.colorSystem ?? "slate";
  const colorSystem =
    colorSystems[requestedColorSystemKey] ?? colorSystems.slate;
  const stylePresetKey = templateConfig.stylePreset as StylePreset | undefined;
  const stylePreset = stylePresetKey ? stylePresets[stylePresetKey] : undefined;

  // Build CSS vars from the light token set
  const cssVars = useMemo<React.CSSProperties>(() => {
    if (!colorSystem) return {};
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(colorSystem.light)) {
      // Convert camelCase to kebab-case for CSS var names
      const kebab = key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
      vars[`--pk-${kebab}`] = toCssColor(String(value));
    }

    if (templateConfig.accentColor) {
      vars["--pk-primary"] = toCssColor(templateConfig.accentColor);
      vars["--pk-ring"] = toCssColor(templateConfig.accentColor);
    }

    if (templateConfig.backgroundColor) {
      vars["--pk-background"] = toCssColor(templateConfig.backgroundColor);
    }

    if (templateConfig.chartColor) {
      vars["--pk-chart"] = toCssColor(templateConfig.chartColor);
    }

    if (templateConfig.radius) {
      vars["--pk-radius"] = templateConfig.radius;
    }

    const bodyFont = resolveFontStack(templateConfig.fontFamily);
    const headingFont = resolveHeadingFontStack(
      templateConfig.headingFontFamily,
      templateConfig.fontFamily,
    );
    vars["--pk-font-body"] = bodyFont;
    vars["--pk-font-heading"] = headingFont;
    vars.fontFamily = bodyFont;

    return vars as React.CSSProperties;
  }, [
    colorSystem,
    templateConfig.accentColor,
    templateConfig.backgroundColor,
    templateConfig.chartColor,
    templateConfig.fontFamily,
    templateConfig.headingFontFamily,
    templateConfig.radius,
  ]);

  const value = useMemo<WebsiteRuntimeContextValue>(
    () => ({ colorSystem, renderMode, stylePreset, templateConfig }),
    [colorSystem, renderMode, stylePreset, templateConfig],
  );

  return (
    <WebsiteRuntimeContext.Provider value={value}>
      <div
        data-pk-menu-accent={templateConfig.menuAccent}
        data-pk-menu-style={templateConfig.menuStyle}
        data-pk-radius={templateConfig.radius}
        data-pk-style-preset={templateConfig.stylePreset}
        style={cssVars}
      >
        {children}
      </div>
    </WebsiteRuntimeContext.Provider>
  );
}

export type RegistryProviderProps = {
  children: ReactNode;
  colorSystemKey?: string;
  onContentCommit?: (contentKey: string, value: string) => Promise<void> | void;
  content?: TenantContentRecord;
  linkComponent?: RegistryLinkComponent;
  pageInfo?: Partial<RegistryPageInfo>;
  renderMode?: RenderMode;
  sections?: RegistrySectionData[];
  templateConfig?: TemplateConfig;
  templateKey?: string;
  tenant?: RegistryTenantInfo;
};

export function RegistryProvider({
  children,
  colorSystemKey,
  onContentCommit,
  content = {},
  linkComponent = DefaultRegistryLink,
  pageInfo,
  renderMode = "live",
  sections = [],
  templateConfig = {},
  templateKey,
  tenant,
}: RegistryProviderProps) {
  const page = useMemo<RegistryPageInfo>(
    () => ({
      ...defaultRegistryPageInfo,
      ...pageInfo,
    }),
    [pageInfo],
  );

  const value = useMemo<RegistryContextValue>(
    () => ({
      commitContent: onContentCommit,
      content,
      isDevMode: renderMode !== "live",
      linkComponent,
      mode: renderMode,
      page,
      renderMode,
      sections,
      templateConfig,
      templateKey,
      tenant,
      theme: templateConfig,
    }),
    [
      onContentCommit,
      content,
      linkComponent,
      page,
      renderMode,
      sections,
      templateConfig,
      templateKey,
      tenant,
    ],
  );

  return (
    <RegistryContext.Provider value={value}>
      <WebsiteRuntimeProvider
        colorSystemKey={colorSystemKey}
        renderMode={renderMode}
        templateConfig={templateConfig}
      >
        {children}
      </WebsiteRuntimeProvider>
    </RegistryContext.Provider>
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

export function useRegistry(): RegistryContextValue {
  return useContext(RegistryContext);
}

export function useRegistryLinkComponent(): RegistryLinkComponent {
  return useContext(RegistryContext).linkComponent;
}

// Re-export font helpers for convenience
export { resolveFontStack, resolveHeadingFontStack };
