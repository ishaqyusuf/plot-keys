import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import type {
  DatabaseClientOptions,
  DatabaseProvider,
  DatabaseStatus,
} from "../src/runtime";
import { readDatabaseRuntimeConfig } from "../src/runtime";
import { schema, type DatabaseSchema } from "./schema";

export type PlotKeysDatabase = NodePgDatabase<DatabaseSchema>;

export type DrizzleDatabaseClient = {
  db: PlotKeysDatabase | null;
  driver: "node-postgres" | null;
  pool: Pool | null;
  provider: DatabaseProvider;
  schema: DatabaseSchema;
  status: DatabaseStatus;
};

declare global {
  // eslint-disable-next-line no-var
  var __plotkeysDrizzleClient__: DrizzleDatabaseClient | undefined;
}

function createUnconfiguredDrizzleClient(
  provider: DatabaseProvider,
): DrizzleDatabaseClient {
  return {
    db: null,
    driver: null,
    pool: null,
    provider,
    schema,
    status: "unconfigured",
  };
}

function createPostgresDrizzleClient(
  provider: DatabaseProvider,
  connectionString: string,
  options: DatabaseClientOptions,
): DrizzleDatabaseClient {
  const pool = new Pool({
    connectionString,
    ...options.poolConfig,
  });

  return {
    db: drizzle(pool, { schema }),
    driver: "node-postgres",
    pool,
    provider,
    schema,
    status: "connected",
  };
}

export function createDrizzleClient(
  options: DatabaseClientOptions = {},
): DrizzleDatabaseClient {
  if (
    !options.connectionString &&
    !options.poolConfig &&
    globalThis.__plotkeysDrizzleClient__
  ) {
    return globalThis.__plotkeysDrizzleClient__;
  }

  const runtimeConfig = readDatabaseRuntimeConfig();
  const provider = options.provider ?? runtimeConfig.provider;
  const connectionString =
    options.connectionString ?? runtimeConfig.connectionString;

  if (!connectionString) {
    const client = createUnconfiguredDrizzleClient(provider);

    if (!options.connectionString && !options.poolConfig) {
      globalThis.__plotkeysDrizzleClient__ = client;
    }

    return client;
  }

  const client = createPostgresDrizzleClient(
    provider,
    connectionString,
    options,
  );

  if (!options.connectionString && !options.poolConfig) {
    globalThis.__plotkeysDrizzleClient__ = client;
  }

  return client;
}
