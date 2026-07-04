"use client";

import {
  DashboardFilterTab,
  DashboardFilterTabs,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardTableFilters,
  DashboardTableHeaderTop,
  DashboardTablePageDescription,
  DashboardTablePageHeader,
  DashboardTablePageTitle,
  DashboardToolbarGroup,
} from "@/components/dashboard/dashboard-page";
import { BlogColumnVisibility } from "@/components/blog-column-visibility";
import { CreateBlogPostButton } from "./create-button";
import { BlogSearchFilter } from "./search-filter";
import {
  blogPostStatuses,
  blogPostStatusConfig,
  type BlogPostStatus,
} from "@/components/blog/blog-utils";

type BlogStats = Record<BlogPostStatus | "total", number>;

type BlogPageHeaderProps = {
  activeStatus?: BlogPostStatus;
  stats: BlogStats;
};

type BlogTableHeaderProps = {
  postCount: number;
};

export function BlogPageHeader({ activeStatus, stats }: BlogPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Content workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Blog</DashboardPageTitle>
          <DashboardPageDescription>
            Manage editorial drafts, published articles, and archived posts for
            your public site.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <CreateBlogPostButton showIcon />
        </DashboardPageActions>
      </DashboardPageHeaderRow>

      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          {stats.total} post{stats.total !== 1 ? "s" : ""}
        </DashboardToolbarGroup>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            <DashboardFilterTab active={!activeStatus} href="/blog">
              All ({stats.total})
            </DashboardFilterTab>
            {blogPostStatuses.map((status) => (
              <DashboardFilterTab
                active={activeStatus === status}
                href={`/blog?status=${status}`}
                key={status}
              >
                {blogPostStatusConfig[status].label} ({stats[status] ?? 0})
              </DashboardFilterTab>
            ))}
          </DashboardFilterTabs>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}

export function BlogTableHeader({ postCount }: BlogTableHeaderProps) {
  return (
    <DashboardTablePageHeader>
      <DashboardTableHeaderTop>
        <div>
          <DashboardTablePageTitle>Editorial queue</DashboardTablePageTitle>
          <DashboardTablePageDescription>
            Review every article from newest activity first and open drafts for
            editing when they are ready to move forward.
          </DashboardTablePageDescription>
        </div>
        <DashboardPageActions>
          <BlogColumnVisibility />
        </DashboardPageActions>
      </DashboardTableHeaderTop>

      <DashboardTableFilters>
        <BlogSearchFilter />
        <span className="text-sm text-muted-foreground">
          {postCount} total
        </span>
      </DashboardTableFilters>
    </DashboardTablePageHeader>
  );
}
