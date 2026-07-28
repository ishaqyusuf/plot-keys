import { afterEach, describe, expect, test } from "bun:test";

import {
  getAppUrlConfig,
  getDevAppUrlStrings,
  getDevAppUrls,
} from "./app-urls";

const originalEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SANDBOX_URL: process.env.NEXT_PUBLIC_SANDBOX_URL,
  NEXT_PUBLIC_TENANT_SITE_URL: process.env.NEXT_PUBLIC_TENANT_SITE_URL,
  PLOTKEYS_ENV_MODE: process.env.PLOTKEYS_ENV_MODE,
};

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("app URL production profile", () => {
  test("recognizes the canonical prod mode", () => {
    process.env.PLOTKEYS_ENV_MODE = "prod";

    expect(getAppUrlConfig("api")).toMatchObject({
      defaultProtocol: "https",
      isProduction: true,
    });
  });

  test("uses configured public URLs in the prod profile", () => {
    process.env.PLOTKEYS_ENV_MODE = "prod";
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    process.env.NEXT_PUBLIC_DASHBOARD_URL = "https://app.example.com";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.NEXT_PUBLIC_SANDBOX_URL = "https://sandbox.example.com";
    process.env.NEXT_PUBLIC_TENANT_SITE_URL = "https://tenant.example.com";

    expect(getDevAppUrlStrings()).toMatchObject({
      api: "https://api.example.com",
      dashboard: "https://app.example.com",
      sandbox: "https://sandbox.example.com",
      site: "https://example.com",
      tenantSite: "https://tenant.example.com",
    });
  });

  test("treats blank local URL variables as unset", () => {
    process.env.PLOTKEYS_ENV_MODE = "local";
    process.env.NEXT_PUBLIC_API_URL = "";
    process.env.NEXT_PUBLIC_DASHBOARD_URL = "";
    process.env.NEXT_PUBLIC_SITE_URL = "";
    process.env.NEXT_PUBLIC_SANDBOX_URL = "";
    process.env.NEXT_PUBLIC_TENANT_SITE_URL = "";

    expect(getDevAppUrls()).toMatchObject({
      api: "localhost:3902",
      dashboard: "localhost:3901",
      sandbox: "localhost:3909",
      site: "localhost:3900",
      tenantSite: "localhost:3903",
    });
  });
});
