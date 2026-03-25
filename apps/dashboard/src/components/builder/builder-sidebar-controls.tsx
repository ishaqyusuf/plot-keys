"use client";

import {
  colorSystems,
  getParentTemplateForVariationKey,
  getVariationForTemplateKey,
  stylePresets,
  type TemplateConfig,
  type TemplateVariation,
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
import { forwardRef, useRef, useState, useTransition } from "react";

type TemplateGroup = "starter" | "plus" | "pro";

type BuilderSidebarControlsProps = {
  configId: string;
  currentTemplateKey: string;
  /** Section types present in the current template page inventory. */
  sectionTypes?: string[];
  templateConfig: TemplateConfig;
  onCreateDraft: (formData: FormData) => Promise<void>;
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
  onSave,
  onSaveSilent,
  value,
}: {
  configId: string;
  onSave: (formData: FormData) => Promise<void>;
  onSaveSilent?: (formData: FormData) => Promise<void>;
  value: string;
}) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [, startTransition] = useTransition();

  function handleChange(preset: string) {
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
        <PickerButton label="Style preset">
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
  onSave,
  onSaveSilent,
  value,
}: {
  configId: string;
  onSave: (formData: FormData) => Promise<void>;
  onSaveSilent?: (formData: FormData) => Promise<void>;
  value: string;
}) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [, startTransition] = useTransition();

  function handleChange(system: string) {
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
        <PickerButton label="Color system">
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
  label,
  onSave,
  onSaveSilent,
  themeKey,
  value,
}: {
  configId: string;
  label: string;
  onSave: (formData: FormData) => Promise<void>;
  onSaveSilent?: (formData: FormData) => Promise<void>;
  themeKey: string;
  value: string;
}) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [, startTransition] = useTransition();

  function handleChange(font: string) {
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
        <PickerButton label={label}>
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

/**
 * Resolves the "effective" template key for the picker radio group.
 * Variation keys (e.g. "template-1") resolve to their parent template key
 * ("template-classic") so the picker highlights the correct parent row.
 */
function resolvePickerTemplateKey(currentKey: string): string {
  const parent = getParentTemplateForVariationKey(currentKey);
  return parent?.key ?? currentKey;
}

function TemplatePicker({
  configId,
  currentTemplateKey,
  onCreateDraft,
}: {
  configId: string;
  currentTemplateKey: string;
  onCreateDraft: (formData: FormData) => Promise<void>;
}) {
  // If the stored key is a variation key, resolve to the parent template for display.
  const parentKey = resolvePickerTemplateKey(currentTemplateKey);
  const currentVariation = getVariationForTemplateKey(currentTemplateKey);
  const currentTemplate =
    templateCatalog.find((t) => t.key === parentKey) ??
    templateCatalog.find((t) => t.key === currentTemplateKey);

  const [group, setGroup] = useState<TemplateGroup>(
    (currentVariation?.tier ?? currentTemplate?.tier ?? "starter") as TemplateGroup,
  );
  const [, startTransition] = useTransition();

  function handleSelectTemplate(templateKey: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      // When selecting a parent template that has variations, default to the
      // first starter variation so a concrete key is stored in the DB.
      const template = templateCatalog.find((t) => t.key === templateKey);
      const defaultKey =
        template?.variations?.find((v) => v.tier === "starter")?.key ??
        templateKey;
      fd.set("templateKey", defaultKey);
      await onCreateDraft(fd);
    });
  }

  // Templates that are not variation-only are shown in the tier tabs.
  // "Classic" appears in all three tabs so users can discover it regardless of tier.
  const classicTemplate = templateCatalog.find((t) => t.key === "template-classic");
  const nonVariantTemplates = templateCatalog.filter(
    (t) => !t.variations && t.tier === group,
  );
  const groupTemplates = classicTemplate
    ? [classicTemplate, ...nonVariantTemplates]
    : nonVariantTemplates;

  const displayName = currentVariation
    ? `Classic — ${currentVariation.name}`
    : (currentTemplate?.name ?? currentTemplateKey);
  const displayTier = currentVariation?.tier ?? currentTemplate?.tier ?? "starter";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative w-full rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          type="button"
        >
          <span className="block text-xs text-muted-foreground">Template</span>
          <span className="mt-0.5 block pr-9 text-sm font-medium text-foreground">
            {displayName}
          </span>
          <Badge className="mt-1.5" variant="outline">
            {displayTier}
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
              value={parentKey}
            >
              <DropdownMenuGroup>
                {groupTemplates.map((template) => (
                  <DropdownMenuRadioItem
                    className="items-start rounded-md py-2 pr-8"
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
                      </div>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuRadioGroup>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Variation Picker — shown below the template picker when the active template
// has colour/typography variations (i.e. when Classic is the active template).
// ---------------------------------------------------------------------------

function VariationPicker({
  configId,
  currentVariationKey,
  variations,
  onSelectVariation,
}: {
  configId: string;
  currentVariationKey: string;
  variations: TemplateVariation[];
  onSelectVariation: (formData: FormData) => Promise<void>;
}) {
  const [activeGroup, setActiveGroup] = useState<TemplateGroup>(() => {
    const current = variations.find((v) => v.key === currentVariationKey);
    return (current?.tier ?? "starter") as TemplateGroup;
  });
  const [, startTransition] = useTransition();

  function handleSelect(variationKey: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("templateKey", variationKey);
      await onSelectVariation(fd);
    });
  }

  const groupVariations = variations.filter((v) => v.tier === activeGroup);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Classic Style
      </p>
      <div className="flex gap-1">
        {(["starter", "plus", "pro"] as TemplateGroup[]).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setActiveGroup(tier)}
            className={[
              "flex-1 rounded px-1.5 py-0.5 text-xs capitalize transition-colors",
              activeGroup === tier
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {tier}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1.5 pt-0.5">
        {groupVariations.map((variation) => (
          <button
            key={variation.key}
            title={variation.name}
            type="button"
            onClick={() => handleSelect(variation.key)}
            className={[
              "group relative flex flex-col items-center gap-1 rounded-md p-1 transition-colors hover:bg-muted/60",
              currentVariationKey === variation.key
                ? "ring-2 ring-primary ring-offset-1"
                : "",
            ].join(" ")}
          >
            {/* Colour swatch */}
            <span
              className="block size-7 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: variation.accentColor }}
            />
            <span className="block w-full truncate text-center text-[9px] text-muted-foreground">
              {variation.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image Slots
// ---------------------------------------------------------------------------

function ImageSlotsSection({
  configId,
  namedImageSlots,
  namedImages,
  onSave,
}: {
  configId: string;
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
  onSave,
  sectionTypes,
  visibleSections,
}: {
  configId: string;
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
            size="sm"
            onCheckedChange={(checked) => handleToggle(type, checked)}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function BuilderSidebarControls({
  configId,
  currentTemplateKey,
  sectionTypes,
  templateConfig,
  onCreateDraft,
  onUpdateTheme,
  onUpdateThemeSilent,
}: BuilderSidebarControlsProps) {
  // If the stored key is a variation key, resolve to the parent template for namedImageSlots etc.
  const parentTemplate =
    getParentTemplateForVariationKey(currentTemplateKey) ??
    templateCatalog.find((t) => t.key === currentTemplateKey);
  const namedImageSlots = parentTemplate?.namedImageSlots ?? {};

  // Variations from the parent template (Classic = template-1 … template-30).
  const currentVariations = parentTemplate?.variations ?? null;

  return (
    <FieldGroup className="flex flex-col gap-2">
      <Field>
        <TemplatePicker
          configId={configId}
          currentTemplateKey={currentTemplateKey}
          onCreateDraft={onCreateDraft}
        />
      </Field>

      {currentVariations && currentVariations.length > 0 && (
        <Field>
          <VariationPicker
            configId={configId}
            currentVariationKey={currentTemplateKey}
            variations={currentVariations}
            onSelectVariation={onCreateDraft}
          />
        </Field>
      )}

      <Field>
        <StylePresetMenu
          configId={configId}
          onSave={onUpdateTheme}
          onSaveSilent={onUpdateThemeSilent}
          value={templateConfig.stylePreset ?? "vega"}
        />
      </Field>

      <Field>
        <ColorSystemMenu
          configId={configId}
          onSave={onUpdateTheme}
          onSaveSilent={onUpdateThemeSilent}
          value={templateConfig.colorSystem ?? "slate"}
        />
      </Field>

      <Field>
        <FontMenu
          configId={configId}
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
            onSave={onUpdateTheme}
            sectionTypes={sectionTypes}
            visibleSections={templateConfig.visibleSections}
          />
        </Field>
      )}
    </FieldGroup>
  );
}
