#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { readEnvFile } from "../../local-infra-kit/src/env";

export type LocalInfraEntrypoint = "dev" | "dev-services" | "with-env";
export type LocalInfraMode = "local" | "prod" | "remote";

type CommandEnv = Record<string, string | undefined>;

const PROFILE = "plotkeys";
const PROFILE_ENV_MODE = "PLOTKEYS_ENV_MODE";
const LOCAL_DATABASE_URL =
  "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
const LOCAL_DATABASE_HOSTS = new Set([
  "0.0.0.0",
  "::",
  "::1",
  "docker.for.mac.localhost",
  "host.docker.internal",
  "localhost",
  "postgres",
]);

export function modeForCommand(
  entrypoint: LocalInfraEntrypoint,
  args: string[],
  env: CommandEnv = process.env,
): LocalInfraMode {
  const modes = new Set<LocalInfraMode>();

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--") break;

    if (entrypoint === "dev") {
      if (arg === "--local") modes.add("local");
      if (arg === "--remote" || arg === "--remote-dev") modes.add("remote");
      if (arg === "--prod") modes.add("prod");
      continue;
    }

    if (arg === "--mode") {
      modes.add(normalizeMode(args[index + 1]));
      index += 1;
      continue;
    }

    if (arg?.startsWith("--mode=")) {
      modes.add(normalizeMode(arg.slice("--mode=".length)));
    }
  }

  if (modes.size > 1) {
    throw new Error("Conflicting local-infra modes. Choose one mode.");
  }

  return [...modes][0] ?? normalizeMode(env[PROFILE_ENV_MODE] ?? "local");
}

function normalizeMode(value: string | undefined): LocalInfraMode {
  if (value === "local" || value === "development") return "local";
  if (value === "remote" || value === "remote-dev") return "remote";
  if (value === "prod" || value === "production") return "prod";

  throw new Error(
    `Unknown local-infra mode "${value ?? ""}". Use local, remote, or prod.`,
  );
}

export function envForMode(
  mode: LocalInfraMode,
  workspaceRoot: string,
  processEnv: CommandEnv,
) {
  if (mode === "prod" && !existsSync(resolve(workspaceRoot, ".env.prod"))) {
    throw new Error(
      "Missing .env.prod. Production local-infra commands do not load legacy env files.",
    );
  }

  const baseEnv = { ...processEnv };
  const clearedKeys = new Set([
    ...Object.keys(readEnvFile(resolve(workspaceRoot, ".env.example"))),
    // Clear unsupported legacy keys so nested toolkit commands cannot reload
    // their values from .env over the selected root profile.
    ...Object.keys(readEnvFile(resolve(workspaceRoot, ".env"))),
  ]);

  for (const key of clearedKeys) {
    baseEnv[key] = "";
  }

  const fileEnv: CommandEnv =
    mode === "remote"
      ? {
          ...readEnvFile(resolve(workspaceRoot, ".env.local")),
          ...readEnvFile(resolve(workspaceRoot, ".env.remote.local")),
        }
      : readEnvFile(
          resolve(workspaceRoot, mode === "prod" ? ".env.prod" : ".env.local"),
        );

  if (mode === "local" && !fileEnv.DATABASE_URL?.trim()) {
    fileEnv.DATABASE_URL = LOCAL_DATABASE_URL;
  }

  return {
    ...baseEnv,
    ...fileEnv,
    PLOTKEYS_DB_MODE: mode === "remote" ? "remote-dev" : mode,
    PLOTKEYS_ENV_MODE: mode,
  };
}

function isLoopbackIpv4(hostname: string) {
  const octets = hostname.split(".");

  return (
    octets.length === 4 &&
    octets.every((octet) => /^\d+$/.test(octet) && Number(octet) <= 255) &&
    Number(octets[0]) === 127
  );
}

export function isLocalDatabaseHostname(hostname: string) {
  const normalized = hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "");

  if (
    LOCAL_DATABASE_HOSTS.has(normalized) ||
    normalized.endsWith(".localhost") ||
    isLoopbackIpv4(normalized)
  ) {
    return true;
  }

  if (normalized.startsWith("::ffff:")) {
    const mapped = normalized.slice("::ffff:".length);

    if (isLoopbackIpv4(mapped)) return true;

    const hexMatch = mapped.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);

    if (hexMatch?.[1] && Number.parseInt(hexMatch[1], 16) >> 8 === 127) {
      return true;
    }
  }

  return false;
}

export function validateDatabaseForMode(mode: LocalInfraMode, env: CommandEnv) {
  if (mode === "local") return;

  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      `Missing DATABASE_URL for ${mode} mode. Check the standard root profile file.`,
    );
  }

  try {
    if (isLocalDatabaseHostname(new URL(databaseUrl).hostname)) {
      throw new Error(
        `Refusing ${mode} mode with a local DATABASE_URL. Check the standard root profile file.`,
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Refusing ")) {
      throw error;
    }

    throw new Error(`Invalid DATABASE_URL for ${mode} mode.`);
  }
}

async function run(command: string[], cwd: string, env: CommandEnv) {
  const child = Bun.spawn(command, {
    cwd,
    env,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  process.exit(await child.exited);
}

async function main() {
  const [entrypointValue, ...args] = Bun.argv.slice(2);

  if (
    entrypointValue !== "dev" &&
    entrypointValue !== "dev-services" &&
    entrypointValue !== "with-env"
  ) {
    throw new Error(
      "Use local-infra-command.ts dev, dev-services, or with-env.",
    );
  }

  const workspaceRoot = resolve(import.meta.dir, "..");
  const mode = modeForCommand(entrypointValue, args);
  const effectiveEnv = envForMode(mode, workspaceRoot, process.env);

  validateDatabaseForMode(mode, effectiveEnv);

  const toolkitBin = resolve(
    workspaceRoot,
    `../local-infra-kit/bin/${entrypointValue}.ts`,
  );

  if (!existsSync(toolkitBin)) {
    throw new Error(
      `Could not find local-infra-kit entrypoint at ${toolkitBin}.`,
    );
  }

  await run(
    ["bun", "--env-file=/dev/null", toolkitBin, "--profile", PROFILE, ...args],
    workspaceRoot,
    effectiveEnv,
  );
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
