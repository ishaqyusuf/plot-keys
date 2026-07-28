"use client";

import { cn } from "@plotkeys/utils";
import { type ReactNode, useEffect, useRef } from "react";
import { NavsList } from "./navs-list";
import { useSiteNav } from "./use-site-nav";

export function Sidebar({ children }: { children?: ReactNode }) {
  const { isExpanded, linkModules, mainMenuRef, setIsExpanded } = useSiteNav();
  const expandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
    },
    [],
  );

  if (linkModules.noSidebar) {
    return null;
  }

  return (
    <aside
      className={cn(
        "h-screen flex-shrink-0 flex-col desktop:overflow-hidden desktop:rounded-tl-[10px] desktop:rounded-bl-[10px] justify-between fixed top-0 pb-4 items-center hidden md:flex z-50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "bg-background border-r border-border",
        isExpanded ? "w-[240px]" : "w-[70px]",
      )}
    >
      <div
        ref={mainMenuRef}
        onMouseEnter={() => {
          if (expandTimeoutRef.current) {
            clearTimeout(expandTimeoutRef.current);
          }
          expandTimeoutRef.current = setTimeout(() => {
            setIsExpanded(true);
            expandTimeoutRef.current = null;
          }, 140);
        }}
        onMouseLeave={() => {
          if (expandTimeoutRef.current) {
            clearTimeout(expandTimeoutRef.current);
            expandTimeoutRef.current = null;
          }
          setIsExpanded(false);
        }}
        className="flex flex-col w-full pt-[70px] flex-1 border-b border-border mb-3"
      >
        <NavsList />
      </div>
      {children}
    </aside>
  );
}
