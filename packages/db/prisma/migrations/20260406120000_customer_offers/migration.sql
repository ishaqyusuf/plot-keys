-- CreateEnum
CREATE TYPE "offer_status" AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- CreateTable
CREATE TABLE "customer_offers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "status" "offer_status" NOT NULL DEFAULT 'pending',
    "offer_amount" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "customer_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customer_offers_company_id_idx" ON "customer_offers"("company_id");

-- CreateIndex
CREATE INDEX "customer_offers_customer_id_idx" ON "customer_offers"("customer_id");

-- CreateIndex
CREATE INDEX "customer_offers_property_id_idx" ON "customer_offers"("property_id");

-- CreateIndex
CREATE INDEX "customer_offers_customer_status_idx" ON "customer_offers"("customer_id", "status");

-- AddForeignKey
ALTER TABLE "customer_offers" ADD CONSTRAINT "customer_offers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_offers" ADD CONSTRAINT "customer_offers_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_offers" ADD CONSTRAINT "customer_offers_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
