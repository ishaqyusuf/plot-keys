"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import type { inferRouterOutputs } from "@trpc/server";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  blogPostStatusConfig,
  formatBlogDate,
} from "@/components/blog/blog-utils";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type BlogPostTableRow =
  RouterOutputs["workspace"]["listBlogPosts"]["data"][number];

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
  {
    accessorFn: (row) => row.title,
    cell: ({ row }) => <PostCell post={row.original} />,
    header: "Post",
    id: "post",
    meta: {
      className: "min-w-[300px] md:sticky md:left-0 md:z-20 md:bg-background",
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
    cell: ({ row }) => (
      <div
        className="flex justify-end"
        onClick={(event) => event.stopPropagation()}
      >
        <Button asChild size="sm" variant="outline">
          <Link href={`/blog/${row.original.id}`}>Edit</Link>
        </Button>
      </div>
    ),
    header: "",
    id: "actions",
    meta: {
      className:
        "min-w-[120px] text-right md:sticky md:right-0 md:z-20 md:border-l md:border-border md:bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-[#0f0f0f]",
      headerLabel: "Actions",
      skeleton: { type: "text", width: "w-20" },
      sticky: true,
    },
    size: 140,
  },
];
