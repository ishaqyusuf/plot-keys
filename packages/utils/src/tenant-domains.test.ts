import { describe, expect, it } from "bun:test";

import {
  buildDashboardCustomHostname,
  buildDashboardHostname,
  buildDashboardHostnameForTenantHostname,
  buildLocalDashboardCustomHostname,
  buildLocalDashboardHostname,
  buildLocalDashboardHostnameForTenantHostname,
  buildLocalSitefrontHostname,
  buildSitefrontHostname,
  buildTenantDashboardUrl,
  buildTenantSiteUrl,
  extractDashboardHostname,
  extractDashboardTenantSlug,
  extractSitefrontSubdomain,
  isTenantDashboardHost,
  resolveTenantSiteHostContext,
} from "./tenant-domains";

describe("tenant domain helpers", () => {
  it("builds production and local first-party hostnames", () => {
    expect(buildSitefrontHostname("Acme Homes")).toBe(
      "acme-homes.plotkeys.com",
    );
    expect(buildDashboardHostname("Acme Homes")).toBe(
      "dashboard.acme-homes.plotkeys.com",
    );
    expect(buildLocalSitefrontHostname("Acme Homes")).toBe(
      "acme-homes.tenant-plotkeys.localhost",
    );
    expect(buildLocalDashboardHostname("Acme Homes")).toBe(
      "dashboard.acme-homes.app-plotkeys.localhost",
    );
  });

  it("derives dashboard hostnames from site hostnames", () => {
    expect(buildDashboardHostnameForTenantHostname("acme.plotkeys.com")).toBe(
      "dashboard.acme.plotkeys.com",
    );
    expect(
      buildDashboardHostnameForTenantHostname("acme.tenant-plotkeys.localhost"),
    ).toBe("dashboard.acme.app-plotkeys.localhost");
    expect(
      buildLocalDashboardHostnameForTenantHostname("summitpoint.app"),
    ).toBe("dashboard.summitpoint.app.localhost");
    expect(
      buildLocalDashboardHostnameForTenantHostname("summitpoint.plotkeys.com"),
    ).toBe("dashboard.summitpoint.app-plotkeys.localhost");
    expect(buildDashboardHostnameForTenantHostname("acmehomes.com")).toBe(
      "dashboard.acmehomes.com",
    );
    expect(buildDashboardCustomHostname("dashboard.acmehomes.com")).toBe(
      "dashboard.acmehomes.com",
    );
    expect(buildLocalDashboardCustomHostname("summitpoint.app")).toBe(
      "dashboard.summitpoint.app.localhost",
    );
  });

  it("builds dashboard URLs using local host patterns when needed", () => {
    expect(
      buildTenantDashboardUrl("acme", {
        currentOrigin: "http://plotkeys.localhost:1355",
        pathname: "/onboarding",
      }),
    ).toBe("http://dashboard.acme.app-plotkeys.localhost:1355/onboarding");
    expect(
      buildTenantDashboardUrl("acme", {
        currentOrigin: "https://acme.plotkeys.com",
        pathname: "/onboarding",
      }),
    ).toBe("https://dashboard.acme.plotkeys.com/onboarding");
    expect(
      buildTenantSiteUrl("acme", {
        currentOrigin: "http://plotkeys.localhost:1355",
        pathname: "/",
      }),
    ).toBe("http://acme.tenant-plotkeys.localhost:1355/");
    expect(
      buildTenantSiteUrl("acme", {
        currentOrigin: "https://plotkeys.com",
        pathname: "/",
      }),
    ).toBe("https://acme.plotkeys.com/");
  });

  it("prefers provided tenant hostnames for production site and dashboard URLs", () => {
    expect(
      buildTenantDashboardUrl("acme", {
        currentOrigin: "https://plotkeys.com",
        tenantHostname: "summitpoint.app",
        pathname: "/onboarding",
      }),
    ).toBe("https://dashboard.summitpoint.app/onboarding");
    expect(
      buildTenantSiteUrl("acme", {
        currentOrigin: "https://plotkeys.com",
        tenantHostname: "summitpoint.app",
        pathname: "/",
      }),
    ).toBe("https://summitpoint.app/");
  });

  it("prefers provided tenant dashboard hostname even from a local origin", () => {
    expect(
      buildTenantDashboardUrl("summitpoint", {
        currentOrigin: "http://plotkeys.localhost:1355",
        tenantHostname: "summitpoint.app",
      }),
    ).toBe("http://dashboard.summitpoint.app.localhost:1355");
    expect(
      buildTenantDashboardUrl("summitpoint", {
        currentOrigin: "http://plotkeys.localhost:1355",
        tenantHostname: "summitpoint.plotkeys.com",
      }),
    ).toBe("http://dashboard.summitpoint.app-plotkeys.localhost:1355");
    expect(
      buildTenantDashboardUrl("summitpoint", {
        currentOrigin: "http://app-plotkeys.localhost:1355",
        tenantHostname: "summitpoint.tenant-plotkeys.localhost",
        pathname: "/onboarding",
      }),
    ).toBe("http://dashboard.summitpoint.app-plotkeys.localhost:1355/onboarding");
  });

  it("parses dashboard hosts without accepting the legacy public alias", () => {
    expect(extractDashboardTenantSlug("dashboard.acme.plotkeys.com")).toBe(
      "acme",
    );
    expect(
      extractDashboardTenantSlug("dashboard.acme.app-plotkeys.localhost:1355"),
    ).toBe("acme");
    expect(extractDashboardTenantSlug("acme.plotkeys.com")).toBeNull();
    expect(isTenantDashboardHost("dashboard.acmehomes.com")).toBe(true);
    expect(extractDashboardHostname("dashboard.acmehomes.com")).toBe(
      "dashboard.acmehomes.com",
    );
  });

  it("parses public tenant hosts and rejects dashboard hosts", () => {
    expect(extractSitefrontSubdomain("acme.plotkeys.com")).toBe("acme");
    expect(extractSitefrontSubdomain("acme.tenant-plotkeys.localhost")).toBe(
      "acme",
    );
    expect(extractSitefrontSubdomain("dashboard.acme.plotkeys.com")).toBeNull();
    expect(
      resolveTenantSiteHostContext("dashboard.acme.app-plotkeys.localhost"),
    ).toEqual({
      tenantHostname: null,
      tenantSubdomain: null,
    });
    expect(resolveTenantSiteHostContext("acmehomes.com")).toEqual({
      tenantHostname: "acmehomes.com",
      tenantSubdomain: null,
    });
  });
});
