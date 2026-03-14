ALTER TABLE "public"."users"
  ADD COLUMN "deleted_at" timestamp with time zone;

ALTER TABLE "public"."companies"
  ADD COLUMN "deleted_at" timestamp with time zone;

ALTER TABLE "public"."memberships"
  ADD COLUMN "deleted_at" timestamp with time zone;

DROP INDEX "public"."users_email_key";
DROP INDEX "public"."companies_slug_key";
DROP INDEX "public"."memberships_company_user_key";

CREATE INDEX "users_email_idx" ON "public"."users"("email");
CREATE INDEX "users_deleted_at_idx" ON "public"."users"("deleted_at");
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email") WHERE "deleted_at" IS NULL;

CREATE INDEX "companies_slug_idx" ON "public"."companies"("slug");
CREATE INDEX "companies_deleted_at_idx" ON "public"."companies"("deleted_at");
CREATE UNIQUE INDEX "companies_slug_key" ON "public"."companies"("slug") WHERE "deleted_at" IS NULL;

CREATE INDEX "memberships_company_user_idx" ON "public"."memberships"("company_id", "user_id");
CREATE INDEX "memberships_deleted_at_idx" ON "public"."memberships"("deleted_at");
CREATE UNIQUE INDEX "memberships_company_user_key" ON "public"."memberships"("company_id", "user_id") WHERE "deleted_at" IS NULL;
