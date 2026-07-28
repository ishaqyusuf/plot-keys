#!/usr/bin/env bun

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
import { isLocalDatabaseHostname } from "./local-infra-command";

export type DatabaseMode = "local" | "prod" | "remote";
export type DatabaseOperation =
  | "drizzle-studio"
  | "generate"
  | "migrate"
  | "push"
  | "shell"
  | "studio";

export type DatabaseCommandOptions = {
  mode: DatabaseMode;
  operation: DatabaseOperation;
  passthrough: string[];
};

export type DatabaseTarget = "external" | "local" | "managed-local" | "missing";

type CommandEnv = Record<string, string | undefined>;

const MODE_FLAGS = new Map<string, DatabaseMode>([
  ["--local", "local"],
  ["--prod", "prod"],
  ["--remote", "remote"],
]);
const OPERATIONS = new Set<DatabaseOperation>([
  "drizzle-studio",
  "generate",
  "migrate",
  "push",
  "shell",
  "studio",
]);
const LOCAL_DATABASE_HOSTS = new Set([
  "0.0.0.0",
  "127.0.0.1",
  "[::1]",
  "::1",
  "localhost",
  "postgres",
]);

export function parseDatabaseCommandArgs(
  argv: string[],
): DatabaseCommandOptions {
  const operation = argv[0];

  if (!operation || !OPERATIONS.has(operation as DatabaseOperation)) {
    throw new Error(
      `Unknown database operation "${operation ?? ""}". Use generate, migrate, push, shell, studio, or drizzle-studio.`,
    );
  }

  let mode: DatabaseMode = "local";
  let explicitMode: DatabaseMode | undefined;
  const passthrough: string[] = [];

  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") {
      passthrough.push(...argv.slice(index + 1));
      break;
    }

    const nextMode = MODE_FLAGS.get(arg ?? "");

    if (!nextMode) {
      throw new Error(
        `Unknown database flag "${arg}". Use --local, --remote, --prod, or -- for command arguments.`,
      );
    }

    if (explicitMode && explicitMode !== nextMode) {
      throw new Error(
        `Conflicting database modes: --${explicitMode} and --${nextMode}.`,
      );
    }

    explicitMode = nextMode;
    mode = nextMode;
  }

  return {
    mode,
    operation: operation as DatabaseOperation,
    passthrough,
  };
}

export function classifyDatabaseTarget(
  databaseUrl: string | undefined,
): DatabaseTarget {
  if (!databaseUrl?.trim()) {
    return "missing";
  }

  try {
    const url = new URL(databaseUrl);
    const isManagedDockerHost =
      url.hostname === "postgres" && (!url.port || url.port === "5432");
    const isManagedHostPort =
      LOCAL_DATABASE_HOSTS.has(url.hostname) && url.port === "55432";

    if (isManagedDockerHost || isManagedHostPort) {
      return "managed-local";
    }

    return isLocalDatabaseHostname(url.hostname) ? "local" : "external";
  } catch {
    return "external";
  }
}

export function assertDatabaseTarget(
  mode: DatabaseMode,
  databaseUrl: string | undefined,
) {
  const target = classifyDatabaseTarget(databaseUrl);

  if (target === "missing") {
    throw new Error(
      `DATABASE_URL is missing for the ${mode} database profile.`,
    );
  }

  if (mode === "local" && target !== "managed-local") {
    throw new Error(
      [
        "Refusing to run a local database command against an external DATABASE_URL.",
        "Put the managed Docker URL in .env.local, or use the explicit :remote/:prod command.",
      ].join("\n"),
    );
  }

  if (mode !== "local" && (target === "local" || target === "managed-local")) {
    throw new Error(
      [
        `Refusing to run the ${mode} database command against a local Postgres URL.`,
        `Set DATABASE_URL in ${mode === "prod" ? ".env.prod" : ".env.remote.local"}.`,
      ].join("\n"),
    );
  }
}

function readEnvFile(filePath: string): CommandEnv {
  if (!existsSync(filePath)) {
    return {};
  }

  return parseEnv(readFileSync(filePath, "utf8"));
}

function productionEnv(workspaceRoot: string) {
  return readEnvFile(resolve(workspaceRoot, ".env.prod"));
}

function defaultLocalDatabaseUrl(env: CommandEnv) {
  return `postgresql://postgres:postgres@127.0.0.1:${env.DB_HOST_PORT ?? "55432"}/plotkeys`;
}

function nonEmpty(value: string | undefined) {
  return value?.trim() || undefined;
}

export function envForDatabaseCommand(
  options: DatabaseCommandOptions,
  workspaceRoot: string,
): CommandEnv {
  const localEnv = readEnvFile(resolve(workspaceRoot, ".env.local"));
  const selectedEnv =
    options.mode === "local"
      ? localEnv
      : options.mode === "remote"
        ? readEnvFile(resolve(workspaceRoot, ".env.remote.local"))
        : productionEnv(workspaceRoot);
  const databaseUrl =
    options.mode === "local"
      ? (nonEmpty(selectedEnv.LOCAL_DATABASE_URL) ??
        nonEmpty(selectedEnv.DATABASE_URL) ??
        defaultLocalDatabaseUrl(selectedEnv))
      : options.mode === "remote"
        ? (nonEmpty(selectedEnv.REMOTE_DEV_DATABASE_URL) ??
          nonEmpty(selectedEnv.DATABASE_URL))
        : (nonEmpty(selectedEnv.PROD_DATABASE_URL) ??
          nonEmpty(selectedEnv.DATABASE_URL));

  if (options.operation !== "generate") {
    assertDatabaseTarget(options.mode, databaseUrl);
  }

  return {
    ...(options.mode === "remote" ? localEnv : {}),
    ...selectedEnv,
    DATABASE_URL: databaseUrl,
    PLOTKEYS_DB_MODE: options.mode === "remote" ? "remote-dev" : options.mode,
  };
}

export function commandForDatabaseOperation(
  options: DatabaseCommandOptions,
  databaseUrl = process.env.DATABASE_URL,
): string[] {
  if (options.operation === "shell") {
    return ["psql", databaseUrl ?? "", ...options.passthrough];
  }

  const packageScript =
    options.operation === "migrate" && options.mode === "prod"
      ? "db:migrate:deploy"
      : options.operation === "drizzle-studio"
        ? "db:drizzle:studio"
        : `db:${options.operation}`;

  return ["bun", "run", packageScript, ...options.passthrough];
}

async function run(
  command: string[],
  options: { cwd: string; env?: CommandEnv },
) {
  const env = { ...process.env };

  if (options.env) {
    for (const [key, value] of Object.entries(options.env)) {
      if (value !== undefined) {
        env[key] = value;
      }
    }
  }

  const child = Bun.spawn(command, {
    cwd: options.cwd,
    env,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await child.exited;

  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}

async function main() {
  const options = parseDatabaseCommandArgs(Bun.argv.slice(2));
  const workspaceRoot = resolve(import.meta.dir, "..");
  const dbPackageDir = resolve(workspaceRoot, "packages/db");
  const withEnvPath = resolve(
    workspaceRoot,
    "../local-infra-kit/bin/with-env.ts",
  );

  if (!existsSync(dbPackageDir)) {
    throw new Error(`Could not find DB package at ${dbPackageDir}.`);
  }

  const env = envForDatabaseCommand(options, workspaceRoot);

  if (options.mode === "local" && options.operation !== "generate") {
    if (!existsSync(withEnvPath)) {
      throw new Error(
        `Could not find local-infra-kit env wrapper at ${withEnvPath}.`,
      );
    }

    await run(
      [
        "bun",
        "--env-file=/dev/null",
        withEnvPath,
        "--profile",
        "plotkeys",
        "--mode",
        "local",
        "--",
        "bun",
        "run",
        "dev:services",
      ],
      { cwd: workspaceRoot, env },
    );
  }

  const command = commandForDatabaseOperation(options, env.DATABASE_URL);

  await run(command, { cwd: dbPackageDir, env });
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
