import { describe, expect, test } from "bun:test";

import {
  isTemplatePageSupported,
  resolveTenantRegistryPageInfo,
  resolveTenantRouteMatch,
} from "./tenant-route-map";

describe("tenant explicit route map", () => {
  test("maps public aliases to stable registry page keys", () => {
    expect(resolveTenantRouteMatch("/blogs")).toEqual({
      pageKey: "blog",
      routeSlug: null,
    });
    expect(resolveTenantRouteMatch("/contact-us")).toEqual({
      pageKey: "contact",
      routeSlug: null,
    });
    expect(resolveTenantRouteMatch("/our-project")).toEqual({
      pageKey: "projects",
      routeSlug: null,
    });
    expect(resolveTenantRouteMatch("/roadmap")).toEqual({
      pageKey: "roadmap",
      routeSlug: null,
    });
  });

  test("maps dynamic explicit routes to typed detail page keys", () => {
    expect(resolveTenantRouteMatch("/blogs/market-update")).toEqual({
      pageKey: "blog-post",
      routeSlug: "market-update",
    });
    expect(resolveTenantRouteMatch("/projects/lagoon-towers")).toEqual({
      pageKey: "project-detail",
      routeSlug: "lagoon-towers",
    });
    expect(resolveTenantRouteMatch("/rentals/lekki-flat")).toEqual({
      pageKey: "rental-detail",
      routeSlug: "lekki-flat",
    });
  });

  test("reports template page support by active plan manifest", () => {
    expect(isTemplatePageSupported("riwaq-starter", "blog")).toBe(true);
    expect(isTemplatePageSupported("riwaq-starter", "contact")).toBe(true);
    expect(isTemplatePageSupported("riwaq-starter", "roadmap")).toBe(true);
    expect(isTemplatePageSupported("riwaq-starter", "agents")).toBe(false);
  });

  test("builds registry page info for supported and unsupported pages", () => {
    expect(resolveTenantRegistryPageInfo("riwaq-starter", "/roadmap")).toEqual({
      canonicalPath: "/roadmap",
      pageDisabled: false,
      pageKey: "roadmap",
      pageNotSupported: false,
      routeSlug: null,
    });

    expect(resolveTenantRegistryPageInfo("riwaq-starter", "/agents")).toEqual({
      pageDisabled: false,
      pageKey: "agents",
      pageNotSupported: true,
      routeSlug: null,
    });
  });
});
