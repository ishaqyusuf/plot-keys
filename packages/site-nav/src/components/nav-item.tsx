"use client";

import { cn } from "@plotkeys/utils";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { isPathInLink, normalizeNavPath } from "../lib/links";
import type { NavLink as NavLinkType, NavModule } from "../lib/types";
import { NavChildItem } from "./nav-child-item";
import { NavLink } from "./nav-link";
import { useSiteNav } from "./use-site-nav";

const HOVER_EXPAND_DELAY_MS = 180;

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
  item,
  onSelect,
  onToggle,
}: {
  isActive: boolean;
  isExpanded: boolean;
  item: NavLinkType;
  module: NavModule;
  onSelect?: () => void;
  onToggle: (path?: string) => void;
}) {
  const {
    props: { pathName },
  } = useSiteNav();
  const normalizedPathName = normalizeNavPath(pathName?.toLowerCase() ?? "");
  const hasChildren = Boolean(item?.subLinks?.length);
  const ItemIcon = item?.icon;
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasActiveChild = hasChildren
    ? item?.subLinks?.some((child) => isPathInLink(normalizedPathName, child))
    : false;
  const shouldShowChildren =
    isExpanded && (isHovered || hasActiveChild || isActive);

  useEffect(
    () => () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    },
    [],
  );

  if (!item) {
    return null;
  }

  if (!item?.href && !hasChildren) {
    return null;
  }

  function handleMouseEnter() {
    if (hasChildren && !hasActiveChild && !isActive) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, HOVER_EXPAND_DELAY_MS);
      return;
    }

    setIsHovered(true);
  }

  function handleMouseLeave() {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setIsHovered(false);
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover state controls delayed child-link reveal for pointer users.
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <NavLink
        href={item?.href ?? "#"}
        className="group"
        onClick={() => onSelect?.()}
      >
        <div className="relative">
          <div
            className={cn(
              "ml-[10px] mr-[10px] h-[44px] rounded-[18px] border transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isActive
                ? "border-sidebar-border bg-sidebar-accent shadow-sm"
                : "border-transparent bg-transparent group-hover:border-sidebar-border/80 group-hover:bg-sidebar-accent/70",
              isExpanded ? "w-[calc(100%-20px)]" : "w-[44px]",
            )}
          />

          {isActive ? (
            <>
              <div className="absolute inset-y-[7px] left-[13px] w-[3px] rounded-full bg-sidebar-primary" />
              <div className="absolute inset-x-[10px] inset-y-0 rounded-[18px] bg-gradient-to-r from-sidebar-primary/10 to-transparent" />
            </>
          ) : null}

          <div className="pointer-events-none absolute left-[10px] top-0 flex h-[44px] w-[44px] items-center justify-center text-sidebar-foreground/48 group-hover:text-sidebar-foreground/88">
            <div className={cn(isActive && "text-sidebar-primary")}>
              {ItemIcon ? (
                <ItemIcon className="size-4" />
              ) : (
                <span className="block size-2 rounded-full bg-current" />
              )}
            </div>
          </div>

          {isExpanded ? (
            <div className="pointer-events-none absolute left-[58px] right-[10px] top-0 flex h-[44px] items-center">
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap text-sm font-medium tracking-[0.01em] text-sidebar-foreground/64 transition-colors duration-150 group-hover:text-sidebar-foreground",
                  hasChildren && "pr-2",
                  isActive && "font-semibold text-sidebar-foreground",
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
                    onToggle(item.href);
                  }}
                  className={cn(
                    "pointer-events-auto ml-auto mr-1 flex size-8 items-center justify-center rounded-full border border-transparent text-sidebar-foreground/42 transition-all duration-200 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    isActive && "text-sidebar-primary",
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
            "overflow-hidden transition-all duration-300 ease-in-out",
            shouldShowChildren ? "mt-1 max-h-96" : "max-h-0",
          )}
        >
          {item?.subLinks?.map((child) => (
            <NavChildItem
              key={child.href ?? child.name}
              child={child}
              hasActiveChild={Boolean(hasActiveChild)}
              isActive={isPathInLink(normalizedPathName, child)}
              isExpanded={isExpanded}
              isParentActive={isActive}
              isParentHovered={isHovered || Boolean(hasActiveChild) || isActive}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
