import type { Prisma } from "../generated/prisma/client";
import type { Db } from "../prisma";
import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

export type BlogPostStatusValue = "draft" | "published" | "archived";

const blogPostStatuses = ["draft", "published", "archived"] as const;

export function normalizeBlogSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function ensureUniqueBlogSlugForCompany(
  db: Db,
  companyId: string,
  requestedSlug: string,
  excludeId?: string,
) {
  const baseSlug = normalizeBlogSlug(requestedSlug) || "untitled-post";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await db.blogPost.findFirst({
      select: { id: true },
      where: {
        companyId,
        deletedAt: null,
        slug: candidate,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });

    if (!existing) return candidate;

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

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
  const result = await db.blogPost.updateMany({
    data,
    where: { id: blogPostId, companyId, deletedAt: null },
  });

  if (result.count === 0) {
    return null;
  }

  return getBlogPostForCompany(db, blogPostId, companyId);
}

export async function setBlogPostStatus(
  db: Db,
  blogPostId: string,
  companyId: string,
  status: BlogPostStatusValue,
) {
  return db.blogPost.updateMany({
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
  return db.blogPost.updateMany({
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
  options: {
    cursor?: string | number | null;
    end?: string | null;
    limit?: number;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    start?: string | null;
    status?: BlogPostStatusValue;
  } = {},
) {
  const query = options.q?.trim();
  const endDate = parseDateBoundary(options.end, "end");
  const size = normalizeListPageSize(options.size ?? options.limit);
  const offset = normalizeListOffsetCursor(options.cursor);
  const startDate = parseDateBoundary(options.start, "start");
  const publishedAtFilter: Prisma.DateTimeNullableFilter | undefined =
    endDate || startDate
      ? {
          ...(endDate ? { lte: endDate } : {}),
          ...(startDate ? { gte: startDate } : {}),
        }
      : undefined;
  const where: Prisma.BlogPostWhereInput = {
    companyId,
    deletedAt: null,
    ...(publishedAtFilter ? { publishedAt: publishedAtFilter } : {}),
    ...(query ? { OR: getBlogPostSearchFilters(query) } : {}),
    ...(options.status ? { status: options.status } : {}),
  };

  const [count, data] = await db.$transaction([
    db.blogPost.count({ where }),
    db.blogPost.findMany({
      orderBy: getBlogPostOrderBy(options.sort),
      skip: offset,
      take: size,
      where,
    }),
  ]);
  return createPaginatedListResult(data, { count, offset, size });
}

function parseDateBoundary(
  value: string | null | undefined,
  boundary: "end" | "start",
) {
  if (!value) {
    return null;
  }

  const suffix = boundary === "start" ? "T00:00:00.000Z" : "T23:59:59.999Z";
  const date = new Date(`${value}${suffix}`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getBlogPostSearchFilters(query: string): Prisma.BlogPostWhereInput[] {
  const normalizedQuery = query.toLowerCase();
  const statusMatch = blogPostStatuses.find((status) =>
    status.includes(normalizedQuery),
  );
  const filters: Prisma.BlogPostWhereInput[] = [
    { content: { contains: query, mode: "insensitive" } },
    { excerpt: { contains: query, mode: "insensitive" } },
    { slug: { contains: query, mode: "insensitive" } },
    { title: { contains: query, mode: "insensitive" } },
  ];

  if (statusMatch) {
    filters.push({ status: statusMatch });
  }

  return filters;
}

function getBlogPostOrderBy(
  sort: string[] | null | undefined,
): Prisma.BlogPostOrderByWithRelationInput[] {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }

  switch (field) {
    case "createdAt":
      return [{ createdAt: direction }];
    case "excerpt":
      return [{ excerpt: direction }];
    case "publishedAt":
      return [{ publishedAt: direction }];
    case "slug":
      return [{ slug: direction }];
    case "status":
      return [{ status: direction }];
    case "title":
      return [{ title: direction }];
    case "updatedAt":
      return [{ updatedAt: direction }];
    default:
      return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }
}

export async function countBlogPostsByStatus(db: Db, companyId: string) {
  const grouped = await db.blogPost.groupBy({
    by: ["status"],
    where: { companyId, deletedAt: null },
    _count: { id: true },
  });

  const counts: Record<BlogPostStatusValue | "total", number> = {
    archived: 0,
    draft: 0,
    published: 0,
    total: 0,
  };

  for (const item of grouped) {
    counts[item.status] = item._count.id;
    counts.total += item._count.id;
  }

  return counts;
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
