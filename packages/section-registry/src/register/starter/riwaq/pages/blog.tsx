"use client";

import { Link } from "../../../../components/Link";
import type { BlogListConfig } from "../../../../sections/blog-sections";
import { EditableText } from "../../../../sections/editing-primitives";
import { useRiwaqPage } from "../hooks/use-riwaq-page";
import { riwaqSectionClassName } from "../ui/style";
import { RiwaqCtaBand } from "./cta-band";

function formatBlogDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function RiwaqBlogPage() {
  const ctx = useRiwaqPage();
  const showHeader = ctx.sectionVisible("hero_banner");
  const showBlog = ctx.sectionVisible("blog_list");
  const showCta = ctx.sectionVisible("cta_band");
  const blogSection = ctx.section("blog_list");
  const blogConfig = blogSection?.config as BlogListConfig | undefined;
  const blogItems = blogConfig?.items ?? [];

  return (
    <main
      className="bg-[color:var(--pk-background,#ffffff)] text-[color:var(--pk-foreground,#0f172a)]"
      data-page-key={ctx.page.pageKey ?? "blog"}
    >
      {showHeader || showBlog ? (
        <section className={riwaqSectionClassName(ctx.ui.preset)}>
          <div className="mx-auto max-w-4xl">
            {showHeader ? (
              <>
                <p className="text-xs font-semibold uppercase text-[color:var(--pk-primary,#2563eb)]">
                  <EditableText
                    contentKey="blog.eyebrow"
                    onCommit={ctx.commitContent}
                    value={ctx.content("blog.eyebrow", "Blog")}
                  />
                </p>
                <EditableText
                  as="h1"
                  className="mt-4 block text-4xl font-semibold text-[color:var(--pk-foreground,#0f172a)] [font-family:var(--pk-font-heading)] md:text-5xl"
                  contentKey="blog.title"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "blog.title",
                    "Notes from the market and project floor.",
                  )}
                />
              </>
            ) : null}
            {showBlog ? (
              <>
                <EditableText
                  as="p"
                  className="mt-5 block text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]"
                  contentKey="blog.subtitle"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "blog.subtitle",
                    "Publish project updates, customer guidance, and market commentary in one focused editorial stream.",
                  )}
                />
                {blogItems.length > 0 ? (
                  <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {blogItems.map((item) => {
                      const publishedAt = formatBlogDate(item.publishedAt);

                      return (
                        <Link
                          className={ctx.ui.surface({
                            className:
                              "group block overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-md",
                          })}
                          href={`/blog/${item.slug}`}
                          key={item.id}
                        >
                          <div className="aspect-[16/9] bg-[color:var(--pk-muted,#f1f5f9)]">
                            {item.featuredImageUrl ? (
                              <img
                                alt={item.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                src={item.featuredImageUrl}
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--pk-muted-foreground,#64748b)]">
                                Market note
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            {publishedAt ? (
                              <p
                                className="text-xs font-semibold uppercase tracking-[0.22em]"
                                style={{
                                  color:
                                    "var(--pk-chart, var(--pk-primary,#2563eb))",
                                }}
                              >
                                {publishedAt}
                              </p>
                            ) : null}
                            <h2 className="mt-3 text-xl font-semibold leading-tight [font-family:var(--pk-font-heading)]">
                              {item.title}
                            </h2>
                            {item.excerpt ? (
                              <p className="mt-3 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
                                {item.excerpt}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className={ctx.ui.surface({ className: "mt-10 p-6" })}>
                    <p className="text-sm font-medium">
                      Articles are coming soon.
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
                      Publish market updates, project notes, and buyer guides
                      from the dashboard.
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </section>
      ) : null}
      {showCta ? <RiwaqCtaBand /> : null}
    </main>
  );
}
