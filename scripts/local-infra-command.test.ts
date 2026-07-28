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

  test("makes the selected root profile authoritative", () => {
    const root = mkdtempSync(join(tmpdir(), "plotkeys-root-env-"));

    try {
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
      expect(() =>
        validateDatabaseForMode(mode, {
          DATABASE_URL: "postgresql://postgres:postgres@[::1]:55432/plotkeys",
        }),
      ).toThrow(`Refusing ${mode} mode with a local DATABASE_URL`);
    }
  });
});
