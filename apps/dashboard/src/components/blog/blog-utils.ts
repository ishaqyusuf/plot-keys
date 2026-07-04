export const blogPostStatuses = ["draft", "published", "archived"] as const;

export type BlogPostStatus = (typeof blogPostStatuses)[number];

export const blogPostStatusConfig: Record<
  BlogPostStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  archived: { label: "Archived", variant: "secondary" },
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "default" },
};

export function isBlogPostStatus(value?: string): value is BlogPostStatus {
  return blogPostStatuses.includes(value as BlogPostStatus);
}

export function formatBlogDate(value?: Date | null) {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}
