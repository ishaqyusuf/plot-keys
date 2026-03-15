CREATE TYPE "public"."company_plan_tier" AS ENUM('starter', 'plus', 'pro');
CREATE TYPE "public"."company_plan_status" AS ENUM('active', 'past_due', 'canceled');

ALTER TABLE "public"."companies"
  ADD COLUMN "plan_tier" "public"."company_plan_tier" NOT NULL DEFAULT 'starter',
  ADD COLUMN "plan_status" "public"."company_plan_status" NOT NULL DEFAULT 'active',
  ADD COLUMN "plan_started_at" timestamp with time zone,
  ADD COLUMN "plan_ends_at" timestamp with time zone;

UPDATE "public"."companies"
SET
  "plan_tier" = 'starter',
  "plan_status" = 'active',
  "plan_started_at" = COALESCE("created_at", now())
WHERE "plan_started_at" IS NULL;

CREATE INDEX "companies_plan_tier_idx" ON "public"."companies"("plan_tier");
CREATE INDEX "companies_plan_status_idx" ON "public"."companies"("plan_status");
