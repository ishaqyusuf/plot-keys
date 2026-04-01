-- CreateTable
CREATE TABLE "customer_saved_listings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customer_saved_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customer_saved_listings_company_id_idx" ON "customer_saved_listings"("company_id");

-- CreateIndex
CREATE INDEX "customer_saved_listings_customer_id_idx" ON "customer_saved_listings"("customer_id");

-- CreateIndex
CREATE INDEX "customer_saved_listings_property_id_idx" ON "customer_saved_listings"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_saved_listings_customer_property_key" ON "customer_saved_listings"("customer_id", "property_id");

-- AddForeignKey
ALTER TABLE "customer_saved_listings" ADD CONSTRAINT "customer_saved_listings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_saved_listings" ADD CONSTRAINT "customer_saved_listings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_saved_listings" ADD CONSTRAINT "customer_saved_listings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
