import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  envForMode,
  modeForCommand,
  validateDatabaseForMode,
} from "./local-infra-command";

describe("Plot Keys root environment launcher", () => {
  test("resolves explicit and inherited environment modes", () => {
    expect(modeForCommand("dev", [])).toBe("local");
    expect(modeForCommand("dev", ["--dev"])).toBe("dev");
    expect(modeForCommand("dev", ["--preview"])).toBe("preview");
    expect(() => modeForCommand("dev", ["--remote"])).toThrow(
      "Unknown local-infra mode flag",
    );
    expect(() => modeForCommand("dev", ["--remote-dev"])).toThrow(
      "Unknown local-infra mode flag",
    );
    expect(modeForCommand("dev", ["--prod"])).toBe("prod");
    expect(
      modeForCommand("with-env", [], { PLOTKEYS_ENV_MODE: "preview" }),
    ).toBe("preview");
    expect(modeForCommand("dev-services", ["--mode", "prod"])).toBe("prod");
  });

  test("rejects conflicting mode flags", () => {
    expect(() => modeForCommand("dev", ["--local", "--prod"])).toThrow(
      "Conflicting local-infra modes",
    );
  });

  test("does not parse child command flags after the delimiter", () => {
    expect(
      modeForCommand("with-env", [
        "--mode",
        "preview",
        "--",
        "child-command",
        "--mode",
        "prod",
      ]),
    ).toBe("preview");
    expect(
      modeForCommand("dev", ["--preview", "--", "child-command", "--prod"]),
    ).toBe("preview");
  });

  test("makes the selected root profile authoritative", () => {
    const root = mkdtempSync(join(tmpdir(), "plotkeys-root-env-"));

    try {
      writeFileSync(
        join(root, ".env.example"),
        "DATABASE_URL=\nAPP_ENV=\nPAYSTACK_SECRET_KEY=\n",
      );
      writeFileSync(
        join(root, ".env.local"),
        "DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/plotkeys\nAPP_ENV=local\n",
      );
      writeFileSync(
        join(root, ".env.preview"),
        "DATABASE_URL=postgresql://preview.example.com/plotkeys\nAPP_ENV=preview\n",
      );

      const env = envForMode("preview", root, {
        DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys",
        APP_ENV: "shell",
      });

      expect(env.DATABASE_URL).toBe("postgresql://preview.example.com/plotkeys");
      expect(env.APP_ENV).toBe("preview");
      expect(env.PLOTKEYS_ENV_MODE).toBe("preview");
      expect(env.PLOTKEYS_DB_MODE).toBe("preview");
      expect(env.PAYSTACK_SECRET_KEY).toBeUndefined();
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  test("loads shared defaults plus exactly one selected profile", () => {
    const root = mkdtempSync(join(tmpdir(), "plotkeys-root-env-"));

    try {
      writeFileSync(
        join(root, ".env.example"),
        "DATABASE_URL=\nPAYSTACK_SECRET_KEY=\n",
      );
      writeFileSync(join(root, ".env"), "OLD_APP_PORT=9999\n");
      writeFileSync(
        join(root, ".env.local"),
        "DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/plotkeys\nPAYSTACK_SECRET_KEY=\n",
      );
      writeFileSync(join(root, ".env.preview"), "APP_ENV=preview\n");
      writeFileSync(join(root, ".env.production"), "APP_ENV=prod\n");

      const local = envForMode("local", root, {
        DATABASE_URL: "postgresql://external.example.com/plotkeys",
        PAYSTACK_SECRET_KEY: "shell-secret",
      });
      expect(local.DATABASE_URL).toBe(
        "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys",
      );
      expect(local.PAYSTACK_SECRET_KEY).toBe("");
      expect(local.OLD_APP_PORT).toBe("9999");

      for (const mode of ["preview", "prod"] as const) {
        const env = envForMode(mode, root, {
          DATABASE_URL: "postgresql://external.example.com/plotkeys",
        });
        expect(() => validateDatabaseForMode(mode, env)).toThrow(
          `Missing DATABASE_URL for ${mode} mode`,
        );
      }
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  test("uses base values but never inherits its DATABASE_URL", () => {
    const root = mkdtempSync(join(tmpdir(), "plotkeys-root-env-"));

    try {
      writeFileSync(join(root, ".env.local"), "");
      writeFileSync(
        join(root, ".env"),
        "APP_ENV=shared\nDATABASE_URL=postgresql://base.example.com/plotkeys\n",
      );
      writeFileSync(join(root, ".env.production"), "");
      writeFileSync(
        join(root, ".env.prod"),
        "DATABASE_URL=postgresql://legacy.example.com/plotkeys\nAPP_ENV=legacy-prod\n",
      );

      expect(envForMode("local", root, {}).APP_ENV).toBe("shared");
      expect(envForMode("local", root, {}).DATABASE_URL).toBeUndefined();
      expect(envForMode("prod", root, {}).APP_ENV).toBe("shared");
      expect(envForMode("prod", root, {}).DATABASE_URL).toBeUndefined();
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  test("requires the standard production profile file", () => {
    const root = mkdtempSync(join(tmpdir(), "plotkeys-root-env-"));

    try {
      writeFileSync(
        join(root, ".env.prod"),
        "DATABASE_URL=postgresql://legacy.example.com/plotkeys\n",
      );

      expect(() => envForMode("prod", root, {})).toThrow(
        "Missing .env.production",
      );
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  test("allows local database URLs in every explicit profile", () => {
    for (const mode of ["local", "dev", "preview", "prod"] as const) {
      for (const databaseUrl of [
        "postgresql://postgres:postgres@[::1]:55432/plotkeys",
        "postgresql://postgres:postgres@127.0.0.2:55432/plotkeys",
        "postgresql://postgres:postgres@127.1.2.3:55432/plotkeys",
        "postgresql://postgres:postgres@[::ffff:127.0.0.1]:55432/plotkeys",
        "postgresql://postgres:postgres@[::ffff:7f00:1]:55432/plotkeys",
        "postgresql://postgres:postgres@database.localhost:55432/plotkeys",
      ]) {
        expect(() =>
          validateDatabaseForMode(mode, { DATABASE_URL: databaseUrl }),
        ).not.toThrow();
      }
    }
  });
});
