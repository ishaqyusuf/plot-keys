"use client";

import {
  colorSystems,
  getTemplatePageInventory,
  stylePresets,
  type TemplateConfig,
  templateCatalog,
} from "@plotkeys/section-registry";
import { Avatar, AvatarFallback } from "@plotkeys/ui/avatar";
import { Badge } from "@plotkeys/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Switch } from "@plotkeys/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@plotkeys/ui/tabs";
import {
  describeTemplateAccess,
  type SubscriptionTier,
  tierLabels,
} from "@plotkeys/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { forwardRef, useRef, useState, useTransition } from "react";

import { useTRPC } from "../../trpc/client";

type TemplateGroup = "starter" | "plus" | "pro";

type BuilderSidebarControlsProps = {
  configId: string;
  currentPageKey: string;
  currentTemplateKey: string;
  licensedTemplateKeys: Set<string>;
  planTier: SubscriptionTier;
  readOnly?: boolean;
  readOnlyMessage?: string;
  requiredPlan?: SubscriptionTier;
  /** Section types present in the current template page inventory. */
  sectionTypes?: string[];
  templateConfig: TemplateConfig;
  onCreateDraft: (formData: FormData) => Promise<{ configId: string }>;
  onUpdateTheme: (formData: FormData) => Promise<void>;
  onUpdateThemeSilent?: (formData: FormData) => Promise<void>;
};

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const PickerButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    children: React.ReactNode;
    label: string;
  }
>(function PickerButton(
  { children, className, label, type = "button", ...props },
  ref,
) {
  return (
    <button
      className={[
        "relative w-full rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      ref={ref}
      type={type}
      {...props}
    >
      <span className="block text-xs text-muted-foreground">{label}</span>
      <span className="mt-0.5 block pr-7 text-sm font-medium text-foreground">
        {children}
      </span>
      <ChevronIcon />
    </button>
  );
});

// ---------------------------------------------------------------------------
// Style Preset Picker
// ---------------------------------------------------------------------------

const presetEntries = Object.values(stylePresets);

function StylePresetMenu({
  configId,
  disabled = false,
  onSave,
  onSaveSilent,
  value,
}: {
  configId: string;
  disabled?: boolean;
  onSave: (formData: FormData) => Promise<void>;
  onSaveSilent?: (formData: FormData) => Promise<void>;
  value: string;
}) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [, startTransition] = useTransition();

  function handleChange(preset: string) {
    if (disabled) return;
    setOptimisticValue(preset);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("themeKey", "stylePreset");
      fd.set("value", preset);
      if (onSaveSilent) {
        await onSaveSilent(fd);
      } else {
        await onSave(fd);
      }
    });
  }

  const current = stylePresets[optimisticValue as keyof typeof stylePresets];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PickerButton disabled={disabled} label="Style preset">
          {current?.name ?? optimisticValue ?? "Default"}
        </PickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
        side="right"
      >
        <DropdownMenuRadioGroup
          onValueChange={handleChange}
          value={optimisticValue}
        >
          <DropdownMenuGroup>
            {presetEntries.map((preset) => (
              <DropdownMenuRadioItem
                className="items-start rounded-md py-2 pr-8"
                key={preset.key}
                value={preset.key}
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{preset.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {preset.density} · {preset.radius.card}
                  </p>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Color System Picker
// ---------------------------------------------------------------------------

const colorSystemEntries = Object.entries(colorSystems);

function ColorSystemMenu({
  configId,
  disabled = false,
  onSave,
  onSaveSilent,
  value,
}: {
  configId: string;
  disabled?: boolean;
  onSave: (formData: FormData) => Promise<void>;
  onSaveSilent?: (formData: FormData) => Promise<void>;
  value: string;
}) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [, startTransition] = useTransition();

  function handleChange(system: string) {
    if (disabled) return;
    setOptimisticValue(system);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("themeKey", "colorSystem");
      fd.set("value", system);
      if (onSaveSilent) {
        await onSaveSilent(fd);
      } else {
        await onSave(fd);
      }
    });
  }

  const current = colorSystems[optimisticValue];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PickerButton disabled={disabled} label="Color system">
          <span className="flex items-center gap-2">
            {current && (
              <>
                <span
                  className="inline-block size-3 rounded-full border border-border/50"
                  style={{
                    backgroundColor: `hsl(${current.light.primary})`,
                  }}
                />
                <span
                  className="inline-block size-3 rounded-full border border-border/50"
                  style={{
                    backgroundColor: `hsl(${current.light.background})`,
                  }}
                />
              </>
            )}
            {current?.name ?? optimisticValue ?? "Default"}
          </span>
        </PickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-72 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
        side="right"
      >
        <DropdownMenuRadioGroup
          onValueChange={handleChange}
          value={optimisticValue}
        >
          <DropdownMenuGroup>
            {colorSystemEntries.map(([key, system]) => (
              <DropdownMenuRadioItem
                className="items-start rounded-md py-2 pr-8"
                key={key}
                value={key}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex shrink-0 gap-0.5">
                    <span
                      className="size-3 rounded-l-full border border-border/50"
                      style={{
                        backgroundColor: `hsl(${system.light.primary})`,
                      }}
                    />
                    <span
                      className="size-3 rounded-r-full border border-border/50"
                      style={{
                        backgroundColor: `hsl(${system.light.background})`,
                      }}
                    />
                  </div>
                  <p className="font-medium text-foreground">{system.name}</p>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Font Picker
// ---------------------------------------------------------------------------

const fontOptions: { fonts: string[]; label: string }[] = [
  {
    label: "Sans-serif",
    fonts: [
      "Inter",
      "Geist",
      "DM Sans",
      "Figtree",
      "Manrope",
      "Nunito Sans",
      "Outfit",
      "Public Sans",
      "Raleway",
      "Roboto",
    ],
  },
  {
    label: "Serif",
    fonts: [
      "Playfair Display",
      "Lora",
      "Merriweather",
      "Noto Serif",
      "Fraunces",
      "Georgia",
    ],
  },
  {
    label: "Mono",
    fonts: ["Geist Mono", "JetBrains Mono"],
  },
];

function FontMenu({
  configId,
  disabled = false,
  label,
  onSave,
  onSaveSilent,
  themeKey,
  value,
}: {
  configId: string;
  disabled?: boolean;
  label: string;
  onSave: (formData: FormData) => Promise<void>;
  onSaveSilent?: (formData: FormData) => Promise<void>;
  themeKey: string;
  value: string;
}) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [, startTransition] = useTransition();

  function handleChange(font: string) {
    if (disabled) return;
    setOptimisticValue(font);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("themeKey", themeKey);
      fd.set("value", font);
      if (onSaveSilent) {
        await onSaveSilent(fd);
      } else {
        await onSave(fd);
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PickerButton disabled={disabled} label={label}>
          {optimisticValue || "Default"}
        </PickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-72 w-56 overflow-y-auto rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
        side="right"
      >
        <DropdownMenuRadioGroup
          onValueChange={handleChange}
          value={optimisticValue}
        >
          {fontOptions.map((group, i) => (
            <div key={group.label}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1 text-xs text-muted-foreground">
                  {group.label}
                </DropdownMenuLabel>
                {group.fonts.map((font) => (
                  <DropdownMenuRadioItem
                    className="rounded-md py-1.5 pr-8"
                    key={font}
                    value={font}
                  >
                    {font}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuGroup>
              {i < fontOptions.length - 1 && <DropdownMenuSeparator />}
            </div>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Template Picker
// ---------------------------------------------------------------------------

function TemplatePicker({
  configId,
  currentTemplateKey,
  licensedTemplateKeys,
  onCreateDraft,
  planTier,
}: {
  configId: string;
  currentTemplateKey: string;
  licensedTemplateKeys: Set<string>;
  onCreateDraft: (formData: FormData) => Promise<{ configId: string }>;
  planTier: SubscriptionTier;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const { data: catalogData } = useQuery(
    trpc.workspace.getTemplateCatalog.queryOptions(),
  );
  const usageMap = new Map(
    catalogData?.map((t) => [t.key, t.usageCount]) ?? [],
  );
  const currentTemplate = templateCatalog.find(
    (t) => t.key === currentTemplateKey,
  );
  const [group, setGroup] = useState<TemplateGroup>(
    (currentTemplate?.tier as TemplateGroup) ?? "starter",
  );
  const [, startTransition] = useTransition();

  function handleSelectTemplate(templateKey: string) {
    if (templateKey === currentTemplateKey) {
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("templateKey", templateKey);
      const result = await onCreateDraft(fd);
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("configId", result.configId);
      nextParams.set("page", "home");
      router.replace(`/builder?${nextParams.toString()}`);
      router.refresh();
    });
  }

  const groupTemplates = templateCatalog.filter((t) => t.tier === group);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative w-full rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          type="button"
        >
          <span className="block text-xs text-muted-foreground">Template</span>
          <span className="mt-0.5 block pr-9 text-sm font-medium text-foreground">
            {currentTemplate?.name ?? currentTemplateKey}
          </span>
          <Badge className="mt-1.5" variant="outline">
            {currentTemplate?.tier ?? "starter"}
          </Badge>
          <ChevronIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-72 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
        side="right"
      >
        <Tabs
          className="flex flex-col gap-2"
          onValueChange={(v) => setGroup(v as TemplateGroup)}
          value={group}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="starter">Starter</TabsTrigger>
            <TabsTrigger value="plus">Plus</TabsTrigger>
            <TabsTrigger value="pro">Pro</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-0" value={group}>
            <DropdownMenuRadioGroup
              onValueChange={handleSelectTemplate}
              value={currentTemplateKey}
            >
              <DropdownMenuGroup>
                {groupTemplates.map((template) => {
                  const templateAccess = describeTemplateAccess(
                    planTier,
                    template.tier,
                  );
                  const isLocked =
                    !licensedTemplateKeys.has(template.key) &&
                    !templateAccess.allowed;

                  return (
                    <DropdownMenuRadioItem
                      className="items-start rounded-md py-2 pr-8"
                      disabled={isLocked}
                      key={template.key}
                      value={template.key}
                    >
                      <div className="flex min-w-0 items-start gap-2.5">
                        <Avatar className="rounded-md" size="sm">
                          <AvatarFallback className="rounded-md bg-muted text-[10px] font-medium">
                            {template.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <span className="truncate font-medium text-foreground">
                            {template.name}
                          </span>
                          {template.marketingTagline && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {template.marketingTagline}
                            </p>
                          )}
                          {(() => {
                            const count = usageMap.get(template.key) ?? 0;
                            return count > 0 ? (
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {count} using
                              </p>
                            ) : null;
                          })()}
                          <div className="mt-1 flex items-center gap-2">
                            <Badge className="capitalize" variant="outline">
                              {template.tier}
                            </Badge>
                            {isLocked ? (
                              <span className="text-[11px] text-amber-700 dark:text-amber-300">
                                Upgrade to{" "}
                                {tierLabels[templateAccess.requiredTier]}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuRadioGroup>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PagePicker({
  currentPageKey,
  currentTemplateKey,
}: {
  currentPageKey: string;
  currentTemplateKey: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = getTemplatePageInventory(currentTemplateKey).pages;
  const currentPage =
    pages.find((page) => page.pageKey === currentPageKey) ?? pages[0];

  function handleSelectPage(pageKey: string) {
    if (pageKey === currentPage?.pageKey) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", pageKey);
    router.replace(`/builder?${nextParams.toString()}`);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PickerButton label="Page">
          {currentPage?.label ?? currentPage?.pageKey ?? "Home"}
        </PickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-72 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
        side="right"
      >
        <DropdownMenuRadioGroup
          onValueChange={handleSelectPage}
          value={currentPage?.pageKey ?? "home"}
        >
          <DropdownMenuGroup>
            {pages.map((page) => (
              <DropdownMenuRadioItem
                className="items-start rounded-md py-2 pr-8"
                key={page.pageKey}
                value={page.pageKey}
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{page.label}</p>
                  <p className="text-xs text-muted-foreground">{page.slug}</p>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Image Slots
// ---------------------------------------------------------------------------

function ImageSlotsSection({
  configId,
  disabled = false,
  namedImageSlots,
  namedImages,
  onSave,
}: {
  configId: string;
  disabled?: boolean;
  namedImageSlots: Record<string, string>;
  namedImages?: Record<string, string>;
  onSave: (formData: FormData) => Promise<void>;
}) {
  const slots = Object.keys(namedImageSlots);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      slots.map((slot) => [
        slot,
        namedImages?.[slot] ?? namedImageSlots[slot] ?? "",
      ]),
    ),
  );
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(slot: string, url: string) {
    if (disabled) return;
    setValues((prev) => ({ ...prev, [slot]: url }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const fd = new FormData();
        fd.set("configId", configId);
        fd.set("themeKey", `namedImage.${slot}`);
        fd.set("value", url.trim());
        await onSave(fd);
      });
    }, 600);
  }

  if (slots.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Images
      </p>
      {slots.map((slot) => (
        <div key={slot}>
          <FieldLabel className="text-xs capitalize text-muted-foreground">
            {slot.replace(/([A-Z])/g, " $1").trim()}
          </FieldLabel>
          <Input
            className="mt-0.5 text-xs"
            disabled={disabled}
            placeholder="Paste image URL…"
            value={values[slot] ?? ""}
            onChange={(e) => handleChange(slot, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Visibility Toggles
// ---------------------------------------------------------------------------

const sectionLabels: Record<string, string> = {
  hero_banner: "Hero banner",
  market_stats: "Market stats",
  story_grid: "Story grid",
  listing_spotlight: "Listings spotlight",
  testimonial_strip: "Testimonials",
  cta_band: "CTA band",
  agent_showcase: "Agent showcase",
  property_grid: "Property grid",
  contact_section: "Contact",
  faq_accordion: "FAQ",
  newsletter: "Newsletter",
  hero_search: "Hero search",
  why_choose_us: "Why choose us",
  service_highlights: "Service highlights",
};

function SectionVisibilityToggles({
  configId,
  disabled = false,
  onSave,
  sectionTypes,
  visibleSections,
}: {
  configId: string;
  disabled?: boolean;
  onSave: (formData: FormData) => Promise<void>;
  sectionTypes: string[];
  visibleSections?: Record<string, boolean>;
}) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const type of sectionTypes) {
      initial[type] = visibleSections?.[type] !== false;
    }
    return initial;
  });
  const [, startTransition] = useTransition();

  function handleToggle(type: string, checked: boolean) {
    if (disabled) return;
    setVisibility((prev) => ({ ...prev, [type]: checked }));
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("themeKey", `sectionVisible.${type}`);
      fd.set("value", String(checked));
      await onSave(fd);
    });
  }

  if (sectionTypes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Sections
      </p>
      {sectionTypes.map((type) => (
        <div key={type} className="flex items-center justify-between gap-2">
          <span className="text-xs text-foreground">
            {sectionLabels[type] ?? type}
          </span>
          <Switch
            checked={visibility[type] !== false}
            disabled={disabled}
            size="sm"
            onCheckedChange={(checked) => handleToggle(type, checked)}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SEO Section
// ---------------------------------------------------------------------------

function SeoSection({
  configId,
  disabled = false,
  onSave,
  pageKey,
  seoValues,
}: {
  configId: string;
  disabled?: boolean;
  onSave: (formData: FormData) => Promise<void>;
  pageKey: string;
  seoValues?: { title?: string; description?: string; ogImage?: string };
}) {
  const [values, setValues] = useState({
    title: seoValues?.title ?? "",
    description: seoValues?.description ?? "",
    ogImage: seoValues?.ogImage ?? "",
  });
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(
    field: "title" | "description" | "ogImage",
    value: string,
  ) {
    if (disabled) return;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const fd = new FormData();
        fd.set("configId", configId);
        fd.set("themeKey", `seo.${pageKey}.${field}`);
        fd.set("value", value.trim());
        await onSave(fd);
      });
    }, 600);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        SEO
      </p>
      <div>
        <FieldLabel className="text-xs text-muted-foreground">
          Page title
        </FieldLabel>
        <Input
          className="mt-0.5 text-xs"
          disabled={disabled}
          placeholder="Override page title…"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>
      <div>
        <FieldLabel className="text-xs text-muted-foreground">
          Meta description
        </FieldLabel>
        <textarea
          className="mt-0.5 w-full resize-none rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          placeholder="Describe this page for search engines…"
          rows={3}
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      <div>
        <FieldLabel className="text-xs text-muted-foreground">
          OG image URL
        </FieldLabel>
        <Input
          className="mt-0.5 text-xs"
          disabled={disabled}
          placeholder="Paste image URL for social sharing…"
          value={values.ogImage}
          onChange={(e) => handleChange("ogImage", e.target.value)}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function BuilderSidebarControls({
  configId,
  currentPageKey,
  currentTemplateKey,
  licensedTemplateKeys,
  planTier,
  readOnly = false,
  readOnlyMessage,
  requiredPlan,
  sectionTypes,
  templateConfig,
  onCreateDraft,
  onUpdateTheme,
  onUpdateThemeSilent,
}: BuilderSidebarControlsProps) {
  const currentTemplate = templateCatalog.find(
    (t) => t.key === currentTemplateKey,
  );
  const namedImageSlots = currentTemplate?.namedImageSlots ?? {};

  return (
    <FieldGroup className="flex flex-col gap-2">
      <Field>
        <TemplatePicker
          configId={configId}
          currentTemplateKey={currentTemplateKey}
          licensedTemplateKeys={licensedTemplateKeys}
          onCreateDraft={onCreateDraft}
          planTier={planTier}
        />
      </Field>

      <Field>
        <PagePicker
          currentPageKey={currentPageKey}
          currentTemplateKey={currentTemplateKey}
        />
      </Field>

      {readOnly ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-foreground">
          {readOnlyMessage ??
            `Upgrade to the ${tierLabels[requiredPlan ?? planTier]} plan to edit this template.`}
        </p>
      ) : null}

      <Field>
        <StylePresetMenu
          configId={configId}
          disabled={readOnly}
          onSave={onUpdateTheme}
          onSaveSilent={onUpdateThemeSilent}
          value={templateConfig.stylePreset ?? "vega"}
        />
      </Field>

      <Field>
        <ColorSystemMenu
          configId={configId}
          disabled={readOnly}
          onSave={onUpdateTheme}
          onSaveSilent={onUpdateThemeSilent}
          value={templateConfig.colorSystem ?? "slate"}
        />
      </Field>

      <Field>
        <FontMenu
          configId={configId}
          disabled={readOnly}
          label="Body font"
          onSave={onUpdateTheme}
          onSaveSilent={onUpdateThemeSilent}
          themeKey="fontFamily"
          value={templateConfig.fontFamily ?? "Inter"}
        />
      </Field>

      <Field>
        <FontMenu
          configId={configId}
          disabled={readOnly}
          label="Heading font"
          onSave={onUpdateTheme}
          onSaveSilent={onUpdateThemeSilent}
          themeKey="headingFontFamily"
          value={templateConfig.headingFontFamily ?? "Inter"}
        />
      </Field>

      {Object.keys(namedImageSlots).length > 0 && (
        <Field>
          <ImageSlotsSection
            configId={configId}
            disabled={readOnly}
            namedImageSlots={namedImageSlots}
            namedImages={templateConfig.namedImages}
            onSave={onUpdateTheme}
          />
        </Field>
      )}

      {sectionTypes && sectionTypes.length > 0 && (
        <Field>
          <SectionVisibilityToggles
            configId={configId}
            disabled={readOnly}
            onSave={onUpdateTheme}
            sectionTypes={sectionTypes}
            visibleSections={templateConfig.visibleSections}
          />
        </Field>
      )}

      <Field>
        <SeoSection
          configId={configId}
          disabled={readOnly}
          onSave={onUpdateTheme}
          pageKey="home"
          seoValues={templateConfig.seo?.home}
        />
      </Field>
    </FieldGroup>
  );
}
