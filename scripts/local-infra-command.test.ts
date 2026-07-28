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
    expect(modeForCommand("dev", ["--remote"])).toBe("remote");
    expect(modeForCommand("dev", ["--prod"])).toBe("prod");
    expect(
      modeForCommand("with-env", [], { PLOTKEYS_ENV_MODE: "remote" }),
    ).toBe("remote");
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
        "remote",
        "--",
        "child-command",
        "--mode",
        "prod",
      ]),
    ).toBe("remote");
    expect(
      modeForCommand("dev", ["--remote", "--", "child-command", "--prod"]),
    ).toBe("remote");
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
        join(root, ".env.remote.local"),
        "DATABASE_URL=postgresql://remote.example.com/plotkeys\nAPP_ENV=remote\n",
      );

      const env = envForMode("remote", root, {
        DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys",
        APP_ENV: "shell",
      });

      expect(env.DATABASE_URL).toBe("postgresql://remote.example.com/plotkeys");
      expect(env.APP_ENV).toBe("remote");
      expect(env.PLOTKEYS_ENV_MODE).toBe("remote");
      expect(env.PLOTKEYS_DB_MODE).toBe("remote-dev");
      expect(env.PAYSTACK_SECRET_KEY).toBe("");
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  test("clears inherited contract values and defaults the managed local database", () => {
    const root = mkdtempSync(join(tmpdir(), "plotkeys-root-env-"));

    try {
      writeFileSync(
        join(root, ".env.example"),
        "DATABASE_URL=\nPAYSTACK_SECRET_KEY=\n",
      );
      writeFileSync(join(root, ".env"), "OLD_APP_PORT=9999\n");
      writeFileSync(join(root, ".env.local"), "PAYSTACK_SECRET_KEY=\n");
      writeFileSync(join(root, ".env.remote.local"), "APP_ENV=remote\n");
      writeFileSync(join(root, ".env.prod"), "APP_ENV=prod\n");

      const local = envForMode("local", root, {
        DATABASE_URL: "postgresql://external.example.com/plotkeys",
        PAYSTACK_SECRET_KEY: "shell-secret",
      });
      expect(local.DATABASE_URL).toBe(
        "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys",
      );
      expect(local.PAYSTACK_SECRET_KEY).toBe("");
      expect(local.OLD_APP_PORT).toBe("");

      for (const mode of ["remote", "prod"] as const) {
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

  test("does not fall back to legacy root env files", () => {
    const root = mkdtempSync(join(tmpdir(), "plotkeys-root-env-"));

    try {
      writeFileSync(join(root, ".env.local"), "");
      writeFileSync(join(root, ".env"), "APP_ENV=legacy-local\n");
      writeFileSync(join(root, ".env.prod"), "");
      writeFileSync(
        join(root, ".env.production"),
        "DATABASE_URL=postgresql://legacy.example.com/plotkeys\nAPP_ENV=legacy-prod\n",
      );

      expect(envForMode("local", root, {}).APP_ENV).toBe("");
      expect(envForMode("prod", root, {}).APP_ENV).toBe("");
      expect(envForMode("prod", root, {}).DATABASE_URL).toBeUndefined();
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  test("requires the standard production profile file", () => {
    const root = mkdtempSync(join(tmpdir(), "plotkeys-root-env-"));

    try {
      writeFileSync(
        join(root, ".env.production"),
        "DATABASE_URL=postgresql://legacy.example.com/plotkeys\n",
      );

      expect(() => envForMode("prod", root, {})).toThrow("Missing .env.prod");
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  test("rejects local database URLs outside local mode", () => {
    for (const mode of ["remote", "prod"] as const) {
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
        ).toThrow(`Refusing ${mode} mode with a local DATABASE_URL`);
      }
    }
  });
});
