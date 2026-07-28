"use client";

import {
  type BlogPostStatus,
  blogPostStatusConfig,
} from "@/components/blog/blog-utils";
import { CreateBlogPostButton } from "@/components/blog-create-button";
import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useBlogFilterParams } from "@/hooks/use-blog-filter-params";

type Props = {
  activeStatus?: BlogPostStatus;
};

export function EmptyState({ activeStatus }: Props) {
  const statusLabel = activeStatus
    ? blogPostStatusConfig[activeStatus].label.toLowerCase()
    : null;

  return (
    <CoreEmptyState
      action={
        activeStatus ? null : (
          <CreateBlogPostButton variant="outline" size="default">
            Create first post
          </CreateBlogPostButton>
        )
      }
      description={
        statusLabel
          ? `No ${statusLabel} posts found.`
          : "Start with a draft and publish it when the article is ready."
      }
      title={activeStatus ? "No posts in this view" : "No blog posts yet"}
    />
  );
}

export function NoResults() {
  const { setFilter } = useBlogFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
