"use client";

/**
 * Thuraya (Luxury) family section components.
 *
 * Design identity: editorial, high-end portfolio, refined silence.
 * Cream/ivory backgrounds, serif headings, generous whitespace, muted palette
 * with a single gold/amber accent. Minimal grid density. Quiet confidence.
 * "Property as art."
 *
 * All components:
 *  - Accept { config, theme } matching the generic section config types
 *  - Use EditableText for every static contentKey field
 *  - Render dataSource items (listings) as display-only
 *  - Use Tailwind + var(--pk-*) CSS custom properties only — no shadcn
 */

import type { CSSProperties, ReactNode } from "react";

import { EditableText } from "../../../sections/editing-primitives";
import type {
  AgentShowcaseConfig,
  PropertyGridConfig,
  WhyChooseUsConfig,
} from "../../../sections/extended-sections";
import type {
  CtaBandConfig,
  HeroBannerConfig,
  ListingSpotlightConfig,
  MarketStatsConfig,
  StoryGridConfig,
  TestimonialStripConfig,
  ThemeConfig,
} from "../../../sections/home-page";
import { useItemOverviewTrigger } from "../../../sections/interaction-utils";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function shell(theme: ThemeConfig) {
  return {
    "--section-bg": theme.backgroundColor,
    fontFamily: theme.fontFamily,
  } as CSSProperties;
}

/** Fine uppercase label — no badge, just spaced letterforms */
function EditorialTag({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[color:var(--muted-foreground)]">
      {children}
    </p>
  );
}

/** Large serif heading */
function SerifHeading({
  tag = "h2",
  children,
  theme,
  className = "",
}: {
  tag?: "h1" | "h2" | "h3";
  children: ReactNode;
  theme: ThemeConfig;
  className?: string;
}) {
  const Tag = tag;
  return (
    <Tag
      className={`font-serif leading-[1.08] text-[color:var(--foreground)] ${className}`}
      style={{ fontFamily: theme.headingFontFamily }}
    >
      {children}
    </Tag>
  );
}

/** Thin gold rule */
function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div className={`h-px w-12 bg-amber-400/70 ${className}`} aria-hidden />
  );
}

// ---------------------------------------------------------------------------
// ThurayaHeroBannerSection
// ---------------------------------------------------------------------------
// Full-bleed editorial hero. Serif title, minimal chrome, single CTA link.
// ---------------------------------------------------------------------------

export function ThurayaHeroBannerSection({
  config,
  theme,
}: {
  config: HeroBannerConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="relative overflow-hidden bg-[color:var(--background)] px-8 pb-20 pt-24 md:px-16 md:pb-28 md:pt-32"
      style={shell(theme)}
    >
      {/* Subtle tonal background wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,191,36,0.08) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-4">
          <GoldRule />
          <EditorialTag>
            <EditableText contentKey="hero.eyebrow" value={config.eyebrow} />
          </EditorialTag>
        </div>

        {/* Title */}
        <SerifHeading
          tag="h1"
          theme={theme}
          className="mt-8 text-5xl md:text-7xl lg:text-8xl"
        >
          <EditableText contentKey="hero.title" value={config.title} />
        </SerifHeading>

        {/* Subtitle + CTA */}
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <EditableText
            as="p"
            className="max-w-lg text-base leading-8 text-[color:var(--muted-foreground)] md:text-lg"
            contentKey="hero.subtitle"
            value={config.subtitle}
          />

          <a
            href={config.ctaHref}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)] transition-colors hover:text-amber-600"
          >
            <EditableText contentKey="hero.ctaText" value={config.ctaText} />
            <span
              className="transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </a>
        </div>

        {/* Bottom rule */}
        <div className="mt-16 h-px bg-[color:var(--border)]" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ThurayaListingSpotlightSection
// ---------------------------------------------------------------------------
// 2-column full-bleed cards with generous image area and minimal text.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function ThurayaListingSpotlightSection({
  config,
  theme,
}: {
  config: ListingSpotlightConfig;
  theme: ThemeConfig;
}) {
  const { getCardProps } = useItemOverviewTrigger();

  return (
    <section
      className="bg-[var(--section-bg)] px-8 py-20 md:px-16 md:py-28"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <EditorialTag>{config.eyebrow}</EditorialTag>
            <SerifHeading
              tag="h2"
              theme={theme}
              className="mt-4 text-4xl md:text-5xl"
            >
              {config.title}
            </SerifHeading>
          </div>
          <a
            href="/portfolio"
            className="hidden text-xs font-medium uppercase tracking-[0.3em] text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)] sm:block"
          >
            View all
          </a>
        </div>

        {/* 2-column listing cards */}
        <div className="grid gap-8 sm:grid-cols-2">
          {config.items.slice(0, 4).map((item, i) => (
            <div key={i} {...getCardProps("listing", item)} className="group">
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
                <div className="flex h-full w-full items-center justify-center text-xs text-stone-400 transition-transform duration-500 group-hover:scale-105">
                  {item.imageHint || "Property image"}
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 border-b border-[color:var(--border)] pb-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className="text-lg font-medium text-[color:var(--foreground)]"
                    style={{ fontFamily: theme.headingFontFamily }}
                  >
                    {item.title}
                  </p>
                  <p className="shrink-0 text-sm font-semibold text-amber-600">
                    {item.price}
                  </p>
                </div>
                <p className="mt-1 text-xs tracking-wide text-[color:var(--muted-foreground)]">
                  {item.location}
                </p>
                {item.specs && (
                  <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                    {item.specs}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ThurayaMarketStatsSection
// ---------------------------------------------------------------------------
// Refined stat row — thin rule above each number, no bold background.
// ---------------------------------------------------------------------------

export function ThurayaMarketStatsSection({
  config,
  theme,
}: {
  config: MarketStatsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="border-y border-[color:var(--border)] bg-[var(--section-bg)] px-8 py-14 md:px-16"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-8 divide-y divide-[color:var(--border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {config.items.map((stat, i) => (
            <div
              key={i}
              className="pt-8 sm:px-8 sm:pt-0 sm:first:pl-0 sm:last:pr-0"
            >
              <GoldRule className="mb-4" />
              <p
                className="text-4xl font-light text-[color:var(--foreground)] md:text-5xl"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ThurayaStoryGridSection
// ---------------------------------------------------------------------------
// Two-column split: long-form editorial text on left, key points on right.
// ---------------------------------------------------------------------------

export function ThurayaStoryGridSection({
  config,
  theme,
}: {
  config: StoryGridConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-8 py-20 md:px-16 md:py-28"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-5xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-4">
          <GoldRule />
          <EditorialTag>{config.eyebrow}</EditorialTag>
        </div>

        <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Left: headline + body */}
          <div>
            <SerifHeading
              tag="h2"
              theme={theme}
              className="text-4xl md:text-5xl"
            >
              <EditableText contentKey="story.title" value={config.title} />
            </SerifHeading>

            <EditableText
              as="p"
              className="mt-6 text-base leading-9 text-[color:var(--muted-foreground)] md:text-lg"
              contentKey="story.description"
              value={config.description}
            />
          </div>

          {/* Right: key points */}
          <div className="space-y-6 lg:pt-2">
            {config.items.map((item, i) => (
              <div key={i} className="border-l border-amber-400/50 pl-4">
                <p
                  className="text-sm font-semibold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-7 text-[color:var(--muted-foreground)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ThurayaCtaBandSection
// ---------------------------------------------------------------------------
// Full-width warm cream section — centered serif headline, text CTA link.
// ---------------------------------------------------------------------------

export function ThurayaCtaBandSection({
  config,
  theme,
}: {
  config: CtaBandConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-stone-50 px-8 py-20 dark:bg-stone-900/30 md:px-16 md:py-28"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-3xl text-center">
        <GoldRule className="mx-auto mb-8" />

        <SerifHeading tag="h2" theme={theme} className="text-4xl md:text-5xl">
          <EditableText contentKey="cta.title" value={config.title} />
        </SerifHeading>

        <EditableText
          as="p"
          className="mx-auto mt-6 max-w-xl text-base leading-9 text-[color:var(--muted-foreground)]"
          contentKey="cta.body"
          value={config.body}
        />

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={config.primaryHref}
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.28em] text-[color:var(--foreground)] transition-colors hover:text-amber-600"
          >
            {config.primaryText}
            <span
              className="transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </a>

          <span
            className="hidden text-[color:var(--border)] sm:block"
            aria-hidden
          >
            ·
          </span>

          <a
            href={config.secondaryHref}
            className="text-sm font-medium uppercase tracking-[0.28em] text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
          >
            {config.secondaryText}
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ThurayaTestimonialStripSection
// ---------------------------------------------------------------------------
// Minimal quote cards — no card chrome, just a rule and italic quote.
// ---------------------------------------------------------------------------

export function ThurayaTestimonialStripSection({
  config,
  theme,
}: {
  config: TestimonialStripConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-8 py-16 md:px-16"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((t, i) => (
            <div key={i} className="pt-6">
              <GoldRule className="mb-5" />
              <p
                className="text-base italic leading-8 text-[color:var(--foreground)]"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                {t.speaker} — {t.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ThurayaPropertyGridSection
// ---------------------------------------------------------------------------
// 2-column editorial portfolio grid. dataSource items are display-only.
// ---------------------------------------------------------------------------

export function ThurayaPropertyGridSection({
  config,
  theme,
}: {
  config: PropertyGridConfig;
  theme: ThemeConfig;
}) {
  const { getCardProps } = useItemOverviewTrigger();

  return (
    <section
      className="bg-[var(--section-bg)] px-8 py-20 md:px-16 md:py-28"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <EditorialTag>{config.eyebrow}</EditorialTag>
          <SerifHeading
            tag="h2"
            theme={theme}
            className="mt-4 text-4xl md:text-5xl"
          >
            {config.title}
          </SerifHeading>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {config.items.map((item) => (
            <div
              key={item.id}
              {...getCardProps("listing", item)}
              className="group"
            >
              <div className="aspect-[3/2] overflow-hidden bg-stone-100 dark:bg-stone-900">
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                    src={item.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-4 border-b border-[color:var(--border)] pb-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className="text-base font-medium text-[color:var(--foreground)]"
                    style={{ fontFamily: theme.headingFontFamily }}
                  >
                    {item.title}
                  </p>
                  {item.price && (
                    <p className="shrink-0 text-sm font-semibold text-amber-600">
                      {item.price}
                    </p>
                  )}
                </div>
                <p className="mt-1 text-xs tracking-wide text-[color:var(--muted-foreground)]">
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ThurayaAgentShowcaseSection
// ---------------------------------------------------------------------------
// Minimal agent profiles — large photo, restrained type.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function ThurayaAgentShowcaseSection({
  config,
  theme,
}: {
  config: AgentShowcaseConfig;
  theme: ThemeConfig;
}) {
  const { getCardProps } = useItemOverviewTrigger();

  return (
    <section
      className="bg-[var(--section-bg)] px-8 py-20 md:px-16 md:py-28"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <EditorialTag>{config.eyebrow}</EditorialTag>
          <SerifHeading
            tag="h2"
            theme={theme}
            className="mt-4 text-4xl md:text-5xl"
          >
            {config.title}
          </SerifHeading>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((agent) => (
            <div key={agent.id} {...getCardProps("agent", agent)}>
              <div className="aspect-[3/4] overflow-hidden bg-stone-100 dark:bg-stone-900">
                {agent.photoUrl ? (
                  <img
                    alt={agent.name}
                    className="h-full w-full object-cover"
                    src={agent.photoUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-stone-300">
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="mt-3 border-b border-[color:var(--border)] pb-3">
                <p
                  className="font-medium text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {agent.name}
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                  {agent.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ThurayaWhyChooseUsSection
// ---------------------------------------------------------------------------
// Editorial trust section — numbered points, no icon clutter.
// ---------------------------------------------------------------------------

export function ThurayaWhyChooseUsSection({
  config,
  theme,
}: {
  config: WhyChooseUsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-stone-50 px-8 py-20 dark:bg-stone-900/30 md:px-16 md:py-28"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <EditorialTag>{config.eyebrow}</EditorialTag>
          <SerifHeading
            tag="h2"
            theme={theme}
            className="mt-4 text-4xl md:text-5xl"
          >
            {config.title}
          </SerifHeading>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {config.items.map((item, i) => (
            <div key={i} className="flex gap-5">
              <span className="mt-0.5 font-serif text-3xl font-light text-amber-400/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p
                  className="font-semibold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-7 text-[color:var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
