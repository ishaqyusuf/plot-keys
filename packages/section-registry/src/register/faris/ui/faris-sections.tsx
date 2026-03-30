"use client";

/**
 * Faris (Solo) family section components.
 *
 * Design identity: warm, personal, relationship-driven single-agent brand.
 * Warm white backgrounds, stone/amber accent, large headshot area in hero,
 * personal bio emphasis. Approachable and human — "Your trusted local expert."
 * Clean sans-serif body with warm serif accents on headings.
 *
 * All components:
 *  - Accept { config, theme } matching the generic section config types
 *  - Use EditableText for every static contentKey field
 *  - Render dataSource items (listings, agents) as display-only
 *  - Use Tailwind + var(--pk-*) CSS custom properties only — no shadcn
 */

import type { CSSProperties, ReactNode } from "react";

import { EditableText } from "../../../sections/editing-primitives";
import type {
  PropertyGridConfig,
  ServiceHighlightsConfig,
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

/** Warm amber pill label above section headings */
function WarmTag({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-amber-700/80">
      {children}
    </p>
  );
}

/** Warm serif-accented heading */
function WarmHeading({
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
      className={`font-semibold leading-tight text-stone-800 ${className}`}
      style={{ fontFamily: theme.headingFontFamily }}
    >
      {children}
    </Tag>
  );
}

/** Soft amber/warm button */
function WarmButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: string;
  variant?: "primary" | "outline" | "ghost";
}) {
  const styles = {
    primary:
      "bg-amber-700 text-white shadow-md hover:bg-amber-800 transition-colors",
    outline:
      "border-2 border-stone-300 bg-transparent text-stone-700 hover:border-amber-700 hover:text-amber-700 transition-colors",
    ghost:
      "bg-transparent text-stone-500 underline-offset-4 hover:underline hover:text-stone-700",
  };

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold ${styles[variant]}`}
    >
      {children}
    </a>
  );
}

/** Thin warm divider rule */
function WarmRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-10 rounded-full bg-amber-400/60 ${className}`}
      aria-hidden
    />
  );
}

// ---------------------------------------------------------------------------
// FarisHeroBannerSection
// ---------------------------------------------------------------------------
// Personal brand hero — large agent name, warm tagline, headshot placeholder,
// "Book a Call" CTA. Single-agent focus.
// ---------------------------------------------------------------------------

export function FarisHeroBannerSection({
  config,
  theme,
}: {
  config: HeroBannerConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="relative overflow-hidden bg-stone-50 px-6 py-16 md:px-12 md:py-24"
      style={shell(theme)}
    >
      {/* Warm radial wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 0%, rgba(217,119,6,0.10) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-center">
          {/* Left: personal content */}
          <div>
            <div className="flex items-center gap-3">
              <WarmRule />
              <WarmTag>
                <EditableText
                  contentKey="hero.eyebrow"
                  value={config.eyebrow}
                />
              </WarmTag>
            </div>

            <EditableText
              as="h1"
              className="mt-6 text-5xl font-bold leading-[1.05] text-stone-900 md:text-6xl lg:text-7xl"
              contentKey="hero.title"
              style={{ fontFamily: theme.headingFontFamily }}
              value={config.title}
            />

            <EditableText
              as="p"
              className="mt-5 max-w-lg text-lg leading-8 text-stone-500"
              contentKey="hero.subtitle"
              value={config.subtitle}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <WarmButton href={config.ctaHref}>{config.ctaText}</WarmButton>
              <WarmButton href="#listings" variant="outline">
                View my listings
              </WarmButton>
            </div>

            {/* Market + support line */}
            <p className="mt-8 text-xs text-stone-400">
              {theme.market} &middot; {theme.supportLine}
            </p>
          </div>

          {/* Right: agent headshot area */}
          <div className="relative flex flex-col items-center">
            {/* Headshot placeholder */}
            <div className="relative h-72 w-64 overflow-hidden rounded-3xl bg-stone-200 shadow-xl md:h-80 md:w-72">
              {theme.logoUrl ? (
                <img
                  alt={theme.logo}
                  className="h-full w-full object-cover"
                  src={theme.logoUrl}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-300 text-4xl font-semibold text-stone-500">
                    {theme.logo.charAt(0)}
                  </div>
                  <p className="text-sm text-stone-400">{theme.logo}</p>
                </div>
              )}

              {/* Warm accent badge */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                <p className="text-xs font-semibold text-stone-700">
                  {theme.logo}
                </p>
                <p className="text-[10px] text-stone-400">{theme.market}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FarisListingSpotlightSection
// ---------------------------------------------------------------------------
// Personal listings — "My Listings" heading style, warm card design.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function FarisListingSpotlightSection({
  config,
  theme,
}: {
  config: ListingSpotlightConfig;
  theme: ThemeConfig;
}) {
  const { getCardProps } = useItemOverviewTrigger();

  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <WarmTag>{config.eyebrow}</WarmTag>
            <WarmHeading tag="h2" theme={theme} className="mt-2 text-4xl">
              {config.title}
            </WarmHeading>
          </div>
          <a
            href="/listings"
            className="shrink-0 text-sm font-semibold text-amber-700 hover:underline"
          >
            See all my listings →
          </a>
        </div>

        <EditableText
          as="p"
          className="mt-3 max-w-xl text-base leading-7 text-stone-500"
          contentKey="listings.description"
          value={config.description}
        />

        {/* Listing cards — display-only */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => (
            <div
              key={i}
              {...getCardProps("listing", item)}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                  {item.imageHint || "Property image"}
                </div>
                <span className="absolute left-3 top-3 rounded-full bg-amber-700 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  For Sale
                </span>
              </div>

              <div className="p-4">
                <p className="text-xl font-bold text-stone-800">{item.price}</p>
                <p className="mt-1 text-sm font-medium text-stone-700">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-stone-400">{item.location}</p>
                {item.specs && (
                  <p className="mt-2 text-xs text-stone-400">{item.specs}</p>
                )}
                <a
                  href="#contact"
                  className="mt-4 block w-full rounded-full border border-amber-700/30 py-2 text-center text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50"
                >
                  Get in touch
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FarisMarketStatsSection
// ---------------------------------------------------------------------------
// Warm soft stat bar — personal achievement numbers, amber accent.
// ---------------------------------------------------------------------------

export function FarisMarketStatsSection({
  config,
  theme,
}: {
  config: MarketStatsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="border-y border-stone-200 bg-amber-50 px-6 py-10 md:px-12"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid divide-y divide-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {config.items.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 px-6 py-8 text-center sm:py-6"
            >
              <p
                className="text-4xl font-bold text-amber-700 md:text-5xl"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {stat.value}
              </p>
              <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FarisStoryGridSection
// ---------------------------------------------------------------------------
// Personal bio / story section — warm card grid, personal narrative emphasis.
// ---------------------------------------------------------------------------

export function FarisStoryGridSection({
  config,
  theme,
}: {
  config: StoryGridConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-stone-50 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <WarmRule />
          <WarmTag>{config.eyebrow}</WarmTag>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Left: bio text */}
          <div>
            <WarmHeading
              tag="h2"
              theme={theme}
              className="text-4xl md:text-5xl"
            >
              <EditableText contentKey="story.title" value={config.title} />
            </WarmHeading>
            <EditableText
              as="p"
              className="mt-5 text-base leading-9 text-stone-500 md:text-lg"
              contentKey="story.description"
              value={config.description}
            />
          </div>

          {/* Right: personal highlights */}
          <div className="space-y-4 lg:pt-1">
            {config.items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <div className="mb-3 h-0.5 w-6 rounded-full bg-amber-400" />
                <p
                  className="text-sm font-semibold text-stone-800"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-7 text-stone-500">
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
// FarisCtaBandSection
// ---------------------------------------------------------------------------
// Personal CTA — warm stone background, "Let's Talk" energy.
// ---------------------------------------------------------------------------

export function FarisCtaBandSection({
  config,
  theme,
}: {
  config: CtaBandConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-stone-800 px-6 py-16 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-4xl text-center">
        <WarmRule className="mx-auto mb-6" />

        <EditableText
          as="h2"
          className="text-4xl font-bold leading-tight text-white md:text-5xl"
          contentKey="cta.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />
        <EditableText
          as="p"
          className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-400"
          contentKey="cta.body"
          value={config.body}
        />
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <WarmButton href={config.primaryHref}>
            {config.primaryText}
          </WarmButton>
          <WarmButton href={config.secondaryHref} variant="ghost">
            {config.secondaryText}
          </WarmButton>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FarisTestimonialStripSection
// ---------------------------------------------------------------------------
// Client testimonials — prominent, personal, warm background with large quotes.
// ---------------------------------------------------------------------------

export function FarisTestimonialStripSection({
  config,
  theme,
}: {
  config: TestimonialStripConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-amber-50 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <WarmRule />
          <WarmTag>What my clients say</WarmTag>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm"
            >
              {/* Large warm quote mark */}
              <p
                className="mb-4 text-5xl font-bold leading-none text-amber-300"
                style={{ fontFamily: theme.headingFontFamily }}
                aria-hidden
              >
                &ldquo;
              </p>
              <p className="text-sm leading-7 text-stone-600 italic">
                {t.quote}
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
                  {t.speaker.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    {t.speaker}
                  </p>
                  <p className="text-xs text-stone-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FarisWhyChooseUsSection
// ---------------------------------------------------------------------------
// Personal trust signals — warm card grid, stat + description.
// ---------------------------------------------------------------------------

export function FarisWhyChooseUsSection({
  config,
  theme,
}: {
  config: WhyChooseUsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <WarmTag>{config.eyebrow}</WarmTag>
          <WarmHeading
            tag="h2"
            theme={theme}
            className="mt-2 text-4xl md:text-5xl"
          >
            {config.title}
          </WarmHeading>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 text-2xl">{item.icon}</div>
              <p
                className="text-3xl font-bold text-amber-700"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.stat}
              </p>
              <p className="mt-1 font-semibold text-stone-800">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FarisPropertyGridSection
// ---------------------------------------------------------------------------
// Full personal listing grid. dataSource items are display-only.
// ---------------------------------------------------------------------------

export function FarisPropertyGridSection({
  config,
  theme,
}: {
  config: PropertyGridConfig;
  theme: ThemeConfig;
}) {
  const { getCardProps } = useItemOverviewTrigger();

  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <WarmTag>{config.eyebrow}</WarmTag>
            <WarmHeading tag="h2" theme={theme} className="mt-2 text-4xl">
              {config.title}
            </WarmHeading>
          </div>
          {config.ctaHref && config.ctaText && (
            <a
              href={config.ctaHref}
              className="hidden text-sm font-semibold text-amber-700 hover:underline sm:block"
            >
              {config.ctaText} →
            </a>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item) => (
            <div
              key={item.id}
              {...getCardProps("listing", item)}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100">
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover"
                    src={item.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                    No image
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-amber-700 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  Listed
                </span>
              </div>
              <div className="p-4">
                {item.price && (
                  <p className="text-xl font-bold text-stone-800">
                    {item.price}
                  </p>
                )}
                <p className="mt-1 text-sm font-medium text-stone-700">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-stone-400">{item.location}</p>
                {item.specs && (
                  <p className="mt-1.5 text-xs text-stone-400">{item.specs}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {config.ctaHref && config.ctaText && (
          <div className="mt-8 sm:hidden">
            <a
              href={config.ctaHref}
              className="text-sm font-semibold text-amber-700 hover:underline"
            >
              {config.ctaText} →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FarisServiceHighlightsSection
// ---------------------------------------------------------------------------
// Personal services — warm icon cards, what the agent offers.
// ---------------------------------------------------------------------------

export function FarisServiceHighlightsSection({
  config,
  theme,
}: {
  config: ServiceHighlightsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-stone-50 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <WarmTag>{config.eyebrow}</WarmTag>
          <WarmHeading
            tag="h2"
            theme={theme}
            className="mt-2 text-4xl md:text-5xl"
          >
            {config.title}
          </WarmHeading>
          <EditableText
            as="p"
            className="mt-3 max-w-xl text-base leading-7 text-stone-500"
            contentKey="services.description"
            value={config.description}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl">
                {item.icon}
              </div>
              <p
                className="font-semibold text-stone-800"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
