-- Add enabled_apps array to companies so tenants can toggle internal apps
-- (Listings, HRM, Projects, CRM, Blog, Analytics, AI Assistant) on/off
-- within the limits of their plan tier.

ALTER TABLE "public"."companies"
  ADD COLUMN "enabled_apps" TEXT[] NOT NULL
  DEFAULT ARRAY['listings', 'blog', 'analytics', 'ai-assistant']::TEXT[];
