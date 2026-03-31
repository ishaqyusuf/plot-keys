CREATE TYPE "blog_post_status" AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TABLE "blog_posts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "company_id" UUID NOT NULL,
  "author_id" TEXT,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "featured_image" TEXT,
  "status" "blog_post_status" NOT NULL DEFAULT 'draft',
  "published_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMPTZ(6),

  CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "blog_posts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "blog_posts_company_slug_key" ON "blog_posts"("company_id", "slug");
CREATE INDEX "blog_posts_company_status_idx" ON "blog_posts"("company_id", "status");
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts"("published_at");
CREATE INDEX "blog_posts_deleted_at_idx" ON "blog_posts"("deleted_at");
