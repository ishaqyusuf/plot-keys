CREATE TYPE "public"."TenantDomainKind" AS ENUM (
  'sitefront_subdomain',
  'dashboard_subdomain',
  'sitefront_custom_domain',
  'dashboard_custom_domain'
);

CREATE TYPE "public"."TenantDomainStatus" AS ENUM (
  'pending',
  'provisioning',
  'active',
  'failed',
  'detached'
);

CREATE TABLE "public"."tenant_domains" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "company_id" uuid NOT NULL,
  "kind" "public"."TenantDomainKind" NOT NULL,
  "status" "public"."TenantDomainStatus" NOT NULL DEFAULT 'pending',
  "hostname" text NOT NULL,
  "subdomain_label" text,
  "apex_domain" text NOT NULL,
  "vercel_project_key" text NOT NULL,
  "vercel_domain_name" text,
  "verification_json" jsonb,
  "last_error" text,
  "provisioned_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "deleted_at" timestamp with time zone,
  CONSTRAINT "tenant_domains_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "tenant_domains_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "tenant_domains_hostname_key" ON "public"."tenant_domains"("hostname");
CREATE INDEX "tenant_domains_company_id_idx" ON "public"."tenant_domains"("company_id");
CREATE INDEX "tenant_domains_company_kind_idx" ON "public"."tenant_domains"("company_id", "kind");
CREATE INDEX "tenant_domains_status_idx" ON "public"."tenant_domains"("status");
CREATE INDEX "tenant_domains_deleted_at_idx" ON "public"."tenant_domains"("deleted_at");
