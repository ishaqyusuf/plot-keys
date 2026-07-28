import { describe, expect, test } from "bun:test";
import {
  normalizeSandboxProfileRenderData,
  resolveSandboxPreviewRoute,
} from "./sandbox-profile";

const profile = {
  companyName: "Sandbox Estates",
  contentJson: { "hero.title": "Draft title" },
  id: "profile-1",
  market: "Lagos",
  profileJson: {
    live: {
      companyName: "Live Estates",
      contentJson: { "hero.title": "Live title" },
      sampleDataJson: {
        blogPosts: [{ id: "post-1", slug: "launch", title: "Launch" }],
      },
      subdomainLabel: "live-estates",
      templateKey: "riwaq-starter",
      themeJson: { accentColor: "#522C1F", colorSystem: "rubbait" },
    },
  },
  sampleDataJson: {
    blogPosts: [{ id: "draft-post", slug: "draft", title: "Draft" }],
  },
  shareId: "share-1",
  subdomainLabel: "sandbox-estates",
  templateKey: "riwaq-starter",
  themeJson: { accentColor: "orange", colorSystem: "taupe" },
};

describe("sandbox profile rendering", () => {
  test("normalizes draft data without touching production entities", () => {
    const result = normalizeSandboxProfileRenderData(profile, {
      routeSlug: "draft",
    });

    expect(result.companyName).toBe("Sandbox Estates");
    expect(result.currentBlogPost?.title).toBe("Draft");
    expect(result.content["hero.title"]).toBe("Draft title");
  });

  test("uses the saved live snapshot when requested", () => {
    const result = normalizeSandboxProfileRenderData(profile, {
      routeSlug: "launch",
      useLiveSnapshot: true,
    });

    expect(result.companyName).toBe("Live Estates");
    expect(result.currentBlogPost?.title).toBe("Launch");
    expect(result.content["hero.title"]).toBe("Live title");
  });

  test("resolves static and dynamic template paths", () => {
    expect(resolveSandboxPreviewRoute("riwaq-starter", "/contact")).toEqual({
      canonicalPath: "/contact",
      pageKey: "contact",
      routeSlug: null,
    });
    expect(resolveSandboxPreviewRoute("riwaq-starter", "/blog/launch")).toEqual(
      {
        canonicalPath: "/blog/launch",
        pageKey: "blog-post",
        routeSlug: "launch",
      },
    );
    expect(resolveSandboxPreviewRoute("riwaq-starter", "/unknown")).toBeNull();
  });
});
