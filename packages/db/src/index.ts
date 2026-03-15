export {
  companies,
  memberships,
  membershipRoleEnum,
  membershipStatusEnum,
  schema,
  users,
  type DatabaseSchema,
  type MembershipRole,
  type MembershipStatus,
} from "../drizzle/schema";
export {
  createDrizzleClient,
  type DrizzleDatabaseClient as DatabaseClient,
  type PlotKeysDatabase,
} from "../drizzle/client";
export {
  createPrismaClient,
  type Db,
  type PrismaDatabaseClient,
} from "./prisma";
export {
  normalizeDatabaseProvider,
  readDatabaseRuntimeConfig,
  type DatabaseClientOptions,
  type DatabaseProvider,
  type DatabaseRuntimeConfig,
  type DatabaseStatus,
} from "./runtime";

export { createDrizzleClient as createDatabaseClient } from "../drizzle/client";
export * from "./queries/auth";
export * from "./queries/company";
