"use client";

import { cn } from "@plotkeys/utils";
import type { LinkItem } from "../lib/types";
import { NavLink } from "./nav-link";

export function NavChildItem({
  child,
  hasActiveChild: _hasActiveChild,
  isActive,
  isExpanded: _isExpanded,
  isParentActive: _isParentActive,
  isParentHovered: _isParentHovered,
  onSelect,
}: {
  child: LinkItem;
  hasActiveChild?: boolean;
  isActive: boolean;
  isExpanded?: boolean;
  isParentActive?: boolean;
  isParentHovered?: boolean;
  onSelect?: () => void;
}) {
  if (!child.href || child.show === false) {
    return null;
  }

  return (
    <div className="pb-1 pl-[58px] pr-3">
      <NavLink
        href={child.href}
        onClick={() => onSelect?.()}
        className={cn(
          "block rounded-xl border px-3 py-2 text-sm transition-all duration-200",
          isActive
            ? "border-sidebar-border bg-sidebar-accent text-sidebar-primary"
            : "border-transparent text-sidebar-foreground/54 hover:border-sidebar-border/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        {child.title ?? child.name}
      </NavLink>
    </div>
  );
}
