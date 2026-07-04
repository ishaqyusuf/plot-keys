"use client";

import { Button } from "@plotkeys/ui/button";
import { FileText, SearchX } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { CreateBlogPostButton } from "./create-button";
import { blogPostStatusConfig, type BlogPostStatus } from "@/components/blog/blog-utils";

type BlogEmptyStateProps = {
  activeStatus?: BlogPostStatus;
};

type BlogNoResultsProps = {
  onClear: () => void;
};

export function BlogEmptyState({ activeStatus }: BlogEmptyStateProps) {
  const statusLabel = activeStatus
    ? blogPostStatusConfig[activeStatus].label.toLowerCase()
    : null;

  return (
    <DashboardEmptyState
      actions={
        activeStatus ? null : (
          <CreateBlogPostButton size="default">
            Create first post
          </CreateBlogPostButton>
        )
      }
      description={
        statusLabel
          ? `No ${statusLabel} posts found.`
          : "Start with a draft and publish it when the article is ready."
      }
      icon={<FileText className="size-5" />}
      title={activeStatus ? "No posts in this view" : "No blog posts yet"}
    />
  );
}

export function BlogNoResults({ onClear }: BlogNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No posts found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current blog search.
        </p>
        <Button
          className="mt-4"
          onClick={onClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear search
        </Button>
      </div>
    </div>
  );
}
