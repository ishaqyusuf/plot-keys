import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assertDatabaseTarget,
  classifyDatabaseTarget,
  commandForDatabaseOperation,
  envForDatabaseCommand,
  parseDatabaseCommandArgs,
} from "./db-command";

const temporaryRoots: string[] = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { force: true, recursive: true });
  }
});

function temporaryRoot() {
  const root = mkdtempSync(join(tmpdir(), "plotkeys-db-command-"));
  temporaryRoots.push(root);
  return root;
}

describe("database command profile guard", () => {
  test("defaults database commands to the local profile", () => {
    expect(parseDatabaseCommandArgs(["migrate"])).toEqual({
      mode: "local",
      operation: "migrate",
      passthrough: [],
    });
  });

  test("parses profiles and command passthrough arguments", () => {
    expect(parseDatabaseCommandArgs(["push", "--remote"]).mode).toBe("remote");
    expect(
      parseDatabaseCommandArgs(["push", "--prod", "--", "--accept-data-loss"]),
    ).toEqual({
      mode: "prod",
      operation: "push",
      passthrough: ["--accept-data-loss"],
    });
  });

  test("maps production migration to deploy", () => {
    expect(
      commandForDatabaseOperation({
        mode: "prod",
        operation: "migrate",
        passthrough: [],
      }),
    ).toEqual(["bun", "run", "db:migrate:deploy"]);
  });

  test("distinguishes the managed Docker target from other local URLs", () => {
    expect(
      classifyDatabaseTarget(
        "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys",
      ),
    ).toBe("managed-local");
    expect(
      classifyDatabaseTarget(
        "postgresql://postgres:postgres@localhost:5432/plotkeys",
      ),
    ).toBe("local");
    expect(
      classifyDatabaseTarget(
        "postgresql://user:password@database.example.com:5432/plotkeys",
      ),
    ).toBe("external");
  });

  test("rejects external targets for local commands", () => {
    expect(() =>
      assertDatabaseTarget(
        "local",
        "postgresql://user:password@database.example.com:5432/plotkeys",
      ),
    ).toThrow("Refusing to run a local database command");
  });

  test("rejects local or missing targets for non-local commands", () => {
    const localUrl = "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";

    expect(() => assertDatabaseTarget("remote", localUrl)).toThrow(
      "Refusing to run the remote database command",
    );
    expect(() =>
      assertDatabaseTarget(
        "prod",
        "postgresql://postgres:postgres@localhost:5432/plotkeys",
      ),
    ).toThrow("Refusing to run the prod database command");
    expect(() =>
      assertDatabaseTarget(
        "prod",
        "postgresql://postgres:postgres@[::1]:5432/plotkeys",
      ),
    ).toThrow("Refusing to run the prod database command");
    expect(() =>
      assertDatabaseTarget(
        "prod",
        "postgresql://postgres:postgres@127.1.2.3:5432/plotkeys",
      ),
    ).toThrow("Refusing to run the prod database command");
    expect(() =>
      assertDatabaseTarget(
        "remote",
        "postgresql://postgres:postgres@[::ffff:7f00:1]:5432/plotkeys",
      ),
    ).toThrow("Refusing to run the remote database command");
    expect(() => assertDatabaseTarget("prod", undefined)).toThrow(
      "DATABASE_URL is missing",
    );
  });

  test("uses the managed Docker default when the local env is neutral", () => {
    const root = temporaryRoot();
    writeFileSync(join(root, ".env.local"), "DATABASE_URL=\n");

    const env = envForDatabaseCommand(
      { mode: "local", operation: "push", passthrough: [] },
      root,
    );

    expect(env.DATABASE_URL).toBe(
      "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys",
    );
    expect(env.PLOTKEYS_DB_MODE).toBe("local");
  });

  test("requires remote DATABASE_URL in the remote override file", () => {
    const root = temporaryRoot();
    writeFileSync(
      join(root, ".env.local"),
      "DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/plotkeys\n",
    );

    expect(() =>
      envForDatabaseCommand(
        { mode: "remote", operation: "push", passthrough: [] },
        root,
      ),
    ).toThrow("DATABASE_URL is missing for the remote database profile");
  });

  test("pins the selected production DATABASE_URL over local env", () => {
    const root = temporaryRoot();
    writeFileSync(
      join(root, ".env.local"),
      "DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/plotkeys\n",
    );
    writeFileSync(
      join(root, ".env.prod"),
      "DATABASE_URL=postgresql://prod.example.com/plotkeys\n",
    );

    const env = envForDatabaseCommand(
      { mode: "prod", operation: "push", passthrough: [] },
      root,
    );

    expect(env.DATABASE_URL).toBe("postgresql://prod.example.com/plotkeys");
    expect(env.PLOTKEYS_DB_MODE).toBe("prod");
  });
});
