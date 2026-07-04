"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@plotkeys/ui/form";
import { Input } from "@plotkeys/ui/input";
import type { inferRouterOutputs } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { BlogRichTextEditor } from "@/components/blog/blog-rich-text-editor";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type BlogPostFormRecord = NonNullable<
  RouterOutputs["workspace"]["getBlogPost"]
>;

const blogPostFormSchema = z.object({
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().url("Enter a valid URL.").or(z.literal("")),
  slug: z.string().trim().min(1, "Slug is required."),
  title: z.string().trim().min(1, "Title is required."),
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

type BlogPostFormProps = {
  post: BlogPostFormRecord;
};

function getBlogPostFormValues(post: BlogPostFormRecord): BlogPostFormValues {
  return {
    content: post.content ?? "",
    excerpt: post.excerpt ?? "",
    featuredImage: post.featuredImage ?? "",
    slug: post.slug,
    title: post.title,
  };
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const form = useZodForm(blogPostFormSchema, {
    defaultValues: getBlogPostFormValues(post),
  });
  const updatePostMutation = useMutation(
    trpc.workspace.updateBlogPost.mutationOptions({
      async onSuccess(updatedPost) {
        setSaved(true);
        form.reset(getBlogPostFormValues(updatedPost));
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.getBlogPost.queryKey({
              blogPostId: post.id,
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.listBlogPosts.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.workspace.getBlogPostStats.queryKey(),
          }),
        ]);
      },
    }),
  );

  async function handleSubmit(values: BlogPostFormValues) {
    setSaved(false);
    await updatePostMutation.mutateAsync({
      blogPostId: post.id,
      content: values.content?.trim() ?? "",
      excerpt: values.excerpt?.trim() ?? "",
      featuredImage: values.featuredImage.trim(),
      slug: values.slug.trim(),
      title: values.title.trim(),
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Article title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="market-update" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Input
                  placeholder="Short summary shown on the blog listing page"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <BlogRichTextEditor
                name={field.name}
                onChange={field.onChange}
                value={field.value}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {updatePostMutation.error ? (
          <Alert variant="destructive">
            <AlertDescription>
              {updatePostMutation.error.message}
            </AlertDescription>
          </Alert>
        ) : null}

        {saved ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Blog post updated.</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end">
          <Button disabled={updatePostMutation.isPending} type="submit">
            {updatePostMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
