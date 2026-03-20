-- Listing Categories & Types + Customer model

-- CreateEnum for property types
CREATE TYPE "property_type" AS ENUM ('residential', 'commercial', 'land', 'industrial', 'mixed_use');

-- AlterTable: add type + sub_type to properties
ALTER TABLE "properties" ADD COLUMN "type" "property_type";
ALTER TABLE "properties" ADD COLUMN "sub_type" TEXT;

-- CreateIndex for property type
CREATE INDEX "properties_company_type_idx" ON "properties"("company_id", "type");

-- CreateEnum for customer status
CREATE TYPE "customer_status" AS ENUM ('active', 'inactive', 'vip');

-- CreateTable: customers
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "status" "customer_status" NOT NULL DEFAULT 'active',
    "source_lead_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for customers
CREATE INDEX "customers_company_id_idx" ON "customers"("company_id");
CREATE INDEX "customers_company_status_idx" ON "customers"("company_id", "status");
CREATE INDEX "customers_deleted_at_idx" ON "customers"("deleted_at");

-- AddForeignKey for customers -> companies
ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
