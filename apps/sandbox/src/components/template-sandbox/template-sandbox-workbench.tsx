"use client";

import {
  colorSystems,
  deserializeTemplateConfig,
  getTemplatePageInventoryStrict,
  resolveWebsitePresentation,
  stylePresets,
  type TenantContentRecord,
  type TenantThemeRecord,
  templateCatalog,
} from "@plotkeys/section-registry";
import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { Separator } from "@plotkeys/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@plotkeys/ui/tooltip";
import { buildTemplateSandboxUrl, templateTierLabels } from "@plotkeys/utils";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SandboxPreviewPanel } from "@/components/sandbox-preview-panel";
import { useTRPC } from "@/trpc/client";
import {
  FloatingConfigRail,
  FloatingConfigRailMenuButton,
} from "./floating-config-rail";
import { FloatingConfigSelectField } from "./floating-config-select-field";
import { FloatingConfigToggleField } from "./floating-config-toggle-field";
import { FloatingTemplateSelectField } from "./floating-template-select-field";

type SandboxProfile = {
  companyName: string;
  contentJson: Record<string, unknown>;
  id: string;
  market: string | null;
  name: string;
  planTier: "starter" | "plus" | "pro";
  profileJson: Record<string, unknown>;
  sampleDataJson: Record<string, unknown>;
  shareId: string;
  subdomainLabel: string | null;
  templateKey: string;
  themeJson: Record<string, unknown>;
};

type Props = {
  pageKey?: string;
  previewPath?: string;
  profile: SandboxProfile;
};

const fontOptions = [
  "Inter",
  "Geist",
  "Noto Sans",
  "Raleway",
  "DM Sans",
  "Public Sans",
  "Outfit",
  "Manrope",
  "Space Grotesk",
  "Montserrat",
  "IBM Plex Sans",
] as const;
const fontOptionDescriptions: Record<(typeof fontOptions)[number], string> = {
  "DM Sans": "Soft geometric",
  Geist: "Crisp product UI",
  "IBM Plex Sans": "Structured editorial",
  Inter: "Neutral interface",
  Manrope: "Rounded modern",
  Montserrat: "Wide display",
  "Noto Sans": "International coverage",
  Outfit: "Clean display",
  "Public Sans": "Government-grade clarity",
  Raleway: "Elegant headings",
  "Space Grotesk": "Technical character",
};
const accentOptions = [
  {
    description: "Rubbait hero accent",
    label: "Rubbait Brown",
    value: "#522C1F",
  },
  {
    description: "Warm secondary accent",
    label: "Rubbait Taupe",
    value: "#907762",
  },
  { description: "Energetic CTA color", label: "Orange", value: "orange" },
  { description: "Quiet warm neutral", label: "Taupe", value: "taupe" },
  { description: "Gold warmth", label: "Amber", value: "amber" },
  { description: "Trust and utility", label: "Blue", value: "blue" },
  { description: "Fresh cool accent", label: "Cyan", value: "cyan" },
  { description: "Growth and delivery", label: "Emerald", value: "emerald" },
  { description: "Expressive accent", label: "Fuchsia", value: "fuchsia" },
  { description: "Natural accent", label: "Green", value: "green" },
  { description: "Deep digital tone", label: "Indigo", value: "indigo" },
  { description: "Sharp bright accent", label: "Lime", value: "lime" },
  { description: "Warm lifestyle accent", label: "Pink", value: "pink" },
  { description: "Premium creative tone", label: "Purple", value: "purple" },
  { description: "High urgency accent", label: "Red", value: "red" },
  { description: "Soft warm accent", label: "Rose", value: "rose" },
  { description: "Airy blue accent", label: "Sky", value: "sky" },
  { description: "Balanced calm accent", label: "Teal", value: "teal" },
  { description: "Modern violet tone", label: "Violet", value: "violet" },
  { description: "Bright highlight", label: "Yellow", value: "yellow" },
] as const;
const radiusOptions = ["none", "sm", "md", "lg", "xl", "full"] as const;
const menuStyleOptions = [
  {
    description: "Glass pill over media",
    label: "Default / Translucent",
    value: "default-translucent",
  },
  {
    description: "Solid card-style pills",
    label: "Default / Solid",
    value: "default-solid",
  },
  { description: "Text-first navigation", label: "Minimal", value: "minimal" },
  { description: "Outlined menu pills", label: "Bordered", value: "bordered" },
] as const;
const menuAccentOptions = [
  {
    description: "Market pill uses accent text",
    label: "Subtle",
    value: "subtle",
  },
  {
    description: "Market pill uses accent fill",
    label: "Strong",
    value: "strong",
  },
  { description: "No accent emphasis", label: "None", value: "none" },
] as const;
const stylePresetOptions = Object.values(stylePresets).map((preset) => ({
  description: `${preset.density} density - ${preset.spacing.sectionY}`,
  label: preset.name,
  value: preset.key,
}));
const templateOptions = templateCatalog.map((template) => ({
  description: [templateTierLabels[template.tier], template.marketingTagline]
    .filter(Boolean)
    .join(" - "),
  label: template.name,
  value: template.key,
}));
const shuffleOptions = {
  accentColor: [
    "#522C1F",
    "#907762",
    "orange",
    "taupe",
    "amber",
    "blue",
    "emerald",
    "indigo",
    "rose",
    "teal",
  ],
  colorSystem: [
    "rubbait",
    "neutral",
    "stone",
    "zinc",
    "mauve",
    "olive",
    "mist",
    "taupe",
    "slate",
  ],
  fontFamily: ["Inter", "Geist", "Raleway", "DM Sans", "Manrope", "Outfit"],
  headingFontFamily: [
    "Raleway",
    "Geist",
    "Outfit",
    "Space Grotesk",
    "Montserrat",
  ],
  menuAccent: ["subtle", "strong", "none"],
  menuStyle: ["default-translucent", "default-solid", "minimal", "bordered"],
  radius: ["none", "sm", "md", "lg", "xl"],
  stylePreset: ["vega", "nova", "maia", "lyra", "mira", "luma", "sera", "rhea"],
} as const;

function pickShuffleValue<const T extends readonly [string, ...string[]]>(
  values: T,
) {
  return values[Math.floor(Math.random() * values.length)] ?? values[0];
}

function toStringRecord(
  value: Record<string, unknown>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      typeof item === "string" ? item : String(item ?? ""),
    ]),
  );
}

function toArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item),
      )
    : [];
}

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function sandboxListings(sampleData: Record<string, unknown>) {
  return toArray(sampleData.listings).map((item, index) => ({
    id: asText(item.id, `listing-${index + 1}`),
    imageUrl: asText(item.imageUrl) || null,
    location: asText(item.location, "Sandbox market"),
    price: asText(item.price),
    slug: asText(item.slug, `listing-${index + 1}`),
    specs: asText(item.specs),
    title: asText(item.title, `Listing ${index + 1}`),
  }));
}

function sandboxAgents(sampleData: Record<string, unknown>) {
  return toArray(sampleData.agents).map((item, index) => ({
    bio: asText(item.bio),
    id: asText(item.id, `agent-${index + 1}`),
    imageUrl: asText(item.imageUrl) || asText(item.photoUrl) || null,
    name: asText(item.name, `Agent ${index + 1}`),
    slug: asText(item.slug, `agent-${index + 1}`),
    title: asText(item.title) || asText(item.role),
  }));
}

function sandboxBlogPosts(sampleData: Record<string, unknown>) {
  return toArray(sampleData.blogPosts).map((item, index) => ({
    content: asText(item.content),
    excerpt: asText(item.excerpt),
    featuredImageUrl: asText(item.featuredImageUrl) || null,
    id: asText(item.id, `post-${index + 1}`),
    publishedAt: asText(item.publishedAt),
    slug: asText(item.slug, `post-${index + 1}`),
    title: asText(item.title, `Post ${index + 1}`),
  }));
}

function formatConfigLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderedRiwaqSectionTypes(pageKey: string) {
  switch (pageKey) {
    case "blog":
      return ["hero_banner", "blog_list", "cta_band"];
    case "contact":
      return ["hero_banner", "contact_section", "cta_band"];
    case "roadmap":
      return ["hero_banner", "riwaq_roadmap_timeline", "cta_band"];
    case "home":
      return [
        "hero_banner",
        "market_stats",
        "story_grid",
        "riwaq_roadmap_timeline",
        "contact_section",
        "cta_band",
      ];
    default:
      return null;
  }
}

export function TemplateSandboxWorkbench({
  pageKey,
  previewPath,
  profile,
}: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const updateContentFieldMutation = useMutation(
    trpc.templateSandbox.updateContentField.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );
  const updateThemeFieldMutation = useMutation(
    trpc.templateSandbox.updateThemeField.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );
  const generateLiveWebsiteMutation = useMutation(
    trpc.templateSandbox.generateLiveWebsite.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );
  const inventory = getTemplatePageInventoryStrict(profile.templateKey);
  const availablePages = inventory.pages.map((page) => ({
    label: page.label,
    pageKey: page.pageKey,
    slug: page.slug,
  }));
  const resolvedPageKey =
    pageKey ??
    (() => {
      if (!previewPath || previewPath === "/") return "home";
      return (
        inventory.pages.find((page) => page.slug === previewPath)?.pageKey ??
        "home"
      );
    })();
  const selectedPage =
    availablePages.find((page) => page.pageKey === resolvedPageKey) ??
    availablePages[0];
  const selectedPageKey = selectedPage?.pageKey ?? "home";
  const selectedPageLabel = selectedPage?.label ?? "Home";
  const selectedPageSlug = selectedPage?.slug ?? "/";
  const content = toStringRecord(profile.contentJson) as TenantContentRecord;
  const persistedTheme = toStringRecord(profile.themeJson) as TenantThemeRecord;
  const [draftTheme, setDraftTheme] =
    useState<TenantThemeRecord>(persistedTheme);
  const rawTheme = draftTheme;
  const sampleData = profile.sampleDataJson ?? {};

  useEffect(() => {
    setDraftTheme(persistedTheme);
  }, [profile.id, profile.themeJson]);

  function handleDraftThemeValueChange(name: string, value: string) {
    setDraftTheme((currentTheme) => ({
      ...currentTheme,
      [name]: value,
    }));
  }

  async function handleSandboxContentUpdate(formData: FormData) {
    await updateContentFieldMutation.mutateAsync({
      contentKey: String(formData.get("contentKey") ?? ""),
      profileId: String(formData.get("profileId") ?? formData.get("configId")),
      value: String(formData.get("value") ?? ""),
    });
  }

  async function handleSandboxSmartFill(formData: FormData) {
    const contentKey = String(formData.get("contentKey") ?? "");
    const label = String(formData.get("shortDetail") ?? contentKey)
      .replace(/\./g, " ")
      .trim();

    await updateContentFieldMutation.mutateAsync({
      contentKey,
      profileId: String(formData.get("profileId") ?? formData.get("configId")),
      value: `Sandbox ${label || "content"} for rapid template testing.`,
    });
  }

  async function handleShuffleStyle() {
    const accentColor = pickShuffleValue(shuffleOptions.accentColor);
    const updates = {
      accentColor,
      chartColor: accentColor,
      colorSystem: pickShuffleValue(shuffleOptions.colorSystem),
      fontFamily: pickShuffleValue(shuffleOptions.fontFamily),
      headingFontFamily: pickShuffleValue(shuffleOptions.headingFontFamily),
      menuAccent: pickShuffleValue(shuffleOptions.menuAccent),
      menuStyle: pickShuffleValue(shuffleOptions.menuStyle),
      radius: pickShuffleValue(shuffleOptions.radius),
      stylePreset: pickShuffleValue(shuffleOptions.stylePreset),
    };

    setDraftTheme((currentTheme) => ({ ...currentTheme, ...updates }));
    await Promise.all(
      Object.entries(updates).map(([themeKey, value]) =>
        updateThemeFieldMutation.mutateAsync({
          profileId: profile.id,
          themeKey,
          value,
        }),
      ),
    );
  }

  async function handleOpenLiveWebsite() {
    const liveWindow = window.open("about:blank", "_blank", "noreferrer");

    try {
      const liveProfile = await generateLiveWebsiteMutation.mutateAsync({
        profileId: profile.id,
      });
      const liveUrl = new URL(
        buildTemplateSandboxUrl(liveProfile.shareId, {
          currentOrigin: window.location.origin,
          pathname: selectedPageSlug,
        }),
      );
      liveUrl.searchParams.set("mode", "live");

      if (liveWindow) {
        liveWindow.location.href = liveUrl.toString();
      } else {
        window.open(liveUrl.toString(), "_blank", "noreferrer");
      }
    } catch (error) {
      liveWindow?.close();
      throw error;
    }
  }

  const preview = resolveWebsitePresentation({
    companyName: profile.companyName,
    content,
    liveAgents: sandboxAgents(sampleData),
    liveBlogPosts: sandboxBlogPosts(sampleData),
    liveListings: sandboxListings(sampleData),
    market: profile.market ?? profile.companyName,
    pageKey: selectedPageKey,
    renderMode: "draft",
    subdomain: profile.subdomainLabel ?? "sandbox",
    templateKey: profile.templateKey,
    theme: rawTheme,
  });
  const resolvedTheme = toStringRecord(
    preview.theme as unknown as Record<string, unknown>,
  ) as TenantThemeRecord;
  const templateConfig = deserializeTemplateConfig(resolvedTheme);
  const sectionTypes = Array.from(
    new Set(
      preview.page.sections.map(
        ({ component: _component, ...rest }) => rest.type,
      ),
    ),
  );
  const renderedSectionTypes =
    profile.templateKey === "riwaq-starter"
      ? (renderedRiwaqSectionTypes(selectedPageKey) ?? sectionTypes)
      : sectionTypes;
  const templateConfigExportUrl = `data:application/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(
      {
        page: {
          key: selectedPageKey,
          slug: selectedPageSlug,
        },
        renderedSections: renderedSectionTypes,
        templateKey: profile.templateKey,
        theme: templateConfig,
      },
      null,
      2,
    ),
  )}`;
  const templateConfigFilename = `template-config-${selectedPageKey}.json`;

  return (
    <div className="relative h-svh min-h-0 overflow-hidden bg-background">
      <Button
        asChild
        className="absolute left-3 top-3 z-50 shadow-sm"
        size="sm"
        variant="secondary"
      >
        <Link href="/">Profiles</Link>
      </Button>
      <SandboxPreviewPanel
        availablePages={availablePages}
        companyName={profile.companyName}
        companySlug={profile.subdomainLabel ?? "sandbox"}
        configId={profile.id}
        defaultContent={content}
        editableFields={preview.editableFields}
        pageKey={selectedPageKey}
        pageLabel={selectedPageLabel}
        pageSlug={selectedPageSlug}
        sections={preview.page.sections.map(
          ({ component: _component, ...rest }) => rest,
        )}
        templateKey={profile.templateKey}
        templateConfig={templateConfig}
        theme={resolvedTheme}
        visibleSections={templateConfig.visibleSections}
        onSmartFill={handleSandboxSmartFill}
        onUpdateField={handleSandboxContentUpdate}
      />

      <FloatingConfigRail>
        <div className="flex h-14 shrink-0 items-center px-2">
          <FloatingConfigRailMenuButton />
        </div>

        <Separator className="bg-border" />

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
          onWheel={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-2 p-2 group-data-[state=expanded]/config:gap-4">
            <section className="flex min-w-0 flex-col gap-2">
              <div className="hidden group-data-[state=expanded]/config:block">
                <h2 className="text-xs font-medium text-muted-foreground">
                  Template
                </h2>
              </div>
              <FloatingTemplateSelectField
                options={templateOptions}
                profileId={profile.id}
                value={profile.templateKey}
              />
            </section>

            <Separator className="hidden bg-border group-data-[state=expanded]/config:block" />

            <section className="flex min-w-0 flex-col gap-2">
              <div className="hidden group-data-[state=expanded]/config:block">
                <h2 className="text-xs font-medium text-muted-foreground">
                  Style
                </h2>
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <FloatingConfigSelectField
                  icon="style"
                  label="Style"
                  name="stylePreset"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={stylePresetOptions}
                  profileId={profile.id}
                  value={templateConfig.stylePreset}
                />
                <FloatingConfigSelectField
                  icon="base-color"
                  label="Base Color"
                  name="colorSystem"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={Object.entries(colorSystems).map(
                    ([key, system]) => ({
                      description: "Base background and neutral tokens",
                      label: system.name,
                      swatchAccentColor: system.light.primary,
                      swatchColor: system.light.background,
                      value: key,
                    }),
                  )}
                  profileId={profile.id}
                  value={templateConfig.colorSystem}
                />
                <FloatingConfigSelectField
                  icon="theme"
                  label="Theme"
                  name="accentColor"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={accentOptions}
                  profileId={profile.id}
                  value={templateConfig.accentColor}
                />
                <FloatingConfigSelectField
                  icon="theme"
                  label="Chart Color"
                  name="chartColor"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={accentOptions}
                  profileId={profile.id}
                  value={templateConfig.chartColor}
                />
                <Separator className="hidden bg-border group-data-[state=expanded]/config:block" />
                <FloatingConfigSelectField
                  icon="type"
                  label="Heading"
                  name="headingFontFamily"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={fontOptions.map((font) => ({
                    description: fontOptionDescriptions[font],
                    label: font,
                    value: font,
                  }))}
                  profileId={profile.id}
                  value={templateConfig.headingFontFamily}
                />
                <FloatingConfigSelectField
                  icon="type"
                  label="Font"
                  name="fontFamily"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={fontOptions.map((font) => ({
                    description: fontOptionDescriptions[font],
                    label: font,
                    value: font,
                  }))}
                  profileId={profile.id}
                  value={templateConfig.fontFamily}
                />
                <Separator className="hidden bg-border group-data-[state=expanded]/config:block" />
                <FloatingConfigSelectField
                  icon="radius"
                  label="Radius"
                  name="radius"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={radiusOptions.map((radius) => ({
                    description:
                      radius === "none"
                        ? "Sharp editorial edges"
                        : radius === "full"
                          ? "Fully rounded pills"
                          : `${formatConfigLabel(radius)} corner system`,
                    label: formatConfigLabel(radius),
                    value: radius,
                  }))}
                  profileId={profile.id}
                  value={templateConfig.radius}
                />
                <FloatingConfigSelectField
                  icon="menu"
                  label="Menu"
                  name="menuStyle"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={menuStyleOptions}
                  profileId={profile.id}
                  value={templateConfig.menuStyle}
                />
                <FloatingConfigSelectField
                  icon="sliders"
                  label="Menu Accent"
                  name="menuAccent"
                  onDraftValueChange={handleDraftThemeValueChange}
                  options={menuAccentOptions}
                  profileId={profile.id}
                  value={templateConfig.menuAccent}
                />
              </div>
            </section>

            <Separator className="hidden bg-border group-data-[state=expanded]/config:block" />

            <section className="flex min-w-0 flex-col gap-2">
              <div className="hidden group-data-[state=expanded]/config:block">
                <h2 className="text-xs font-medium text-muted-foreground">
                  Sections
                </h2>
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                {renderedSectionTypes.map((sectionType) => (
                  <FloatingConfigToggleField
                    checked={
                      templateConfig.visibleSections?.[sectionType] !== false
                    }
                    key={sectionType}
                    label={formatConfigLabel(sectionType)}
                    name={`sectionVisible.${sectionType}`}
                    onDraftValueChange={handleDraftThemeValueChange}
                    profileId={profile.id}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="flex shrink-0 flex-col gap-1.5 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Shuffle style"
                variant="outline"
                className="h-9 w-full justify-center gap-2 px-2 group-data-[state=expanded]/config:justify-start"
                disabled={updateThemeFieldMutation.isPending}
                onClick={handleShuffleStyle}
                size="sm"
                type="button"
              >
                <Icon.Shuffle className="size-4 shrink-0" />
                <span className="hidden truncate group-data-[state=expanded]/config:inline">
                  Shuffle
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Shuffle style</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Open live website"
                className="h-9 w-full justify-center gap-2 px-2 group-data-[state=expanded]/config:justify-start"
                disabled={generateLiveWebsiteMutation.isPending}
                onClick={handleOpenLiveWebsite}
                size="sm"
                type="button"
              >
                <Icon.Globe className="size-4 shrink-0" />
                <span className="hidden truncate group-data-[state=expanded]/config:inline">
                  Live Website
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Live Website</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                aria-label="Get code"
                variant="outline"
                className="h-9 justify-center gap-2 px-2 group-data-[state=expanded]/config:justify-start"
                size="sm"
              >
                <a
                  download={templateConfigFilename}
                  href={templateConfigExportUrl}
                >
                  <Icon.Code className="size-4 shrink-0" />
                  <span className="hidden truncate group-data-[state=expanded]/config:inline">
                    Get Code
                  </span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Get Code</TooltipContent>
          </Tooltip>
        </div>
      </FloatingConfigRail>
    </div>
  );
}
