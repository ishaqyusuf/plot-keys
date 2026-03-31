import type { JSX, ReactNode } from "react";

import type { ThemeConfig } from "./home-page";

export type BlogPostSummaryItem = {
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  id: string;
  publishedAt?: string | null;
  slug: string;
  title: string;
};

export type BlogListConfig = {
  description?: string;
  eyebrow?: string;
  items: BlogPostSummaryItem[];
  title: string;
};

export type BlogPostConfig = {
  backHref: string;
  content: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  publishedAt?: string | null;
  title: string;
};

function shell(theme: ThemeConfig) {
  return {
    "--section-bg": theme.backgroundColor,
    fontFamily: theme.fontFamily,
  } as const;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function sanitizeHref(href: string) {
  if (href.startsWith("/")) return href;

  try {
    const parsed = new URL(href);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function renderInline(text: string): ReactNode[] {
  const output: ReactNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|_([^_]+)_)/g;
  let lastIndex = 0;
  let match = pattern.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      output.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      const href = sanitizeHref(match[3]);
      output.push(
        href ? (
          <a
            key={`${match.index}-link`}
            className="text-[color:var(--primary)] underline underline-offset-4"
            href={href}
            rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
            target={href.startsWith("http") ? "_blank" : undefined}
          >
            {match[2]}
          </a>
        ) : (
          match[2]
        ),
      );
    } else if (match[4]) {
      output.push(
        <strong key={`${match.index}-strong`} className="font-semibold">
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      output.push(
        <em key={`${match.index}-em`} className="italic">
          {match[5]}
        </em>,
      );
    }

    lastIndex = pattern.lastIndex;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    output.push(text.slice(lastIndex));
  }

  return output.length > 0 ? output : [text];
}

function renderMarkdown(markdown: string) {
  const blocks: JSX.Element[] = [];
  const paragraph: string[] = [];
  const listItems: string[] = [];
  const lines = markdown.split(/\r?\n/);

  function flushParagraph() {
    if (paragraph.length === 0) return;
    blocks.push(
      <p
        key={`paragraph-${blocks.length}`}
        className="text-base leading-8 text-[color:var(--muted-foreground)]"
      >
        {renderInline(paragraph.join(" "))}
      </p>,
    );
    paragraph.length = 0;
  }

  function flushList() {
    if (listItems.length === 0) return;
    blocks.push(
      <ul
        key={`list-${blocks.length}`}
        className="list-disc space-y-2 pl-5 text-base leading-8 text-[color:var(--muted-foreground)]"
      >
        {listItems.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    listItems.length = 0;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }

    flushList();

    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push(
        <h3
          key={`heading-3-${blocks.length}`}
          className="text-xl font-semibold text-[color:var(--foreground)]"
        >
          {renderInline(line.slice(4))}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push(
        <h2
          key={`heading-2-${blocks.length}`}
          className="text-2xl font-semibold text-[color:var(--foreground)]"
        >
          {renderInline(line.slice(3))}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      blocks.push(
        <h1
          key={`heading-1-${blocks.length}`}
          className="text-3xl font-semibold text-[color:var(--foreground)]"
        >
          {renderInline(line.slice(2))}
        </h1>,
      );
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks.length > 0 ? blocks : null;
}

export function BlogListSection({
  config,
  theme,
}: {
  config: BlogListConfig;
  theme: ThemeConfig;
}): JSX.Element {
  return (
    <section
      className="bg-[var(--section-bg)] dark:bg-[var(--background)] px-6 py-16 md:px-10 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        {config.eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
            {config.eyebrow}
          </p>
        ) : null}
        <h2
          className="mt-2 text-3xl font-bold text-[color:var(--foreground)] md:text-4xl"
          style={{ fontFamily: theme.headingFontFamily }}
        >
          {config.title}
        </h2>
        {config.description ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-[color:var(--muted-foreground)]">
            {config.description}
          </p>
        ) : null}

        {config.items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--card)] px-6 py-12 text-center">
            <p className="text-sm font-medium text-[color:var(--foreground)]">
              Articles are coming soon.
            </p>
            <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              Check back later for market updates, guides, and new insights.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {config.items.map((item) => (
              <a
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-shadow hover:shadow-md"
                href={`/blog/${item.slug}`}
              >
                <div className="aspect-[16/10] bg-[color:var(--muted)]">
                  {item.featuredImageUrl ? (
                    <img
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      src={item.featuredImageUrl}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[color:var(--muted-foreground)]">
                      Blog cover image
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  {formatDate(item.publishedAt) ? (
                    <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      {formatDate(item.publishedAt)}
                    </p>
                  ) : null}
                  <h3
                    className="text-xl font-semibold text-[color:var(--foreground)]"
                    style={{ fontFamily: theme.headingFontFamily }}
                  >
                    {item.title}
                  </h3>
                  {item.excerpt ? (
                    <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                      {item.excerpt}
                    </p>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function BlogPostSection({
  config,
  theme,
}: {
  config: BlogPostConfig;
  theme: ThemeConfig;
}): JSX.Element {
  return (
    <section
      className="bg-[var(--section-bg)] dark:bg-[var(--background)] px-6 py-16 md:px-10 md:py-20"
      style={shell(theme)}
    >
      <article className="mx-auto max-w-3xl">
        <a
          className="text-sm font-medium text-[color:var(--primary)] underline-offset-4 hover:underline"
          href={config.backHref}
        >
          ← Back to blog
        </a>
        {formatDate(config.publishedAt) ? (
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            {formatDate(config.publishedAt)}
          </p>
        ) : null}
        <h1
          className="mt-3 text-4xl font-bold text-[color:var(--foreground)] md:text-5xl"
          style={{ fontFamily: theme.headingFontFamily }}
        >
          {config.title}
        </h1>
        {config.excerpt ? (
          <p className="mt-4 text-lg leading-8 text-[color:var(--muted-foreground)]">
            {config.excerpt}
          </p>
        ) : null}
        {config.featuredImageUrl ? (
          <div className="mt-8 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]">
            <img
              alt={config.title}
              className="h-full w-full object-cover"
              loading="lazy"
              src={config.featuredImageUrl}
            />
          </div>
        ) : null}
        <div className="mt-10 space-y-6">{renderMarkdown(config.content)}</div>
      </article>
    </section>
  );
}
