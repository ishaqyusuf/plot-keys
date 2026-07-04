import { describe, expect, test } from "bun:test";

import {
  createRegistryMutationOptions,
  createRegistryQueryOptions,
  createTemplateUiResolver,
  RegistryMutationDisabledError,
  templateButtonVariants,
  templateInputVariants,
  templates,
} from "./index";
import type { RegistryContextValue } from "./runtime-context";

const liveCtx: RegistryContextValue = {
  isDevMode: false,
  mode: "live",
  page: {
    pageDisabled: false,
    pageKey: "contact",
    pageNotSupported: false,
    routeSlug: null,
  },
  renderMode: "live",
  templateConfig: { stylePreset: "lyra" },
  templateKey: "riwaq-starter",
  tenant: {
    companyId: "company_1",
    subdomain: "atlas",
  },
  theme: { stylePreset: "lyra" },
};

const devCtx: RegistryContextValue = {
  ...liveCtx,
  isDevMode: true,
  mode: "preview",
  renderMode: "preview",
};

describe("template page facade", () => {
  test("resolves supported page info from the manifest", () => {
    const { info } = templates.contactPage.resolve(liveCtx);

    expect(info.pageKey).toBe("contact");
    expect(info.pageNotSupported).toBe(false);
    expect(info.pageDisabled).toBe(false);
    expect(info.canonicalPath).toBe("/contact");
    expect(info.supportedPlans).toContain("starter");
  });

  test("marks unsupported pages without throwing", () => {
    const { info } = templates.agentsPage.resolve(liveCtx);

    expect(info.pageKey).toBe("agents");
    expect(info.pageNotSupported).toBe(true);
    expect(info.supportedPlans).toEqual([]);
  });

  test("keeps typed dynamic page route slugs in info", () => {
    const { info } = templates.blogContentPage.resolve({
      ...liveCtx,
      page: {
        pageDisabled: false,
        pageKey: "blog-post",
        pageNotSupported: true,
        routeSlug: "market-update",
      },
      templateKey: "riwaq-starter",
    });

    expect(info.pageNotSupported).toBe(true);
    expect(info.routeSlug).toBe("market-update");
  });
});

describe("tenant-scoped registry data contract", () => {
  test("injects tenant scope into query keys and uses dev resolver in dev mode", async () => {
    const options = createRegistryQueryOptions(
      devCtx,
      {
        dev: (_input: { section: string }, scope) =>
          `mock:${scope.tenant.subdomain}:${scope.dataMode}`,
        key: "sites.about",
        live: () => "live",
      },
      { section: "about" },
    );

    expect(options.queryKey[0]).toBe("tenant-site");
    expect(options.queryKey[1].tenant.companyId).toBe("company_1");
    expect(options.queryKey[1].dataMode).toBe("dev");
    expect(await options.queryFn()).toBe("mock:atlas:dev");
  });

  test("uses live resolver in live mode", async () => {
    const options = createRegistryQueryOptions(
      liveCtx,
      {
        dev: () => "mock",
        key: "sites.about",
        live: (_input: undefined, scope) =>
          `live:${scope.tenant.companyId}:${scope.dataMode}`,
      },
      undefined,
    );

    expect(options.queryKey).toHaveLength(3);
    expect(await options.queryFn()).toBe("live:company_1:live");
  });

  test("blocks mutations in dev mode unless a dev resolver is supplied", () => {
    const options = createRegistryMutationOptions(devCtx, {
      key: "sites.signupNewsletter",
      live: () => ({ ok: true }),
    });

    expect(() => options.mutationFn({ email: "hello@example.com" })).toThrow(
      RegistryMutationDisabledError,
    );
  });
});

describe("template UI variant primitives", () => {
  test("maps style presets into primitive radius classes", () => {
    expect(templateButtonVariants({ stylePreset: "nova" })).toContain(
      "rounded-full",
    );
    expect(templateInputVariants({ stylePreset: "maia" })).toContain(
      "rounded-sm",
    );
  });

  test("creates a template-scoped UI resolver from template config", () => {
    const ui = createTemplateUiResolver({ stylePreset: "lyra" });

    expect(ui.preset.key).toBe("lyra");
    expect(ui.button({ size: "lg" })).toContain("h-11");
    expect(ui.surface()).toContain("rounded-xl");
  });
});
