import type { Db } from "../prisma";

export type BlogPostStatusValue = "draft" | "published" | "archived";

export async function createBlogPost(
  db: Db,
  data: {
    authorId?: string | null;
    companyId: string;
    content?: string | null;
    excerpt?: string | null;
    featuredImage?: string | null;
    slug: string;
    title: string;
  },
) {
  return db.blogPost.create({
    data: {
      authorId: data.authorId ?? null,
      companyId: data.companyId,
      content: data.content ?? "",
      excerpt: data.excerpt ?? null,
      featuredImage: data.featuredImage ?? null,
      slug: data.slug,
      title: data.title,
    },
  });
}

export async function updateBlogPost(
  db: Db,
  blogPostId: string,
  companyId: string,
  data: {
    content?: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    slug?: string;
    title?: string;
  },
) {
  return db.blogPost.update({
    data,
    where: { id: blogPostId, companyId, deletedAt: null },
  });
}

export async function setBlogPostStatus(
  db: Db,
  blogPostId: string,
  companyId: string,
  status: BlogPostStatusValue,
) {
  return db.blogPost.update({
    data: {
      publishedAt: status === "published" ? new Date() : null,
      status,
    },
    where: { id: blogPostId, companyId, deletedAt: null },
  });
}

export async function deleteBlogPost(
  db: Db,
  blogPostId: string,
  companyId: string,
) {
  return db.blogPost.update({
    data: { deletedAt: new Date() },
    where: { id: blogPostId, companyId, deletedAt: null },
  });
}

export async function getBlogPostForCompany(
  db: Db,
  blogPostId: string,
  companyId: string,
) {
  return db.blogPost.findFirst({
    where: { companyId, deletedAt: null, id: blogPostId },
  });
}

export async function listBlogPostsForCompany(
  db: Db,
  companyId: string,
  options: { limit?: number; status?: BlogPostStatusValue } = {},
) {
  return db.blogPost.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: options.limit ?? 50,
    where: {
      companyId,
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    },
  });
}

export async function listPublishedBlogPostsForCompany(
  db: Db,
  companyId: string,
  options: { limit?: number } = {},
) {
  return db.blogPost.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: options.limit ?? 24,
    where: {
      companyId,
      deletedAt: null,
      status: "published",
    },
  });
}

export async function getPublishedBlogPostBySlug(
  db: Db,
  companyId: string,
  slug: string,
) {
  return db.blogPost.findFirst({
    where: {
      companyId,
      deletedAt: null,
      slug,
      status: "published",
    },
  });
}
