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

export type DatabaseStatus = "connected" | "unconfigured";

export type DatabaseClient = {
  db: PlotKeysDatabase | null;
  pool: Pool | null;
  schema: DatabaseSchema;
  status: DatabaseStatus;
};

export type DatabaseClientOptions = {
  connectionString?: string;
  poolConfig?: PoolConfig;
};

declare global {
  // eslint-disable-next-line no-var
  var __plotkeysDbClient__: DatabaseClient | undefined;
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

  const connectionString =
    options.connectionString ?? process.env.DATABASE_URL ?? null;

  if (!connectionString) {
    const client: DatabaseClient = {
      db: null,
      pool: null,
      schema,
      status: "unconfigured",
    };

    if (!options.connectionString && !options.poolConfig) {
      globalThis.__plotkeysDbClient__ = client;
    }

    return client;
  }

  const pool = new Pool({
    connectionString,
    ...options.poolConfig,
  });

  const client: DatabaseClient = {
    db: drizzle(pool, { schema }),
    pool,
    schema,
    status: "connected",
  };

  if (!options.connectionString && !options.poolConfig) {
    globalThis.__plotkeysDbClient__ = client;
  }

  return client;
}
