"use client";

import { cn } from "@plotkeys/utils";
import type { LinkItem } from "../lib/types";
import { NavLink } from "./nav-link";

export function NavChildItem({
  child,
  hasActiveChild: _hasActiveChild,
  index = 0,
  isActive,
  isExpanded: _isExpanded,
  isParentActive: _isParentActive,
  isParentHovered: _isParentHovered,
  onSelect,
  shouldShow = true,
}: {
  child: LinkItem;
  hasActiveChild?: boolean;
  index?: number;
  isActive: boolean;
  isExpanded?: boolean;
  isParentActive?: boolean;
  isParentHovered?: boolean;
  onSelect?: () => void;
  shouldShow?: boolean;
}) {
  if (!child.href || child.show === false) {
    return null;
  }

  const transitionDelay = shouldShow
    ? `${40 + index * 20}ms`
    : `${index * 20}ms`;

  return (
    <NavLink
      href={child.href}
      onClick={() => onSelect?.()}
      className="block group/child"
    >
      <div className="relative">
        <div
          className={cn(
            "ml-[35px] mr-[15px] h-[32px] flex items-center",
            "border-l border-[#e6e6e6] dark:border-[#1d1d1d] pl-3",
            "transition-all duration-200 ease-out",
            shouldShow
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2",
          )}
          style={{ transitionDelay }}
        >
          <span
            className={cn(
              "text-xs font-medium transition-colors duration-200",
              "text-[#888] group-hover/child:text-primary",
              "whitespace-nowrap overflow-hidden",
              isActive && "text-primary",
            )}
          >
            {child.title ?? child.name}
          </span>
        </div>
      </div>
    </NavLink>
  );
}
