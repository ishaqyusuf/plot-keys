-- CreateEnum
CREATE TYPE "billing_line_item_kind" AS ENUM ('subscription', 'template_purchase', 'stock_image', 'domain_addon', 'ai_credits');

-- CreateEnum
CREATE TYPE "billing_line_item_status" AS ENUM ('pending', 'active', 'cancelled', 'expired');

-- CreateEnum
CREATE TYPE "property_status" AS ENUM ('active', 'sold', 'rented', 'off_market');

-- CreateEnum
CREATE TYPE "template_license_source" AS ENUM ('free', 'plan_included', 'purchased', 'admin_granted');

-- CreateEnum
CREATE TYPE "website_status" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "website_version_status" AS ENUM ('draft', 'published', 'archived');

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_company_id_companies_id_fk";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_user_id_users_id_fk";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "logo_url" TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "memberships" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "site_configurations" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tenant_domains" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "agents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "image_url" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_accounts" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMPTZ(6),
    "refresh_token_expires_at" TIMESTAMPTZ(6),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "auth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "auth_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "kind" "billing_line_item_kind" NOT NULL,
    "status" "billing_line_item_status" NOT NULL DEFAULT 'pending',
    "amount_minor_units" INTEGER NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'NGN',
    "provider_ref" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "period_start_at" TIMESTAMPTZ(6),
    "period_end_at" TIMESTAMPTZ(6),
    "paid_at" TIMESTAMPTZ(6),
    "cancelled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "billing_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" TEXT,
    "location" TEXT NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "specs" TEXT,
    "image_url" TEXT,
    "status" "property_status" NOT NULL DEFAULT 'active',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_onboardings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "tagline" TEXT,
    "business_type" TEXT,
    "primary_goal" TEXT,
    "locations" TEXT[],
    "property_types" TEXT[],
    "target_audience" TEXT,
    "tone" TEXT,
    "style_preference" TEXT,
    "preferred_color_hint" TEXT,
    "phone" TEXT,
    "contact_email" TEXT,
    "whatsapp" TEXT,
    "office_address" TEXT,
    "has_logo" BOOLEAN NOT NULL DEFAULT false,
    "has_listings" BOOLEAN NOT NULL DEFAULT false,
    "has_existing_content" BOOLEAN NOT NULL DEFAULT false,
    "has_agents" BOOLEAN NOT NULL DEFAULT false,
    "has_projects" BOOLEAN NOT NULL DEFAULT false,
    "has_testimonials" BOOLEAN NOT NULL DEFAULT false,
    "has_blog_content" BOOLEAN NOT NULL DEFAULT false,
    "business_summary" TEXT,
    "segment" TEXT,
    "design_intent" TEXT,
    "conversion_focus" TEXT,
    "complexity" TEXT,
    "recommended_template_key" TEXT,
    "market" TEXT,
    "template_key" TEXT,
    "current_step" TEXT NOT NULL DEFAULT 'business-identity',
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tenant_onboardings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_template_licenses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "template_key" TEXT NOT NULL,
    "source" "template_license_source" NOT NULL,
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(6),
    "granted_by_id" UUID,

    CONSTRAINT "tenant_template_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "template_key" TEXT NOT NULL,
    "subdomain" TEXT,
    "status" "website_status" NOT NULL DEFAULT 'active',
    "published_version_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "website_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "status" "website_version_status" NOT NULL DEFAULT 'draft',
    "name" TEXT,
    "theme_json" JSONB NOT NULL DEFAULT '{}',
    "content_json" JSONB NOT NULL DEFAULT '{}',
    "legacy_config_id" UUID,
    "published_at" TIMESTAMPTZ(6),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "website_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agents_company_id_idx" ON "agents"("company_id");

-- CreateIndex
CREATE INDEX "agents_featured_idx" ON "agents"("featured");

-- CreateIndex
CREATE INDEX "agents_deleted_at_idx" ON "agents"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_token_key" ON "auth_sessions"("token");

-- CreateIndex
CREATE INDEX "billing_line_items_company_id_idx" ON "billing_line_items"("company_id");

-- CreateIndex
CREATE INDEX "billing_line_items_company_kind_idx" ON "billing_line_items"("company_id", "kind");

-- CreateIndex
CREATE INDEX "billing_line_items_status_idx" ON "billing_line_items"("status");

-- CreateIndex
CREATE INDEX "billing_line_items_provider_ref_idx" ON "billing_line_items"("provider_ref");

-- CreateIndex
CREATE INDEX "properties_company_id_idx" ON "properties"("company_id");

-- CreateIndex
CREATE INDEX "properties_status_idx" ON "properties"("status");

-- CreateIndex
CREATE INDEX "properties_featured_idx" ON "properties"("featured");

-- CreateIndex
CREATE INDEX "properties_deleted_at_idx" ON "properties"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_onboardings_user_id_key" ON "tenant_onboardings"("user_id");

-- CreateIndex
CREATE INDEX "tenant_onboardings_user_id_idx" ON "tenant_onboardings"("user_id");

-- CreateIndex
CREATE INDEX "tenant_onboardings_completed_at_idx" ON "tenant_onboardings"("completed_at");

-- CreateIndex
CREATE INDEX "tenant_template_licenses_company_id_idx" ON "tenant_template_licenses"("company_id");

-- CreateIndex
CREATE INDEX "tenant_template_licenses_template_key_idx" ON "tenant_template_licenses"("template_key");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_template_licenses_company_template_source_uidx" ON "tenant_template_licenses"("company_id", "template_key", "source");

-- CreateIndex
CREATE UNIQUE INDEX "websites_company_id_key" ON "websites"("company_id");

-- CreateIndex
CREATE INDEX "websites_company_id_idx" ON "websites"("company_id");

-- CreateIndex
CREATE INDEX "websites_template_key_idx" ON "websites"("template_key");

-- CreateIndex
CREATE INDEX "website_versions_website_status_idx" ON "website_versions"("website_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "website_versions_website_id_version_number_key" ON "website_versions"("website_id", "version_number");

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_line_items" ADD CONSTRAINT "billing_line_items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_onboardings" ADD CONSTRAINT "tenant_onboardings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_template_licenses" ADD CONSTRAINT "tenant_template_licenses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_versions" ADD CONSTRAINT "website_versions_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_versions" ADD CONSTRAINT "website_versions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_versions" ADD CONSTRAINT "website_versions_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
