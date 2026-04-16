import { describe, expect, it } from "bun:test";

import { APP_REGISTRY, findAppById } from "./apps";
import {
  getAvailableApps,
  getEnabledApps,
  isAppAvailable,
  isAppEnabled,
} from "./plan";

describe("isAppAvailable", () => {
  it("starter tier only sees starter apps", () => {
    const listings = findAppById("listings");
    const hrm = findAppById("hrm");
    const projects = findAppById("projects");
    expect(listings && isAppAvailable(listings, "starter")).toBe(true);
    expect(hrm && isAppAvailable(hrm, "starter")).toBe(false);
    expect(projects && isAppAvailable(projects, "starter")).toBe(false);
  });

  it("plus tier unlocks plus-gated apps", () => {
    const hrm = findAppById("hrm");
    const crm = findAppById("crm");
    expect(hrm && isAppAvailable(hrm, "plus")).toBe(true);
    expect(crm && isAppAvailable(crm, "plus")).toBe(true);
  });

  it("pro tier gets everything", () => {
    for (const app of APP_REGISTRY) {
      expect(isAppAvailable(app, "pro")).toBe(true);
    }
  });
});

describe("getAvailableApps", () => {
  it("starter tier returns only starter-gated apps", () => {
    const ids = getAvailableApps("starter").map((a) => a.id);
    expect(ids).toContain("listings");
    expect(ids).toContain("blog");
    expect(ids).toContain("analytics");
    expect(ids).toContain("ai-assistant");
    expect(ids).not.toContain("hrm");
    expect(ids).not.toContain("crm");
    expect(ids).not.toContain("projects");
  });

  it("plus tier returns starter + plus apps", () => {
    const ids = getAvailableApps("plus").map((a) => a.id);
    expect(ids).toContain("hrm");
    expect(ids).toContain("crm");
    expect(ids).toContain("projects");
    expect(ids).toContain("listings");
  });
});

describe("getEnabledApps", () => {
  it("intersects available apps with enabled ids", () => {
    const enabled = getEnabledApps("plus", ["listings", "hrm", "projects"]);
    expect(enabled.map((a) => a.id).sort()).toEqual([
      "hrm",
      "listings",
      "projects",
    ]);
  });

  it("excludes apps gated above the current tier even if listed", () => {
    // tenant has "hrm" saved, but they're on starter — hrm should not leak in
    const enabled = getEnabledApps("starter", ["listings", "hrm"]);
    expect(enabled.map((a) => a.id)).toEqual(["listings"]);
  });

  it("returns empty when no enabled ids", () => {
    expect(getEnabledApps("pro", [])).toHaveLength(0);
  });
});

describe("isAppEnabled", () => {
  it("true when app is available and in enabled list", () => {
    expect(isAppEnabled("listings", "starter", ["listings"])).toBe(true);
  });

  it("false when app is enabled but gated above plan", () => {
    expect(isAppEnabled("hrm", "starter", ["hrm"])).toBe(false);
  });

  it("false when app is available but not enabled", () => {
    expect(isAppEnabled("blog", "starter", ["listings"])).toBe(false);
  });
});
