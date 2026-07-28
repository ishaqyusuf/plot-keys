"use client";

import { Button } from "@plotkeys/ui/button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogDetailHeader } from "@/components/blog/blog-detail-header";
import { BlogDetailNotice } from "@/components/blog/blog-detail-notice";
import { BlogDetailSection } from "@/components/blog/blog-detail-section";
import { BlogPostForm } from "@/components/forms/blog-post-form";
import { useTRPC } from "@/trpc/client";

type Props = {
  blogPostId: string;
};

export function BlogDetailContent({ blogPostId }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: post } = useSuspenseQuery(
    trpc.blog.get.queryOptions({ blogPostId }),
  );

  async function invalidateBlogQueries() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.blog.get.queryKey({ blogPostId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.blog.list.queryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.blog.stats.queryKey(),
      }),
    ]);
  }

  const updateStatusMutation = useMutation(
    trpc.blog.updateStatus.mutationOptions({
      onSuccess: invalidateBlogQueries,
    }),
  );
  const deletePostMutation = useMutation(
    trpc.blog.delete.mutationOptions({
      async onSuccess() {
        await invalidateBlogQueries();
        router.push("/blog");
      },
    }),
  );

  if (!post) {
    return (
      <div className="mx-auto flex min-h-56 w-full max-w-5xl items-center justify-center px-5 py-10">
        <div className="flex max-w-sm flex-col items-center text-center">
          <h3 className="font-medium text-foreground">Blog post not found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This post may have been deleted, archived outside this workspace, or
            opened from an old link.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/blog">Back to blog</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusError =
    updateStatusMutation.error?.message ?? deletePostMutation.error?.message;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      {statusError ? (
        <BlogDetailNotice variant="destructive">{statusError}</BlogDetailNotice>
      ) : null}

      <BlogDetailHeader
        isDeleting={deletePostMutation.isPending}
        onArchive={() =>
          updateStatusMutation.mutate({
            blogPostId: post.id,
            status: "archived",
          })
        }
        onDelete={() => deletePostMutation.mutate({ blogPostId: post.id })}
        onMoveToDraft={() =>
          updateStatusMutation.mutate({
            blogPostId: post.id,
            status: "draft",
          })
        }
        onPublish={() =>
          updateStatusMutation.mutate({
            blogPostId: post.id,
            status: "published",
          })
        }
        post={post}
        updatingStatus={
          updateStatusMutation.isPending
            ? (updateStatusMutation.variables?.status ?? null)
            : null
        }
      />

      <BlogDetailSection
        description="Refine metadata, featured visuals, and rich content in one focused editorial surface."
        title="Edit article"
      >
        <div className="border bg-background p-5">
          <BlogPostForm post={post} />
        </div>
      </BlogDetailSection>
    </div>
  );
}
