import { BlogColumnVisibility } from "@/components/blog-column-visibility";
import { CreateBlogPostButton } from "@/components/blog-create-button";
import { BlogSearchFilter } from "@/components/blog-search-filter";
import { BlogStatusTabs } from "@/components/blog-status-tabs";

export function BlogHeader() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <BlogSearchFilter />

        <div className="flex items-center gap-2">
          <BlogColumnVisibility />
          <div className="hidden sm:block">
            <CreateBlogPostButton showIcon />
          </div>
        </div>
      </div>

      <BlogStatusTabs />
    </div>
  );
}
