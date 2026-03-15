import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/prisma/client";

import type { DatabaseClientOptions, DatabaseProvider } from "./runtime";
import { readDatabaseRuntimeConfig } from "./runtime";

export type PrismaDatabaseClient = {
  db: PrismaClient | null;
  driver: "prisma-postgresql" | null;
  provider: DatabaseProvider;
  status: "connected" | "unconfigured";
};

export type Db = PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __plotkeysPrismaClient__: PrismaDatabaseClient | undefined;
}

function createUnconfiguredPrismaClient(
  provider: DatabaseProvider,
): PrismaDatabaseClient {
  return {
    db: null,
    driver: null,
    provider,
    status: "unconfigured",
  };
}

function createConfiguredPrismaClient(
  provider: DatabaseProvider,
  options: DatabaseClientOptions,
): PrismaDatabaseClient {
  const connectionString = options.connectionString ?? process.env.DATABASE_URL;

  if (!connectionString) {
    return createUnconfiguredPrismaClient(provider);
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  return {
    db: new PrismaClient({ adapter }),
    driver: "prisma-postgresql",
    provider,
    status: "connected",
  };
}

export function createPrismaClient(
  options: DatabaseClientOptions = {},
): PrismaDatabaseClient {
  if (!options.connectionString && !globalThis.__plotkeysPrismaClient__) {
    const runtimeConfig = readDatabaseRuntimeConfig();

    if (!runtimeConfig.connectionString) {
      const client = createUnconfiguredPrismaClient(runtimeConfig.provider);
      globalThis.__plotkeysPrismaClient__ = client;
      return client;
    }

    const client = createConfiguredPrismaClient(
      runtimeConfig.provider,
      options,
    );
    globalThis.__plotkeysPrismaClient__ = client;
    return client;
  }

  if (!options.connectionString && globalThis.__plotkeysPrismaClient__) {
    return globalThis.__plotkeysPrismaClient__;
  }

  const runtimeConfig = readDatabaseRuntimeConfig();
  const provider = options.provider ?? runtimeConfig.provider;
  const connectionString =
    options.connectionString ?? runtimeConfig.connectionString;

  if (!connectionString) {
    return createUnconfiguredPrismaClient(provider);
  }

  return createConfiguredPrismaClient(provider, {
    ...options,
    connectionString,
  });
}
