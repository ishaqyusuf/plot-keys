import { createLoader, parseAsString } from "nuqs/server";

export const blogFilterParams = {
  q: parseAsString,
  status: parseAsString,
};

export const loadBlogFilterParams = createLoader(blogFilterParams);

export type BlogFilters = ReturnType<typeof loadBlogFilterParams>;
