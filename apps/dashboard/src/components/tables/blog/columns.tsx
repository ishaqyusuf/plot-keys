"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import {
  blogPostStatusConfig,
  formatBlogDate,
} from "@/components/blog/blog-utils";
import { createSelectColumn } from "@/components/tables/core";
import { ActionsMenu } from "./actions-menu";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type BlogPostTableRow = RouterOutputs["blog"]["list"]["data"][number];

function PostCell({ post }: { post: BlogPostTableRow }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Link
          className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary"
          href={`/blog/${post.id}`}
          onClick={(event) => event.stopPropagation()}
        >
          {post.title}
        </Link>
        <Badge variant={blogPostStatusConfig[post.status].variant}>
          {blogPostStatusConfig[post.status].label}
        </Badge>
      </div>
      <p className="truncate text-xs text-muted-foreground">
        /blog/{post.slug}
      </p>
    </div>
  );
}

function DateCell({ post }: { post: BlogPostTableRow }) {
  return (
    <div className="space-y-1 text-sm text-muted-foreground">
      <p>Published {formatBlogDate(post.publishedAt)}</p>
      <p>Updated {formatBlogDate(post.updatedAt)}</p>
    </div>
  );
}

export const columns: ColumnDef<BlogPostTableRow>[] = [
  createSelectColumn<BlogPostTableRow>(),
  {
    accessorFn: (row) => row.title,
    cell: ({ row }) => <PostCell post={row.original} />,
    header: "Post",
    id: "post",
    meta: {
      className:
        "min-w-[300px] md:sticky md:left-[50px] bg-background group-hover:bg-muted z-20",
      headerLabel: "Post",
      skeleton: { type: "text", width: "w-52" },
      sticky: true,
    },
    size: 360,
  },
  {
    accessorKey: "excerpt",
    cell: ({ row }) => (
      <p className="line-clamp-2 max-w-[460px] text-sm text-muted-foreground">
        {row.original.excerpt ?? "No excerpt"}
      </p>
    ),
    header: "Excerpt",
    id: "excerpt",
    meta: {
      className: "min-w-[300px]",
      headerLabel: "Excerpt",
      skeleton: { type: "text", width: "w-48" },
    },
    size: 460,
  },
  {
    cell: ({ row }) => <DateCell post={row.original} />,
    header: "Activity",
    id: "activity",
    meta: {
      className: "min-w-[220px]",
      headerLabel: "Activity",
      skeleton: { type: "text", width: "w-32" },
    },
    size: 260,
  },
  {
    cell: ({ row }) => <ActionsMenu row={row.original} />,
    header: "Actions",
    id: "actions",
    meta: {
      className:
        "min-w-[80px] md:sticky md:right-0 bg-background group-hover:bg-muted z-30 justify-center !border-l !border-border",
      headerLabel: "Actions",
      skeleton: { type: "icon" },
      sticky: true,
    },
    size: 80,
  },
];
