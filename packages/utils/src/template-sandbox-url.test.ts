import { describe, expect, test } from "bun:test";
import {
  buildLegacyTemplateSandboxPreviewRedirectUrl,
  buildLegacyTemplateSandboxProfileRedirectUrl,
  buildTemplateSandboxPath,
  buildTemplateSandboxProductionUrl,
  buildTemplateSandboxUrl,
} from "./template-sandbox-url";

describe("template sandbox urls", () => {
  test("builds stable sandbox paths", () => {
    expect(buildTemplateSandboxPath("abc123")).toBe("/preview/abc123");
    expect(buildTemplateSandboxPath("abc123", "/roadmap")).toBe(
      "/preview/abc123/roadmap",
    );
  });

  test("derives the sibling sandbox app url from a Portless origin", () => {
    expect(
      buildTemplateSandboxUrl("abc123", {
        currentOrigin: "https://app-plotkeys.localhost",
        pathname: "/contact",
      }),
    ).toBe("https://sandbox-plotkeys.localhost/preview/abc123/contact");
  });

  test("uses a configured production sandbox origin", () => {
    expect(
      buildTemplateSandboxUrl("abc123", {
        pathname: "/blog",
        sandboxOrigin: "https://sandbox.example.com",
      }),
    ).toBe("https://sandbox.example.com/preview/abc123/blog");
  });

  test("builds a production fallback url", () => {
    expect(buildTemplateSandboxProductionUrl("abc123")).toMatch(
      /^https:\/\/.+\/preview\/abc123$/,
    );
  });

  test("maps legacy preview paths and mode to the standalone app", () => {
    expect(
      buildLegacyTemplateSandboxPreviewRedirectUrl("abc123", {
        currentOrigin: "https://tenant-plotkeys.localhost",
        mode: "live",
        pathname: "/blog/launch",
      }),
    ).toBe(
      "https://sandbox-plotkeys.localhost/preview/abc123/blog/launch?mode=live",
    );
  });

  test("maps legacy editor query state to a standalone profile", () => {
    expect(
      buildLegacyTemplateSandboxProfileRedirectUrl("profile-1", {
        currentOrigin: "https://app-plotkeys.localhost",
        page: "contact",
        path: "/contact",
      }),
    ).toBe(
      "https://sandbox-plotkeys.localhost/profiles/profile-1?page=contact&path=%2Fcontact",
    );
  });
});
