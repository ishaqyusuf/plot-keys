import type { PoolConfig } from "pg";

export type DatabaseProvider = "postgres" | "supabase-postgres";

export type DatabaseStatus = "connected" | "unconfigured";

export type DatabaseRuntimeConfig = {
  connectionString: string | null;
  provider: DatabaseProvider;
};

export type DatabaseClientOptions = {
  connectionString?: string;
  provider?: DatabaseProvider;
  poolConfig?: PoolConfig;
};

const defaultDatabaseProvider: DatabaseProvider = "postgres";

export function normalizeDatabaseProvider(
  provider: string | undefined,
): DatabaseProvider {
  if (provider === "supabase-postgres") {
    return provider;
  }

  return defaultDatabaseProvider;
}

export function readDatabaseRuntimeConfig(
  env: Record<string, string | undefined> = process.env,
): DatabaseRuntimeConfig {
  return {
    connectionString: env.DATABASE_URL ?? null,
    provider: normalizeDatabaseProvider(env.DATABASE_PROVIDER),
  };
}
