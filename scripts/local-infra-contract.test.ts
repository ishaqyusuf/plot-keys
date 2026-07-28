import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const workspacePackageFiles = [
  ...readdirSync(resolve(root, "apps"), { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(resolve(root, "apps", entry.name, "package.json")),
    )
    .map((entry) => `apps/${entry.name}/package.json`),
  "packages/db/package.json",
  "packages/email/package.json",
  "packages/jobs/package.json",
];
const packageFiles = ["package.json", ...workspacePackageFiles];

function packageScripts(path: string): Record<string, string> {
  const contents = readFileSync(resolve(root, path), "utf8");
  return (
    (JSON.parse(contents) as { scripts?: Record<string, string> }).scripts ?? {}
  );
}

function exampleEnvKeys() {
  return readFileSync(resolve(root, ".env.example"), "utf8")
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
      return match?.[1] ? [match[1]] : [];
    });
}

describe("shared root environment contract", () => {
  test("suppresses Bun env preloading for every toolkit command", () => {
    for (const packageFile of packageFiles) {
      for (const [name, command] of Object.entries(
        packageScripts(packageFile),
      )) {
        if (
          !command.includes("local-infra-kit") &&
          !command.includes("local-infra-command")
        ) {
          continue;
        }

        expect(
          command,
          `${packageFile} ${name} must suppress Bun env preloading`,
        ).toContain("bun --env-file=/dev/null");
      }
    }

    expect(
      readFileSync(resolve(root, "scripts/db-command.ts"), "utf8"),
      "database service startup must suppress Bun env preloading",
    ).toContain('"--env-file=/dev/null"');
  });

  test("workspace dev scripts inherit the root-selected mode", () => {
    for (const packageFile of workspacePackageFiles) {
      const dev = packageScripts(packageFile).dev;

      if (!dev?.includes("with-env.ts")) {
        continue;
      }

      expect(dev, `${packageFile} dev must not force local mode`).not.toContain(
        "--mode local",
      );
    }
  });

  test("routes root infrastructure commands through the root launcher", () => {
    const scripts = packageScripts("package.json");

    expect(scripts.dev).toContain("local-infra-command.ts dev");
    expect(scripts["dev:services"]).toContain(
      "local-infra-command.ts dev-services",
    );
    expect(scripts.build).toContain(
      "local-infra-command.ts with-env --mode prod",
    );
    expect(scripts["email:test"]).toContain(
      "local-infra-command.ts with-env --mode local",
    );
  });

  test("uses only standard root profile files", () => {
    expect(existsSync(resolve(root, ".env.production"))).toBe(false);

    for (const path of [
      "apps/api/.env.example",
      "apps/dashboard/.env.example",
      "apps/tenant-site/.env.example",
      "apps/website/.env.example",
    ]) {
      expect(existsSync(resolve(root, path)), path).toBe(false);
    }

    const activeContract = [
      readFileSync(resolve(root, "package.json"), "utf8"),
      readFileSync(resolve(root, "turbo.json"), "utf8"),
      readFileSync(resolve(root, "scripts/db-command.ts"), "utf8"),
      readFileSync(resolve(root, "scripts/local-infra-command.ts"), "utf8"),
    ].join("\n");

    expect(activeContract).not.toContain(".env.production");
  });

  test("forwards every documented root variable through Turbo", () => {
    const turbo = JSON.parse(
      readFileSync(resolve(root, "turbo.json"), "utf8"),
    ) as { globalEnv?: string[] };
    const globalEnv = new Set(turbo.globalEnv ?? []);

    for (const key of exampleEnvKeys()) {
      expect(globalEnv.has(key), `${key} must be in turbo globalEnv`).toBe(
        true,
      );
    }
  });
});
