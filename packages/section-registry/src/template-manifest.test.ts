import { describe, expect, test } from "bun:test";

import {
  getTemplateDefinition,
  getTemplateManifest,
  getTemplatePageInventoryStrict,
  getRegisterTemplatesForPlan,
  normalizeTemplateContentFieldUpdate,
  normalizeTemplateThemeFieldUpdate,
  registerTemplateCatalog,
  registerTemplatesByPlan,
  resolveTemplateRoute,
  templateCatalog,
  templateManifestCatalog,
} from "./index";

describe("template manifest registry", () => {
  test("keeps the compatibility catalog derived from manifests", () => {
    expect(templateManifestCatalog.map((template) => template.key)).toEqual(
      templateCatalog.map((template) => template.key),
    );
    expect(templateManifestCatalog).toHaveLength(5);
    expect(registerTemplateCatalog).toHaveLength(1);
    expect(templateManifestCatalog.map((template) => template.key)).toContain(
      "riwaq-starter",
    );
  });

  test("preserves register template styling and scoring metadata", () => {
    const manifest = getTemplateManifest("riwaq-starter");

    expect(manifest.defaultTheme.colorSystem).toBe("slate");
    expect(manifest.defaultTheme.stylePreset).toBe("lyra");
    expect(manifest.tags).toContain("register-template");
    expect(manifest.tags).toContain("project-history");
  });

  test("keeps register variants owned by plan tier", () => {
    expect(registerTemplatesByPlan.starter).toHaveLength(1);
    expect(registerTemplatesByPlan.plus).toHaveLength(0);
    expect(registerTemplatesByPlan.pro).toHaveLength(0);
    expect(getRegisterTemplatesForPlan("starter").map((t) => t.tier)).toEqual(
      ["starter"],
    );
  });

  test("fails clearly for unknown template keys", () => {
    expect(() => getTemplateDefinition("missing-template")).toThrow(
      'Unknown template "missing-template".',
    );
  });

  test("resolves exact routes through the manifest", () => {
    const route = resolveTemplateRoute("template-1", "/about");

    expect(route?.page.pageKey).toBe("about");
    expect(route?.routeSlug).toBeNull();
  });

  test("resolves register template routes through the manifest", () => {
    const route = resolveTemplateRoute("riwaq-starter", "/roadmap");

    expect(route?.page.pageKey).toBe("roadmap");
    expect(route?.routeSlug).toBeNull();
  });

  test("returns null for unmatched routes", () => {
    expect(resolveTemplateRoute("template-1", "/not-a-page")).toBeNull();
  });

  test("returns strict page inventory from the manifest", () => {
    const inventory = getTemplatePageInventoryStrict("riwaq-starter");

    expect(inventory.templateKey).toBe("riwaq-starter");
    expect(inventory.pages.map((page) => page.pageKey)).toEqual([
      "home",
      "blog",
      "contact",
      "roadmap",
      "privacy",
      "terms",
    ]);
  });

  test("normalizes allowed content field updates", () => {
    const manifest = getTemplateManifest("template-1");

    expect(
      normalizeTemplateContentFieldUpdate(
        manifest,
        {},
        "hero.title",
        "A better headline",
      ),
    ).toEqual({ "hero.title": "A better headline" });
  });

  test("rejects unknown content field updates", () => {
    const manifest = getTemplateManifest("template-1");

    expect(() =>
      normalizeTemplateContentFieldUpdate(manifest, {}, "unknown.key", "Nope"),
    ).toThrow('Template "template-1" does not allow content key "unknown.key".');
  });

  test("normalizes allowed theme field updates", () => {
    const manifest = getTemplateManifest("template-1");

    expect(
      normalizeTemplateThemeFieldUpdate(
        manifest,
        {},
        "seo.home.title",
        "Homepage title",
      ),
    ).toEqual({ "seo.home.title": "Homepage title" });
  });

  test("rejects unknown theme field updates", () => {
    const manifest = getTemplateManifest("template-1");

    expect(() =>
      normalizeTemplateThemeFieldUpdate(manifest, {}, "unsafe.key", "Nope"),
    ).toThrow('Template "template-1" does not allow theme key "unsafe.key".');
  });
});
