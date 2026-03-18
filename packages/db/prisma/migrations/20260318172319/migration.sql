/*
  Warnings:

  - The `target_audience` column on the `tenant_onboardings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tenant_onboardings" DROP COLUMN "target_audience",
ADD COLUMN     "target_audience" TEXT[];
