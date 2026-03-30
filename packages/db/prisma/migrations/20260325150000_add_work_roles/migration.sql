CREATE TYPE "work_role" AS ENUM (
  'operations',
  'sales_agent',
  'sales_manager',
  'hr',
  'finance',
  'marketing',
  'project_manager',
  'executive'
);

ALTER TABLE "memberships"
ADD COLUMN "work_role" "work_role" NOT NULL DEFAULT 'operations';

ALTER TABLE "team_invites"
ADD COLUMN "work_role" "work_role" NOT NULL DEFAULT 'operations';

ALTER TABLE "employees"
ADD COLUMN "work_role" "work_role" NOT NULL DEFAULT 'operations';

UPDATE "memberships"
SET "work_role" = CASE
  WHEN "role" = 'owner' THEN 'executive'::work_role
  WHEN "role" = 'platform_admin' THEN 'executive'::work_role
  WHEN "role" = 'agent' THEN 'sales_agent'::work_role
  ELSE 'operations'::work_role
END;

UPDATE "team_invites"
SET "work_role" = CASE
  WHEN "role" = 'agent' THEN 'sales_agent'::work_role
  WHEN "role" = 'owner' THEN 'executive'::work_role
  WHEN "role" = 'platform_admin' THEN 'executive'::work_role
  ELSE 'operations'::work_role
END;
