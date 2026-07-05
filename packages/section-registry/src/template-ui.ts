import {
  type StylePreset,
  type StylePresetDefinition,
  stylePresets,
  type TemplateConfig,
} from "./template-config";

export type TemplateUiIntent = "ghost" | "outline" | "primary" | "secondary";
export type TemplateUiRadius = "full" | "lg" | "md" | "none" | "sm" | "xl";
export type TemplateUiSize = "lg" | "md" | "sm";

export type TemplateUiVariantOptions = {
  className?: string;
  intent?: TemplateUiIntent;
  radius?: TemplateUiRadius | string;
  size?: TemplateUiSize;
  stylePreset?: StylePreset | string;
};

export type TemplateUiResolver = {
  button: (options?: Omit<TemplateUiVariantOptions, "stylePreset">) => string;
  input: (options?: Omit<TemplateUiVariantOptions, "stylePreset">) => string;
  preset: StylePresetDefinition;
  surface: (options?: { className?: string }) => string;
};

const fallbackStylePreset = stylePresets.vega;

const buttonIntentClasses: Record<TemplateUiIntent, string> = {
  ghost:
    "bg-transparent text-[color:var(--pk-foreground,#0f172a)] hover:bg-[color:var(--pk-accent,#f1f5f9)] hover:text-[color:var(--pk-accent-foreground,#0f172a)]",
  outline:
    "border border-[color:var(--pk-border,#e2e8f0)] bg-transparent text-[color:var(--pk-foreground,#0f172a)] hover:bg-[color:var(--pk-accent,#f1f5f9)] hover:text-[color:var(--pk-accent-foreground,#0f172a)]",
  primary:
    "bg-[color:var(--pk-primary,#2563eb)] text-[color:var(--pk-primary-foreground,#fff)] hover:opacity-90",
  secondary:
    "bg-[color:var(--pk-secondary,#f1f5f9)] text-[color:var(--pk-secondary-foreground,#0f172a)] hover:opacity-90",
};

const buttonSizeClasses: Record<TemplateUiSize, string> = {
  lg: "h-11 px-6 text-base",
  md: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
};

const inputSizeClasses: Record<TemplateUiSize, string> = {
  lg: "h-12 px-4 text-base",
  md: "h-10 px-3 text-sm",
  sm: "h-8 px-2 text-xs",
};

const radiusOverrideClasses: Record<
  "button" | "input" | "surface",
  Record<TemplateUiRadius, string>
> = {
  button: {
    full: "rounded-full",
    lg: "rounded-lg",
    md: "rounded-md",
    none: "rounded-none",
    sm: "rounded-sm",
    xl: "rounded-xl",
  },
  input: {
    full: "rounded-full",
    lg: "rounded-lg",
    md: "rounded-md",
    none: "rounded-none",
    sm: "rounded-sm",
    xl: "rounded-xl",
  },
  surface: {
    full: "rounded-[2rem]",
    lg: "rounded-lg",
    md: "rounded-md",
    none: "rounded-none",
    sm: "rounded-sm",
    xl: "rounded-xl",
  },
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function resolveRadiusClass(
  radius: string | undefined,
  kind: keyof typeof radiusOverrideClasses,
  fallback: string,
) {
  if (!radius || !(radius in radiusOverrideClasses[kind])) return fallback;
  return radiusOverrideClasses[kind][radius as TemplateUiRadius];
}

export function resolveTemplateStylePreset(
  configOrPreset?: Pick<TemplateConfig, "stylePreset"> | StylePreset | string,
): StylePresetDefinition {
  const key =
    typeof configOrPreset === "string"
      ? configOrPreset
      : configOrPreset?.stylePreset;

  return key && key in stylePresets
    ? stylePresets[key as StylePreset]
    : fallbackStylePreset;
}

export function templateButtonVariants({
  className,
  intent = "primary",
  radius,
  size = "md",
  stylePreset,
}: TemplateUiVariantOptions = {}) {
  const preset = resolveTemplateStylePreset(stylePreset);

  return joinClasses(
    "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pk-ring,#2563eb)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--pk-background,#fff)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    buttonIntentClasses[intent],
    buttonSizeClasses[size],
    resolveRadiusClass(radius, "button", preset.radius.button),
    className,
  );
}

export function templateInputVariants({
  className,
  radius,
  size = "md",
  stylePreset,
}: Omit<TemplateUiVariantOptions, "intent"> = {}) {
  const preset = resolveTemplateStylePreset(stylePreset);

  return joinClasses(
    "w-full border border-[color:var(--pk-input,#e2e8f0)] bg-[color:var(--pk-background,#fff)] text-[color:var(--pk-foreground,#0f172a)] shadow-xs transition-colors placeholder:text-[color:var(--pk-muted-foreground,#64748b)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pk-ring,#2563eb)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--pk-background,#fff)] disabled:cursor-not-allowed disabled:opacity-50",
    inputSizeClasses[size],
    resolveRadiusClass(radius, "input", preset.radius.input),
    className,
  );
}

export function templateSurfaceVariants({
  className,
  radius,
  stylePreset,
}: Pick<
  TemplateUiVariantOptions,
  "className" | "radius" | "stylePreset"
> = {}) {
  const preset = resolveTemplateStylePreset(stylePreset);

  return joinClasses(
    "border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#fff)] text-[color:var(--pk-card-foreground,#0f172a)] shadow-sm",
    resolveRadiusClass(radius, "surface", preset.radius.card),
    className,
  );
}

export function createTemplateUiResolver(
  config: Pick<TemplateConfig, "radius" | "stylePreset"> | undefined,
): TemplateUiResolver {
  const preset = resolveTemplateStylePreset(config);

  return {
    button: (options) =>
      templateButtonVariants({
        ...options,
        radius: config?.radius,
        stylePreset: preset.key,
      }),
    input: (options) =>
      templateInputVariants({
        ...options,
        radius: config?.radius,
        stylePreset: preset.key,
      }),
    preset,
    surface: (options) =>
      templateSurfaceVariants({
        ...options,
        radius: config?.radius,
        stylePreset: preset.key,
      }),
  };
}
