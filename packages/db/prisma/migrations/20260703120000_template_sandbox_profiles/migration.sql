CREATE TABLE "template_sandbox_profiles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "share_id" TEXT NOT NULL,
  "owner_user_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "template_key" TEXT NOT NULL,
  "plan_tier" "company_plan_tier" NOT NULL DEFAULT 'starter',
  "company_name" TEXT NOT NULL,
  "market" TEXT,
  "subdomain_label" TEXT,
  "theme_json" JSONB NOT NULL DEFAULT '{}',
  "content_json" JSONB NOT NULL DEFAULT '{}',
  "sample_data_json" JSONB NOT NULL DEFAULT '{}',
  "profile_json" JSONB NOT NULL DEFAULT '{}',
  "archived_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "template_sandbox_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "template_sandbox_profiles_share_id_key"
  ON "template_sandbox_profiles"("share_id");

CREATE INDEX "template_sandbox_profiles_owner_archived_idx"
  ON "template_sandbox_profiles"("owner_user_id", "archived_at");

CREATE INDEX "template_sandbox_profiles_template_key_idx"
  ON "template_sandbox_profiles"("template_key");

ALTER TABLE "template_sandbox_profiles"
  ADD CONSTRAINT "template_sandbox_profiles_owner_user_id_fkey"
  FOREIGN KEY ("owner_user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
