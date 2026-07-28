"use client";

import { useEffect, useMemo, useState } from "react";
import { isPathInLink, normalizeNavPath } from "../lib/links";
import type { NavLink } from "../lib/types";
import { NavItem } from "./nav-item";
import { useSiteNav } from "./use-site-nav";

export function NavsList({
  mobile = false,
  onSelect,
}: {
  mobile?: boolean;
  onSelect?: () => void;
}) {
  const {
    isExpanded: rawIsExpanded,
    modules,
    props: { pathName },
  } = useSiteNav();
  const isExpanded = rawIsExpanded || mobile;
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const normalizedPathName = useMemo(
    () => normalizeNavPath(pathName?.toLowerCase() ?? ""),
    [pathName],
  );
  const visibleLinks = useMemo(() => {
    const seen = new Set<string>();

    return modules.flatMap((module) =>
      module.sections.flatMap((section) =>
        section.links.flatMap((link) => {
          if (!link.show) {
            return [];
          }

          const key = link.href ?? `${module.name}-${section.name}-${link.name}`;

          if (seen.has(key)) {
            return [];
          }

          seen.add(key);
          return [{ key, link, module }];
        }),
      ),
    );
  }, [modules]);

  useEffect(() => {
    setExpandedItem(null);
  }, [isExpanded]);

  return (
    <div className="mt-4 w-full">
      <nav className="w-full">
        <div className="flex flex-col gap-2">
          {visibleLinks.map(({ key, link, module }) => (
            <NavItem
              key={key}
              isActive={isLinkActive(normalizedPathName, link)}
              isExpanded={isExpanded}
              isItemExpanded={expandedItem === key}
              item={link}
              module={module}
              onSelect={onSelect}
              onToggle={() =>
                setExpandedItem((previous) => (previous === key ? null : key))
              }
            />
          ))}
        </div>
      </nav>
    </div>
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
