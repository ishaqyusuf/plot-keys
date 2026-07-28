"use client";

import { cn } from "../utils";

export function getStickyColumnClassName(index: number, className?: string) {
  if (index > 1) {
    return className;
  }

  return cn(
    "sticky z-20 bg-background after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-border/60",
    index === 0 ? "left-0" : "left-10",
    className,
  );
}
