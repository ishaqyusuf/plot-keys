-- Priority #1: Team invites
-- Priority #2: Property media gallery
-- Priority #3: Property publish states
-- Priority #5: Notifications

-- CreateEnum
CREATE TYPE "property_media_kind" AS ENUM ('image', 'floor_plan', 'virtual_tour');

-- CreateEnum
CREATE TYPE "property_publish_state" AS ENUM ('draft', 'published', 'archived');

-- AlterTable: add publish_state to properties
ALTER TABLE "properties" ADD COLUMN "publish_state" "property_publish_state" NOT NULL DEFAULT 'draft';

-- CreateIndex for publish_state
CREATE INDEX "properties_company_publish_state_idx" ON "properties"("company_id", "publish_state");

-- CreateTable: property_media
CREATE TABLE "property_media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL,
    "kind" "property_media_kind" NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for property_media
CREATE INDEX "property_media_property_id_idx" ON "property_media"("property_id");
CREATE INDEX "property_media_property_cover_idx" ON "property_media"("property_id", "is_cover");

-- AddForeignKey for property_media
ALTER TABLE "property_media" ADD CONSTRAINT "property_media_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: team_invites
CREATE TABLE "team_invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "membership_role" NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "accepted_at" TIMESTAMPTZ(6),
    "revoked_at" TIMESTAMPTZ(6),
    "invited_by_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for team_invites
CREATE UNIQUE INDEX "team_invites_token_key" ON "team_invites"("token");
CREATE INDEX "team_invites_token_idx" ON "team_invites"("token");
CREATE INDEX "team_invites_company_id_idx" ON "team_invites"("company_id");
CREATE INDEX "team_invites_email_idx" ON "team_invites"("email");

-- AddForeignKey for team_invites
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "team_invites" ADD CONSTRAINT "team_invites_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: notifications
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for notifications
CREATE INDEX "notifications_company_user_idx" ON "notifications"("company_id", "user_id");
CREATE INDEX "notifications_company_user_read_idx" ON "notifications"("company_id", "user_id", "is_read");
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- AddForeignKey for notifications
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
