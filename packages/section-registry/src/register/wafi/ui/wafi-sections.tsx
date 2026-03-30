"use client";

/**
 * Wafi (Manager) family section components.
 *
 * Design identity: property manager / rental operations brand.
 * Clean, trustworthy, operations-focused.
 * Teal/green accent on white/light gray background.
 * Structured layout with data-table feel, process steps.
 * Friendly professional tone — "Hassle-free property management."
 * Tenant-friendly sections.
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

/** Clean teal label above headings */
function OperationsTag({ children }: { children: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.36em] text-teal-600 dark:text-teal-400">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-teal-600 dark:bg-teal-400"
        aria-hidden
      />
      {children}
    </p>
  );
}

/** Friendly professional heading */
function ManagerHeading({
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
      className={`font-bold leading-tight text-[color:var(--foreground)] ${className}`}
      style={{ fontFamily: theme.headingFontFamily }}
    >
      {children}
    </Tag>
  );
}

/** Rental status badge — "Available" (teal) or "Let" (slate) */
function RentalBadge({ label }: { label: "Available" | "Let" | string }) {
  const isAvailable = label === "Available";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        isAvailable
          ? "bg-teal-500 text-white"
          : "bg-slate-500/20 text-slate-600 dark:text-slate-400"
      }`}
    >
      {label}
    </span>
  );
}

/** Teal/outline button */
function ManagerButton({
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
      "bg-teal-600 text-white shadow-[0_4px_14px_rgba(13,148,136,0.28)] hover:bg-teal-500",
    outline:
      "border border-teal-600/30 bg-transparent text-teal-700 hover:border-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/20",
    ghost:
      "bg-transparent text-[color:var(--muted-foreground)] underline-offset-4 hover:text-[color:var(--foreground)] hover:underline",
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
// WafiHeroBannerSection
// ---------------------------------------------------------------------------
// Clean white hero with teal accent. Trust-forward two-column layout with
// a property management checklist on the right.
// ---------------------------------------------------------------------------

export function WafiHeroBannerSection({
  config,
  theme,
}: {
  config: HeroBannerConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="relative overflow-hidden bg-white px-6 py-14 dark:bg-[color:var(--background)] md:px-12 md:py-20"
      style={shell(theme)}
    >
      {/* Subtle teal wash top-right */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #0d9488 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          {/* Left: headline */}
          <div>
            <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
              <EditableText contentKey="hero.eyebrow" value={config.eyebrow} />
            </span>

            <EditableText
              as="h1"
              className="mt-5 text-5xl font-bold leading-tight text-slate-900 dark:text-white md:text-6xl"
              contentKey="hero.title"
              style={{ fontFamily: theme.headingFontFamily }}
              value={config.title}
            />

            <EditableText
              as="p"
              className="mt-5 max-w-xl text-lg leading-8 text-slate-500 dark:text-slate-400 md:text-xl"
              contentKey="hero.subtitle"
              value={config.subtitle}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <ManagerButton href={config.ctaHref}>
                {config.ctaText}
              </ManagerButton>
              <ManagerButton href="#services" variant="outline">
                Our services
              </ManagerButton>
            </div>

            {/* Social proof row */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <span className="text-lg text-teal-500">✓</span>
                <span className="text-xs text-slate-500">No hidden fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg text-teal-500">✓</span>
                <span className="text-xs text-slate-500">24/7 support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg text-teal-500">✓</span>
                <span className="text-xs text-slate-500">Digital reports</span>
              </div>
            </div>
          </div>

          {/* Right: management info panel */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/40">
            {/* Logo */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
              {theme.logoUrl ? (
                <img
                  alt={theme.logo}
                  className="h-7 max-w-[140px] object-contain"
                  src={theme.logoUrl}
                />
              ) : (
                <span
                  className="text-base font-bold text-slate-800 dark:text-slate-200"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {theme.logo}
                </span>
              )}
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {theme.market}
              </span>
            </div>

            {/* Management checklist */}
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              What we handle for you
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                "Tenant screening & placement",
                "Rent collection & remittance",
                "Maintenance coordination",
                "Monthly financial reporting",
                "Legal compliance & documentation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[9px] font-bold text-white">
                    ✓
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs leading-5 text-slate-400">
              {theme.supportLine}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WafiListingSpotlightSection
// ---------------------------------------------------------------------------
// Rental listing cards with "Available" / "Let" status badges.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function WafiListingSpotlightSection({
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
            <OperationsTag>{config.eyebrow}</OperationsTag>
            <ManagerHeading
              tag="h2"
              theme={theme}
              className="mt-2 text-4xl md:text-5xl"
            >
              {config.title}
            </ManagerHeading>
          </div>
          <a
            href="/rentals"
            className="shrink-0 text-sm font-semibold text-teal-600 hover:underline dark:text-teal-400"
          >
            View all rentals →
          </a>
        </div>

        <p className="mt-3 max-w-2xl text-base text-[color:var(--muted-foreground)]">
          {config.description}
        </p>

        {/* Rental cards — dataSource items are display-only */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => {
            const badge = i % 4 === 3 ? "Let" : "Available";
            return (
              <div
                key={i}
                {...getCardProps("listing", item)}
                className="group overflow-hidden rounded-xl border border-[color:var(--border)] bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                    {item.imageHint || "Property image"}
                  </div>
                  <div className="absolute left-3 top-3">
                    <RentalBadge label={badge} />
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className="text-base font-bold text-[color:var(--foreground)]"
                      style={{ fontFamily: theme.headingFontFamily }}
                    >
                      {item.title}
                    </p>
                    <p className="shrink-0 text-lg font-bold text-teal-600 dark:text-teal-400">
                      {item.price}
                    </p>
                  </div>
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
                    className="mt-4 block w-full rounded-md bg-teal-50 py-2 text-center text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/40"
                  >
                    Enquire about this rental
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WafiMarketStatsSection
// ---------------------------------------------------------------------------
// Clean white stat row — teal numbers, soft border dividers.
// ---------------------------------------------------------------------------

export function WafiMarketStatsSection({
  config,
  theme,
}: {
  config: MarketStatsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="border-y border-[color:var(--border)] bg-white px-6 py-12 dark:bg-[color:var(--background)] md:px-12"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid divide-y divide-[color:var(--border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {config.items.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 px-8 py-8 text-center sm:py-4"
            >
              <p
                className="text-4xl font-bold text-teal-600 dark:text-teal-400 md:text-5xl"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-[color:var(--muted-foreground)]">
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
// WafiStoryGridSection
// ---------------------------------------------------------------------------
// Brand story with process steps and trust points — operations-first layout.
// ---------------------------------------------------------------------------

export function WafiStoryGridSection({
  config,
  theme,
}: {
  config: StoryGridConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-slate-50 px-6 py-14 dark:bg-slate-900/30 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl">
          <OperationsTag>{config.eyebrow}</OperationsTag>
          <ManagerHeading
            tag="h2"
            theme={theme}
            className="mt-3 text-4xl md:text-5xl"
          >
            {config.title}
          </ManagerHeading>
          <EditableText
            as="p"
            className="mt-4 text-base leading-8 text-[color:var(--muted-foreground)] md:text-lg"
            contentKey="story.description"
            value={config.description}
          />
        </div>

        {/* Process step grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-[color:var(--border)] bg-white p-6 dark:bg-slate-900"
            >
              {/* Step number */}
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="text-sm font-bold text-[color:var(--foreground)]"
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
// WafiCtaBandSection
// ---------------------------------------------------------------------------
// Clean teal CTA band — centered, professional tone with two action links.
// ---------------------------------------------------------------------------

export function WafiCtaBandSection({
  config,
  theme,
}: {
  config: CtaBandConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-teal-700 px-6 py-16 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-3xl text-center">
        <EditableText
          as="h2"
          className="text-4xl font-bold leading-tight text-white md:text-5xl"
          contentKey="cta.title"
          style={{ fontFamily: theme.headingFontFamily }}
          value={config.title}
        />
        <EditableText
          as="p"
          className="mx-auto mt-5 max-w-xl text-lg leading-8 text-teal-100/80"
          contentKey="cta.body"
          value={config.body}
        />
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={config.primaryHref}
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-teal-700 transition-all hover:bg-teal-50"
          >
            {config.primaryText}
          </a>
          <a
            href={config.secondaryHref}
            className="text-sm font-medium text-teal-100/80 underline-offset-4 hover:text-white hover:underline"
          >
            {config.secondaryText}
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// WafiServiceHighlightsSection
// ---------------------------------------------------------------------------
// Property management services grid — structured, icon-led service cards.
// ---------------------------------------------------------------------------

export function WafiServiceHighlightsSection({
  config,
  theme,
}: {
  config: ServiceHighlightsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-[var(--section-bg)] px-6 py-14 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <OperationsTag>{config.eyebrow}</OperationsTag>
          <ManagerHeading
            tag="h2"
            theme={theme}
            className="mt-3 text-4xl md:text-5xl"
          >
            {config.title}
          </ManagerHeading>
          <p className="mt-3 max-w-2xl text-base text-[color:var(--muted-foreground)]">
            {config.description}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {config.items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[color:var(--border)] bg-white p-5 transition-shadow hover:shadow-md dark:bg-slate-900"
            >
              {/* Teal icon container */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-2xl text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                {item.icon}
              </div>
              <h3
                className="text-sm font-bold text-[color:var(--foreground)]"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
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
// WafiWhyChooseUsSection
// ---------------------------------------------------------------------------
// Tenant-friendly trust signals — 4-column cards with teal stat highlights.
// ---------------------------------------------------------------------------

export function WafiWhyChooseUsSection({
  config,
  theme,
}: {
  config: WhyChooseUsConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-white px-6 py-14 dark:bg-[color:var(--background)] md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <OperationsTag>{config.eyebrow}</OperationsTag>
          <ManagerHeading
            tag="h2"
            theme={theme}
            className="mt-3 text-4xl md:text-5xl"
          >
            {config.title}
          </ManagerHeading>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-2xl text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                {item.icon}
              </div>
              <p
                className="text-3xl font-bold text-teal-600 dark:text-teal-400"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.stat}
              </p>
              <p
                className="mt-1 text-sm font-semibold text-[color:var(--foreground)]"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {item.title}
              </p>
              <p className="mt-2 text-xs leading-6 text-[color:var(--muted-foreground)]">
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
// WafiPropertyGridSection
// ---------------------------------------------------------------------------
// Managed property listing grid. dataSource items are display-only.
// ---------------------------------------------------------------------------

export function WafiPropertyGridSection({
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
            <OperationsTag>{config.eyebrow}</OperationsTag>
            <ManagerHeading
              tag="h2"
              theme={theme}
              className="mt-3 text-4xl md:text-5xl"
            >
              {config.title}
            </ManagerHeading>
          </div>
          {config.ctaHref && config.ctaText && (
            <a
              href={config.ctaHref}
              className="hidden text-sm font-semibold text-teal-600 hover:underline dark:text-teal-400 sm:block"
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
              className="group overflow-hidden rounded-xl border border-[color:var(--border)] bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    No image
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-teal-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  Managed
                </span>
              </div>
              <div className="p-4">
                {item.price && (
                  <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
                    {item.price}
                  </p>
                )}
                <p
                  className="mt-1 text-sm font-semibold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
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
              className="text-sm font-semibold text-teal-600 hover:underline dark:text-teal-400"
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
// WafiTestimonialStripSection
// ---------------------------------------------------------------------------
// Tenant/landlord testimonials — clean white cards with teal accent quote.
// ---------------------------------------------------------------------------

export function WafiTestimonialStripSection({
  config,
  theme,
}: {
  config: TestimonialStripConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="bg-slate-50 px-6 py-14 dark:bg-slate-900/30 md:px-12 md:py-20"
      style={shell(theme)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.items.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-[color:var(--border)] bg-white p-6 dark:bg-slate-900"
            >
              {/* Teal top accent rule */}
              <div className="mb-4 h-0.5 w-10 rounded-full bg-teal-500" />
              <p className="text-sm leading-7 text-[color:var(--foreground)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 border-t border-[color:var(--border)] pt-4">
                <p
                  className="text-sm font-semibold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
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
// WafiAgentShowcaseSection
// ---------------------------------------------------------------------------
// Property manager team grid — professional profiles with teal accent.
// dataSource items are display-only.
// ---------------------------------------------------------------------------

export function WafiAgentShowcaseSection({
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
          <OperationsTag>{config.eyebrow}</OperationsTag>
          <ManagerHeading
            tag="h2"
            theme={theme}
            className="mt-3 text-4xl md:text-5xl"
          >
            {config.title}
          </ManagerHeading>
          {config.description && (
            <p className="mt-3 max-w-xl text-base text-[color:var(--muted-foreground)]">
              {config.description}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {config.items.map((agent) => (
            <div
              key={agent.id}
              {...getCardProps("agent", agent)}
              className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-white dark:bg-slate-900"
            >
              {/* Photo */}
              <div className="h-44 bg-slate-100 dark:bg-slate-800">
                {agent.photoUrl ? (
                  <img
                    alt={agent.name}
                    className="h-full w-full object-cover"
                    src={agent.photoUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-300 dark:text-slate-600">
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="border-t-2 border-teal-500 p-4">
                <p
                  className="font-semibold text-[color:var(--foreground)]"
                  style={{ fontFamily: theme.headingFontFamily }}
                >
                  {agent.name}
                </p>
                <p className="text-xs text-[color:var(--muted-foreground)]">
                  {agent.role}
                </p>
                {agent.listings !== undefined && (
                  <p className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {agent.listings} properties managed
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
