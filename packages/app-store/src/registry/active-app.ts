import { GLOBAL_ROUTE_PREFIXES } from "./global-nav";
import type { AppDefinition } from "./types";

/**
 * Given a pathname and a list of apps, return the app that "owns" the route
 * via longest-prefix match against `homeRoute` plus every nav item href.
 *
 * Returns `null` for the global home ("/") and any route whose prefix is in
 * `GLOBAL_ROUTE_PREFIXES`.
 */
export function resolveActiveApp(
  pathname: string,
  apps: readonly AppDefinition[],
): AppDefinition | null {
  if (!pathname || pathname === "/") {
    return null;
  }

  for (const prefix of GLOBAL_ROUTE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return null;
    }
  }

  let best: { app: AppDefinition; length: number } | null = null;

  for (const app of apps) {
    const candidates = new Set<string>();
    candidates.add(app.homeRoute);
    for (const group of app.navGroups) {
      for (const item of group.items) {
        candidates.add(item.href);
      }
    }

    for (const candidate of candidates) {
      if (!candidate || candidate === "/") continue;
      if (pathname === candidate || pathname.startsWith(`${candidate}/`)) {
        if (!best || candidate.length > best.length) {
          best = { app, length: candidate.length };
        }
      }
    }
  }

  return best?.app ?? null;
}
