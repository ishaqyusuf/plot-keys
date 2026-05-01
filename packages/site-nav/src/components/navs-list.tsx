"use client";

import { cn } from "@plotkeys/utils";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  getActiveLinkFromMap,
  isPathInLink,
  normalizeNavPath,
} from "../lib/links";
import type { NavLink } from "../lib/types";
import { NavItem } from "./nav-item";
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

export function NavsList({
  mobile = false,
  onSelect,
}: {
  mobile?: boolean;
  onSelect?: () => void;
}) {
  const {
    activeLink,
    isExpanded: rawIsExpanded,
    linkModules,
    modules,
    props: { pathName },
  } = useSiteNav();
  const isExpanded = rawIsExpanded || mobile;
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [stableModuleName, setStableModuleName] = useState<string | null>(null);
  const normalizedPathName = useMemo(
    () => normalizeNavPath(pathName?.toLowerCase() ?? ""),
    [pathName],
  );
  const activeModuleName =
    getActiveLinkFromMap(pathName, linkModules.linksNameMap)?.module ??
    activeLink?.module ??
    null;
  const visibleModuleName = activeModuleName ?? stableModuleName;

  useEffect(() => {
    if (!activeModuleName) {
      return;
    }

    setStableModuleName((previous) =>
      previous === activeModuleName ? previous : activeModuleName,
    );
  }, [activeModuleName]);

  useEffect(() => {
    if (!isExpanded || !visibleModuleName) {
      return;
    }

    setExpandedModule((previous) => previous ?? visibleModuleName);
  }, [isExpanded, visibleModuleName]);

  return (
    <nav className="mt-3 w-full overflow-y-auto px-3 pb-24">
      <div className="flex flex-col gap-2">
        {modules.map((module) => {
          const isModuleExpanded =
            expandedModule === module.name ||
            (!expandedModule && activeModuleName === module.name);
          const isActiveModule = visibleModuleName === module.name;
          const showExpandedState = isExpanded && isModuleExpanded;
          const showCollapsedState = !isExpanded && isActiveModule;
          const showLinks = showExpandedState || showCollapsedState;

          return (
            <Fragment key={module.name}>
              <button
                aria-expanded={showLinks}
                type="button"
                onClick={() =>
                  setExpandedModule(isModuleExpanded ? null : module.name)
                }
                className={cn(
                  "group mb-1.5 hidden h-8 w-full cursor-pointer select-none items-center justify-between gap-2 rounded-lg px-2.5 text-left transition-colors duration-200 hover:bg-sidebar-accent/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isModuleExpanded &&
                    "bg-sidebar-accent text-sidebar-foreground",
                  isExpanded && "flex",
                )}
              >
                <span
                  className={cn(
                    "block min-w-0 flex-1 truncate text-[12px] font-medium tracking-[0.01em] text-sidebar-foreground/72 group-hover:text-sidebar-foreground",
                    isModuleExpanded && "font-semibold text-sidebar-foreground",
                  )}
                >
                  {module.title}
                </span>
                <ChevronDownIcon
                  className={cn(
                    "size-3.5 text-sidebar-foreground/40 transition-transform duration-200 group-hover:text-sidebar-foreground/70",
                    !showLinks && "-rotate-90",
                    isModuleExpanded && "text-sidebar-foreground/80",
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                  showLinks
                    ? "max-h-[3000px] opacity-100"
                    : "pointer-events-none max-h-0 opacity-0",
                )}
              >
                {module.sections.map((section) => (
                  <div
                    key={`${module.name}-${section.name}`}
                    className={cn(!section.linksCount && "hidden")}
                  >
                    {isExpanded && section.title ? (
                      <p className="mx-4 mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/38 first:mt-0">
                        {section.title}
                      </p>
                    ) : null}

                    {section.links
                      .filter((link) => link.show)
                      .map((link) => (
                        <NavItem
                          key={link.href ?? link.name}
                          isActive={isLinkActive(normalizedPathName, link)}
                          isExpanded={isExpanded}
                          item={link}
                          module={module}
                          onSelect={onSelect}
                          onToggle={() => setExpandedModule(module.name)}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}

function isLinkActive(pathname: string, link: NavLink) {
  if (!link || !pathname) {
    return false;
  }

  if (isPathInLink(pathname, link)) {
    return true;
  }

  return (link.subLinks ?? []).some((subLink) =>
    isPathInLink(pathname, subLink),
  );
}
