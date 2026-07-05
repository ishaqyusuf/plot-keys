import { describe, expect, it } from "bun:test";

import {
  buildTenantAppUrl,
  buildTenantHref,
  buildTenantRedirectUrl,
  getCustomDomainLookupHost,
  getTenantUrlHeaderNames,
  resolveTenantUrlContext,
  toInternalTenantPath,
} from "./tenant-url";

const config = {
  appRootDomain: "plotkeys.localhost",
  internalPrefix: "/_tenant",
  pathStyleHosts: ["localhost", "127.0.0.1", "0.0.0.0"],
  projectSlug: "plotkeys",
  reservedPaths: ["login", "settings"],
};

describe("tenant-url helpers", () => {
  it("builds stable tenant header names", () => {
    expect(getTenantUrlHeaderNames({ projectSlug: "Plot Keys" })).toEqual({
      accountId: "x-plot-keys-saas-account-id",
      domain: "x-plot-keys-domain",
      externalBasePath: "x-plot-keys-external-base-path",
      externalPath: "x-plot-keys-external-path",
      pathname: "x-plot-keys-pathname",
      urlStyle: "x-plot-keys-url-style",
    });

    expect(getTenantUrlHeaderNames({ headerPrefix: "x-pk" }).domain).toBe(
      "x-pk-domain",
    );
  });

  it("builds tenant app URLs for subdomain and path-style hosts", () => {
    expect(
      buildTenantAppUrl({
        currentHost: "app.plotkeys.com",
        currentProtocol: "https",
        path: "/dashboard",
        targetRootDomain: "plotkeys.com",
        tenantSlug: "acme",
      }),
    ).toBe("https://acme.plotkeys.com/dashboard");

    expect(
      buildTenantAppUrl({
        currentHost: "127.0.0.1:3901",
        currentProtocol: "http",
        path: "/dashboard",
        targetPort: 3901,
        targetRootDomain: "plotkeys.localhost",
        tenantSlug: "acme",
      }),
    ).toBe("http://127.0.0.1:3901/acme/dashboard");
  });

  it("resolves path-style tenant context and rewrites tenant hrefs", () => {
    const context = resolveTenantUrlContext(
      {
        host: "localhost:3901",
        pathname: "/acme/members",
        protocol: "http",
      },
      config,
    );

    expect(context).toMatchObject({
      externalBasePath: "/acme",
      externalPath: "/acme/members",
      internalPath: "/_tenant/acme/members",
      productPath: "/members",
      style: "path",
      tenantSlug: "acme",
    });
    expect(buildTenantHref(context, "/reports", config)).toBe("/acme/reports");
    expect(buildTenantHref(context, "/_tenant/acme/settings", config)).toBe(
      "/acme/settings",
    );
    expect(buildTenantHref(context, "?tab=activity", config)).toBe(
      "/acme/members?tab=activity",
    );
  });

  it("resolves subdomain and custom-domain context", () => {
    expect(
      resolveTenantUrlContext(
        {
          host: "dashboard.acme.plotkeys.com",
          pathname: "/reports",
          protocol: "https",
        },
        { ...config, appRootDomain: "plotkeys.com" },
      ),
    ).toMatchObject({
      internalPath: "/_tenant/acme/reports",
      productPath: "/reports",
      style: "subdomain",
      tenantSlug: "acme",
    });

    expect(getCustomDomainLookupHost("dashboard.summitpoint.app")).toBe(
      "summitpoint.app",
    );
    expect(
      resolveTenantUrlContext(
        { host: "summitpoint.app", pathname: "/contact" },
        { ...config, appRootDomain: "plotkeys.com" },
      ),
    ).toMatchObject({
      customDomainLookupHost: "summitpoint.app",
      style: "custom-domain",
      tenantSlug: null,
    });
  });

  it("builds internal paths and redirect URLs", () => {
    const context = resolveTenantUrlContext(
      { host: "acme.plotkeys.localhost", pathname: "/settings" },
      config,
    );

    expect(
      toInternalTenantPath({ tenantSlug: "acme" }, "/settings", config),
    ).toBe("/_tenant/acme/settings");
    expect(
      buildTenantRedirectUrl(
        context,
        "/reports?range=month",
        "http://acme.plotkeys.localhost/settings",
        config,
      ).toString(),
    ).toBe("http://acme.plotkeys.localhost/reports?range=month");
  });
});
