CREATE TYPE "asset_origin_kind" AS ENUM ('upload', 'unsplash', 'pexels', 'pixabay', 'import');

CREATE TYPE "asset_status" AS ENUM ('uploading', 'ready', 'moving', 'failed', 'deleted');

CREATE TABLE "assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "bucket" TEXT,
    "key" TEXT NOT NULL,
    "public_url" TEXT,
    "content_type" TEXT NOT NULL,
    "byte_size" INTEGER,
    "checksum" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "origin_kind" "asset_origin_kind" NOT NULL DEFAULT 'upload',
    "origin_meta" JSONB,
    "status" "asset_status" NOT NULL DEFAULT 'ready',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "property_media" ADD COLUMN "asset_id" UUID;
ALTER TABLE "property_media" ADD COLUMN "alt_text" TEXT;
ALTER TABLE "property_media" ADD COLUMN "caption" TEXT;
ALTER TABLE "property_media" ALTER COLUMN "url" DROP NOT NULL;

CREATE INDEX "assets_company_id_idx" ON "assets"("company_id");
CREATE INDEX "assets_provider_bucket_idx" ON "assets"("provider", "bucket");
CREATE INDEX "assets_status_idx" ON "assets"("status");
CREATE INDEX "property_media_asset_id_idx" ON "property_media"("asset_id");

ALTER TABLE "assets" ADD CONSTRAINT "assets_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_media" ADD CONSTRAINT "property_media_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
