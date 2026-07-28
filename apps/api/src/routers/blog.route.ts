import {
  countBlogPostsByStatus,
  createBlogPost,
  deleteBlogPost,
  ensureUniqueBlogSlugForCompany,
  getBlogPostForCompany,
  listBlogPostsForCompany,
  setBlogPostStatus,
  updateBlogPost,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  blogPostIdInputSchema,
  blogPostIdsInputSchema,
  listBlogPostsInputSchema,
  updateBlogPostInputSchema,
  updateBlogPostStatusInputSchema,
} from "../schemas/blog.schema";

export const blogRouter = createTRPCRouter({
  create: membershipProcedure.mutation(async ({ ctx }) => {
    const companyId = ctx.auth.activeMembership.companyId;
    const slug = await ensureUniqueBlogSlugForCompany(
      ctx.db.db,
      companyId,
      "untitled-post",
    );

    return createBlogPost(ctx.db.db, {
      authorId: ctx.auth.session.user.id,
      companyId,
      content: "# Untitled post\n\nStart writing here.",
      excerpt: "Add a short summary for this article.",
      slug,
      title: "Untitled post",
    });
  }),

  delete: membershipProcedure
    .input(blogPostIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await deleteBlogPost(
        ctx.db.db,
        input.blogPostId,
        ctx.auth.activeMembership.companyId,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found.",
        });
      }

      return { blogPostId: input.blogPostId };
    }),

  deleteMany: membershipProcedure
    .input(blogPostIdsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const blogPostIds = Array.from(new Set(input.blogPostIds));
      const results = await Promise.all(
        blogPostIds.map((blogPostId) =>
          deleteBlogPost(
            ctx.db.db,
            blogPostId,
            ctx.auth.activeMembership.companyId,
          ),
        ),
      );

      if (results.some((result) => result.count === 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more blog posts were not found.",
        });
      }

      return { ids: blogPostIds };
    }),

  get: membershipProcedure
    .input(blogPostIdInputSchema)
    .query(async ({ ctx, input }) => {
      return getBlogPostForCompany(
        ctx.db.db,
        input.blogPostId,
        ctx.auth.activeMembership.companyId,
      );
    }),

  list: membershipProcedure
    .input(listBlogPostsInputSchema)
    .query(async ({ ctx, input }) => {
      return listBlogPostsForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input ?? {},
      );
    }),

  stats: membershipProcedure.query(async ({ ctx }) => {
    return countBlogPostsByStatus(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  update: membershipProcedure
    .input(updateBlogPostInputSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      const existing = await getBlogPostForCompany(
        ctx.db.db,
        input.blogPostId,
        companyId,
      );

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found.",
        });
      }

      const slug = await ensureUniqueBlogSlugForCompany(
        ctx.db.db,
        companyId,
        input.slug,
        input.blogPostId,
      );
      const post = await updateBlogPost(
        ctx.db.db,
        input.blogPostId,
        companyId,
        {
          content: input.content?.trim() ?? "",
          excerpt: input.excerpt?.trim() || null,
          featuredImage: input.featuredImage.trim() || null,
          slug,
          title: input.title.trim(),
        },
      );

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found.",
        });
      }

      return post;
    }),

  updateStatus: membershipProcedure
    .input(updateBlogPostStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await setBlogPostStatus(
        ctx.db.db,
        input.blogPostId,
        ctx.auth.activeMembership.companyId,
        input.status,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found.",
        });
      }

      return { blogPostId: input.blogPostId, status: input.status };
    }),
});
