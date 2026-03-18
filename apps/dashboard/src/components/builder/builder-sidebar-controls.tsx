"use client";

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
import { Field, FieldGroup } from "@plotkeys/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@plotkeys/ui/tabs";
import { forwardRef, useState } from "react";

type PickerOption = {
  description?: string;
  detail?: string;
  value: string;
};

type TemplateGroup = "starter" | "plus" | "pro";

type TemplateOption = {
  description: string;
  group: TemplateGroup;
  tenants: number;
  title: string;
};

type FontGroup = {
  fonts: PickerOption[];
  label: string;
};

const tierOptions: PickerOption[] = [
  {
    description: "Best for newly registered companies getting online fast.",
    detail: "NGN 0 / month",
    value: "Starter",
  },
  {
    description: "Adds more polished site options and growth-ready tools.",
    detail: "NGN 24,000 / month",
    value: "Plus",
  },
  {
    description: "Built for serious teams that want premium presentation.",
    detail: "NGN 79,000 / month",
    value: "Pro",
  },
];

const templateOptions: TemplateOption[] = [
  {
    description: "Clean launch layout for brand-new companies.",
    group: "starter",
    tenants: 128,
    title: "Template 1",
  },
  {
    description: "Sharper growth-focused presentation for scaling teams.",
    group: "plus",
    tenants: 64,
    title: "Template 2",
  },
  {
    description: "More premium editorial treatment for top-tier brands.",
    group: "pro",
    tenants: 21,
    title: "Template 3",
  },
];

const neutralThemeOption: PickerOption = {
  value: "Neutral",
};

const accentThemeOptions: PickerOption[] = [
  { value: "Amber" },
  { value: "Blue" },
  { value: "Cyan" },
  { value: "Emerald" },
  { value: "Fuchsia" },
  { value: "Green" },
  { value: "Indigo" },
  { value: "Lime" },
  { value: "Orange" },
  { value: "Pink" },
  { value: "Purple" },
  { value: "Red" },
  { value: "Rose" },
  { value: "Sky" },
  { value: "Teal" },
  { value: "Violet" },
  { value: "Yellow" },
];

const fontGroups: FontGroup[] = [
  {
    fonts: [
      { value: "Geist" },
      { value: "Inter" },
      { value: "Noto Sans" },
      { value: "Nunito Sans" },
      { value: "Figtree" },
      { value: "Roboto" },
      { value: "Raleway" },
      { value: "DM Sans" },
      { value: "Public Sans" },
      { value: "Outfit" },
    ],
    label: "Sans",
  },
  {
    fonts: [{ value: "Geist Mono" }, { value: "JetBrains Mono" }],
    label: "Mono",
  },
  {
    fonts: [
      { value: "Noto Serif" },
      { value: "Roboto Slab" },
      { value: "Merriweather" },
      { value: "Lora" },
      { value: "Playfair Display" },
    ],
    label: "Serif",
  },
];

type BuilderSidebarControlsProps = {
  currentTemplateKey: string;
};

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

function findInitialTemplate(currentTemplateKey: string): TemplateOption {
  return (
    templateOptions.find(
      (template) =>
        template.title.toLowerCase().replaceAll(" ", "-") ===
        currentTemplateKey,
    ) ?? {
      description: "Clean launch layout for brand-new companies.",
      group: "starter",
      tenants: 128,
      title: "Template 1",
    }
  );
}

const PickerButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    label: string;
    subtitle?: string;
    value: string;
  }
>(function PickerButton(
  { className, label, subtitle, type = "button", value, ...props },
  ref,
) {
  return (
    <button
      className={[
        "relative w-full rounded-md border border-border/70 bg-background px-3 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      ref={ref}
      type={type}
      {...props}
    >
      <span className="block text-xs text-muted-foreground">{label}</span>
      <span className="mt-1 block text-sm font-medium text-foreground">
        {value}
      </span>
      {subtitle ? (
        <span className="mt-1 block pr-8 text-xs leading-5 text-muted-foreground">
          {subtitle}
        </span>
      ) : null}
      <ChevronIcon />
    </button>
  );
});

function TierMenu({
  onValueChange,
  value,
}: {
  onValueChange: (value: string) => void;
  value: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PickerButton label="Tier" value={value} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
        side="right"
      >
        <DropdownMenuRadioGroup onValueChange={onValueChange} value={value}>
          <DropdownMenuGroup>
            {tierOptions.map((option) => (
              <DropdownMenuRadioItem
                className="items-start rounded-md py-2.5 pr-8"
                key={option.value}
                value={option.value}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium text-foreground">
                    {option.value}
                  </span>
                  {option.description ? (
                    <span className="text-xs leading-5 text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                  {option.detail ? (
                    <span className="text-xs font-medium text-foreground/80">
                      {option.detail}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TemplateMenu({
  group,
  onGroupChange,
  onValueChange,
  templates,
  value,
}: {
  group: TemplateGroup;
  onGroupChange: (value: TemplateGroup) => void;
  onValueChange: (value: string) => void;
  templates: TemplateOption[];
  value: string;
}) {
  const activeTemplate = templates.find(
    (template) => template.title === value,
  ) ?? {
    description: "Choose a template from this group.",
    group,
    tenants: 0,
    title: value,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative w-full rounded-md border border-border/70 bg-background px-3 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          type="button"
        >
          <span className="block text-xs text-muted-foreground">Template</span>
          <span className="mt-1 block pr-10 text-sm font-medium text-foreground">
            {activeTemplate.title}
          </span>
          <Badge className="mt-2" variant="outline">
            {group}
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
          onValueChange={(value) => onGroupChange(value as TemplateGroup)}
          value={group}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="starter">Starter</TabsTrigger>
            <TabsTrigger value="plus">Plus</TabsTrigger>
            <TabsTrigger value="pro">Pro</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-0" value={group}>
            <DropdownMenuRadioGroup onValueChange={onValueChange} value={value}>
              <DropdownMenuGroup>
                {templates.map((template) => (
                  <DropdownMenuRadioItem
                    className="items-start rounded-md py-2.5 pr-8"
                    key={template.title}
                    value={template.title}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <Avatar className="rounded-md" size="sm">
                        <AvatarFallback className="rounded-md bg-muted text-[10px] font-medium">
                          {template.title
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate font-medium text-foreground">
                            {template.title}
                          </span>
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {template.tenants} tenants
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {template.description}
                        </p>
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

function ThemeMenu({
  onValueChange,
  value,
}: {
  onValueChange: (value: string) => void;
  value: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PickerButton label="Theme" value={value} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-92 w-56 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
        side="right"
      >
        <DropdownMenuRadioGroup onValueChange={onValueChange} value={value}>
          <DropdownMenuGroup>
            <DropdownMenuRadioItem
              className="rounded-md py-2 pr-8"
              value={neutralThemeOption.value}
            >
              {neutralThemeOption.value}
            </DropdownMenuRadioItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {accentThemeOptions.map((option) => (
              <DropdownMenuRadioItem
                className="rounded-md py-2 pr-8"
                key={option.value}
                value={option.value}
              >
                {option.value}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FontMenu({
  onValueChange,
  value,
}: {
  onValueChange: (value: string) => void;
  value: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PickerButton label="Font" value={value} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-96 w-56 rounded-lg border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur"
        side="right"
      >
        <DropdownMenuRadioGroup onValueChange={onValueChange} value={value}>
          {fontGroups.map((group, groupIndex) => (
            <div key={group.label}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">
                  {group.label}
                </DropdownMenuLabel>
                {group.fonts.map((font) => (
                  <DropdownMenuRadioItem
                    className="rounded-md py-2 pr-8"
                    key={font.value}
                    value={font.value}
                  >
                    {font.value}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuGroup>
              {groupIndex < fontGroups.length - 1 ? (
                <DropdownMenuSeparator />
              ) : null}
            </div>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BuilderSidebarControls({
  currentTemplateKey,
}: BuilderSidebarControlsProps) {
  const initialTemplate = findInitialTemplate(currentTemplateKey);
  const [tier, setTier] = useState("Starter");
  const [templateGroup, setTemplateGroup] = useState<TemplateGroup>(
    initialTemplate.group,
  );
  const [template, setTemplate] = useState(initialTemplate.title);
  const [theme, setTheme] = useState("Neutral");
  const [font, setFont] = useState("Inter");

  const visibleTemplates = templateOptions.filter(
    (option) => option.group === templateGroup,
  );

  const selectedTemplateInGroup = visibleTemplates.find(
    (option) => option.title === template,
  );

  return (
    <FieldGroup className="flex flex-col gap-5">
      <Field>
        <TierMenu onValueChange={setTier} value={tier} />
      </Field>

      <Field>
        <TemplateMenu
          group={templateGroup}
          onGroupChange={setTemplateGroup}
          onValueChange={setTemplate}
          templates={visibleTemplates}
          value={selectedTemplateInGroup?.title ?? ""}
        />
      </Field>

      <Field>
        <ThemeMenu onValueChange={setTheme} value={theme} />
      </Field>

      <Field>
        <FontMenu onValueChange={setFont} value={font} />
      </Field>
    </FieldGroup>
  );
}
