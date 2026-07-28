import { z } from "zod";

export const blogPostStatusSchema = z.enum(["draft", "published", "archived"]);

export const listBlogPostsInputSchema = z
  .object({
    cursor: z.union([z.string(), z.number()]).optional().nullable(),
    end: z.string().optional().nullable(),
    q: z.string().optional().nullable(),
    size: z.union([z.string(), z.number()]).optional().nullable(),
    sort: z.array(z.string()).optional().nullable(),
    start: z.string().optional().nullable(),
    status: blogPostStatusSchema.optional(),
  })
  .optional();

export const blogPostIdInputSchema = z.object({
  blogPostId: z.string().trim().min(1, "Blog post id is required."),
});

export const blogPostIdsInputSchema = z.object({
  blogPostIds: z.array(z.string().trim().min(1)).min(1),
});

export const updateBlogPostInputSchema = blogPostIdInputSchema.extend({
  content: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  featuredImage: z.string().url("Enter a valid URL.").or(z.literal("")),
  slug: z.string().trim().min(1, "Slug is required."),
  title: z.string().trim().min(1, "Title is required."),
});

export const updateBlogPostStatusInputSchema = blogPostIdInputSchema.extend({
  status: blogPostStatusSchema,
});
