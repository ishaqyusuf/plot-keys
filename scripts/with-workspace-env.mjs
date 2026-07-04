#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDir, "..");

function parseArgs(argv) {
  const args = [...argv];
  let mode = process.env.NODE_ENV === "production" ? "production" : "local";

  while (args.length > 0) {
    const arg = args.shift();

    if (arg === "--") {
      break;
    }

    if (arg === "--mode") {
      mode = args.shift() ?? "";
      continue;
    }

    if (arg?.startsWith("--mode=")) {
      mode = arg.slice("--mode=".length);
      continue;
    }

    args.unshift(arg);
    break;
  }

  return { command: args, mode };
}

function parseEnvFile(filePath) {
  const parsed = {};

  if (!existsSync(filePath)) {
    return parsed;
  }

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/,
    );

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    let value = rawValue.trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

function envFilesForMode(mode) {
  if (mode === "production") {
    return [".env.production"];
  }

  if (mode === "local" || mode === "development") {
    return [".env.local", ".env", ".env.development"];
  }

  throw new Error(`Unknown env mode "${mode}". Use "local" or "production".`);
}

function loadModeEnv(mode) {
  for (const envFile of envFilesForMode(mode)) {
    const parsed = parseEnvFile(resolve(workspaceRoot, envFile));
    if (Object.keys(parsed).length > 0) return { envFile, parsed };
  }

  return { envFile: "", parsed: {} };
}

function mergeParsedEnvFiles(envFiles) {
  return envFiles.reduce(
    (merged, envFile) => ({
      ...merged,
      ...parseEnvFile(resolve(workspaceRoot, envFile)),
    }),
    {},
  );
}

function buildProcessEnv(mode, selectedEnvFile, fileEnv) {
  const processEnv = { ...process.env };
  const fallbackEnvFiles =
    mode === "production"
      ? envFilesForMode("local")
      : envFilesForMode(mode).filter((envFile) => envFile !== selectedEnvFile);
  const fallbackEnv = mergeParsedEnvFiles(fallbackEnvFiles);

  for (const [key, value] of Object.entries(fallbackEnv)) {
    if (
      processEnv[key] === value &&
      fileEnv[key] !== undefined &&
      fileEnv[key] !== value
    ) {
      delete processEnv[key];
    }
  }

  return processEnv;
}

const { command, mode } = parseArgs(process.argv.slice(2));

if (command.length === 0) {
  console.error(
    "Usage: with-workspace-env.mjs --mode local -- <command> [args...]",
  );
  process.exit(1);
}

const { envFile, parsed: fileEnv } = loadModeEnv(mode);
const processEnv = buildProcessEnv(mode, envFile, fileEnv);

const child = spawn(command[0], command.slice(1), {
  cwd: process.cwd(),
  env: {
    ...fileEnv,
    ...processEnv,
    PLOTKEYS_ENV_MODE: mode === "production" ? "production" : "local",
    PLOTKEYS_WORKSPACE_ROOT: workspaceRoot,
  },
  shell: process.platform === "win32",
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
