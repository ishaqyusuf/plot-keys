CREATE TYPE "public"."membership_role" AS ENUM('platform_admin', 'owner', 'admin', 'agent', 'staff');
CREATE TYPE "public"."membership_status" AS ENUM('active', 'invited', 'suspended');

CREATE TABLE "public"."companies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "public"."users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "name" text,
  "global_role" "public"."membership_role" DEFAULT 'staff' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "public"."memberships" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL,
  "user_id" text NOT NULL,
  "role" "public"."membership_role" DEFAULT 'staff' NOT NULL,
  "status" "public"."membership_status" DEFAULT 'invited' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "public"."memberships"
  ADD CONSTRAINT "memberships_company_id_companies_id_fk"
  FOREIGN KEY ("company_id")
  REFERENCES "public"."companies"("id")
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

ALTER TABLE "public"."memberships"
  ADD CONSTRAINT "memberships_user_id_users_id_fk"
  FOREIGN KEY ("user_id")
  REFERENCES "public"."users"("id")
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

CREATE UNIQUE INDEX "companies_slug_key" ON "public"."companies"("slug");
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");
CREATE UNIQUE INDEX "memberships_company_user_key" ON "public"."memberships"("company_id", "user_id");
CREATE INDEX "memberships_company_id_idx" ON "public"."memberships"("company_id");
CREATE INDEX "memberships_user_id_idx" ON "public"."memberships"("user_id");
