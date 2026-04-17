"use client";

import { cn } from "@plotkeys/utils";
import type { LinkItem } from "../lib/types";
import { NavLink } from "./nav-link";

export function NavChildItem({
  child,
  isActive,
}: {
  child: LinkItem;
  isActive: boolean;
}) {
  if (!child.href || child.show === false) {
    return null;
  }

  return (
    <div className="pb-1 pl-14 pr-3">
      <NavLink
        href={child.href}
        className={cn(
          "block rounded-xl border px-3 py-2 text-sm transition-all duration-200",
          isActive
            ? "border-primary/15 bg-primary/8 text-primary"
            : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-background/65 hover:text-foreground",
        )}
      >
        {child.title ?? child.name}
      </NavLink>
    </div>
  );
}
