import { describe, expect, test } from "bun:test";

import {
  colorSystems,
  createCarriedForwardSiteConfigurationInput,
  defineTemplateManifest,
  getRegisterTemplatesForPlan,
  getTemplateAiContentField,
  getTemplateDefinition,
  getTemplateEditableContentField,
  getTemplateEditableFieldsForPage,
  getTemplateManifest,
  getTemplatePageInventoryStrict,
  normalizeTemplateContentFieldUpdate,
  normalizeTemplateThemeFieldUpdate,
  registerTemplateCatalog,
  registerTemplatesByPlan,
  resolveTemplateRoute,
  type TemplateManifest,
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

    expect(manifest.defaultTheme.accentColor).toBe("#522C1F");
    expect(manifest.defaultTheme.backgroundColor).toBe("");
    expect(manifest.defaultTheme.chartColor).toBe("#907762");
    expect(manifest.defaultTheme.colorSystem).toBe("rubbait");
    expect(manifest.defaultTheme.stylePreset).toBe("lyra");
    expect(manifest.tags).toContain("register-template");
    expect(manifest.tags).toContain("project-history");
  });

  test("registers the Rubbait base color system used by Riwaq", () => {
    expect(colorSystems.rubbait?.name).toBe("Rubbait");
    expect(colorSystems.rubbait?.light.background).toBe("#ECECEC");
    expect(colorSystems.rubbait?.light.foreground).toBe("#08090A");
    expect(colorSystems.rubbait?.light.primary).toBe("#522C1F");
    expect(colorSystems.rubbait?.dark.primary).toBe("#907762");
  });

  test("keeps register variants owned by plan tier", () => {
    expect(registerTemplatesByPlan.starter).toHaveLength(1);
    expect(registerTemplatesByPlan.plus).toHaveLength(0);
    expect(registerTemplatesByPlan.pro).toHaveLength(0);
    expect(getRegisterTemplatesForPlan("starter").map((t) => t.tier)).toEqual([
      "starter",
    ]);
  });

  test("rejects duplicate editable field metadata", () => {
    const manifest = getTemplateManifest("template-1");
    const field = manifest.editableFields[0];

    expect(field).toBeDefined();
    expect(() =>
      defineTemplateManifest({
        ...manifest,
        editableFields: [
          field as TemplateManifest["editableFields"][number],
          field as TemplateManifest["editableFields"][number],
        ],
      }),
    ).toThrow(
      `Template "${manifest.key}" has duplicate editable field "${field?.contentKey}".`,
    );
  });

  test("requires editable fields to declare generation guidance", () => {
    const manifest = getTemplateManifest("template-1");

    expect(() =>
      defineTemplateManifest({
        ...manifest,
        editableFields: manifest.editableFields.map((field, index) =>
          index === 0
            ? {
                ...field,
                longDetail: "",
              }
            : field,
        ),
      }),
    ).toThrow(
      `Template manifest editable field long detail for "${manifest.key}:${manifest.editableFields[0]?.contentKey}" must not be empty.`,
    );
  });

  test("rejects editable content keys on data-source sections", () => {
    const manifest = getTemplateManifest("riwaq-starter");
    const home = manifest.pages.find((page) => page.pageKey === "home");
    const section = home?.sections[0];

    expect(home).toBeDefined();
    expect(section).toBeDefined();
    expect(() =>
      defineTemplateManifest({
        ...manifest,
        pages: [
          {
            ...home!,
            sections: [
              {
                ...section!,
                contentKeys: ["hero.title"],
                dataSource: "blog_posts",
              },
            ],
          },
        ],
      }),
    ).toThrow(
      `Template "${manifest.key}" section "${section?.id}" uses data source "blog_posts" and must not declare editable content keys.`,
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
      "blog-post",
      "contact",
      "roadmap",
      "privacy",
      "terms",
    ]);
  });

  test("declares page-specific Riwaq header content keys", () => {
    const inventory = getTemplatePageInventoryStrict("riwaq-starter");
    const contentKeysForPage = (pageKey: string) =>
      inventory.pages
        .find((page) => page.pageKey === pageKey)
        ?.sections.find(
          (section) => section.sectionType === "HeroBannerSection",
        )?.contentKeys;

    expect(contentKeysForPage("blog")).toEqual([
      "blog.eyebrow",
      "blog.title",
      "blog.subtitle",
    ]);
    expect(contentKeysForPage("contact")).toEqual([
      "contact.eyebrow",
      "contact.title",
      "contact.subtitle",
    ]);
    expect(contentKeysForPage("roadmap")).toEqual([
      "roadmap.eyebrow",
      "roadmap.title",
      "roadmap.subtitle",
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

  test("drives editable content validation from declared metadata", () => {
    const manifest = getTemplateManifest("template-1");
    const field = getTemplateEditableContentField(manifest, "hero.title");

    expect(field).toMatchObject({
      aiEnabled: true,
      contentKey: "hero.title",
      fieldType: "text",
      label: "Hero title",
    });
    expect(field?.longDetail).toContain("homepage headline");
  });

  test("rejects static section keys that are not declared editable metadata", () => {
    const manifest = getTemplateManifest("template-1");

    expect(() =>
      normalizeTemplateContentFieldUpdate(manifest, {}, "hero.cta", "Nope"),
    ).toThrow('Template "template-1" does not allow content key "hero.cta".');
  });

  test("allows only explicit page-scoped static aliases", () => {
    const manifest = getTemplateManifest("template-1");

    expect(
      normalizeTemplateContentFieldUpdate(
        manifest,
        {},
        "about.hero.title",
        "About this team",
      ),
    ).toEqual({ "about.hero.title": "About this team" });

    expect(() =>
      normalizeTemplateContentFieldUpdate(
        manifest,
        {},
        "about.story.title",
        "Nope",
      ),
    ).toThrow(
      'Template "template-1" does not allow content key "about.story.title".',
    );
  });

  test("keeps dynamic data-source item text outside the editable contract", () => {
    const manifest = getTemplateManifest("riwaq-starter");
    const blogFields = getTemplateEditableFieldsForPage(manifest, "blog").map(
      (field) => field.contentKey,
    );

    expect(blogFields).toContain("blog.title");
    expect(blogFields).not.toContain("blog_posts.title");
    expect(blogFields).not.toContain("blog.hero.title");
    expect(() =>
      normalizeTemplateContentFieldUpdate(
        manifest,
        {},
        "blog_posts.title",
        "Nope",
      ),
    ).toThrow(
      'Template "riwaq-starter" does not allow content key "blog_posts.title".',
    );
  });

  test("resolves only AI-enabled editable fields for field generation", () => {
    const manifest = getTemplateManifest("riwaq-starter");

    expect(getTemplateAiContentField(manifest, "hero.title")).toMatchObject({
      aiEnabled: true,
      contentKey: "hero.title",
      label: "Hero title",
    });
    expect(
      getTemplateAiContentField(manifest, "media.heroImage"),
    ).toBeUndefined();
    expect(
      getTemplateAiContentField(manifest, "blog_posts.title"),
    ).toBeUndefined();
  });

  test("rejects unknown content field updates", () => {
    const manifest = getTemplateManifest("template-1");

    expect(() =>
      normalizeTemplateContentFieldUpdate(manifest, {}, "unknown.key", "Nope"),
    ).toThrow(
      'Template "template-1" does not allow content key "unknown.key".',
    );
  });

  test("carries content and theme forward when switching templates", () => {
    const carried = createCarriedForwardSiteConfigurationInput({
      companyName: "Atlas Homes",
      contentJson: {
        "hero.title": "Keep my headline",
        "previous.only": "Keep this unused value",
      },
      market: "Lagos",
      subdomain: "atlas",
      templateKey: "riwaq-starter",
      themeJson: {
        colorSystem: "slate",
        fontFamily: "Inter",
        "namedImage.hero": "https://example.com/hero.jpg",
        stylePreset: "nova",
      },
    });

    expect(carried.templateKey).toBe("riwaq-starter");
    expect(carried.contentJson["hero.title"]).toBe("Keep my headline");
    expect(carried.contentJson["roadmap.title"]).toBe(
      "A visible record of delivery.",
    );
    expect(carried.contentJson["previous.only"]).toBe("Keep this unused value");
    expect(carried.themeJson.colorSystem).toBe("slate");
    expect(carried.themeJson.fontFamily).toBe("Inter");
    expect(carried.themeJson.stylePreset).toBe("nova");
    expect(
      (carried.themeJson as Record<string, string>)["namedImage.hero"],
    ).toBe("https://example.com/hero.jpg");

    const switchedBack = createCarriedForwardSiteConfigurationInput({
      companyName: "Atlas Homes",
      contentJson: carried.contentJson,
      market: "Lagos",
      subdomain: "atlas",
      templateKey: "template-1",
      themeJson: carried.themeJson as Record<string, string>,
    });

    expect(switchedBack.templateKey).toBe("template-1");
    expect(switchedBack.contentJson["hero.title"]).toBe("Keep my headline");
    expect(switchedBack.contentJson["roadmap.title"]).toBe(
      "A visible record of delivery.",
    );
    expect(
      (switchedBack.themeJson as Record<string, string>)["namedImage.hero"],
    ).toBe("https://example.com/hero.jpg");
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
