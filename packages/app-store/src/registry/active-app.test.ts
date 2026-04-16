import { describe, expect, it } from "bun:test";

import { resolveActiveApp } from "./active-app";
import { APP_REGISTRY } from "./apps";

describe("resolveActiveApp", () => {
  it("returns null for the global home", () => {
    expect(resolveActiveApp("/", APP_REGISTRY)).toBeNull();
  });

  it("returns null for global routes", () => {
    expect(resolveActiveApp("/settings", APP_REGISTRY)).toBeNull();
    expect(resolveActiveApp("/billing", APP_REGISTRY)).toBeNull();
    expect(resolveActiveApp("/app-store", APP_REGISTRY)).toBeNull();
    expect(resolveActiveApp("/integrations", APP_REGISTRY)).toBeNull();
    expect(resolveActiveApp("/team", APP_REGISTRY)).toBeNull();
    expect(resolveActiveApp("/builder", APP_REGISTRY)).toBeNull();
  });

  it("matches the listings app from /properties", () => {
    const app = resolveActiveApp("/properties", APP_REGISTRY);
    expect(app?.id).toBe("listings");
  });

  it("matches nested routes like /properties/123", () => {
    const app = resolveActiveApp("/properties/123", APP_REGISTRY);
    expect(app?.id).toBe("listings");
  });

  it("matches /agents, /leads, /appointments to listings", () => {
    expect(resolveActiveApp("/agents", APP_REGISTRY)?.id).toBe("listings");
    expect(resolveActiveApp("/leads", APP_REGISTRY)?.id).toBe("listings");
    expect(resolveActiveApp("/appointments", APP_REGISTRY)?.id).toBe(
      "listings",
    );
  });

  it("matches hrm routes", () => {
    expect(resolveActiveApp("/hr/employees", APP_REGISTRY)?.id).toBe("hrm");
    expect(resolveActiveApp("/hr/payroll/new", APP_REGISTRY)?.id).toBe("hrm");
  });

  it("matches projects", () => {
    expect(resolveActiveApp("/projects", APP_REGISTRY)?.id).toBe("projects");
    expect(resolveActiveApp("/projects/abc/budget", APP_REGISTRY)?.id).toBe(
      "projects",
    );
  });

  it("prefers longer-prefix matches", () => {
    // /hr/employees is a listed nav item; /hr is not in the registry as its
    // own entry, so the longest match still wins cleanly.
    const app = resolveActiveApp("/hr/employees/42", APP_REGISTRY);
    expect(app?.id).toBe("hrm");
  });

  it("returns null for unknown routes", () => {
    expect(resolveActiveApp("/nonexistent", APP_REGISTRY)).toBeNull();
  });
});
