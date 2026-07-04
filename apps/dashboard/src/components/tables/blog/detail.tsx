"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { BlogPostForm } from "@/components/forms/blog-post-form";
import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import { useTRPC } from "@/trpc/client";
import { blogPostStatusConfig, formatBlogDate } from "@/components/blog/blog-utils";

type BlogDetailTableProps = {
  blogPostId: string;
  notice?: "created" | "saved";
};

export function BlogDetailTable({ blogPostId, notice }: BlogDetailTableProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: post } = useSuspenseQuery(
    trpc.workspace.getBlogPost.queryOptions({ blogPostId }),
  );

  async function invalidateBlogQueries() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.workspace.getBlogPost.queryKey({ blogPostId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.workspace.listBlogPosts.queryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.workspace.getBlogPostStats.queryKey(),
      }),
    ]);
  }

  const updateStatusMutation = useMutation(
    trpc.workspace.updateBlogPostStatus.mutationOptions({
      onSuccess: invalidateBlogQueries,
    }),
  );
  const deletePostMutation = useMutation(
    trpc.workspace.deleteBlogPost.mutationOptions({
      async onSuccess() {
        await invalidateBlogQueries();
        router.push("/blog");
      },
    }),
  );

  if (!post) {
    return (
      <DashboardEmptyState
        actions={
          <Button asChild>
            <Link href="/blog">Back to blog</Link>
          </Button>
        }
        description="This post may have been deleted, archived outside this workspace, or opened from an old link."
        icon={<FileText className="size-5" />}
        title="Blog post not found"
      />
    );
  }

  const statusConfig = blogPostStatusConfig[post.status];
  const statusError =
    updateStatusMutation.error?.message ?? deletePostMutation.error?.message;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      {statusError ? (
        <Alert variant="destructive">
          <AlertDescription>{statusError}</AlertDescription>
        </Alert>
      ) : null}

      {notice === "created" ? (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>Draft blog post created.</AlertDescription>
        </Alert>
      ) : null}

      {notice === "saved" ? (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>Blog post updated.</AlertDescription>
        </Alert>
      ) : null}

      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Content workspace</DashboardPageEyebrow>
            <DashboardPageTitle>{post.title}</DashboardPageTitle>
            <DashboardPageDescription>
              Public URL: <code>/blog/{post.slug}</code> - Published{" "}
              {formatBlogDate(post.publishedAt)}
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Button asChild size="sm" variant="outline">
              <Link href="/blog">Back to blog</Link>
            </Button>
            {post.status !== "published" ? (
              <Button
                disabled={updateStatusMutation.isPending}
                onClick={() =>
                  updateStatusMutation.mutate({
                    blogPostId: post.id,
                    status: "published",
                  })
                }
                size="sm"
                type="button"
              >
                Publish
              </Button>
            ) : (
              <Button
                disabled={updateStatusMutation.isPending}
                onClick={() =>
                  updateStatusMutation.mutate({
                    blogPostId: post.id,
                    status: "draft",
                  })
                }
                size="sm"
                type="button"
                variant="outline"
              >
                Move to draft
              </Button>
            )}
            {post.status !== "archived" ? (
              <Button
                disabled={updateStatusMutation.isPending}
                onClick={() =>
                  updateStatusMutation.mutate({
                    blogPostId: post.id,
                    status: "archived",
                  })
                }
                size="sm"
                type="button"
                variant="outline"
              >
                Archive
              </Button>
            ) : null}
            <Button
              className="text-destructive hover:text-destructive"
              disabled={deletePostMutation.isPending}
              onClick={() => deletePostMutation.mutate({ blogPostId: post.id })}
              size="sm"
              type="button"
              variant="ghost"
            >
              {deletePostMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <Badge className="capitalize" variant={statusConfig.variant}>
            {statusConfig.label}
          </Badge>
          <Badge variant="outline">
            Updated {formatBlogDate(post.updatedAt)}
          </Badge>
        </div>
      </DashboardPageHeader>

      <DashboardSection>
        <DashboardSectionHeader>
          <div>
            <DashboardSectionTitle>Edit article</DashboardSectionTitle>
            <DashboardSectionDescription>
              Refine metadata, featured visuals, and rich content in one
              focused editorial surface.
            </DashboardSectionDescription>
          </div>
        </DashboardSectionHeader>

        <Card className="border-border/70 bg-card/82">
          <CardHeader>
            <CardTitle>Article details</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogPostForm post={post} />
          </CardContent>
        </Card>
      </DashboardSection>
    </div>
  );
}
