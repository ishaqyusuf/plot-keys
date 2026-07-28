import type { TemplateConfig } from "@plotkeys/section-registry";
import { cn } from "@plotkeys/ui/cn";

export function resolvePreviewRegisterRadiusClass(radius?: string) {
  if (radius === "none") return "rounded-none";
  if (radius === "sm") return "rounded-sm";
  if (radius === "md") return "rounded-md";
  if (radius === "lg") return "rounded-lg";
  if (radius === "xl") return "rounded-xl";
  if (radius === "full") return "rounded-full";

  return "rounded-md";
}

export function resolvePreviewRegisterHeaderClass(
  templateConfig: TemplateConfig,
) {
  const base = "sticky top-0 z-30";

  if (templateConfig.menuStyle === "minimal") {
    return cn(base, "bg-transparent");
  }

  if (templateConfig.menuStyle === "bordered") {
    return cn(
      base,
      "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#fff)]",
    );
  }

  if (templateConfig.menuStyle === "default-solid") {
    return cn(
      base,
      "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]",
    );
  }

  return cn(
    base,
    "border-b border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-background,#fff)]",
  );
}

export function resolvePreviewRegisterNavLinkClass(
  isActive: boolean,
  templateConfig: TemplateConfig,
) {
  const radius = resolvePreviewRegisterRadiusClass(templateConfig.radius);
  const base = cn("px-3 py-1.5 text-sm transition-colors", radius);

  if (!isActive) {
    return cn(
      base,
      "text-[color:var(--pk-muted-foreground,#64748b)] hover:bg-[color:var(--pk-muted,#f1f5f9)] hover:text-[color:var(--pk-foreground,#0f172a)]",
    );
  }

  if (templateConfig.menuAccent === "strong") {
    return cn(
      base,
      "bg-[color:var(--pk-primary,#0f172a)] font-medium text-[color:var(--pk-primary-foreground,#fff)]",
    );
  }

  if (templateConfig.menuAccent === "none") {
    return cn(
      base,
      "font-medium text-[color:var(--pk-foreground,#0f172a)] underline decoration-[color:var(--pk-primary,#0f172a)] decoration-2 underline-offset-8",
    );
  }

  return cn(
    base,
    "bg-[color:var(--pk-primary,#0f172a)]/8 font-medium text-[color:var(--pk-primary,#0f172a)]",
  );
}

export function resolvePreviewRegisterNavCtaClass(
  templateConfig: TemplateConfig,
) {
  const radius = resolvePreviewRegisterRadiusClass(templateConfig.radius);

  if (
    templateConfig.menuAccent === "none" ||
    templateConfig.menuStyle === "minimal"
  ) {
    return cn(
      "border border-[color:var(--pk-border,#e2e8f0)] bg-transparent px-4 py-2 text-sm font-medium text-[color:var(--pk-foreground,#0f172a)] transition-colors hover:bg-[color:var(--pk-muted,#f1f5f9)]",
      radius,
    );
  }

  return cn(
    "bg-[color:var(--pk-primary,#0f172a)] px-4 py-2 text-sm font-medium text-[color:var(--pk-primary-foreground,#fff)] transition-opacity hover:opacity-90",
    templateConfig.menuAccent === "strong" && "shadow-md shadow-black/10",
    radius,
  );
}
