import {
  type StylePreset,
  type StylePresetDefinition,
  stylePresets,
  type TemplateConfig,
} from "./template-config";

export type TemplateUiIntent = "ghost" | "outline" | "primary" | "secondary";
export type TemplateUiSize = "lg" | "md" | "sm";

export type TemplateUiVariantOptions = {
  className?: string;
  intent?: TemplateUiIntent;
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
  ghost: "bg-transparent text-foreground hover:bg-accent",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-accent",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
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

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
  size = "md",
  stylePreset,
}: TemplateUiVariantOptions = {}) {
  const preset = resolveTemplateStylePreset(stylePreset);

  return joinClasses(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    buttonIntentClasses[intent],
    buttonSizeClasses[size],
    preset.radius.button,
    className,
  );
}

export function templateInputVariants({
  className,
  size = "md",
  stylePreset,
}: Omit<TemplateUiVariantOptions, "intent"> = {}) {
  const preset = resolveTemplateStylePreset(stylePreset);

  return joinClasses(
    "w-full border border-input bg-background text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    inputSizeClasses[size],
    preset.radius.input,
    className,
  );
}

export function templateSurfaceVariants({
  className,
  stylePreset,
}: Pick<TemplateUiVariantOptions, "className" | "stylePreset"> = {}) {
  const preset = resolveTemplateStylePreset(stylePreset);

  return joinClasses(
    "border border-border bg-card text-card-foreground shadow-sm",
    preset.radius.card,
    className,
  );
}

export function createTemplateUiResolver(
  config: Pick<TemplateConfig, "stylePreset"> | undefined,
): TemplateUiResolver {
  const preset = resolveTemplateStylePreset(config);

  return {
    button: (options) =>
      templateButtonVariants({ ...options, stylePreset: preset.key }),
    input: (options) =>
      templateInputVariants({ ...options, stylePreset: preset.key }),
    preset,
    surface: (options) =>
      templateSurfaceVariants({ ...options, stylePreset: preset.key }),
  };
}
