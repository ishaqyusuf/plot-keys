#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadModeEnv } from "../../local-infra-kit/src/env";

export type LocalInfraEntrypoint = "dev" | "dev-services" | "with-env";
export type LocalInfraMode = "local" | "dev" | "prod" | "preview";

type CommandEnv = Record<string, string | undefined>;

const PROFILE = "plotkeys";
const PROFILE_ENV_MODE = "PLOTKEYS_ENV_MODE";
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
      if (arg === "--remote" || arg === "--remote-dev") {
        throw new Error(
          `Unknown local-infra mode flag: ${arg}. Use --dev or --preview.`,
        );
      }
      if (arg === "--local") modes.add("local");
      if (arg === "--dev") modes.add("dev");
      if (arg === "--preview") modes.add("preview");
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
  if (value === "local") return "local";
  if (value === "dev" || value === "development") return "dev";
  if (value === "preview") return "preview";
  if (value === "prod" || value === "production") return "prod";

  throw new Error(
    `Unknown local-infra mode "${value ?? ""}". Use local, dev, preview, or prod.`,
  );
}

export function envForMode(
  mode: LocalInfraMode,
  workspaceRoot: string,
  processEnv: CommandEnv,
) {
  if (
    mode === "prod" &&
    !existsSync(resolve(workspaceRoot, ".env.production"))
  ) {
    throw new Error(
      "Missing .env.production. Production local-infra commands do not load filename aliases.",
    );
  }

  const fileEnv = loadModeEnv(workspaceRoot, mode);

  return {
    ...processEnv,
    ...fileEnv,
    PLOTKEYS_DB_MODE: mode,
    PLOTKEYS_ENV_MODE: mode,
  };
}

export function validateDatabaseForMode(mode: LocalInfraMode, env: CommandEnv) {
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      `Missing DATABASE_URL for ${mode} mode. Check the standard root profile file.`,
    );
  }

  try {
    new URL(databaseUrl);
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
