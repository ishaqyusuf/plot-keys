import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import {
  blogPostStatusConfig,
  formatBlogDate,
} from "@/components/blog/blog-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type BlogPost = NonNullable<RouterOutputs["blog"]["get"]>;

type Props = {
  isDeleting: boolean;
  onArchive: () => void;
  onDelete: () => void;
  onMoveToDraft: () => void;
  onPublish: () => void;
  post: BlogPost;
  updatingStatus: BlogPost["status"] | null;
};

export function BlogDetailHeader({
  isDeleting,
  onArchive,
  onDelete,
  onMoveToDraft,
  onPublish,
  post,
  updatingStatus,
}: Props) {
  const statusConfig = blogPostStatusConfig[post.status];
  const isUpdating = updatingStatus !== null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            Content workspace
          </p>
          <h1 className="break-words text-2xl font-semibold text-foreground">
            {post.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Public URL: <code>/blog/{post.slug}</code> - Published{" "}
            {formatBlogDate(post.publishedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog">Back to blog</Link>
          </Button>
          {post.status !== "published" ? (
            <SubmitButton
              disabled={isUpdating}
              isSubmitting={updatingStatus === "published"}
              onClick={onPublish}
              size="sm"
            >
              Publish
            </SubmitButton>
          ) : (
            <SubmitButton
              variant="outline"
              size="sm"
              disabled={isUpdating}
              isSubmitting={updatingStatus === "draft"}
              onClick={onMoveToDraft}
            >
              Move to draft
            </SubmitButton>
          )}
          {post.status !== "archived" ? (
            <SubmitButton
              variant="outline"
              size="sm"
              disabled={isUpdating}
              isSubmitting={updatingStatus === "archived"}
              onClick={onArchive}
            >
              Archive
            </SubmitButton>
          ) : null}
          <SubmitButton
            variant="ghost"
            size="sm"
            isSubmitting={isDeleting}
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </SubmitButton>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Badge variant={statusConfig.variant} className="capitalize">
          {statusConfig.label}
        </Badge>
        <Badge variant="outline">
          Updated {formatBlogDate(post.updatedAt)}
        </Badge>
      </div>
    </div>
  );
}
