import type { StylePresetDefinition } from "../../../../template-config";

export type RiwaqRadiusSlot = "hero" | "panel" | "pill";

export function joinClasses(
  ...classes: Array<string | false | null | undefined>
) {
  return classes.filter(Boolean).join(" ");
}

export function resolveRiwaqRadiusClass(
  radius: string | undefined,
  slot: RiwaqRadiusSlot,
) {
  if (radius === "none") return "rounded-none";
  if (radius === "sm") return slot === "hero" ? "rounded-lg" : "rounded-md";
  if (radius === "md") return slot === "hero" ? "rounded-xl" : "rounded-lg";
  if (radius === "lg") return slot === "hero" ? "rounded-2xl" : "rounded-xl";
  if (radius === "full") {
    return slot === "pill" ? "rounded-full" : "rounded-3xl";
  }

  return slot === "hero" ? "rounded-[2rem]" : "rounded-2xl";
}

export function riwaqSectionClassName(
  preset: StylePresetDefinition,
  className?: string,
) {
  return joinClasses(
    "bg-[color:var(--pk-background,#ffffff)] text-[color:var(--pk-foreground,#0f172a)]",
    preset.spacing.containerX,
    preset.spacing.sectionY,
    className,
  );
}

export function resolveMenuPillClass({
  emphasis,
  menuAccent,
  menuStyle,
}: {
  emphasis: "brand" | "market";
  menuAccent?: string;
  menuStyle?: string;
}) {
  const base =
    "rounded-full px-4 py-2 text-sm font-medium shadow-sm backdrop-blur";

  if (menuAccent === "strong" && emphasis === "market") {
    return joinClasses(
      base,
      "border border-transparent bg-[color:var(--pk-primary,#2563eb)] text-[color:var(--pk-primary-foreground,#fff)]",
    );
  }

  if (menuStyle === "minimal") {
    return joinClasses(
      base,
      "border border-transparent bg-transparent text-[color:var(--pk-foreground,#0f172a)] shadow-none",
    );
  }

  if (menuStyle === "bordered" || menuStyle === "default-solid") {
    return joinClasses(
      base,
      "border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#fff)] text-[color:var(--pk-foreground,#0f172a)]",
    );
  }

  return joinClasses(
    base,
    "border border-white/45 bg-white/[0.82] text-slate-950",
    menuAccent === "none" && "text-[color:var(--pk-foreground,#0f172a)]",
    menuAccent === "subtle" &&
      emphasis === "market" &&
      "text-[color:var(--pk-primary,#2563eb)]",
  );
}
