"use client";

import { CoreColumnVisibility } from "@/components/tables/core";
import { useBlogStore } from "@/store/blog";

export function BlogColumnVisibility() {
  const { columns } = useBlogStore();

  return <CoreColumnVisibility columns={columns} />;
}
