import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let blogRouter: typeof import("./blog.route")["blogRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ blogRouter } = await import("./blog.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const post = {
    companyId: "company-1",
    content: "Draft content",
    deletedAt: null,
    excerpt: "Draft excerpt",
    featuredImage: null,
    id: "blog-1",
    slug: "draft-post",
    status: "draft",
    title: "Draft post",
  };
  const count = mock(async () => 1);
  const create = mock(async (query: unknown) => query);
  const findFirst = mock(async (query: { select?: { id: boolean } }) =>
    query.select ? null : post,
  );
  const findMany = mock(async () => [post]);
  const groupBy = mock(async () => [{ _count: { id: 1 }, status: "draft" }]);
  const updateMany = mock(async () => ({ count: 1 }));
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    blogPost: {
      count,
      create,
      findFirst,
      findMany,
      groupBy,
      updateMany,
    },
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
  };

  return {
    context: {
      auth: {
        activeMembership: {
          companyId: "company-1",
          role: "staff",
          workRole: "operations",
        },
        session: {
          user: {
            email: "staff@example.com",
            id: "user-1",
            name: "Test Staff",
          },
        },
      },
      databaseProvider: "postgres",
      db: {
        db,
        provider: "postgres",
        status: {
          available: true,
          message: null,
          provider: "postgres",
        },
      },
      headers: new Headers(),
    } as unknown as TRPCContext,
    count,
    create,
    findFirst,
    findMany,
    groupBy,
    updateMany,
  };
}

describe("blog router", () => {
  test("lists posts through the active company scope", async () => {
    const { context, count, findMany } = contextFor();
    const caller = blogRouter.createCaller(context);

    await expect(
      caller.list({ q: "Draft", size: 25, status: "draft" }),
    ).resolves.toMatchObject({
      data: [{ id: "blog-1", title: "Draft post" }],
      meta: { count: 1, size: 25 },
    });
    expect(count.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        status: "draft",
      },
    });
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        status: "draft",
      },
    });
  });

  test("returns tenant-scoped post status totals", async () => {
    const { context, groupBy } = contextFor();
    const caller = blogRouter.createCaller(context);

    await expect(caller.stats()).resolves.toEqual({
      archived: 0,
      draft: 1,
      published: 0,
      total: 1,
    });
    expect(groupBy.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
      },
    });
  });

  test("loads post details through the active company scope", async () => {
    const { context, findFirst } = contextFor();
    const caller = blogRouter.createCaller(context);

    await expect(caller.get({ blogPostId: "blog-1" })).resolves.toMatchObject({
      id: "blog-1",
      title: "Draft post",
    });
    expect(findFirst.mock.calls[0]?.[0]).toEqual({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "blog-1",
      },
    });
  });

  test("creates a tenant post with an author and unique slug", async () => {
    const { context, create, findFirst } = contextFor();
    const caller = blogRouter.createCaller(context);

    await caller.create();

    expect(findFirst.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        slug: "untitled-post",
      },
    });
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      data: {
        authorId: "user-1",
        companyId: "company-1",
        slug: "untitled-post",
        title: "Untitled post",
      },
    });
  });

  test("updates a post through slug and company predicates", async () => {
    const { context, findFirst, updateMany } = contextFor();
    const caller = blogRouter.createCaller(context);

    await caller.update({
      blogPostId: "blog-1",
      content: "Updated content",
      excerpt: "Updated excerpt",
      featuredImage: "",
      slug: "Updated Post",
      title: "Updated post",
    });

    expect(findFirst.mock.calls[1]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: { not: "blog-1" },
        slug: "updated-post",
      },
    });
    expect(updateMany.mock.calls[0]?.[0]).toEqual({
      data: {
        content: "Updated content",
        excerpt: "Updated excerpt",
        featuredImage: null,
        slug: "updated-post",
        title: "Updated post",
      },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "blog-1",
      },
    });
  });

  test("publishes through a company-qualified status write", async () => {
    const { context, updateMany } = contextFor();
    const caller = blogRouter.createCaller(context);

    await expect(
      caller.updateStatus({
        blogPostId: "blog-1",
        status: "published",
      }),
    ).resolves.toEqual({
      blogPostId: "blog-1",
      status: "published",
    });
    expect(updateMany.mock.calls[0]?.[0]).toMatchObject({
      data: {
        status: "published",
      },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "blog-1",
      },
    });
  });

  test("soft deletes unique selected posts through company predicates", async () => {
    const { context, updateMany } = contextFor();
    const caller = blogRouter.createCaller(context);

    await expect(
      caller.deleteMany({
        blogPostIds: ["blog-1", "blog-1", "blog-2"],
      }),
    ).resolves.toEqual({
      ids: ["blog-1", "blog-2"],
    });
    expect(updateMany).toHaveBeenCalledTimes(2);
    expect(updateMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "blog-1",
      },
    });
    expect(updateMany.mock.calls[1]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "blog-2",
      },
    });
  });
});
