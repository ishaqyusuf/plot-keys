"use client";

import {
  colorSystems,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@plotkeys/ui/tabs";
import { forwardRef, useRef, useState, useTransition } from "react";

type TemplateGroup = "starter" | "plus" | "pro";

type BuilderSidebarControlsProps = {
  configId: string;
  currentTemplateKey: string;
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
      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
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
        "relative w-full rounded-md border border-border/70 bg-background px-3 py-2 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      ref={ref}
      type={type}
      {...props}
    >
      <span className="block text-xs text-muted-foreground">{label}</span>
      <span className="mt-1 block pr-8 text-sm font-medium text-foreground">
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
                className="items-start rounded-md py-2.5 pr-8"
                key={preset.key}
                value={preset.key}
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{preset.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground capitalize">
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
                className="items-start rounded-md py-2.5 pr-8"
                key={key}
                value={key}
              >
                <div className="flex min-w-0 items-center gap-3">
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
                    className="rounded-md py-2 pr-8"
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
  onCreateDraft,
}: {
  configId: string;
  currentTemplateKey: string;
  onCreateDraft: (formData: FormData) => Promise<void>;
}) {
  const currentTemplate = templateCatalog.find(
    (t) => t.key === currentTemplateKey,
  );
  const [group, setGroup] = useState<TemplateGroup>(
    (currentTemplate?.tier as TemplateGroup) ?? "starter",
  );
  const [, startTransition] = useTransition();

  function handleSelectTemplate(templateKey: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("configId", configId);
      fd.set("templateKey", templateKey);
      await onCreateDraft(fd);
    });
  }

  const groupTemplates = templateCatalog.filter((t) => t.tier === group);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative w-full rounded-md border border-border/70 bg-background px-3 py-2 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          type="button"
        >
          <span className="block text-xs text-muted-foreground">Template</span>
          <span className="mt-1 block pr-10 text-sm font-medium text-foreground">
            {currentTemplate?.name ?? currentTemplateKey}
          </span>
          <Badge className="mt-2" variant="outline">
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
          className="flex flex-col gap-3"
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
                {groupTemplates.map((template) => (
                  <DropdownMenuRadioItem
                    className="items-start rounded-md py-2.5 pr-8"
                    key={template.key}
                    value={template.key}
                  >
                    <div className="flex min-w-0 items-start gap-3">
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
                          <p className="mt-1 truncate text-xs text-muted-foreground">
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
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Images
      </p>
      {slots.map((slot) => (
        <div key={slot}>
          <FieldLabel className="text-xs capitalize text-muted-foreground">
            {slot.replace(/([A-Z])/g, " $1").trim()}
          </FieldLabel>
          <Input
            className="mt-1 text-xs"
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
// Main export
// ---------------------------------------------------------------------------

export function BuilderSidebarControls({
  configId,
  currentTemplateKey,
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
    <FieldGroup className="flex flex-col gap-3">
      <Field>
        <TemplatePicker
          configId={configId}
          currentTemplateKey={currentTemplateKey}
          onCreateDraft={onCreateDraft}
        />
      </Field>

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
    </FieldGroup>
  );
}
