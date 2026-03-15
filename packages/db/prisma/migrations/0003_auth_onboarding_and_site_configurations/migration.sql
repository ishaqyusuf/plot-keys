ALTER TABLE "public"."users"
  ADD COLUMN "password_hash" text,
  ADD COLUMN "email_verified" boolean NOT NULL DEFAULT false;

ALTER TABLE "public"."companies"
  ADD COLUMN "market" text;

CREATE TYPE "public"."SiteConfigurationStatus" AS ENUM ('draft', 'published', 'archived');

CREATE TABLE "public"."site_configurations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "company_id" uuid NOT NULL,
  "template_key" text NOT NULL,
  "name" text NOT NULL,
  "status" "public"."SiteConfigurationStatus" NOT NULL DEFAULT 'draft',
  "subdomain" text,
  "theme_json" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "content_json" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "version" integer NOT NULL DEFAULT 1,
  "published_at" timestamp with time zone,
  "created_by_id" text,
  "updated_by_id" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "deleted_at" timestamp with time zone,
  CONSTRAINT "site_configurations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "site_configurations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "site_configurations_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "site_configurations_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "site_configurations_company_id_idx" ON "public"."site_configurations"("company_id");
CREATE INDEX "site_configurations_company_status_idx" ON "public"."site_configurations"("company_id", "status");
CREATE INDEX "site_configurations_template_key_idx" ON "public"."site_configurations"("template_key");
CREATE INDEX "site_configurations_deleted_at_idx" ON "public"."site_configurations"("deleted_at");
CREATE UNIQUE INDEX "site_configurations_company_published_key"
  ON "public"."site_configurations"("company_id")
  WHERE "status" = 'published' AND "deleted_at" IS NULL;
