"use client";

import { Field } from "@plotkeys/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@plotkeys/ui/select";
import { useMutation } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Hexagon,
  Menu,
  Rows3,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTRPC } from "../../trpc/client";
import {
  floatingConfigExpandedErrorClassName,
  floatingConfigFieldBaseClassName,
  floatingConfigIconFrameClassName,
  floatingConfigRowClassName,
  floatingConfigTextStackClassName,
} from "./floating-config-rail-row-classes";

type FloatingConfigIcon =
  | "base-color"
  | "menu"
  | "radius"
  | "rows"
  | "section"
  | "sliders"
  | "style"
  | "theme"
  | "type";

type FloatingConfigSelectOption = {
  description?: string;
  label: string;
  swatchAccentColor?: string;
  swatchColor?: string;
  value: string;
};

type FloatingConfigSelectFieldProps = {
  icon: FloatingConfigIcon;
  label: string;
  name: string;
  onDraftValueChange?: (name: string, value: string) => void;
  options: ReadonlyArray<FloatingConfigSelectOption>;
  profileId: string;
  value?: string;
};

const selectOpenAttribute = "data-template-config-select-open";

const swatchColors: Record<string, string> = {
  amber: "#d97706",
  blue: "#2563eb",
  cyan: "#0891b2",
  emerald: "#059669",
  forest: "#16a34a",
  fuchsia: "#c026d3",
  green: "#16a34a",
  indigo: "#4f46e5",
  lime: "#65a30d",
  mauve: "#8b7d91",
  mist: "#8ab4c8",
  neutral: "#737373",
  olive: "#6f7d3a",
  orange: "#c2410c",
  ocean: "#0284c7",
  pink: "#db2777",
  purple: "#9333ea",
  red: "#dc2626",
  rose: "#e11d48",
  rubbait: "#522C1F",
  sky: "#0284c7",
  slate: "#64748b",
  stone: "#78716c",
  taupe: "#a99f98",
  teal: "#0d9488",
  violet: "#7c3aed",
  yellow: "#ca8a04",
  zinc: "#71717a",
};

const radiusPreview: Record<string, string> = {
  full: "999px",
  lg: "0.5rem",
  md: "0.375rem",
  none: "0",
  sm: "0.25rem",
  xl: "0.75rem",
};

function resolveSwatchColor(value: string) {
  const trimmed = value.trim();

  if (swatchColors[trimmed]) return swatchColors[trimmed];

  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("rgb(") ||
    trimmed.startsWith("rgba(") ||
    trimmed.startsWith("hsl(") ||
    trimmed.startsWith("hsla(") ||
    trimmed.startsWith("var(")
  ) {
    return trimmed;
  }

  if (/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/.test(trimmed)) {
    return `hsl(${trimmed})`;
  }

  return "#d4d4d8";
}

function FieldIcon({
  icon,
  option,
  value,
}: {
  icon: FloatingConfigIcon;
  option?: FloatingConfigSelectOption;
  value: string;
}) {
  const swatchColor = resolveSwatchColor(option?.swatchColor ?? value);
  const swatchAccentColor = option?.swatchAccentColor
    ? resolveSwatchColor(option.swatchAccentColor)
    : null;

  switch (icon) {
    case "base-color":
      return (
        <span
          className="relative size-5 rounded-full border border-white/35 shadow-sm"
          style={{ backgroundColor: swatchColor }}
        >
          {swatchAccentColor ? (
            <span
              className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border border-zinc-950"
              style={{ backgroundColor: swatchAccentColor }}
            />
          ) : null}
        </span>
      );
    case "theme":
      return (
        <span
          className="size-5 rounded-full border border-white/30 shadow-sm"
          style={{ backgroundColor: swatchColor }}
        />
      );
    case "menu":
      return <Menu className="size-4" />;
    case "radius":
      return (
        <span
          className="size-5 border border-zinc-300"
          style={{ borderRadius: radiusPreview[value] ?? "0.375rem" }}
        />
      );
    case "rows":
      return <Rows3 className="size-4" />;
    case "section":
      return value === "false" ? (
        <EyeOff className="size-4 text-zinc-500" />
      ) : (
        <Eye className="size-4" />
      );
    case "type":
      return (
        <span
          className="text-lg leading-none"
          style={{ fontFamily: value || "inherit" }}
        >
          Aa
        </span>
      );
    case "style":
      return <Hexagon className="size-4" />;
    case "sliders":
      return (
        <span
          className="flex size-5 flex-col justify-center gap-1"
          aria-hidden="true"
        >
          <span
            className={[
              "h-1.5 w-5 rounded-full border border-zinc-300",
              value === "strong" ? "bg-zinc-100" : "bg-transparent",
              value === "none" ? "opacity-45" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
          <span
            className={[
              "h-1.5 rounded-full border border-zinc-300",
              value === "subtle" ? "w-3 bg-zinc-100/45" : "w-5",
              value === "strong" ? "bg-zinc-100" : "",
              value === "none" ? "opacity-45" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </span>
      );
    default:
      return <SlidersHorizontal className="size-4" />;
  }
}

export function FloatingConfigSelectField({
  icon,
  label,
  name,
  onDraftValueChange,
  options,
  profileId,
  value,
}: FloatingConfigSelectFieldProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const persistedOption = options.find((option) => option.value === value);
  const fallbackOption = persistedOption ?? options[0];
  const selectedValue = persistedOption?.value ?? fallbackOption?.value ?? "";
  const selectOpenOwnerId = useId();
  const latestSubmittedValueRef = useRef<string | null>(null);
  const rollbackValueRef = useRef(selectedValue);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [optimisticValue, setOptimisticValue] = useState(selectedValue);
  const mutation = useMutation(
    trpc.templateSandbox.updateThemeField.mutationOptions({
      onError: (_error, variables) => {
        if (variables.value === latestSubmittedValueRef.current) {
          const rollbackValue = rollbackValueRef.current;
          setOptimisticValue(rollbackValue);
          onDraftValueChange?.(name, rollbackValue);
        }
      },
      onSuccess: (_result, variables) => {
        if (variables.value === latestSubmittedValueRef.current) {
          router.refresh();
        }
      },
    }),
  );
  const optimisticLabel =
    options.find((option) => option.value === optimisticValue)?.label ??
    fallbackOption?.label ??
    "";
  const optimisticOption =
    options.find((option) => option.value === optimisticValue) ??
    fallbackOption;
  const mutationError =
    mutation.error instanceof Error
      ? mutation.error.message
      : mutation.error
        ? "Unable to save this setting."
        : "";
  const optimisticDisplayValue = optimisticValue || selectedValue;

  useEffect(() => {
    setOptimisticValue(selectedValue);
  }, [selectedValue]);

  const syncSelectOpenAttribute = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      document.documentElement.setAttribute(
        selectOpenAttribute,
        selectOpenOwnerId,
      );
      return;
    }

    if (
      document.documentElement.getAttribute(selectOpenAttribute) ===
      selectOpenOwnerId
    ) {
      document.documentElement.removeAttribute(selectOpenAttribute);
    }
  }, [selectOpenOwnerId]);

  useEffect(() => {
    syncSelectOpenAttribute(isSelectOpen);

    return () => syncSelectOpenAttribute(false);
  }, [isSelectOpen, syncSelectOpenAttribute]);

  function handleOpenChange(nextOpen: boolean) {
    syncSelectOpenAttribute(nextOpen);
    setIsSelectOpen(nextOpen);
  }

  function handleChange(nextValue: string) {
    if (nextValue === optimisticValue && value === nextValue) return;

    latestSubmittedValueRef.current = nextValue;
    rollbackValueRef.current = selectedValue;
    setOptimisticValue(nextValue);
    onDraftValueChange?.(name, nextValue);
    mutation.mutate({
      profileId,
      themeKey: name,
      value: nextValue,
    });
  }

  return (
    <Field
      className={[
        floatingConfigFieldBaseClassName,
        mutationError ? "border-red-400/45 bg-red-500/[0.08]" : "",
        mutation.isPending ? "opacity-70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Select
        open={isSelectOpen}
        value={optimisticValue}
        onOpenChange={handleOpenChange}
        onValueChange={handleChange}
      >
        <SelectTrigger
          aria-label={`${label}: ${optimisticLabel}`}
          className="h-auto min-h-12 w-full cursor-pointer border-0 bg-transparent px-2 py-1.5 text-left text-zinc-50 shadow-none focus:ring-0 [&>svg]:hidden"
          title={
            mutationError
              ? `${label}: ${optimisticLabel}. ${mutationError}`
              : `${label}: ${optimisticLabel}`
          }
          onClick={(event) => event.stopPropagation()}
        >
          <span className={floatingConfigRowClassName}>
            <span className={floatingConfigTextStackClassName}>
              <span className="text-[11px] font-normal text-zinc-400">
                {label}
              </span>
              <span className="truncate text-xs font-semibold text-zinc-50">
                {optimisticLabel}
              </span>
            </span>
            <span className={floatingConfigIconFrameClassName}>
              <FieldIcon
                icon={icon}
                option={optimisticOption}
                value={optimisticDisplayValue}
              />
            </span>
          </span>
        </SelectTrigger>
        {mutationError ? (
          <p className={floatingConfigExpandedErrorClassName}>
            {mutationError}
          </p>
        ) : null}
        <SelectContent
          align="start"
          position="popper"
          side="right"
          sideOffset={8}
          className="z-[120] max-h-72 min-w-56 overflow-hidden border-white/10 bg-zinc-950 text-zinc-50 shadow-[0_18px_45px_rgb(0_0_0_/_0.35)] [&_[data-slot=select-viewport]]:h-auto [&_[data-slot=select-viewport]]:max-h-64 [&_[data-slot=select-viewport]]:overflow-y-auto [&_[data-slot=select-viewport]]:overscroll-contain"
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                className="cursor-pointer items-start border-l-2 border-transparent py-1.5 text-xs data-[highlighted]:bg-white/10 data-[highlighted]:text-zinc-50 data-[state=checked]:border-white/70 data-[state=checked]:bg-white/10 data-[state=checked]:font-semibold data-[state=checked]:text-zinc-50 focus:bg-white/10 focus:text-zinc-50"
                textValue={
                  option.description
                    ? `${option.label} ${option.description}`
                    : option.label
                }
                value={option.value}
              >
                <span className="flex min-w-0 items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-zinc-300"
                  >
                    <FieldIcon
                      icon={icon}
                      option={option}
                      value={option.value}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{option.label}</span>
                    {option.description ? (
                      <span className="mt-0.5 block truncate text-xs font-normal text-zinc-400">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
