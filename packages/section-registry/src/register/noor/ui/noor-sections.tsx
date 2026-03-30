"use client";

/**
 * Noor (Agency) family section components.
 *
 * Design identity: bold, listings-first, multi-agent agency confidence.
 * Navy + blue palette, strong grid layouts, data-forward stats.
 * Professional and direct — "We sell homes. A lot of them."
 *
 * All components:
 *  - Accept { config, theme } matching the generic section config types
 *  - Use EditableText for every static contentKey field
 *  - Render dataSource items (listings, agents) as display-only
 *  - Use Tailwind + var(--pk-*) CSS custom properties only — no shadcn
 */

import type { CSSProperties } from "react";

import { EditableText } from "../../../sections/editing-primitives";
import type {
  AgentShowcaseConfig,
  HeroSearchConfig,
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

/** Pill label above section headings */
function SectionTag({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-[color:var(--primary)]">
      {children}
    </p>
  );
}

/** Bold, left-aligned section heading with heading font */
function SectionHeading({
  tag = "h2",
  children,
  theme,
  className = "",
}: {
  tag?: "h1" | "h2" | "h3";
  children: string;
  theme: ThemeConfig;
  className?: string;
}) {
  const Tag = tag;
  return (
    <Tag
      className={`text-4xl font-bold leading-tight text-[color:var(--foreground)] md:text-5xl ${className}`}
      style={{ fontFamily: theme.headingFontFamily }}
    >
      {children}
    </Tag>
  );
}

/** Agency-style filled button */
function AgencyButton({
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
      "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-[0_6px_24px_rgba(0,0,0,0.18)] hover:opacity-90",
    outline:
      "border-2 border-[color:var(--foreground)]/20 bg-transparent text-[color:var(--foreground)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]",
    ghost: "bg-transparent text-white/90 underline-offset-4 hover:underline",
  };

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-all duration-150 ${styles[variant]}`}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// NoorHeroBannerSection
// ---------------------------------------------------------------------------
// Bold full-width navy hero. Agency credentials in the right panel.
// ---------------------------------------------------------------------------

export function NoorHeroBannerSection({
  config,
  theme,
}: {
  config: HeroBannerConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="relative overflow-hidden bg-slate-950 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Left: main content */}
          <div>
            <span className="inline-block rounded-sm bg-[color:var(--primary)]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.32em] text-[color:var(--primary)]">
              <EditableText contentKey="hero.eyebrow" value={config.eyebrow} />
            </span>

            <EditableText
              as="h1"
              className="mt-5 text-5xl font-extrabold leading-[0.95] text-white md:text-7xl"
              contentKey="hero.title"
              style={{ fontFamily: theme.headingFontFamily }}
              value={config.title}
            />

            <EditableText
              as="p"
              className="mt-6 max-w-xl text-lg leading-8 text-slate-300 md:text-xl"
              contentKey="hero.subtitle"
              value={config.subtitle}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <AgencyButton href={config.ctaHref}>
                {config.ctaText}
              </AgencyButton>
              <AgencyButton href="#contact" variant="outline">
                Talk to an agent
              </AgencyButton>
            </div>
          </div>

          {/* Right: agency credential card */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            {/* Logo */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {theme.logoUrl ? (
                <img
                  alt={theme.logo}
                  className="h-7 max-w-[140px] object-contain brightness-0 invert"
                  src={theme.logoUrl}
                />
              ) : (
                <span className="text-white">{theme.logo}</span>
              )}
              <span>{theme.market}</span>
            </div>

            {/* Credential stats */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              {[
                { label: "Properties sold", value: "600+" },
                { label: "Avg. days to close", value: "18" },
                { label: "Licensed agents", value: "30+" },
                { label: "Buyer satisfaction", value: "97%" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white/8 p-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              {theme.supportLine}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// NoorListingSpotlightSection
// ---------------------------------------------------------------------------
// 3-column card grid. Bold price, clear specs, agency CTA on each card.
// ---------------------------------------------------------------------------

export function NoorListingSpotlightSection({
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
            <SectionTag>{config.eyebrow}</SectionTag>
            <SectionHeading tag="h2" theme={theme} className="mt-2">
              {config.title}
            </SectionHeading>
          </div>
          <a
            href="/listings"
            className="shrink-0 text-sm font-semibold text-[color:var(--primary)] hover:underline"
          >
            View all listings →
          </a>
        </div>

        <p className="mt-3 max-w-2xl text-base text-[color:var(--muted-foreground)]">
          {config.description}
        </p>

        {/* Listing cards — dataSource items are display-only */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => (
            <div
              key={i}
              {...getCardProps("listing", item)}
              className="group overflow-hidden rounded-xl border border-[color:var(--border)] bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900"
            >
              {/* Image placeholder */}
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  {item.imageHint || "Property image"}
                </div>
                <span className="absolute left-3 top-3 rounded-sm bg-[color:var(--primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  For Sale
                </span>
              </div>

              <div className="p-4">
                <p className="text-xl font-bold text-[color:var(--foreground)]">
                  {item.price}
                </p>
                <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
                  {item.location}
                </p>
                {item.specs && (
                  <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                    {item.specs}
                  </p>
                )}
                <a
                  href="#contact"
                  className="mt-4 block w-full rounded-md bg-[color:var(--primary)]/10 py-2 text-center text-xs font-semibold text-[color:var(--primary)] transition-colors hover:bg-[color:var(--primary)]/20"
                >
                  Enquire about this property
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
// NoorMarketStatsSection
// ---------------------------------------------------------------------------
// Bold horizontal stat bar — large numbers in brand blue.
// ---------------------------------------------------------------------------

export function NoorMarketStatsSection({
  config,
  theme,
}: {
  config: MarketStatsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="border-y border-[color:var(--border)] bg-[color:var(--primary)] px-6 py-10 md:px-12"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid divide-y divide-white/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {config.items.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 px-6 py-6 text-center first:pt-0 last:pb-0 sm:py-4 sm:first:pt-4 sm:last:pb-4"
            >
              <p className="text-4xl font-extrabold text-white md:text-5xl">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-white/75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// NoorStoryGridSection
// ---------------------------------------------------------------------------
// Brand story: full-width heading, 3-column trust card grid.
// ---------------------------------------------------------------------------

export function NoorStoryGridSection({
  config,
  theme,
}: {
  config: StoryGridConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-slate-50 px-6 py-14 dark:bg-slate-900/50 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl">
          <SectionTag>{config.eyebrow}</SectionTag>
          <SectionHeading tag="h2" theme={theme} className="mt-3">
            {config.title}
          </SectionHeading>
          <EditableText
            as="p"
            className="mt-4 text-base leading-8 text-[color:var(--muted-foreground)] md:text-lg"
            contentKey="story.description"
            value={config.description}
          />
        </div>

        {/* Trust card grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-[color:var(--border)] bg-white p-6 dark:bg-slate-900"
            >
              {/* Accent line */}
              <div className="mb-4 h-0.5 w-8 rounded-full bg-[color:var(--primary)]" />
              <h3
                className="text-base font-bold text-[color:var(--foreground)]"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// NoorCtaBandSection
// ---------------------------------------------------------------------------
// Full-width dark navy band — bold headline, blue primary CTA.
// ---------------------------------------------------------------------------

export function NoorCtaBandSection({
  config,
  theme,
}: {
  config: CtaBandConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-slate-950 px-6 py-16 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-4xl text-center">
        <EditableText
          as="h2"
          className="text-4xl font-extrabold leading-tight text-white md:text-5xl"
          contentKey="cta.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />
        <EditableText
          as="p"
          className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400"
          contentKey="cta.body"
          value={config.body}
        />
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <AgencyButton href={config.primaryHref}>
            {config.primaryText}
          </AgencyButton>
          <AgencyButton href={config.secondaryHref} variant="ghost">
            {config.secondaryText}
          </AgencyButton>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// NoorAgentShowcaseSection
// ---------------------------------------------------------------------------
// Multi-agent grid with photo, role, and deal count.
// dataSource items are display-only — no EditableText wrappers.
// ---------------------------------------------------------------------------

export function NoorAgentShowcaseSection({
  config,
  theme,
}: {
  config: AgentShowcaseConfig;
  theme: ThemeConfig;
}) {
  const { getCardProps } = useItemOverviewTrigger();

  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <SectionTag>{config.eyebrow}</SectionTag>
          <SectionHeading tag="h2" theme={theme} className="mt-2">
            {config.title}
          </SectionHeading>
          {config.description && (
            <p className="mt-3 max-w-xl text-base text-[color:var(--muted-foreground)]">
              {config.description}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {config.items.map((agent) => (
            <div
              key={agent.id}
              {...getCardProps("agent", agent)}
              className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-white dark:bg-slate-900"
            >
              {/* Agent photo */}
              <div className="h-40 bg-slate-100 dark:bg-slate-800">
                {agent.photoUrl ? (
                  <img
                    alt={agent.name}
                    className="h-full w-full object-cover"
                    src={agent.photoUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-slate-300">
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="font-semibold text-[color:var(--foreground)]">
                  {agent.name}
                </p>
                <p className="text-xs text-[color:var(--muted-foreground)]">
                  {agent.role}
                </p>
                {agent.listings !== undefined && (
                  <p className="mt-2 text-xs font-medium text-[color:var(--primary)]">
                    {agent.listings} deals closed
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
// NoorTestimonialStripSection
// ---------------------------------------------------------------------------
// Horizontal testimonial row with bordered quote cards.
// ---------------------------------------------------------------------------

export function NoorTestimonialStripSection({
  config,
  theme,
}: {
  config: TestimonialStripConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-12 md:px-12"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-[color:var(--border)] bg-white p-6 dark:bg-slate-900"
            >
              <div className="mb-3 text-2xl font-bold text-[color:var(--primary)] opacity-40">
                &ldquo;
              </div>
              <p className="text-sm leading-7 text-[color:var(--foreground)]">
                {t.quote}
              </p>
              <div className="mt-4 border-t border-[color:var(--border)] pt-4">
                <p className="text-sm font-semibold text-[color:var(--foreground)]">
                  {t.speaker}
                </p>
                <p className="text-xs text-[color:var(--muted-foreground)]">
                  {t.role}
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
// NoorHeroSearchSection
// ---------------------------------------------------------------------------
// Listings page hero with bold headline and location search bar.
// ---------------------------------------------------------------------------

export function NoorHeroSearchSection({
  config,
  theme,
}: {
  config: HeroSearchConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-slate-950 px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-4xl text-center">
        <EditableText
          as="h1"
          className="text-4xl font-extrabold leading-tight text-white md:text-6xl"
          contentKey="hero.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />
        <EditableText
          as="p"
          className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400"
          contentKey="hero.subtitle"
          value={config.subtitle}
        />

        {/* Search bar */}
        <div className="mx-auto mt-8 flex max-w-xl gap-2">
          <select className="flex-1 rounded-l-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]">
            {config.locationOptions.map((loc) => (
              <option key={loc} value={loc} className="text-slate-900">
                {loc}
              </option>
            ))}
          </select>
          <a
            href={config.ctaHref}
            className="rounded-r-md bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            {config.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// NoorPropertyGridSection
// ---------------------------------------------------------------------------
// Full property listing grid. dataSource items are display-only.
// ---------------------------------------------------------------------------

export function NoorPropertyGridSection({
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
            <SectionTag>{config.eyebrow}</SectionTag>
            <SectionHeading tag="h2" theme={theme} className="mt-2">
              {config.title}
            </SectionHeading>
          </div>
          {config.ctaHref && config.ctaText && (
            <a
              href={config.ctaHref}
              className="hidden text-sm font-semibold text-[color:var(--primary)] hover:underline sm:block"
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
              className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover"
                    src={item.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    No image
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-sm bg-[color:var(--primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Active
                </span>
              </div>
              <div className="p-4">
                {item.price && (
                  <p className="text-xl font-bold text-[color:var(--foreground)]">
                    {item.price}
                  </p>
                )}
                <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
                  {item.location}
                </p>
                {item.specs && (
                  <p className="mt-1.5 text-xs text-[color:var(--muted-foreground)]">
                    {item.specs}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {config.ctaHref && config.ctaText && (
          <div className="mt-8 sm:hidden">
            <a
              href={config.ctaHref}
              className="text-sm font-semibold text-[color:var(--primary)] hover:underline"
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
// NoorWhyChooseUsSection
// ---------------------------------------------------------------------------
// Stat + description grid — agency trust signals.
// ---------------------------------------------------------------------------

export function NoorWhyChooseUsSection({
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
          <SectionTag>{config.eyebrow}</SectionTag>
          <SectionHeading tag="h2" theme={theme} className="mt-2">
            {config.title}
          </SectionHeading>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border-l-4 border-[color:var(--primary)] bg-white p-5 shadow-sm dark:bg-slate-900"
            >
              <p className="text-3xl font-extrabold text-[color:var(--primary)]">
                {item.stat}
              </p>
              <p
                className="mt-1 font-semibold text-[color:var(--foreground)]"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
