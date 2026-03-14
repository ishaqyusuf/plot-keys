import { cn } from "@plotkeys/utils/cn";
import type { ComponentPropsWithoutRef } from "react";

type BadgeVariant = "neutral" | "primary" | "accent" | "success";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  neutral:
    "border border-[color:var(--border)] bg-white/70 text-[color:var(--muted-foreground)]",
  primary: "border border-teal-200 bg-teal-50 text-teal-800",
  accent: "border border-amber-200 bg-amber-50 text-amber-800",
  success: "border border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em]",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
