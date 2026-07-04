import { describe, expect, test } from "bun:test";
import {
  buildTemplateSandboxPath,
  buildTemplateSandboxProductionUrl,
  buildTemplateSandboxUrl,
} from "./template-sandbox-url";

describe("template sandbox urls", () => {
  test("builds stable sandbox paths", () => {
    expect(buildTemplateSandboxPath("abc123")).toBe("/sandbox/abc123");
    expect(buildTemplateSandboxPath("abc123", "/roadmap")).toBe(
      "/sandbox/abc123/roadmap",
    );
  });

  test("derives local tenant-site urls from dashboard origins", () => {
    expect(
      buildTemplateSandboxUrl("abc123", {
        currentOrigin: "http://app-plotkeys.localhost:3901",
        pathname: "/contact",
      }),
    ).toBe("http://tenant-plotkeys.localhost:3901/sandbox/abc123/contact");
  });

  test("uses configured production tenant-site origin", () => {
    expect(
      buildTemplateSandboxUrl("abc123", {
        pathname: "/blog",
        tenantSiteOrigin: "https://tenant.example.com",
      }),
    ).toBe("https://tenant.example.com/sandbox/abc123/blog");
  });

  test("builds a production fallback url", () => {
    expect(buildTemplateSandboxProductionUrl("abc123")).toMatch(
      /^https:\/\/.+\/sandbox\/abc123$/,
    );
  });
});
