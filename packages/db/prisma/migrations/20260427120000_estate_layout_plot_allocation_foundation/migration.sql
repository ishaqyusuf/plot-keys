-- Estate layout and plot allocation foundation

-- CreateEnum
CREATE TYPE "estate_publish_state" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "estate_layout_status" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "plot_type" AS ENUM ('residential', 'commercial', 'mixed_use', 'amenity');

-- CreateEnum
CREATE TYPE "plot_status" AS ENUM ('available', 'held', 'reserved', 'sold', 'blocked');

-- CreateEnum
CREATE TYPE "plot_reservation_status" AS ENUM ('draft', 'held', 'processing', 'expired', 'cancelled', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "plot_reservation_choice_status" AS ENUM ('selected', 'promoted', 'released');

-- CreateEnum
CREATE TYPE "plot_document_kind" AS ENUM ('survey', 'deed', 'allocation_letter', 'receipt', 'other');

-- CreateTable
CREATE TABLE "estates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "phase_label" TEXT,
    "hero_image_url" TEXT,
    "publish_state" "estate_publish_state" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "estates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estate_layouts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "estate_id" UUID NOT NULL,
    "source_url" TEXT NOT NULL,
    "normalized_image_url" TEXT,
    "image_width" INTEGER,
    "image_height" INTEGER,
    "rotation_degrees" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "estate_layout_status" NOT NULL DEFAULT 'draft',
    "created_by_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "estate_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "estate_id" UUID NOT NULL,
    "plot_code" TEXT NOT NULL,
    "block" TEXT,
    "street" TEXT,
    "size_sqm" INTEGER,
    "price" TEXT,
    "type" "plot_type",
    "status" "plot_status" NOT NULL DEFAULT 'available',
    "facing" TEXT,
    "is_corner_piece" BOOLEAN NOT NULL DEFAULT false,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "coordinates_json" JSONB,
    "tags_json" JSONB,
    "metadata_json" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "plots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plot_reservations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "estate_id" UUID NOT NULL,
    "status" "plot_reservation_status" NOT NULL DEFAULT 'draft',
    "hold_expires_at" TIMESTAMPTZ(6),
    "submitted_at" TIMESTAMPTZ(6),
    "approved_at" TIMESTAMPTZ(6),
    "rejected_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "plot_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plot_reservation_choices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reservation_id" UUID NOT NULL,
    "plot_id" UUID NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 1,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "status" "plot_reservation_choice_status" NOT NULL DEFAULT 'selected',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plot_reservation_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plot_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "plot_id" UUID NOT NULL,
    "from_status" "plot_status",
    "to_status" "plot_status" NOT NULL,
    "actor_user_id" TEXT,
    "actor_customer_id" UUID,
    "reason" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plot_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plot_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "plot_id" UUID NOT NULL,
    "kind" "plot_document_kind" NOT NULL DEFAULT 'other',
    "url" TEXT NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plot_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estates_company_slug_key" ON "estates"("company_id", "slug");
CREATE INDEX "estates_company_id_idx" ON "estates"("company_id");
CREATE INDEX "estates_company_publish_state_idx" ON "estates"("company_id", "publish_state");
CREATE INDEX "estates_deleted_at_idx" ON "estates"("deleted_at");

-- CreateIndex
CREATE INDEX "estate_layouts_estate_id_idx" ON "estate_layouts"("estate_id");
CREATE INDEX "estate_layouts_estate_version_idx" ON "estate_layouts"("estate_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "plots_estate_plot_code_key" ON "plots"("estate_id", "plot_code");
CREATE INDEX "plots_company_id_idx" ON "plots"("company_id");
CREATE INDEX "plots_estate_id_idx" ON "plots"("estate_id");
CREATE INDEX "plots_company_status_idx" ON "plots"("company_id", "status");
CREATE INDEX "plots_deleted_at_idx" ON "plots"("deleted_at");

-- CreateIndex
CREATE INDEX "plot_reservations_company_id_idx" ON "plot_reservations"("company_id");
CREATE INDEX "plot_reservations_customer_id_idx" ON "plot_reservations"("customer_id");
CREATE INDEX "plot_reservations_estate_id_idx" ON "plot_reservations"("estate_id");
CREATE INDEX "plot_reservations_customer_status_idx" ON "plot_reservations"("customer_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "plot_reservation_choices_reservation_plot_key" ON "plot_reservation_choices"("reservation_id", "plot_id");
CREATE INDEX "plot_reservation_choices_reservation_id_idx" ON "plot_reservation_choices"("reservation_id");
CREATE INDEX "plot_reservation_choices_plot_id_idx" ON "plot_reservation_choices"("plot_id");

-- CreateIndex
CREATE INDEX "plot_status_history_plot_id_idx" ON "plot_status_history"("plot_id");
CREATE INDEX "plot_status_history_actor_user_id_idx" ON "plot_status_history"("actor_user_id");
CREATE INDEX "plot_status_history_actor_customer_id_idx" ON "plot_status_history"("actor_customer_id");

-- CreateIndex
CREATE INDEX "plot_documents_plot_id_idx" ON "plot_documents"("plot_id");

-- AddForeignKey
ALTER TABLE "estates" ADD CONSTRAINT "estates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "estate_layouts" ADD CONSTRAINT "estate_layouts_estate_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plots" ADD CONSTRAINT "plots_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plots" ADD CONSTRAINT "plots_estate_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plot_reservations" ADD CONSTRAINT "plot_reservations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plot_reservations" ADD CONSTRAINT "plot_reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plot_reservations" ADD CONSTRAINT "plot_reservations_estate_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "estates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plot_reservation_choices" ADD CONSTRAINT "plot_reservation_choices_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "plot_reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plot_reservation_choices" ADD CONSTRAINT "plot_reservation_choices_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plot_status_history" ADD CONSTRAINT "plot_status_history_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plot_status_history" ADD CONSTRAINT "plot_status_history_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "plot_status_history" ADD CONSTRAINT "plot_status_history_actor_customer_id_fkey" FOREIGN KEY ("actor_customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "plot_documents" ADD CONSTRAINT "plot_documents_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "plots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
