-- CreateTable
CREATE TABLE "company_apps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "app_key" TEXT NOT NULL,
    "installed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_apps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_apps_company_id_idx" ON "company_apps"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_apps_company_id_app_key_uniq" ON "company_apps"("company_id", "app_key");

-- AddForeignKey
ALTER TABLE "company_apps" ADD CONSTRAINT "company_apps_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
