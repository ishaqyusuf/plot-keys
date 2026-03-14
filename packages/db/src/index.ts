import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { Pool, type PoolConfig } from "pg";

export const membershipRoleEnum = pgEnum("membership_role", [
  "platform_admin",
  "owner",
  "admin",
  "agent",
  "staff",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "invited",
  "suspended",
]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    globalRole: membershipRoleEnum("global_role").default("staff").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIndex: uniqueIndex("users_email_key").on(table.email),
  }),
);

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIndex: uniqueIndex("companies_slug_key").on(table.slug),
  }),
);

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: membershipRoleEnum("role").default("staff").notNull(),
    status: membershipStatusEnum("status").default("invited").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userCompanyIndex: uniqueIndex("memberships_company_user_key").on(
      table.companyId,
      table.userId,
    ),
    companyIndex: index("memberships_company_id_idx").on(table.companyId),
    userIndex: index("memberships_user_id_idx").on(table.userId),
  }),
);

export const schema = {
  users,
  companies,
  memberships,
};

export type MembershipRole = (typeof membershipRoleEnum.enumValues)[number];
export type MembershipStatus = (typeof membershipStatusEnum.enumValues)[number];
export type DatabaseSchema = typeof schema;
export type PlotKeysDatabase = NodePgDatabase<DatabaseSchema>;
export type DatabaseProvider = "postgres" | "supabase-postgres";

export type DatabaseStatus = "connected" | "unconfigured";

export type DatabaseClient = {
  db: PlotKeysDatabase | null;
  driver: "node-postgres" | null;
  pool: Pool | null;
  provider: DatabaseProvider;
  schema: DatabaseSchema;
  status: DatabaseStatus;
};

export type DatabaseClientOptions = {
  connectionString?: string;
  provider?: DatabaseProvider;
  poolConfig?: PoolConfig;
};

export type DatabaseRuntimeConfig = {
  connectionString: string | null;
  provider: DatabaseProvider;
};

declare global {
  // eslint-disable-next-line no-var
  var __plotkeysDbClient__: DatabaseClient | undefined;
}

const defaultDatabaseProvider: DatabaseProvider = "postgres";

function normalizeDatabaseProvider(
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

function createUnconfiguredDatabaseClient(
  provider: DatabaseProvider,
): DatabaseClient {
  return {
    db: null,
    driver: null,
    pool: null,
    provider,
    schema,
    status: "unconfigured",
  };
}

function createPostgresDatabaseClient(
  provider: DatabaseProvider,
  connectionString: string,
  poolConfig?: PoolConfig,
): DatabaseClient {
  const pool = new Pool({
    connectionString,
    ...poolConfig,
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

export function createDatabaseClient(
  options: DatabaseClientOptions = {},
): DatabaseClient {
  if (
    !options.connectionString &&
    !options.poolConfig &&
    globalThis.__plotkeysDbClient__
  ) {
    return globalThis.__plotkeysDbClient__;
  }

  const runtimeConfig = readDatabaseRuntimeConfig();
  const provider = options.provider ?? runtimeConfig.provider;
  const connectionString =
    options.connectionString ?? runtimeConfig.connectionString;

  if (!connectionString) {
    const client = createUnconfiguredDatabaseClient(provider);

    if (!options.connectionString && !options.poolConfig) {
      globalThis.__plotkeysDbClient__ = client;
    }

    return client;
  }

  const client = createPostgresDatabaseClient(
    provider,
    connectionString,
    options.poolConfig,
  );

  if (!options.connectionString && !options.poolConfig) {
    globalThis.__plotkeysDbClient__ = client;
  }

  return client;
}
