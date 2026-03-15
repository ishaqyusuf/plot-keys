import { sql } from "drizzle-orm";
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

export const companyPlanTierEnum = pgEnum("company_plan_tier", [
  "starter",
  "plus",
  "pro",
]);

export const companyPlanStatusEnum = pgEnum("company_plan_status", [
  "active",
  "past_due",
  "canceled",
]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    globalRole: membershipRoleEnum("global_role").default("staff").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIndex: index("users_email_idx").on(table.email),
    deletedAtIndex: index("users_deleted_at_idx").on(table.deletedAt),
    activeEmailUniqueIndex: uniqueIndex("users_email_key")
      .on(table.email)
      .where(sql`${table.deletedAt} is null`),
  }),
);

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    market: text("market"),
    planTier: companyPlanTierEnum("plan_tier").default("starter").notNull(),
    planStatus: companyPlanStatusEnum("plan_status")
      .default("active")
      .notNull(),
    planStartedAt: timestamp("plan_started_at", { withTimezone: true }),
    planEndsAt: timestamp("plan_ends_at", { withTimezone: true }),
    isActive: boolean("is_active").default(true).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIndex: index("companies_slug_idx").on(table.slug),
    planTierIndex: index("companies_plan_tier_idx").on(table.planTier),
    planStatusIndex: index("companies_plan_status_idx").on(table.planStatus),
    deletedAtIndex: index("companies_deleted_at_idx").on(table.deletedAt),
    activeSlugUniqueIndex: uniqueIndex("companies_slug_key")
      .on(table.slug)
      .where(sql`${table.deletedAt} is null`),
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
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userCompanyIndex: index("memberships_company_user_idx").on(
      table.companyId,
      table.userId,
    ),
    companyIndex: index("memberships_company_id_idx").on(table.companyId),
    userIndex: index("memberships_user_id_idx").on(table.userId),
    deletedAtIndex: index("memberships_deleted_at_idx").on(table.deletedAt),
    activeUserCompanyUniqueIndex: uniqueIndex("memberships_company_user_key")
      .on(table.companyId, table.userId)
      .where(sql`${table.deletedAt} is null`),
  }),
);

export const schema = {
  companyPlanStatusEnum,
  companyPlanTierEnum,
  users,
  companies,
  memberships,
};

export type MembershipRole = (typeof membershipRoleEnum.enumValues)[number];
export type MembershipStatus = (typeof membershipStatusEnum.enumValues)[number];
export type CompanyPlanTier = (typeof companyPlanTierEnum.enumValues)[number];
export type CompanyPlanStatus =
  (typeof companyPlanStatusEnum.enumValues)[number];
export type DatabaseSchema = typeof schema;
