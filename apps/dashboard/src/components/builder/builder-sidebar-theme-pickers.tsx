"use client";

import { colorSystems, stylePresets } from "@plotkeys/section-registry";
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
import { BuilderSidebarPickerButton } from "./builder-sidebar-picker-button";
import {
  type SaveBuilderThemeField,
  useBuilderThemeSelection,
} from "./use-builder-theme-selection";

type PickerInput = {
  configId: string;
  disabled?: boolean;
  onSave: SaveBuilderThemeField;
  onSaveSilent?: SaveBuilderThemeField;
  value: string;
};

type FontInput = PickerInput & {
  label: string;
  themeKey: string;
};

const presetEntries = Object.values(stylePresets);
const colorSystemEntries = Object.entries(colorSystems);

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

export function StylePresetMenu({
  configId,
  disabled = false,
  onSave,
  onSaveSilent,
  value,
}: PickerInput) {
  const { handleChange, optimisticValue } = useBuilderThemeSelection({
    configId,
    disabled,
    onSave,
    onSaveSilent,
    themeKey: "stylePreset",
    value,
  });

  const current = stylePresets[optimisticValue as keyof typeof stylePresets];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <BuilderSidebarPickerButton disabled={disabled} label="Style preset">
          {current?.name ?? optimisticValue ?? "Default"}
        </BuilderSidebarPickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-1.5"
        align="start"
        sideOffset={10}
        side="right"
      >
        <DropdownMenuRadioGroup
          onValueChange={handleChange}
          value={optimisticValue}
        >
          <DropdownMenuGroup>
            {presetEntries.map((preset) => (
              <DropdownMenuRadioItem
                className="items-start"
                key={preset.key}
                value={preset.key}
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{preset.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {preset.density} / {preset.radius.card}
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

export function ColorSystemMenu({
  configId,
  disabled = false,
  onSave,
  onSaveSilent,
  value,
}: PickerInput) {
  const { handleChange, optimisticValue } = useBuilderThemeSelection({
    configId,
    disabled,
    onSave,
    onSaveSilent,
    themeKey: "colorSystem",
    value,
  });

  const current = colorSystems[optimisticValue];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <BuilderSidebarPickerButton disabled={disabled} label="Color system">
          <span className="flex items-center gap-2">
            {current && (
              <>
                <span
                  className="inline-block size-3 rounded-full border border-border"
                  style={{
                    backgroundColor: `hsl(${current.light.primary})`,
                  }}
                />
                <span
                  className="inline-block size-3 rounded-full border border-border"
                  style={{
                    backgroundColor: `hsl(${current.light.background})`,
                  }}
                />
              </>
            )}
            {current?.name ?? optimisticValue ?? "Default"}
          </span>
        </BuilderSidebarPickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-1.5"
        align="start"
        sideOffset={10}
        side="right"
      >
        <DropdownMenuRadioGroup
          onValueChange={handleChange}
          value={optimisticValue}
        >
          <DropdownMenuGroup>
            {colorSystemEntries.map(([key, system]) => (
              <DropdownMenuRadioItem
                className="items-start"
                key={key}
                value={key}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex shrink-0 gap-0.5">
                    <span
                      className="size-3 rounded-l-full border border-border"
                      style={{
                        backgroundColor: `hsl(${system.light.primary})`,
                      }}
                    />
                    <span
                      className="size-3 rounded-r-full border border-border"
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

export function FontMenu({
  configId,
  disabled = false,
  label,
  onSave,
  onSaveSilent,
  themeKey,
  value,
}: FontInput) {
  const { handleChange, optimisticValue } = useBuilderThemeSelection({
    configId,
    disabled,
    onSave,
    onSaveSilent,
    themeKey,
    value,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <BuilderSidebarPickerButton disabled={disabled} label={label}>
          {optimisticValue || "Default"}
        </BuilderSidebarPickerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-72 w-56 overflow-y-auto p-1.5"
        align="start"
        sideOffset={10}
        side="right"
      >
        <DropdownMenuRadioGroup
          onValueChange={handleChange}
          value={optimisticValue}
        >
          {fontOptions.map((group, i) => (
            <div key={group.label}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {group.label}
                </DropdownMenuLabel>
                {group.fonts.map((font) => (
                  <DropdownMenuRadioItem key={font} value={font}>
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
