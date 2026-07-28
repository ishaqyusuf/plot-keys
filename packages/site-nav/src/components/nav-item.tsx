"use client";

import { cn } from "@plotkeys/utils";
import type { MouseEvent } from "react";
import { isPathInLink, normalizeNavPath } from "../lib/links";
import type { NavLink as NavLinkType, NavModule } from "../lib/types";
import { NavChildItem } from "./nav-child-item";
import { NavLink } from "./nav-link";
import { useSiteNav } from "./use-site-nav";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M5 7.5 10 12.5l5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function NavItem({
  isActive,
  isExpanded,
  isItemExpanded,
  item,
  onSelect,
  onToggle,
}: {
  isActive: boolean;
  isExpanded: boolean;
  isItemExpanded: boolean;
  item: NavLinkType;
  module: NavModule;
  onSelect?: () => void;
  onToggle: () => void;
}) {
  const {
    props: { pathName },
  } = useSiteNav();
  const normalizedPathName = normalizeNavPath(pathName?.toLowerCase() ?? "");
  const hasChildren = Boolean(item?.subLinks?.length);
  const ItemIcon = item?.icon;
  const hasActiveChild = hasChildren
    ? item?.subLinks?.some((child) => isPathInLink(normalizedPathName, child))
    : false;
  const shouldShowChildren = isExpanded && isItemExpanded;

  if (!item) {
    return null;
  }

  if (!item?.href && !hasChildren) {
    return null;
  }

  return (
    <div className="group">
      <NavLink
        href={item?.href ?? "#"}
        className="group"
        onClick={() => onSelect?.()}
      >
        <div className="relative">
          <div
            className={cn(
              "border border-transparent h-[40px] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ml-[15px] mr-[15px]",
              isActive
                ? "bg-[#f7f7f7] dark:bg-[#131313] border-[#e6e6e6] dark:border-[#1d1d1d]"
                : "bg-transparent",
              isExpanded ? "w-[calc(100%-30px)]" : "w-[40px]",
            )}
          />

          <div className="absolute top-0 left-[15px] w-[40px] h-[40px] flex items-center justify-center dark:text-[#666666] text-black group-hover:!text-primary pointer-events-none">
            <div className={cn(isActive && "dark:!text-white")}>
              {ItemIcon ? (
                <ItemIcon className="size-5" />
              ) : (
                <span className="block size-2 rounded-full bg-current" />
              )}
            </div>
          </div>

          {isExpanded ? (
            <div className="absolute top-0 left-[55px] right-[4px] h-[40px] flex items-center pointer-events-none">
              <span
                className={cn(
                  "text-sm font-medium transition-opacity duration-200 ease-in-out text-[#666] group-hover:text-primary",
                  "whitespace-nowrap overflow-hidden",
                  hasChildren ? "pr-2" : "",
                  isActive && "text-primary",
                )}
              >
                {item.title ?? item.name}
              </span>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggle();
                  }}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center transition-all duration-200 ml-auto mr-3",
                    "text-[#888] hover:text-primary pointer-events-auto",
                    isActive && "text-primary/60",
                    shouldShowChildren && "rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-4" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </NavLink>

      {hasChildren ? (
        <div
          className={cn(
            "transition-all duration-300 ease-out overflow-hidden",
            shouldShowChildren ? "max-h-96 mt-1" : "max-h-0",
          )}
        >
          {item?.subLinks?.map((child, index) => (
            <NavChildItem
              key={child.href ?? child.name}
              child={child}
              hasActiveChild={Boolean(hasActiveChild)}
              index={index}
              isActive={isPathInLink(normalizedPathName, child)}
              isExpanded={isExpanded}
              isParentActive={isActive}
              isParentHovered={shouldShowChildren}
              onSelect={onSelect}
              shouldShow={shouldShowChildren}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
