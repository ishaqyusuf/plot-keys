import { describe, expect, test } from "bun:test";

import { buildRuntimeAppUrl } from "./runtime-url";

describe("buildRuntimeAppUrl", () => {
  test("preserves the Portless proxy port when one is present", () => {
    const url = buildRuntimeAppUrl({
      config: {
        appPort: 3901,
        appRootDomain: "app-plotkeys.localhost:1355",
        defaultProtocol: "http",
        portlessRootDomain: "app-plotkeys.localhost:1355",
        productionRootDomain: "app.plotkeys.com",
      },
      currentHost: "app-plotkeys.localhost:1355",
      currentProtocol: "http",
      path: "/sign-up",
    });

    expect(url).toBe("http://app-plotkeys.localhost:1355/sign-up");
  });

  test("keeps the configured app port for bare localhost URLs", () => {
    const url = buildRuntimeAppUrl({
      config: {
        appPort: 3901,
        defaultProtocol: "http",
        portlessRootDomain: "app-plotkeys.localhost:1355",
      },
      currentHost: "localhost",
      currentProtocol: "http",
      path: "/sign-up",
    });

    expect(url).toBe("http://localhost:3901/sign-up");
  });
});
