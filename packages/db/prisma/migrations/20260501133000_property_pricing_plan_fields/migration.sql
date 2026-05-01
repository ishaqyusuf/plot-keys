ALTER TABLE "properties"
ADD COLUMN "payment_plan_months" INTEGER,
ADD COLUMN "payment_plan_amount" TEXT,
ADD COLUMN "payment_plan_initial_deposit_percent" DOUBLE PRECISION,
ADD COLUMN "payment_plan_monthly_amount" TEXT,
ADD COLUMN "payment_plans_json" JSONB;
