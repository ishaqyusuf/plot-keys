import type { AppDefinition, GlobalNavSection } from "@plotkeys/app-store/registry";
import {
  getActiveLinkFromMap,
  getLinkModules,
  validateLinks,
  type NavModule,
} from "@plotkeys/site-nav";
import { createDashboardNavRegistry } from "./registry";

function normalizePath(pathname: string) {
  if (!pathname) {
    return "/";
  }

  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

function isPathActive(pathname: string, href: string) {
  const normalizedPath = normalizePath(pathname);
  const normalizedHref = normalizePath(href);

  return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
}

export function getVisibleDashboardNav(input: {
  activeApp: AppDefinition | null;
  globalTop: GlobalNavSection;
  platformGroup: GlobalNavSection;
}): NavModule[] {
  return validateLinks({
    linkModules: createDashboardNavRegistry(input),
  }).filter((module) =>
    module.sections.some((section) => section.links.some((item) => item.show)),
  );
}

export function getActiveDashboardNavItem(pathname: string, modules: NavModule[]) {
  const linksMap = getLinkModules(modules).linksNameMap;
  const active = getActiveLinkFromMap(pathname, linksMap);
  if (!active?.name) {
    return null;
  }

  const items = modules.flatMap((module) => module.sections.flatMap((section) => section.links));
  return items.find((item) => item.name === active.name && isPathActive(pathname, item.href ?? "")) ?? null;
}

export function getCurrentDashboardModule(pathname: string, modules: NavModule[]) {
  return (
    modules.find((module) =>
      module.sections.some((section) =>
        section.links.some((item) => item.show && isPathActive(pathname, item.href ?? "")),
      ),
    ) ??
    modules[0] ??
    null
  );
}

export function getDashboardQuickLinks(pathname: string, modules: NavModule[]) {
  const currentModule = getCurrentDashboardModule(pathname, modules);

  if (!currentModule) {
    return [];
  }

  return currentModule.sections
    .flatMap((section) => section.links)
    .filter((item) => item.show && item.href)
    .map((item) => ({
      href: item.href as string,
      isActive: isPathActive(pathname, item.href ?? ""),
      name: item.name,
      title: item.title,
    }));
}
