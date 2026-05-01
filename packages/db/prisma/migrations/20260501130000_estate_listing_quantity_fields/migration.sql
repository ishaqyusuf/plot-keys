ALTER TABLE "properties"
ADD COLUMN "estate_id" UUID,
ADD COLUMN "quantity_available" INTEGER;

CREATE INDEX "properties_company_estate_id_idx" ON "properties"("company_id", "estate_id");

ALTER TABLE "properties"
ADD CONSTRAINT "properties_estate_id_fkey"
FOREIGN KEY ("estate_id") REFERENCES "estates"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
